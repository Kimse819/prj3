package com.backend.controller.home;

import com.backend.domain.home.HomeContent;
import com.backend.service.home.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {
    private final HomeService service;

    @GetMapping("contents")
    public List<HomeContent> getContents() {
        return service.getContents();
    }

    @GetMapping("contents/popular")
    public List<HomeContent> getPopularContents() {
        return service.getPopularContents();
    }

    @GetMapping("contents/area")
    public List<HomeContent> getContentsByArea() {
        return service.getContentsByArea();
    }
}
