package com.codecool.web.dto;

import java.util.Map;

public final class TaskDto {

    private int id;
    private String name, content;
    // schedule id : schedule name
    private Map<Integer, String> schedules;

    public TaskDto(int id, String name, String content, Map<Integer, String> schedules) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.schedules = schedules;
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

    public Map<Integer, String> getSchedules() {
        return schedules;
    }
}
