package com.aem.ie.core.models.datamodels;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith({AemContextExtension.class})
@TestInstance(value = TestInstance.Lifecycle.PER_CLASS)
class FAQTest {
     FAQ faq = new FAQ();

    @Test
    void setQuestion() {
        String question = "question";
        faq.setQuestion(question);
        assertEquals(question, faq.getQuestion());
    }
    @Test
    void getQuestion() {
        assertEquals("question", faq.getQuestion());
    }
    @Test
    void setAnswer() {
        String answer = "answer";
        faq.setAnswer(answer);
        assertEquals(answer, faq.getAnswer());
    }
    @Test
    void getAnswer() {
        assertEquals("answer", faq.getAnswer());
    }
    @Test
    void setFaqTag() {
        String faqTag = "faqTag";
        faq.setFaqTag(faqTag);
        assertEquals(faqTag, faq.getFaqTag());
    }
    @Test
    void getFaqTag() {
        assertEquals("faqTag", faq.getFaqTag());
    }
}