const tokenJWT = () => {
  let token = null;

  const getToken = () => token;

  const setToken = (newToken, tokenExpiration) => {
    token = newToken;
  };

  const deleteToken = () => (token = null);

  return { getToken, setToken, deleteToken };
};

export default tokenJWT();
