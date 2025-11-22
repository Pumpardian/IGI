import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./components/Auth.js";
import { MessageProvider } from "./components/Messages.js";
import './App.css';

import Layout from "./components/Layout.js"

import ProductList from "./components/products/ProductList.js";
import ProductDetails from "./components/products/ProductDetails.js"
import ProductCreate from "./components/products/ProductCreate.js"
import ProductEdit from "./components/products/ProductEdit.js"

import AquisitionList from "./components/aquisitions/AquisitionList.js";
import AquisitionCreate from "./components/aquisitions/AquisitionCreate.js";
import AquisitionEdit from "./components/aquisitions/AquisitionEdit.js";

import SupplierList from "./components/suppliers/SupplierList.js";
import SupplierCreate from "./components/suppliers/SupplierCreate.js";
import SupplierEdit from "./components/suppliers/SupplierEdit.js";

import SignUp from "./components/SignUp.js"
import SignIn from "./components/SignIn.js"
import LogOut from "./components/LogOut.js"

import Navbar from "./components/Navbar.js";

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main>
        <Routes>
          <Route path="/products" element={<Layout/>}>
            <Route index element={<ProductList/>}/>
            <Route path=":id" element={<ProductDetails/>}/>
            <Route path="create" element={<ProductCreate/>}/>
            <Route path=":id/edit" element={<ProductEdit/>}/>
          </Route>
          <Route path="/suppliers" element={<Layout/>}>
            <Route index element={<SupplierList/>}/>
            <Route path="create" element={<SupplierCreate/>}/>
            <Route path=":id/edit" element={<SupplierEdit/>}/>
          </Route>
          <Route path="/aquisitions" element={<Layout/>}>
            <Route index element={<AquisitionList/>}/>
            <Route path="create" element={<AquisitionCreate/>}/>
            <Route path=":id/edit" element={<AquisitionEdit/>}/>
          </Route>

          <Route path="/signup" element={<SignUp/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/logout" element={<LogOut/>} />
        </Routes>
      </main>

      <footer>
        <nav>
          <span className="text-muted nowrap">
            @Pet Shop. 2025. All rights reserved.
          </span>
        </nav>
      </footer>
    </>
  );
}

export default function ExportApp() {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <MessageProvider>
          <App />
        </MessageProvider>
      </AuthWrapper>
    </BrowserRouter>
  );
}
