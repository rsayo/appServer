const express = require('express')
const app = express()
const db = require('./dbconnect.js')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

app.set('port',process.env.PORT || 8080 )
app.use(express.static('public'))
app.use(bodyParser.urlencoded( {extended: false}))
app.use(bodyParser.json())

function Section(){
  this.id = uuid.v4(),
  this.type = null,
  this.artist = null,
  this.title = null,
  this.artistImgURL = null,
  this.imageURL = null,
  this.items = []
}

app.get("/api/v1/", (req,res) => {
  console.log("path reached")
  let catalog = []

  // Get featured slbums

  let featured = {
    "id": uuid.v4(),
    "type": "Featured",
    "tagline": "In the Spotlight",
    "items": getFile("FeaturedAlbums")
  }

  catalog.push(featured)

  // get rising artists

  let featuredArtists = {
    "id": uuid.v4(),
    "type": "Artists",
    "tagline": "On the Rise",
    "items": getFile("FeaturedArtists")
  }

  catalog.push(featuredArtists)

  // get Track History
  // Note: This is a db call

  let history = {
    "id": uuid.v4(),
    "type": "History",
    "tagline": "Recent Spins",
    "items": getFile("trackHistory")
  }

  catalog.push(history)

  // get Trending songs
  let trending = {
    "id": uuid.v4(),
    "type": "Trending",
    "tagline": "Top 10 Hits",
    "items": []
  }

  // Sort tracks in decending order by play count
  let tracks = getFile("songs").sort((a, b) => {
    return b.PlayCount - a.PlayCount
  })

  // add tracks up to 10 to trending Object
  for (let i in tracks){
    if(i < 10){
      trending.items.push(tracks[i])
    }
    i++
  }

  catalog.push(trending)
  // console.log(catalog)

  // get new releases

  let releases = {
    "id": uuid.v4(),
    "type": "Release",
    "tagline": "Fresh Drops",
    "items": getFile("newReleases")
  }

  catalog.push(releases)

  // get featured Playlists

  let playlists = {
    "id": uuid.v4(),
    "type": "Playlists",
    "tagline": "something for every mood",
    "items": getFile("Playlists")
  }

  catalog.push(playlists)


  res.json(catalog)

})

app.get('/api/v1/album', (req,res) => {
  console.log("getting albums")
  let keys = Object.keys(req.query)
  // console.log(keys.toString())

  function AlbumSection(){
    this.id = uuid.v4(),
    this.type = "",
    this.artist = "",
    this.title = "",
    this.artistImgURL = "",
    this.imageURL = "",
    this.items = []
  }

    var albumDetail = []

    let trackSection = new Section()
    trackSection.type = "Tracks"

    let albumSection = new Section()
    albumSection.type = "Album"

    let singleSection = new Section()
    singleSection.type = "Single"


    let artistsRecommendations = new Section()
    artistsRecommendations.title = `You may also like`
    artistsRecommendations.type = "Artists"

    let artists = getFile("Artist")
    var tracks = getFile("songs")
    var albums = getFile("Albums")

    console.log(req.query.albumId)

    albums.map((album, i) => {

      // console.log("query", req.query.albumId)
      // console.log(album.id == req.query.albumId)

        if( album.id == req.query.albumId){

          // confirm artist
          artists.map((artist, index) => {
            // console.log(artist.id == album.artistId)
            if(artist.id == album.artistId){

              console.log(artist.name)
              trackSection.artist = artist.name
              trackSection.artistImgURL = artist.imageURL
              trackSection.title = album.title
              trackSection.imageURL = album.imageURL

              tracks.map((item) => {
                if(item.albumId == album.id){
                  trackSection.items.push(item)
                }
              });

              // configure album section
              albumSection.artist = artist.name
              albumSection.title = `Other Albums from ${artist.name}`

              // configure singles section
              singleSection.title = `Single from ${artist.name}`
              singleSection.artist = artist.name

              albums.map((item) => {
                if(item.artistId == artist.id && item.id != album.id){

                  if(item.type == "Single"){
                    singleSection.items.push(item)
                  }else{
                    albumSection.items.push(item)
                  }
                }
              })

              // configure artist Section
              artistsRecommendations.artist = artist.name
              artistsRecommendations.items = artists
            }
          })
        }
    })


    albumDetail.push(trackSection)

    if(albumSection.items.length != 0){ albumDetail.push(albumSection)}
    if(singleSection.items.length != 0){ albumDetail.push(singleSection)}

    albumDetail.push(artistsRecommendations)
    // console.log(albumDetail)

    res.json(albumDetail)
    // res.json(albums)

    // console.log(req.query)
  // }
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

let keys = Object.keys(req.query)
console.log("track route")
console.log(keys.toString())
switch(keys.toString()){
  case "trackId":
  console.log("Album",keys.toString())
    getFile('songs').map((track) => {
      if(track.Id == req.query.trackId){
          console.log("Track", track)
            res.json(track)
      }
    })
  break;

  default:
    let tracks = []

    getFile('songs').map((track, id) => {
      if(track.AlbumId == req.query.albumId){
            tracks.push(track)
      }
    })

    console.log(tracks)
    res.json(tracks)
  }
})
app.get('/api/v1/user', (req,res) => {
  console.log(req.query.user)
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
