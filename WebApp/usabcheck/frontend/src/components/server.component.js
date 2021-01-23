import axios from "axios";

const API_URL = "http://localhost:8090/api/auth/main/";

class ServerComponent {
    getProjectList() {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getProjects", {
          token
        })
    }

    getTestList(projectId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getTests", {
          "token": token,
          "projectId": projectId
        })
    }

    createProject(projectName) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "createProject", {
          "token": token,
          "projectName": projectName
        })
    }

  }
  
  export default new ServerComponent();
