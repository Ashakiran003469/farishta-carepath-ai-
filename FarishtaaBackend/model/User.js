

const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
firstName : {type : String, required : true},
lastName : {type : String, required : true},
email : {type : String, required : true , unique : true},
password : {type : String, required : true},
userType : {type : String, required : true, enum : ['Doctor', 'Patient'] },
age  : {type : Number, required : true},
gender : {type : String, required : true, enum : ['Male','Female','Others']},
chats : [{type : mongoose.Schema.Types.ObjectId, ref : 'Chats'}]
});


module.exports=mongoose.model('User',userSchema);

 
 
 
 
