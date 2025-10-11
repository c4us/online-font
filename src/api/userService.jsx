import axios from "axios";

const API_URL = "http://localhost:8080/user"; // adapte à ton endpoint

export const registerUser = async (userData) => {
  return await axios.post(API_URL, userData);
};
