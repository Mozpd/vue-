const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid')
const addressSchema = new Schema({
    _id:{
        type: String,
        default:shortid
    },
    username: {
        type: String,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    is_default: {
        type: Boolean,
        default:false
    }

});
const Address = mongoose.model("Address", addressSchema);
module.exports = Address;