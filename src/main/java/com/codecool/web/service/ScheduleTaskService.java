package com.codecool.web.service;

import com.codecool.web.model.Task;

import java.sql.SQLException;

public interface ScheduleTaskService {

    Task getFilledTask(int taskId, int scheduleId) throws SQLException;

    void removeTaskFromSchedule(int taskId, int scheduleId) throws SQLException;
}
