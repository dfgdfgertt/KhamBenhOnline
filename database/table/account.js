var mongoose = require('mongoose');
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

module.exports = mongoose.model('account', AccountSchema);


