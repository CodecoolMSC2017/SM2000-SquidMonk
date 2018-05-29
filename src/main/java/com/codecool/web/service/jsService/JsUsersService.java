package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import com.codecool.web.service.UsersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;
import java.util.List;

public class JsUsersService implements UsersService {

    private static final Logger logger = LoggerFactory.getLogger(JsUsersService.class);

    private UserDao userDao;

    public JsUsersService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public List<User> getUsers() throws SQLException {
        logger.info("fetching all users");
        return userDao.findAll();
    }
}
