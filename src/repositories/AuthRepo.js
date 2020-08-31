const baseAPI =
  process.env.NODE_ENV === 'dev' ? '/auth' : '/.netlify/functions/server/auth';
const AuthRepo = {
  login(username, password) {
    return new Promise((resolve, reject) => {
      const data = {
        email: username,
        password: password,
      };

      fetch(`${baseAPI}/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((json) => resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export default AuthRepo;
