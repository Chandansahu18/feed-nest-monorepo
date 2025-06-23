import axios from "axios";

export const CLOUDINARY_API = axios.create({
    baseURL:import.meta.env.VITE_CLOUDINARY_BASE_URL
})

export const FEEDNEST_BACKEND_API = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_BASE_URL
})