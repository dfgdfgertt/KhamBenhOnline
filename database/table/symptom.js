var mongoose = require('mongoose');
var SymptomSchema = mongoose.Schema({
    symptom: []
},{
    collection: 'symptom'
});

module.exports = mongoose.model('symptom', SymptomSchema);