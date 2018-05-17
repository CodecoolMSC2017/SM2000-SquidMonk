package com.codecool.web.service.jsService;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.TskColSchedConnectorDao;
import com.codecool.web.dto.ScheduleColumnDto;
import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.dto.ScheduleTaskDto;
import com.codecool.web.model.Column;
import com.codecool.web.model.Task;
import com.codecool.web.service.ScheduleService;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JsScheduleService implements ScheduleService {

    private ColumnDao columnDao;
    private TskColSchedConnectorDao controlTable;
    private TaskDao taskDao;

    public JsScheduleService(ColumnDao columnDao, TaskDao taskDao, TskColSchedConnectorDao controlTable) {
        this.columnDao = columnDao;
        this.taskDao = taskDao;
        this.controlTable = controlTable;
    }

    @Override
    public List<Column> getColumnsByScheduleId(int schedId) throws SQLException {
        return columnDao.findAllByScheduleId(schedId);
    }

    @Override
    public List<Task> getTasksByScheduleId(int schedId) throws SQLException {
        List<Task> tasks = new ArrayList<>();
        List<Integer> taskIds = controlTable.queryTaskIdsByScheduleId(schedId);

        for (int taskId:taskIds) {
            tasks.add(controlTable.queryTaskConnectionData(taskDao.findById(taskId)));
        }

        return tasks;
    }

    @Override
    public ScheduleDto fillScheduleDto(int schedId) throws SQLException {
        ScheduleDto scheduleDto = new ScheduleDto(schedId);
        ScheduleColumnDto columnDto;
        ScheduleTaskDto taskDto;

        for (Column column:getColumnsByScheduleId(schedId)){
            columnDto = new ScheduleColumnDto(column.getId(), column.getName());
            scheduleDto.addColumns(columnDto);
        }

        for (Task task:getTasksByScheduleId(schedId)) {
            taskDto = new ScheduleTaskDto(task);

            for (ScheduleColumnDto column:scheduleDto.getColumns()) {
                if (task.getColId() == column.getId()) {
                    column.addTask(taskDto);
                }
            }
        }

        return scheduleDto;
    }

    @Override
    public void addNewColumnToSchedule(int schedId, String columnName) throws SQLException {
        columnDao.insertColumn(schedId, columnName);
    }
}
