package com.disazure.usabcheck.dao;

import java.util.List;
import java.util.Map;
import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.disazure.usabcheck.entity.*;
import com.disazure.usabcheck.rowmappers.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class TaskDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private TestDao testDao;
	
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String getByTestId(int researcherId, int testId) throws JsonProcessingException {
		System.out.println("ResId: " + researcherId);
		
		String sql = ""
				+ "SELECT taskId, taskName, testId, stepsJSON, sequenceNumber FROM task "
				+ "LEFT JOIN test using(testId) "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE testId = ? AND researcherId = ?";

		List<Map<String, Object>> taskList = jdbcTemplate.queryForList(sql, testId, researcherId);
		
	    final String result = mapper.writeValueAsString(taskList);
	    
	    return result;
	}
	
	// Do no use the below method if you're not sure the testId has been verified to belong to the user who is making the request.
	// Use for internal calculations and do not give entry points direct access this method!
	public String getByTestIdNoSecurity(int testId) throws JsonProcessingException {
		String sql = ""
				+ "SELECT taskId, taskName, testId, stepsJSON, sequenceNumber FROM task "
				+ "WHERE testId = ?";

		List<Map<String, Object>> taskList = jdbcTemplate.queryForList(sql, testId);
		
	    final String result = mapper.writeValueAsString(taskList);
	    
	    return result;
	}
	
	public int createTask(Task task) {
		String sql = ""
				+ "INSERT INTO task (testId, taskName, stepsJSON, sequenceNumber) "
				+ "VALUES (?, ?, ?, ?)";
		
        return jdbcTemplate.update(sql, task.getTestId(), task.getTaskName(), task.getStepsJson(), task.getSequenceNumber());	
	}
}
