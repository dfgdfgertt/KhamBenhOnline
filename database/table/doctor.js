var mongoose = require('mongoose');
var DoctorSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    nickname:{
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
    idFaculty:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty',
        default: null
    },
},{
    collection: 'doctor'
});

module.exports = mongoose.model('doctor', DoctorSchema);