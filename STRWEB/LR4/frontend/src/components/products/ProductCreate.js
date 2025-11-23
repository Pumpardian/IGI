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
    }, [user, loading, navigate]);

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

    const handleCreate = async (e) => {
        e.preventDefault();

        updateIsLoading(true);

        try {
            const data = new FormData();
            data.append('title', title);
            data.append('description', description);
            data.append('price', price);
            data.append('partNumber', partNumber);
            data.append('image', image);

            await Axios.post('api/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate("/products");
            showMessage(`Product ${title} created`);
        } catch (err) {
            console.error("Error while creating product: ", err.response?.data?.message);
            showMessage(err.response?.data?.message);
        } finally {
            updateIsLoading(false);
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

                <label>Image</label>
                <input
                    required
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
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </>
    );
}