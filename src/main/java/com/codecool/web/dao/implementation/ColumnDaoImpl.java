package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ColumnDao;
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

    private Column fetchColumn(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        String name = resultSet.getString("name");

        return new Column(id, name);
    }
}
