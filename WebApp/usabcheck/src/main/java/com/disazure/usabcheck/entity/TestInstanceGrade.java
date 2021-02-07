package com.disazure.usabcheck.entity;

public class TestInstanceGrade {
	private int testGradeId;
	private int testInstanceId;
	private String comment;
	
	public TestInstanceGrade(int testInstanceId) {
		super();
		this.testInstanceId = testInstanceId;
	}

	public int getTestGradeId() {
		return testGradeId;
	}

	public void setTestGradeId(int testGradeId) {
		this.testGradeId = testGradeId;
	}

	public int getTestInstanceId() {
		return testInstanceId;
	}

	public void setTestInstanceId(int testInstanceId) {
		this.testInstanceId = testInstanceId;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
}
