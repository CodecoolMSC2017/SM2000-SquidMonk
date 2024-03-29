package com.codecool.web.dao.implementation;

import com.codecool.web.dao.TaskAssignmentDao;
import com.codecool.web.model.Task;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TaskAssignmentDaoImpl extends AbstractDao implements TaskAssignmentDao {

    public TaskAssignmentDaoImpl(Connection connection) {
        super(connection);
    }

    @Override
    public boolean queryTaskPresent(int taskId) throws SQLException {
        String sql = "SELECT task_id FROM col_tsk WHERE task_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    String id = resultSet.getString("task_id");
                    return id != null;
                }
            }
        }
        return false;
    }

    @Override
    public Task queryTaskConnectionData(Task task, int scheduleId) throws SQLException {
        String sql = "SELECT task_id, col_id, schedule_id, task_start, task_end FROM col_tsk WHERE task_id = ? AND schedule_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, task.getId());
            statement.setInt(2, scheduleId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    int colId = resultSet.getInt("col_id");
                    int taskStart = resultSet.getInt("task_start");
                    int taskEnd = resultSet.getInt("task_end");

                    return fillTask(task, colId, scheduleId, taskStart, taskEnd);
                }
            }
        }
        return task;
    }

    @Override
    public List<Integer> queryTaskIdsByScheduleId(int schedId) throws SQLException {
        String sql = "SELECT task_id FROM col_tsk WHERE schedule_id = ?";
        List<Integer> taskIds = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, schedId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    int taskId = resultSet.getInt("task_id");
                    taskIds.add(taskId);
                }
                return taskIds;
            }
        }
    }

    @Override
    public void insertTask(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException {
        String sql = "INSERT INTO col_tsk (task_id, col_id, schedule_id, task_start, task_end) VALUES (?,?,?,?,?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            statement.setInt(2, colId);
            statement.setInt(3, scheduleId);
            statement.setInt(4, taskStart);
            statement.setInt(5, taskEnd);
            executeInsert(statement);
        }
    }

    /**
     * To be used when a task is moved to a new schedule
     */
    @Override
    public void updateTaskSchedule(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException {
        String sql = "UPDATE col_tsk SET col_id=?, schedule_id=?, task_start=?, task_end=? WHERE task_id=?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(5, taskId);
            statement.setInt(1, colId);
            statement.setInt(2, scheduleId);
            statement.setInt(3, taskStart);
            statement.setInt(4, taskEnd);
            executeInsert(statement);
        }
    }

    /**
     * To be used when only the start/end time of a task changes
     */
    @Override
    public void updateTaskTime(int taskId, int scheduleId, int taskStart, int taskEnd) throws SQLException {
        String sql = "UPDATE col_tsk SET task_start = ?, task_end = ? " +
                "WHERE task_id = ? AND schedule_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskStart);
            statement.setInt(2, taskEnd);
            statement.setInt(3, taskId);
            statement.setInt(4, scheduleId);
            executeInsert(statement);
        }
    }

    /**
     * To be used when the task stays in it's schedule, but moved to a different column
     */
    @Override
    public void updateTaskColumn(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException {
        String sql = "UPDATE col_tsk SET col_id = ?, task_start = ?, task_end = ? " +
                "WHERE task_id = ? AND schedule_id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, colId);
            statement.setInt(2, taskStart);
            statement.setInt(3, taskEnd);
            statement.setInt(4, taskId);
            statement.setInt(5, scheduleId);
            executeInsert(statement);
        }
    }

    @Override
    public void removeTaskFromAllSchedules(int taskId) throws SQLException {
        String sql = "DELETE FROM col_tsk WHERE task_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            executeInsert(statement);
        }
    }

    @Override
    public void removeTaskFromSchedule(int taskId, int scheduleId) throws SQLException {
        String sql = "DELETE FROM col_tsk WHERE task_id = ? AND schedule_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            statement.setInt(2, scheduleId);
            executeInsert(statement);
        }
    }

    @Override
    public void clearColumn(int columnId) throws SQLException {
        String sql = "DELETE FROM col_tsk WHERE col_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, columnId);
            statement.executeUpdate();
        }
    }

    private Task fillTask(Task task, int colId, int scheduleId, int taskStart, int taskEnd) {
        task.setColId(colId);
        task.setSchedId(scheduleId);
        task.setStart(taskStart);
        task.setEnd(taskEnd);

        return task;
    }
}
