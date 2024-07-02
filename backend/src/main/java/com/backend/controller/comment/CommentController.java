package com.backend.controller.comment;

import com.backend.domain.Comment.Comment;
import com.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    private final CommentService service;

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity addComment(@RequestBody Comment comment, Authentication authentication) {
        if ((service.validate(comment))) {
            service.add(comment, authentication);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("list/{bId}")
    public List<Comment> list(@PathVariable Integer bId) {
        return service.list(bId);
    }

    @DeleteMapping("remove")
    public void remove(@RequestBody Comment comment) {
        service.remove(comment);
    }
}
