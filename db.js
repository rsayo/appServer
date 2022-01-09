const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const models = require('./models.js')

exports.initialize = async () => {
  try {
    mongoose.connect("mongodb+srv://rob:12358132121@cluster0.xadsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {useNewUrlParser:true})
    return "connected"
  }
  catch(error){
    throw error
  }
}
exports.registerUser = async (username, password) => {

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
exports.GetFeaturedAlbums = () => {
  return new Promise((resolve, reject) => {
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
      "items": getFile("Artist")
    }

    catalog.push(featuredArtists)

    // get Trending songs
    let trending = {
      "id": uuid.v4(),
      "type": "Trending",
      "tagline": "Top 10 Hits",
      "items": []
    }

    // Sort tracks in decending order by play count
    let tracks = getFile("songs").sort((a, b) => {
      console.log(b.playCount - a.playCount)
      console.log(a)
      return b.playCount - a.playCount
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
      "type": "New Release",
      "tagline": "Fresh Drops",
      "items": getFile("newReleases")
    }

    catalog.push(releases)

    // get featured Playlists

    let discover = {
      "id": uuid.v4(),
      "type": "Discover",
      "tagline": "Discover Something new ",
      "items" :  getFile("Discover")
    }

    catalog.push(discover)

    let playlists = {
      "id": uuid.v4(),
      "type": "Playlists",
      "tagline": "Something for every mood",
      "items": getFile("Playlists")
    }

    // catalog.push(playlists)
    // console.log(catalog)
    resolve(catalog)
  })
}
exports.GetAlbumDetail = (id) => {
  return new Promise((resolve, reject) => {
    console.log("getting albums")

      var albumDetail = []

      let trackSection = new Section()
      trackSection.type = "Tracks"

      let albumSection = new Section()
      albumSection.type = "Album"

      // let singleSection = new Section()
      // singleSection.type = "Single"


      let artistsRecommendations = new Section()
      artistsRecommendations.title = `You may also like`
      artistsRecommendations.type = "Artists"

      let artists = getFile("Artist")
      var tracks = getFile("songs")

      getFile("Albums").map((album, i) => {

          if( album.id == id){

            // confirm artist
            artists.map((artist, index) => {

              if(artist.id == album.artistId){

                trackSection.name = artist.name
                trackSection.artistImgURL = artist.imageURL
                trackSection.title = album.title
                trackSection.imageURL = album.imageURL
                trackSection.artistId= album.artistId

                albumSection.title = `More Albums`
                // singleSection.title = `Singley by ${artist.name}`

                tracks.map((item) => {
                  if(item.albumId == album.id){
                    trackSection.items.push(item)
                  }
                });
              }
            })




            getFile("Albums").map( albumitem => {
              if(album.artistId == albumitem.artistId && album.id != albumitem.id){
                console.log(albumitem.type)
                switch(albumitem.type){
                  case "Album":
                    albumSection.items.push(albumitem)
                  break;
                  // case "Single":
                  // console.log(albumitem)
                  //   singleSection.items.push(albumitem)
                  //   break;
                }
              }

            })

          }
      })

      albumDetail.push(trackSection)
      // if(albumSection.items.length > 0){
      //   albumDetail.push(albumSection)
      // }


      // if(singleSection.items.length > 0){
      //   albumDetail.push(singleSection)
      // }

      resolve(albumDetail)

  })
}
exports.GetUserTrackHistory =() => {
  return new Promise((resolve, reject) => {
    let history = getFile("songs")
    resolve(history)
  })
}
exports.GetTracks = (id) => {
  return new Promise((resolve, reject) => {
    let tracks = getFile('songs')
    // console.log(tracks)
    resolve()
  })
}
exports.getAudioTrack = (track) => {
  return new Promise((resolve, reject) => {
    console.log("playing track", track)
    let audio = getAudioFile(track)
    console.log(audio)

    resolve(audio)
  })
}
exports.getRandomAudio = () => {
  return new Promise( (resolve, reject) => {
    let tracks = getFile("songs")
    // console.log(tracks)
    let randomTrack = tracks[getRandom(tracks.length)]
    // console.log(getRandom(tracks.length))
    resolve(randomTrack)

    // let audio = getAudioFile(randomTrack.audioURL)

    resolve(audio)


  // console.log(rand(10))
  })
}
exports.GetArtistProfile = (id) => {
  return new Promise((resolve, reject) => {
    let collection = []
    let header = new ProfileSection()
    let topTracks = new ProfileSection()
    let albums = new ProfileSection()
    let singles = new ProfileSection()
    let artists = new ProfileSection()

    // Configure header
    header.type = "Header"
    getFile("Artist").map((artist) => {
      if(artist.id == id){

        let detail =  new ProfileItem()

        detail.id = uuid.v4()
        detail.title = ""
        detail.name = artist.name
        detail.imageURL = artist.imageURL
        detail.followers = artist.followers
        detail.listeners = artist.listeners
        // detail.bio = artist.bio
        // detail.isVerified = artist.isVerified

        header.items.push(detail)

        // get tracks matching artist id
        let tracks = getFile("songs")
        let matchedTracks = []

        tracks.map( (track) => {
          if(track.artistId == id){
            matchedTracks.push(track)
          }
        })

        // sort tracks by playcount
        matchedTracks.sort((a, b) => {
          return b.playCount - a.playCount
        })

        // console.log(matchedTracks)

        topTracks.id = uuid.v4()
        topTracks.type = "Tracks"
        topTracks.tagline = "Top Tracks"

        matchedTracks.forEach((track, i) => {
          if(i < 5){
            topTracks.items.push(track)
          }
        })

        albums.id = uuid.v4()
        albums.type = "Albums"
        albums.tagline = `New Releases by ${artist.name}`


        getFile("Albums").map( album => {
          if(album.artistId == id && album.type == "Album"){
             albums.items.push(album)
             // console.log(album)
          }
        })

        // console.log(albums)

        singles.id = uuid.v4()
        singles.type = "Singles"
        singles.tagline = "Some Loosies"

        getFile("Albums").map( album => {
          if(album.artistId == id && album.type == "Single"){
            singles.items.push(album)
          }
        })

        artists.id = uuid.v4()
        artists.type = "Artist"
        artists.tagline = "Followers also listent to"

        getFile("Artist").map( artist => {
          artists.items.push(artist)
        })

        collection.push(header)
        collection.push(topTracks)
        console.log(albums.items.count)
        if(albums.items.length > 0 ) {collection.push(albums)}
        if(singles.items.length > 0) {collection.push(singles)}
        collection.push(artists)

        resolve(collection)
      }
    })
  })
}
exports.GetTrackById = (id) => {
  return new Promise((resolve, reject) => {
    // let track

    getFile('songs').map((track) => {
      if(track.id == id){
          // console.log("Track", track)
            resolve(track)
      }
    })
  })
}
exports.GetUserHomeData = () => {
  return new Promise((resolve, reject) => {
    let section = []

    let historySection = new Section()
    historySection.type = "History"
    historySection.tagline = "Recent Spins"
    historySection.items = getFile("trackhistory")

    section.push(historySection)

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

    section.push(recentAlbums)

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
exports.GetSearchHistory = async () => {
  let history = getFile('searchHistory')
  return history
}

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

function Section(){
  this.id = uuid.v4(),
  this.type = null,
  this.tagline = null,
  this.title = null,
  this.name = null,
  this.artistId = null,
  this.artistImgURL = null,
  this.imageURL = null,
  this.items = []
}
function AlbumSection(){
  this.id = uuid.v4(),
  this.type = "",
  this.artist = "",
  this.title = "",
  this.artistImgURL = "",
  this.imageURL = "",
  this.items = []
}
function ProfileSection(){
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

function getRandom(max){
  return Math.floor(Math.random() * max)
}
