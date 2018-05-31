package com.codecool.web.service.jsService;

import com.codecool.web.dao.TaskAssignmentDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.TaskAssignmentDaoImpl;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.model.Task;
import com.codecool.web.service.ScheduleTaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;

public class JsScheduleTaskService implements ScheduleTaskService {

    private static final Logger logger = LoggerFactory.getLogger(JsScheduleUserService.class);

    private TaskDao taskDao;
    private TaskAssignmentDao taskAssignmentDao;

    public JsScheduleTaskService(Connection connection) {
        taskDao = new TaskDaoImpl(connection);
        taskAssignmentDao = new TaskAssignmentDaoImpl(connection);
    }

    @Override
    public Task getFilledTask(int taskId, int scheduleId) throws SQLException {
        logger.debug("getting filled task " + taskId + " with connections of schedule " + scheduleId);
        Task task = taskDao.findById(taskId);
        task = taskAssignmentDao.queryTaskConnectionData(task, scheduleId);
        return task;
    }

    @Override
    public void removeTaskFromSchedule(int taskId, int scheduleId) throws SQLException {
        logger.debug("removing task " + taskId + " from schedule " + scheduleId);
        taskAssignmentDao.removeTaskFromSchedule(taskId, scheduleId);
    }
}
