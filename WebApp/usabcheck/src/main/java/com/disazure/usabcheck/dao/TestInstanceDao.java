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

@Component
public class TestInstanceDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String getByTestId(int researcherId, int testId) throws JsonProcessingException {
		String sql = ""
				+ "SELECT testInstanceId, testId, studyDate, videoLocation, participantName FROM testinstance "
				+ "LEFT JOIN test using(testId) "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE testId = ? AND researcherId = ?";
		
		
		List<Map<String, Object>> testInstances = jdbcTemplate.queryForList(sql,  testId, researcherId);
		
		final String jsonString = mapper.writeValueAsString(testInstances);
	    
	    return jsonString;
	}
	
	public String generateReferenceCode() {
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
	
	
	public int create(UsabilityTestInstance testInstance) {
		String sql = ""
				+ "INSERT INTO testinstance (testId, studyDate, instanceReference, participantName) "
				+ "VALUES (?, ?, ?, ?)";
		
		GeneratedKeyHolder holder = new GeneratedKeyHolder();
		
		jdbcTemplate.update(new PreparedStatementCreator() {
		    @Override
		    public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
		        PreparedStatement statement = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		        statement.setString(1, Integer.toString(testInstance.getTestId()));
		        statement.setString(2, testInstance.getStudyDate());
		        statement.setString(3, testInstance.getInstanceReference());
		        statement.setString(4, testInstance.getParticipantName());
		        return statement;
		    }
		}, holder);
		
		long primaryKey = holder.getKey().longValue();
		
        return (int) primaryKey;	
	}
	
	public String getReferenceCodeById(int testInstanceId) throws JsonProcessingException {
		String sql = ""
				+ "SELECT instanceReference FROM testinstance "
				+ "WHERE testInstanceId = ?";

		System.out.println(testInstanceId);
		
		String instanceReference = jdbcTemplate.queryForObject(sql, String.class, testInstanceId);
		
		return instanceReference;
	}
	
	
	public int setVideoLink(String testInstanceRef, String videoId) throws JsonProcessingException {
		String sql = ""
				+ "UPDATE testinstance SET videoLocation = ? "
				+ "WHERE instanceReference = ?";
		
		int result = jdbcTemplate.update(sql, videoId, testInstanceRef);
		
		return result;
	}
	
	
//	public int delete(int testId, String testName, int researcherId) {
//		// Delete ensures that the researcherId matches. Any user can send a delete request but that doesn't
//		// mean they should be allowed to delete something.
//		String sql = ""
//				+ "DELETE test "
//				+ "FROM test "
//				+ "JOIN project using(projectId) "
//				+ "JOIN researcher using(researcherId) "
//				+ "WHERE researcherId = ? AND testId = ? AND testName = ?";
//		
//        return jdbcTemplate.update(sql, researcherId, testId, testName);
//	}

}
