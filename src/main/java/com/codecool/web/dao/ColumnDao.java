package com.codecool.web.dao;

import com.codecool.web.model.Column;

import java.sql.SQLException;
import java.util.List;

public interface ColumnDao {

    Column findById(int id) throws SQLException;

    List<Column> findAllByEmail(String email) throws SQLException;

}
