import React, { useEffect, useState } from "react";
import Axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductEdit() {
    const { id } = useParams();
    const [title, updateTitle] = useState("");
    const [description, updateDescription] = useState("");
    const [price, updatePrice] = useState(0);
    const [partNumber, updatePartNumber] = useState("");
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await Axios.get(`/api/products/${id}`);
                const product = response.data;

                updateTitle(product.title);
                updateDescription(product.description);
                updatePrice(product.price);
                updatePartNumber(product.partNumber);
            } catch (err) {
                console.error("Error while receiving product: ", err);
            }
        }

        fetch();
    }, [id]);

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await Axios.put(`/api/products/${id}`, { title: title, description: description, price: price, partNumber: partNumber });
            navigate("/products");
        } catch (err) {
            console.error("Error while editing product: ", err);
        }
    };

    return (
        <div className="container">
            <h1>Edit Product</h1>

            <form onSubmit={handleEdit}>
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
                <button type="submit">Edit</button>
            </form>
        </div>
    );
}