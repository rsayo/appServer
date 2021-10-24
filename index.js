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
    console.log(err)
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
    console.log(err)})}) // Get Albums
app.get('/api/v1/trackhistory', (req,res) => {
  let history = getFile("songs")
  res.json(history)}) // Get track history

app.get('/api/v1/playlists', (req,res) => {
  let playlists = getFile("Playlists")

  res.json(playlists)}) // get all Playlists
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
