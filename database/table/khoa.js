var mongoose = require('mongoose');
var KhoaSchema = mongoose.Schema({
    name: {
        type: String,
        default: 'No Name'
    },
    logo:{
        type: String
    },
    description:{
        type: String
    }
},{
    collection: 'khoa'
});

module.exports = mongoose.model('Khoa', KhoaSchema);