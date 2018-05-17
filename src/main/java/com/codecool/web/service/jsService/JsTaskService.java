package com.codecool.web.service.jsService;

import com.codecool.web.dao.TaskDao;
import com.codecool.web.dto.DashboardTaskDto;
import com.codecool.web.model.Task;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;
import java.util.List;

public class JsTaskService implements TaskService {

    private TaskDao taskDao;

    public JsTaskService(TaskDao taskDao) {
        this.taskDao = taskDao;
    }

    @Override
    public List<Task> findAllByUserId(int userId) throws SQLException {
        return taskDao.findAllByUserId(userId);
    }

    @Override
    public void insertTask(int userId, String name, String content) throws SQLException, ServiceException {
        if (name == null || name.equals("")) {
            throw new ServiceException("Task name can not be empty!");
        }
        taskDao.insertTask(userId, name, content);
    }

    @Override
    public void updateTask(int taskId, String newName, String newContent) throws SQLException {
        if (newName != null) {
            taskDao.updateName(taskId, newName);
        }
        if (newContent != null) {
            taskDao.updateContent(taskId, newContent);
        }
    }

    @Override
    public void deleteTask(int taskId) throws SQLException {
        taskDao.deleteTask(taskId);
    }

    @Override
    public Task getById(int taskId) throws SQLException {
        return taskDao.findById(taskId);
    }

    @Override
    public List<DashboardTaskDto> getDtos(int userId) throws SQLException {
        return taskDao.findTaskUsages(userId);
    }
}
