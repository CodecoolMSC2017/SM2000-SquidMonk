package com.codecool.web.dto;

import com.codecool.web.model.Task;

import java.util.ArrayList;
import java.util.List;

public class ScheduleTaskDto {

    private Task task;
    private List<Integer> slotsTaken; // if start=10 end=12 then (10,11) is the content

    public ScheduleTaskDto(Task task) {
        this.task = task;
        fillSlots();
    }

    private void fillSlots() {
        slotsTaken = new ArrayList<>();
        int n = task.getStart();

        for (int i = 0; i < (task.getEnd() - task.getStart()); i++) {
            slotsTaken.add(n);
            n++;
        }
    }

    public Task getTask() {
        return task;
    }

    public List<Integer> getSlotsTaken() {
        return slotsTaken;
    }
}
