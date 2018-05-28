package com.codecool.web.service.jsService;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.ColumnDaoImpl;
import com.codecool.web.dao.implementation.ScheduleDaoImpl;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.dao.implementation.TskColSchedConnectorDao;
import com.codecool.web.dto.ScheduleColumnDto;
import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.model.Column;
import com.codecool.web.model.Schedule;
import com.codecool.web.model.Task;
import com.codecool.web.service.ScheduleService;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JsScheduleService implements ScheduleService {

    private ColumnDao columnDao;
    private TskColSchedConnectorDao controlTable;
    private TaskDao taskDao;
    private ScheduleDao scheduleDao;

    public JsScheduleService(Connection connection) {
        columnDao = new ColumnDaoImpl(connection);
        controlTable = new TskColSchedConnectorDao(connection);
        taskDao = new TaskDaoImpl(connection);
        scheduleDao = new ScheduleDaoImpl(connection);
    }

    @Override
    public List<Column> getColumnsByScheduleId(int schedId) throws SQLException {
        return columnDao.findAllByScheduleId(schedId);
    }

    @Override
    public List<Task> getTasksByScheduleId(int schedId) throws SQLException {
        List<Task> tasks = new ArrayList<>();
        List<Integer> taskIds = controlTable.queryTaskIdsByScheduleId(schedId);
        for (int taskId : taskIds) {
            tasks.add(controlTable.queryTaskConnectionData(taskDao.findById(taskId)));
        }
        return tasks;
    }

    @Override
    public ScheduleDto fillScheduleDto(int schedId) throws SQLException {
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
    public void addNewColumnToSchedule(int schedId, String columnName) throws SQLException {
        columnDao.insertColumn(schedId, columnName);
    }

    @Override
    public void deleteSchedule(int schedId) throws SQLException {
        scheduleDao.deleteSchedule(schedId);
    }
}
