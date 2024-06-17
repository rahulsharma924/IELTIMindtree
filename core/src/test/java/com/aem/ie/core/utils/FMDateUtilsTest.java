package com.aem.ie.core.utils;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;

import java.text.ParseException;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;


class FMDateUtilsTest {

    Date date = new Date();

    @Test
    void convertToDate() {
        FMDateUtils.convertToDate("04/13/2023","MM/dd/yyyy");
    }

    @Test
    void convertToString() {
        FMDateUtils.convertToString(date,"MM/dd/yyyy");
    }
}