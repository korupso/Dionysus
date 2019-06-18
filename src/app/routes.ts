var Vocs = require('./models/vocs.ts');

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/vocs', function (req, res) {

        // use mongoose to get all todos in the database
        Vocs.find(function (err, vocs) {

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
                console.log(loggedIn);
                res.send(loggedIn);
            });
        }
    });

    // create todo and send back all todos after creation
    app.post('/api/vocs', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Vocs.create({
            username: req.body.username,
            password: req.body.password
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Vocs.find(function (err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('../index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};