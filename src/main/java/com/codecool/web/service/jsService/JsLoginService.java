package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.dao.implementation.UserDaoImpl;
import com.codecool.web.model.User;
import com.codecool.web.service.LoginService;
import com.codecool.web.service.PassEncrypt;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.servlet.GoogleLoginServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;

public class JsLoginService implements LoginService {

    private static final Logger logger = LoggerFactory.getLogger(JsLoginService.class);

    private final UserDao userDao;

    public JsLoginService(Connection connection) {
        userDao = new UserDaoImpl(connection);
    }

    @Override
    public User loginUser(String email, String password) throws SQLException, ServiceException {
        logger.info("logging in user with email [" + email + "]");
        ServiceException invalidLoginEx = new ServiceException("Invalid Login!");
        User user = userDao.findByEmail(email);

        if (user == null) {
            logger.info("did not find user with email [" + email + "]");
            throw invalidLoginEx;
        }
        String decryptedPassword = new PassEncrypt().decrypt(user.getPassword());
        if (!decryptedPassword.equals(password) || password.equals(GoogleLoginServlet.password)) {
            logger.info("incorrect password of user with email [" + email + "]");
            throw invalidLoginEx;
        }
        logger.info("login of user with email [" + email + "] was successful");
        return user;
    }
}
