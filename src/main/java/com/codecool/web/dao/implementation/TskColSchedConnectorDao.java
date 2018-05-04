package com.codecool.web.dao.implementation;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

class TskColSchedConnectorDao extends AbstractDao {

    TskColSchedConnectorDao(Connection connection) {
        super(connection);
    }

    boolean queryTaskPresent(int taskId) throws SQLException {
        String sql = "SELECT task_id FROM col_tsk WHERE task_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    String id = resultSet.getString("task_id");
                    return id != null;
                }
            }
        }
        return false;
    }

    void insertTask(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException {
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

    //Work In Progress!

    void updateTask(int taskId, String colId, String scheduleId, String taskStart, String taskEnd) throws SQLException {
        /*ConnectorDataTransfer connectorDataTransfer = queryTaskAll(taskId);

        if (colId.equals(""))

        String sql = "UPDATE col_tsk SET col_id=?, schedule_id=?, task_start=?, task_end=? WHERE task_id=?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            statement.setInt(2, colId);
            statement.setInt(3, scheduleId);
            statement.setInt(4, taskStart);
            statement.setInt(5, taskEnd);
            executeInsert(statement);
        }*/
    }

    private ConnectorDataTransfer queryTaskAll(int taskId) throws SQLException {
        String sql = "SELECT task_id, col_id, schedule_id, task_start, task_end FROM col_tsk WHERE task_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    int id = resultSet.getInt("task_id");
                    int colId = resultSet.getInt("col_id");
                    int scheduleId = resultSet.getInt("schedule_id");
                    int taskStart = resultSet.getInt("task_start");
                    int taskEnd = resultSet.getInt("task_end");

                    return new ConnectorDataTransfer(id, colId, scheduleId, taskStart, taskEnd);
                }
            }
        }
        return null;
    }

    /*Inner class for data transfer of connector table data starts here*/

    private class ConnectorDataTransfer {

        int id, colId, scheduleId, taskStart, taskEnd;

        ConnectorDataTransfer(int id, int colId, int scheduleId, int taskStart, int taskEnd) {
            this.id = id;
            this.colId = colId;
            this.scheduleId = scheduleId;
            this.taskStart = taskStart;
            this.taskEnd = taskEnd;
        }

        public int getId() {
            return id;
        }

        public int getColId() {
            return colId;
        }

        public int getScheduleId() {
            return scheduleId;
        }

        public int getTaskStart() {
            return taskStart;
        }

        public int getTaskEnd() {
            return taskEnd;
        }
    }
}
