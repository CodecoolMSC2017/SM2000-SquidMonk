package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import com.codecool.web.service.UsersService;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;
import java.util.List;

public class JsUsersService implements UsersService {

    private UserDao userDao;

    public JsUsersService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public List<User> getUsers() throws SQLException, ServiceException {
        return userDao.findAll();
    }
}
