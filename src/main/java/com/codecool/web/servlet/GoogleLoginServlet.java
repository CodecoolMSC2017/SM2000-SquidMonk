package com.codecool.web.servlet;

import com.codecool.web.model.User;
import com.codecool.web.service.LoginService;
import com.codecool.web.service.RegisterService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsLoginService;
import com.codecool.web.service.jsService.JsRegisterService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.util.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;

@WebServlet("/googleLogin")
public class GoogleLoginServlet extends AbstractServlet {

    private final String CLIENT_ID = "105491068237-gtraci9t7kvk3grfevgd5vrf339u1snt.apps.googleusercontent.com";
    public static final String password = "qFy5HoRWvVMbZvcQfUi1CwgRgIlSeReqEjMkjMkfVcdFv";

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            LoginService loginService = new JsLoginService(connection);
            RegisterService registerService = new JsRegisterService(connection);

            String idTokenString = req.getParameter("idToken");
            GoogleIdToken idToken = verifyToken(idTokenString);

            if (idToken == null) {
                sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid ID token.");
                return;
            }
            Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user;
            try {
                user = loginService.loginGoogleUser(email);
            } catch (ServiceException e) {
                user = registerService.registerUser(name, email, password);
            }
            req.getSession().setAttribute("user", user);
            sendMessage(resp, HttpServletResponse.SC_OK, user);
        } catch (GeneralSecurityException e) {
            sendMessage(resp, HttpServletResponse.SC_CONFLICT, e.getMessage());
            e.printStackTrace();
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }

    private GoogleIdToken verifyToken(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier.Builder builder = new GoogleIdTokenVerifier.Builder(
                Utils.getDefaultTransport(), Utils.getDefaultJsonFactory());
        GoogleIdTokenVerifier verifier = builder.setAudience(Collections.singletonList(CLIENT_ID)).build();
        return verifier.verify(idTokenString);
    }
}
