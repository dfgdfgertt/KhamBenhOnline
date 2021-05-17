var mongoose = require('mongoose');
var MemberSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    listDiagnostic:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'diagnostic',
        default: null
    }]
},{
    collection: 'member'
});

module.exports = mongoose.model('member', MemberSchema);