import React, { useEffect, useState, useContext } from "react";
import Axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Auth";
import { useMessage } from "../Messages";

export default function ProductEdit() {
    const { id } = useParams();
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

        const fetch = async () => {
            try {
                const response = await Axios.get(`/api/products/${id}`);
                const product = response.data;

                updateTitle(product.title);
                updateDescription(product.description);
                updatePrice(product.price);
                updatePartNumber(product.partNumber);
            } catch (err) {
                console.error("Error while receiving product: ", err.response?.data?.message);
            }
        }

        fetch();
    }, [id, user, navigate]);

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await Axios.put(`/api/products/${id}`, { title: title, description: description, price: price, partNumber: partNumber });
            
            navigate("/products");
            showMessage("Product changed successfuly");
        } catch (err) {
            console.error("Error while editing product: ", err.response?.data?.message);
        }
    };

    return (
        <>
            <h1>Edit Product</h1>

            <form onSubmit={handleEdit} onInvalid={showMessage("You've filled every field, right?")}>
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
                <button type="submit">Edit</button>
            </form>
        </>
    );
}