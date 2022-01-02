const router = require('koa-router')()
router.get("/",async(ctx,next)=>{
    ctx.body = {
        'code':200,
        'msg':'工作表站点'
    }
})
// router.post("/test",async(ctx,next)=>{
//   console.log(ctx.request,ctx.request.body)
//     ctx.body = 'test'
// })
module.exports = router
