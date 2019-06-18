var express = require('express');
var app = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port = 3000; 				// set the port

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// Modules =====================================================================
var Vocs = require('./src/app/models/vocs.ts');
var Uks = require('./src/app/models/uks.ts');
var Uks_Students = require('./src/app/models/uks_students.ts');
var Students = require('./src/app/models/students.ts');

// configuration ===============================================================
mongoose.connect('mongodb+srv://mac:jwheja@m133lb02-0rmsu.mongodb.net/test?retryWrites=true&w=majority'); 	// connect to mongoDB database on modulus.io

app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ======================================================================
app.get('/api/vocs', (req, res) => {

    // use mongoose to get all todos in the database
    Vocs.find((err, vocs) => {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(vocs); // return all todos in JSON format
    });
});

app.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        Vocs.find((err, vocs) => {
            let loggedIn = false;
            vocs.forEach(voc => {
                if (voc.username === req.body.username) if (voc.password === req.body.password) loggedIn = true;
            });
            console.log(localStorage.getItem("status"));
            res.send(loggedIn);
        });
    }
});

// create todo and send back all todos after creation
app.post('/api/vocs', (req, res) => {

    // create a todo, information comes from AJAX request from Angular
    Vocs.create({
        username: req.body.username,
        password: req.body.password
    }, (err, todo) => {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Vocs.find((err, todos) => {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});

// application -------------------------------------------------------------
app.get('*', (req, res) => {
    res.sendfile('./src/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);