import axios from "axios";

const API = axios.create({
  baseURL: "https://majorproject1-ecommerce-cart.onrender.com", // <-- replace with your Django Render URL
  withCredentials: true,
});

export default API;
