import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Circle } from "react-preloaders";
import config from "../config";
import style from "../app.module.scss";
import showErrorMessage from "../utils/showErrorMessage";
import tokenJWT from "../services/tokenJWT";

export const AuthContext = createContext({});

export const AuthClient = axios.create({
  baseURL: `${config.API_URL}/auth`,
  withCredentials: true,
});

const AuthProvider = ({ children }) => {
  const [data, setData] = useState();

  const handleFetchProtected = () => {};

  const handleLogOut = () => {};

  const handleSignUp = (data) => {
    AuthClient.post("/sign-up", data)
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;

        tokenJWT.setToken(accessToken, accessTokenExpiration);
      })
      .catch(showErrorMessage);
  };

  const handleSignIn = (data) => {
    AuthClient.post("/sign-in", data)
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;

        tokenJWT.setToken(accessToken, accessTokenExpiration);
      })
      .catch(showErrorMessage);
  };

  return (
    <AuthContext.Provider
      value={{
        data,
        handleFetchProtected,
        handleSignUp,
        handleSignIn,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
