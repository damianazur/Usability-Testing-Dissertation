import axios from "axios";

const API_URL = "http://localhost:8090/api/auth/main/";

class ServerComponent {
    getProjectList(token) {
      return axios
        .post(API_URL + "getProjects", {
          token
        })
        
    }

    getUsernameFromBackend(token) {
      console.log("Token to be sent: ", token);
      return axios.post(API_URL + "getMyUsername2", {
        token
      })
      .then(response => {
        console.log(response);
        return response.data;
      });
    }

  }
  
  export default new ServerComponent();
