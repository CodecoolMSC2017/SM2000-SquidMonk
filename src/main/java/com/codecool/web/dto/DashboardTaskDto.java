package com.codecool.web.dto;

public class DashboardTaskDto {
    private final String name, content;
    private final int scheduleId;

    public DashboardTaskDto(String name, String content, int scheduleId) {
        this.name = name;
        this.content = content;
        this.scheduleId = scheduleId;
    }

    public String getName() {
        return name;
    }

    public String getContent() {
        return content;
    }

    public int getScheduleId() {
        return scheduleId;
    }
}
