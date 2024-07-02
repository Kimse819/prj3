package com.backend.mapper.home;

import com.backend.domain.home.HomeContent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface HomeMapper {

    @Select("""
            SELECT *
            FROM (
                SELECT c.id, c.title, a.name area_name, i.first_image1, i.overview
                FROM content c
                    JOIN info1 i ON c.id = i.content_id 
                    JOIN area a ON c.area_code = a.area_code
                WHERE first_image1 NOT LIKE ''
                ORDER BY i.modified DESC
                LIMIT 3000) as recency
            ORDER BY RAND()
            LIMIT 3
            """)
    List<HomeContent> selectRecentContents();

    @Select("""
            SELECT *
            FROM ( SELECT c.id, c.title, a.name area_name, i.first_image1, i.overview, avg.rating
                   FROM content c
                              JOIN info1 i ON c.id = i.content_id
                              JOIN area a ON c.area_code = a.area_code
                              JOIN ( SELECT content_id, AVG(rating) AS rating
                                     FROM review
                                     GROUP BY content_id) avg ON c.id = avg.content_id
                   WHERE first_image1 NOT LIKE ''
                   ORDER BY avg.rating DESC
                   LIMIT 10) as popular
            ORDER BY RAND()
            LIMIT 3;
            """)
    List<HomeContent> selectContentsByRating();

    @Select("""
            SELECT *
            FROM (
                    SELECT c.id, c.title, a.name area_name, i.first_image1, i.overview
                    FROM content c
                              JOIN info1 i ON c.id = i.content_id
                              JOIN area a ON c.area_code = a.area_code
                    WHERE first_image1 NOT LIKE ''
                    ORDER BY i.modified DESC
                    LIMIT 1000) AS recency
                        JOIN (
                                SELECT a.name
                                FROM area a
                                ORDER BY RAND()
                                LIMIT 1) AS ar
                            ON recency.area_name = ar.name
            ORDER BY RAND()
            LIMIT 3
            """)
    List<HomeContent> selectContentsByArea();
}
