package com.disazure.usabcheck;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.disazure.usabcheck.entity.Researcher;
import com.disazure.usabcheck.payload.request.LoginRequest;
import com.disazure.usabcheck.payload.request.SignupRequest;
import com.disazure.usabcheck.payload.request.GetMyUsernameRequest;
import com.disazure.usabcheck.payload.response.JwtResponse;
import com.disazure.usabcheck.payload.response.MessageResponse;
import com.disazure.usabcheck.dao.*;
import com.disazure.usabcheck.security.jwt.JwtUtils;
import com.disazure.usabcheck.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	ResearcherDao researcherDao;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		

		return ResponseEntity.ok(new JwtResponse(jwt, 
												 userDetails.getResearcherId(), 
												 userDetails.getUsername()));
	}

	@PostMapping("/getMyUsername")
	public ResponseEntity<?> getMyUsername(@Valid @RequestBody GetMyUsernameRequest getMyUsernameRequest) {
		System.out.println("Your token is: " + getMyUsernameRequest.getToken());
		
		String username = jwtUtils.getUserNameFromJwtToken(getMyUsernameRequest.getToken());
		
		System.out.println("Your username is: " + username);

		return ResponseEntity.ok(new MessageResponse(username));
	}
	
	
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (researcherDao.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Username is already taken!"));
		}

		// Create new user's account
		Researcher researcher = new Researcher(signUpRequest.getUsername(), 
							 encoder.encode(signUpRequest.getPassword()));

		researcherDao.createUser(researcher);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
}