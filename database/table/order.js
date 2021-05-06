var mongoose = require('mongoose');
var OderSchema = mongoose.Schema({
    idBooking:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    },
    price: {
        type: Number,
        default: 100000
    }
},{
    collection: 'order'
});

module.exports = mongoose.model('order', OderSchema);