package com.codecool.web.dto;

import java.util.List;

public class LogDto {
    private List<String> logData;

    public LogDto(List<String> logData) {
        this.logData = logData;
    }

    public List<String> getLogData() {
        return logData;
    }

    public void setLogData(List<String> logData) {
        this.logData = logData;
    }
}
