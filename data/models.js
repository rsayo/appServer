const mongoose = require('mongoose')
const schema = mongoose.Schema

let artistSchema = new schema({
  id: {type:  String },
  type: {type: String},
  name: {type: String},
  imageURL: {type: String},
  isVerified: {type: Boolean},
  subscribers: {type: Number},
  joinDate: {type: Date},
  genre: {type: String},
  about: {type: String}
})
exports.Artist = mongoose.model('Artist', artistSchema)

let albumSchema = new schema({
  id: {type:  String },
  type: {type: String},
  genre: {type: String},
  title: {type: String},
  name: {type: String},
  artistId: {type:  String},
  imageURL: {type: String},
  releaseDate: {type: Date}
})
exports.Album = mongoose.model('Album', albumSchema)

let trackSchema = new schema({
  id: {type:  String },
  type: {type: String},
  genre: {type: String},
  trackNum: {type: Number},
  title: {type: String},
  artistId: {type:  String },
  name: {type: String},
  imageURL: {type:  String },
  audioURL: {type:  String },
  albumId: {type: String},
  playCount: {type: Number}
})
exports.Track = mongoose.model('Track', trackSchema)

let userSchema = new schema({
  id: {type: String},
  username: {type: String},
  password: {type: String},
  email: {type: String},
  subscribed: {type: [artistSchema]},
  joinDate: {type: Date},
  savedAlbums: {type: [albumSchema]},
  savedTracks: {type: [trackSchema]},
  playlists: {type: [albumSchema]},
  listeningHistory:  {type: [trackSchema]}
})
exports.User = mongoose.model('User', userSchema)

let playlistSchema = new schema({
  id: {type:  String },
  title: {type: String},
  userId: {type: String},
  tracks: {type: [trackSchema]},
  imageURL: {type: String},
  isPrivate: {type: Boolean}

})
exports.Playlist = mongoose.model('Playlist',playlistSchema)

let historySchema = new schema({
  id: {type: String},
  userId: {type: String},
  type: {type: String},
  genre: {type: String},
  title: {type: String},
  name: {type: String},
  imageURL: {type: String},
  audioURL: {type: String},
  albumId: {type: String},
  artistId: {type: String},
  timestamp: {type: Date}
})
exports.History = mongoose.model("history", historySchema)

let featuredSchema = new schema({
  id: {type: String},
  type: {type: String},
  title: {type: String},
  artist: {type: String},
  imageURL: {type: String}
})
exports.Featured = mongoose.model("feature", featuredSchema)
