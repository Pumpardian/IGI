import React, { useState, useEffect } from "react";
import Axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

export default function SupplierEdit() {
    const { id } = useParams();
    const [name, updateName] = useState("");
    const [phone, updatePhone] = useState("");
    const [address, updateAddress] = useState("");
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await Axios.get(`/api/suppliers/${id}`);
                const supplier = response.data;

                updateName(supplier.name);
                updatePhone(supplier.phone);
                updateAddress(supplier.address);
            } catch (err) {
                console.error("Error while receiving supplier: ", err);
            }
        }

        fetch();
    }, [id]);

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await Axios.put(`/api/suppliers/${id}`, { name: name, phone: phone, address: address });
            navigate("/suppliers");
        } catch (err) {
            console.error("Error while editing supplier: ", err);
        }
    };

    return (
        <div className="container">
            <h1>Edit Supplier</h1>

            <form onSubmit={handleEdit}>
                <label>
                    Name
                </label>
                <input 
                    required
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => updateName(e.target.value)}
                />

                <label>
                    Phone
                </label>
                <input 
                    required
                    type="text"
                    placeholder="phone"
                    value={phone}
                    onChange={(e) => updatePhone(e.target.value)}
                />

                <label>
                    Address
                </label>
                <input 
                    required
                    type="text"
                    placeholder="address"
                    value={address}
                    onChange={(e) => updateAddress(e.target.value)}
                />
                <button type="submit">Edit</button>
            </form>
        </div>
    );
}