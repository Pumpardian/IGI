import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../axios";
import { AuthContext } from "./Auth";

export default function LogoutPage() {
    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogOut = async () => {
            try {
                await Axios.get("/logout");
            } catch (err) {
                console.error("Error while logging out: ", err.response?.data?.message);
            } finally {
                logOut();
                navigate("/signin");
            }
        };

        handleLogOut();
    }, [logOut, navigate]);

    return (
        <div className="container">
            <h1>
                Logging Out...
            </h1>
        </div>
    )
};