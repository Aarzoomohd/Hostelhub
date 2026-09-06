import {createContext, useContext, useState,useEffect} from "react";
import { loginUser, registerUser } from "../services/authService.js";


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
const [owner, setOwner] = useState(() => {
  const savedOwner = localStorage.getItem("owner");

  return savedOwner ? JSON.parse(savedOwner) : null;
});

    const login = async(loginData) =>{
        const data = await loginUser(loginData);
  
        

        localStorage.setItem("token", data.token);
        localStorage.setItem("owner", JSON.stringify(data.owner));
        localStorage.setItem("hostel", JSON.stringify(data.hostel));
        setOwner(data.owner);

        return data;
    }

    const logout = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("owner");
        localStorage.removeItem("hostel");

        setOwner(null);
    };

    return (
        <AuthContext.Provider
        value={{
            owner,
            login,
            logout
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () =>{
    return useContext(AuthContext);
}