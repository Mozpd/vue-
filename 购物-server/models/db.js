
//连接MongoDB数据库
const mongoose = require('mongoose');
const Goodsmodel = require('./Goods');
const initGoods = require('./initGoods.json')
 mongoose.connect('mongodb://127.0.0.1:27017/gouwu',{
    useMongoClient: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on("connected", function () {
    console.log("MongoDB 连接成功!")
    initData()
});

mongoose.connection.on("error", function () {
    console.log("MongoDB 连接失败!!.")
});

mongoose.connection.on("disconnected", function () {
    console.log("MongoDB 断开连接！！")
});
//初始化数据库
const initData = function () {
    Goodsmodel.find({},function (err, doc) {
        if(err){
            console.log('初始化出错出错: '+ err);
        }else if (!doc.length){
            console.log('商品数据库第一次打开');
            initGoods.map(brand=>{
                Goodsmodel.create(brand)
            })
        }else {
            console.log('正常')
        }
    })
}
