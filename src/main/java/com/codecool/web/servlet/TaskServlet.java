package com.codecool.web.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.codecool.web.dto.TaskDto;
import com.codecool.web.model.User;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsTaskService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/tasks/*")
public class TaskServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(TaskServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService service = new JsTaskService(connection);

            int taskId = getTaskId(req.getRequestURI());
            User user = (User) req.getSession().getAttribute("user");

            TaskDto taskDto;
            if (req.getRequestURI().endsWith("/availableSchedules")) {
                logger.debug("getting available schedules for task with id " + taskId);
                taskDto = service.getDtoWithAvailableSchedules(user.getId(), taskId);
            } else {
                logger.debug("getting task with id " + taskId);
                taskDto = service.getDtoById(taskId);
            }
            sendMessage(resp, HttpServletResponse.SC_OK, taskDto);
            logger.debug("get method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("put method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new JsTaskService(connection);

            String newName = req.getParameter("name");
            String newContent = req.getParameter("content");
            int taskId = getTaskId(req.getRequestURI());

            taskService.updateTask(taskId, newName, newContent);
            resp.setStatus(HttpServletResponse.SC_OK);
            logger.debug("put method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("delete method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new JsTaskService(connection);

            int taskId = getTaskId(req.getRequestURI());

            taskService.deleteTask(taskId);
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            logger.debug("delete method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    private int getTaskId(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 5) {
            throw new ServiceException("Missing task id");
        }
        String taskIdAsString = splitUri[4];
        try {
            logger.debug("getting task id from url: " + taskIdAsString);
            return Integer.parseInt(taskIdAsString);
        } catch (NumberFormatException e) {
            throw new ServiceException("Task id is not a valid number");
        }
    }
}
