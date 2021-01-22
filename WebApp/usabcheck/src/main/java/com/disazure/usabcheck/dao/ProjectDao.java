package com.disazure.usabcheck.dao;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.disazure.usabcheck.entity.*;
import com.disazure.usabcheck.rowmappers.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ProjectDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	private final ObjectMapper mapper = new ObjectMapper();
	
	public String findByResearcherId(int resId) throws JsonProcessingException {
		System.out.println("ResId: " + resId);
		
		String sql = ""
				+ "SELECT * FROM project "
				+ "WHERE researcherId = ?";

		List<Map<String, Object>> projectsList = jdbcTemplate.queryForList(sql, resId);
		
	    final String result = mapper.writeValueAsString(projectsList);
	    
	    System.out.println("### Result: " + result);
	    
	    return result;
	}
	
	public int createProject(Project project) {
		String sql = ""
				+ "INSERT INTO project (projectName, researcherId) "
				+ "VALUES (?, ?)";
		
        return jdbcTemplate.update(sql, project.getProjectName(), project.getResearcherId());
		
	}
	
	public int deleteProject(int projectId, int researcherId) {
		String sql = ""
				+ "DELETE FROM project "
				+ "WHERE projectId = ? and researcherId = ?";
		
        return jdbcTemplate.update(sql, projectId, researcherId);
		
	}

}
