import { Route, Routes, Link } from "react-router-dom";
import './App.css';

import ProductList from "./components/ProductList.js";
import AquisitionList from "./components/AquisitionList.js";
import SupplierList from "./components/SupplierList.js";

function App() {
  return (
    <div>
      <nav className="navbar">
        <a href="/" className="companyName">
          PetShop
        </a>

        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to={"/products"} className="nav-link">
              Products
            </Link>
          </li>

          <li className="nav-item">
            <Link to={"/suppliers"} className="nav-link">
              Suppliers
            </Link>
          </li>

          <li className="nav-item">
            <Link to={"/aquisitions"} className="nav-link">
              Aquisitions
            </Link>
          </li>
        </ul>
      </nav>

      <div>
        <Routes>
          <Route path="/products" element={<ProductList/>} />
          <Route path="/suppliers" element={<SupplierList/>} />
          <Route path="/aquisitions" element={<AquisitionList/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
