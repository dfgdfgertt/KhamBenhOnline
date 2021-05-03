var mongoose = require('mongoose');
var DiagnosticScheme = mongoose.Schema({
    name:{
        type: String,
        default: 'no name'
    },
    description:{
        type: String
    },
    idFaculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'khoa'
    },
    symptom:{
        type: Array
    }
},{
    collection: 'diagnostic'
});

module.exports = mongoose.model('diagnostic', DiagnosticScheme);