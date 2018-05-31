package com.codecool.web.dto;

import com.codecool.web.model.User;

public class UserDto {

    private boolean isAdmin;

    public UserDto() {
    }

    public boolean setAdmin(User user) {
        if (user.isAdmin() == false) {
            isAdmin = true;
        } else {
            isAdmin = false;
        }
        return isAdmin;
    }
}
