const router = require('koa-router')()
const Mysql_Services = require('../utils/mysql')
const jwt = require('jwt-simple')

function ListArticle(){
    let sql = `select * from article`
    return Mysql_Services.query(sql)
}
function FindArticleByID(id){
    let sql = `select * from article where id=${id}`
    return Mysql_Services.query(sql)
}
function FindArticleByKeyword(keyword){
    //模糊查找
    let sql = `select * from article where title LIKE '%${keyword}%' OR content LIKE '%${keyword}%'`
    console.log(sql)
    return Mysql_Services.query(sql)
}
function InsertArticle(title,content,uid){
    let time = Date.parse(new Date()) / 1000;
    let sql = `insert into article (title,content,time,uid) VALUES ("${title}","${content}","${time}",${uid})`
    console.log(sql)
    return Mysql_Services.query(sql)
}
async function ReciveByID(id,rid){
    let sql = `select recive from article where id=${id}`
    let article = await Mysql_Services.query(sql)
    console.log(article[0].recive)
    if(article[0].recive != null){
        let uid = article[0].recive.split(",")
        let flag = false
        for(let x of uid){
            if(x == null || x == ""){
                break
            }
            //如果有跟id相同的，不允许插入
            if(rid == x){
                flag = true
            }
        }
        if(flag)    throw "已收到过"
        sql = `update article set recive="${article[0].recive}${rid}," where id = ${id}`
    }else{
        sql = `update article set recive="${rid}," where id = ${id}`
    }
    console.log(sql)
    return await Mysql_Services.query(sql)
}


FindErrMsg = {
    'code':500,
    'msg':'查询出错，请稍后再试'
}


router.prefix('/article')

router.get('/',async (ctx,next)=>{
    try{
        let article = await ListArticle()
        ctx.body = article
    }catch{
        ctx.body = FindErrMsg
    }
    
})
router.get('/id/:id',async (ctx,next)=>{
    try{
        let article = await FindArticleByID(ctx.params.id)
        ctx.body = article
    }catch{
        ctx.body = FindErrMsg
    }
})
router.get('/search/:search',async (ctx,next)=>{
    console.log(ctx.params)
    try{
        let article = await FindArticleByKeyword(ctx.params.search)
        ctx.body = article
    }catch(e){
        console.log(e)
        ctx.body = FindErrMsg
    }
})
router.post('/',async (ctx,next)=>{
    let token = ctx.request.header.token
    if(token == (undefined || null || "")){
        ctx.body = {
            'code':500,
            'msg':'无法验证您的身份信息'
        }
        return
    }
    let title = ctx.request.body.title
    let content = ctx.request.body.content
    if(title == (undefined || null || "") || content == (undefined || null || "")){
        ctx.body = {
            'code':500,
            'msg':'请填写完整的标题和内容',
        }
        return
    }
    try{
        jwt_result = jwt.decode(token,'hyhsb',false)
        //开始插入
    }catch{
        ctx.body = {
          'code':500,
          'msg':'身份已过期',
        }
        return
    }finally{
        try{
            await InsertArticle(title,content,jwt_result.id)
            ctx.body = {
                code:200,
                msg:'发布成功',
            }
        }catch(e){
            console.log(e)
            ctx.body = {
                code:500,
                msg:'由于sql系统问题，发布失败'
            }
        }
    }
})
router.post('/recive',async (ctx,next)=>{
    let id = ctx.request.body.id
    let token = ctx.request.header.token
    if(id == (null || undefined || "")){
        //id不正确
        ctx.body = {
            'code':500,
            msg:'非法注入,已记录IP'
        }
        return
    }
    let jwt_result
    try{
        jwt_result = jwt.decode(token,'hyhsb',false)
    }catch(e){
        console.log(e)
        ctx.body = {
            code:500,
            msg:'身份过期'
        }
    }finally{
        try{
            await ReciveByID(id,jwt_result.id)
            ctx.body = {
                code:200,
                msg:'收到成功'
            }
        }catch(e){
            if(typeof e == "string"){
                ctx.body = {
                    code:500,
                    msg:e
                }
                return
            }
            ctx.body = {
                code:500,
                msg:'收到失败',
            }
        }
        
    }
})

module.exports = router