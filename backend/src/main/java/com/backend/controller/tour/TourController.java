package com.backend.controller.tour;

import com.backend.domain.tour.*;
import com.backend.service.tour.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tour")
@RequiredArgsConstructor
public class TourController {
    private final TourService service;

    @PostMapping("add/area")
    public ResponseEntity addArea(@RequestBody List<Area> areas) {
        service.addArea(areas);

        return null;
    }

    @GetMapping("get/area")
    public List<Integer> getArea() {
        return service.getAreaCode();
    }

    @GetMapping("get/areaName")
    public List<String> getAreaName() {
        return service.getAreaName();
    }

    @GetMapping("get/contentType")
    public List<Integer> getContentType() {
        return service.getContentTypeId();
    }

    @PostMapping("add/sigungu")
    public ResponseEntity addSigungu(@RequestBody List<Area> sigungu) {
        service.addSigungu(sigungu);

        return null;
    }

    @PostMapping("add/cat1")
    public ResponseEntity addCat1(@RequestBody List<Category> categories) {
        service.addCategory1(categories);

        return null;
    }

    @GetMapping("get/cat1")
    public List<String> getCat1() {
        return service.getCat1();
    }

    @PostMapping("add/cat2")
    public ResponseEntity addCat2(@RequestBody List<Category> categories) {
        service.addCategory2(categories);

        return null;
    }

    @GetMapping("get/cat2")
    public List<String> getCat2() {
        return service.getCat2();
    }

    @PostMapping("add/cat3")
    public ResponseEntity addCat3(@RequestBody List<Category> categories) {
        service.addCategory3(categories);

        return null;
    }

    @PostMapping("add/content")
    public ResponseEntity addContent(@RequestBody List<Content> contents) {
        service.addContent(contents);

        return ResponseEntity.ok("데이터 저장 완료");
    }

    @PostMapping("add/info1")
    public ResponseEntity addInfo1(@RequestBody List<Content> contents) {
        service.addInfo1(contents);

        return ResponseEntity.ok("데이터 저장 완료");
    }

    @PutMapping("add/info1detail")
    public ResponseEntity addInfo1detail(@RequestBody List<List<Content>> contentLists) {
        service.addInfo1detail(contentLists);

        return ResponseEntity.ok().build();
    }

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(defaultValue = "1") Integer page,
                                    @RequestParam(value = "type", required = false) String typeName,
                                    @RequestParam(value = "category", required = false) String catName,
                                    @RequestParam(value = "area", required = false) String areaName,
                                    @RequestParam(value = "sigungu", required = false) String sigunguName,
                                    @RequestParam(value = "keyword", required = false) String keyword) {
        Integer typeId = service.typeNameAsId(typeName);
        String catCode = service.catNameAsCode(catName);
        Integer areaCode = service.areaNameAsCode(areaName);
        Integer sigunguCode = service.sigunguNameAsCode(areaCode, sigunguName);
//        System.out.println(STR."\{page}, \{typeId}, \{catCode}, \{areaCode}, \{sigunguCode}, \{keyword}");
//        System.out.println(service.list(page, typeId, catCode, areaCode, sigunguCode, keyword));

        return service.list(page, typeId, catCode, areaCode, sigunguCode, keyword);
    }

    @PostMapping("get/searchOption")
    public Map<String, Object> getSearchOption(@RequestBody Map<String, Object> options) {
//        System.out.println(options);
//        System.out.println(options.get("contentType"));
//        System.out.println(service.getNextSearchOption(options));

        return service.getNextSearchOption(options);
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id) {
        return service.get(id);
    }

    @GetMapping("/{id}/info2")
    public List<Info2> getInfo2(@PathVariable(value = "id") Integer contentId) {
        return service.getInfo2(contentId);
    }

    @GetMapping("/{id}/intro")
    public List<Info2> getIntro(@PathVariable(value = "id") Integer contentId) {
        return service.getIntro(contentId);
    }

    @PostMapping("add/image")
    public ResponseEntity addImage(@RequestBody List<List<Image>> imageList) {
        service.addImage(imageList);

        return null;
    }

    @PostMapping("add/typeCatMap")
    public ResponseEntity addTypeCatMap(@RequestBody List<Category> typeCatMaps) {
        service.addTypeCategoryMapping(typeCatMaps);

        return null;
    }

    @PostMapping("add/info2")
    public ResponseEntity addInfo2(@RequestBody List<List<Info2>> info2Lists) {
        service.addInfo2(info2Lists);

        return null;
    }

    @PostMapping("add/lodgingInfo2")
    public ResponseEntity addLodgingInfo2(@RequestBody List<List<LodgingInfo2>> info2Lists) {
        service.addLodgingInfo2(info2Lists);

        return null;
    }

    @PostMapping("add/intro")
    public ResponseEntity addIntroInfo(@RequestBody List<List<IntroInfo>> introInfoLists) {
        service.addIntroInfo(introInfoLists);

        return null;
    }

    @GetMapping("get/content/all")
    public List<Content> getAllContents() {
        return service.getAllContents();
    }

    @GetMapping("get/content/{id}")
    public List<Content> getContent(@PathVariable Integer id) {
        return service.getContent(id);
    }

    @GetMapping("get/id/{contentId}")
    public Integer getId(@PathVariable Integer contentId) {
        return service.getId(contentId);
    }

    @GetMapping("get/contentId")
    public List<Integer> getContentId() {
        return service.getAllContentId();
    }

    @GetMapping("get/lastmd")
    public String getLastMD() {
        return service.getLastMD();
    }

    @DeleteMapping("remove/{contentId}")
    public ResponseEntity removeContent(@PathVariable Integer contentId) {
        service.removeContent(contentId);
        return null;
    }

    @PutMapping("modify/content")
    public ResponseEntity modifyContent(@RequestBody List<Content> contents) {
        service.modifyContent(contents);
        return null;
    }

    @PutMapping("modify/info1")
    public ResponseEntity modifyInfo1(@RequestBody List<Content> contents) {
        service.modifyInfo1(contents);

        return null;
    }

    @DeleteMapping("remove/info2")
    public ResponseEntity removeInfo2(@RequestBody Integer contentId) {
        service.removeInfo2(contentId);

        return null;
    }

    @DeleteMapping("remove/lodgingInfo2")
    public ResponseEntity removeLodgingInfo2(@RequestBody Integer contentId) {
        service.removeLodgingInfo2(contentId);

        return null;
    }

    @DeleteMapping("remove/image")
    public ResponseEntity removeImage(@RequestBody Integer contentId) {
        service.removeImage(contentId);

        return null;
    }

    @GetMapping("{id}/image")
    public List<Image> getImage(@PathVariable Integer id) {
        return service.getImage(id);
    }
}
