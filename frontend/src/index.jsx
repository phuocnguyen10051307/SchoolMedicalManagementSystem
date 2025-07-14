import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// === Component Imports ===
import Admin from "./components/Admin/Admin";
import AdminProfile from "./components/Admin/AdminProfile";
import ManagerSchoolNurse from "./components/Admin/ManagerSchoolNurse";
import ManagerParent from "./components/Admin/ManagerParent";
import ManagerStudent from "./components/Admin/ManagerStudent";

import Parent from "./components/Parent/Parent";
import "./components/Parent/Parent.scss";
import ParentProfile from "./components/Parent/ParentProfile";
import StudentHealthRecordDeclaration from "./components/Parent/StudentHealthRecordDeclaration";
import RegisterMedicine from "./components/Parent/RegisterMedicine";
import HealthHistory from "./components/Parent/HealthHistory";

import Student from "./components/Student/Student";
import HomePage from "./components/HomePage/Home/HomePage";
import Service from "./components/HomePage/Service/Service";
import Blog from "./components/HomePage/Blog/Blog";
import Login from "./components/HomePage/Login";
import Register from "./components/HomePage/Register";

import SchoolNurse from "./components/SchoolNurse/SchoolNurse";
import DashBoard from "./components/SchoolNurse/Dashboard";
import MedicalEvent from "./components/SchoolNurse/MedicalEvent";
import Vaccination from "./components/SchoolNurse/Vaccination";
import HealthCheckup from "./components/SchoolNurse/HealthCheckup";
import HealthRecord from "./components/SchoolNurse/HealthRecord";
import Report from "./components/SchoolNurse/Report";
import Profile from "./components/SchoolNurse/Profile";

import Manager from "./components/Manager/Manager";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="service" element={<Service />} />
          <Route path="blog" element={<Blog />} />
          
          <Route path="admin" element={<Admin />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="nurse" element={<ManagerSchoolNurse />} />
            <Route path="parent" element={<ManagerParent />} />
            <Route path="student" element={<ManagerStudent />} />
          </Route>

          <Route path="parent/*" element={<Parent />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ParentProfile />} />
            <Route path="health" element={<StudentHealthRecordDeclaration />} />
            <Route path="medicine" element={<RegisterMedicine />} />
            <Route path="history" element={<HealthHistory />} />
          </Route>

          <Route path="student" element={<Student />} />

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

          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="manager" element={<Manager />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

    <ToastContainer
      position="top-center"
      autoClose={1000}
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

// For performance measuring
reportWebVitals();
