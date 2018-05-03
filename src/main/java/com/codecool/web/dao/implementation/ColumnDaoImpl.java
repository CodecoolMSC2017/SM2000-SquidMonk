package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.model.Column;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class ColumnDaoImpl extends AbstractDao implements ColumnDao {

    private String queryColumns = "SELECT ";

    public ColumnDaoImpl(Connection connection) {
        super(connection);
    }

    @Override
    public Column findById(int id) throws SQLException {
        return null;
    }

    @Override
    public List<Column> findAllByEmail(String email) throws SQLException {
        return null;
    }
}
