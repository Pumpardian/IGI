import React, { useState } from "react";
import Axios from "../../axios";
import { useNavigate } from "react-router-dom";

export default function SupplierCreate() {
    const [name, updateName] = useState("");
    const [phone, updatePhone] = useState("");
    const [address, updateAddress] = useState("");
    
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            await Axios.post("/api/suppliers", { name: name, phone: phone, address: address });
            navigate("/suppliers");
        } catch (err) {
            console.error("Error while creating supplier: ", err);
        }
    };

    return (
        <div className="container">
            <h1>Create Supplier</h1>

            <form onSubmit={handleCreate}>
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
                <button type="submit">Create</button>
            </form>
        </div>
    );
}