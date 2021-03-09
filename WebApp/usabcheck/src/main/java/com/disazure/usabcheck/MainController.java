package com.disazure.usabcheck;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.core.*;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import com.disazure.usabcheck.dao.*;
import com.disazure.usabcheck.entity.Project;
import com.disazure.usabcheck.entity.Question;
import com.disazure.usabcheck.entity.Task;
import com.disazure.usabcheck.entity.UsabilityTest;
import com.disazure.usabcheck.payload.request.BasicRequest;
import com.disazure.usabcheck.payload.request.GetMyUsernameRequest;
import com.disazure.usabcheck.payload.response.MessageResponse;
import com.disazure.usabcheck.security.jwt.JwtUtils;
import com.disazure.usabcheck.security.services.UsabilityTestService;

@CrossOrigin
@RestController
@RequestMapping("/api/auth/main")
public class MainController {
	
	@Autowired
	private ResearcherDao resDao;
	@Autowired
	private ProjectDao proDao;
	@Autowired
	private TestDao testDao;
	@Autowired
	private TaskDao taskDao;
	@Autowired
	private QuestionDao questionDao;
	@Autowired
	private TestInstanceDao testInstanceDao;
	@Autowired
	private TimeStampDao timeStampDao;
	@Autowired
	private UsabilityTestService usabilityTestService;
	@Autowired
	private TaskGradeDao taskGradeDao;
	
	@Autowired
	JwtUtils jwtUtils;
	
