package com.disazure.usabcheck.entity;

public class Task {
	private int taskId;
	private String taskName;
	private int testId;
	private String stepsJson;
	private int sequenceNumber;
	
	public Task(String taskName, int testId, String stepsJson, int sequenceNumber) {
		super();
		this.taskName = taskName;
		this.testId = testId;
		this.stepsJson = stepsJson;
		this.sequenceNumber = sequenceNumber;
	}

	public int getTaskId() {
		return taskId;
	}

	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public int getTestId() {
		return testId;
	}

	public void setTestId(int testId) {
		this.testId = testId;
	}

	public String getStepsJson() {
		return stepsJson;
	}

	public void setStepsJson(String stepsJson) {
		this.stepsJson = stepsJson;
	}

	public int getSequenceNumber() {
		return sequenceNumber;
	}

	public void setSequenceNumber(int sequenceNumber) {
		this.sequenceNumber = sequenceNumber;
	}
}
