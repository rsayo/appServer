const fs = require('fs')
let tours = []
let users = []

exports.initializeDb = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/Tour.json', (err, data) => {
      if(err) reject('There was an error')
      tours = JSON.parse(data);
    })
    resolve(tours)
  })
} // initiales database
exports.getAllTours = () => {
  return new Promise((resolve,reject) => {
    if(tours.length > 0){
      resolve(tours)
    }else{
      reject('No Tours Dates available')
    }
  })} // Return all stored tours
exports.getToursById = (id) => {
  return new Promise((resolve, reject) => {
    if(tours.length > 0){
        for(var i = 0; i < tours.length; i++){
          if(tours[i].id == id){
            console.log(tours[i])
            resolve(tours[i])
          }
        }
        reject(`No matching tours with id ${id}`)
    }else{
      reject("No tours found")
    }
  })} // Filters matching tour with i
exports.getLocations = () => {
  return new Promise((resolve, reject) => {
    let Tours = []
    for(var i = 0; i < tours.length; i++){
      // console.log(i)
      for(var j = 0; j < tours[i].Locations.length; j++){
        Tours.push(tours[i].Locations[j])
      }
    }
      Tours.length < 1 ? reject("No Tours Found") :  resolve(Tours)
  })}//Returns all Locations
exports.getToursByLocationId = (id) => {
  return new Promise((resolve,reject) => {1
    var matchedLoctions = []
      for(var i = 0; i < tours.length; i++){
        console.log("Tour", i)
        for(var h = 0; h < tours[i].Locations.length; h++){
          // console.log(tours[i].Locations[h])
          console.log("Location: ", h)
          if(tours[i].Locations[h].id == id ){
            console.log(tours[i].Locations[h])
            matchedLoctions.push(tours[i].Locations[h])
          }
        }
      }
      matchedLoctions.length < 1? reject(`No tour found for location with id ${id}`) : resolve(matchedLoctions)
  })} // Filters Tour By Location
exports.getTourByCity =(city) => {
  return new Promise((resolve, reject) => {
    console.log(city)
    for(var i = 0; i < tours.length; i++){
      console.log(tours[i].Tour)
      for(var j = 0; j < tours[i].Locations.length; j++){
        console.log(tours[i].Locations[j].id)
        if(tours[i].Locations[j].City === city){
          resolve(tours[i].Locations[j])
        }
      }
    }
    reject('nothing found')
  })
} // Filters Tour by City
exports.getToursByMonth = (month) => {
  return new Promise((resolve, reject) => {
    var Locations = []
    for(var i = 0; i < tours.length; i++){
      for(var j = 0; j < tours[i].Locations.length; j++){
        if(tours[i].Locations[j].Month == month){
          Locations.push(tours[i].Locations[j] )
        }
      }
    }
    console.log()
    Locations.length > 0 ? resolve(Locations) : reject("Tour not found in that month")
  })
} // Filters Tours by Month
exports.getToursByYear =(year) => { // Filters Tours by Year
  return new Promise((resolve,reject) => {
    var Tours = []
    // console.log(year)
    for(var i = 0; i < tours.length; i++){
      for(var j = 0; j < tours[i].Locations.length; j++){
        // console.log(tours[i].Locations[j].Year)
        if(tours[i].Locations[j].Year == year){
          tours.push(tours[i].Locations[j])
        }
      }
    }
    Tours.length > 0 ? resolve(tours) : reject('No Tours Found for year')
  })
}

exports.getUsers = () => {
  return new Promise((response, reject) => {
    user.length < 1 ? reject('No users found') : resolve(users)
  })
}
