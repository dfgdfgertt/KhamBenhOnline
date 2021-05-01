var mongoose = require('mongoose');
var RoleSchema = mongoose.Schema({
    name:{
        type: String
    }
},{
    collection: 'role'
});

module.exports = mongoose.model('role', RoleSchema);