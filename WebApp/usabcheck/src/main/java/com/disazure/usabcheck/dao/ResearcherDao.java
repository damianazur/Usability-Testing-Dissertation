package com.disazure.usabcheck.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.disazure.usabcheck.entity.*;
import com.disazure.usabcheck.rowmappers.*;

@Component
public class ResearcherDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	public Researcher findByUsername(String username) {
		String sql = "SELECT * FROM researcher WHERE username = ?";

		ResearcherRowMapper userRowMapper = new ResearcherRowMapper();
		
        return jdbcTemplate.queryForObject(sql, userRowMapper, username);
		
	}
	
	public boolean existsByUsername(String username) {
		String sql = "SELECT COUNT(username) FROM researcher WHERE username = ?";
		
		int count = jdbcTemplate.queryForObject(sql, Integer.class, username);
		
		if (count == 1) {
			return true;
		}
		
		return false;
		
	}
	
	public int createUser(Researcher researcher) {
		String sql = "INSERT INTO researcher (username, userPassword) VALUES (?, ?)";
		
        return jdbcTemplate.update(sql, researcher.getUsername(), researcher.getPassword());
		
	}

}
