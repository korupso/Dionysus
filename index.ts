import { CommonModule } from "@angular/common";
import { cpus, tmpdir } from "os";

var express = require('express');
var app = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port = 3000; 				// set the port

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var async = require('async');

// Modules =========================================================
var Vocs = require('./models/vocs.ts');
var Uks = require('./models/uks.ts');
var Uks_Students = require('./models/uks_students.ts');
var Students = require('./models/students.ts');

// configuration ===================================================
mongoose.connect('mongodb+srv://mac:jwheja@m133lb02-0rmsu.mongodb.net/m133lb02?retryWrites=true&w=majority'); 	// connect to mongoDB database on modulus.io

app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ==========================================================
app.get('/api/uks', (req, res) => {

    // use mongoose to get all todos in the database
    Uks.find((err, vocs) => {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(vocs); // return all todos in JSON format
    });
});

// Get all uks =====================================================
app.post('/api/uks', (req, res) => {

    // create a todo, information comes from AJAX request from Angular
    Uks.create({
        name: req.body.name
    }, (err, todo) => {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Uks.find((err, uks) => {
            if (err)
                res.send(err)
            res.json(uks);
        });
    });

});

// Update grades ===================================================
app.post('/api/uks/grades', (req, res) => {
    let combos = [];
    let newCombos = [];
    let localStudents = req.body.students;
    let ukId = req.body._id;

    Uks_Students.find((err, wombo) => {
        wombo.forEach(combo => {
            if (combo.uk_id == ukId) combos.push(combo);
        });

        combos.forEach(combo => {
            localStudents.forEach(localStudent => {
                if (combo.student_id == localStudent.id) newCombos.push({
                    _id: combo._id,
                    student_id: combo.student_id,
                    uk_id: ukId,
                    grade: localStudent.grade
                })
            })
        });

        let promises = newCombos.map(newCombo => {
            return new Promise((resolve, reject) => {
                var query = { '_id': newCombo._id };
                Uks_Students.findOneAndUpdate(query, newCombo, { upsert: true }, function (err, doc) {
                    if (err) return res.send(500, { error: err });

                    Uks_Students.find((err, uks_students) => {
                        combos = [];
                        uks_students.forEach(uk_student =>
                            combos.push(uk_student));
                        resolve();
                    });
                });
            })

        });

        Promise.all(promises).then(() => {
            res.send({
                ukId: ukId,
                combos: combos,
                localStudents: localStudents
            });
        })

    });
});

// Get users from uk ===============================================
app.post('/api/uks/specific', (req, res) => {
    Uks_Students.find((err, ids) => {
        let done = [];
        ids.forEach(combo => done.push(false));
        let studentsFromUk = [];
        let empty = true;
        var promises = ids.map(combo => {
            return new Promise((resolve, reject) => {
                if (combo.uk_id == req.body._id) {
                    console.log(combo.uk_id + " != " + req.body._id);
                    empty = false;
                    Students.find((err, students) => {
                        students.forEach(student => {
                            if (combo.student_id == student._id) {
                                studentsFromUk.push({ id: student._id, name: (student.fname + " " + student.lname), grade: combo.grade });
                                console.log(studentsFromUk);
                                resolve();
                            }
                        });
                    });
                }
            });
        });

        if (empty) res.send([]);
        Promise.all(promises)
            .then(() => {
                console.log("done");
                res.send({ ukId: req.body._id, studentsFromUk: studentsFromUk })
            })
            .catch(console.error);
    });
});

// Profile Data ====================================================
app.post('/profile', (req, res) => {
    let studentId = req.body.id;
    let resStudent;
    let uks: { uk, grade }[] = [];
    let combos = [];

    Students.find((err, students) => {
        students.forEach(student => {
            if (student._id == studentId) resStudent = student;
        });
        Uks_Students.find((err, uks_students) => {
            uks_students.forEach(uk_student => {
                if (uk_student.student_id == studentId) combos.push(uk_student);
            });
            for (let i = 0; i < combos.length; i++) {
                Uks.find((err, remUks) => {
                    remUks.forEach(uk => {
                        if (combos[i].uk_id == uk._id) uks.push({ uk: uk, grade: combos[i].grade });
                    });
                    if (combos.length - 1 == i) res.send(uks);
                });
            }
        });
    });
});

// Login ===========================================================
app.post('/login', (req, res) => {
    let loggedIn = false;
    if (req.body.username && req.body.password) {
        Vocs.find((err, vocs) => {
            if (err) res.send("Database error");
            vocs.forEach(voc => {
                if (voc.username === req.body.username) if (voc.password === req.body.password) loggedIn = true;
            });
            res.send(loggedIn);
        });
    }
    else res.send(loggedIn);
});

// Signup ==========================================================
app.post('/signup', (req, res) => {

    let worked = true;
    Vocs.find((err, users) => {
        users.forEach((user) => {
            console.log(user.name);
            if (user.username == req.body.username) worked = false;
        })
        Vocs.create({
            username: req.body.username,
            password: req.body.password
        }, (err, users) => {
            if (err)
                res.send(err);
            Vocs.find((err, users) => {
                if (err)
                    res.send(err)
                if (worked) res.json(users);
                else res.send("Username already exists")
            });
        });
    });

});

// application =====================================================
app.get('*', (req, res) => {
    res.sendfile('./src/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ==========================
app.listen(port);
console.log("App listening on port " + port);