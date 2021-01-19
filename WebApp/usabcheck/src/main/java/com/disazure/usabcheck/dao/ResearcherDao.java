package com.disazure.usabcheck.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.disazure.usabcheck.models.*;
import com.disazure.usabcheck.rowmappers.*;

@Component
public class ResearcherDao {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	public User findByUsername(String username) {
		String sql = "SELECT * FROM researcher WHERE username = ?";

		UserRowMapper userRowMapper = new UserRowMapper();
		
        return jdbcTemplate.queryForObject(sql, userRowMapper, username);
		
	}
	
	public int createUser(User user) {
		String sql = "INSERT INTO researcher (username, userPassword) VALUES (?, ?)";
		
        return jdbcTemplate.update(sql, user.getUsername(), user.getPassword());
		
	}

}
