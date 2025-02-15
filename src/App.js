import "./App.css"
import * as React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header/index";

function App() {
  return (
    <>
    <ToastContainer/>
    <Router>  

    <Header/>
    <Routes>
      <Route path="/" element={<Signup/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
   </Router>
    </>
  );
}

export default App;
