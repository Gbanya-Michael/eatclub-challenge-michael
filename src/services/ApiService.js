import axios from "axios";

const fetchRestaurantData = async () => {
  try {
    const apiUrl = import.meta.env.VITE_DATABASE_URL;

    const res = await axios.get(apiUrl);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch restaurant data");
  }
};

export const ApiService = { fetchRestaurantData };
