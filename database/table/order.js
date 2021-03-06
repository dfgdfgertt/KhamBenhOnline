var mongoose = require('mongoose');
var OderSchema = mongoose.Schema({
    idBooking:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    },
    price: {
        type: Number
    },
    status:{
        type: Boolean,
        default: false
    },
    idPayment:{
        type: String,
        default: null
    }
},{
    collection: 'order'
});

module.exports = mongoose.model('order', OderSchema);