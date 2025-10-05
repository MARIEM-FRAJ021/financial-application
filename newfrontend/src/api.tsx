import axios from "axios";
import {
  CompanyKeyMetrics,
  CompanySearch,
  CompanyIncomeStatement,
  CompanyBalanceSheet,
  CompanyCashFlow,
  CompanyCompData,
} from "./Company";
import { CompanyProfile } from "./Company";
interface SearchResponse {
  data: CompanySearch[];
}
export const searchCompanies = async (query: string) => {
  try {
    const response = await axios.get<SearchResponse>(
      `https://financialmodelingprep.com/stable/search-symbol?query=${query}&apikey=${process.env.REACT_APP_API_KEY}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.message;
    } else {
      console.log("unexpected error : ", error);
      return "An expected error has occured.";
    }
  }
};
export const getCompanyProfile = async (query: string) => {
  try {
    const data = await axios.get<CompanyProfile[]>(
      `https://financialmodelingprep.com/stable/profile?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getKeyMetrics = async (query: string) => {
  try {
    const data = await axios.get<CompanyKeyMetrics[]>(
      `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${query}?limit=40&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getIncomeStatement = async (query: string) => {
  try {
    const data = await axios.get<CompanyIncomeStatement[]>(
      `https://financialmodelingprep.com/api/v3/income-statement/${query}?limit=40&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};

export const getBalanceSheet = async (query: string) => {
  try {
    const data = await axios.get<CompanyBalanceSheet[]>(
      `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${query}?limit=20&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message :" + error.message);
  }
};

export const getCashFlowStatement = async (query: string) => {
  try {
    const data = await axios.get<CompanyCashFlow[]>(
      `https://financialmodelingprep.com/api/v3/cash-flow-statement/${query}?limit=100&apikey=${process.env.REACT_APP_API_KEY}`
    );
    return data;
  } catch (error: any) {
    console.log("error message: " + error.message);
  }
};
export const getCompData = async (
  querySymbol: string,
  querySector: string,
  queryExhangeValue: string
) => {
  try {
    const data = await axios.get<CompanyCompData[]>(
      `https://financialmodelingprep.com/api/v3/stock-screener?sector=${querySector}&exchange=${queryExhangeValue}&apikey=${process.env.REACT_APP_API_KEY}&limit=9`
    );
    const filteredData = data.data
      .filter((item) => item.symbol != querySymbol)
      .map((item) => item.symbol);
    return filteredData;
  } catch (error: any) {
    console.log("error message: ", error.message);
  }
};
