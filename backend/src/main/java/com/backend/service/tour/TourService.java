package com.backend.service.tour;

import com.backend.domain.tour.*;
import com.backend.mapper.tour.TourMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class TourService {
    private final TourMapper mapper;

    public void setContentId(Content content) {
        Integer newId = mapper.selectIdByExContentId(content.getContentId());
        content.setId(newId);
    }

    public void addArea(List<Area> areas) {
        List<Integer> dbAreaCode = mapper.selectAreaCode();
        for (Area area : areas) {
            if (!dbAreaCode.contains(area.getAreaCode())) {
                mapper.insertArea(area);
            }
        }
    }

    public void addSigungu(List<Area> areas) {
        for (Area area : areas) {
            mapper.insertSigungu(area);
        }
    }

    public List<Integer> getAreaCode() {
        return mapper.selectAreaCode();
    }

    public void addCategory1(List<Category> categories) {
        List<String> dbCat1 = mapper.selectCat1();
        for (Category category : categories) {
            if (!dbCat1.contains(category.getCat1())) {
                mapper.insertCategory1(category);
            }
        }
    }

    public void addCategory2(List<Category> categories) {
        List<String> dbCat2 = mapper.selectCat2();
        for (Category category : categories) {
            if (!dbCat2.contains(category.getCat2())) {
                mapper.insertCategory2(category);
            }
        }
    }

    public void addCategory3(List<Category> categories) {
        List<String> dbCat3 = mapper.selectCat3();
        for (Category category : categories) {
            if (!dbCat3.contains(category.getCat3())) {
                mapper.insertCategory3(category);
            }
        }
    }

    public List<String> getCat1() {
        return mapper.selectCat1();
    }

    public List<String> getCat2() {
        return mapper.selectCat2();
    }

    public void addContentAndInfo1(List<Content> contents) {
        List<Integer> dbExContentId = mapper.selectExContentId();
        for (Content content : contents) {
            mapper.insertContent(content);
            mapper.insertInfo1(content);
        }
    }

    public void addContent(List<Content> contents) {
        for (Content content : contents) {
            int dbCount = mapper.countContentByExContentId(content.getContentId());
            if (dbCount == 0
                    && mapper.selectTypeId().contains(content.getTypeId())
                    && mapper.selectAreaCode().contains(content.getAreaCode())
                    && mapper.selectCat3().contains(content.getCat3())
                    && mapper.selectSigungu().contains(content.getSigunguCode())) {
                mapper.insertContent(content);
            }
        }
    }

    public void addInfo1(List<Content> contents) {
        int i = 0;
        for (Content content : contents) {
            // info1에 이미 있는 데이터가 아닐때만(0) 진행
            int dbCountInfo1 = mapper.countInfo1ByExContentIdOnContent(content.getContentId());
            // content에 있어야(1) info 데이터 삽입
            int dbCountContent = mapper.countContentByExContentId(content.getContentId());

            String mapxPattern = "^[0-9]{1,3}\\.[0-9]{1,10}$";
            String mapyPattern = "^[0-9]{1,2}\\.[0-9]{1,10}$";

            if (dbCountInfo1 == 0
                    && dbCountContent == 1
                    && content.getMapx().toString().matches(mapxPattern)
                    && content.getMapy().toString().matches(mapyPattern)) {
                System.out.println(STR."\{i}: \{content.getContentId()}");
                mapper.insertInfo1(content);
            } else {
                System.out.println(STR."\{i}: \{content.getContentId()} - 입력실패");
            }

            i++;
        }
    }

    public void addInfo1detail(List<List<Content>> contentLists) {
        for (List<Content> contentList : contentLists) {
            for (Content content : contentList) {
                if (mapper.countContentByContentId(content.getId()) == 1 && mapper.selectInfo1WithDetail(content.getId()) == null) {
                    mapper.insertInfo1Detail(content);
                    System.out.println(STR."\{content.getId()}");
                } else {
                    System.out.println(STR."\{content.getId()} - 입력실패");
                }
            }
        }
    }

    public void addImage(List<List<Image>> imageList) {
        for (List<Image> images : imageList) {
            for (Image image : images) {
                if (mapper.countContentByContentId(image.getContentId()) == 1 && mapper.selectImageIdByOUrl(image) == null) {
                    mapper.insertImage(image);
                    System.out.println(STR."\{image.getContentId()}");
                } else {
                    System.out.println(STR."\{image.getContentId()} - 입력실패");
                }
            }
        }
    }

    public List<Content> list() {
        return mapper.selectAll();
    }

    public Map<String, Object> list(Integer page,
                                    Integer typeId,
                                    String catCode,
                                    Integer areaCode,
                                    Integer sigunguCode,
                                    String keyword) {
        Map<String, Object> pageInfo = new HashMap<>();
        Integer countAll = mapper.countAllWithSearch(typeId, catCode, areaCode, sigunguCode, keyword);

        Integer offset = (page - 1) * 12;
        Integer lastPageNum = (countAll - 1) / 12 + 1;
        Integer leftPageNum = (page - 1) / 10 * 10 + 1;
        Integer rightPageNum = leftPageNum + 9;
        rightPageNum = Math.min(rightPageNum, lastPageNum);
        Integer prevPageNum = leftPageNum - 1;
        Integer nextPageNum = leftPageNum + 10;

        pageInfo.put("prevPageNum", prevPageNum);
        pageInfo.put("nextPageNum", nextPageNum);
        pageInfo.put("currPageNum", page);
        pageInfo.put("lastPageNum", lastPageNum);
        pageInfo.put("leftPageNum", leftPageNum);
        pageInfo.put("rightPageNum", rightPageNum);

        return Map.of("pageInfo", pageInfo,
                "tourList", mapper.selectAllPaging(offset, typeId, catCode, areaCode, sigunguCode, keyword));
    }

    public Map<String, Object> get(Integer id) {
        Map<String, Object> result = new HashMap<>();

        Content info1 = mapper.selectContentInfoById(id);

        result.put("info1", info1);

        return result;
    }

    public Integer typeNameAsId(String typeName) {
        return mapper.selectTypeIdByName(typeName);
    }

    public String catNameAsCode(String catName) {
        return mapper.selectCatByName(catName);
    }

    public Integer areaNameAsCode(String areaName) {
        return mapper.selectAreaCodeByName(areaName);
    }

    public Integer sigunguNameAsCode(Integer areaCode, String sigunguName) {
        return mapper.selectSigunguCodeByName(areaCode, sigunguName);
    }

    public Map<String, Object> getNextSearchOption(Map<String, Object> options) {
        String contentTypeName = options.get("contentType").toString();
        String cat1Name = options.get("cat1").toString();
        String cat2Name = options.get("cat2").toString();
        String areaName = options.get("area").toString();

        Map<String, Object> nextSearchOption = new HashMap<>();

        if (!contentTypeName.isEmpty()) {
            List<String> nextCat1 = mapper.selectCat1NamesByContentTypeNameOnMap(contentTypeName);
            nextSearchOption.put("nextCat1", nextCat1);
        }
        if (!contentTypeName.isEmpty() && !cat1Name.isEmpty()) {
            List<String> nextCat2 = mapper.selectCat2NamesByCat1NameOnMap(contentTypeName, cat1Name);
            nextSearchOption.put("nextCat2", nextCat2);
        }
        if (!contentTypeName.isEmpty() && !cat1Name.isEmpty() && !cat2Name.isEmpty()) {
            List<String> nextCat3 = mapper.selectCat3NamesByCat2Name(cat2Name);
            nextSearchOption.put("nextCat3", nextCat3);
        }

        if (!areaName.isEmpty()) {
            List<String> nextSigungu = mapper.selectSigunguNameByAreaName(areaName);
            nextSearchOption.put("nextSigungu", nextSigungu);
        }

        return nextSearchOption;
    }

    public List<Integer> getContentTypeId() {
        return mapper.selectTypeId();
    }

    public void addTypeCategoryMapping(List<Category> typeCatMaps) {
        for (Category typeCatMap : typeCatMaps) {
            mapper.insertTypeCategoryMapping(typeCatMap);
        }
    }

    public List<String> getAreaName() {
        return mapper.selectAreaName();
    }

    public void addInfo2(List<List<Info2>> info2Lists) {
        for (List<Info2> info2List : info2Lists) {
            for (Info2 info2 : info2List) {
                // content에 있어야(1) info 데이터 삽입
                int dbCountContent = mapper.countContentByContentId(info2.getContentId());
                // info2에 이미 있는 데이터가 아닐때만(0) 진행
                int dbCountInfo2 = mapper.countInfo2ByContentIdOnContent(info2.getContentId(), info2.getNumber());

                if (dbCountContent == 1 && dbCountInfo2 == 0) {
                    System.out.println(STR."\{info2.getContentId()}");
                    mapper.insertInfo2(info2);
                } else {
                    System.out.println(STR."\{info2.getContentId()} - 입력실패");
                }
            }
        }
    }

    public List<Info2> getInfo2(Integer contentId) {
        Integer contentType = mapper.selectTypeIdByContentId(contentId);

        if (contentType == 32) {
            List<Info2> info2List = new ArrayList<>();
            List<LodgingInfo2> lodgingInfo2List = mapper.selectLodgingInfo2ByContentId(contentId);

            for (LodgingInfo2 lodgingInfo2 : lodgingInfo2List) {
                // 처음 number 는 0
                int i = 0;

                // 객실 이미지
                List<String> images = mapper.selectImgByLodgingInfo2Id(lodgingInfo2);
                if (!images.isEmpty()) {
                    Info2 info2 = new Info2();

                    info2.setNumber(i);
                    info2.setInfoName("객실사진");
                    info2.setInfoText(images.toString().replace("[", "").replace("]", ""));

                    info2List.add(info2);

                    i++;
                }
                // null 이거나 empty 이면 패스
                if (!lodgingInfo2.getTitle().isEmpty()) {
                    // 새 객체 만들고
                    Info2 info2 = new Info2();
                    // 필요한 값 set
                    info2.setNumber(i);
                    info2.setInfoName("객실명");
                    info2.setInfoText(lodgingInfo2.getTitle());
                    // 리턴할 리스트에 add
                    info2List.add(info2);
                    // 다음 number
                    i++;
                }
                if (!lodgingInfo2.getSize().isEmpty()) {
                    Info2 info2 = new Info2();

                    info2.setNumber(i);
                    info2.setInfoName("객실크기");
                    info2.setInfoText(lodgingInfo2.getSize());

                    info2List.add(info2);

                    i++;
                }
                if (!lodgingInfo2.getRoomCount().isEmpty()) {
                    Info2 info2 = new Info2();

                    info2.setNumber(i);
                    info2.setInfoName("객실수");
                    info2.setInfoText(lodgingInfo2.getRoomCount());

                    info2List.add(info2);

                    i++;
                }
                if (!lodgingInfo2.getBaseAccomCount().isEmpty()) {
                    Info2 info2 = new Info2();

                    info2.setNumber(i);
                    info2.setInfoName("기준인원");
                    info2.setInfoText(lodgingInfo2.getBaseAccomCount());

                    info2List.add(info2);

                    i++;
                }
                if (!lodgingInfo2.getMaxAccomCount().isEmpty()) {
                    Info2 info2 = new Info2();

                    info2.setNumber(i);
                    info2.setInfoName("최대인원");
                    info2.setInfoText(lodgingInfo2.getMaxAccomCount());

                    info2List.add(info2);

                    i++;
                }
                if (!lodgingInfo2.getOffSeasonFeeWd().isEmpty() && !lodgingInfo2.getOffSeasonFeeWe().isEmpty()) {
                    Info2 info2 = new Info2();

                    info2.setNumber(i);
                    info2.setInfoName("비수기최소(주중/주말)");
                    info2.setInfoText(STR."\{lodgingInfo2.getOffSeasonFeeWd()}/\{lodgingInfo2.getOffSeasonFeeWe()}");

                    info2List.add(info2);

                    i++;
                }
                if (!lodgingInfo2.getPeakSeasonFeeWd().isEmpty() && !lodgingInfo2.getPeakSeasonFeeWe().isEmpty()) {
                    Info2 info2 = new Info2();

                    info2.setNumber(i);
                    info2.setInfoName("성수기최소(주중/주말)");
                    info2.setInfoText(STR."\{lodgingInfo2.getPeakSeasonFeeWd()}/\{lodgingInfo2.getPeakSeasonFeeWe()}");

                    info2List.add(info2);

                    i++;
                }
                if (!lodgingInfo2.getIntro().isEmpty()) {
                    Info2 info2 = new Info2();

                    info2.setNumber(i);
                    info2.setInfoName("객실소개");
                    info2.setInfoText(lodgingInfo2.getIntro());

                    info2List.add(info2);

                    i++;
                }

                // 편의시설 여부 StringBuilder 에 저장
                StringBuilder facilities = getStringBuilder(lodgingInfo2);
                if (facilities.length() >= 2) {
                    facilities.delete(facilities.length() - 2, facilities.length());
                }

                Info2 info2 = new Info2();

                info2.setNumber(i);
                info2.setInfoName("편의시설");
                info2.setInfoText(facilities.toString());

                info2List.add(info2);
            }
//            return mapper.selectInfo2ByContentId(67257);
            return info2List;
        } else {
            return mapper.selectInfo2ByContentId(contentId);
        }
    }

    private static StringBuilder getStringBuilder(LodgingInfo2 lodgingInfo2) {
        StringBuilder facilities = new StringBuilder();
        if (lodgingInfo2.getAircondition().matches("Y")) {
            facilities.append("에어컨, ");
        }
        if (lodgingInfo2.getBath().matches("Y")) {
            facilities.append("욕조, ");
        }
        if (lodgingInfo2.getBathFacility().matches("Y")) {
            facilities.append("목욕시설, ");
        }
        if (lodgingInfo2.getCable().matches("Y")) {
            facilities.append("케이블, ");
        }
        if (lodgingInfo2.getCook().matches("Y")) {
            facilities.append("취사용품, ");
        }
        if (lodgingInfo2.getHairdryer().matches("Y")) {
            facilities.append("드라이기, ");
        }
        if (lodgingInfo2.getHomeTheater().matches("Y")) {
            facilities.append("홈시어터, ");
        }
        if (lodgingInfo2.getInternet().matches("Y")) {
            facilities.append("인터넷, ");
        }
        if (lodgingInfo2.getPc().matches("Y")) {
            facilities.append("PC, ");
        }
        if (lodgingInfo2.getSofa().matches("Y")) {
            facilities.append("소파, ");
        }
        if (lodgingInfo2.getRefrigerator().matches("Y")) {
            facilities.append("냉장고, ");
        }
        if (lodgingInfo2.getToiletries().matches("Y")) {
            facilities.append("세면도구, ");
        }
        if (lodgingInfo2.getTv().matches("Y")) {
            facilities.append("TV, ");
        }
        return facilities;
    }

    public void addLodgingInfo2(List<List<LodgingInfo2>> info2Lists) {
        for (List<LodgingInfo2> info2List : info2Lists) {
            for (LodgingInfo2 info2 : info2List) {
                // content에 있어야(1) info 데이터 삽입
                int dbCountContent = mapper.countContentByContentId(info2.getContentId());
                // info2에 이미 있는 데이터가 아닐때만(null) 진행
                Integer lodgingInfo2Id = mapper.selectLodgingInfo2IdByContentIdOnContent(info2.getContentId(), info2.getNumber());

                if (dbCountContent == 1 && lodgingInfo2Id == null) {
                    System.out.println(STR."\{info2.getContentId()}");
                    mapper.insertLodgingInfo2(info2);

                    String[] images = {info2.getImg1(), info2.getImg2(), info2.getImg3(), info2.getImg4(), info2.getImg5()};
                    for (String image : images) {
                        if (!image.isEmpty()) {
                            info2.setImgUrl(image);
                            mapper.insertLodgingInfo2Img(info2, mapper.selectLodgingInfo2IdByContentIdOnContent(info2.getContentId(), info2.getNumber()));
                        }
                    }
                } else {
                    System.out.println(STR."\{info2.getContentId()} - 입력실패");
                }
            }
        }
    }

    public void addIntroInfo(List<List<IntroInfo>> introInfoLists) {
        for (List<IntroInfo> introInfoList : introInfoLists) {
            for (IntroInfo introInfo : introInfoList) {
                Integer cid = introInfo.getContentId();
                // content에 있어야(1) 데이터 삽입
                int dbCountContent = mapper.countContentByContentId(cid);
                if (dbCountContent == 1) {
                    if (introInfo.getTypeId() == 12) {
                        // 각 info에 이미 있는 데이터가 아닐때만(null) 진행
                        if (mapper.selectSpotInfoIdByContentIdOnContent(cid) == null) {
                            if (introInfo.getHeritage1() == 1) {
                                introInfo.setHeritage(1);
                            } else if (introInfo.getHeritage2() == 1) {
                                introInfo.setHeritage(2);
                            } else if (introInfo.getHeritage3() == 1) {
                                introInfo.setHeritage(3);
                            } else {
                                introInfo.setHeritage(0);
                            }
                            mapper.insertSpotInfo(introInfo);
                            System.out.println(cid);
                        } else {
                            System.out.println(STR."\{cid} - 이미 입력된 정보");
                        }
                    }
                    if (introInfo.getTypeId() == 14) {
                        if (mapper.selectCultureInfoIdByContentIdOnContent(cid) == null) {
                            mapper.insertCultureInfo(introInfo);
                            System.out.println(cid);
                        } else {
                            System.out.println(STR."\{cid} - 이미 입력된 정보");
                        }
                    }
                    if (introInfo.getTypeId() == 15) {
                        if (mapper.selectFestivalInfoIdByContentIdOnContent(cid) == null) {
                            mapper.insertFestivalInfo(introInfo);
                            System.out.println(cid);
                        } else {
                            System.out.println(STR."\{cid} - 이미 입력된 정보");
                        }
                    }
                    if (introInfo.getTypeId() == 28) {
                        if (mapper.selectLeportsInfoIdByContentIdOnContent(cid) == null) {
                            mapper.insertLeportsInfo(introInfo);
                            System.out.println(cid);
                        } else {
                            System.out.println(STR."\{cid} - 이미 입력된 정보");
                        }
                    }
                    if (introInfo.getTypeId() == 32) {
                        if (mapper.selectLodgingInfoIdByContentIdOnContent(cid) == null) {
                            mapper.insertLodgingInfo(introInfo);
                            System.out.println(cid);
                        } else {
                            System.out.println(STR."\{cid} - 이미 입력된 정보");
                        }
                    }
                    if (introInfo.getTypeId() == 38) {
                        if (mapper.selectShoppingInfoIdByContentIdOnContent(cid) == null) {
                            mapper.insertShoppingInfo(introInfo);
                            System.out.println(cid);
                        } else {
                            System.out.println(STR."\{cid} - 이미 입력된 정보");
                        }
                    }
                    if (introInfo.getTypeId() == 39) {
                        if (mapper.selectFoodInfoIdByContentIdOnContent(cid) == null) {
                            mapper.insertFoodInfo(introInfo);
                            System.out.println(cid);
                        } else {
                            System.out.println(STR."\{cid} - 이미 입력된 정보");
                        }
                    }
                }
            }
        }
    }

    public List<Content> getAllContents() {
        return mapper.selectAllContents();
    }

    public List<Content> getContent(Integer id) {
        return mapper.selectContentById(id);
    }

    public List<Integer> getAllContentId() {
        return mapper.selectAllContentId();
    }

    public List<Info2> getIntro(Integer contentId) {
        List<Info2> introList = new ArrayList<>();
        Integer contentType = mapper.selectTypeIdByContentId(contentId);

        List<IntroInfo> introInfoList = new ArrayList<>();
        if (contentType == 12) {
            introInfoList = mapper.selectSpotInfoByContentId(contentId);
        }
        if (contentType == 14) {
            introInfoList = mapper.selectCultureInfoByContentId(contentId);
        }
        if (contentType == 15) {
            introInfoList = mapper.selectFestivalInfoByContentId(contentId);
        }
        if (contentType == 28) {
            introInfoList = mapper.selectLeportsInfoByContentId(contentId);
        }
        if (contentType == 32) {
            introInfoList = mapper.selectLodgingInfoByContentId(contentId);
        }
        if (contentType == 38) {
            introInfoList = mapper.selectShoppingInfoByContentId(contentId);
        }
        if (contentType == 39) {
            introInfoList = mapper.selectFoodInfoByContentId(contentId);
        }

        for (IntroInfo introInfo : introInfoList) {
            // 처음 number 는 0
            int i = 0;


            if (introInfo.getOpenDate() != null && !introInfo.getOpenDate().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("개장일");
                intros.setInfoText(introInfo.getOpenDate());

                introList.add(intros);

                i++;
            }
            if (introInfo.getOpenPeriod() != null && !introInfo.getOpenPeriod().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("개장기간");
                intros.setInfoText(introInfo.getOpenPeriod());

                introList.add(intros);

                i++;
            }
            if (introInfo.getOpenTime() != null && !introInfo.getOpenTime().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("영업시간");
                intros.setInfoText(introInfo.getOpenTime());

                introList.add(intros);

                i++;
            }
            if (introInfo.getStartDate() != null && !introInfo.getStartDate().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("시작일");
                intros.setInfoText(introInfo.getStartDate());

                introList.add(intros);

                i++;
            }
            if (introInfo.getEndDate() != null && !introInfo.getEndDate().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("종료일");
                intros.setInfoText(introInfo.getEndDate());

                introList.add(intros);

                i++;
            }
            if (introInfo.getRestDate() != null && !introInfo.getRestDate().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("쉬는날");
                intros.setInfoText(introInfo.getRestDate());

                introList.add(intros);

                i++;
            }
            if (introInfo.getCheckIn() != null && !introInfo.getCheckIn().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("입실");
                intros.setInfoText(introInfo.getCheckIn());

                introList.add(intros);

                i++;
            }
            if (introInfo.getCheckOut() != null && !introInfo.getCheckOut().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("퇴실");
                intros.setInfoText(introInfo.getCheckOut());

                introList.add(intros);

                i++;
            }
            if (introInfo.getAccomCount() != null && !introInfo.getAccomCount().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("수용인원");
                intros.setInfoText(introInfo.getAccomCount());

                introList.add(intros);

                i++;
            }
            if (introInfo.getAgeLimit() != null && !introInfo.getAgeLimit().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("연령제한");
                intros.setInfoText(introInfo.getAgeLimit());

                introList.add(intros);

                i++;
            }
            if (introInfo.getBookingPlace() != null && !introInfo.getBookingPlace().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("예매처");
                intros.setInfoText(introInfo.getBookingPlace());

                introList.add(intros);

                i++;
            }
            if (introInfo.getChkBabyCarriage() != null && !introInfo.getChkBabyCarriage().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("유모차 대여");
                intros.setInfoText(introInfo.getChkBabyCarriage());

                introList.add(intros);

                i++;
            }
            if (introInfo.getChkCreditCard() != null && !introInfo.getChkCreditCard().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("신용카드 사용");
                intros.setInfoText(introInfo.getChkCreditCard());

                introList.add(intros);

                i++;
            }
            if (introInfo.getChkPet() != null && !introInfo.getChkPet().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("애완동물 동반");
                intros.setInfoText(introInfo.getChkPet());

                introList.add(intros);

                i++;
            }
            if (introInfo.getDiscount() != null && !introInfo.getDiscount().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("할인정보");
                intros.setInfoText(introInfo.getDiscount());

                introList.add(intros);

                i++;
            }
            if (introInfo.getExpAgeRange() != null && !introInfo.getExpAgeRange().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("연령제한");
                intros.setInfoText(introInfo.getExpAgeRange());

                introList.add(intros);

                i++;
            }
            if (introInfo.getExpGuide() != null && !introInfo.getExpGuide().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("체험안내");
                intros.setInfoText(introInfo.getExpGuide());

                introList.add(intros);

                i++;
            }
            if (introInfo.getFairDay() != null && !introInfo.getFairDay().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("장서는날");
                intros.setInfoText(introInfo.getFairDay());

                introList.add(intros);

                i++;
            }
            if (introInfo.getFirstMenu() != null && !introInfo.getFirstMenu().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("대표메뉴");
                intros.setInfoText(introInfo.getFirstMenu());

                introList.add(intros);

                i++;
            }
            if (introInfo.getMenu() != null && !introInfo.getMenu().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("메뉴");
                intros.setInfoText(introInfo.getMenu());

                introList.add(intros);

                i++;
            }
            if (introInfo.getChkCooking() != null && !introInfo.getChkCooking().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("객실내취사");
                intros.setInfoText(introInfo.getChkCooking());

                introList.add(intros);

                i++;
            }
            if (introInfo.getFoodPlace() != null && !introInfo.getFoodPlace().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("식음료장");
                intros.setInfoText(introInfo.getFoodPlace());

                introList.add(intros);

                i++;
            }
            if (introInfo.getHeritage() != null && introInfo.getHeritage() != 0) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("세계유산");
                if (introInfo.getHeritage() == 1) {
                    intros.setInfoText("세계문화유산");
                } else if (introInfo.getHeritage() == 2) {
                    intros.setInfoText("세계자연유산");
                } else if (introInfo.getHeritage() == 3) {
                    intros.setInfoText("세계기록유산");
                }

                introList.add(intros);

                i++;
            }
            if (introInfo.getKidsFacility() != null && !introInfo.getKidsFacility().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("어린이놀이방");
                intros.setInfoText(introInfo.getKidsFacility());

                introList.add(intros);

                i++;
            }
            if (introInfo.getPacking() != null && !introInfo.getPacking().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("포장");
                intros.setInfoText(introInfo.getPacking());

                introList.add(intros);

                i++;
            }
            if (introInfo.getParking() != null && !introInfo.getParking().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("주차");
                intros.setInfoText(introInfo.getParking());

                introList.add(intros);

                i++;
            }
            if (introInfo.getParkingFee() != null && !introInfo.getParkingFee().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("주차요금");
                intros.setInfoText(introInfo.getParkingFee());

                introList.add(intros);

                i++;
            }
            if (introInfo.getPickup() != null && !introInfo.getPickup().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("픽업서비스");
                intros.setInfoText(introInfo.getPickup());

                introList.add(intros);

                i++;
            }
            if (introInfo.getPlace() != null && !introInfo.getPlace().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("장소");
                intros.setInfoText(introInfo.getPlace());

                introList.add(intros);

                i++;
            }
            if (introInfo.getPlaceInfo() != null && !introInfo.getPlaceInfo().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("위치안내");
                intros.setInfoText(introInfo.getPlaceInfo());

                introList.add(intros);

                i++;
            }
            if (introInfo.getPlayTime() != null && !introInfo.getPlayTime().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("공연시간");
                intros.setInfoText(introInfo.getPlayTime());

                introList.add(intros);

                i++;
            }
            if (introInfo.getProgram() != null && !introInfo.getProgram().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("프로그램");
                intros.setInfoText(introInfo.getProgram());

                introList.add(intros);

                i++;
            }
            if (introInfo.getReservation() != null && !introInfo.getReservation().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("예약");
                intros.setInfoText(introInfo.getReservation());

                introList.add(intros);

                i++;
            }
            if (introInfo.getReservationTel() != null && !introInfo.getReservationTel().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("예약");
                intros.setInfoText(introInfo.getReservationTel());

                introList.add(intros);

                i++;
            }
            if (introInfo.getReservationUrl() != null && !introInfo.getReservationUrl().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("예약 페이지");
                intros.setInfoText(introInfo.getReservationUrl());

                introList.add(intros);

                i++;
            }
            if (introInfo.getRestRoom() != null && !introInfo.getRestRoom().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("화장실");
                intros.setInfoText(introInfo.getRestRoom());

                introList.add(intros);

                i++;
            }
            if (introInfo.getRoomType() != null && !introInfo.getRoomType().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("객실유형");
                intros.setInfoText(introInfo.getRoomType());

                introList.add(intros);

                i++;
            }
            if (introInfo.getRoomCount() != null && !introInfo.getRoomCount().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("객실수");
                intros.setInfoText(introInfo.getRoomCount());

                introList.add(intros);

                i++;
            }
            if (introInfo.getSaleItem() != null && !introInfo.getSaleItem().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("판매품목");
                intros.setInfoText(introInfo.getSaleItem());

                introList.add(intros);

                i++;
            }
            if (introInfo.getScale() != null && !introInfo.getScale().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("규모");
                intros.setInfoText(introInfo.getScale());

                introList.add(intros);

                i++;
            }
            if (introInfo.getSeat() != null && !introInfo.getSeat().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("좌석수");
                intros.setInfoText(introInfo.getSeat());

                introList.add(intros);

                i++;
            }
            if (introInfo.getShopGuide() != null && !introInfo.getShopGuide().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("매장안내");
                intros.setInfoText(introInfo.getShopGuide());

                introList.add(intros);

                i++;
            }
            if (introInfo.getSubEvent() != null && !introInfo.getSubEvent().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("부대행사");
                intros.setInfoText(introInfo.getSubEvent());

                introList.add(intros);

                i++;
            }
            if (introInfo.getSubFacility() != null && !introInfo.getSubFacility().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("부대시설");
                intros.setInfoText(introInfo.getSubFacility());

                introList.add(intros);

                i++;
            }
            if (introInfo.getTelCenter() != null && !introInfo.getTelCenter().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("문의 및 안내");
                intros.setInfoText(introInfo.getTelCenter());

                introList.add(intros);

                i++;
            }
            if (introInfo.getSponsor1() != null && !introInfo.getSponsor1().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("주최자정보");
                intros.setInfoText(introInfo.getSponsor1());

                introList.add(intros);

                i++;
            }
            if (introInfo.getTelSponsor1() != null && !introInfo.getTelSponsor1().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("주최자연락처");
                intros.setInfoText(introInfo.getTelSponsor1());

                introList.add(intros);

                i++;
            }
            if (introInfo.getSponsor2() != null && !introInfo.getSponsor2().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("주관사정보");
                intros.setInfoText(introInfo.getSponsor2());

                introList.add(intros);

                i++;
            }
            if (introInfo.getTelSponsor2() != null && !introInfo.getTelSponsor2().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("주관사연락처");
                intros.setInfoText(introInfo.getTelSponsor2());

                introList.add(intros);

                i++;
            }
            if (introInfo.getUseFee() != null && !introInfo.getUseFee().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("이용요금");
                intros.setInfoText(introInfo.getUseFee());

                introList.add(intros);

                i++;
            }
            if (introInfo.getUseSeason() != null && !introInfo.getUseSeason().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("이용시기");
                intros.setInfoText(introInfo.getUseSeason());

                introList.add(intros);

                i++;
            }
            if (introInfo.getUseTime() != null && !introInfo.getUseTime().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("이용시간");
                intros.setInfoText(introInfo.getUseTime());

                introList.add(intros);

                i++;
            }
            if (introInfo.getSpendTime() != null && !introInfo.getSpendTime().isEmpty()) {
                Info2 intros = new Info2();

                intros.setNumber(i);
                intros.setInfoName("소요시간");
                intros.setInfoText(introInfo.getSpendTime());

                introList.add(intros);
            }
        }
        return introList;
    }

    public String getLastMD() {
        return mapper.selectMaxModified();
    }

    public Integer getId(Integer contentId) {
        return mapper.selectIdByExContentId(contentId);
    }

    public void removeContent(Integer contentId) {
        Integer id = mapper.selectIdByExContentId(contentId);

        // 타입 id 조회
        Integer contentType = mapper.selectTypeIdByContentId(id);
        // info2 있으면 삭제, info1 있으면 삭제, 타입별 info 삭제
        switch (contentType) {
            case 12 -> mapper.deleteSpotInfo(id);
            case 14 -> mapper.deleteCultureInfo(id);
            case 15 -> mapper.deleteFestivalInfo(id);
            case 28 -> mapper.deleteLeportsInfo(id);
            case 32 -> {
                removeLodgingInfo2(id);
                mapper.deleteLodgingInfo(id);
            }
            case 38 -> mapper.deleteShoppingInfo(id);
            case 39 -> mapper.deleteFoodInfo(id);
            default -> System.out.println(STR."\{id} - 소개정보 없음");
        }
        if (!mapper.selectInfo2ByContentId(id).isEmpty()) {
            removeInfo2(id);
        }
        if (!mapper.selectInfo1ByContentId(id).isEmpty()) {
            mapper.deleteInfo1(id);
        }
        if (!mapper.selectImageIdByContentId(id).isEmpty()) {
            removeImage(id);
        }
        if (!mapper.selectContentById(id).isEmpty()) {
            mapper.deleteContent(id);
        }
    }

    public void modifyContent(List<Content> contents) {
        for (Content content : contents) {
            int dbCount = mapper.countContentByExContentId(content.getContentId());
            if (dbCount == 1) {
                mapper.updateContent(content);
            }
        }
    }

    public void modifyInfo1(List<Content> contents) {
        for (Content content : contents) {
            String mapxPattern = "^[0-9]{1,3}\\.[0-9]{1,10}$";
            String mapyPattern = "^[0-9]{1,2}\\.[0-9]{1,10}$";

            if (!mapper.selectInfo1ByContentId(content.getId()).isEmpty()
                    && content.getMapx().toString().matches(mapxPattern)
                    && content.getMapy().toString().matches(mapyPattern)) {
                mapper.updateInfo1(content);
            } else {
                System.out.println(STR."\{content.getContentId()} - 입력실패");
            }
        }
    }

    public void removeInfo2(Integer contentId) {
        mapper.deleteInfo2(contentId);
    }

    public void removeLodgingInfo2(Integer contentId) {
        mapper.deleteLodgingInfo2Img(contentId);
        mapper.deleteLodgingInfo2(contentId);
    }

    public void removeImage(Integer contentId) {
        mapper.deleteImage(contentId);
    }

    public List<Image> getImage(Integer id) {
        return mapper.selectImageByContentId(id);
    }
}
