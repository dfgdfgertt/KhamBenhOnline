var mongoose = require('mongoose');
var MemberSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    listDiagnostic:[]
},{
    collection: 'member'
});

module.exports = mongoose.model('member', MemberSchema);