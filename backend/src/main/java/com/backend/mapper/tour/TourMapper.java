package com.backend.mapper.tour;

import com.backend.domain.tour.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TourMapper {
    @Insert("""
            INSERT INTO area (area_code, name)
            VALUES (#{areaCode}, #{name})
            """)
    int insertArea(Area area);

    @Select("""
            SELECT area_code
            FROM area
            """)
    List<Integer> selectAreaCode();

    @Insert("""
            INSERT INTO sigungu (area_code, sigungu_code, name)
            VALUES (#{areaCode}, #{sigunguCode}, #{name})
            """)
    int insertSigungu(Area area);

    @Select("""
            SELECT sigungu_code
            FROM sigungu
            """)
    List<Integer> selectSigungu();

    @Select("""
            SELECT cat1
            FROM category1
            """)
    List<String> selectCat1();

    @Select("""
            SELECT cat2
            FROM category2
            """)
    List<String> selectCat2();

    @Select("""
            SELECT cat3
            FROM category3
            """)
    List<String> selectCat3();

    @Insert("""
            INSERT INTO category1 (cat1, name)
            VALUES (#{cat1}, #{name})
            """)
    int insertCategory1(Category category);

    @Insert("""
            INSERT INTO category2 (cat1, cat2, name)
            VALUES (#{cat1}, #{cat2}, #{name})
            """)
    int insertCategory2(Category category);

    @Insert("""
            INSERT INTO category3 (cat2, cat3, name)
            VALUES (#{cat2}, #{cat3}, #{name})
            """)
    int insertCategory3(Category category);

    @Select("""
            SELECT ex_content_id
            FROM content
            """)
    List<Integer> selectExContentId();

    @Insert("""
            INSERT INTO content (ex_content_id, type_id, cat3, area_code, sigungu_code, title)
            VALUES (#{contentId}, #{typeId}, #{cat3}, #{areaCode}, #{sigunguCode}, #{title})
            """)
    int insertContent(Content content);

    @Insert("""
            INSERT INTO info1 (content_id, zipcode, address, tel, homepage, overview,
                                first_image1, first_image2, mapx, mapy, created, modified)
            VALUES ((SELECT id FROM content WHERE ex_content_id=#{contentId}), #{zipcode}, #{address}, #{tel}, #{homepage}, #{overview},
                    #{firstImage1}, #{firstImage2}, #{mapx}, #{mapy}, #{created}, #{modified})
            """)
    int insertInfo1(Content content);

    @Select("""
            SELECT COUNT(ex_content_id)
            FROM content
            WHERE ex_content_id=#{contentId}
            """)
    int countContentByExContentId(Integer contentId);

    @Select("""
            SELECT COUNT(*)
            FROM info1 i JOIN content c ON i.content_id = c.id
            WHERE c.ex_content_id=#{contentId}
            """)
    int countInfo1ByExContentIdOnContent(Integer contentId);

    @Update("""
            UPDATE info1 
            SET homepage=#{homepage}, overview=#{overview}
            WHERE content_id=#{id}
            """)
    int insertInfo1Detail(Content content);

    @Insert("""
            INSERT INTO info2 (content_id, number, info_name, info_text)
            VALUES (#{contentId}, #{number}, #{infoName}, #{infoText})
            """)
    int insertInfo2(Info2 info2);

    @Select("""
            SELECT c.id, c.title, i.first_image1
            FROM content c JOIN info1 i ON c.id = i.content_id
            ORDER BY i.modified DESC
            LIMIT 12
            """)
    List<Content> selectAll();

    @Select("""
            SELECT c.id, c.title, i.zipcode, i.address, i.tel, i.homepage, i.overview, i.first_image1, i.first_image2, i.mapx, i.mapy, i.modified
            FROM content c JOIN info1 i ON c.id = i.content_id
            WHERE c.id=#{id}
            """)
    Content selectContentInfoById(Integer id);

    @Select("""
            SELECT id
            FROM content
            WHERE ex_content_id=#{contentId}
            """)
    Integer selectIdByExContentId(Integer contentId);

    @Insert("""
            INSERT INTO image(content_id, original_url, small_url)
            VALUES (#{contentId}, #{originalUrl}, #{smallUrl})
            """)
    int insertImage(Image image);

    @Select("""
            <script>
            SELECT COUNT(c.id)
            FROM content c
                <if test="typeId != null">
                    JOIN content_type ct ON c.type_id=ct.id
                </if>
                <if test="catCode != null">
                    <choose>
                        <when test = "catCode.length == 3">
                            JOIN category1 cat1 ON LEFT(c.cat3, 3) = cat1.cat1
                        </when>
                        <when test = "catCode.length == 5">
                            JOIN category2 cat2 ON LEFT(c.cat3, 5) = cat2.cat2
                        </when>
                        <otherwise>
                            JOIN category3 cat3 ON c.cat3 = cat3.cat3
                        </otherwise>
                    </choose>
                </if>
                <if test="areaCode != null">
                    JOIN area a ON c.area_code = a.area_code
                </if>
                <if test="sigunguCode != null">
                    JOIN sigungu s ON c.area_code = s.area_code AND c.sigungu_code = s.sigungu_code
                </if>
            <trim prefix="WHERE" prefixOverrides="AND">
                <if test="typeId != null">
                    c.type_id=#{typeId}
                </if>
                <if test="catCode != null">
                    AND
                    <choose>
                        <when test = "catCode.length == 3">
                            LEFT(c.cat3, 3) = #{catCode}
                        </when>
                        <when test = "catCode.length == 5">
                            LEFT(c.cat3, 5) = #{catCode}
                        </when>
                        <otherwise>
                            c.cat3 = #{catCode}
                        </otherwise>
                    </choose>
                </if>
                <if test="areaCode != null">
                    AND c.area_code=#{areaCode}
                </if>
                <if test="sigunguCode != null">
                    AND c.sigungu_code=#{sigunguCode}
                </if>
                <if test="keyword != null">
                    AND c.title LIKE CONCAT('%', #{keyword}, '%')
                </if>
            </trim>
            </script>
            """)
    Integer countAllWithSearch(Integer typeId, String catCode, Integer areaCode, Integer sigunguCode, String keyword);

    @Select("""
            <script>
            SELECT c.id, c.title, i.id, i.first_image1
            FROM content c
                JOIN info1 i ON c.id = i.content_id
                <if test="typeId != null">
                    JOIN content_type ct ON c.type_id=ct.id
                </if>
                <if test="catCode != null">
                    <choose>
                        <when test = "catCode.length == 3">
                            JOIN category1 cat1 ON LEFT(c.cat3, 3) = cat1.cat1
                        </when>
                        <when test = "catCode.length == 5">
                            JOIN category2 cat2 ON LEFT(c.cat3, 5) = cat2.cat2
                        </when>
                        <otherwise>
                            JOIN category3 cat3 ON c.cat3 = cat3.cat3
                        </otherwise>
                    </choose>
                </if>
                <if test="areaCode != null">
                    JOIN area a ON c.area_code = a.area_code
                </if>
                <if test="sigunguCode != null">
                    JOIN sigungu s ON c.area_code = s.area_code AND c.sigungu_code = s.sigungu_code
                </if>
            <trim prefix="WHERE" prefixOverrides="AND">
                <if test="typeId != null">
                    c.type_id=#{typeId}
                </if>
                <if test="catCode != null">
                    AND
                    <choose>
                        <when test = "catCode.length == 3">
                            LEFT(c.cat3, 3) = #{catCode}
                        </when>
                        <when test = "catCode.length == 5">
                            LEFT(c.cat3, 5) = #{catCode}
                        </when>
                        <otherwise>
                            c.cat3 = #{catCode}
                        </otherwise>
                    </choose>
                </if>
                <if test="areaCode != null">
                    AND c.area_code=#{areaCode}
                </if>
                <if test="sigunguCode != null">
                    AND c.sigungu_code=#{sigunguCode}
                </if>
                <if test="keyword != null">
                    AND title LIKE CONCAT('%', #{keyword}, '%')
                </if>
            </trim>
            ORDER BY i.modified DESC
            LIMIT #{offset}, 12
            </script>
            """)
    List<Content> selectAllPaging(Integer offset, Integer typeId, String catCode, Integer areaCode, Integer sigunguCode, String keyword);

    @Select("""
            SELECT id
            FROM content_type
            WHERE name=#{name}
            """)
    Integer selectTypeIdByName(String name);

    @Select("""
            SELECT DISTINCT CASE
                    WHEN c1.name=#{name} THEN c1.cat1
                    WHEN c2.name=#{name} THEN c2.cat2
                    WHEN c3.name=#{name} THEN c3.cat3
                    END AS catCode
            FROM category1 c1
                     JOIN category2 c2 ON c1.cat1 = c2.cat1
                     JOIN category3 c3 ON c2.cat2 = c3.cat2
            WHERE c1.name=#{name}
               OR c2.name=#{name}
               OR c3.name=#{name};
            """)
    String selectCatByName(String name);

    @Select("""
            SELECT area_code
            FROM area
            WHERE name=#{name}
            """)
    Integer selectAreaCodeByName(String name);

    @Select("""
            SELECT sigungu_code
            FROM sigungu
            WHERE area_code=#{areaCode} AND name=#{name}
            """)
    Integer selectSigunguCodeByName(Integer areaCode, String name);

    @Select("""
            SELECT id
            FROM content_type
            """)
    List<Integer> selectTypeId();

    @Insert("""
            INSERT INTO type_category_mapping (type_id, cat1, cat2)
            VALUES (#{contentTypeId}, #{cat1}, #{cat2})
            """)
    int insertTypeCategoryMapping(Category typeCatMaps);

    @Select("""
            SELECT DISTINCT c1.name
            FROM category1 c1
                JOIN type_category_mapping tcm on c1.cat1 = tcm.cat1
                JOIN content_type ct on tcm.type_id = ct.id
            WHERE ct.name = #{contentTypeName}
            """)
    List<String> selectCat1NamesByContentTypeNameOnMap(String contentTypeName);

    @Select("""
            SELECT c2.name
            FROM category2 c2
                JOIN type_category_mapping tcm on c2.cat2 = tcm.cat2
                JOIN content_type ct on tcm.type_id = ct.id
                JOIN category1 c1 on c2.cat1 = c1.cat1
            WHERE ct.name=#{contentTypeName} AND c1.name=#{cat1Name}
            """)
    List<String> selectCat2NamesByCat1NameOnMap(String contentTypeName, String cat1Name);

    @Select("""
            SELECT c3.name
            FROM category3 c3
                JOIN category2 c2 ON c3.cat2 = c2.cat2
            WHERE c2.name=#{cat2Name}
            """)
    List<String> selectCat3NamesByCat2Name(String cat2Name);

    @Select("""
            SELECT name
            FROM area
            """)
    List<String> selectAreaName();

    @Select("""
            SELECT s.name
            FROM sigungu s JOIN area a ON s.area_code = a.area_code
            WHERE a.name=#{areaName}
            """)
    List<String> selectSigunguNameByAreaName(String areaName);

    @Select("""
            SELECT COUNT(*)
            FROM content
            WHERE id=#{id}
            """)
    int countContentByContentId(Integer id);

    @Select("""
            SELECT COUNT(*)
            FROM info2
            WHERE content_id=#{contentId} AND number=#{number}
            """)
    int countInfo2ByContentIdOnContent(Integer contentId, Integer number);


    @Select("""
            SELECT number ,info_name, info_text
            FROM info2
            WHERE content_id=#{contentId}
            """)
    List<Info2> selectInfo2ByContentId(Integer contentId);

    @Insert("""
            INSERT INTO lodging_info2 (content_id, number, title, size, room_count, base_accom_count, max_accom_count, off_season_fee_wd, peak_season_fee_wd, off_season_fee_we, peak_season_fee_we, intro, aircondition, bath, bath_facility, cable, cook, hairdryer, home_theater, internet, pc, sofa, refrigerator, toiletries, tv)
            VALUES (#{contentId}, #{number}, #{title}, #{size}, #{roomCount}, #{baseAccomCount}, #{maxAccomCount}, #{offSeasonFeeWd}, #{peakSeasonFeeWd}, #{offSeasonFeeWe}, #{peakSeasonFeeWe}, #{intro}, #{aircondition}, #{bath}, #{bathFacility}, #{cable}, #{cook}, #{hairdryer}, #{homeTheater}, #{internet}, #{pc}, #{sofa}, #{refrigerator}, #{toiletries}, #{tv})
            """)
    int insertLodgingInfo2(LodgingInfo2 info2);

    @Select("""
            SELECT id
            FROM lodging_info2
            WHERE content_id=#{contentId} AND number=#{number}
            """)
    Integer selectLodgingInfo2IdByContentIdOnContent(Integer contentId, Integer number);

    @Insert("""
            INSERT INTO lodging_info2_img (content_id, lodging_info2_id, img_url)
            VALUES (#{info2.contentId}, #{lodgingInfo2Id}, #{info2.imgUrl})
            """)
    int insertLodgingInfo2Img(LodgingInfo2 info2, Integer lodgingInfo2Id);

    @Select("""
            SELECT type_id
            FROM content
            WHERE id=#{contentId}
            """)
    Integer selectTypeIdByContentId(Integer contentId);

    @Select("""
            SELECT *
            FROM lodging_info2
            WHERE content_id=#{contentId}
            """)
    List<LodgingInfo2> selectLodgingInfo2ByContentId(Integer contentId);

    @Select("""
            SELECT img_url
            FROM lodging_info2_img
            WHERE lodging_info2_id=#{id}
            """)
    List<String> selectImgByLodgingInfo2Id(LodgingInfo2 lodgingInfo2);

    @Select("""
            SELECT *
            FROM content
            """)
    List<Content> selectAllContents();

    @Select("""
            SELECT *
            FROM content
            WHERE id=#{id}
            """)
    List<Content> selectContentById(Integer id);

    // 추후에 수정일순 정렬로 변경
    @Select("""
            SELECT id
            FROM content
            ORDER BY id DESC
            LIMIT 23000, 1000
            """)
    List<Integer> selectAllContentId();

    @Select("""
            SELECT id
            FROM spot_info
            WHERE content_id=#{cid}
            """)
    Integer selectSpotInfoIdByContentIdOnContent(Integer cid);

    @Insert("""
            INSERT INTO spot_info (content_id, accom_count, chk_baby_carriage, chk_credit_card, chk_pet, exp_age_range, exp_guide, heritage, parking, open_date, rest_date, tel_center, use_season, use_time)
            VALUES (#{contentId}, #{accomCount}, #{chkBabyCarriage}, #{chkCreditCard}, #{chkPet}, #{expAgeRange}, #{expGuide}, #{heritage}, #{parking}, #{openDate}, #{restDate}, #{telCenter}, #{useSeason}, #{useTime})
            """)
    int insertSpotInfo(IntroInfo introInfo);

    @Select("""
            SELECT id
            FROM culture_info
            WHERE content_id=#{cid}
            """)
    Integer selectCultureInfoIdByContentIdOnContent(Integer cid);

    @Insert("""
            INSERT INTO culture_info (content_id, accom_count, chk_baby_carriage, chk_credit_card, chk_pet, discount, parking, parking_fee, rest_date, tel_center, use_fee, use_time, scale, spend_time)
            VALUES (#{contentId}, #{accomCount}, #{chkBabyCarriage}, #{chkCreditCard}, #{chkPet}, #{discount}, #{parking}, #{parkingFee}, #{restDate}, #{telCenter}, #{useFee}, #{useTime}, #{scale}, #{spendTime})
            """)
    int insertCultureInfo(IntroInfo introInfo);

    @Select("""
            SELECT id
            FROM festival_info
            WHERE content_id=#{cid}
            """)
    Integer selectFestivalInfoIdByContentIdOnContent(Integer cid);

    @Insert("""
            INSERT INTO festival_info (content_id, age_limit, booking_place, discount, start_date, end_date, place, place_info, play_time, program, use_fee, spend_time, sponsor1, tel_sponsor1, sponsor2, tel_sponsor2, sub_event)
            VALUES (#{contentId}, #{ageLimit}, #{bookingPlace}, #{discount}, #{startDate}, #{endDate}, #{place}, #{placeInfo}, #{playTime}, #{program}, #{useFee}, #{spendTime}, #{sponsor1}, #{telSponsor1}, #{sponsor2}, #{telSponsor2}, #{subEvent})
            """)
    int insertFestivalInfo(IntroInfo introInfo);

    @Select("""
            SELECT id
            FROM leports_info
            WHERE content_id=#{cid}
            """)
    Integer selectLeportsInfoIdByContentIdOnContent(Integer cid);

    @Insert("""
            INSERT INTO leports_info (content_id, accom_count, chk_baby_carriage, chk_credit_card, chk_pet, exp_age_range, open_period, parking, parking_fee, rest_date, reservation ,tel_center, use_fee, use_time, scale)
            VALUES (#{contentId}, #{accomCount}, #{chkBabyCarriage}, #{chkCreditCard}, #{chkPet}, #{expAgeRange}, #{openPeriod}, #{parking}, #{parkingFee}, #{restDate}, #{reservation} , #{telCenter}, #{useFee}, #{useTime}, #{scale})
            """)
    int insertLeportsInfo(IntroInfo introInfo);

    @Select("""
            SELECT id
            FROM lodging_info
            WHERE content_id=#{cid}
            """)
    Integer selectLodgingInfoIdByContentIdOnContent(Integer cid);

    @Insert("""
            INSERT INTO lodging_info (content_id, accom_count, check_in, check_out, chk_cooking, food_place, parking, pickup, reservation_tel, reservation_url, tel_center, scale, room_count, room_type, sub_facility)
            VALUES (#{contentId}, #{accomCount}, #{checkIn}, #{checkOut}, #{chkCooking}, #{foodPlace}, #{parking}, #{pickup}, #{reservationTel}, #{reservationUrl}, #{telCenter} , #{scale}, #{roomCount}, #{roomType}, #{subFacility})
            """)
    int insertLodgingInfo(IntroInfo introInfo);

    @Select("""
            SELECT id
            FROM shopping_info
            WHERE content_id=#{cid}
            """)
    Integer selectShoppingInfoIdByContentIdOnContent(Integer cid);

    @Insert("""
            INSERT INTO shopping_info (content_id, chk_baby_carriage, chk_credit_card, chk_pet, fair_day, open_date, open_time, parking, rest_date, rest_room, tel_center, sale_item, scale, shop_guide)
            VALUES (#{contentId}, #{chkBabyCarriage}, #{chkCreditCard}, #{chkPet}, #{fairDay}, #{openDate}, #{openTime}, #{parking}, #{restDate}, #{restRoom} , #{telCenter}, #{saleItem}, #{scale}, #{shopGuide})
            """)
    int insertShoppingInfo(IntroInfo introInfo);

    @Select("""
            SELECT id
            FROM food_info
            WHERE content_id=#{cid}
            """)
    Integer selectFoodInfoIdByContentIdOnContent(Integer cid);

    @Insert("""
            INSERT INTO food_info (content_id, chk_credit_card, discount, first_menu, menu, kids_facility, open_date, open_time, packing, parking, rest_date, reservation, tel_center, scale, seat)
            VALUES (#{contentId}, #{chkCreditCard}, #{discount}, #{firstMenu}, #{menu}, #{kidsFacility}, #{openDate}, #{openTime}, #{packing}, #{parking}, #{restDate}, #{reservation}, #{telCenter}, #{scale}, #{seat})
            """)
    int insertFoodInfo(IntroInfo introInfo);

    @Select("""
            SELECT *
            FROM spot_info
            WHERE content_id=#{contentId}
            """)
    List<IntroInfo> selectSpotInfoByContentId(Integer contentId);

    @Select("""
            SELECT *
            FROM culture_info
            WHERE content_id=#{contentId}
            """)
    List<IntroInfo> selectCultureInfoByContentId(Integer contentId);

    @Select("""
            SELECT *
            FROM festival_info
            WHERE content_id=#{contentId}
            """)
    List<IntroInfo> selectFestivalInfoByContentId(Integer contentId);

    @Select("""
            SELECT *
            FROM leports_info
            WHERE content_id=#{contentId}
            """)
    List<IntroInfo> selectLeportsInfoByContentId(Integer contentId);

    @Select("""
            SELECT *
            FROM lodging_info
            WHERE content_id=#{contentId}
            """)
    List<IntroInfo> selectLodgingInfoByContentId(Integer contentId);

    @Select("""
            SELECT *
            FROM shopping_info
            WHERE content_id=#{contentId}
            """)
    List<IntroInfo> selectShoppingInfoByContentId(Integer contentId);

    @Select("""
            SELECT *
            FROM food_info
            WHERE content_id=#{contentId}
            """)
    List<IntroInfo> selectFoodInfoByContentId(Integer contentId);

    @Select("""
            SELECT id
            FROM info1
            WHERE content_id=#{id} AND (overview IS NOT NULL OR homepage IS NOT NULL);
            """)
    Integer selectInfo1WithDetail(Integer id);

    @Select("""
            SELECT id
            FROM image
            WHERE original_url=#{originalUrl}
            """)
    Integer selectImageIdByOUrl(Image image);

    @Select("""
            SELECT MAX(modified)
            FROM info1
            """)
    String selectMaxModified();

    @Select("""
            SELECT *
            FROM info1
            WHERE content_id=#{id}
            """)
    List<Content> selectInfo1ByContentId(Integer id);

    @Delete("""
            DELETE FROM info2
            WHERE content_id=#{id}
            """)
    int deleteInfo2(Integer id);

    @Delete("""
            DELETE FROM info1
            WHERE content_id=#{id}
            """)
    int deleteInfo1(Integer id);

    @Delete("""
            DELETE FROM spot_info
            WHERE content_id=#{id}
            """)
    int deleteSpotInfo(Integer id);

    @Delete("""
            DELETE FROM culture_info
            WHERE content_id=#{id}
            """)
    int deleteCultureInfo(Integer id);

    @Delete("""
            DELETE FROM festival_info
            WHERE content_id=#{id}
            """)
    int deleteFestivalInfo(Integer id);

    @Delete("""
            DELETE FROM leports_info
            WHERE content_id=#{id}
            """)
    int deleteLeportsInfo(Integer id);

    @Delete("""
            DELETE FROM lodging_info2_img
            WHERE content_id=#{id}
            """)
    int deleteLodgingInfo2Img(Integer id);

    @Delete("""
            DELETE FROM lodging_info2
            WHERE content_id=#{id}
            """)
    int deleteLodgingInfo2(Integer id);

    @Delete("""
            DELETE FROM lodging_info
            WHERE content_id=#{id}
            """)
    int deleteLodgingInfo(Integer id);

    @Delete("""
            DELETE FROM shopping_info
            WHERE content_id=#{id}
            """)
    int deleteShoppingInfo(Integer id);

    @Delete("""
            DELETE FROM food_info
            WHERE content_id=#{id}
            """)
    int deleteFoodInfo(Integer id);

    @Delete("""
            DELETE FROM content
            WHERE id=#{id}
            """)
    int deleteContent(Integer id);

    @Update("""
            UPDATE content
            SET type_id=#{typeId}, cat3=#{cat3}, area_code=#{areaCode}, sigungu_code=#{sigunguCode}, title=#{title}
            WHERE ex_content_id=#{contentId}
            """)
    int updateContent(Content content);

    @Update("""
            UPDATE info1
            SET zipcode=#{zipcode}, address=#{address}, tel=#{tel}, homepage=#{homepage}, overview=#{overview},
                first_image1=#{firstImage1}, first_image2=#{firstImage2}, mapx=#{mapx}, mapy=#{mapy}, created=#{created}, modified=#{modified}
            WHERE cotentid=#{id}
            """)
    int updateInfo1(Content content);

    @Select("""
            SELECT id
            FROM image
            WHERE content_id=#{id}
            """)
    List<Image> selectImageIdByContentId(Integer id);

    @Delete("""
            DELETE FROM image
            WHERE content_id=#{id}
            """)
    int deleteImage(Integer id);

    @Select("""
            SELECT *
            FROM image
            WHERE content_id=#{id}
            """)
    List<Image> selectImageByContentId(Integer id);
}
