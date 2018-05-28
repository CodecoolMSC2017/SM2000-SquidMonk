package com.codecool.web.dto;

<<<<<<< HEAD
import com.codecool.web.service.PassEncrypt;
=======
import com.codecool.web.comparator.ScheduleComlumnDtoComparator;
>>>>>>> 6292f15d81fd641c26db4136508e6072816a8d02

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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

<<<<<<< HEAD
    public String getUrl() {
        return url;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
=======
    public void sortColumnsById() {
        Collections.sort(columns, new ScheduleComlumnDtoComparator());
>>>>>>> 6292f15d81fd641c26db4136508e6072816a8d02
    }
}
