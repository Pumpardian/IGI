import React, { useState, useEffect, useContext } from "react";
import Axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth";
import { useMessage } from "../Messages";

export default function ProductCreate() {
    const [title, updateTitle] = useState("");
    const [description, updateDescription] = useState("");
    const [price, updatePrice] = useState(0);
    const [partNumber, updatePartNumber] = useState("");
    
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const { showMessage } = useMessage();

    useEffect(() => {
        if (!user) {
            navigate("/signin");
        }
    }, [user, navigate]);

    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            await Axios.post("/api/products", { title: title, description: description, price: price, partNumber: partNumber });

            navigate("/products");
            showMessage(`Product ${title} created`);
        } catch (err) {
            console.error("Error while creating product: ", err.response?.data?.message);
        }
    };

    return (
        <>
            <h1>Create Product</h1>

            <form onSubmit={handleCreate}>
                <label>
                    Title
                </label>
                <input 
                    required
                    type="text"
                    placeholder="title"
                    value={title}
                    onChange={(e) => updateTitle(e.target.value)}
                />

                <label>
                    Description
                </label>
                <input 
                    required
                    type="text"
                    placeholder="description"
                    value={description}
                    onChange={(e) => updateDescription(e.target.value)}
                />

                <label>
                    Price
                </label>
                <input 
                    required
                    type="number"
                    min="0"
                    step="any"
                    placeholder="price"
                    value={price}
                    onChange={(e) => updatePrice(e.target.value)}
                />

                <label>
                    Part Number
                </label>
                <input 
                    required
                    type="text"
                    placeholder="part number"
                    value={partNumber}
                    onChange={(e) => updatePartNumber(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </>
    );
}