package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.dao.implementation.UserDaoImpl;
import com.codecool.web.model.User;
import com.codecool.web.service.LoginService;
import com.codecool.web.service.RegisterService;
import com.codecool.web.service.exception.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;

public class JsRegisterService implements RegisterService {

    private static final Logger logger = LoggerFactory.getLogger(JsRegisterService.class);

    private final UserDao userDao;

    public JsRegisterService(Connection connection) {
        userDao = new UserDaoImpl(connection);
    }

    @Override
    public User registerUser(String name, String email, String password) throws SQLException, ServiceException {
        logger.info("registering user with email " + email);
        return userDao.insertUser(name, email, password);
    }
}
