package com.disazure.usabcheck.security.services;

import java.util.Calendar;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.disazure.usabcheck.dao.AnswerDao;
import com.disazure.usabcheck.dao.QuestionDao;
import com.disazure.usabcheck.dao.TaskDao;
import com.disazure.usabcheck.dao.TaskGradeDao;
import com.disazure.usabcheck.dao.TestDao;
import com.disazure.usabcheck.dao.TestInstanceDao;
import com.disazure.usabcheck.dao.TestInstanceGradeDao;
import com.disazure.usabcheck.dao.TimeStampDao;
import com.disazure.usabcheck.entity.UsabilityTestInstance;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class UsabilityTestService {
	@Autowired
	private TestDao testDao;
	@Autowired
	private TaskDao taskDao;
	@Autowired
	private QuestionDao questionDao;
	@Autowired
	private TestInstanceDao testInstanceDao;
	@Autowired
	private AnswerDao answerDao;
	@Autowired
	private TimeStampDao timeStampDao;
	@Autowired
	private TestInstanceGradeDao testInstanceGradeDao;
	@Autowired
	private TaskGradeDao taskGradeDao;
	
	public String getTestsWithDetailsByTestId(int researcherId, int testId) {
		String result = "";
		
		try {
			String usabilityTest = testDao.getByTestId(researcherId, testId);
			String questions = questionDao.getByTestId(researcherId, testId);
			String tasks = taskDao.getByTestId(researcherId, testId);
			
			result = combineUsabilityTestWithDetails(usabilityTest, questions, tasks);
			
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	public String getTestsWithDetailsByReference(String referenceCode) {
		String result = "";
		
		try {
			int testId = testDao.getIdByReferenceCode(referenceCode);
			int researcherId = testDao.getResearcherIdByReferenceCode(referenceCode);
			
			String usabilityTest = testDao.getByTestId(researcherId, testId);
			String questions = questionDao.getByTestId(researcherId, testId);
			String tasks = taskDao.getByTestId(researcherId, testId);
			
			result = combineUsabilityTestWithDetails(usabilityTest, questions, tasks);
			
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	private String combineUsabilityTestWithDetails(String usabilityTest, String questions, String tasks) {
		JsonObject usabTestObject = new JsonParser().parse(usabilityTest).getAsJsonObject();
		JsonArray questionsList = new JsonParser().parse(questions).getAsJsonArray();
		JsonArray tasksList = new JsonParser().parse(tasks).getAsJsonArray();
		
		JsonArray sequenceData = new JsonArray();
		for (JsonElement elem : questionsList) {
			sequenceData.add(elem);
		}
		for (JsonElement elem : tasksList) {
			sequenceData.add(elem);
		}
		
		usabTestObject.add("sequenceData", sequenceData);
		String result = usabTestObject.toString();
		
		return result;
	}
	
	
	public String createUsabilityTestInstance(Map<String, String> json) throws JsonProcessingException {
		JsonParser jsonParser = new JsonParser();
		
		String referenceCode = json.get("referenceCode");
		String ferCameraDataStr = json.get("ferCameraData");
		String sequenceTimeStampStr = json.get("sequenceTimeStamp");
		String questionAnswersStr = json.get("questionAnswers");
		
		JsonArray ferCamData = jsonParser.parse(ferCameraDataStr).getAsJsonArray();
		JsonArray sequenceTimeStamp = jsonParser.parse(sequenceTimeStampStr).getAsJsonArray();
		JsonArray questionAnswers = jsonParser.parse(questionAnswersStr).getAsJsonArray();
		
		int testId = testDao.getIdByReferenceCode(referenceCode);
		java.sql.Date currentDate = new java.sql.Date(Calendar.getInstance().getTime().getTime());
		UsabilityTestInstance newUsabTestInst = new UsabilityTestInstance(testId, currentDate.toString());
		
		String tasksStr = taskDao.getByTestIdNoSecurity(testId);
		JsonArray tasks = jsonParser.parse(tasksStr).getAsJsonArray();
		
		int instanceId = testInstanceDao.create(newUsabTestInst);
		int answersRes = answerDao.create(instanceId, questionAnswers);
		int ferTimeStampsRes = timeStampDao.create(instanceId, ferCamData, "emotion");
		int sequenceTimeStampsRes = timeStampDao.create(instanceId, sequenceTimeStamp, "sequence");
		int testInstanceGradeId = testInstanceGradeDao.create(instanceId);
		int taskGradeRes = taskGradeDao.create(testInstanceGradeId, tasks);
		
		System.out.println(referenceCode);
		System.out.println(ferCamData);
		System.out.println(sequenceTimeStamp);
		System.out.println(questionAnswers);
		
		return "OK";
	}
	
	public JsonObject getQuestionAndAnswers(int researcherId, int testId) throws JsonProcessingException {
		JsonParser jsonParser = new JsonParser();
		String questions = questionDao.getByTestId(researcherId, testId);
		String answers = answerDao.getByTestId(researcherId, testId);
		
		JsonObject returnData = new JsonObject();
		returnData.add("questions", jsonParser.parse(questions).getAsJsonArray());
		returnData.add("answers", jsonParser.parse(answers).getAsJsonArray());
		
		return returnData;
	}
	
	public JsonObject getTasksAndGrades(int researcherId, int testId) throws JsonProcessingException {
		JsonParser jsonParser = new JsonParser();
		String tasks = taskDao.getByTestId(researcherId, testId);
		String grades = taskGradeDao.getByTestId(researcherId, testId);
		
		JsonObject returnData = new JsonObject();
		returnData.add("tasks", jsonParser.parse(tasks).getAsJsonArray());
		returnData.add("grades", jsonParser.parse(grades).getAsJsonArray());
		
		System.out.println(returnData);
		
		return returnData;
	}
}
