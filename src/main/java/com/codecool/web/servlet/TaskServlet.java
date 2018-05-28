package com.codecool.web.servlet;

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

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService service = new JsTaskService(connection);

            int taskId = getTaskId(req.getRequestURI());
            User user = (User) req.getSession().getAttribute("user");

            TaskDto taskDto;
            if (req.getRequestURI().endsWith("/availableSchedules")) {
                taskDto = service.getDtoWithAvailableSchedules(user.getId(), taskId);
            } else {
                taskDto = service.getDtoById(taskId);
            }
            sendMessage(resp, HttpServletResponse.SC_OK, taskDto);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new JsTaskService(connection);

            String newName = req.getParameter("name");
            String newContent = req.getParameter("content");
            int taskId = getTaskId(req.getRequestURI());

            taskService.updateTask(taskId, newName, newContent);
            resp.setStatus(HttpServletResponse.SC_OK);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new JsTaskService(connection);

            int taskId = getTaskId(req.getRequestURI());

            taskService.deleteTask(taskId);
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    private int getTaskId(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 5) {
            throw new ServiceException("Missing task id");
        }
        String taskIdAsString = splitUri[4];
        try {
            return Integer.parseInt(taskIdAsString);
        } catch (NumberFormatException e) {
            throw new ServiceException("Task id is not a valid number");
        }
    }
}
