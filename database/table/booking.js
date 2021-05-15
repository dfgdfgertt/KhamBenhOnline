var mongoose = require('mongoose');
var BookingScheme = mongoose.Schema({
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        default: null
    },
    idFaculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty',
        default: null
    },
    idMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member',
        default: null
    },
    idOrder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
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