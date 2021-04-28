var mongoose = require('mongoose');
var DoctorSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    image:{
        type: String
    },
    trainingPlaces:[{
        type: String
    }], 
    degree: {
        type: String
    },
    description: {
        type: String
    },
    specialist: {
        type: String
    },
    workingProcess: [{
        type: String
    }],
    listDiagnostic:[{
        type: String
    }]
},{
    collection: 'doctor'
});

module.exports = mongoose.model('Doctor', DoctorSchema);