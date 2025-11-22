import React, { useState, useContext } from "react";
import Axios from "../axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./Auth";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const [username, updateUsername] = useState("");
    const [password, updatePassword] = useState("");

    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios.post("http://localhost:8000/api/users/signin", {
                username,
                password
            }, { withCredentials: true });
            
            const token = response.data.token;
            localStorage.setItem("token", token);

            const decoded = jwtDecode(token);
            signIn({ username: decoded.username, id: decoded.id });

            alert("Sign In - Success");
            navigate("/");
        } catch (err) {
            console.error("Error while signing in: ", err.response?.data?.message);
            alert("Sign In - Fail");
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:8000/google";
    }

    return (
        <div className="container">
            <h1>
                Sign In
            </h1>

            <form onSubmit={handleSignIn}>
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

                <button type="submit">Sign In</button>
            </form>

            <button onClick={handleGoogleSignIn} className="google">
                Sign In using Google
            </button>
        </div>
    );
};