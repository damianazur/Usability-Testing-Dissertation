package com.disazure.usabcheck.dao;

import java.util.List;
import java.util.Map;
import java.util.Random;
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
	
	public String getByProjectId(int researcherId, int projectId) throws JsonProcessingException {
		System.out.println("ResId: " + researcherId);
		
		String sql = ""
				+ "SELECT testId, testName, projectId, launchedDate, testStatus, referenceCode FROM test "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE projectId = ? AND researcherId = ?";
		
		System.out.println(sql);

		List<Map<String, Object>> testList = jdbcTemplate.queryForList(sql, projectId, researcherId);
		
	    final String result = mapper.writeValueAsString(testList);
	    
	    System.out.println("# Result: " + result);
	    
	    return result;
	}
	
	public boolean verifyResearcher(int researcherId, int testId) {
		String sql = ""
				+ "SELECT researcherId FROM test "
				+ "JOIN project using(projectId) "
				+ "JOIN researcher using(researcherId) "
				+ "WHERE researcherId = ? AND testId = ?";
		
		int resId = jdbcTemplate.queryForObject(sql, Integer.class, researcherId, testId);
		
		if (resId == researcherId) {
			return true;
		}
		
		return false;
	}
	
	public boolean checkTestNameUnique(int researcherId, String testName) {
		String sql = ""
				+ "SELECT COUNT(testName) FROM test "
				+ "JOIN project using(projectId) "
				+ "JOIN researcher using(researcherId) "
				+ "WHERE researcherId = ? AND testName = ?";
		
		int retTestNameCount = jdbcTemplate.queryForObject(sql, Integer.class, researcherId, testName);
		
		if (retTestNameCount > 0) {
			return false;
		}
		
		return true;
	}
	
	public String getByTestId(int researcherId, int testId) throws JsonProcessingException {
//		System.out.println(researcherId + " ## " + testId);
		String sql = ""
				+ "SELECT testId, testName, projectId, launchedDate, testStatus, referenceCode, scenario FROM test "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE testId = ? AND researcherId = ?";
		

		Map<String, Object> usabilityTest = jdbcTemplate.queryForMap(sql, testId, researcherId);
		String jsonString = new ObjectMapper().writeValueAsString(usabilityTest);
		
		System.out.println(jsonString);
	    return jsonString;
	}
	
	public int getIdByTestNameAndProjectId(int researcherId, String testName, int projectId) throws JsonProcessingException {
		String sql = ""
				+ "SELECT testId FROM test "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE testName = ? AND projectId = ? AND researcherId = ?";

		int testId = jdbcTemplate.queryForObject(sql, Integer.class, testName, projectId, researcherId);
		
		return testId;
	}
	
	public int getIdByReferenceCode(String getIdByReferenceCode) throws JsonProcessingException {
		String sql = ""
				+ "SELECT testId FROM test "
				+ "WHERE referenceCode = ?";

		System.out.println(getIdByReferenceCode);
		
		int testId = jdbcTemplate.queryForObject(sql, Integer.class, getIdByReferenceCode);
		
		return testId;
	}
	
	public int getResearcherIdByReferenceCode(String getIdByReferenceCode) throws JsonProcessingException {
		String sql = ""
				+ "SELECT researcherId FROM test "
				+ "JOIN project using(projectId) "
				+ "JOIN researcher using(researcherId) "
				+ "WHERE referenceCode = ?";

		int testId = jdbcTemplate.queryForObject(sql, Integer.class, getIdByReferenceCode);
		
		return testId;
	}
	
	private String generateReferenceCode() {
        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder salt = new StringBuilder();
        Random random = new Random();
        
        while (salt.length() < 8) {
            int index = (int) (random.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        
        String saltStr = salt.toString();
        return saltStr;
    }
	
	public int createTest(int researcherId, UsabilityTest test) throws Exception {
		int resId = proDao.getResearcherIdFromProject(test.getProjectId());
		
		// Check if user is authorised
		if (resId != researcherId) {
			return -1;
		}
		
		if (!checkTestNameUnique(researcherId, test.getTestName())) {
			 throw new Exception("The test name already exists!");
		}
		
		String sql = ""
				+ "INSERT INTO test (testName, projectId, launchedDate, testStatus, referenceCode, scenario) "
				+ "VALUES (?, ?, ?, ?, ?, ?)";
		
        return jdbcTemplate.update(sql, test.getTestName(), test.getProjectId(), test.getLaunchedDate(), test.getStatus(), this.generateReferenceCode(), test.getScenario());
		
	}
	
	public int deleteTest(int testId, String testName, int researcherId) {
		// Delete ensures that the researcherId matches. Any user can send a delete request but that doesn't
		// mean they should be allowed to delete something.
		String sql = ""
				+ "DELETE test "
				+ "FROM test "
				+ "JOIN project using(projectId) "
				+ "JOIN researcher using(researcherId) "
				+ "WHERE researcherId = ? AND testId = ? AND testName = ?";
		
        return jdbcTemplate.update(sql, researcherId, testId, testName);
	}
	
	public String getTestStatusByRef(String referenceCode) throws JsonProcessingException {
		String sql = ""
				+ "SELECT testStatus FROM test "
				+ "WHERE referenceCode = ?";
		
		String testStatus = "";
		try {
			testStatus = jdbcTemplate.queryForObject(sql, String.class, referenceCode);
			return testStatus;
			
		} catch (Exception e) {
			return testStatus;
		}
	}
	
	public int changeStatus(int researcherId, int testId, String status) {
		if (!verifyResearcher(researcherId, testId)) {
			return -1;
		}
		
		System.out.println("status " + status);
		if (!status.equals("Open") && !status.equals("Closed")) {
			return -1;
		}
		
		String sql = ""
				+ "UPDATE test SET testStatus = ?"
				+ "WHERE testId = ?";
		
		int result = jdbcTemplate.update(sql, status, testId);
		
		return result;
	}

}
