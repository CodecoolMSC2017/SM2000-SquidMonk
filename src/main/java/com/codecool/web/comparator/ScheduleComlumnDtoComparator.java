package com.codecool.web.comparator;

import com.codecool.web.dto.ScheduleColumnDto;

import java.util.Comparator;

public class ScheduleComlumnDtoComparator implements Comparator<ScheduleColumnDto> {
    @Override
    public int compare(ScheduleColumnDto o1, ScheduleColumnDto o2) {
        return Integer.compare(o1.getId(), o2.getId());
    }
}
