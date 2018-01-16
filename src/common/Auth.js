class Auth {
  static authenticateUser(token) {
    localStorage.setItem('auth_token', token);
  }

  static isUserAuthenticated() {
    return Auth.getToken() !== null;
  }

  static deauthenticateUser() {
    localStorage.removeItem('auth_token');
  }

  static getToken() {
    return localStorage.getItem('auth_token');
  }
}

export default Auth;