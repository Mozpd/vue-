const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodsSchema = new Schema({
    brand_id: Number,
    brand_cate: String,
    brand_cateName: String,
    brand_status: String,
    brand_name: String,
    brand_price: Number,
    brand_desc: String,
    brand_pic: String
});
const Goods = mongoose.model("Goods", goodsSchema);
module.exports = Goods
