package com.codecool.web.service;

import com.codecool.web.dto.LogDto;

import java.io.IOException;
import java.util.List;

public interface LogService {

    LogDto readFullLog() throws IOException;

    LogDto readLastLinesFromLog(int numberOfLines) throws IOException;

    LogDto getFilteredData(String[] servlet, String[] logLevel) throws IOException;
}
