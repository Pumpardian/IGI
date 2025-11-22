import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "./Auth";

const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <nav>
            <div className="info">
                <NavLink to="/" className={`${({ isActive }) => (isActive ? "active" : "")}`}>
                    <img src={process.env.PUBLIC_URL + "logo192.png"} className="logo" alt="logo"/>
                </NavLink>
            </div>

            <ul className="nav-menu">
              <li className="nav-item">
                <NavLink to={"/products"} className={`nav-link ${({ isActive }) => (isActive ? "active" : "")}`}>
                  Products
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to={"/suppliers"} className={`nav-link ${({ isActive }) => (isActive ? "active" : "")}`}>
                  Suppliers
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to={"/aquisitions"} className={`nav-link ${({ isActive }) => (isActive ? "active" : "")}`}>
                  Aquisitions
                </NavLink>
              </li>
            </ul>
            <ul className="nav-menu">
                {!user ? (
                <>
                    <li className="nav-item">
                        <Link to="/signin" className="nav-link">
                            Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/signup" className="nav-link">
                            Sign Up
                        </Link>
                    </li>
                </>
                ) : (
                <>
                    {/* <li className="nav-item">
                        <Link to="/profile" className="nav-link">
                            Profile
                        </Link>
                    </li> */}
                    <li className="nav-item">
                        <Link to="/logout" className="nav-link">
                            Log Out
                        </Link>
                    </li>
                </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar;