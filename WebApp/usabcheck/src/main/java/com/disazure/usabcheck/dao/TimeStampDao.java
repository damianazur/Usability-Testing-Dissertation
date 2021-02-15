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
public class TimeStampDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String getByInstanceId(int researcherId, int instanceId) throws JsonProcessingException {
		String sql = ""
				+ "SELECT timeStampId, testInstanceId, type, label, startTime, endTime FROM videotimestamp "
				+ "LEFT JOIN testInstance using(testInstanceId) "
				+ "LEFT JOIN test using(testId) "
				+ "LEFT JOIN project using(projectId) "
				+ "LEFT JOIN researcher using(researcherId) "
				+ "WHERE researcherId = ? AND testInstanceId = ?";
		

		List<Map<String, Object>> timeStampList = jdbcTemplate.queryForList(sql, researcherId, instanceId);
		final String jsonString = mapper.writeValueAsString(timeStampList);
		
		System.out.println(jsonString);
	    return jsonString;
	}
	
	
	public int create(int testInstanceId, JsonArray timeStampList, String type) {
		String sql = ""
				+ "INSERT INTO videotimestamp (testInstanceId, type, label, startTime, endTime) "
				+ "VALUES (?, ?, ?, ?, ?)";
		
		for (JsonElement elem : timeStampList) {
			JsonObject object = elem.getAsJsonObject();
			
			String label = object.get("label").getAsString();
			String startTime = object.get("startTime").getAsString();
			String endTime;
			if (object.has("endTime")) {
				endTime = object.get("endTime").getAsString();
			} else {
				endTime = "N/A";
			}
			
			int returnVal = jdbcTemplate.update(sql, testInstanceId, type, label, startTime, endTime);
		}	
		
        return 0;
		
	}
}
