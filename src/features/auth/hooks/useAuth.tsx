import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth= ()=> {
    const context = useContext(AuthContext);
     const userRole = localStorage.getItem('role');
    if(!context){
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}
export default useAuth;