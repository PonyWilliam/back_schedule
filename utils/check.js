let Check = {
    vailid:function(){
        for(let x = 0;x<arguments.length;x++){
            console.log(arguments[x])
            if(arguments[x] == undefined || arguments[x] == null || arguments == ""){
                return false
            }
        }
        return true
    }
}
module.exports = Check