package com.codecool.web.servlet;

import com.codecool.web.service.RegisterService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsRegisterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/register")
public final class RegisterServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(RegisterServlet.class);

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        logger.debug("post method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            RegisterService service = new JsRegisterService(connection);

            String name = req.getParameter("name");
            String email = req.getParameter("email");
            String password = req.getParameter("password");

            if (checkEmptyParameters(name, email, password)) {
                sendMessage(resp, HttpServletResponse.SC_UNAUTHORIZED, "Empty fields");
                logger.debug("empty field found");
            }

            service.registerUser(name, email, password);
            sendMessage(resp, HttpServletResponse.SC_OK, "Registration successful");
            logger.debug("post method successful");
        } catch (ServiceException ex) {
            sendMessage(resp, HttpServletResponse.SC_UNAUTHORIZED, ex);
        } catch (SQLException ex) {
            sendMessage(resp, HttpServletResponse.SC_UNAUTHORIZED, "Email already exists");
        }
    }

    private boolean checkEmptyParameters(String... parameters) {
        for (String parameter : parameters) {
            if (parameter == null || parameter.equals("")) {
                return true;
            }
        }
        return false;
    }
}
