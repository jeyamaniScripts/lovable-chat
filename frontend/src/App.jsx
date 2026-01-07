import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={2000} />
      <Outlet />
    </div>
  );
};

export default App;
