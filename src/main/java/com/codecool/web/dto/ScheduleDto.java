package com.codecool.web.dto;

import java.util.ArrayList;
import java.util.List;

public class ScheduleDto {

    private int id;
    private List<ScheduleColumnDto> columns;

    public ScheduleDto(int id) {
        this.id = id;
        columns = new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public List<ScheduleColumnDto> getColumns() {
        return columns;
    }

    public void addColumns(ScheduleColumnDto columnDto) {
        columns.add(columnDto);
    }
}
