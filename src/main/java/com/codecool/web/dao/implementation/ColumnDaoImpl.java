package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.model.Column;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ColumnDaoImpl extends AbstractDao implements ColumnDao {

    private final String queryColumns = "SELECT id, name FROM columns ";

    public ColumnDaoImpl(Connection connection) {
        super(connection);
    }

    @Override
    public Column findById(int id) throws SQLException {
        String sql = queryColumns + "WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchColumn(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public List<Column> findAllByScheduleId(int scheduleId) throws SQLException {
        List<Column> columns = new ArrayList<>();
        String sql = queryColumns + "WHERE schedule_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, scheduleId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    columns.add(fetchColumn(resultSet));
                }
            }
        }
        return columns;
    }

    @Override
    public void insertColumn(int scheduleId, String name, ScheduleDao scheduleDao) throws SQLException {
        boolean autocommit = connection.getAutoCommit();
        connection.setAutoCommit(false);

        scheduleDao.updateScheduleCount(scheduleId);

        String sql = "INSERT INTO columns (schedule_id, name, count) VALUES (?, ?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, scheduleId);
            statement.setString(2, name);
            statement.setInt(3, 0);
            executeInsert(statement);
        }
    }

    @Override
    public void updateName(int columnId, String name) throws SQLException {
        boolean autocommit = connection.getAutoCommit();
        connection.setAutoCommit(false);

        String sql = "UPDATE columns SET name = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, name);
            statement.setInt(2, columnId);
            executeInsert(statement);
        }
    }

    @Override
    public void deleteColumn(int columnId) throws SQLException {
        boolean autocommit = connection.getAutoCommit();
        connection.setAutoCommit(false);

        String sql = "DELETE FROM columns WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, columnId);
            executeInsert(statement);
        }
    }


    @Override
    public void updateColumnCount(int columnId) throws SQLException {
        int count = getCount(columnId);
        String sql = "UPDATE columns SET count = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, count + 1);
            executeInsert(statement);
        }
    }

    private int getCount(int columnId) throws SQLException {
        String sql = "SELECT count FROM columns WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, columnId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getInt("count");
                }
            }
        }
        return -1;
    }


    private Column fetchColumn(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        String name = resultSet.getString("name");

        return new Column(id, name);
    }
}
