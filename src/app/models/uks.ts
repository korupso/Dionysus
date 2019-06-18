var mongoose = require('mongoose');

let ukId = module.id;

module.exports = mongoose.model('uks', {
    name: String
});