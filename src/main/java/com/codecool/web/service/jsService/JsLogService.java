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

    private LogDto readFullLogText() throws IOException {
        return new LogDto(logDao.readLog());
    }

    private LogDto getLogDetails(LogDto logDto) throws IOException {
        List<String> levels = new ArrayList<>();
        List<String> servlets = new ArrayList<>();

        String level = "";
        final String DEBUG = "DEBUG";
        final String INFO = "INFO";
        final String WARN = "WARN";
        final String ERROR = "ERROR";
        final String TRACE = "TRACE";

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

        return logDto;
    }
}
