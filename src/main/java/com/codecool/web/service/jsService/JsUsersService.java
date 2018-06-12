package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.dao.implementation.UserDaoImpl;
import com.codecool.web.model.User;
import com.codecool.web.service.UsersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JsUsersService implements UsersService {

    private static final Logger logger = LoggerFactory.getLogger(JsUsersService.class);

    private UserDao userDao;

    public JsUsersService(Connection connection) {
        userDao = new UserDaoImpl(connection);
    }

    @Override
    public List<User> getUsers() throws SQLException {
        logger.info("fetching all users");
        List<User> users = new ArrayList<>();
        for (User user : userDao.findAll()) {
            user.setTaskCounter(userDao.counterTaskByUserId(user.getId()));
            user.setScheduleCounter(userDao.counterScheduleByUserId(user.getId()));
            users.add(user);
        }
        return users;
    }
}
