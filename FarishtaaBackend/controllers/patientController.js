const Chats=require('../model/Chats');
const geminiService=require('../service/geminiService')
const User=require('../model/User');

exports.postSymptomChecker=async (req,res,next)=>{
const {userId}=req.params;
const {userPrompt,language}=req.body;
try{
const user=await User.findById(userId);
  const previousChats = await Chats.find({
      _id: { $in: user.chats }
    }).sort({ createdAt: 1 });
let response;
  
 const rawText=await geminiService.generateContent(language,userPrompt,previousChats);
 
 response=rawText; 
 const assistantChat=new Chats({
  user : userId,
  role : 'assistant',
  content : response,
 });
 const patientChat=new Chats({
  user : userId,
  role : 'patient',
  content : userPrompt,
 });
  await patientChat.save();
  await assistantChat.save();
  user.chats.push(patientChat._id);
  user.chats.push(assistantChat._id);
  await user.save();
  return res.status(201).json({chats : [patientChat,assistantChat]});

}catch(err){
    console.error('Error parsing JSON response:', err);
    res.status(400).json({messages : 'Error while symptoms checking'});
  }


}

exports.getPreviousChats=async (req,res,next)=>{
const {userId}=req.params;
try{
  const user=await User.findById(userId);
  if(!user)
    return res.status(404).json({message : 'User not found'});
    let chats = await Chats.find({
      _id: { $in: user.chats }
    });
    chats=chats.sort((a,b)=>
      user.chats.indexOf(a._id.toString())-user.chats.indexOf(b._id.toString())
    );
    if(chats.length===0)
      chats.push({ 
    role :"assistant" ,
    content :"Hello! This is your Farishtaa . Please describe your symptoms so i can assist you further",})
    return res.status(200).json({chats});
}catch(error){
  res.status(404).json({message : "Error while fetching chats"});
}
}