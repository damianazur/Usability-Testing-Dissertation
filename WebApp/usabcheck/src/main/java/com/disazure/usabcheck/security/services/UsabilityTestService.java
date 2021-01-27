package com.disazure.usabcheck.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.disazure.usabcheck.dao.QuestionDao;
import com.disazure.usabcheck.dao.TaskDao;
import com.disazure.usabcheck.dao.TestDao;
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

	public String getTestsWithDetailsByTestId(int researcherId, int testId) {
		System.out.println("###" + researcherId + " " + testId);
		
		String result = "";
		
		try {
			String usabilityTest = testDao.getByTestId(researcherId, testId);
			String questions = questionDao.getByTestId(researcherId, testId);
			String tasks = taskDao.getByTestId(researcherId, testId);
			
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
			
			System.out.println(questions);
			result = usabTestObject.toString();
			
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return result;
	}
}
