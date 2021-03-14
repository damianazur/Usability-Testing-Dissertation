package com.disazure.usabcheck.dao;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;

import com.disazure.usabcheck.entity.*;
import com.disazure.usabcheck.rowmappers.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@Component
public class AnswerDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String getByTestId(int researcherId, int testId) throws JsonProcessingException {
		String sql = ""
				+ "SELECT answerId, answerJSON, questionId, testInstanceId FROM answer "
				+ "LEFT JOIN testinstance using(testInstanceId) "
				+ "LEFT JOIN test using(testId) "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE researcherId = ? AND testId = ?";
		

		List<Map<String, Object>> answerList = jdbcTemplate.queryForList(sql, researcherId, testId);
		final String jsonString = mapper.writeValueAsString(answerList);
		
		System.out.println(jsonString);
	    return jsonString;
	}
	
	
	public int create(int testInstanceId, JsonArray answersList) {
		String sql = ""
				+ "INSERT INTO answer (answerJSON, questionId, testInstanceId) "
				+ "VALUES (?, ?, ?)";
		
		for (JsonElement elem : answersList) {
			JsonObject object = elem.getAsJsonObject();
			
			String questionId = object.get("questionId").getAsString();
			String answerJSON = object.get("answerJSON").getAsJsonObject().toString();;
			
			int returnVal = jdbcTemplate.update(sql, answerJSON, questionId, testInstanceId);
		}	
		
        return 0;
		
	}
}
