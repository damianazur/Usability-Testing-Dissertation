package com.disazure.usabcheck.entity;

public class Answer {
	private int answerId;
	private String anwerJSON;
	private int questionId;
	
	public Answer(String anwerJSON, int questionId) {
		super();
		this.anwerJSON = anwerJSON;
		this.questionId = questionId;
	}

	public int getAnswerId() {
		return answerId;
	}

	public void setAnswerId(int answerId) {
		this.answerId = answerId;
	}

	public String getAnwerJSON() {
		return anwerJSON;
	}

	public void setAnwerJSON(String anwerJSON) {
		this.anwerJSON = anwerJSON;
	}

	public int getQuestionId() {
		return questionId;
	}

	public void setQuestionId(int questionId) {
		this.questionId = questionId;
	}
}
