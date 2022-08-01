window.onload = getMyLocation

let map
let watchId = null

function watchLocation() {
  watchId = navigator.geolocation.watchPosition(displayLocation, displayError)
}

function clearWatch() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }
}

function getMyLocation() {
  if (navigator.geolocation) {
    let watchButton = document.getElementById('watch')
    watchButton.onclick = watchLocation
    let clearWatchButton = document.getElementById('clearWatch')
    clearWatchButton.onclick = clearWatch
  } else {
    alert('Oops, no geolocation support')
  }
}

function displayLocation(position) {
  let latitude = position.coords.latitude
  let longitude = position.coords.longitude
  let div = document.getElementById('location')
  div.innerHTML = `You are at Latitude: ${latitude}, Longitude: ${longitude}`
  div.innerHTML += ` (with ${position.coords.accuracy} meters accuracy)`

  let km = computeDistance(position.coords, placeCoords)
  let distance = document.getElementById('distance')
  distance.innerHTML = `You are ${km} km from ${placeCoords.placeName}`

  if (map == null) {
    showMap(position.coords)
  }
}

function displayError(error) {
  let errorTypes = {
    0: 'Unknown error',
    1: 'Permission denied by user',
    2: 'Position is not available',
    3: 'Request timed out',
  }
  let errorMessage = errorTypes[error.code]
  if (error.code === 0 || error.code === 2) {
    errorMessage = `${errorMessage} ${error.message}`
  }
  let div = document.getElementById('location')
  div.innerHTML = errorMessage
}

function computeDistance(startCoords, destCoords) {
  let startLatRads = degreesToRadians(startCoords.latitude)
  let startLongRads = degreesToRadians(startCoords.longitude)
  let destLatRads = degreesToRadians(destCoords.latitude)
  let destLongRads = degreesToRadians(destCoords.longitude)

  let Radius = 6371 // радиус Земли в километрах
  let distance =
    Math.acos(
      Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) *
          Math.cos(destLatRads) *
          Math.cos(startLongRads - destLongRads)
    ) * Radius

  return distance
}

function degreesToRadians(degrees) {
  let radians = (degrees * Math.PI) / 180
  return radians
}

let placeCoords = {
  placeName: 'Academica Shwartsa 6/2',
  latitude: 56.79458,
  longitude: 60.61691,
}

function showMap(coords) {
  let googleLatAndLong = new google.maps.LatLng(
    coords.latitude,
    coords.longitude
  )
  let mapOptions = {
    zoom: 10,
    center: googleLatAndLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }

  let mapDiv = document.getElementById('map')
  map = new google.maps.Map(mapDiv, mapOptions)

  let title = 'Your Location'
  let content = `You are here: ${coords.latitude} ${coords.longitude}`
  addMarker(map, googleLatAndLong, title, content)
}

function addMarker(map, latlong, title, content) {
  let markerOptions = {
    position: latlong,
    map: map,
    title: title,
    clickable: true,
  }

  let marker = new google.maps.Marker(markerOptions)

  let infoWindowOptions = {
    content: content,
    position: latlong,
  }

  let infoWindow = new google.maps.InfoWindow(infoWindowOptions)

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.open(map)
  })
}
