var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/Goods');
var db = require('../models/db');
var Carts = require('../models/Cart')
router.get('/index',function (req,res,next) {
     let temai = [],
         rexiao = [],
         jingpin = []
         const getTemai = new Promise((resolve,reject)=>{
         Goods.find(
             {brand_status: 'temai'},
             {brand_id:true, brand_name:true , brand_price:true, brand_pic:true, brand_status:true, _id:false},
             { limit: 3},
             function (err, doc) {
                 if (err) {
                     console.log('temai find err!')
                     reject('失败')
                 } else {
                     if (!doc) {
                         temai = []
                     }else {
                         temai = doc;
                     }
                     resolve(temai)
                 }
             }
             )
         })
         const getRexiao = new Promise((resolve,reject)=>{
           Goods.find(
               {brand_status: 'rexiao'},
               {brand_id:true, brand_desc:true,brand_name:true , brand_price:true, brand_pic:true, brand_status:true, _id:false},
               { limit: 3},
               function (err,doc) {
                   if (err) {
                       console.log('rexiao find err')
                       reject('失败')
                   }else {
                       if (!doc) {
                           rexiao = []
                       }else {
                           rexiao = doc
                       }
                       resolve(rexiao)
                   }
               }
           )
         })
         const getJingpin = new Promise((resolve,reject)=>{
           Goods.find(
               {brand_status: 'jingpin'},
               {brand_id:true,brand_status:true,brand_price:true,brand_pic:true,brand_name:true,_id:false},
               {limit: 4},
               function (err,doc) {
                   if (err) {
                       console.log('jingpin find err')
                       reject('失败')
                   }else {
                       if (!doc){
                           jingpin = []
                       }else {
                           jingpin = doc
                       }
                       resolve(jingpin)
                   }
               }
           )

         })
     const promiseAll = Promise.all([getTemai,getRexiao,getJingpin])
       promiseAll.then((result)=>{
         let data = {
             "temai" : result[0],
             "rexiao": result[1],
             "jingpin":result[2]
         }
           res.json({code: 200, msg:'', data: data})
           return
       }).catch((err)=>{
         console.log('err' +err)
           res.json({code: 404,msg:"查询出错", data: data})
           return
       })
})
router.get('/index/jingpin', function (req,res,next) {
    let nowLength = parseInt(req.query.nowLength)
    Goods.find(
        {brand_status: 'jingpin'},
        {brand_id: true,brand_name:true,brand_pic:true,brand_price:true,_id:false},
        {limit:4, skip:nowLength},
        function (err, doc) {
            if (err) {
                console.log('jingpin find err!')
                console.log(err)
            } else {
                if(!doc){
                    res.json({code:500, msg:"没有更多了",data:''})
                    return
                }else {
                    setTimeout(()=>{
                        res.json({code: 200, msg:"",data:doc})
                        return
                    },2000)
                }
            }
        }
        )
})
router.get('/cate',function (req,res,next) {
    Goods.find({}, function (err, doc) {
        if (err) {
            console.log('查询出错：' + err);
            res.json({code: 404, msg:'查询出了错误: ' + err})
            return
        }else {
            if (!doc) {
                res.json({code: 500, msg:'商品卖完了', data: doc})
                return
            } else {
                res.json({code: 200, msg:'', data: doc})
                return
            }
        }
    })
});
router.get('/detail',function (req,res,next) {
    let brand_id = req.query.brand_id
    Goods.findOne({brand_id: brand_id}, {__v: 0, _id:0}, function (err,doc) {
        if (err) {
            console.log('查询出错: '+ err);
            res.json({code: 404, msg:'查询出错: '+ err})
            return
        } else {
            if (!doc) {
                res.json({code: 500, msg:'商品没了', data:doc})
                return
            }else {
                res.json({code: 200, msg:'', data: doc})
            }

        }
    })
});
router.get('/addToCart',function (req,res,next) {
        let brand_id = req.query.brand_id
        let name = req.query.name
        let newCart = req.query
        Carts.update({brand_id: brand_id, name: name},
            {$set:newCart}, {upsert:true}, function (err) {
            if (err) {
                console.log('加入购物车失败')
                res.json({code: 404, msg:'加入购物车失败：' + err})
                return
            }else {
                res.json({code: 200, msg:'加入购物车成功'})
                return
            }
        })
})
router.get('/carts',function (req,res,next) {
    let name = req.query.name
    console.log(name)
    Carts.find({name:name}, {__v:0, _id:0},function (err,doc) {
        if (err) {
            console.log('购物车查询错误:' +err);
            res.json({code:404, msg:"购物车查询出错: "+ err})
            return
        } else {
            if (!doc){
                res.json({code: 500, msg:'购物车为空',data:doc})
                return
            }else {
                res.json({code:200,msg:'购物车返回成功', data:doc})
                return
            }
        }
    })
})
router.get('/delectCart',function (req,res,next) {
    let brand_id = req.query.brand_id
    let name = req.query.name
    Carts.remove({brand_id:brand_id, name:name},function (err) {
        if (err) {
            console.log('购物车删除错误: ' +err);
            res.json({code:500, msg:'购物车删除:' +err})
            return
        }else {
            res.json({code: 200,msg:'购物车删除成功'})
            return
        }
    })
 })
module.exports = router;