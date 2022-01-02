const router = require('koa-router')()
const Mysql_Services = require('../utils/mysql')
const jwt = require('jwt-simple')
function FindUser(){
    return Mysql_Services.query("select id,username,nickname,avaurl from users")
}
function FindUserByID(id){
  console.log(id)
  let sql = `select id,username,nickname,avaurl from users where id=${id}`
  return Mysql_Services.query(sql)
}
function FindUserByUsername(user){
  let sql = `select id,username,nickname,avaurl from users where username='${user}'`
  return Mysql_Services.query(sql)
}
function FindUserAllInfoByUsername(user){
  let sql = `select * from users where username='${user}'`
  return Mysql_Services.query(sql)
}


router.prefix('/users')

router.get('/', async(ctx,next)=>{
    try{
        let user = await FindUser()
        ctx.body = user
    }catch{
      ctx.body = {
          'code':500,
          'msg':'error by exec sql'
      }
    }
})
router.get('/id/:id',async (ctx,next)=>{
    try{
      let user = await FindUserByID(ctx.params.id)
      ctx.body = user
    }catch{
        ctx.body = {
          'code':500,
          'msg':'error by exec sql'
        }
    }
})
router.post('/login',async (ctx,next)=>{
  let user = ctx.request.body.username
  let pwd = ctx.request.body.password
  if(user == (null || undefined) || pwd == (null || undefined)){
      ctx.body = {
        'code':500,
        'msg':'用户信息不全',
      }
  }
  try{
    let userinfo = await FindUserAllInfoByUsername(user)
    if(userinfo.length != 1){
        ctx.body = {
          'code':500,
          'msg':'账号或密码错误',
        }
        return
    }
    if(userinfo[0].username == user && userinfo[0].password == pwd){
        //给token
        userinfo[0].password = null
        userinfo[0].expries = Date.now() + 1000 * 60 *60 * 8
        let token = jwt.encode(userinfo[0],"hyhsb")
        ctx.body = {
          'code':200,
          'msg':'登录成功',
          'token':token
        }
        return
    }
      ctx.body = {
        'code':500,
        'msg':'账号或密码错误',
      }
  }catch{
      ctx.body = {
        'code':500,
        'msg':'登录系统内部错误'
      }
  }
})
router.post('/verify',async(ctx,next)=>{
    //验证用户
    let token = ctx.request.header.token
    if(token == (undefined || null)){
      ctx.body = {
        'code':500,
        'msg':'请先登录'
      }
      return
    }
    let decode
    try{
        decode = jwt.decode(token,'hyhsb',false)
    }catch{
        ctx.body = {
          'code':500,
          'msg':'身份已过期',
        }
        return
    }
    decode.code = 200
    decode.msg = '身份有效'
    ctx.body = decode
})

module.exports = router
