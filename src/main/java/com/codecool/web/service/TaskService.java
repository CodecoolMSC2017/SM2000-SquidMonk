package com.codecool.web.service;

import com.codecool.web.dto.DashboardTaskDto;
import com.codecool.web.dto.TaskDto;
import com.codecool.web.model.Task;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;
import java.util.List;

public interface TaskService {

    List<Task> findAllByUserId(int userId) throws SQLException;

    void insertTask (int userId, String name, String content) throws SQLException, ServiceException;

    void updateTask(int taskId, String newName, String newContent) throws SQLException, ServiceException;

    void deleteTask(int taskId) throws SQLException;

    Task getById(int taskId) throws SQLException;

    List<DashboardTaskDto> getDtos(int userId) throws SQLException;

    TaskDto getDtoById(int taskId) throws SQLException;
}
