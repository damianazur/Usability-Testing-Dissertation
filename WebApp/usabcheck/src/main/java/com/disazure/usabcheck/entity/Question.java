package com.disazure.usabcheck.entity;

public class Question {
	private int questionId;
	private int testId;
	private String questionConfigsJson;
	private int sequenceNumber;
	private String stage;
	
	public Question(int testId, String questionConfigsJson, int sequenceNumber, String stage) {
		super();
		this.testId = testId;
		this.questionConfigsJson = questionConfigsJson;
		this.sequenceNumber = sequenceNumber;
		this.stage = stage;
	}

	public int getQuestionId() {
		return questionId;
	}

	public void setQuestionId(int questionId) {
		this.questionId = questionId;
	}

	public int getTestId() {
		return testId;
	}

	public void setTestId(int testId) {
		this.testId = testId;
	}

	public String getQuestionConfigsJson() {
		return questionConfigsJson;
	}

	public void setQuestionConfigsJson(String questionConfigsJson) {
		this.questionConfigsJson = questionConfigsJson;
	}

	public int getSequenceNumber() {
		return sequenceNumber;
	}

	public void setSequenceNumber(int sequenceNumber) {
		this.sequenceNumber = sequenceNumber;
	}

	public String getStage() {
		return stage;
	}

	public void setStage(String stage) {
		this.stage = stage;
	}
	
	
}
