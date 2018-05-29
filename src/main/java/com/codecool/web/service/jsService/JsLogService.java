package com.codecool.web.service.jsService;

import com.codecool.web.dao.LogDao;
import com.codecool.web.service.LogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

public class JsLogService implements LogService {

    private static final Logger logger = LoggerFactory.getLogger(JsLogService.class);
    private LogDao logDao;

    public JsLogService(LogDao logDao) {
        this.logDao = logDao;
    }

    @Override
    public List<String> readLog() throws IOException {
        return logDao.readLog();
    }
}
