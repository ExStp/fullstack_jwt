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

const ResourceClient = axios.create({ baseURL: `${config.API_URL}/resource` });

ResourceClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenJWT.getToken();

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const AuthProvider = ({ children }) => {
  const [data, setData] = useState();

  const handleFetchProtected = () => {
    ResourceClient.get("/protected")
      .then((res) => setData(res.data))
      .catch(showErrorMessage);
  };

  const handleLogOut = () => {
    AuthClient.post("/logout")
      .then(() => {
        tokenJWT.deleteToken();
      })
      .catch(showErrorMessage);
  };

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
