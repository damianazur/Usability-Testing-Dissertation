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
public class QuestionDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private TestDao testDao;
	
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String getByTestId(int researcherId, int testId) throws JsonProcessingException {
		System.out.println("ResId: " + researcherId);
		
		String sql = ""
				+ "SELECT questionId, testId, questionConfigsJSON, sequenceNumber, stage FROM question "
				+ "LEFT JOIN test using(testId) "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE testId = ? AND researcherId = ?";
		
		System.out.println(sql);

		List<Map<String, Object>> questionList = jdbcTemplate.queryForList(sql, testId, researcherId);
		
	    final String result = mapper.writeValueAsString(questionList);
	    
	    return result;
	}
	
	public int createQuestion(Question question) {
		String sql = ""
				+ "INSERT INTO question (testId, questionConfigsJSON, sequenceNumber, stage) "
				+ "VALUES (?, ?, ?, ?)";
		
        return jdbcTemplate.update(sql, question.getTestId(), question.getQuestionConfigsJson(), question.getSequenceNumber(), question.getStage());	
	}
}
