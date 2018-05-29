package com.codecool.web.servlet;

import com.codecool.web.dto.DashboardTaskDto;
import com.codecool.web.model.User;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsTaskService;
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

@WebServlet("/protected/tasks/user/*")
public class TaskUserServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(TaskUserServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService service = new JsTaskService(connection);

            int userId = getUserId(req.getRequestURI());
            List<DashboardTaskDto> tasks = service.getDtos(userId);
            sendMessage(resp, HttpServletResponse.SC_OK, tasks);
            logger.debug("get method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("post method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new JsTaskService(connection);

            String name = req.getParameter("name");
            User user = (User) req.getSession().getAttribute("user");
            int userId = user.getId();

            taskService.insertTask(userId, name, "");
            resp.setStatus(HttpServletResponse.SC_OK);
            logger.debug("post method successful");
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
