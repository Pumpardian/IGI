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
    
    const [image, updateImage] = useState(null);
    const [imageError, updateImageError] = useState("");
    const [imagePreview, updateImagePreview] = useState(null);
    const [isLoading, updateIsLoading] = useState(false);


    const navigate = useNavigate();

    const { user, loading } = useContext(AuthContext);
    const { showMessage } = useMessage();

    useEffect(() => {
        if (!loading && !user) {
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
                if (product.image) {
                    updateImagePreview(`http://localhost:8000${product.image.url}`);
                }
            } catch (err) {
                console.error("Error while receiving product: ", err.response?.data?.message);
                showMessage(err.response?.data?.message);
            }
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user, loading, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            if (!file.type.startsWith('image/')) {
                updateImageError("Please select an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                updateImageError("Image size must be less than 5MB");
                return;
            }

            updateImage(file);
            updateImageError("");
            
            const reader = new FileReader();
            reader.onload = (e) => {
                updateImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        if (image) {
            updateIsLoading(true);
        }

        try {
            const data = new FormData();
            data.append('title', title);
            data.append('description', description);
            data.append('price', price);
            data.append('partNumber', partNumber);
            if (image) {
                data.append('image', image);
            }

            await Axios.put(`/api/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            navigate("/products");
            showMessage("Product changed successfuly");
        } catch (err) {
            console.error("Error while editing product: ", err.response?.data?.message);
            showMessage(err.response?.data?.message);
        }
    };

    return (
        <>
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
                
                <label>Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <small>Select one image (max 5MB)</small>
                {imageError && <div className="validation-error">{imageError}</div>}

                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                    </div>
                )}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Editing...' : 'Edit'}
                </button>
            </form>
        </>
    );
}