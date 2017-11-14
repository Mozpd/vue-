var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../models/db');
var User = require('../models/User');
var Address = require('../models/Address')
router.get('/login', function (req,res,next) {
    if (!req.query.name){
        res.json({code :500,msg:'name不能为空'})
        return
    }
    if (!req.query.pwd) {
        res.json({code: 500,msg:'pwd不能为空'})
        return
    }
    User.findOne({name:req.query.name},function (err,doc) {
        if (err) {
            console.log('查询出错:'+err)
            res.json({code:404,msg:'查询出错'+err})
            return
        } else {
            if (!doc){
                res.json({code: 404,msg:'不存在该用户:' +req.query.name})
                return
            }else {
                if (req.query.pwd != doc.pwd){
                    res.json({code:404,msg:'密码错误:'})
                    return
                } else {
                    res.json({code:200,msg:'密码正确 登陆成功'})
                    return
                }
            }
        }
    })
})
router.get('/register',function (req,res,next) {
    let name = req.query.name
    let pwd = req.query.pwd
    if (!name){
        res.json({code:500,msg:'name不能为空'})
        return
    }
    if (!pwd) {
        res.json({code:500,msg:'pwd不能为空'})
        return
    }
    //查看数据库是否存在
    User.findOne({name:req.query.name},function (err,doc) {
        if (err){
            console.log('查询出错:' +err)
            res.json({code: 404,msg:'查询出错'+err})
            return
        } else {
            if (doc){
                res.json({code:500,msg:'该用户名已经存在:' +name})
                return
            } else {
                User.create({
                    name:name,
                    pwd:pwd
                },function (err,doc) {
                    if (err) {
                        res.end('注册失败:' + err)
                    } else {
                        res.json({code:200,msg:'注册成功' +name})
                        return
                    }
                })
            }
        }
    })
})
router.post('/create',function (req,res,next) {
    var newAddress = new Address();
    newAddress.username = req.body.username;
    console.log( newAddress.username)
    newAddress.name = req.body.name;
    newAddress.phone = parseInt(req.body.phone);
    newAddress.address = req.body.address;
    newAddress.is_default = req.body.is_default
    Address.findOne({'username':User.name},function (err,user) {
        console.log(1)
        if (user){
            return res.json({
                status:'1',
                message:'没有用户名'
            })
        }else {
            newAddress.save().then(data=>{
                console.log(data);
                return res.json({
                    status:'0',
                    message:'success'
                })
            }).catch((err)=>{
                return res.json({
                    status:'1',
                    message:err
                })
            })
        }
    })

})
router.get('/getAddress',function (req,res,next) {
    Address.find({}).then(addresss=>{
        if (addresss){
            Address.count({},function (err,count) {
                return res.json({
                    status:'0',
                    addressList:addresss,
                    count:count
                })
            })
        }
    }).catch((err)=>{
        return res.json({
            status:'1',
            message:err
        })
    })
})
router.post('/updateUser',function (req,res,next) {
    Address.findOne({'_id':req.body._id}).then(addresss=>{
        addresss.name = req.body.name;
        addresss.phone = parseInt(req.body.phone);
        addresss.is_default = req.body.is_default;
        addresss.save().then(data=>{
            return res.json({
                status:'0',
                message:'success'
            })
        }).catch(err=>{
            return res.json({
                status:'1',
                message:err
            })
        })
    })
})

router.post('/remove',function (req,res,next) {
    var _id = req.body._id;
    Address.remove({'_id':_id}).then(data=>{
        return res.json({
            status:'0',
            message:'success'
        })
    }).catch(err=>{
        return res.json({
            status:'1',
            message:err
        })
    })

})
module.exports = router;