import axios from "axios";

const fetchRestaurantData = async () => {
  try {
    const apiUrl = import.meta.env.VITE_DATABASE_URL;

    if (!apiUrl) {
      throw new Error("VITE_DATABASE_URL environment variable is not set");
    }

    let url;
    if (import.meta.env.DEV) {
      try {
        const urlObj = new URL(apiUrl);
        url = `/api${urlObj.pathname}${urlObj.search}`;
      } catch {
        url = apiUrl.startsWith("/") ? `/api${apiUrl}` : `/api/${apiUrl}`;
      }
    } else {
      url = apiUrl;
    }

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch restaurant data");
  }
};

export const ApiService = { fetchRestaurantData };
