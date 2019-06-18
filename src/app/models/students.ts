var mongoose = require('mongoose');

let studentId = module.id;

module.exports = mongoose.model('students', {
    _id: studentId,
    fname: String,
    lname: String,
});