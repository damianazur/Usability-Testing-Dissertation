package com.disazure.usabcheck;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

@RestController
@RequestMapping("/api/localapp")
public class LocalAppController {

	@RequestMapping(value = "/test", method = RequestMethod.POST)
	public ResponseEntity<?> getTests(@RequestParam  Map<String, String> json) {
		System.out.println("Local Entry" + json);
		
		return new ResponseEntity<String>("0", HttpStatus.OK);
	}
}
