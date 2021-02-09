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
	
//	public String getByTestId(int researcherId, int testId) throws JsonProcessingException {
//		String sql = ""
//				+ "SELECT testId, testName, projectId, launchedDate, testStatus, referenceCode FROM test "
//				+ "LEFT JOIN project using(projectId) "
//				+ "LEFT JOIN researcher using(researcherId) "
//				+ "WHERE testId = ? AND researcherId = ?";
//		
//
//		Map<String, Object> usabilityTest = jdbcTemplate.queryForMap(sql, testId, researcherId);
//		String jsonString = new ObjectMapper().writeValueAsString(usabilityTest);
//		
//		System.out.println(jsonString);
//	    return jsonString;
//	}
	
	
	public int create(UsabilityTestInstance testInstance) {
		String sql = ""
				+ "INSERT INTO testInstance (testId, studyDate) "
				+ "VALUES (?, ?)";
		
		GeneratedKeyHolder holder = new GeneratedKeyHolder();
		
		jdbcTemplate.update(new PreparedStatementCreator() {
		    @Override
		    public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
		        PreparedStatement statement = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		        statement.setString(1, Integer.toString(testInstance.getTestId()));
		        statement.setString(2, testInstance.getStudyDate());
		        return statement;
		    }
		}, holder);
		
//		int returnVal = jdbcTemplate.update(sql, testInstance.getTestId(), testInstance.getStudyDate());

		long primaryKey = holder.getKey().longValue();
		System.out.println("# Primary Key " + primaryKey);
		
        return (int) primaryKey;
		
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
