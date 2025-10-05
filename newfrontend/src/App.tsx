import "./App.css";
import { Outlet, useNavigate } from "react-router";
import Navbar from "./Components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth";
import axios from "axios";
import { useEffect } from "react";
import { handleError } from "./Helpers/ErrorHandler";

function App() {
  const navigate = useNavigate();
  const refreshToken = async () => {
    const token = localStorage.getItem("token");
    const userName = JSON.parse(localStorage.getItem("user") || "{}")?.userName;

    if (!token || !userName) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5213/api/account/refresh-token/${userName}/${encodeURIComponent(
          token
        )}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response;
    } catch (error) {
      handleError(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    refreshToken()
      .then((res) => {
        if (res?.data?.message === "token is valid") {
          console.log("Token is still valid");
        }
      })
      .catch((err) => {
        console.error("Failed to refresh token", err);
      });
  }, []);

  return (
    <div className="App">
      <UserProvider>
        <Navbar />
        <Outlet />
        <ToastContainer />
      </UserProvider>
    </div>
  );
}

export default App;
