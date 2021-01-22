package com.disazure.usabcheck.entity;

public class Project {
	private Long projectId;
	private String projectName;
	private Long researcherId;

	public Project() {
	}

	public Project(String projectName, Long researcherId) {
		super();
		this.projectName = projectName;
		this.researcherId = researcherId;
	}

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public Long getResearcherId() {
		return researcherId;
	}

	public void setResearcherId(Long researcherId) {
		this.researcherId = researcherId;
	}

	
}
