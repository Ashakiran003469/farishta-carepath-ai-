import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./nav/NavBar.jsx";
import HomePage from "./components/Homepage.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import AISymptomsChecker from "./components/patient/AISymptomsChecker.jsx";
import Categories from "./components/doctor/Categories.jsx";
import DoctorByCategory from "./components/doctor/DoctorByCategory.jsx";
import DoctorProfile from "./components/doctor/DoctorProfile.jsx";

function App() {

      
  return (
    <BrowserRouter>
      <div>
   
       <NavBar />

        
          <Routes>
              <Route path="/" element={<HomePage />} />
              </Routes>
              <main className="flex-grow w-full">
                <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          
            <Route path="/symptoms/:userId" element={<AISymptomsChecker />} />
            <Route path="/categories" element={<Categories />}/>
            <Route path="/nearby-search/:category" element={<DoctorByCategory />}/>
            <Route path="/doctor/:doctorId" element={<DoctorProfile />}/>
            
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
