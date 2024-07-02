package com.backend.domain.home;

import lombok.Data;

@Data
public class HomeContent {
    private Integer id;
    private String title;
    private String areaName;
    private String firstImage1;
    private String overview;
    private Double rating;
}
