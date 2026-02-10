import axios from "axios"

const  api = axios.create({
    baseURL : "https://localhost:7035/api" , 
    withCredentials: true,
    headers:{
        "Content-Type" : "application/json",
    },
});


export default api;