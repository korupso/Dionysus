var mongoose = require('mongoose');

module.exports = mongoose.model('students', {
    fname: String,
    lname: String,
});