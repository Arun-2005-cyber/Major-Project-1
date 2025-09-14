import axios from "axios";

const API = axios.create({
  baseURL: "https://majorproject1-ecommerce-cart.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
