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
public class TaskGradeDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String getByTestId(int researcherId, int testId) throws JsonProcessingException {
		String sql = ""
				+ "SELECT taskGradeId, testGradeId, taskId, grade FROM taskGrade "
				+ "LEFT JOIN task using(taskId) "
				+ "LEFT JOIN test using(testId) "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE researcherId = ? AND testId = ?";
		

		List<Map<String, Object>> taskGradeList = jdbcTemplate.queryForList(sql, researcherId, testId);
		final String jsonString = mapper.writeValueAsString(taskGradeList);
		
		System.out.println(jsonString);
	    return jsonString;
	}
	
	
	public int create(int testGradeId, JsonArray taskList) {
		String sql = ""
				+ "INSERT INTO taskGrade (testGradeId, taskId, grade) "
				+ "VALUES (?, ?, ?)";
		
		for (JsonElement elem : taskList) {
			JsonObject object = elem.getAsJsonObject();
			
			String taskId = object.get("taskId").getAsString();
			
			int returnVal = jdbcTemplate.update(sql, testGradeId, taskId, "Not Graded");
		}	
		
        return 0;
		
	}
}