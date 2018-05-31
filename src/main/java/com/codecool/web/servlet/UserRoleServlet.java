package com.codecool.web.servlet;

import com.codecool.web.dao.UserDao;
import com.codecool.web.dao.implementation.UserDaoImpl;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/role/user/*")
public class UserRoleServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(UserRoleServlet.class);

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("put method start");

        try (Connection connection = getConnection(req.getServletContext())) {
            UserDao userDao = new UserDaoImpl(connection);
            JsProfileService profileService = new JsProfileService(userDao);

            boolean isPublic = Boolean.parseBoolean(req.getParameter("isPublic"));
            int userId = getUserId(req.getRequestURI());

            profileService.changeUserRole(userId, isPublic);

            resp.setStatus(HttpServletResponse.SC_OK);
            logger.debug("put method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    private int getUserId(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 6) {
            throw new ServiceException("Missing user id");
        }
        String userIdAsString = splitUri[5];
        try {
            logger.debug("getting user id from url: " + userIdAsString);
            return Integer.parseInt(userIdAsString);
        } catch (NumberFormatException e) {
            throw new ServiceException("User id is not a valid number");
        }
    }
}
