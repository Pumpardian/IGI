import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./Auth.js";
import './App.css';

import ProductList from "./components/ProductList.js";
import AquisitionList from "./components/AquisitionList.js";
import SupplierList from "./components/SupplierList.js";

import Navbar from "./components/Navbar.js";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/products" element={<ProductList/>} />
        <Route path="/suppliers" element={<SupplierList/>} />
        <Route path="/aquisitions" element={<AquisitionList/>} />
      </Routes>
    </div>
  );
}

export default function ExportApp() {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </BrowserRouter>
  );
}
