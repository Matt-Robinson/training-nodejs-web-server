const path = require('path')
const weather = require('./weather-utils')
const express = require('express')
const hbs = require('hbs')

// important folders used by Express Web Server
const publicFolder = path.join( __dirname, '..', 'public' )
const viewsFolder = path.join( __dirname, '..', 'templates', 'views' )
const partialsFolder = path.join( __dirname, '..', 'templates', 'partials' )

// initialize Express Web Server
const app = express()
const port = process.env.PORT || 3000
app.use(express.static( publicFolder ))
console.log( "Main Static Folder set to [" + publicFolder + "]" )

// settings for HBS (Handlebars for Express)
app.set('view engine', 'hbs')
app.set('views', viewsFolder)
hbs.registerPartials(partialsFolder)

// **NOTE: To ensure restarts of this site occur when hbs or js files change, use nodemon src/app.js -e js,hbs

// Global variables
const siteAuthor = 'Matt Robinson'

// reference URLs for the Site
app.get('', (req, res) => {
    res.render('index', {
        title: 'Home',
        name: 'Main Index page',
        author: siteAuthor
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'About this Site',
        image: 'DukeWaving.png',
        author: siteAuthor
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Main Help page',
        helptext: 'This is some helpful text.',
        author: siteAuthor
    })
})

app.get('/weather', ({query} = {}, res) => {
    const {location, mode = "text"} = query
    if ( location ) {
        weather.weather( location, (error, {location, description, temperature, units} = {}) => {
            if ( error ) {
                res.render('error500', {
                    title: 'Oops',
                    name: 'Server Error',
                    errortext: 'Sorry, an error has occurred. Please call your admin with this data: ' + JSON.stringify(error),
                    author: siteAuthor
                })
                return console.log( "500 Error: " + JSON.stringify(error) )
            }
            if ( mode === 'json' ) {
                res.send({
                    location,
                    description,
                    temperature,
                    units
                })
            } else {
                res.render('weather', {
                    title: 'Current Weather',
                    name: 'Weather Conditions',
                    author: siteAuthor,
                    location,
                    description,
                    temperature,
                    units
                })
            }
        })
    } else {
        res.render('error400', {
            title: 'Oops',
            name: 'Bad Request',
            errortext: 'Sorry, you have not provided a location for this page.',
            author: siteAuthor
        })
        return console.log( "400 Error: location not provided" )
    }
})

// Custom missing page (404) error handling
app.get('/help/*', (req, res) => {
    res.render('error404', {
        title: 'Oops',
        name: 'Help Article Not Found',
        errortext: 'Sorry, the help page you requested is not valid',
        author: siteAuthor
    })
})

app.get('*', (req, res) => {
    res.render('error404', {
        title: 'Oops',
        name: 'Not Found',
        errortext: 'Sorry, the page you requested is not valid',
        author: siteAuthor
    })
})

// main Express Listener
app.listen(port, () => {
    console.log('Server started on port ' + port)
})