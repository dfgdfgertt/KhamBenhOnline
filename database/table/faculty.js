var mongoose = require('mongoose');
var FacultySchema = mongoose.Schema({
    name: {
        type: String,
        default: 'No Name'
    },
    logo:{
        type: String
    },
    description:{
        type: String
    },
    price:{
        type: Number
    }
},{
    collection: 'faculty'
});

module.exports = mongoose.model('faculty', FacultySchema);