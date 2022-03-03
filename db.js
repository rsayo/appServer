const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const models = require('./data/models.js')

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
  this.items = []
}
function ProfileHeader(){
  this.id = uuid.v4(),
  this.type = null
  this.name = null,
  this.artistId = null,
  this.imageURL = null,
  this.bio = null,
  this.joinDate = null,
  this.subscribers = null,
  this.isVerified = null,
  this.items = []
}

function getRandomNumber() {
  let random = Math.random(1000000) * 1000000
  let num = Math.floor(random)
  return num
}

exports.initialize = async() => {
  try {
    mongoose.connect("mongodb+srv://rob:12358132121@cluster0.xadsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {useNewUrlParser:true})

  // let date = new Date()
  // console.log(date)

  let userId = uuid.v4()

  let user = new models.User
  user.id = userId
  user.username = "robert.299@hotmail.com"
  user.password = "12341234"
  user.email = "robert.299@hotmail.com"
  user.joinDate = new Date()

  // user.save()

  getFile("FeaturedAlbums").map( item => {
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


    let history = new models.History
    history.id = uuid.v4()
    history.userId = "4f975b33-4c28-4af8-8fda-bc1a58e13e56"
    history.type = item.type
    history.genre = item.genre
    history.title = item.title
    history.name = item.name
    history.imageURL = item.imageURL
    history.audioURL = item.audioURL
    history.albumId = item.albumId
    history.artistId = item.artistId
    history.timestamp = new Date()

    // history.save()
    // track.save()

    let artist = new models.Artist
    artist.id = item.id
    artist.type = item.type
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

    let featured = new models.Featured
    featured.id = item.id
    featured.type = item.type
    featured.title = item.title
    featured.artist = item.artist
    featured.imageURL = item.imageURL

    // featured.save()

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
exports.registerUser = async(username, password) => {

}

exports.GetUserLibraryData = async(id) => {
  // return new Promise((resolve, reject) => {
    let section = []

    let user = await models.User.findOne({id: id})
    .exec()
    .then( result => {
      return result
    })
    .catch( err => { return err })

    console.log(user)

    let artists = new Section
    artists.id = uuid.v4()
    artists.type = "Artists"
    artists.tagline = "Your Artists"
    artists.items = user.following

    artists.items.length > 0 ? section.push(artists) : null

    let history = new Section
    history.id = uuid.v4()
    history.type = "History"
    history.tagline = "Recent Tracks"
    history.items = user.listeningHistory

    history.items > 0 ? section.push(history) : null

    let playlists = new Section
    playlists.id = uuid.v4()
    playlists.type = "Playlist"
    playlists.tagline = "Your playlists"
    playlists.items = user.playlists
    playlists.items.length > 0 ? section.push(playlists) : null

    let savedAlbums = new Section
    savedAlbums.id = uuid.v4()
    savedAlbums.type = "Saved Albums"
    savedAlbums.tagline = "Jump back into"
    savedAlbums.items = user.albums
    savedAlbums.items.length > 0 ? section.push(savedAlbums) : null

    let savedTracks = new Section
    savedTracks.id = uuid.v4()
    savedTracks.type = "Saved Tracks"
    savedTracks.tagline = "Songs you like"
    // savedTracks.items = user.saved

    savedTracks.items.length > 0 ? section.push(savedTracks) : null

    let releases = new Section
    releases.id = uuid.v4()
    releases.type = "New Release"
    releases.tagline =  "Fresh Drops for you"

    await models.Album.find()
    .sort({releaseDate: -1})
    .limit(5)
    .exec()
    .then( data => {
      if( data != null && data.length > 0){
        releases.items = data
        section.push(releases)
      }
      else{ return }
    })
    .catch( err => { return err})


    console.log(playlists)
    return section
}
exports.authenticate = async(credentials) => {
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
exports.GetUserHomeData = async(id) => {
    let catalog = []

    let featured = new Section
    featured.id = uuid.v4()
    featured.type = "Featured"
    featured.tagline = "New & Hot"

    await models.Featured.find()
    .exec()
    .then( data => {
      if( data != null && data.length > 0){
        featured.items = data
        catalog.push(featured)
        return
      }
      else{ return }
    })
    .catch( err => { return err })

    let trending = new Section
    trending.id = uuid.v4(),
    trending.type =  "Trending"
    trending.tagline = "Top 10 on Queue"

    await models.Track.find()
    .sort({playCount: -1})
    .limit(10)
    .exec()
    .then( data => {
      if(data != null && data.length > 0){
        // console.log(data)
        trending.items = data
        catalog.push(trending)

        return
      }
      else { return }
    })
    .catch( err => { console.log( err)})

    let artistSection =  new Section
    artistSection.id = uuid.v4()
    artistSection.type = "Artists",
    artistSection.tagline = "Hot & Fresh"

    await models.Artist.find()
    .limit(10)
    .exec()
    .then( data => {
      // console.log("Artists")
      if( data != null && data.length > 0){
        artistSection.items = data
        catalog.push(artistSection)

        return
      }
      else{ return }
      // console.log(data)
    })
    .catch( err => { return err  })

    console.log("Artist", artistSection.items)

    let albumSection = new Section
    albumSection.type = "Albums"
    albumSection.tagline = "Jump back into"

    await models.History.find({userId: id, type: "Album"})
    .sort({timestamp: -1})
    .limit(5)
    .exec()
    .then( data => {
      if(data != null && data.length > 0){
        albumSection.items = data
        catalog.push(albumSection)
        return
      }
      else { return }
    })
    .catch( err => { return err })

    let discover = {
      "id": uuid.v4(),
      "type": "Discover",
      "tagline": "Discover ",
      "items" :  getFile("Discover")
    }

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
      albumSection.id = album.id
      albumSection.type = "Album"
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

      albumDetail.push("Album:", albumSection)

      console.log(albumSection.items)
      return albumSection

}
exports.GetUserTrackHistory = async() => {

  let history = await models.History.find({userId: id})
  .exec()
  .then( data => {
    if( data != null && data.length > 9){
        return data
    }
    else{ retrun }
  })
  .catch( err => { return err})

  return history
}
exports.PostSubscription = async() => {

}
exports.SearchWithQuery = async(q) => {

  let collection = []

  let query = new RegExp(q)

  await models.Track.find({title: {$regex: query, $options: "m" }})
  .then( data => {
    // console.log(data);
    if( data != null && data.length > 0){
      // console.log(data);

      // collection.push(data)
      data.forEach( ( item ) => {
        collection.push(item)
      })

      return
    }
    else{ return }
  })
  .catch( err => { return err })

  await models.Album.find({title: {$regex: query, $options: "m"}})
  .exec()
  .then( data => {
    if(data != null && data.length > 0){

      data.forEach( item => {
        collection.push(item)
      })
      return
    }
  })
  .catch( err => { return err })

  await models.Artist.find({name: {$regex: query, $options: "m"}})
  .exec()
  .then( data => {
    if( data != null && data.length > 0){
      data.forEach( item => {
        collection.push(item)
      })
      return
    }
    else{ return }
  })
  .catch( err => { return err})

  return collection
}

exports.getRandomAudio = async() => {
  // return new Promise( (resolve, reject) => {
    let track = models.Track.find()
    .exec()
    .then( data => {
      if( data != null && data.length > 0){
        return data[getRandom(data.length)]
      }
      else{ return }
    })
    .catch( err => { return err})

console.log( track)
    return track
}
exports.GetArtistProfile = async (id) => {

  // console.log("id", id)

    let header = new ProfileHeader
    let topTracks = new Section
    let albums = new Section
    let singles = new Section

    header.type = "Header"

    await models.Artist.findOne({id: id})
    .exec()
    .then( data => {

      if(data != null){

        header.type = data.type
        header.name = data.name
        header.artistId = data.id
        header.imageURL = data.imageURL
        header.isVerified = data.isVerified
        header.joinDate = data.joinDate
        header.bio = data.artistInfo
        header.subscribers = data.subscribers

        return
      }
      else{
        throw "Artist not found"
      }

    })
    .catch( err => {
      return err
    })

//     // Get Popular tracks from artist
    topTracks.type = "Tracks"
    topTracks.tagline = "Popular"

    await models.Track.find({artistId: id})
    .sort({playCount: -1})
    .limit(5)
    .exec()
    .then( data => {
      if( data != null){
         topTracks.items = data
         header.items.push(topTracks)
      }
      else{ return }
    })
    .catch( err => { return err })
//
//     // Get Albums from artist
    albums.type = "Albums"
    albums.tagline = `New Releases by ${header.name}`

    await models.Album.find({artistId: id, type: "Album"})
    .exec()
    .then( data => {
        if(data != null && data.length > 0){
          albums.items = data
          header.items.push(albums)
          return
        }
        else{ return }
    })
    .catch( err => { return err})

    singles.type = "Singles"
    singles.tagline = "One offs "
    await models.Album.find({artistId: id, type: "Single"})
    .exec()
    .then( data => {
      if( data != null && data.length > 0){
        singles.items = data
        header.items.push(singles)
      }
      else{ return }
    })
    .catch( err => { return err })

    return header
}

exports.checkIfFollowing = async (query) => {

  let user = await models.User.findOne({id: query.user })
  .exec()
  .then( result => {
    if(result != null){
      for( i in result.following ){
        if( result.following[i].id == query.id){
          return 200
        }
        else if( i == result.following.length){
          return null
        }
      }
    }
  })
  .catch( err => { console.log( err )})

  return user
}

exports.AddNewFollower = async (id, artist) => {

  let user = await models.User.findOne({id: id})
  .then( result =>  {
    return result
  })
  .catch( err => { console.log( err )})

  // console.log(user)

  // check if user following array is not empty
  if( user.following.length > 0 ){

    // for every user check if id matches
    for (i in user.following){
      if( user.following[i].id == artist.id){
        return 200
      }

      // if end of following array and no user found
      else if( i == user.following.length -1){

        user.following.push(artist)

        // update user item in collection
        await models.User.updateOne({id: id}, {$set: {"following": user.following} })
        .exec()
        .then( result => {
          return
        })
        .catch( err => { console.log( err )})

        return 200
      }
    }

  }
  else{
    user.following.push(artist)

    console.log(user)

    await models.User.updateOne({id: id}, {$set: {"following": user.following} })
    .exec()
    .then( result => {
      return
    })
    .catch( err => { console.log( err )})

    return 200
  }

}
exports.UnfollowArtist = async (id, artistId) => {

console.log( artistId)

  let user = await models.User.findOne({id: id})
  .exec()
  .then( user => {
    console.log(user)

    for( i in user.following){
      // console.log(user.following[i])
      if( user.following[i].id == artistId){
        user.following.splice(i,1)

        return user
      }
      else if( i == user.following.length -1){
        console.log("done")
        return null
      }
    }
  })
  .catch( err => { console.log( err )})

  console.log( user)

  if( user != null){
   let result = await models.User.updateOne({id: id}, { $set: {"following": user.following}})
   .exec()
   .then( result => {
     console.log( result)
     return 200
   })
   .catch( err => {
     console.log( err )
   })

   return result
 }

}

exports.CheckIfAlbumSaved = async( query) => {

  let result = await models.User.findOne({id: query.userId})
  .exec()
  .then( result => {
    if(result.albums.length > 0){

      for( i in result.albums ){
        if( result.albums[i].id == query.id){
          return 200
        }
        else if( result.albums.length == i){
          return 404
        }
      }

    }
    else {
      return 404
    }
  })
  .catch( err => { console.log( err )})

  return result
}
exports.SaveAlbum = async (id, item) =>  {

  let album = new models.SavedAlbum
  album.id = item.id
  album.userId = id
  album.type = item.type
  album.genre = item.genre
  album.title = item.title
  album.name = item.name
  album.artistId = item.artistId
  album.imageURL = item.imageURL
  album.releaseDate = item.releaseDate

  // make sure item doesnt already exist in collection

  console.log(item.id)

  // let user = models.User.findOne({id: id})
  // .exec()
  // .then( result => {
  //   return result
  // })
  // .catch( err => {
  //   console.log(err)
  // })

  let result = await models.User.findOne({id: id})
  .exec()
  .then( result => {
    if( result.albums.length > 0){

      for( i in result.albums){
        if( result.albums[i].id == item.id){
          return 500
        }
        else if( i == result.albums.length -1 ){
          result.albums.push(album)
          return result
        }
      }
    }
    else{
      result.albums.push(album)
      return result
    }
  })
  .catch( err => { console.log( err )})

  console.log( result
  )

  if( result  != 500){
    result = await models.User.updateOne({id: id}, {$set: {albums: result.albums}})
    .exec()
    .then( result => { return 200 })
    .catch( err => { console.log( err )})
  }

  return result

}
exports.RemoveAlbumFromSaved = async (id, item) => {

    let result = await models.User.findOne({id: id})
    .exec()
    .then( result => {
      if( result.albums.length > 0 ){

        for( i in result.albums ){
          if( result.albums[i].id == item){
            result.albums.splice(i, 1)
            return result
          }
          else{ return 404}
        }
      }
      else{ return 404}
    })
    .catch( err => { console.log( err )})

    if( result != 404){
      result = await models.User.updateOne({id: id}, {$set: { albums: result.albums}})
      .exec()
      .then( result => { return 200})
      .catch( err => { console.log( err )})
    }
    // let result = await models.SavedAlbum.deleteOne({"userId": id, "id": item})
    // .exec()
    // .then( result => {
    //   return 200
    // })
    // .catch( err => { console.log( err )})

    return result
}

exports.getSavedTrack = async (id, userId ) => {

  let result = await models.User.findOne({id: userId})
  .then( result => {

    if( result.playlists.length > 0){
      for( i in result.playlists){
        if( result.playlists[i].title == "Saved Tracks" && result.playlists[i].tracks.length > 0 ){
          for(x in result.playlists[i].tracks){
            if( result.playlists[i].tracks[x].id == id){
              return 200
            }
          }
        }
      }
    }
    return 404
  })
  .catch( err => { console.log( err )})

  return result
}
exports.saveTrack = async (id, item) => {

  // console.log(item)
  let result = await models.User.findOne({id: id})
  .exec()
  .then( result => {

    if( result.playlists.length > 0 ){
      for(i in result.playlists ){
        if( result.playlists[i].title == "Saved Tracks" ){

          for(x in result.playlists[i].tracks ){

            if( result.playlists[i].tracks[x].id == item.id){
              result.playlists[i].tracks.splice(x,1)
              return result
            }
          }

          result.playlists[i].tracks.push(item)
          return result
        }
      }
    }

    let savedPlaylist = {
      id: uuid.v4(),
      title: "Saved Tracks",
      type: "Playlist",
      userId: id,
      tracks: item,
      imageURL: "Hip-Hop",
      isPrivate: true
    }

    result.playlists.push(savedPlaylist)

    // if( result.saved.length > 0){
    //   for(i in result.saved){
    //     if( result.saved[i].id == item.id){
    //       result.saved.splice(i, 1)
    //       return result
    //     }
    //   }
    // }
    // result.saved.push(item)
    return result
  })
  .catch( err => { console.log( err )})

  result = await models.User.updateOne({id: id}, {$set: { playlists: result.playlists}})
  .exec()
  .then( success => {
    return 200
  })
  .catch( err => { console.log( err )})

console.log(result);
  return result
}
exports.removeSavedTrack = async (id, item) => {

}
exports.getPlaylist = async( id, user) => {

  console.log(user);
  let result = await models.User.findOne({id: user})
  .then( response => {
    for( i in response.playlists ){
      if( response.playlists[i].id == id){
        return response.playlists[i]
      }
    }
  })
  .catch( err => { console.log( err )})

  return result
}
exports.GetSearchHistory = async (id) => {
  let history = await models.History.find({userId: id})
  .exec()
  .then( data =>  { return data })
  .catch( err => { return err })

  return history
}
exports.AddItemSearchToHistory = async (item) => {

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
