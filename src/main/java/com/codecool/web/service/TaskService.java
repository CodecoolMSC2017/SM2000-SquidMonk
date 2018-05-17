package com.codecool.web.service;

import com.codecool.web.dto.DashboardTaskDto;
import com.codecool.web.model.Task;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;
import java.util.List;

public interface TaskService {

    List<Task> findAllByUserId(int userId) throws SQLException;

    void insertTask (int userId, String name, String content) throws SQLException, ServiceException;

    void updateTask(int taskId, String newName, String newContent) throws SQLException;

    void deleteTask(int taskId) throws SQLException;

    Task getById(int taskId) throws SQLException;

    List<DashboardTaskDto> getDtos(int userId) throws SQLException;
}
