package com.codecool.web.servlet;

import com.codecool.web.dto.DashboardScheduleDto;
import com.codecool.web.model.User;
import com.codecool.web.service.ScheduleUserService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsScheduleUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/protected/schedules/user/*")
public class ScheduleUserServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleUserServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.trace("get method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleUserService service = new JsScheduleUserService(connection);

            int userId = getUserId(req.getRequestURI());
            User user = (User) req.getSession().getAttribute("user");
            if (!user.isAdmin() && userId != user.getId()) {
                sendMessage(resp, HttpServletResponse.SC_FORBIDDEN, "You are not permitted to access this content!");
                logger.warn("user " + user.getId() + " requested schedules of user " + userId);
                return;
            }
            List<DashboardScheduleDto> scheduleList = service.findAllByUserId(userId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleList);
            logger.trace("get method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.trace("post method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleUserService service = new JsScheduleUserService(connection);

            String name = req.getParameter("name");
            User user = (User) req.getSession().getAttribute("user");
            service.addSchedule(user.getId(), name);
            resp.setStatus(HttpServletResponse.SC_OK);
            logger.trace("post method successful");
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
