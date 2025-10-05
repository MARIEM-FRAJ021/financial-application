import React from "react";
import logo from "./logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { useLocation } from "react-router";

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();

  const loggedIn = isLoggedIn();
  const onHome = location.pathname === "/";
  const onLogin = location.pathname === "/login";
  const onSearch = location.pathname === "/search";

  return (
    <nav className="relative container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-20">
          <Link to="/">
            <img src={logo} alt="App logo" />
          </Link>

          {loggedIn && !onSearch && (
            <Link
              to="/search"
              className="hidden font-bold lg:flex text-black hover:text-darkBlue"
            >
              Search
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-6 text-black">
          {loggedIn ? (
            <>
              <span>Welcome, {user?.userName}</span>
              <button
                onClick={logout}
                className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {onHome && (
                <Link to="/login" className="text-black hover:text-darkBlue">
                  Login
                </Link>
              )}
              {(onHome || onLogin) && (
                <Link
                  to="/register"
                  className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70"
                >
                  Signup
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
