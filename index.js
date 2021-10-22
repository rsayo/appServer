const express = require('express')
const app = express()
const db = require('./db.js')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

app.set('port',process.env.PORT || 8080 )
app.use(express.static('public'))
app.use(bodyParser.urlencoded( {extended: false}))
app.use(bodyParser.json())

app.get("/api/v1/", (req,res) => {
  console.log("path reached")

  db.GetFeaturedAlbums()
  .then( data => {
    console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(data)
  })
})
app.get('/api/v1/album', (req,res) => {
  console.log("getting albums")

  db.GetAlbumDetail(req.query.albumId)
  .then(data => {
    console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(err)
  })
  }) // Get Albums
app.get('/api/v1/trackhistory', (req,res) => {
  let history = getFile("songs")
  res.json(history)
}) // Get track history

app.get('/api/v1/playlists', (req,res) => {
  let playlists = getFile("Playlists")

  res.json(playlists)
}) // get all Playlists
app.get('/api/v1/tracks', (req,res) => {
  console.log(req.quert.albumId)
  db.GetAlbumDetail(req.query.albumId)
  .then( data => {
    console.log(data)
  })
  .catch( err => {
    console.log(err)
  })
})
app.get('/api/v1/artist:id', (req,res) => {
  console.log(req.params.id)
  db.GetArtistProfile(req.params.id)
  .then( data => {
    console.log(data)
    res.json(data)
  })
  .catch( err => {
    console.log(err)
  })
})

app.listen(app.get("port"), () => {
  console.log(`started app on 8080`)
})

function getFile(file){

  let data = fs.readFileSync(path.join(__dirname + "/data/" + file +".json"), (data, err) => {

    if( err ){
      console.log(err)
      return err
    }

    return data
  })
  return JSON.parse(data)
}


//
// app.get('/', (req,res) => {
//   res.send("Home")
// })
// app.get('/profile', (req,res) => {
//   db.getUser(id)
//   .then( data => res.json(data))
//   .catch( err => res.json(err))
// })
//
// // Tour Routes
// app.get('/tours', (req,res) => {
//   let key = Object.keys(req.query)
//   switch(key.toString()){
//     case "city":
//     db.getTourByCity(req.query.city)
//     .then(data => res.send(data))
//     .catch( err => console.log(err) )
//     break;
//     case "month":
//       db.getToursByMonth(req.query.month)
//       .then( data => res.json(data))
//       .catch(err => res.json(err))
//     break;
//     case "year":
//     db.getToursByYear(req.query.year)
//     .then( data => console.log(data))
//     .catch(err => console.log(err))
//     break;
//     case "venue":
//       db.getTourByVenue(req.query.venue)
//       .then( data => console.log(data))
//       .catch( err => console.log(err))
//   default:
//   db.getAllTours()
//   .then( data => res.json(data))
//   .catch( err => res.send(err))
//   }
// })
// app.get('/tours/:id', (req,res) => {
//   db.getToursById(req.params.id)
//   .then(data => res.json(data) )
//   .catch(err => res.json(err)  )
// })
// app.get("/locations", (req,res) => {
//   db.getLocations()
//   .then(data => res.json(data))
//   .catch(err => res.json(err))
// })
// app.get('/locations/:id', (req,res) => {
//   db.getToursByLocationId(req.params.id)
//   .then(data => {
//     res.json(data)
//   })
//   .catch(err => {
//     res.json(err)
//   })
// })
//
// // Artist Routes
// app.get('/user', (req,res) => {
//   db.getUsers()
//   .then( data => res.json(data))
//   .catch( err => res.json(err))
// })
// app.get('/user/:id', (req,res) => {
//   db.getUserById(req.params.id)
//   .then( data => res.json(data))
//   .catch( err => res.json(err))
// })
//
// db.initializeDb()
// .then(
//   app.listen(app.get('port'), () => {
//     console.log(`App started on ${app.get('port')}`)
//   })
// )
