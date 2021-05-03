var mongoose = require('mongoose');
var BookingScheme = mongoose.Schema({
    idDiagnostic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'diagnostic',
        default: null
    },
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        default: null
    },
    idFuculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty',
        default: null
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
        type: date
    },
    time:{
        type: time
    }
},{
    collection: 'booking'
});

module.exports = mongoose.model('booking', BookingScheme);