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
    idFuculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty',
    },
    idMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member',
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
        type: Date
    },
    time:{
        type: Date
    }
},{
    collection: 'booking'
});

module.exports = mongoose.model('booking', BookingScheme);