package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import com.codecool.web.service.ProfileService;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;

public class JsProfileService implements ProfileService {

    private UserDao userDao;

    public JsProfileService(UserDao userDao) {

        this.userDao = userDao;
    }

    @Override
    public User showDataByUserId(int userId) throws SQLException, ServiceException {
        return userDao.findById(userId);
    }

    @Override
    public void changeUserName(int userId, String name) throws SQLException, ServiceException {

        if (name == null || name.equals("")) {
            throw new ServiceException("Profile name can not be empty!");
        }
        userDao.changeName(userId, name);
    }

    @Override
    public void changeUserEmail(int userId, String email) throws SQLException, ServiceException {

        if (email == null || email.equals("")) {
            throw new ServiceException("Profile email can not be empty!");
        }
        userDao.changeEmail(userId, email);
    }
}
