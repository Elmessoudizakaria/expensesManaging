import React from "react";

import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./components/Home";
import ManageCategories from "./components/ManageCategories";
import "./styles.css";

const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/categorie">Categories</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorie" element={<ManageCategories />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
