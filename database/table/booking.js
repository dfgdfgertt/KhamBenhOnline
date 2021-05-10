var mongoose = require('mongoose');
var BookingScheme = mongoose.Schema({
    idDiagnostic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'diagnostic',
    },
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
    },
    idFaculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty',
    },
    idMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member',
    },
    idOrder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    customer:{
        type: String
    },
    phoneNumber:{
        type: String
    },
    mail:{
        type: String
    },
    day:{
        type: String
    },
    time:{
        type: String
    },
    status:{
        type: Boolean,
        default: true
    }
},{
    collection: 'booking'
});

module.exports = mongoose.model('booking', BookingScheme);