const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const models = require('./data/models.js')


// function Section(){
//   this.id = uuid.v4(),
//   this.type = null,
//   this.tagline = null,
//   this.title = null,
//   this.name = null,
//   this.artistId = null,
//   this.artistImgURL = null,
//   this.imageURL = null,
//   this.items = []
// }
function AlbumSection(){
  this.id = uuid.v4(),
  this.type = "",
  this.artist = "",
  this.title = "",
  this.artistImgURL = "",
  this.imageURL = "",
  this.items = []
}
function Section(){
  this.id = uuid.v4(),
  this.type = null,
  this.tagline = null,
  // this.imageURL = null,
  this.items = []
}
function ProfileItem(){
  this.id = uuid.v4(),
  this.title = null,
  this.artist = null,
  this.artistId = null,
  this.albumId = null,
  this.imageURL = null,
  // this.followers = null,
  // this.listeners = null,
  this.bio = null,
  this.dateJoined = null,
  this.playCount = null
}

function getRandomNumber() {
  let random = Math.random(1000000) * 1000000
  let num = Math.floor(random)
  return num
}
exports.initialize = async () => {
  try {
    mongoose.connect("mongodb+srv://rob:12358132121@cluster0.xadsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {useNewUrlParser:true})

  // let date = new Date()
  // console.log(date)

  getFile("Artist").map( item => {
    // console.log(item)
    let track = new models.Track
    track.id = item.id
    track.trackNum = item.trackNum
    track.genre = item.genre
    track.type = item.type
    track.title = item.title
    track.artistId = item.artistId
    track.name = item.name
    track.imageURL = item.imageURL
    track.audioURL = item.audioURL
    track.albumId = item.albumId
    track.playCount = getRandomNumber()

    // track.save()

    let artist = new models.Artist
    artist.id = item.id
    artist.name = item.name
    artist.imageURL = item.imageURL
    artist.isVerified = item.isVerified
    artist.joinDate = new Date()
    artist.subscribers = getRandomNumber()

    // artist.save()

    let albums = new models.Album
    albums.id = item.id
    albums.type = item.type
    albums.title = item.title
    albums.name = item.name
    albums.artistId = item.artistId
    albums.imageURL = item.imageURL
    albums.releaseDate = new Date()

    // albums.save()

    // track.save()
    // console.log(track)
  })
    return "connected"
  }
  catch(error){
    throw error
  }
}
exports.registerUser = async (username, password) => {

}

exports.GetUserHomeData = () => {
  return new Promise((resolve, reject) => {
    let section = []

    let historySection = new Section()
    historySection.type = "History"
    historySection.tagline = "Recent Spins"
    historySection.items = getFile("trackhistory")

    // section.push(historySection)

    let recentAlbums = new Section()
    recentAlbums.type = "Albums"
    recentAlbums.tagline = "Jump back into..."

    let playedAblums = []
    getFile("trackhistory").map( track => {
      getFile("Albums").map( item => {

        if(track.albumId == item.id){
          // console.log(item)
          playedAblums.push(item)

        }

      })
    })

    recentAlbums.items = playedAblums

    // section.push(recentAlbums)

    // let playlistSection = new Section()
    // playlistSection.type = "Playlists"
    // playlistSection.tagline = "Your playlists"
    //
    // playlistSection.items = getFile("Playlists")
    //
    // section.push(playlistSection)

    let albumRecommendation = new Section()

    albumRecommendation.type = "Album"
    albumRecommendation.tagline = "You may also like"
    albumRecommendation.items = getFile("Discover")

    section.push(albumRecommendation)

    console.log(section)
    resolve(section)
  })
}

exports.authenticate = async (credentials) => {
  console.log("Authenticating user...")
  // console.log(credentials.username.toLowerCase())
  let response = await models.User.findOne({username: credentials.username.toLowerCase()})
  .exec()
  .then( user => {
    if(user.password == credentials.password){
      return user
    }else{
      return
    }
  })
  .catch(err => {
    throw err
  })

  return response
}
exports.GetFeaturedAlbums = async() => {
    let catalog = []

    let artistSection =  new Section
    artistSection.id = uuid.v4()
    artistSection.type = "Artists",
    artistSection.tagline = "Discover New"

    let artists = await models.Artist.find()
    .limit(10)
    .exec()
    .then( data => {
      console.log("Artists")
      if( data != null && data.length > 0){
        // console.log(data
        return data
        // catalog.push(artistSection)
        // console.log(artistSection)
      }
      else{
        return
      }
      // console.log(data)
    })
    .catch( err => { return err  })

    artistSection.items = artists
    catalog.push(artistSection)

    let trending = new Section
    trending.id = uuid.v4(),
    trending.type =  "Trending"
    trending.tagline = "Top 10 Hits"

    let tracks = await models.Track.find()
    .sort({playCount: -1})
    .limit(10)
    .exec()
    .then( data => {
      if(data != null && data.length > 0){
        console.log(data)
        return data
      }
    })
    .catch( err => {
      console.log(err)
    })

    trending.items = tracks
    catalog.push(trending)

    let releases = new Section
    releases.id = uuid.v4()
    releases.type = "New Release"
    releases.tagline =  "Fresh Drops"

    let albums = await models.Album.find()
    .sort({releaseDate: -1})
    .limit(5)
    .exec()
    .then( data => {
      if( data != null && data.length > 0){
        releases.items = data
        catalog.push(releases)
      }
      else{ return }
    })
    .catch( err => { return err})

    let discover = {
      "id": uuid.v4(),
      "type": "Discover",
      "tagline": "Discover Something new ",
      "items" :  getFile("Discover")
    }
    //
    catalog.push(discover)

    let playlists = new Section
    playlists.id = uuid.v4()
    playlists.type =  "Playlists"
    playlists.tagline =  "Something for every mood"

    models.Playlist.find({isPrivate: false})
    .limit(5)
    .exec()
    .then( data => {

      console.log(data)
      if(data != null && data.length > 0){
        playlists.items =  data
        catalog.push(playlists)
      }
      else{ return }
    })

    return catalog
}
exports.GetAlbumDetail = async(id) => {
//
      var albumDetail = []

      let album = await models.Album.findOne({id: id})
      .exec()
      .then( data => {
        if(data != null){
          return data
        }
        else{ return }
      })
      .catch( err => { return err})

      let artist = await models.Artist.findOne({id: album.artistId})
      .exec()
      .then( data => {
        if(data != null){
          return data
        }
        else{ return }
      })
      .catch( err => { return err})

      let albumSection = new Section
      albumSection.type = "Tracks"
      albumSection.name = artist.name
      albumSection.artistImgURL = artist.imageURL
      albumSection.title = album.title
      albumSection.imageURL = album.imageURL
      albumSection.artistId= album.artistId
      albumSection.releaseDate = album.releaseDate


      await models.Track.find({artistId: artist.id, albumId: album.id})
      .exec()
      .then( data => {
        if(data != null && data.length > 0){
          albumSection.items = data
          return data
        }
        else {
          return
        }
      })
      .catch( err => { return err})

      albumDetail.push(albumSection)

      // console.log(trackSection)
      return albumDetail

}
// exports.GetUserTrackHistory =() => {
//   return new Promise((resolve, reject) => {
//     let history = getFile("songs")
//     resolve(history)
//   })
// }
// exports.GetTracksByAlbumId = async (id) => {
//
//   let response = await models.Track.find({albumId: id})
//   .exec()
//   .then( data => {
//     if( data != null){
//       return data
//     }
//     else{
//       throw "no tracks found with album id"
//     }
//
//   })
//   .catch( err => {
//     return err
//   })
//   return response
// }
// exports.getAudioTrack = (track) => {
//   return new Promise((resolve, reject) => {
//     console.log("playing track", track)
//     let audio = getAudioFile(track)
//     console.log(audio)
//
//     resolve(audio)
//   })
// }
// exports.getRandomAudio = () => {
//   return new Promise( (resolve, reject) => {
//     let tracks = getFile("songs")
//     // console.log(tracks)
//     let randomTrack = tracks[getRandom(tracks.length)]
//     // console.log(getRandom(tracks.length))
//     resolve(randomTrack)
//
//     // let audio = getAudioFile(randomTrack.audioURL)
//
//     resolve(audio)
//
//
//   // console.log(rand(10))
//   })
// }
exports.GetArtistProfile = async (id) => {
  console.log("id", id)
    let collection = []
    let header = new Section
    let topTracks = new Section
    let albums = new Section
    let singles = new Section()
//     let artists = new Section()
//
//     // Configure header
    header.type = "Header"
//
//     // Get Artist information for header

    let artist = await models.Artist.findOne({id: id})
    .exec()
    .then( data => {

      if(data != null){
        header.items = [data]
        collection.push(header)
        return data
      }
      else{
        throw "Artist not found"
      }

    })
    .catch( err => {
      return err
    })

//     // Get Popular tracks from artist
    await models.Track.find({artistId: id})
    .sort({playCount: -1})
    .limit(5)
    .exec()
    .then( data => {

      if( data != null){

        topTracks.type = "Tracks"
        topTracks.tagline = "Popular"
        topTracks.items = data

         console.log(data)
         collection.push(topTracks)


      }
      else{
        throw "no tracks found for artist"
      }
    })
    .catch( err => { return err })
//
//     // Get Albums from artist
    await models.Album.find({artistId: id})
    .exec()
    .then( data => {
        if(data != null && data.length > 0){
          albums.type = "Albums"
          albums.tagline = `New Releases by ${artist.name}`
          albums.items = data

          collection.push(albums)

          return
        }
        else{
          throw "no albums"
        }
    })
    .catch( err => { return err})

    return collection
}
// exports.GetTrackById = async (id) => {
//   let response = await models.Track.findOne({id: id})
//   .exec()
//   .then( data => {
//     if(data != null){
//       console.log("found one")
//       return data
//     }
//     else{
//       throw "could not find track"
//     }
//   })
//   .catch( err => {
//     return err
//   })
//
//   return response
// }
//
exports.GetSearchHistory = async () => {
  let history = getFile('searchHistory')
  return history
}
//
// exports.createNewArtist = async (data) => {
//
// console.log(data.id)
//   let response = models.Artist.findOne({id: data.id})
//   .exec()
//   .then( found => {
//     console.log(found)
//     if( found === null){
//       console.log("no artist of id found")
//
//       let artist = new models.Artist
//       artist.id = data.id
//       artist.name = data.name
//       artist.imageURL = data.imageURL
//       artist.isVerified = data.isVerified
//       artist.followers = data.listeners
//
//
//       artist.save()
//       .then( success => {
//         console.log("added new document")
//         return
//       })
//       .catch( err => {
//         console.log("could not add new document due to error: ")
//         throw err
//       })
//
//     }
//     else{
//       throw "Artist Exists"
//     }
//     return
//   })
//   .catch( err => {
//     throw err
//   })
//
//   return response
// }

function getAudioFile(file){
  let audio = fs.readFileSync(path.join(__dirname + "/data/audio/" + file + ".mp3"), (data, err) => {
    console.log(data)
    if(data){
    //   console.log( "Track:", track)
      return data
    }else{
      return("Could not load file")
    }
  })

  return audio
}
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

function getRandom(max){
  return Math.floor(Math.random() * max)
}
