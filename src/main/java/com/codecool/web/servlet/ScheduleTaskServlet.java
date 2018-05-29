package com.codecool.web.servlet;

import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.model.Task;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsScheduleService;
import com.codecool.web.service.jsService.JsTaskService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/schedule/task/*")
public class ScheduleTaskServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new JsTaskService(connection);

            int taskId = getTaskId(req.getRequestURI());
            Task task = taskService.getById(taskId);
            sendMessage(resp, HttpServletResponse.SC_OK, task);
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
            ScheduleService scheduleService = new JsScheduleService(connection);

            int taskId = getTaskId(req.getRequestURI());
            Task task = taskService.getById(taskId);
            int scheduleId = task.getSchedId();

            taskService.deleteTask(taskId);

            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    private int getTaskId(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 6) {
            throw new ServiceException("Missing schedule id");
        }
        String idAsString = splitUri[5];
        try {
            return Integer.parseInt(idAsString);
        } catch (NumberFormatException e) {
            throw new ServiceException("Schedule id is not a valid number");
        }
    }
}
