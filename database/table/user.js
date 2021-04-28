var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    name: {
        type: String,
        default: 'No Name'
    },
    avatar:{
        type: String
    },
    address:{
        type: String
    },
    phoneNumber:{
        type: String
    },
    mail:{
        type: String
    },
    idRole:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    idAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    }
},{
    collection: 'user'
});

module.exports = mongoose.model('User', UserSchema);