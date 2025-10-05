import React, { useEffect, useState, createContext } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  loginAPI,
  registerAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
} from "../Services/AuthService";
import { toast } from "react-toastify";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  forgotMessage: string | null;
  resetMessage: string | null;
  registerUser: (userName: string, password: string, email: string) => void;
  loginUser: (userName: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  forgotPassword: (email: string) => void;
  resetPassword: (email: string, password: string, token: string) => void;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);
  const registerUser = async (
    userName: string,
    password: string,
    email: string
  ) => {
    await registerAPI(userName, password, email)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            userName: res?.data.userName,
            email: res?.data.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login success!");
          navigate("/search");
        }
      })
      .catch((res) => toast.warning("Server error occured"));
  };

  const loginUser = async (usernameOrEmail: string, password: string) => {
    debugger;
    await loginAPI(usernameOrEmail, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            userName: res?.data.userName,
            email: res?.data.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login success!");
          navigate("/search");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const forgotPassword = async (email: string) => {
    await forgotPasswordAPI(email)
      .then((res) => {
        if (res) {
          setForgotMessage(res?.data.message);
          toast.success(res?.data.message);
          setForgotMessage(null);
        }
      })
      .catch((err: any) => toast.warning("Something went wrong"));
  };
  const resetPassword = async (
    email: string,
    password: string,
    token: string
  ) => {
    await resetPasswordAPI(email, password, token)
      .then((res) => {
        if (res) {
          setResetMessage(res?.data.message);
          toast.success(res?.data.message);
          setResetMessage(null);
          navigate("/login");
        }
      })
      .catch((err: any) => toast.warning("Something went wrong"));
  };

  const isLoggedIn = () => {
    return !!user || !!localStorage.getItem("token");
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };
  return (
    <UserContext.Provider
      value={{
        loginUser,
        user,
        token,
        forgotMessage,
        resetMessage,
        logout,
        isLoggedIn,
        registerUser,
        forgotPassword,
        resetPassword,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
