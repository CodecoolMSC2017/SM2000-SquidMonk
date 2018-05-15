package com.codecool.web.dto;

import java.util.List;

public class DashboardScheduleDto {

    private final int scheduleId, numOfTasks;
    private final String scheduleName;
    private final boolean isPublic;

    public DashboardScheduleDto(int scheduleId, int numOfTasks, String scheduleName, boolean isPublic) {
        this.scheduleId = scheduleId;
        this.numOfTasks = numOfTasks;
        this.scheduleName = scheduleName;
        this.isPublic = isPublic;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public int getNumOfTasks() {
        return numOfTasks;
    }

    public String getScheduleName() {
        return scheduleName;
    }

    public boolean isPublic() {
        return isPublic;
    }
}
