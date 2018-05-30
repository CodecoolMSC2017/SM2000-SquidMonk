package com.codecool.web.model;

public class Column {

    private final int id;
    private String name;
    private final int scheduleId;

    public Column(int id, String name, int scheduleId) {
        this.id = id;
        this.name = name;
        this.scheduleId = scheduleId;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public int getScheduleId() {
        return scheduleId;
    }
}
