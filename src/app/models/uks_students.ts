var mongoose = require('mongoose');

module.exports = mongoose.model('uks_students', {
    student_id: studentId,
    uk_id: ukId,
    grade: Number
});