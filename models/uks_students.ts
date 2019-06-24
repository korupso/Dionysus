var mongoose = require('mongoose');

module.exports = mongoose.model('uks_students', {
    student_id: String,
    uk_id: String,
    grade: Number
});