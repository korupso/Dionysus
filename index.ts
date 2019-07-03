import { CommonModule } from "@angular/common";
import { cpus, tmpdir } from "os";
import { findReadVarNames } from "@angular/compiler/src/output/output_ast";

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

// Create new students =============================================
app.post('/api/students', (req, res) => {

    let fnameArr = req.body.name.split(" ");
    fnameArr.splice(-1, 1);
    let fname = fnameArr.join().replace(/,/g, ' ');
    let lname = req.body.name.split(" ")[req.body.name.split(" ").length - 1];
    Students.create({
        fname: fname,
        lname: lname
    }, (err, todo) => {
        if (err)
            res.send(err);

        Students.find((err, students) => {
            if (err)
                res.send(err)
            res.json(students);
        });
    });

});

app.get('/api/students', (req, res) => {
    Students.find((err, students) => {
        if (err) res.send(err);
        res.send(students);
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
    Uks_Students.find((err, ids: any[]) => {
        let done = [];
        ids.forEach(combo => done.push(false));
        let studentsFromUk = [];
        let empty = true;
        let promises = [];
        for (let i = 0; i < ids.length; i++) {
            if (ids[i].uk_id == req.body._id) {
                empty = false;
                promises.push(Students.find((err, students) => {
                    students.forEach(student => {
                        if (ids[i].student_id == student._id) {
                            studentsFromUk.push({ id: student._id, name: (student.fname + " " + student.lname), grade: ids[i].grade });
                        }
                    });
                }));
            }
        };
        Promise.all(promises).then(() => {
            res.send({ studentsFromUk: studentsFromUk });
        })
    });
});

// Profile Data ====================================================
app.post('/profile', (req, res) => {
    let studentId = req.body.id.studentId;
    let uks: { uk, grade }[] = [];
    let combos = [];
    let studentName: string;

    Students.find((err, students) => {
        students.forEach(student => {
            if (student._id == studentId) studentName = student.fname + " " + student.lname;
        });
        Uks_Students.find((err, uks_students) => {
            uks_students.forEach(uk_student => {
                if (uk_student.student_id == studentId) combos.push(uk_student);
            });
            if (combos.length == 0) res.send(studentName);
            for (let i = 0; i < combos.length; i++) {
                Uks.find((err, remUks) => {
                    remUks.forEach(uk => {
                        if (combos[i].uk_id == uk._id) uks.push({ uk: uk, grade: combos[i].grade });
                    });
                    if (combos.length - 1 == i) res.send({ name: studentName, uks: uks });
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