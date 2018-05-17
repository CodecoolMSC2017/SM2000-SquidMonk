package com.codecool.web.servlet;

import com.codecool.web.dto.TaskDto;
import com.codecool.web.service.TaskService;
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
            TaskService taskService = new JsTaskService(connection);

            int taskId = getTaskId(req.getRequestURI());
            TaskDto taskDto = taskService.getDtoById(taskId);

            sendMessage(resp, HttpServletResponse.SC_OK, taskDto);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "Task id is not a valid number");
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
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "Task id is not a valid number");
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
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "Task id is not a valid number");
        }
    }

    private int getTaskId(String uri) throws NumberFormatException {
        String taskIdAsString = uri.substring(uri.lastIndexOf("/") + 1);
        return Integer.parseInt(taskIdAsString.split("\\?")[0]);
    }
}
