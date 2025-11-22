import React, { useState } from "react";
import Axios from "../axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [username, updateUsername] = useState("");
    const [email, updateEmail] = useState("");
    const [password, updatePassword] = useState("");

    const [emailError, updateEmailError] = useState("");

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        return {
            isValid,
            email: email
        };
    };

    const handleEmailChange = (value) => {
        const validation = validateEmail(value);
        
        updateEmail(validation.email);
        updateEmailError(validation.isValid ? "" : "Please enter a valid email");
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const finalValidation = validateEmail(email);
        if (!finalValidation.isValid) {
            updateEmailError("Please enter a valid email");
            return;
        }

        try {
            await Axios.post("http://localhost:8000/api/users/signup", {
                username,
                email,
                password
            });

            alert("Sign Up - Success");
            navigate("/signin");
        } catch (err) {
            console.error("Error while signing up: ", err);
            alert("Sign Up - Fail");
        }
    };

    return (
        <div className="container">
            <h1>
                Sign Up
            </h1>

            <form onSubmit={handleSignUp}>
                <label>
                    Username
                </label>
                <input
                    required
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => updateUsername(e.target.value)}
                />

                <label>
                    Email
                </label>
                <input
                    required
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={emailError ? "error" : ""}
                />
                {emailError && <div className="validation-error">{emailError}</div>}

                <label>
                    Password
                </label>
                <input
                    required
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => updatePassword(e.target.value)}
                />

                <button 
                    type="submit"
                    disabled={emailError}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};