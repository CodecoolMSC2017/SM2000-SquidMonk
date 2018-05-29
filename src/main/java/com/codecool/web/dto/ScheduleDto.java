package com.codecool.web.dto;

import com.codecool.web.service.PassEncrypt;
import com.codecool.web.comparator.ScheduleComlumnDtoComparator;

import java.util.ArrayList;
import java.util.List;

public class ScheduleDto {

    private int id;
    private List<ScheduleColumnDto> columns;
    private String url;
    private boolean isPublic;

    public ScheduleDto(int id) {
        this.id = id;
        this.url = new PassEncrypt().encrypt(String.valueOf(this.id));
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

    public String getUrl() {
        return url;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;

    }

    public void sortColumnsById() {
        columns.sort(new ScheduleComlumnDtoComparator());
    }
}
