import React, { useState, useContext, useEffect, useRef } from "react";
import Axios from "../axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./Auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMessage } from "./Messages";

export default function SignIn() {
    const [username, updateUsername] = useState("");
    const [password, updatePassword] = useState("");
    const [searchParams] = useSearchParams();
    const processedToken = useRef(false);

    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const { showMessage } = useMessage();

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

            showMessage("Sign In - Success");
            navigate("/");
        } catch (err) {
            console.error("Error while signing in: ", err.response?.data?.message);
            showMessage("Sign In - Fail");
        }
    };

    useEffect(() => {
        const token = searchParams.get('token');
        if (token && !processedToken.current) {
            processedToken.current = true;
            handleGoogleToken(token);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleGoogleToken = (token) => {
        try {
            localStorage.setItem("token", token);
            const decoded = jwtDecode(token);
            signIn({ username: decoded.username, id: decoded.id });

            showMessage("Google Sign In - Success");
            navigate("/");
        } catch (err) {
            console.error("Error processing Google token: ", err);
            showMessage("Google Sign In - Fail");
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