package com.disazure.usabcheck.entity;

public class VideoTimeStamp {
	private int timeStampId;
	private String testInstanceId;
	private String type;
	private String label;
	private String startTime;
	private String endTime;
	
	public VideoTimeStamp(int timeStampId, String testInstanceId, String type, String label, String startTime,
			String endTime) {
		
		this.timeStampId = timeStampId;
		this.testInstanceId = testInstanceId;
		this.type = type;
		this.label = label;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public int getTimeStampId() {
		return timeStampId;
	}

	public void setTimeStampId(int timeStampId) {
		this.timeStampId = timeStampId;
	}

	public String getTestInstanceId() {
		return testInstanceId;
	}

	public void setTestInstanceId(String testInstanceId) {
		this.testInstanceId = testInstanceId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}	
}
