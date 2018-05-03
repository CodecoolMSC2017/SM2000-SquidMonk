package com.codecool.web.model;

public class Task {

    private final int id;
    private String name, content;

    public Task(int id, String name, String content) {
        this.id = id;
        this.name = name;
        this.content = content;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContent() {
        return content;
    }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
