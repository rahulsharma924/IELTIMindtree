package com.aem.ie.core.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FMDateUtils {

	private static final Logger LOGGER = LoggerFactory.getLogger(FMDateUtils.class);

	private FMDateUtils() {
	}

	public static Date convertToDate(String date, String format) {
		Date formattedDate = null;
		try {
			formattedDate = new SimpleDateFormat(format).parse(date);
		} catch (ParseException e) {
			LOGGER.error("error occurred in convertToDate in FMDateUtils : {}", e.getMessage());
		}
		return formattedDate;
	}

	public static String convertToString(Date date, String format) {
		return new SimpleDateFormat(format).format(date);
	}
}
