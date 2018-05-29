package com.codecool.web.servlet;

import com.codecool.web.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/logout")
public class LogoutServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(LogoutServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");

        HttpSession session = req.getSession();
        User user = (User) session.getAttribute("user");
        session.invalidate();
        logger.info(String.format("session of user with email %s is invalidated", user.getEmail()));

        sendMessage(resp, HttpServletResponse.SC_OK, "Successfully logged out");
        logger.debug("get method successful");
    }
}
