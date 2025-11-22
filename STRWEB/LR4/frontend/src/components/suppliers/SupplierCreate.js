import React, { useEffect, useState, useContext } from "react";
import Axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth";
import { useMessage } from "../Messages";

export default function SupplierCreate() {
    const [name, updateName] = useState("");
    const [phone, updatePhone] = useState("");
    const [address, updateAddress] = useState("");
    
    const [phoneError, updatePhoneError] = useState("");

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const { showMessage } = useMessage();

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
        if (!user) {
            navigate("/signin");
        }
    }, [user, navigate]);

    const handleCreate = async (e) => {
        e.preventDefault();

        const finalValidation = validatePhone(phone);
        if (!finalValidation.isValid) {
            updatePhoneError("Please enter a valid phone number");
            return;
        }

        try {
            await Axios.post("/api/suppliers", {
                name: name,
                phone: finalValidation.number,
                address: address
            });
            
            navigate("/suppliers");
            showMessage(`Supplier ${name} created`);
        } catch (err) {
            console.error("Error while creating supplier: ", err.response?.data?.message);
        }
    };

    return (
        <>
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
                    Create
                </button>
            </form>
        </>
    );
}