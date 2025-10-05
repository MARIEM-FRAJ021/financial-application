import axios from "axios";
import React from "react";
import { ForgotPassword, UserProfileToken } from "../Models/User";
import { handleError } from "../Helpers/ErrorHandler";

const api = "http://localhost:5213/api/account";


export const loginAPI = async (usernameOrEmail: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "/login", {
      usernameOrEmail: usernameOrEmail,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  username: string,
  password: string,
  email: string
) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "/register", {
      username: username,
      password: password,
      email: email,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const forgotPasswordAPI = async (email: string) => {
  try {
    const data = axios.post<ForgotPassword>(api + "/forgot-password", {
      email: email,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const resetPasswordAPI = async (
  email: string,
  password: string,
  token: string
) => {
  try {
    const data = axios.post<ForgotPassword>(api + "/reset-password", {
      email: email,
      password: password,
      token: token,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const refreshtokenAPI = async (
  userName: string,
  token: string,
) => {
  try {
    const data = axios.post<ForgotPassword>(api + "/refresh-token", {
      userName: userName,
      token: token,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};
