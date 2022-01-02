# 时间表 Nodejs后端

## 说明

### 大致说明
项目基于koa2进行开发，koa2是基于nodejs的高性能新一代web框架，采用洋葱模型作为架构  
本项目主要用于本团队在服务外包创新创业大赛中进行项目跟进

### 已实现功能

- [x] 用户模块
    - [x] 用户登录
    - [x] 用户鉴权
    - [ ] 用户注册

- [x] 文章模块
    - [x] 文章发表
    - [x] 文章删除
    - [x] 模糊搜索
    - [x] 回应收到
    - [ ] 文章修改

- [x] 评论模块
    - [x] 评论发表
    - [x] 评论删除
    - [ ] 评论点赞


### API 列表(*代表需要token验证身份)
#### users

* POST /users/login -> 登录接口  
* *POST /users/verify -> 鉴权接口  
* GET /users ->查询用户  
* GET /users/id/:id -> 通过id查询用户  
#### Article
* *POST /article -> 发表文章
* *DELETE /article/id/:id ->删除文章
* GET /article/search/:keyword -> 模糊搜索文章
* GET /article/id/:id -> 通过id搜索文章
* *PUT /article/id/:id -> 通过ID修改文章（预留）
* *POST /article/recive -> 回应收到（字母少了个e）

