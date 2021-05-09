var mongoose = require('mongoose');
var DiagnosticScheme = mongoose.Schema({
    name:{
        type: String,
        default: 'Chưa chuẩn đoán'
    },
    description:{
        type: String
    },
    idFaculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty'
    },
    symptom:{
        type: Array
    }
},{
    collection: 'diagnostic'
});

module.exports = mongoose.model('diagnostic', DiagnosticScheme);