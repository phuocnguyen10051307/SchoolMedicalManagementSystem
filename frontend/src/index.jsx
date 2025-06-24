import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import Parent from "./components/Parent/Parent";
import { AuthProvider } from "./context/AuthContext";
import Student from "./components/Student/Student";
import HomePage from "./components/HomePage/Home/HomePage";
import Service from "./components/HomePage/Service/Service";
import Blog from "./components/HomePage/Blog/Blog";
import SchoolNurse from "./components/SchoolNurse/SchoolNurse";
import MedicalEvent from "./components/SchoolNurse/MedicalEvent";
import DashBoard from "./components/SchoolNurse/Dashboard";
import Vaccination from "./components/SchoolNurse/Vaccination";
import HealthCheckup from "./components/SchoolNurse/HealthCheckup";
import HealthRecord from "./components/SchoolNurse/HealthRecord";
import Report from "./components/SchoolNurse/Report";
import Profile from "./components/SchoolNurse/Profile";
import Login from "./components/HomePage/Login";
import Manager from "./components/Manager/Manager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/HomePage/Register";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="service" element={<Service></Service>}></Route>
          <Route path="blog" element={<Blog></Blog>}></Route>
          <Route path="admin" element={<Admin/>}></Route>
          <Route path="parent" element={<Parent></Parent>}></Route>``
          <Route path="student" element={<Student></Student>}></Route>
          <Route path="nurse" element={<SchoolNurse />}>
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="event" element={<MedicalEvent />} />
            <Route path="vaccination" element={<Vaccination />} />
            <Route path="checkup" element={<HealthCheckup />} />
            <Route path="records" element={<HealthRecord />} />
            <Route path="reports" element={<Report />} />
            <Route path="profile" element={<Profile />} />
            <Route index element={<DashBoard />} />
          </Route>
          <Route path="register" element={<Register/>}></Route>
          <Route path="login" element={<Login></Login>}></Route>
          <Route path="manager" element={<Manager></Manager>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
