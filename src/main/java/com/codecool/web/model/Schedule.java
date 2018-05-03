package com.codecool.web.model;

public class Schedule {

    private final int id;
    private String name;
    private boolean isPublic;

    public Schedule(int id, String name) {
        this.id = id;
        this.name = name;
        this.isPublic = false;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic() {
        isPublic = true;
    }
}
