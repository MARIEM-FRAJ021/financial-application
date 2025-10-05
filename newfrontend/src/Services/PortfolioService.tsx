import axios from "axios";
import { PortfolioGet, PortfolioPost } from "../Models/Portfolio";
import { handleError } from "../Helpers/ErrorHandler";
import { useEffect } from "react";

const api = "http://localhost:5213/api/portfolio/";

export const setupAxios = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const portfolioAddAPI = async (symbol: string) => {
  try {
    const response = await axios.post(api + `${symbol}`);
    return response.status === 201;
  } catch (error) {
    handleError(error);
    return false;
  }
};

export const PortfolioGetAPI = async () => {
  try {
    const data = await axios.get<PortfolioGet[]>(api);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const PortfolioDeleteAPI = async (symbol: string) => {
  try {
    const response = await axios.delete(api + `${symbol}`);
    return response.status === 200;
  } catch (error) {
    handleError(error);
    return false;
  }
};
