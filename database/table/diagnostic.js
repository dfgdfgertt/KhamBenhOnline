var mongoose = require('mongoose');
var DiagnosticScheme = mongoose.Schema({
    name:{
        type: String
    },
    description:{
        type: String
    },
    idKhoa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'khoa'
    },
    symptom:[{
        type: String
    }]
},{
    collection: 'diagnostic'
});

module.exports = mongoose.model('Diagnostic', DiagnosticScheme);