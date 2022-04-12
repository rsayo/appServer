const express = require('express')
const app = express()
const db = require('./db.js')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const clientSessions = require('client-sessions')
const GetObjectCommand = require("@aws-sdk/client-s3").GetObjectCommand
const readStream = require("stream")
const s3Client = require("./s3Client.js").s3Client

let audioBucket = {
  Bucket: "prophile",
  Key: ""
}

const imageBucket = {
  bucket: "",
  key: ""
}

const getChunksFromStream = (stream) => {
  let chunks = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    // console.log(chunks)
    stream.on("error", (error) => console.log( error))
    stream.on("end", resolve(Buffer.concat(chunks).toString("utf8")))
  })
}

const run = async (bucketParams) => {
  try {
    const response = await s3Client.send(new GetObjectCommand(bucketParams));
    console.log(response)
    const data = await getChunksFromStream(response.Body);
    console.log(response.body)
    fs.writeFileSync("/tmp/local-file.ext", data);
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

app.set('port',process.env.PORT || 80 )

app.use(express.static('public'))
app.use(bodyParser.urlencoded( {extended: false}))
app.use(bodyParser.json())
app.use(clientSessions({
  cookieName: "session",
  secret: 'secret',
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60
}))
app.use(function(req, res, next) { res.locals.session = req.session; next();});

app.post('/api/v1/authenticate', (req,res) => {

  const agent = req.body.userAgent = req.get('user-agent')

  db.authenticate(req.body)
  .then((user) => {

    console.log("response returned ")
    console.log(user)
    if(user != undefined){

      req.session.user = {
       apiKey: uuid.v4()
      }

      let credentials = user

      console.log(credentials)
      res.json(credentials)
    }else{
      console.log("could not authenticate user")
      res.sendStatus(403)
    }
  })
  .catch((err) => {
    console.log(err)
    res.status(500)
  })
})

app.get('/api/v1/library', (req, res) => {
  console.log(req.query)
  db.GetUserLibraryData(req.query.user)
  .then( data => {
    console.log(data)
    res.json(data)
  })
  .catch( err => {
    res.sendStatus(500)
  })
})
app.get("/api/v1/home", (req,res) => {

  db.GetUserHomeData(req.query.user)
  .then( data => {
    res.json(data)
  })
  .catch( err => {
    console.log(err)
  })
})
app.get('/api/v1/album', (req,res) => {
  // console.log(req)
  db.GetAlbumDetail(req.query.albumId)
  .then(data => {
    // console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(err)
  })
  })
app.get('/api/v1/trackhistory', (req,res) => {
  let history = getFile("songs")
  res.json(history)
})
app.get('/api/v1/playlists', (req,res) => {
  let playlists = getFile("Playlists")

  res.json(playlists)
})
app.get('/api/v1/track', (req,res) => {

  let keys = Object.keys(req.query)
  console.log(keys)

  switch(keys.toString()){
    case "isRandom":

    console.log("is random")
      db.getRandomAudio()
      .then( data => {
        res.json(data)
        console.log(data)
      })
      .catch( err => { console.log(err) })
      break
    case "id":
    console.log(req.query.id)
      db.GetTrackById(req.query.id)
      .then( data => {
        // console.log(data)
        res.json(data)
      })
      .catch( err => {
        console.log(err)
      })
      break
    default:
    db.GetTracksByAlbumId(req.query.albumId)
    .then( data => {
      res.json(data)
    })
    .catch( err => {
      console.log(err)
    })
    break
  }

})
app.get('/api/v1/artist', (req,res) => {
  console.log(req.query.id)
  db.GetArtistProfile(req.query.id)
  .then( data => {
    // console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(err)
  })
})
app.get('/api/v1/search', (req,res) => {
  db.SearchWithQuery(req.query.q)
  .then( data => {
    res.json(data)
  })
  .catch( err => {
    console.log(err)
    res.sendStatus(404)
  })
})
app.get('/api/v1/search/history', (req,res) => {

  // console.log(req.query.userId)
  db.GetSearchHistory(req.query.userId)
  .then(data => {
    // console.log(data)
    if( data.length > 0){
      res.json(data)
    }
    else{ res.sendStatus(404)}
  })
  .catch( err => {
    console.log(err)
  })
})
app.get('/api/v1/user/subscriptions', (req,res) => {
  console.log(req.query)
  db.checkIfFollowing(req.query)
  .then( data => {
    if( data != null){
      res.sendStatus(data)
    }
    else{
      res.sendStatus(404)
    }
  })
  .catch( err => {
    res.sendStatus(err)
  })
})
app.get('/api/v1/user/saved', (req,res) => {
  // res.sendStatus(200)
  db.CheckIfAlbumSaved(req.query)
  .then( result => {
    console.log( result )
    res.sendStatus(result)
  })
  .catch( err => {
    res.sendStatus(500)
  })
})
app.get('/api/v1/user/savedTracks', (req,res) => {

  db.getSavedTrack(req.query.id, req.query.user)
  .then( result => {
    res.sendStatus(result)
  })
  .catch( err => { console.log( err )})

})
app.get('/api/v1/user/playlist', (req,res) => {

  if(req.query.id){
    db.getPlaylist(req.query.id, req.query.user)
    .then( response => {
      res.json(response)
    })
    .catch( err => {
      res.sendStatus(err)
    })
  }
  else{
    db.getAllPlaylistsForUser(req.query.user)
    .then( result => {
      console.log("playlist")
      res.json(result)
    })
    .catch( err => console.log( err ))
  }
})
app.get('/api/v1/user/albums', (req,res) => {
  db.getAllUserSavedAlbums(req.query.user)
  .then( result => {
    res.json( result )
  })
})
app.get('/api/v1/user/following', (req, res) => {

  db.getFollowing(req.query.user)
  .then( result => {
    console.log(result)
    res.json(result)
  })
  .catch(error => {

  })
})
app.get("/api/v1/audio", (req,res) => {
  // console.log(req.query.audio)
  audioBucket.Key = req.query.audio
  console.log(audioBucket)

  s3Client.getObject(audioBucket, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
     /*
     data = {
      AcceptRanges: "bytes",
      ContentLength: 3191,
      ContentType: "image/jpeg",
      ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
      LastModified: <Date Representation>,
      Metadata: {
      },
      TagCount: 2,
      VersionId: "null"
     }
     */
   });

  // run(audioBucket)
  // .then(( data => {
    // res.sendStatus(200)
  // }))
})

app.post('/api/v1/user/saved', (req,res) => {

  db.SaveAlbum(req.query.userId, req.body)
  .then( result => {
    res.sendStatus(result)
  })
  .catch( err => {
    console.log( err )
    res.sendStatus(500)
  })

})
app.post('/api/v1/user/savedTracks', (req,res) => {
  db.saveTrack(req.query.user, req.body)
  .then( result => {
    res.sendStatus(result)
  })
  .catch( err => {
    res.sendStatus( 500 )})
})
app.post('/api/v1/user/history', (req,res) => {
  console.log( req.body)
  db.AddItemSearchToHistory(req.body)
  .then( data => {

  })
  .catch( err => {
    console.log(err)
    res.sendStatus(500)
  })
})
app.post("/api/v1/artist", (req,res) => {
  db.createNewArtist(req.body)
  .then( () => {
    res.sendStatus(200)
  })
  .catch( err => {
    console.log(err)
    res.sendStatus(200)
  })
})
app.post('/api/v1/user/subscriptions', (req,res) => {
  db.AddNewFollower(req.query.id, req.body)
  .then( data => {
    res.sendStatus(data)
  })
  .catch( err => { console.log(err)})
})

app.delete('/api/v1/user/subscriptions', (req,res) => {
  db.UnfollowArtist(req.query.user, req.query.id)
  .then( data => {
    console.log(data)
    res.sendStatus(data)
  })
  .catch( err => {
    res.sendStatus(500)
  })
})
app.delete('/api/v1/user/saved', (req, res) => {
  console.log(req.query)
  db.RemoveAlbumFromSaved(req.query.userId, req.query.id)
  .then( result => {
    res.sendStatus(result)
  })
  .catch( err => {
    console.log( err )
    res.sendStatus(500)
  })
})
app.delete('/api/')
db.initialize()
.then( (data) => {

console.log(data)
  app.listen(process.env.PORT || 8080, () => {
    console.log(`started app on 8080`)
  })

})
.catch( err => {
  console.log(err)
})
