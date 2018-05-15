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
import java.util.List;

@WebServlet("/protected/schedules/user/*")
public class ScheduleUserServlet extends AbstractServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String uri = req.getRequestURI();
        String userId = Character.toString(uri.charAt(uri.length() - 1));
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);
            List<Schedule> scheduleList = scheduleDao.findAllByUserId(Integer.parseInt(userId));
            resp.setStatus(HttpServletResponse.SC_OK);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleList);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }
}
