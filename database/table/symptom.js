var mongoose = require('mongoose');
var SymptomSchema = mongoose.Schema({
    symptom: []
},{
    collection: 'account'
});

module.exports = mongoose.model('symptom', SymptomSchema);