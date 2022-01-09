const express = require('express')
const app = express()
const db = require('./db.js')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const clientSessions = require('client-sessions')

app.set('port',process.env.PORT || 8080 )

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
    if(user != undefined){

      req.session.user = {
       username: user.username,
       apiKey: uuid.v4()
      }

      let credentials = req.session.user

      console.log(credentials)
      res.json(credentials)
    }else{
      console.log("could not authenticate user")
      res.send(403)
    }
  })
  .catch((err) => {
    console.log(err)
    res.status(400)
  })
})

app.get("/api/v1/browse", (req,res) => {
  // console.log("path reached")
  // let date = new Date()
  // console.log(`${date.getDay()}/${date.getMonth()}/${date.getYear()} `)

  db.GetFeaturedAlbums()
  .then( data => {
    console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(err)
  })
})
app.get("/api/v1/home", (req,res) => {
  db.GetUserHomeData()
  .then( data => {
    console.log("")
    res.json(data)
  })
  .catch( err => {
    console.log("")
    res,json(err)
  })
})
app.get('/api/v1/album', (req,res) => {

  db.GetAlbumDetail(req.query.albumId)
  .then(data => {
    console.log(data)
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
  // console.log(req.query.audioURL)
  let keys = Object.keys(req.query)
  console.log(keys)

  switch(keys.toString()){
    case "audioURL":
      db.getAudioTrack(req.query.audioURL)
      .then( data => {
        console.log(data)
        res.send(data)
      })
      .catch( err => {
        console.log(err)
      })
      // console.log("audio")
    case "isRandom":

      db.getRandomAudio()
      .then( data => {
        res.json(data)
        // console.log(data)
      })
      .catch( err => {
        console.log(err)
      })
    case "id":
    // console.log(req.query.id)
      db.GetTrackById(req.query.id)
      .then( data => {
        // console.log(data)
        res.json(data)
      })
      .catch( err => {
        console.log(err)
      })
    default:
    db.GetTracks()
    .then( data => {
      res.json(data)
    })
    .catch( err => {
      console.log(err)
    })
  }

})
app.get('/api/v1/artist', (req,res) => {
  console.log(req.query.id)
  db.GetArtistProfile(req.query.id)
  .then( data => {
    console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(err)
  })
})
app.get('/api/v1/image', (req,res) => {
  console.log(req.query.image)
})
app.get('/api/v1/search', (req,res) => {
  console.log(req.query)
})
app.get('/api/v1/search/history', (req,res) => {
  db.GetSearchHistory()
  .then(data => {
    console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(err)
  })
})

db.initialize()
.then( (data) => {

console.log(data)
  app.listen(app.get("port"), () => {
    console.log(`started app on 8080`)
  })

})
.catch( err => {
  console.log(err)
})
