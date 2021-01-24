package com.disazure.usabcheck;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.core.*;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import com.disazure.usabcheck.dao.*;
import com.disazure.usabcheck.entity.Project;
import com.disazure.usabcheck.entity.UsabilityTest;
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
	private TestDao testDao;
	
	
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
	
	@RequestMapping(value = "/createProject", method = RequestMethod.POST)
	public ResponseEntity<?> getProjects(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		String projectName = json.get("projectName");
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		Project newProject = new Project(projectName, researcherId);
		int result = proDao.createProject(newProject);
		
		return new ResponseEntity<String>(Integer.toString(result), HttpStatus.OK);
	}
	

	@RequestMapping(value = "/getTests", method = RequestMethod.POST)
	public ResponseEntity<?> getTests(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int projectId = Integer.parseInt(json.get("projectId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		String result = "";
		
		try {
			result = testDao.getByUsabilityTests(researcherId, projectId);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/deleteProject", method = RequestMethod.POST)
	public ResponseEntity<?> deleteProject(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int projectId = Integer.parseInt(json.get("projectId"));
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		
		int result = proDao.deleteProject(projectId, researcherId);
		
		return new ResponseEntity<String>(Integer.toString(result), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/deleteTest", method = RequestMethod.POST)
	public ResponseEntity<?> deleteTest(@RequestBody Map<String, String> json) {
		String token = json.get("token");
		int testId = Integer.parseInt(json.get("testId"));
		String testName = json.get("testName");
		String username = jwtUtils.getUserNameFromJwtToken(token);
		int researcherId = resDao.getIdFromUsername(username);
		
		int result = testDao.deleteTest(testId, testName, researcherId);
		
		return new ResponseEntity<String>(Integer.toString(result), HttpStatus.OK);
	}
}
