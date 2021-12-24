const mongoose = require('mongoose')
const schema = mongoose.Schema

let albumSchema = new schema({
  id: {type:  mongoose.ObjectId },
  type: {type: String},
  title: {type: String},
  name: {type: String},
  artistId: {type:  mongoose.ObjectId },
  imageURL: {type: String}
})
exports.Album = mongoose.model('Album', albumSchema)

let artistSchema = new schema({
  id: {type:  mongoose.ObjectId },
  name: {type: String},
  imageURL: {type: String},
  isVerified: {type: Boolean},
  followers: {type: Number}
})
exports.Artist = mongoose.model('Artist', artistSchema)

let trackSchema = new schema({
  id: {type:  mongoose.ObjectId },
  type: {type: String},
  genre: {type: String},
  trackNum: {type: Number},
  title: {type: String},
  artistId: {type:  mongoose.ObjectId },
  name: {type: String},
  imageURL: {type:  mongoose.ObjectId },
  audioURL: {type:  mongoose.ObjectId },
  albumId: {type: String},
  playCount: {type: Number}
})
exports.Track = mongoose.model('Track', trackSchema)

let userSchema = new schema({
  username: {type: String},
  password: {type: String},
  email: {type: String},
  listeningHistory: {type: [trackSchema]},
  following: {type: [artistSchema]}
})
exports.User = mongoose.model('User', userSchema)

let playlistSchema = new schema({
  id: {type:  mongoose.ObjectId },
  title: {type: String},
  user: {type: userSchema},
  tracks: {type: [trackSchema]},
  imageURL: {type: String}

})
exports.Playlist = mongoose.model('Playlist',playlistSchema)
