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

    deleteProject(projectId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "deleteProject", {
          "token": token,
          "projectId": projectId
        })
    }

    deleteTest(testId, testName) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "deleteTest", {
          "token": token,
          "testId": testId,
          "testName": testName
        })
    }

    createTest(data) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "createTest", {
          "token": token,
          "data": JSON.stringify(data)
        })
    }

    getTestsWithDetails(testId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getTestsWithDetails", {
          "token": token,
          "testId": testId
        })
    }

    getTaskList(testId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getTasks", {
          "token": token,
          "testId": testId
        })
    }

  }
  
  export default new ServerComponent();
