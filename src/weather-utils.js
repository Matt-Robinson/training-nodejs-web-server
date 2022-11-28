const request = require('postman-request')

const geocode = (placeName, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(placeName) + '.json?access_token=pk.eyJ1IjoibXJvYmluMjEiLCJhIjoiY2xhb2lseXZzMHp1bDNxdDd5dmQ2Z3ExbSJ9.NrRvHRAfSpkdtTF3u36wcg&limit=1'

    request( {url, json: true}, (error, { body } = {}) => {
        if (error) {
            callback( error, undefined )
        } else if ( body.error ) {
            callback( body.error, undefined )
        } else if ( body.features.length < 1 ) {
            callback( 'Place not found', undefined )
        } else {
            const geoPlaceName = body.features[0].place_name
            const coordinates = body.features[0].center[1] + ',' + body.features[0].center[0]
            callback( undefined, {
                geoPlaceName,
                coordinates
            } )
        }
    } )
}

const report = (coordinates, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=5486d21fc3b4344645280dede0dc1354&query='+ coordinates + '&units=m'

    request( {url, json: true}, (error, { body } = {}) => {
        if (error) {
            callback( error, undefined )
        } else if ( body.error ) {
            callback( body.error, undefined )
        } else {
            const location = body.location.name + ',' + body.location.region + "," + body.location.country
            const description = body.current.weather_descriptions[0]
            const temperature = body.current.temperature
            const feelsLike = body.current.feelslike
            callback( undefined, {
                location,
                description,
                temperature,
                feelsLike,
                units: 'celsius'
            } )
        }
    } )
}

const weather = (location, callback) => {
    geocode( location, (error, {coordinates} = {}) => {
        if ( error ) {
            return callback( error )
        }
        report( coordinates, (error, {location, description, temperature, units} = {}) => {
            if ( error ) {
                return callback( error )
            }
            return callback( undefined, {
                    location,
                    description,
                    temperature,
                    units
            } )
        })  
    })
}

module.exports = {
    geocode: geocode,
    report: report,
    weather: weather
}