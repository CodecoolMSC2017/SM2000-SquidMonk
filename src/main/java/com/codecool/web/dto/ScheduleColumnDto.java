package com.codecool.web.dto;

import java.util.HashMap;
import java.util.Map;

public class ScheduleColumnDto {

    private int id;
    private String name;
    private Map<Integer, ScheduleTaskDto> tasks;

    public ScheduleColumnDto(int id, String name) {
        this.id = id;
        this.name = name;
        tasks = new HashMap<>();
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Map<Integer, ScheduleTaskDto> getTasks() {
        return tasks;
    }

    public void addTask(ScheduleTaskDto taskDto) {
        tasks.put(taskDto.getTask().getStart(), taskDto);
    }
}
