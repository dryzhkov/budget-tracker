module.exports = function checkAuth(context) {
  return new Promise((resolve, reject) => {
    const user = context.clientContext && context.clientContext.user;
    if (!user) {
      return reject(new Error('No user claims'));
    }
    return resolve(user);
  });
};
