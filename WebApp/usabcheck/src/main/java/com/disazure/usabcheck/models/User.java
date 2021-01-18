package com.disazure.usabcheck.models;

import java.util.HashSet;
import java.util.Set;

public class User {

	private Long researcherId;
	private String username;
	private String password;

	public User() {
	}

	public User(String username, String password) {
		this.username = username;
		this.password = password;
	}

	public Long getResearcherId() {
		return researcherId;
	}

	public void setId(Long researcherId) {
		this.researcherId = researcherId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
