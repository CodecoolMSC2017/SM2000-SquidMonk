package com.codecool.web.dto;

public class UserDto {

    private int userId;
    private boolean isAdmin;

    public UserDto(int userId) {
        this.userId = userId;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public int getUserId() {
        return userId;
    }
}
