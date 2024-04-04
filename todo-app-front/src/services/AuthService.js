import requests from './httpService';

const AuthService = {
  registerAdmin(body) {
    return requests.post('/users/register', body);
  },

  loginAdmin(body) {
    return requests.post(`/users/login`, body);
  },
};

export default AuthService;
