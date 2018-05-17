package com.codecool.web.dto;

public class DashboardTaskDto {

    private int id;
    private final String name;
    private final int usages;

    public DashboardTaskDto(int id, String name, int usages) {
        this.id = id;
        this.name = name;
        this.usages = usages;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getUsages() {
        return usages;
    }
}
