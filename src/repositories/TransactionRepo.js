const baseAPI = '/api';

const TransactionRepo = {
  get() {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transactions`)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

  create(transaction) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction`, {
        method: 'POST',
        body: JSON.stringify(transaction),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(result => result.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },

  update(transaction) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction`, {
        method: 'PUT',
        body: JSON.stringify(transaction),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  destroy(transaction) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/transaction/${transaction.id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  }
};

export default TransactionRepo;