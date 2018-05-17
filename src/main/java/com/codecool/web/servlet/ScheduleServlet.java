package com.codecool.web.servlet;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.ColumnDaoImpl;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.dao.implementation.TskColSchedConnectorDao;
import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.jsService.JsScheduleService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/schedule/*")
public class ScheduleServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String uri = req.getRequestURI();
        int schedId = Integer.parseInt(uri.substring(uri.lastIndexOf("/") + 1, uri.length()));

        try (Connection connection = getConnection(req.getServletContext())) {
            ColumnDao columnDao = new ColumnDaoImpl(connection);
            TaskDao taskDao = new TaskDaoImpl(connection);
            TskColSchedConnectorDao controlTable = new TskColSchedConnectorDao(connection);
            ScheduleService scheduleService = new JsScheduleService(columnDao, taskDao, controlTable);


            resp.setStatus(HttpServletResponse.SC_OK);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleService.fillScheduleDto(schedId));

        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }
}
