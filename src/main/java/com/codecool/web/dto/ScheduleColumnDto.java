package com.codecool.web.dto;

import com.codecool.web.model.Task;

import java.util.HashMap;
import java.util.Map;

public class ScheduleColumnDto {

    private int id;
    private String name;
    private Map<Integer, Task> tasks;

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

    public Map<Integer, Task> getTasks() {
        return tasks;
    }

    public void addTask(Task taskDto) {
        tasks.put(taskDto.getStart(), taskDto);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ScheduleColumnDto columnDto = (ScheduleColumnDto) o;
        return getId() == columnDto.getId();
    }
}