	@PostMapping("/getProjects")
	public ResponseEntity<?> getProjects(@Valid @RequestBody BasicRequest basicRequest) {
		String token = basicRequest.getToken();
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		System.out.println(username + " " + researcherId);
		
		String result = "";
		
		try {
			result = proDao.findByResearcherId(researcherId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/createProject", method = RequestMethod.POST)
	public ResponseEntity<?> getProjects(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		String projectName = json.get("projectName");
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		Project newProject = new Project(projectName, researcherId);
		int result = proDao.createProject(newProject);
		
		return new ResponseEntity<String>(Integer.toString(result), HttpStatus.OK);
	}
	

	@RequestMapping(value = "/getTests", method = RequestMethod.POST)
	public ResponseEntity<?> getTests(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int projectId = Integer.parseInt(json.get("projectId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		String result = "";
		
		try {
			result = testDao.getByProjectId(researcherId, projectId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/deleteProject", method = RequestMethod.POST)
	public ResponseEntity<?> deleteProject(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int projectId = Integer.parseInt(json.get("projectId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		
		int result = proDao.deleteProject(projectId, researcherId);
		
		return new ResponseEntity<String>(Integer.toString(result), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/deleteTest", method = RequestMethod.POST)
	public ResponseEntity<?> deleteTest(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testId = Integer.parseInt(json.get("testId"));
		String testName = json.get("testName");
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		int result = testDao.deleteTest(testId, testName, researcherId);
		
		return new ResponseEntity<String>(Integer.toString(result), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/createTest", method = RequestMethod.POST)
	public ResponseEntity<?> createTest(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		String dataString = json.get("data");
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		JsonObject data = new JsonParser().parse(dataString).getAsJsonObject();
		System.out.println("------------ DATA: ------------\n" + data);
		JsonArray sequenceData = data.get("sequenceData").getAsJsonArray();
		
		// Create Usability Test
		String testName = data.get("testName").getAsString();
		int projectId = data.get("projectId").getAsInt();
		java.sql.Date currentDate = new java.sql.Date(Calendar.getInstance().getTime().getTime());
		UsabilityTest newTest = new UsabilityTest(testName, projectId, currentDate.toString(), "Open");
		int result = testDao.createTest(researcherId, newTest);
		
		
		if (result == 1) {
			int testId = -1;
			try {
				testId = testDao.getIdByTestNameAndProjectId(researcherId, testName, projectId);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
				return new ResponseEntity<String>(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
			System.out.println("Newly created testId: " + testId);
			
			for (JsonElement elem : sequenceData) {
				JsonObject object = elem.getAsJsonObject();
				String itemType = object.get("type").getAsString();
				
				// Create Question
				if (itemType.equals("question")) {
					String questionConfigsJson = object.get("data").getAsJsonObject().toString();
					int sequenceNumber = object.get("indexNumber").getAsInt();
					String stage = object.get("stage").getAsString();
					
					Question newQuestion = new Question(testId, questionConfigsJson, sequenceNumber, stage);
					questionDao.createQuestion(newQuestion);
				}
				// Create Task
				else if (itemType.equals("task")) {
					JsonObject taskData = object.get("data").getAsJsonObject();
					
					String taskName = taskData.get("taskName").getAsString();
					String stepsJSON = taskData.get("steps").getAsJsonArray().toString();
					int sequenceNumber = object.get("indexNumber").getAsInt();
					
					Task newTask = new Task(taskName, testId, stepsJSON, sequenceNumber);
					taskDao.createTask(newTask);
				}
			}
		}
		
		System.out.println(result);
		
		return new ResponseEntity<String>(Integer.toString(0), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/getTestsWithDetails", method = RequestMethod.POST)
	public ResponseEntity<?> getTestsWithDetails(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testId = Integer.parseInt(json.get("testId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);

		String result = usabilityTestService.getTestsWithDetailsByTestId(researcherId, testId);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/getTasks", method = RequestMethod.POST)
	public ResponseEntity<?> getTasks(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testId = Integer.parseInt(json.get("testId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		String result = "";
		
		try {
			result = taskDao.getByTestId(researcherId, testId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/getQuestionAndAnswers", method = RequestMethod.POST)
	public ResponseEntity<?> getQuestionAndAnswers(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testId = Integer.parseInt(json.get("testId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);

		JsonObject result = new JsonObject();
		try {
			result = usabilityTestService.getQuestionAndAnswers(researcherId, testId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/getTasksAndGrades", method = RequestMethod.POST)
	public ResponseEntity<?> getTasksAndGrades(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testId = Integer.parseInt(json.get("testId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);

		JsonObject result = new JsonObject();
		try {
			result = usabilityTestService.getTasksAndGrades(researcherId, testId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/getTaskGradesByInstanceId", method = RequestMethod.POST)
	public ResponseEntity<?> getTaskGradesByInstanceId(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testInstanceId = Integer.parseInt(json.get("testInstanceId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);

		String result = "";
		try {
			result = usabilityTestService.getTaskGradesByInstanceId(researcherId, testInstanceId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/getTestInstances", method = RequestMethod.POST)
	public ResponseEntity<?> getTestInstances(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testId = Integer.parseInt(json.get("testId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);

		String result = "";
		try {
			result = testInstanceDao.getByTestId(researcherId, testId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/getVideoTimeStampsByInstanceId", method = RequestMethod.POST)
	public ResponseEntity<?> getVideoTimeStampsByInstanceId(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testInstanceId = Integer.parseInt(json.get("testInstanceId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);

		String result = "";
		try {
			result = timeStampDao.getByInstanceId(researcherId, testInstanceId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/updateTaskGrade", method = RequestMethod.POST)
	public ResponseEntity<?> updateTaskGrade(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int taskGradeId = Integer.parseInt(json.get("taskGradeId"));
		String grade = json.get("grade");
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);

		int result = -1;
		try {
			result = taskGradeDao.updateGrade(researcherId, taskGradeId, grade);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(Integer.toString(result), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/changeTestStatus", method = RequestMethod.POST)
	public ResponseEntity<?> changeTestStatus(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testId = Integer.parseInt(json.get("testId"));
		String status = json.get("status");
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		int result = testDao.changeStatus(researcherId, testId, status);
		
		return new ResponseEntity<String>(Integer.toString(result), HttpStatus.OK);
	}
	
}
