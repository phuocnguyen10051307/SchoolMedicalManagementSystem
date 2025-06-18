import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import Parent from "./components/Parent/Parent";
import { AuthProvider } from "./context/AuthContext";
import Student from "./components/Student/Student";
import Login from "./components/HomePage/Login";
import ShcoolNurse from "./components/SchoolNurse/SchoolNurse";
import Manager from "./components/Manager/Manager";
import { Toast } from "bootstrap";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<App />}></Route>
          <Route path="login" element={<Login></Login>}></Route>
          <Route path="admin" element={<Admin></Admin>}></Route>
          <Route path="parent" element={<Parent></Parent>}></Route>
          <Route path="student" element={<Student></Student>}></Route>
          <Route path="schoolnurse" element={<ShcoolNurse></ShcoolNurse>}></Route>
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
