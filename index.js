const express = require('express')
const app = express()
const db = require('./db.js')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const clientSessions = require('client-sessions')

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
       userId: user.id,
       username: user.username,
       apiKey: uuid.v4()
      }

      let credentials = req.session.user

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
  db.GetUserLibraryData(req.query.user)
  .then( data => {
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
      .catch( err => {
        console.log(err)
      })
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
  db.GetSearchHistory()
  .then(data => {
    console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(err)
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
