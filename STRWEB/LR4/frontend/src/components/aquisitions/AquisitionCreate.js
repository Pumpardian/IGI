import React, { useState, useEffect, useContext } from "react";
import Axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth";
import { useMessage } from "../Messages";

export default function AquisitionCreate() {
    const [productID, updateProductID] = useState("");
    const [supplierID, updateSupplierID] = useState("");
    const [price, updatePrice] = useState(0);
    const [count, updateCount] = useState(0);
    const [date, updateDate] = useState(new Date());
    
    const [products, updateProducts] = useState([]);
    const [suppliers, updateSuppliers] = useState([]);

    const navigate = useNavigate();

    const { user, loading } = useContext(AuthContext);
    const { showMessage } = useMessage();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/signin");
        }

        const fetchProducts = async () => {
            try {
                const response = await Axios.get(`/api/products`);
                updateProducts(response.data);
            } catch (err) {
                console.error("Error while receiving products: ", err.response?.data?.message);
                showMessage(err.response?.data?.message);
            }
        }

        const fetchSuppliers = async () => {
            try {
                const response = await Axios.get(`/api/suppliers`);
                updateSuppliers(response.data);
            } catch (err) {
                console.error("Error while receiving suppliers: ", err.response?.data?.message);
                showMessage(err.response?.data?.message);
            }
        }

        fetchProducts();
        fetchSuppliers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading, navigate]);

    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            await Axios.post("/api/aquisitions", { productID: productID, supplierID: supplierID, price: price, count: count, date: date });
            
            navigate("/aquisitions");
            showMessage("Aquisition registered");
        } catch (err) {
            console.error("Error while creating aquisition: ", err.response?.data?.message);
            showMessage(err.response?.data?.message);
        }
    };

    return (
        <>
            <h1>Create Aquisition</h1>

            <form onSubmit={handleCreate}>
                <label>
                    Product
                </label>
                <select 
                    required
                    value={productID}
                    onChange={(e) => updateProductID(e.target.value)}
                >
                    <option value="">Select a product</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.title}
                        </option>
                    ))}
                </select>

                <label>
                    Supplier
                </label>
                <select 
                    required
                    value={supplierID}
                    onChange={(e) => updateSupplierID(e.target.value)}
                >
                    <option value="">Select a supplier</option>
                    {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>

                <label>
                    Price
                </label>
                <input 
                    required
                    type="number"
                    step="any"
                    min="0"
                    placeholder="price"
                    value={price}
                    onChange={(e) => updatePrice(e.target.value)}
                />

                <label>
                    Count
                </label>
                <input 
                    required
                    type="number"
                    min="1"
                    placeholder="count"
                    value={count}
                    onChange={(e) => updateCount(e.target.value)}
                />

                <label>
                    Date
                </label>
                <input 
                    required
                    type="date"
                    placeholder="date"
                    value={date}
                    onChange={(e) => updateDate(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </>
    );
}