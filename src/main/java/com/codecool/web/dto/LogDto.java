package com.codecool.web.dto;

import java.util.ArrayList;
import java.util.List;

public class LogDto {
    private List<String> logText;
    private List<String> logLevels;
    private List<String> logServlets;
    private List<String> checkedLogLevels;
    private List<String> checkedServlets;

    public LogDto(List<String> logText) {
        this.logText = logText;
        this.checkedLogLevels = new ArrayList<>();
        this.checkedServlets = new ArrayList<>();
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

    public void setLogText(List<String> logText) {
        this.logText = logText;
    }

    public List<String> getCheckedLogLevels() {
        return checkedLogLevels;
    }

    public void setCheckedLogLevels(List<String> checkedLogLevels) {
        this.checkedLogLevels = checkedLogLevels;
    }

    public List<String> getCheckedServlets() {
        return checkedServlets;
    }

    public void setCheckedServlets(List<String> checkedServlets) {
        this.checkedServlets = checkedServlets;
    }
}
