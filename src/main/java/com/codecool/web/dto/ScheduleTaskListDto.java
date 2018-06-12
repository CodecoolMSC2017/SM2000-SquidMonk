package com.codecool.web.dto;

import com.codecool.web.model.Task;

import java.util.List;

public class ScheduleTaskListDto {

    private List<Task> tasks;
    private int startTime;
    private int columnId;

    public ScheduleTaskListDto(List<Task> tasks, int columnId, int startTime) {
        this.tasks = tasks;
        this.startTime = startTime;
        this.columnId = columnId;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public int getStartTime() {
        return startTime;
    }

    public int getColumnId() {
        return columnId;
    }
}
