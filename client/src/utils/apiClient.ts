import axios from "axios";

export const CLOUDINARY_API = axios.create({
    baseURL:import.meta.env.VITE_CLOUDINARY_BASE_URL
})
