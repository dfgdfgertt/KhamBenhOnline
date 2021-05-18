var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        default: 'No Name'
    },
    avatar:{
        type: String,
        default: "https://imagebucketkhambenhonl-1.s3-ap-southeast-1.amazonaws.com/user.png"
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
    idAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        default: null
    }
},{
    collection: 'user'
});

module.exports = mongoose.model('user', UserSchema);