package com.disazure.usabcheck.entity;

public class UsabilityTestInstance {
	private int testInstanceId;
	private int testId;
	private String studyDate;
	private String videoLocation;
	
	public UsabilityTestInstance(int testId, String studyDate) {
		super();
		this.testId = testId;
		this.studyDate = studyDate;
	}

	public int getTestInstanceId() {
		return testInstanceId;
	}

	public void setTestInstanceId(int testInstanceId) {
		this.testInstanceId = testInstanceId;
	}

	public int getTestId() {
		return testId;
	}

	public void setTestId(int testId) {
		this.testId = testId;
	}

	public String getStudyDate() {
		return studyDate;
	}

	public void setStudyDate(String studyDate) {
		this.studyDate = studyDate;
	}

	public String getVideoLocation() {
		return videoLocation;
	}

	public void setVideoLocation(String videoLocation) {
		this.videoLocation = videoLocation;
	}
}
