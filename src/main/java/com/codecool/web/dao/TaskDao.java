package com.codecool.web.dao;

import com.codecool.web.dto.DashboardTaskDto;
import com.codecool.web.model.Task;

import java.sql.SQLException;
import java.util.List;

public interface TaskDao {

    Task findById(int id) throws SQLException;

    List<Task> findAllByUserId(int userId) throws SQLException;

    int insertTask (int userId, String name, String content) throws SQLException;

    void deleteTask (int taskId) throws SQLException;

    void updateName (int taskId, String name) throws SQLException;

    void updateContent (int taskId, String content) throws SQLException;

    List<DashboardTaskDto> findTaskUsages(int userId) throws SQLException;
}
