package com.codecool.web.service.jsService;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.ColumnDaoImpl;
import com.codecool.web.dao.implementation.ScheduleDaoImpl;
import com.codecool.web.dao.implementation.TaskAssignmentDao;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.dto.ScheduleColumnDto;
import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.model.Column;
import com.codecool.web.model.Schedule;
import com.codecool.web.model.Task;
import com.codecool.web.service.ScheduleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JsScheduleService implements ScheduleService {

    private static final Logger logger = LoggerFactory.getLogger(JsScheduleService.class);

    private ColumnDao columnDao;
    private TaskAssignmentDao controlTable;
    private TaskDao taskDao;
    private ScheduleDao scheduleDao;

    public JsScheduleService(Connection connection) {
        columnDao = new ColumnDaoImpl(connection);
        controlTable = new TaskAssignmentDao(connection);
        taskDao = new TaskDaoImpl(connection);
        scheduleDao = new ScheduleDaoImpl(connection);
    }

    @Override
    public List<Column> getColumnsByScheduleId(int schedId) throws SQLException {
        logger.info("getting columns of schedule with id " + schedId);
        return columnDao.findAllByScheduleId(schedId);
    }

    @Override
    public List<Task> getTasksByScheduleId(int schedId) throws SQLException {
        logger.info("getting tasks of schedule with id " + schedId);
        List<Task> tasks = new ArrayList<>();
        List<Integer> taskIds = controlTable.queryTaskIdsByScheduleId(schedId);
        for (int taskId : taskIds) {
            tasks.add(controlTable.queryTaskConnectionData(taskDao.findById(taskId), schedId));
        }
        return tasks;
    }

    @Override
    public ScheduleDto fillScheduleDto(int schedId) throws SQLException {
        logger.debug("fetching dto of schedule with id " + schedId);
        ScheduleDto scheduleDto = new ScheduleDto(schedId);
        Schedule schedule = scheduleDao.findById(schedId);
        scheduleDto.setPublic(schedule.isPublic());
        ScheduleColumnDto columnDto;

        for (Column column : getColumnsByScheduleId(schedId)) {
            columnDto = new ScheduleColumnDto(column.getId(), column.getName());
            scheduleDto.addColumns(columnDto);
        }
        for (Task task : getTasksByScheduleId(schedId)) {
            for (ScheduleColumnDto column : scheduleDto.getColumns()) {
                if (task.getColId() == column.getId()) {
                    column.addTask(task);
                }
            }
        }
        scheduleDto.sortColumnsById();
        return scheduleDto;
    }

    @Override
    public boolean getVisibility(int schedId) throws SQLException {
        return scheduleDao.getVisibility(schedId);
    }

    @Override
    public void updateVisibility(int schedId) throws SQLException {
        logger.info("updating visibility of schedule with id " + schedId);
        scheduleDao.updateVisibility(schedId);
    }

    @Override
    public void addNewColumnToSchedule(int schedId, String columnName) throws SQLException {
        logger.info("adding new column to schedule with id " + schedId);
        columnDao.insertColumn(schedId, columnName);
    }

    @Override
    public void updateColumnName(int columnId, String columnName) throws SQLException {
        logger.info("updating name of column with id " + columnId);
        columnDao.updateName(columnId, columnName);
    }

    @Override
    public void deleteSchedule(int schedId) throws SQLException {
        logger.info("deleting schedule with id " + schedId);
        scheduleDao.deleteSchedule(schedId);
    }
}
