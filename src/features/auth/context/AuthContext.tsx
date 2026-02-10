import { createContext , useState , useEffect } from "react";
import { set } from "react-hook-form";

interface AuthContextType{
    accessToken : string | null;
    role : string |null;
    login: (token: string, role: string) => void;
    logout : ()=>void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children: React.ReactNode})=>{

    const [authData, setAuthData] = useState<{ accessToken: string | null, role: string | null }>({
        accessToken: null,
        role: null,
    });

    const login = (accessToken:string , role:string)=>{
        // console.log("iiiiii");
        // console.log("from authcontext : ",accessToken , role)
       if(!accessToken || !role){
            console.error('invalid login data');
            return;
       }else{
         localStorage.setItem("accessToken", accessToken );
         localStorage.setItem("role" , role);
         setAuthData({accessToken , role});
       }
    }

    const logout = () => {
         localStorage.removeItem("accessToken");
         localStorage.removeItem("role");
        setAuthData({ accessToken: null, role: null });
    };

    useEffect(()=>{
        const storedaccessToken  = localStorage.getItem("accessToken");
        const storedRole = localStorage.getItem("role");
        console.log("KKKK: ",storedRole , storedaccessToken);
        if(storedRole && storedaccessToken){
            setAuthData({accessToken: storedaccessToken, role: storedRole});
        }
    }, []);

    return (
        <AuthContext.Provider value={{...authData, login , logout}}>
            {children}
        </AuthContext.Provider>
    )
}