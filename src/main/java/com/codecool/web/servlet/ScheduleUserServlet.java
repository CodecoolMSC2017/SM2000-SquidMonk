package com.codecool.web.servlet;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.implementation.ScheduleDaoImpl;
import com.codecool.web.dto.DashboardScheduleDto;
import com.codecool.web.model.User;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.ScheduleUserService;
import com.codecool.web.service.jsService.JsScheduleService;
import com.codecool.web.service.jsService.JsScheduleUserService;

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
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);
            ScheduleUserService service = new JsScheduleUserService(scheduleDao);

            int userId = getUserId(req.getRequestURI());
            List<DashboardScheduleDto> scheduleList = service.findAllByUserId(userId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleList);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid user id");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);
            ScheduleUserService service = new JsScheduleUserService(scheduleDao);

            String name = req.getParameter("name");
            User user = (User) req.getSession().getAttribute("user");
            service.addSchedule(user.getId(), name);
            resp.setStatus(HttpServletResponse.SC_OK);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid user id");
        }
    }

    private int getUserId(String uri) throws NumberFormatException {
        String userIdAsString = uri.substring(uri.lastIndexOf("/") + 1);
        return Integer.parseInt(userIdAsString);
    }
}
