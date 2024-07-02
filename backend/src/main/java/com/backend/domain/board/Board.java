package com.backend.domain.board;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Board {
    private Integer id;
    private String title;
    private String content;
    private String writer; //작성자 닉네임
    private Integer memberId;
    private LocalDateTime inserted;

    private Integer numberOfImages;
    private Integer numberOfComments;
    private List<BoardFile> fileList;
}
