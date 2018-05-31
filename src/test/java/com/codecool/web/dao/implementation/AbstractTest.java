package com.codecool.web.dao.implementation;

import org.postgresql.ds.PGSimpleDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

abstract class AbstractTest {

    private static final DataSource dataSource = setDataSource();

    private static DataSource setDataSource() {
        PGSimpleDataSource ds = new PGSimpleDataSource();
        ds.setServerName("localhost");
        ds.setPortNumber(5432);
        ds.setDatabaseName("sm2000_test");
        ds.setUser("test");
        ds.setPassword("test");
        return ds;
    }

    Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    void resetDatabase() {
        try (Connection connection = getConnection()) {
            ScriptUtils.executeSqlScript(connection, new ClassPathResource("/init.sql"));
        } catch (SQLException ex) {
            ex.printStackTrace();
            throw new IllegalStateException(ex);
        }
    }
}
