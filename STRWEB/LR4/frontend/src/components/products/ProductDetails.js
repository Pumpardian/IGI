import React, { useEffect, useState } from "react";
import Axios from "../../axios";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, updateProduct] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await Axios.get(`/api/products/${id}`);
                updateProduct(response.data);
            } catch (err) {
                console.error("Error while receiving product: ", err.response?.data?.message);
            }
        }

        fetch();
    }, [id]);

    if (!product) {
        return (
            <p>
                Loading...
            </p>
        )
    }

    return (
        <>
            <h1>Product Details</h1>

            <p>
                <strong>ID:</strong> {product.id}
            </p>
            <p>
                <strong>Title:</strong> {product.title}
            </p>
            <p>
                <strong>Description:</strong> {product.description}
            </p>
            <p>
                <strong>Price:</strong> {product.price}
            </p>
            <p>
                <strong>Part Number:</strong> {product.partNumber}
            </p>
            {product.image && (
                <img 
                    src={`http://localhost:8000${product.image.url}`}
                    alt={product.name}
                    className="product-image"
                />
            )}
        </>
    );
}