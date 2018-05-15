package com.codecool.web.servlet;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.implementation.ScheduleDaoImpl;
import com.codecool.web.model.Schedule;

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
        String scheduleId = uri.substring(uri.lastIndexOf("/") + 1, uri.length());

        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);
            Schedule schedule = scheduleDao.findById(Integer.parseInt(scheduleId));
            resp.setStatus(HttpServletResponse.SC_OK);
            sendMessage(resp, HttpServletResponse.SC_OK, schedule);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }
}
