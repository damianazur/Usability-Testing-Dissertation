import axios from "axios";

const API_URL = "http://localhost:8090/api/auth/";

class AuthService {
    login(username, password) {
      return axios
        .post(API_URL + "login", {
          username,
          password
        })
        .then(response => {
          if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
  
          return response.data;
        });
    }
  
    logout() {
      localStorage.removeItem("user");
    }
  
    register(username, password) {
      return axios.post(API_URL + "register", {
        username,
        password
      });
    }

    getUsernameFromBackend(token) {
      console.log("Token to be sent: ", token);
      return axios.post(API_URL + "getMyUsername", {
        token
      });
    }
  
    getCurrentUser() {
      return JSON.parse(localStorage.getItem('user'));;
    }
  }
  
  export default new AuthService();