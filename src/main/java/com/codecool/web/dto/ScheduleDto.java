package com.codecool.web.dto;

import com.codecool.web.model.Column;
import com.codecool.web.model.Task;

import java.util.List;

public class ScheduleDto {

    private int scheduleId;
    private List<Column> columns;
    private List<Task> tasks;

    public ScheduleDto(int scheduleId, List<Column> columns, List<Task> tasks) {
        this.scheduleId = scheduleId;
        this.columns = columns;
        this.tasks = tasks;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public List<Task> getTasks() {
        return tasks;
    }
}
