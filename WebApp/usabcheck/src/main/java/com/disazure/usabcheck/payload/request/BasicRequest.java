package com.disazure.usabcheck.payload.request;

import javax.validation.constraints.NotBlank;

public class BasicRequest {
	@NotBlank
	private String token;
	
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}
