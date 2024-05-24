export default () => {
  let token = null;

  const getToken = () => token;

  const setToken = (newToken, tokenExpiration) => {
    token = newToken;
  };

  return { getToken, setToken };
};
