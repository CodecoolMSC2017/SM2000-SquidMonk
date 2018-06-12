package com.codecool.web.model;

public class User {

    private final int id;
    private final String name, email, password;
    private boolean isAdmin;
    private int taskCounter;
    private int scheduleCounter;

    public User(int id, String name, String email, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.isAdmin = false;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public int getTaskCounter() {
        return taskCounter;
    }

    public int getScheduleCounter() {
        return scheduleCounter;
    }

    // Setters
    public void setAdmin() {
        isAdmin = true;
    }

    public void setTaskCounter(int taskCount) {
        this.taskCounter = taskCount;
    }

    public void setScheduleCounter(int scheduleCount) {
        this.scheduleCounter = scheduleCount;
    }
}
