import axios from "axios";

const apiCLient = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_BASE_URL
})

export const userAuth = apiCLient.post('/v1/auth');