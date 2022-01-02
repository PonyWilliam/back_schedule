const router = require('koa-router')()
const Mysql_Services = require('../utils/mysql')
const jwt = require('jwt-simple')
const Check = require('../utils/check')
const Config = require('../utils/config')
const { reject } = require('core-js/fn/promise')
router.prefix("/comment")
let errMsg = {
    code:500,
    msg:'系统内部错误'
}
function ListComment(){
    let sql = `select * from comment`
    return Mysql_Services.query(sql)
}

function FindCommentByID(id){
    let sql = `select * from comment where id=${id}`
    return Mysql_Services.query(sql)
}
function FindCommentByAID(id){
    let sql = `select * from comment where id=${id}`
    return Mysql_Services.query(sql)
}
function AddComment(content,aid,uid){
    let sql = `insert into comment (content,aid,uid,time) VALUES ('${content}',${aid},${uid},'${Date.parse(new Date()) / 1000}')`
    return Mysql_Services.query(sql)
}
async function DelComment(id,uid){
    let temp = await FindCommentByID(id)
    if(temp.length != 1){
        reject('删除失败')
        return
    }
    temp = temp[0]
    if(uid != temp.uid){
        reject('非本人操作')
        return
    }
    let sql = `delete from comment where id=${id}`
    return await Mysql_Services.query(sql)
}

router.get("/",async (ctx,next)=>{
    try{
        let comment = await ListComment()
        ctx.body = comment
    }catch(e){
        console.log(e)
        ctx.body = errMsg
    }
})
router.get("/aid/:aid",async (ctx,next)=>{
    try{
        let comment = await FindCommentByAID(ctx.params.aid)
        ctx.body = comment
    }catch(e){
        console.log(e)
        ctx.body = errMsg
    }
})
router.get("/id/:id",async (ctx,next)=>{
    try{
        let comment = await FindCommentByID(ctx.params.id)
        ctx.body = comment
    }catch(e){
        console.log(e)
        ctx.body = errMsg
    }
})
router.post("/",async (ctx,next) => {
    let token = ctx.request.header.token
    let content = ctx.request.body.content
    let aid = ctx.request.body.aid
    if(!Check.vailid(content,aid,token)){
        //校验失败
        ctx.body = {
            code:500,
            msg:'信息不全'
        }
        return
    }
    let jwt_result
    try{
        jwt_result = jwt.decode(token,Config.Secert)
    }catch(e){
        console.log(e)
        ctx.body = {
            code:500,
            msg:'登录过期',
        }
        return
    }finally{
        try{
            //数据库操作
            await AddComment(content,aid,jwt_result.id)
            ctx.body = {
                code:200,
                msg:'评论成功'
            }
        }catch(e){
            console.log(e)
            ctx.body = errMsg
        }
    }
})
router.delete("/id/:id",async (ctx,next)=>{
    let token = ctx.request.header.token
    let id = ctx.params.id
    if(!Check.vailid(id,token)){
        //校验失败
        ctx.body = {
            code:500,
            msg:'信息不全'
        }
        return
    }
    try{
        jwt_result = jwt.decode(token,Config.Secert)
    }catch(e){
        console.log(e)
        ctx.body = {
            code:500,
            msg:'登录过期',
        }
        return
    }finally{
        try{
            //数据库操作
            await DelComment(id,jwt_result.id)
            ctx.body = {
                code:200,
                msg:'删除成功'
            }
        }catch(e){
            console.log(e)
            ctx.body = errMsg
        }
    }
})
module.exports = router