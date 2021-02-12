package com.disazure.usabcheck.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class TestInstanceGradeDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String getByTestId(int researcherId, int testId) throws JsonProcessingException {
		String sql = ""
				+ "SELECT testGradeId, testInstanceId, comment FROM testgrade "
				+ "LEFT JOIN testInstance using(testInstanceId) "
				+ "LEFT JOIN test using(testId) "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE researcherId = ? AND testId = ?";
		

		Map<String, Object> answerList = jdbcTemplate.queryForMap(sql, researcherId, testId);
		final String jsonString = mapper.writeValueAsString(answerList);
		
		System.out.println(jsonString);
	    return jsonString;
	}
	
	
	public int create(int testInstanceId) {
		String sql = ""
				+ "INSERT INTO testgrade (testInstanceId, comment) "
				+ "VALUES (?, ?)";
		
		GeneratedKeyHolder holder = new GeneratedKeyHolder();
		
		jdbcTemplate.update(new PreparedStatementCreator() {
		    @Override
		    public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
		        PreparedStatement statement = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
		        statement.setString(1, Integer.toString(testInstanceId));
		        statement.setString(2, "");
		        return statement;
		    }
		}, holder);
		
		long primaryKey = holder.getKey().longValue();
        return (int) primaryKey;
	}
}
