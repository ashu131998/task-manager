import logo from './logo.svg';
import './App.css';
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import SignUp from './module/pages/auth/signupPage';
import SignIn from './module/pages/auth/signinPage';
import Dashboard from './module/pages/dashboard';

function App() {
  return (
    <div className="">
      <Routes>
         <Route path="/" element={<SignUp />} />
         <Route path="/signin" element={<SignIn />} />
         <Route path="/dashboard" element={<Dashboard />} />
         </Routes>
    </div>
  );
}

export default App;
