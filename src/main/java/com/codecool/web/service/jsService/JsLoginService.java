package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import com.codecool.web.service.LoginService;
import com.codecool.web.service.PassEncrypt;
import com.codecool.web.service.exception.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;

public class JsLoginService implements LoginService {

    private static final Logger logger = LoggerFactory.getLogger(JsLoginService.class);

    private final UserDao userDao;

    public JsLoginService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public User loginUser(String email, String password) throws SQLException, ServiceException {
        logger.info("logging in user with email [" + email + "]");
        User user = userDao.findByEmail(email);

        if (user == null) {
            logger.info("did not find user with email [" + email + "]");
            throw new ServiceException("Invalid Login!");
        }
        String decryptedPassword = new PassEncrypt().decrypt(user.getPassword());
        if (!decryptedPassword.equals(password)) {
            logger.info("incorrect password of user with email [" + email + "]");
            throw new ServiceException("Invalid Login!");
        }
        logger.info("login of user with email [" + email + "] was successful");
        return user;
    }
}
