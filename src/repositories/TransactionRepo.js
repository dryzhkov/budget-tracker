import Auth from '../common/Auth';

const baseAPI =
  process.env.NODE_ENV === 'dev' ? '/api' : '/.netlify/functions/app/auth';

const getCommonHeaders = () => {
  return {
    Authorization: `bearer ${Auth.getToken()}`,
    Accept: 'application/json',
  };
};

const TransactionRepo = {
  get(payDate) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transactions/${payDate.toString()}`, {
        method: 'GET',
        headers: getCommonHeaders(),
      })
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then((json) => resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  create(transaction) {
    return new Promise((resolve, reject) => {
      const headers = getCommonHeaders();
      headers['Content-Type'] = 'application/json';
      fetch(`${baseAPI}/transaction`, {
        method: 'POST',
        body: JSON.stringify(transaction),
        headers: headers,
      })
        .then((result) => result.json())
        .then((json) => resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  update(transaction) {
    return new Promise((resolve, reject) => {
      const headers = getCommonHeaders();
      headers['Content-Type'] = 'application/json';
      fetch(`${baseAPI}/transaction`, {
        method: 'PUT',
        body: JSON.stringify(transaction),
        headers: headers,
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  destroy(transaction) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction/${transaction.id}`, {
        method: 'DELETE',
        headers: getCommonHeaders(),
      })
        .then((response) => response.json())
        .then((json) => resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  getAll(year) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transactions/${year}/summary`, {
        method: 'GET',
        headers: getCommonHeaders(),
      })
        .then((response) => response.json())
        .then((json) => resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },

  getUniqueCategories(year) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transactions/${year}/categories`, {
        method: 'GET',
        headers: getCommonHeaders(),
      })
        .then((response) => response.json())
        .then((json) => resolve(json))
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export default TransactionRepo;
