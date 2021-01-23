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
public class TestDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private ProjectDao proDao;
	
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String getByUsabilityTests(int researcherId, int projectId) throws JsonProcessingException {
		System.out.println("ResId: " + researcherId);
		
		String sql = ""
				+ "SELECT testId, testName, projectId, launchedDate, testStatus FROM test "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE projectId = ? AND researcherId = ?";
		
		System.out.println(sql);

		List<Map<String, Object>> testList = jdbcTemplate.queryForList(sql, projectId, researcherId);
		
	    final String result = mapper.writeValueAsString(testList);
	    
	    System.out.println("# Result: " + result);
	    
	    return result;
	}
	
	public int createTest(int researcherId, UsabilityTest test) {
		int resId = proDao.getResearcherIdFromProject(test.getProjectId());
		
		// Check if user is authorised
		if (resId != researcherId) {
			return -1;
		}
		
		String sql = ""
				+ "INSERT INTO test (testName, projectId, launchedDate, status) "
				+ "VALUES (?, ?, ?, ?)";
		
		java.sql.Date ourJavaDateObject = new java.sql.Date(Calendar.getInstance().getTime().getTime());
		
        return jdbcTemplate.update(sql, test.getTestName(), test.getProjectId(), ourJavaDateObject, test.getStatus());
		
	}
	
	public int deleteTest(int testId, int researcherId) {
		// Delete ensures that the researcherId matches. Any user can send a delete request but that doesn't
		// mean they should be allowed to delete something.
		String sql = ""
				+ "DELETE test "
				+ "FROM test "
				+ "JOIN project using(projectId) "
				+ "JOIN researcher using(researcherId) "
				+ "WHERE researcherId = ? AND testId = ?";
		
        return jdbcTemplate.update(sql, researcherId, testId);
		
	}

}
