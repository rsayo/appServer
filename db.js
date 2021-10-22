const uuid = require('uuid')
const fs = require('fs')
const path = require('path')


// Get Featured albums
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
    console.log(featuredArtists)

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
    // console.log(catalog)
    resolve(catalog)
  })
}

// Get albumDetail
exports.GetAlbumDetail = (id) => {
  return new Promise((resolve, reject) => {
    console.log("getting albums")

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

      console.log(id)

      albums.map((album, i) => {

          if( album.id == id){

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
      resolve(albumDetail)

  })
}

// Get user Track history
exports.GetUserTrackHistory =() => {
  return new Promise((resolve, reject) => {
    let history = getFile("songs")
    resolve(history)
  })
}

// Get Tracks
exports.GetTracks = () => {
  return new Promise((resolve, reject) => {
    getFile('songs').map((track) => {
      if(track.Id == req.query.trackId){
          console.log("Track", track)
            res.json(track)
      }
    })
  })
}

// Get AristProfile Data
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
    getFile("artist").map((artist) => {
      if(artist.id == id){

        let detail =  new ProfileItem()

        detail.id = uuid.v4()
        detail.title = ""
        detail.artist = artist.name
        detail.imageURL = artist.imageURL
        detail.followers = artist.followers
        // detail.listeners = artist.listeners
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


        getFile("albums").map( album => {
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
        collection.push(albums)
        if(singles.items.count > 0) {collection.push(singles)}
        collection.push(artists)

        // console.log(collection)

        resolve(collection)
      }
    })
  })
}
// Get TrackById
exports.GetTrackById = (id) => {
  return new Promise((resolve, reject) => {
    let tracks = []

    getFile('songs').map((track) => {
      if(track.Id == req.query.trackId){
          // console.log("Track", track)
            res.json(track)
      }
    })

    getFile('songs').map((track, id) => {
      if(track.id == req.query.albumId){
            tracks.push(track)
      }
    })

    resolve(tracks)
  })
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
  this.artist = null,
  this.title = null,
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
