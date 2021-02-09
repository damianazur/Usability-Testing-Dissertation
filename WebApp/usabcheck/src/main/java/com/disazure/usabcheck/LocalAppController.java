package com.disazure.usabcheck;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.disazure.usabcheck.entity.UsabilityTestInstance;
import com.disazure.usabcheck.security.services.UsabilityTestService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@RestController
@RequestMapping("/api/localapp")
public class LocalAppController {
	@Autowired
	private UsabilityTestService usabilityTestService;
	
	@RequestMapping(value = "/getTestDetailsByReferenceCode", method = RequestMethod.POST)
	public ResponseEntity<?> getTests(@RequestParam  Map<String, String> json) {
		System.out.println("Local Entry" + json);
		
		String referenceCode = json.get("referenceCode");
		
		String result = usabilityTestService.getTestsWithDetailsByReference(referenceCode);
		System.out.println(result);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/sendTestResults", method = RequestMethod.POST)
	public ResponseEntity<?> sendTestResults(@RequestParam  Map<String, String> json) {
		System.out.println("Test Results" + json);
				
		String result = "";
		try {
			result = usabilityTestService.createUsabilityTestInstance(json);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		System.out.println(result);
		
		return new ResponseEntity<String>("OK", HttpStatus.OK);
	}
}
