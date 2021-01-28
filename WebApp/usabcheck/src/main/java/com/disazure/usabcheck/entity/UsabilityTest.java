package com.disazure.usabcheck.entity;

public class UsabilityTest {
	private int testId;
	private String testName;
	private int projectId;
	private String launchedDate;
	private String status;
	private String referenceCode;
	
	public UsabilityTest(String testName, int projectId, String launchedDate, String status) {
		this.testName = testName;
		this.projectId = projectId;
		this.launchedDate = launchedDate;
		this.status = status;
	}

	public int getTestId() {
		return testId;
	}

	public void setTestId(int testId) {
		this.testId = testId;
	}

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}

	public int getProjectId() {
		return projectId;
	}

	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}

	public String getLaunchedDate() {
		return launchedDate;
	}

	public void setLaunchedDate(String launchedDate) {
		this.launchedDate = launchedDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getReferenceCode() {
		return referenceCode;
	}

	public void setReferenceCode(String referenceCode) {
		this.referenceCode = referenceCode;
	}
	
	
}
