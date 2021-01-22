package com.disazure.usabcheck;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.core.*;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import com.disazure.usabcheck.dao.*;
import com.disazure.usabcheck.entity.Project;
import com.disazure.usabcheck.payload.request.BasicRequest;
import com.disazure.usabcheck.payload.request.GetMyUsernameRequest;
import com.disazure.usabcheck.payload.response.MessageResponse;
import com.disazure.usabcheck.security.jwt.JwtUtils;

@CrossOrigin
@RestController
@RequestMapping("/api/auth/main")
public class MainController {
	
	@Autowired
	private ResearcherDao resDao;
	
	@Autowired
	private ProjectDao proDao;
	
	
	@Autowired
	JwtUtils jwtUtils;
	
	@PostMapping("/getProjects")
	public ResponseEntity<?> getProjects(@Valid @RequestBody BasicRequest basicRequest) {
		String token = basicRequest.getToken();
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		System.out.println(username + " " + researcherId);
		
		String result = "";
		
		try {
			result = proDao.findByResearcherId(researcherId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@PostMapping("/getMyUsername2")
	public ResponseEntity<?> getMyUsername2(@Valid @RequestBody GetMyUsernameRequest getMyUsernameRequest) {
		System.out.println("#Your token is: " + getMyUsernameRequest.getToken());
		
		String username = jwtUtils.getUserNameFromJwtToken(getMyUsernameRequest.getToken());
		
		System.out.println("#Your username is: " + username);

		return ResponseEntity.ok(new MessageResponse(username));
	}
}
