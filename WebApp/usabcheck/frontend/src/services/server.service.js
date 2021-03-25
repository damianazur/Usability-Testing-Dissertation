import axios from "axios";

// const API_URL = "http://localhost:8090/api/auth/main/";
const API_URL = "https://usabcheck.herokuapp.com/api/auth/main/";

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

    getTasksAndGrades(testId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getTasksAndGrades", {
          "token": token,
          "testId": testId
        })
    }

    getTaskGradesByInstanceId(testInstanceId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getTaskGradesByInstanceId", {
          "token": token,
          "testInstanceId": testInstanceId
        })
    }

    getQuestionAndAnswers(testId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getQuestionAndAnswers", {
          "token": token,
          "testId": testId
        })
    }

    getTestInstances(testId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getTestInstances", {
          "token": token,
          "testId": testId
        })
    }

    getVideoTimeStampsByInstanceId(testInstanceId) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "getVideoTimeStampsByInstanceId", {
          "token": token,
          "testInstanceId": testInstanceId
        })
    }

    updateTaskGrade(taskGradeId, grade) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "updateTaskGrade", {
          "token": token,
          "taskGradeId": taskGradeId,
          "grade": grade
        })
    }

    changeTestStatus(testId, status) {
      const token = JSON.parse(localStorage.getItem('user')).accessToken;

      return axios
        .post(API_URL + "changeTestStatus", {
          "token": token,
          "testId": testId,
          "status": status
        })
    }
  }
  
  export default new ServerComponent();
