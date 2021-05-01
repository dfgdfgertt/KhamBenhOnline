var mongoose = require('mongoose');
var LoginSchema = mongoose.Schema({
    idRole: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    idAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    }
},{
    collection: 'login'
});

module.exports = mongoose.model('login', LoginSchema);