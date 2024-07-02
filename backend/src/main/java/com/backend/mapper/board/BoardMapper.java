package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {
    @Insert("""
            INSERT INTO board (title, content, member_id)
            VALUES (#{title}, #{content}, 1)
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Board board);

    @Select("""
            SELECT b.id, b.title, m.nick_name writer, b.inserted
            FROM board b JOIN member m ON b.member_id = m.id
            ORDER BY id DESC
            """)
    List<Board> selectAll();

    @Select("""
            SELECT b.id, b.title, m.nick_name writer, b.inserted, b.content, b.member_id
            FROM board b JOIN member m ON b.member_id = m.id
            WHERE b.id = #{id}
            """)
    Board selectById(Integer id);

    @Insert("""
                        INSERT INTO board_file (board_id, name)
                        VALUES (#{boardId}, #{name})
            """)
    int insertFileName(Integer boardId, String name);
}
