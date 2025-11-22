import React, { useState, useEffect } from "react";
import Axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

export default function SupplierEdit() {
    const { id } = useParams();
    const [name, updateName] = useState("");
    const [phone, updatePhone] = useState("");
    const [address, updateAddress] = useState("");

    const [phoneError, updatePhoneError] = useState("");
    
    const navigate = useNavigate();

    const validatePhone = (phoneNumber) => {
        const isValid = /^((\+375|80)\s?\(?\d{2}\)?|8\s?\(?\d{3}\)?)\s?\d{3}[- ]?\d{2}[- ]?\d{2}$/.test(phoneNumber);

        return {
            isValid,
            number: phoneNumber
        };
    };

    const handlePhoneChange = (value) => {
        const validation = validatePhone(value);
        
        updatePhone(validation.number);
        updatePhoneError(validation.isValid ? "" : "Please enter a valid phone number");
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await Axios.get(`/api/suppliers/${id}`);
                const supplier = response.data;

                updateName(supplier.name);
                handlePhoneChange(supplier.phone);
                updateAddress(supplier.address);
            } catch (err) {
                console.error("Error while receiving supplier: ", err);
            }
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleEdit = async (e) => {
        e.preventDefault();

        const finalValidation = validatePhone(phone);
        if (!finalValidation.isValid) {
            updatePhoneError("Please enter a valid phone number");
            return;
        }

        try {
            await Axios.put(`/api/suppliers/${id}`, { 
                name: name, 
                phone: finalValidation.number,
                address: address 
            });
            navigate("/suppliers");
        } catch (err) {
            console.error("Error while editing supplier: ", err);
        }
    };

    return (
        <>
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
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={phoneError ? "error" : ""}
                />
                {phoneError && <div className="validation-error">{phoneError}</div>}

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
                
                <button 
                    type="submit"
                    disabled={phoneError}
                >
                    Edit
                </button>
            </form>
        </>
    );
}