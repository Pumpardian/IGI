import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthWrapper = ({ children }) => {
    const [user, updateUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser) {
            updateUser(savedUser);
        }
        setLoading(false);
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
    
    return (
        <AuthContext.Provider value={{ user, signIn, logOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};