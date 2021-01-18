package com.disazure.usabcheck;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.disazure.usabcheck.dao.*;

@RestController
public class MainController {
	
	@Autowired
	private ResearcherDao resDao;
	
	@GetMapping("")
    public String viewHomePage() {
		System.out.println("Home page...");
        return "index";
    }
	
    @GetMapping("/api/helloo")
    public String hello() {
    	
    	resDao.count();
    	
        return "Rest point accessed!!!";
    }
}
