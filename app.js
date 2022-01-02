const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const article = require('./routes/article')
const koaBody = require('koa-body')
// error handler
onerror(app)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});


app.use(koaBody());
// routes
app.use(index.routes()).use(index.allowedMethods());  
app.use(users.routes()).use(users.allowedMethods()); 
app.use(article.routes()).use(article.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
app.listen(3000)
module.exports = app
