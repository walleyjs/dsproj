var mongoose=require("mongoose");
var userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    todo:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:"Todo"
        }
    ]
})
module.exports=mongoose.model("User",userSchema);