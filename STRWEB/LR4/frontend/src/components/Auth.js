import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthWrapper = ({ children }) => {
    const [user, updateUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser) {
            updateUser(savedUser);
        }
    }, []);

    const signIn = (data) => {
        updateUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const logOut = () => {
        updateUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };
    
    return <AuthContext.Provider value={{ user, signIn, logOut }}>{children}</AuthContext.Provider>;
};