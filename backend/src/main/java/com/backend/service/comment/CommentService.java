package com.backend.service.comment;

import com.backend.domain.Comment.Comment;
import com.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class CommentService {
    private final CommentMapper mapper;

    public void add(Comment comment, Authentication authentication) {
        comment.setMemberId(Integer.valueOf(authentication.getName()));

        mapper.insert(comment);
    }

    public List<Comment> list(Integer bId) {
        return mapper.selectAllByBoardId(bId);
    }

    public boolean validate(Comment comment) {
        if (comment == null) {
            return false;
        }

        if (comment.getComment().isBlank()) {
            return false;
        }

        if (comment.getBoardId() == null) {
            return false;
        }

        return true;
    }

    public void remove(Comment comment) {
        mapper.deleteById(comment.getId());
    }
}
