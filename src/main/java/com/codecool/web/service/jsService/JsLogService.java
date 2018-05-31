package com.codecool.web.service.jsService;

import com.codecool.web.dao.LogDao;
import com.codecool.web.dto.LogDto;
import com.codecool.web.service.LogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JsLogService implements LogService {

    private static final Logger logger = LoggerFactory.getLogger(JsLogService.class);
    private LogDao logDao;
    private final String DEBUG = "DEBUG";
    private final String INFO = "INFO";
    private final String WARN = "WARN";
    private final String ERROR = "ERROR";
    private final String TRACE = "TRACE";

    public JsLogService(LogDao logDao) {
        this.logDao = logDao;
    }

    @Override
    public LogDto readFullLog() throws IOException {
        return getLogDetails(readFullLogText());
    }

    @Override
    public LogDto readLastLinesFromLog(int numberOfLines) throws IOException {
        return null;
    }

    /***
     * Gets the full filter data from the original text, then it filters it based on the user's request.
     * Like this the user can always use the filter and can get data that he currently doesn't see.
     */
    @Override
    public LogDto getFilteredData(String servlet, String logLevel) throws IOException {
        LogDto logDto = getLogDetails(readFullLogText());
        List<String> filteredLogText = new ArrayList<>();

        //In case either is null match everything
        if (servlet.equals("undefined")) {
            servlet = ".*";
        }

        if (logLevel.equals("undefined")) {
            logLevel = ".*";
        }

        logger.debug("Beginning to filter text based on these keywords: " + servlet + ", " + logLevel);
        for (String s:logDto.getLogText()) {
            if (s.matches("(.*)" + servlet + "(.*)") && s.matches("(.*)" + logLevel + "(.*)")) {
                filteredLogText.add(s);
            }
        }
        logDto.setLogText(filteredLogText);

        return logDto;
    }

    private LogDto readFullLogText() throws IOException {
        return new LogDto(logDao.readLog());
    }

    private LogDto getLogDetails(LogDto logDto) throws IOException {
        List<String> levels = new ArrayList<>();
        List<String> servlets = new ArrayList<>();

        String level = "";

        logger.debug("Getting servlets and log levels from log text");

        for (String s:logDto.getLogText()){

            //Gets the servlet's name
            String[] stringParts = s.split("\\s+");
            String[] servletParts = stringParts[3].split("\\.");
            String servletName = servletParts[servletParts.length-1];

            if (!servlets.contains(servletName)) {
                servlets.add(servletName);
            }

            //Gets the current log level
            if (s.contains(DEBUG)) {
                level = DEBUG;
            } else if (s.contains(INFO)) {
                level = INFO;
            } else if (s.contains(WARN)) {
                level = WARN;
            } else if (s.contains(ERROR)) {
               level = ERROR;
            } else if (s.contains(TRACE)) {
                level = TRACE;
            }

            if (!levels.contains(level)) {
                levels.add(level);
            }
        }
        logDto.setLogLevels(levels);
        logDto.setLogServlets(servlets);

        logger.debug("Successfully extracted data for filter from log text");

        return logDto;
    }
}
