package com.backend.mapper.comment;

import com.backend.domain.Comment.Comment;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment (board_id, member_id, comment)
            VALUES (#{boardId}, #{memberId}, #{comment})
            """)
    int insert(Comment comment);

    @Select("""
            SELECT c.id, c.comment, c.inserted, m.nick_name, c.member_id, c.board_id
            FROM comment c JOIN member m ON c.member_id = m.id
            WHERE board_id = #{bId} 
            ORDER BY id DESC
            """)
    List<Comment> selectAllByBoardId(Integer bId);

    @Delete("""
            DELETE FROM comment
            WHERE id=#{id}
            """)
    int deleteById(Integer id);
}
