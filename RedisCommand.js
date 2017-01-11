"use strict";

var db = {};

class RedisCommand {
   constructor(command,params){
      this.command = command;
      this.params = params;
   }

   execute(){
      switch (this.command) {
        case 'SET': {
          return this.set_command();
          break;
        }
        case 'GET': {
          return this.get_command();
          break;
        }
        case 'EXISTS': {
          return this.exists_command();
          break;
        }
        case 'DEL': {
          return this.del_command(); 
          break;
        }
        default:{
          return "-This Command is NOT supported\r\n";
        }
        
      }
    }

     set_command(){
        var i, n = this.params.length, x=0;
        if (n<2) return "-Too few Arguments\r\n";
        
        if(this.setKey(this.params[0],this.params[1]))
          return "+OK\r\n";
        else
          return "-Internal Error\r\n";

     }


     get_command(){
        var value = this.getKey(this.params[0]);
        if(value)
          return "$" + value.length + "\r\n" + value + "\r\n";
        else
          return "$-1\r\n";

     }

     exists_command(){
       var i, n = this.params.length, x=0;
        if (n<1) return "-Too few Arguments\r\n";
 
       if(this.getKey(this.params[0]))
         return ":1\r\n";
       else
         return ":0\r\n"; 
     }

     del_command(){
        var i, n = this.params.length, x=0;
        if (!n) return "-Wrong Argument\r\n";
        for (i = 0; i < n; i++)
          if (this.setKey(this.params[i], null)) x++;
        return ":" + x.toString() + "\r\n";
     }

     setKey(key,value){
        db[key] = value;
        return true;
     }

     getKey(key){
        if(db[key])
         return db[key];
        else 
         return false;
     }

}


module.exports = RedisCommand
