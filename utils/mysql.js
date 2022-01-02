const mysql = require('mysql')
const conn = mysql.createConnection(
    {
      "host":"sh-cynosdbmysql-grp-2o1mkprk.sql.tencentcdb.com",
      "port":21270,
      "user":"root",
      "password":"Xiaowei123",
      "database":"schedule"
    }
)
let Mysql_Services = {
    query:function (sql){
      return new Promise((resolve,reject)=>{
          conn.query(sql,function(err,rows){
              if(err){
                reject(err)
                return
              }
              resolve(rows)
          })
      })
    }
}

module.exports = Mysql_Services