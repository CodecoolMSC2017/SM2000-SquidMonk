package com.codecool.web.dto;

import java.util.ArrayList;
import java.util.List;

public class ScheduleDto {

    private int scheduleId;
    private List<ScheduleColumnDto> columns;

    public ScheduleDto(int scheduleId) {
        this.scheduleId = scheduleId;
        columns = new ArrayList<>();
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public List<ScheduleColumnDto> getColumns() {
        return columns;
    }

    public void addColumns(ScheduleColumnDto columnDto) {
        columns.add(columnDto);
    }
}
