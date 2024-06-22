import { useState } from 'react'
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Recipes from "./pages/Recipes";
import Add from "./pages/Add";
import Update from "./pages/Update";
import View from "./pages/View";
import "./style.css";
import "./View-styles.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Recipes/>}></Route>
          <Route path="/add" element={<Add/>}></Route>
          <Route path="/update/:id" element={<Update/>}></Route>
          <Route path="/view/:id" element={<View/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
