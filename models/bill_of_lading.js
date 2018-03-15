const mongoose = require('mongoose');
var BillOfLadingSchema = mongoose.Schema({
    bol_name: {
        type: String,
        index: true
    },
    bol_blockchain_addr: {
        type: String,
        unique: true
    },
    password:{
        type: String,
        trim: true
    },
    date_created:{ 
        type: Date,
        default: Date.now
    },
    date_updated:{
        type: Date,
        default: Date.now
    },
    date_departed:{
        type: Date
    },
    date_arrived:{
        type: Date
    },
    order_state:{
        status: String,
        bol_status: String,
        location: String,
        current_owner: String
    },
    items_shipped:[{
        item_no: String,
        item_name: String,
        style_no: String,
        quantity: Number,
        uint_weight: Number,
        uint_volume: Number,
        unit_price: Number,
        total_price: Number
    }],
    shippers:[{
        pickup: Boolean,
        dropoff: Boolean,
        bol_confirmation: Boolean,
        blockchain_addr: String,
        shipper_comments: String
    }],
    seller:{
        pickup: Boolean,
        dropoff: Boolean,
        bol_confirmation: Boolean,
        blockchain_addr: String,
        seller_comments: String
    },
    buyer:{
        pickup: Boolean,
        dropoff: Boolean,
        bol_confirmation: Boolean,
        blockchain_addr: String,
        buyer_comments: String
    },
    port:{
        pickup: Boolean,
        dropoff: Boolean,
        bol_confirmation: Boolean,
        blockchain_addr: String,
        port_comments: String,
        port_requirements:{
            port_clearance: Boolean,
            port_comments: String
        },
    },
    customs:{
        bol_confirmation: Boolean,
        blockchain_addr: String,
        customs_comments: String,
        customs_requirements:{
            customs_clearance: Boolean,
            customs_comments: String
        },
    }
});

var BillOfLading = module.exports = mongoose.model('BillOfLading', BillOfLadingSchema);