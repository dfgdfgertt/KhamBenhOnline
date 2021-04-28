var mongoose = require('mongoose');
var MemberSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    listDiagnostic:[{
        type: String
    }]
},{
    collection: 'member'
});

module.exports = mongoose.model('Member', MemberSchema);