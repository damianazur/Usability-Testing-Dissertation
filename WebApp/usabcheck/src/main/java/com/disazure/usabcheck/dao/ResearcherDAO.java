package com.disazure.usabcheck.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ResearcherDAO {
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
    public int count() {
    	System.out.println("Counting researchers: " + jdbcTemplate);
    	
        int count = jdbcTemplate.queryForObject("select count(*) from researcher", Integer.class);
        
        System.out.println(count);
        
        return count;
    }
}
