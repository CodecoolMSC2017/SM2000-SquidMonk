package com.codecool.web.dto;

import com.codecool.web.comparator.ScheduleComlumnDtoComparator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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

    public void sortColumnsById() {
        Collections.sort(columns, new ScheduleComlumnDtoComparator());
    }
}
