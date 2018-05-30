package com.codecool.web.service.jsService;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.implementation.ColumnDaoImpl;
import com.codecool.web.service.ColumnService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;

public class JsColumnService implements ColumnService {

    private static final Logger logger = LoggerFactory.getLogger(JsColumnService.class);

    private ColumnDao columnDao;

    public JsColumnService(Connection connection) {
        columnDao = new ColumnDaoImpl(connection);
    }

    @Override
    public void deleteColumn(int columnId) throws SQLException {
        logger.info("deleting column with id " + columnId);
        columnDao.deleteColumn(columnId);
    }
}
