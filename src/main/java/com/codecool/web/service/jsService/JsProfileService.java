package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.dao.implementation.UserDaoImpl;
import com.codecool.web.dto.UserDto;
import com.codecool.web.model.User;
import com.codecool.web.service.ProfileService;
import com.codecool.web.service.exception.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;

public class JsProfileService implements ProfileService {

    private static final Logger logger = LoggerFactory.getLogger(JsProfileService.class);

    private UserDao userDao;
    private UserDto userDto;

    public JsProfileService(Connection connection) {

        userDao = new UserDaoImpl(connection);
        userDto = new UserDto();
    }

    @Override
    public User showDataByUserId(int userId) throws SQLException {
        logger.debug("fetching user with id " + userId);
        return userDao.findById(userId);
    }

    @Override
    public void changeUserName(int userId, String name) throws SQLException, ServiceException {
        logger.info("updating name of user with id " + userId);
        if (name == null || name.equals("")) {
            throw new ServiceException("Profile name can not be empty!");
        }
        userDao.changeName(userId, name);
    }

    @Override
    public void changeUserEmail(int userId, String email) throws SQLException, ServiceException {
        logger.info("updating email of user with id " + userId);
        if (email == null || email.equals("")) {
            throw new ServiceException("Profile email can not be empty!");
        }
        userDao.changeEmail(userId, email);
    }

    @Override
    public void changeUserRole(User user) throws SQLException {
        logger.info("updating role of user with id " + user.getId());

        boolean isAdmin = userDto.setAdmin(user);
        userDao.changeRole(user.getId(), isAdmin);
    }

    @Override
    public void setTaskAndScheduleCounterByUser(User user) throws SQLException {
        user.setTaskCounter(userDao.counterTaskByUserId(user.getId()));
        user.setScheduleCounter(userDao.counterScheduleByUserId(user.getId()));
    }
}
