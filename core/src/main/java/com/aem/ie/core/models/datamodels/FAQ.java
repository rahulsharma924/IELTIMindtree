package com.aem.ie.core.models.datamodels;

public class FAQ {
	private String question;
	private String answer;
	private String faqTag;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getFaqTag() {
        return faqTag;
    }

    public void setFaqTag(String faqTag) {
        this.faqTag = faqTag;
    }

}
