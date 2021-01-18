package com.disazure.usabcheck.entity;

public class Researcher {
	private int researcherId;
    private String username;
    private String password;
 
    protected Researcher(int researcherId, String username, String password) {
    	this.researcherId = researcherId;
        this.username = username;
        this.password = password;
    }
}
