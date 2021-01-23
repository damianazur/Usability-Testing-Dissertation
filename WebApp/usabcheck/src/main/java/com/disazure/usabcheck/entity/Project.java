package com.disazure.usabcheck.entity;

public class Project {
	private int projectId;
	private String projectName;
	private int researcherId;

	public Project() {
	}

	public Project(String projectName, int researcherId) {
		this.projectName = projectName;
		this.researcherId = researcherId;
	}

	public int getProjectId() {
		return projectId;
	}

	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public int getResearcherId() {
		return researcherId;
	}

	public void setResearcherId(int researcherId) {
		this.researcherId = researcherId;
	}

	
}
