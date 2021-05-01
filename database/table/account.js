var mongoose = require('mongoose');
var assert = require('assert');
var AccountSchema = mongoose.Schema({
    username:{
        type: String
    },
    password:{
        type: String
    },
    idRole: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role' ,
        default: null
    },
},{
    collection: 'account'
});

// AccountSchema.path('userName').validate((val)=>{
//     userNameRegex = /[a-zA-Z\-0-9]/i;
//     return userNameRegex.test(val);
// },'Invalid User name');

module.exports = mongoose.model('account', AccountSchema);
//const Account = mongoose.model('Account', AccountSchema)

