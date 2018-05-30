package com.codecool.web.dao.local;

import com.codecool.web.dao.LogDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class LogDaoLocal implements LogDao {

    private static final Logger logger = LoggerFactory.getLogger(LogDaoLocal.class);

    @Override
    public List<String> readLog() throws IOException {
        List<String> log = new ArrayList<>();
        String logFile = "/tmp/squidmonk.log";
        logger.debug("Starting logfile read");

        File file = new File(logFile);
        if (!file.exists()) {
            file.createNewFile();
        }

        try (BufferedReader br = new BufferedReader(new FileReader(logFile))) {
            String line;
            while ((line = br.readLine()) != null) {
                log.add(line);
            }
        }
        logger.debug("Finished logfile read");
        return log;
    }
}
