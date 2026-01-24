import React, { useRef, useState } from "react";
import FarishtaaLogo from "../logo/FarishtaaLogo";
import { useNavigate } from "react-router-dom";
import ErrorMessages from "./common/ErrorMessages";
const Signup = () => {
  const firstNameref = useRef();
  const lastNameref = useRef();
  const emailref = useRef();
  const passwordref = useRef();
  const ageref = useRef();
  const navigate=useNavigate();

  const [gender, setGender] = useState("Male");
  const [userType, setUserType] = useState("Patient");
  const [errors,setErrors]=useState([]);
  const handleSubmit =async (e) => {
    e.preventDefault();
   try{
  const res=await fetch('https://farishtaa.onrender.com/api/auth/signup',{
        method:'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
          firstName : firstNameref.current.value,
            lastName : lastNameref.current.value,
            email : emailref.current.value,
            password : passwordref.current.value,
            age : ageref.current.value,
            gender : gender,
            userType : userType,
        })
  }
    );
    if(res.status===201){
      navigate('/login');
    } 
     if(res.status===422){
    const data=await res.json();
     setErrors(data.errorMessages);
     return ;
    }
   }catch(err){
   console.error('Error during signup:', err);
   setErrors(['An unexpected error occurred. Please try again later.']);
  return;   
}

  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-xl bg-white shadow-md rounded-2xl p-10 border border-red-200"
  >
    {/* Logo Block */}
    <div className="flex flex-col items-center mb-8">
      <FarishtaaLogo />

      <h2 className="text-3xl font-bold text-red-600 mt-3 tracking-wide drop-shadow-[0_2px_6px_rgba(255,0,0,0.3)]">
        Farishtaa
      </h2>
      <p className="text-sm text-red-500 mt-1">
        Health . Trust . Care
      </p>
    </div>

    {/* Heading */}
    <h3 className="text-xl font-semibold text-red-700 mb-6 text-center">
      Create Your Account
    </h3>
 <ErrorMessages  errors={errors} />

    {/* Two Column Name Fields */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-red-700">
          First Name
        </label>
        <input
          type="text"
          ref={firstNameref}
          className="w-full mt-1 p-2 border border-red-300 rounded-lg 
                   focus:ring-2 focus:ring-red-500 outline-none"
          placeholder="Enter first name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-red-700">
          Last Name
        </label>
        <input
          type="text"
          ref={lastNameref}
          className="w-full mt-1 p-2 border border-red-300 rounded-lg
                   focus:ring-2 focus:ring-red-500 outline-none"
          placeholder="Enter last name"
        />
      </div>
    </div>

    {/* Email */}
    <label className="block mt-4 text-sm font-medium text-red-700">
      Email
    </label>
    <input
      type="email"
      ref={emailref}
      className="w-full mt-1 p-2 border border-red-300 rounded-lg 
                 focus:ring-2 focus:ring-red-500 outline-none"
      placeholder="your@example.com"
    />

    {/* Password */}
    <label className="block mt-4 text-sm font-medium text-red-700">
      Password
    </label>
    <input
      type="password"
      ref={passwordref}
      className="w-full mt-1 p-2 border border-red-300 rounded-lg
                 focus:ring-2 focus:ring-red-500 outline-none"
      placeholder="Enter password"
    />

    {/* Age */}
    <label className="block mt-4 text-sm font-medium text-red-700">
      Age
    </label>
    <input
      type="number"
      ref={ageref}
      className="w-full mt-1 p-2 border border-red-300 rounded-lg
                 focus:ring-2 focus:ring-red-500 outline-none"
      placeholder="Your age"
    />

    {/* Gender */}
    <label className="block mt-5 mb-2 text-sm font-medium text-red-700">
      Gender
    </label>
    <div className="flex gap-3 mb-4">
      {["Male", "Female", "Others"].map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => setGender(g)}
          className={`px-5 py-2 rounded-full border transition text-sm
          ${
            gender === g
              ? "border-red-600 bg-red-100 text-red-700"
              : "border-red-300 text-red-500 hover:bg-red-50"
          }
        `}
        >
          {g}
        </button>
      ))}
    </div>

    {/* User Type */}
    <label className="block mb-2 text-sm font-medium text-red-700">
      User Type
    </label>
    <div className="flex gap-3 mb-8">
      {["Patient", "Doctor"].map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => setUserType(u)}
          className={`px-5 py-2 rounded-full border transition text-sm
          ${
            userType === u
              ? "border-red-600 bg-red-100 text-red-700"
              : "border-red-300 text-red-500 hover:bg-red-50"
          }
        `}
        >
          {u}
        </button>
      ))}
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="w-full bg-red-600 text-white py-3 rounded-lg 
                 text-lg font-semibold hover:bg-red-700 transition"
    >
      Sign Up
    </button>
  </form>
</div>

  );
};

export default Signup;
