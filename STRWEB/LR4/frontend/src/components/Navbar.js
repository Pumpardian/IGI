import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth";
import Axios from "../axios";
import Timezone from "./Timezone";

export default function Navbar() {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const processLogOut = async () => {
        try {
            await Axios.get("/logout");
            logOut();
            navigate("/login");
        } catch (err)
        {
            console.error("Error while logging out: ", err);
            alert("Unable to log out");
        }
    };

    return (
        <nav>
            <div>
                <a href="/" className="companyName">
                PetShop
                </a>

                <Timezone />
            </div>

            <ul className="nav-menu">
              <li className="nav-item">
                <Link to={"/products"} className="nav-link">
                  Products
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/suppliers"} className="nav-link">
                  Suppliers
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/aquisitions"} className="nav-link">
                  Aquisitions
                </Link>
              </li>
            </ul>
            <ul className="nav-menu">
                {!user ? (
                <>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link">
                            Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/register" className="nav-link">
                            Sign Up
                        </Link>
                    </li>
                </>
                ) : (
                <>
                    <li className="nav-item">
                        <Link to="/profile" className="nav-link">
                            Profile
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button onClick={processLogOut} className="nav-button">
                            Log Out
                        </button>
                    </li>
                </>
                )}
            </ul>
        </nav>
    )
}