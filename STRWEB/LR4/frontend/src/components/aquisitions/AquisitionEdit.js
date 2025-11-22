import React, { useState, useEffect, useContext } from "react";
import Axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Auth";
import { useMessage } from "../Messages";

export default function AquisitionEdit() {
    const { id } = useParams();
    const [productID, updateProductID] = useState("");
    const [supplierID, updateSupplierID] = useState("");
    const [price, updatePrice] = useState(0);
    const [count, updateCount] = useState(0);
    const [date, updateDate] = useState(new Date());
    
    const [products, updateProducts] = useState([]);
    const [suppliers, updateSuppliers] = useState([]);

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const { showMessage } = useMessage();

    useEffect(() => {
        if (!user) {
            navigate("/signin");
        }

        const fetchProducts = async () => {
            try {
                const response = await Axios.get(`/api/products`);
                updateProducts(response.data);
            } catch (err) {
                console.error("Error while receiving products: ", err.response?.data?.message);
            }
        }

        const fetchSuppliers = async () => {
            try {
                const response = await Axios.get(`/api/suppliers`);
                updateSuppliers(response.data);
            } catch (err) {
                console.error("Error while receiving suppliers: ", err.response?.data?.message);
            }
        }

        const fetch = async () => {
            try {
                const response = await Axios.get(`/api/aquisitions/${id}`);
                const aquisition = response.data;

                updateProductID(aquisition.productID);
                updateSupplierID(aquisition.supplierID);
                updatePrice(aquisition.price);
                updateCount(aquisition.count);
                updateDate(aquisition.date)
            } catch (err) {
                console.error("Error while receiving aquisition: ", err.response?.data?.message);
            }
        }

        fetchProducts();
        fetchSuppliers();
        fetch();
    }, [id, user, navigate]);

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await Axios.put(`/api/aquisitions/${id}`, { productID: productID, supplierID: supplierID, price: price, count: count, date: date });
            
            navigate("/aquisitions");
            showMessage("Aquisition corrected successfuly");
        } catch (err) {
            console.error("Error while editing aquisition: ", err);
        }
    };

    return (
        <>
            <h1>Edit Aquisition</h1>

            <form onSubmit={handleEdit} onInvalid={showMessage("You've filled every field, right?")}>
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
                    value={date ? new Date(date).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateDate(e.target.value)}
                />
                <button type="submit">Edit</button>
            </form>
        </>
    );
}