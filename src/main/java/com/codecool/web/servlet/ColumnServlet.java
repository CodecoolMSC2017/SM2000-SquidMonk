package com.codecool.web.servlet;

import com.codecool.web.model.Task;
import com.codecool.web.model.User;
import com.codecool.web.service.ColumnService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsColumnService;
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

@WebServlet("/protected/column/*")
public class ColumnServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(ColumnServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ColumnService service = new JsColumnService(connection);

            User user = (User) req.getSession().getAttribute("user");
            int columnId = getColumnId(req.getRequestURI());
            if (req.getRequestURI().endsWith("/availableTasks")) {
                List<Task> tasks = service.getAvailableTasks(user.getId(), columnId);
                sendMessage(resp, HttpServletResponse.SC_OK, tasks);
                logger.debug("get method successful");
            }
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
            ColumnService service = new JsColumnService(connection);

            int columnId = getColumnId(req.getRequestURI());
            service.deleteColumn(columnId);
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            logger.debug("delete method successful");
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
            ColumnService service = new JsColumnService(connection);

            int columnId = getColumnId(req.getRequestURI());
            int taskId = Integer.parseInt(req.getParameter("taskId"));
            int start = Integer.parseInt(req.getParameter("start"));
            service.addTaskToColumn(columnId, taskId, start);
            logger.debug("post method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    private int getColumnId(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 5) {
            throw new ServiceException("Missing column id");
        }
        String idAsString = splitUri[4];
        try {
            logger.debug("getting id from url: " + idAsString);
            return Integer.parseInt(idAsString);
        } catch (NumberFormatException e) {
            throw new ServiceException("Column id is not a valid number");
        }
    }
}
