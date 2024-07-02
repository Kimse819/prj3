package com.backend.service.home;

import com.backend.domain.home.HomeContent;
import com.backend.mapper.home.HomeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class HomeService {
    private final HomeMapper mapper;

    public List<HomeContent> getContents() {
        return mapper.selectRecentContents();
    }

    public List<HomeContent> getPopularContents() {
        return mapper.selectContentsByRating();
    }

    public List<HomeContent> getContentsByArea() {
        return mapper.selectContentsByArea();
    }
}
