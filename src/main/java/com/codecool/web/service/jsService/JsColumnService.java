package com.codecool.web.service.jsService;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.ColumnDaoImpl;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.model.Column;
import com.codecool.web.model.Task;
import com.codecool.web.service.ColumnService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JsColumnService implements ColumnService {

    private static final Logger logger = LoggerFactory.getLogger(JsColumnService.class);

    private ColumnDao columnDao;
    private TaskDao taskDao;

    public JsColumnService(Connection connection) {
        columnDao = new ColumnDaoImpl(connection);
        taskDao = new TaskDaoImpl(connection);
    }

    @Override
    public void deleteColumn(int columnId) throws SQLException {
        logger.info("deleting column with id " + columnId);
        columnDao.deleteColumn(columnId);
    }

    @Override
    public List<Task> getAvailableTasks(int userId, int columnId) throws SQLException {
        Column column = columnDao.findById(columnId);
        int scheduleId = column.getScheduleId();
        List<Task> allTasks = taskDao.findAllByUserId(userId);
        List<Task> availableTasks = new ArrayList<>();

        for (Task task : allTasks) {
            // if ()
        }

        return availableTasks;
    }
}
