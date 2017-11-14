const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const cartsSchema = new Schema({
    name: String,
    brand_id: Number,
    brand_cate: String,
    brand_name: String,
    brand_price: Number,
    brand_pic: String,
    brand_desc: String,
    cart_num: Number,
    cart_isSelect: Boolean
})
const Carts = mongoose.model('Carts', cartsSchema);
module.exports = Carts