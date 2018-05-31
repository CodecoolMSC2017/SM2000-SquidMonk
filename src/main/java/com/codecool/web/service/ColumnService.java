package com.codecool.web.service;

import com.codecool.web.model.Task;

import java.sql.SQLException;
import java.util.List;

public interface ColumnService {

    void deleteColumn(int columnId) throws SQLException;

    List<Task> getAvailableTasks(int userId, int columnId) throws SQLException;

    void addTaskToColumn(int columnId, int taskId, int start) throws SQLException;

    void clearColumn(int columnId) throws SQLException;
}
