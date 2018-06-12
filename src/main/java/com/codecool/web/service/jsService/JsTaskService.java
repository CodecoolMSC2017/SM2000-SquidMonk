package com.codecool.web.service.jsService;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.TaskAssignmentDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.ScheduleDaoImpl;
import com.codecool.web.dao.implementation.TaskAssignmentDaoImpl;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.dto.DashboardTaskDto;
import com.codecool.web.dto.TaskDto;
import com.codecool.web.model.Schedule;
import com.codecool.web.model.Task;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.exception.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JsTaskService implements TaskService {

    private static final Logger logger = LoggerFactory.getLogger(JsTaskService.class);

    private TaskDao taskDao;
    private ScheduleDao scheduleDao;
    private TaskAssignmentDao taskAssignmentDao;

    public JsTaskService(Connection connection) {
        this.taskDao = new TaskDaoImpl(connection);
        this.scheduleDao = new ScheduleDaoImpl(connection);
        this.taskAssignmentDao = new TaskAssignmentDaoImpl(connection);
    }

    @Override
    public List<Task> findAllByUserId(int userId) throws SQLException {
        logger.info("fetching all tasks of user with id " + userId);
        return taskDao.findAllByUserId(userId);
    }

    @Override
    public int insertTask(int userId, String name, String content) throws SQLException, ServiceException {
        logger.info("inserting task for user with id " + userId);
        if (name == null || name.equals("")) {
            throw new ServiceException("Task name can not be empty!");
        }
        return taskDao.insertTask(userId, name, content);
    }

    @Override
    public void assignTask(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException {
        logger.info("Assining task to schedule " + scheduleId + ", column " + colId);
        taskAssignmentDao.insertTask(taskId, colId, scheduleId, taskStart, taskEnd);
    }

    @Override
    public void updateTask(int taskId, String newName, String newContent) throws SQLException, ServiceException {
        if (newName == null || newName.equals("")) {
            throw new ServiceException("Task name can not be empty!");
        }
        logger.info("updating name of task with id " + taskId);
        taskDao.updateName(taskId, newName);
        if (newContent != null) {
            logger.info("updating content of task with id " + taskId);
            taskDao.updateContent(taskId, newContent);
        }
    }

    @Override
    public void updateTask(int taskId, int scheduleId, String newName, String newContent, int start, int end) throws SQLException, ServiceException {
        if (newName == null || newName.equals("")) {
            throw new ServiceException("Task name can not be empty!");
        }
        logger.info("updating name of task with id " + taskId);
        taskDao.updateName(taskId, newName);
        if (newContent != null) {
            logger.info("updating content of task with id " + taskId);
            taskDao.updateContent(taskId, newContent);
        }

        logger.info("Updating start and end times for task " + taskId + " in schedule " + scheduleId);
        taskAssignmentDao.updateTaskTime(taskId, scheduleId, start, end);
    }

    @Override
    public void deleteTask(int taskId) throws SQLException {
        logger.info("deleting task with id " + taskId);
        taskDao.deleteTask(taskId);
    }

    @Override
    public Task getById(int taskId) throws SQLException {
        Task task = taskDao.findById(taskId);
        if (task == null) {
            logger.debug(String.format("task with id %s is not found", taskId));
        } else {
            logger.debug(String.format("task with id %s is found", taskId));
        }
        return task;
    }

    @Override
    public List<DashboardTaskDto> getDtos(int userId) throws SQLException {
        logger.info("fetching tasks for user with id " + userId);
        return taskDao.findTaskUsages(userId);
    }

    @Override
    public TaskDto getDtoById(int taskId) throws SQLException {
        Task task = getById(taskId);
        Map<Integer, String> schedules = scheduleDao.findAllByTaskId(taskId);

        String taskName = task.getName();
        String taskContent = task.getContent();

        return new TaskDto(taskId, taskName, taskContent, schedules);
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
