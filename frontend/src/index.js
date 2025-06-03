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
import {AuthProvider} from "./context/AuthContext";
import Student from "./components/Student/Student";
import Login from "./components/HomePage/Login";
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
