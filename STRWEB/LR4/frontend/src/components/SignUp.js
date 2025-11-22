import React, { useState } from "react";
import Axios from "../axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [username, updateUsername] = useState("");
    const [password, updatePassword] = useState("");

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            await Axios.post("http://localhost:8000/api/users/signup", {
                username,
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
                    Password
                </label>
                <input
                    required
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => updatePassword(e.target.value)}
                />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};