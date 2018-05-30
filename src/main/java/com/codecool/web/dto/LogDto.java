package com.codecool.web.dto;

import java.util.List;

public class LogDto {
    private List<String> logText;
    private List<String> logLevels;
    private List<String> logServlets;

    public LogDto(List<String> logText) {
        this.logText = logText;
    }

    public List<String> getLogText() {
        return logText;
    }

    public List<String> getLogLevels() {
        return logLevels;
    }

    public List<String> getLogServlets() {
        return logServlets;
    }

    public void setLogLevels(List<String> logLevels) {
        this.logLevels = logLevels;
    }

    public void setLogServlets(List<String> logServlets) {
        this.logServlets = logServlets;
    }
}
