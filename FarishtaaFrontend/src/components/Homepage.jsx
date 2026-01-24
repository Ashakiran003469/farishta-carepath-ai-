import FarishtaaLogo from "../components/logo/FarishtaaLogo"
import robot from "../assets/Chat.svg"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";
import {easeInOut, motion} from "framer-motion"
import brain from "../assets/brain.svg"
import translate from "../assets/translate.png"
import doctorIcon from "../assets/doctorIcon.svg"

export default function HomePage(){
  const {userId}=useSelector((state)=>state.auth);
  const navigate=useNavigate();
   return (
     <section className="min-h-screen w-screen inset-0  bg-rose-100 relative"> 
       <motion.div className="h-[45vh] w-full bg-amber-100 grid grid-cols-1 sm:grid-cols-2 gap-20 place-items-center px-2"
       initial={{opacity : 0 , y:20}}
       animate={{opacity : 1 , y : 0}}
       transition={{duration : 1.2 , ease : easeInOut}}
       
       >
        <div className="flex flex-col justify-center mt-0 px-2">
              <h1 className="font-bold text-4xl sm:text-5xl font-sans text-red-500 flex items-center gap-1">
                <span>Farishtaa</span>
                <FarishtaaLogo className="w-20 h-20" />
              </h1>
             
              <p className="font-bold text-2xl sm:text-3xl ">Your AI Health Assistant</p>

              <p className="font-medium text-xl text-wrap">Get Instant AI powered health insights and best nearby doctors and hospitals-- anytime , anywhere.</p>
                    <div>
                    <button className="bg-red-500 text-white font-bold font-sans px-5 mt-4 border border-red-500 rounded-sm py-2 transition-transform hover:scale-105  " onClick={()=>navigate(`/symptoms/${userId}`)}>Check Symptoms</button>
                    <button className="bg-white text-black font-sans border border-gray-700 m-3 font-semibold py-2 px-5 rounded-sm transition-transform hover:scale-105 " onClick={()=>navigate("/categories")}>Consult Doctor</button>
                </div>
        </div>
        <div className="hidden md:block lg:block">
                <motion.img src={robot} alt="Robot" className="w-[400px] h-80 object-contain" 
                 animate={{y: [0,-10,0]}}
              transition={{
                duration : 4,
                repeat : Infinity,
                ease : easeInOut
              } 
              }            
                />
         </div>
         </motion.div>
         <motion.div className="flex flex-col gap-2"
         initial={{x : -20 , opacity : 0}}
         animate={{x : 0 ,opacity : 1}}
         transition={{duration : 1.2 , ease : "easeInOut" }}
         
         
         >
     <div className="flex items-center mt-2">
       <div className="border-1 border-gray-400 flex-grow opacity-20"/>
       <span className="font-sans text-blue-950 font-bold text-2xl sm:text-3xl px-2 mx-2">How Farishtaa Helps You</span>
       <div className="border-1 border-gray-400 flex-grow opacity-20"/>
     </div>

     <div className="flex gap-6 items-center justify-center mt-4 flex-col sm:flex-row">
      <div className="bg-white h-[250px] w-[300px] flex flex-col items-center justify-center shadow-2xl drop-shadow-blue-950 rounded-xl">
         <img src={brain} alt=""  className="h-40 w-40 object-contain"/>
         <p className ="font-sans text-blue-950 font-bold text-2xl "><span className="text-red-500">AI</span> Symptoms Checker</p>
         <p className="text-sm px-4 leading-tight font-sans">Describe symptoms & get instant sights</p>
      </div>
      <div className="bg-white h-[250px] w-[300px] flex flex-col items-center justify-center shadow-2xl drop-shadow-blue-950 rounded-xl">
      <img src={doctorIcon} alt=""  className="h-40 w-80 object-contain"/>
       <p className ="font-sans text-blue-950 font-bold text-2xl ">Doctor Consultation</p>
         <p className="text-sm px-2 leading-tight font-sans">Connect with healthcare professionals</p>
      </div>
      <div className="bg-white h-[250px] w-[300px] flex flex-col items-center justify-center shadow-2xl drop-shadow-blue-950 rounded-xl">
       <img src={translate} alt="" className="h-40  w-40 object-contain mx-auto mt-3" />
        <p className ="font-sans text-blue-950 font-bold text-2xl ">Multilingual Support</p>
         <p className="text-sm px-2 leading-tight font-sans">Health guidance in your language</p>
      </div>
     </div>
  </motion.div>

     </section>
   )
 }