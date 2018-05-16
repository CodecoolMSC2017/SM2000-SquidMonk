package com.codecool.web.dto;

public class DashboardTaskDto {

    private int id;
    private final String name, content;
    private final int scheduleId;

    public DashboardTaskDto(int id, String name, String content, int scheduleId) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.scheduleId = scheduleId;
    }

    public int getId() {
        return id;
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
