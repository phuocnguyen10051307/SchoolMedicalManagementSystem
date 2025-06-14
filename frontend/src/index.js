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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<App />} />
          <Route path="admin" element={<Admin />} />
          <Route path="parent/*" element={<Parent />} />
          <Route path="student" element={<Student />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);
reportWebVitals();