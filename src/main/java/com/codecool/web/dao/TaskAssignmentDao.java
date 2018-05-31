package com.codecool.web.dao;

import com.codecool.web.model.Task;

import java.sql.SQLException;
import java.util.List;

public interface TaskAssignmentDao {

    boolean queryTaskPresent(int taskId) throws SQLException;

    Task queryTaskConnectionData(Task task, int scheduleId) throws SQLException;

    List<Integer> queryTaskIdsByScheduleId(int schedId) throws SQLException;

    void insertTask(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException;

    void updateTaskSchedule(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException;

    void updateTaskTime(int taskId, int scheduleId, int taskStart, int taskEnd) throws SQLException;

    void updateTaskColumn(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException;

    void removeTaskFromAllSchedules(int taskId) throws SQLException;

    void removeTaskFromSchedule(int taskId, int scheduleId) throws SQLException;

    void clearColumn(int columnId) throws SQLException;

}
