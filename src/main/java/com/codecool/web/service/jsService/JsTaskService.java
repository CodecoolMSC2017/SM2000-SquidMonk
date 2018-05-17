package com.codecool.web.service.jsService;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.ScheduleDaoImpl;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.dto.DashboardTaskDto;
import com.codecool.web.dto.TaskDto;
import com.codecool.web.model.Schedule;
import com.codecool.web.model.Task;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.exception.ServiceException;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JsTaskService implements TaskService {

    private TaskDao taskDao;
    private ScheduleDao scheduleDao;

    public JsTaskService(Connection connection) {
        this.taskDao = new TaskDaoImpl(connection);
        this.scheduleDao = new ScheduleDaoImpl(connection);
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
    public void updateTask(int taskId, String newName, String newContent) throws SQLException, ServiceException {
        if (newName == null || newName.equals("")) {
            throw new ServiceException("Task name can not be empty!");
        }
        taskDao.updateName(taskId, newName);
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

    @Override
    public TaskDto getDtoById(int taskId) throws SQLException {
        Task task = getById(taskId);
        Map<Integer, String> schedules = scheduleDao.findAllByTaskId(taskId);

        return new TaskDto(task.getId(), task.getName(), task.getContent(), schedules);
    }

    @Override
    public TaskDto getDtoWithAvailableSchedules(int userId, int taskId) throws SQLException {
        List<Schedule> allSchedules = scheduleDao.findAllByUserId(userId);
        List<Integer> idsOfOccupiedSchedules = scheduleDao.getSchedulesOfTask(userId, taskId);
        // schedule id : schedule name
        Map<Integer, String> availableSchedules = new HashMap<>();
        for (Schedule schedule : allSchedules) {
            if (!idsOfOccupiedSchedules.contains(schedule.getId())) {
                availableSchedules.put(schedule.getId(), schedule.getName());
            }
        }
        Task task = getById(taskId);

        return new TaskDto(task.getId(), task.getName(), task.getContent(), availableSchedules);
    }
}
