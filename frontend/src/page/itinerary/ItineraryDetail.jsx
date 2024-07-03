import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

export function ItineraryDetail() {
  // 리스트
  const [tourList, setTourList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [contentType, setContentType] = useState("");
  const [category, setCategory] = useState("");
  const [cat1, setCat1] = useState([]);
  const [selectedCat1, setSelectedCat1] = useState("");
  const [cat2, setCat2] = useState([]);
  const [selectedCat2, setSelectedCat2] = useState("");
  const [cat3, setCat3] = useState([]);
  const [selectedCat3, setSelectedCat3] = useState("");
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [sigungu, setSigungu] = useState("");
  const [sigungus, setSigungus] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  // 상세보기
  const [id, setId] = useState(null);
  const [info, setInfo] = useState([]);
  const [introInfo, setIntroInfo] = useState(null);
  const [info2, setInfo2] = useState(null);

  const [visitList, setVisitList] = useState([]);
  const [visitIndex, setVisitIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("00:00");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const {
    isOpen: isOpenList,
    onClose: onCloseList,
    onOpen: onOpenList,
  } = useDisclosure();
  const {
    isOpen: isOpenDetail,
    onClose: onCloseDetail,
    onOpen: onOpenDetail,
  } = useDisclosure();
  const {
    isOpen: isOpenVisit,
    onClose: onCloseVisit,
    onOpen: onOpenVisit,
  } = useDisclosure();
  const toast = useToast();
  const location = useLocation();
  const startDate = location.state?.startDate || "";
  const endDate = location.state?.endDate || "";
  const navigate = useNavigate();
  const days = moment(endDate).diff(moment(startDate), "days") + 1;
  const [day, setDay] = useState(1);
  const dayPlan = [];

  const itinerary = {
    name: location.state?.name || "",
    startDate: moment(startDate).format("YYYY-MM-DD"),
    endDate: moment(endDate).format("YYYY-MM-DD"),
  };

  useEffect(() => {
    if (days < 1 || isNaN(days)) {
      alert("여행 날짜를 설정해주세요");
      navigate("/itinerary/new");
    }
  }, []);

  useEffect(() => {
    if (isOpenList) {
      axios.get("/api/tour/get/areaName").then((res) => {
        setAreas(res.data);
      });
    }
  }, [isOpenList]);

  useEffect(() => {
    if (isOpenList) {
      axios.get(`/api/tour/list?${searchParam}`).then((res) => {
        setTourList(res.data.tourList);
        setPageInfo(res.data.pageInfo);
      });
    }
  }, [isOpenList, isSearch]);

  useEffect(() => {
    if (isOpenList) {
      axios
        .post(`/api/tour/get/searchOption`, {
          contentType: contentType,
          cat1: selectedCat1,
          cat2: selectedCat2,
          area: area,
        })
        .then((res) => {
          setCat1(res.data.nextCat1 || []);
          setCat2(res.data.nextCat2 || []);
          setCat3(res.data.nextCat3 || []);
          setSigungus(res.data.nextSigungu || []);
        });
    }
  }, [contentType, selectedCat1, selectedCat2, area]);

  useEffect(() => {
    if (isOpenDetail) {
      axios
        .get(`/api/tour/${id}`)
        .then((res) => {
          setInfo(res.data.info1);
        })
        .catch(() => {});

      axios
        .get(`/api/tour/${id}/info2`)
        .then((res) => {
          setInfo2(res.data);
        })
        .catch();

      axios
        .get(`/api/tour/${id}/intro`)
        .then((res) => {
          setIntroInfo(res.data);
        })
        .catch();
    }
  }, [isOpenDetail]);

  useEffect(() => {
    if (isAdd === true) {
      setIsAdd(false);
    }
  }, [isAdd]);

  const pageNums = [];
  for (let i = pageInfo.leftPageNum; i <= pageInfo.rightPageNum; i++) {
    pageNums.push(i);
  }

  const params = new URLSearchParams();
  function handleClickPage(pageNum) {
    if (contentType) {
      params.append("type", contentType);
    }
    if (category) {
      params.append("category", category);
    }
    if (area) {
      params.append("area", area);
    }
    if (sigungu) {
      params.append("sigungu", sigungu);
    }
    if (keyword) {
      params.append("keyword", keyword);
    }
    if (pageNum) {
      params.append("page", pageNum);
    }

    setSearchParam(params);

    setIsSearch(!isSearch);
  }

  function handleClickSearch() {
    if (contentType) {
      params.append("type", contentType);
    }
    if (category) {
      params.append("category", category);
    }
    if (area) {
      params.append("area", area);
    }
    if (sigungu) {
      params.append("sigungu", sigungu);
    }
    if (keyword) {
      params.append("keyword", keyword);
    }

    setSearchParam(params);

    setIsSearch(!isSearch);
  }

  function handleClickReset() {
    setContentType("");
    setSelectedCat1("");
    setSelectedCat2("");
    setCategory("");
    setArea("");
    setSigungu("");
    setKeyword("");
    toast({
      title: "검색 조건이 초기화되었습니다.",
      status: "info",
      position: "top",
      duration: 2000,
    });
  }

  function handleAddContent() {
    const visit = {
      visitDay: day,
      index: visitIndex,
      title: info.title,
      contentId: id,
      description: description,
      visitTime: time,
    };

    setVisitList([...visitList, visit]);
    setSearchParam("");
    setContentType("");
    setSelectedCat1("");
    setSelectedCat2("");
    setCategory("");
    setArea("");
    setSigungu("");
    setKeyword("");
    setDescription("");
    setTime("00:00");
    onCloseDetail();
    onCloseList();
    onCloseVisit();
    setVisitIndex(visitIndex + 1);

    setIsAdd(true);
  }

  function handleDeleteVisit(index) {
    const newVisit = [...visitList];

    for (let i = 0; i < newVisit.length; i++) {
      if (newVisit[i].index > index) {
        newVisit[i].index--;
      }
    }
    newVisit.splice(index, 1);
    setVisitIndex(visitIndex - 1);
    setVisitList(newVisit);

    setIsAdd(true);
  }

  function handleSubmitItinerary() {
    axios
      .post(`/api/itinerary/add`, itinerary)
      .then((res) => {
        axios.post(`/api/itinerary/add/detail`, visitList);
      })
      .catch()
      .finally(() => {
        toast({
          description: "일정이 저장되었습니다.",
          status: "success",
          position: "top",
        });
        navigate(`/itinerary`);
      });
  }

  function handleEditVisit(item) {
    setDescription(item.description);
    setTime(item.visitTime);

    onOpenVisit();
  }

  function handleEditContent() {
    const newVisitList = [...visitList];
    newVisitList[selectedIndex].visitTime = time;
    newVisitList[selectedIndex].description = description;
    setVisitList(newVisitList);

    setDescription("");
    setTime("00:00");
    onCloseVisit();
  }
//디자인 개선
  for (let i = 1; i <= days; i++) {
    // 장소 목록
    dayPlan.push(
      <Box
        key={i}
        mt={8}
        p={4}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
        bg="white"
      >
        <Box>
          <Stack spacing={4} mb={4}>
            <Flex alignItems="center" justifyContent="space-between">
              <Heading size="md">
                {moment(startDate).add(i - 1, "d").format("MM-DD")}
                <Text fontSize="sm" color="gray.500">
                  (day{i})
                </Text>
              </Heading>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  setIsEdit(false);
                  onOpenList();
                  setDay(i);
                }}
              >
                장소추가
              </Button>
            </Flex>
            <Flex
              justifyContent="space-between"
              fontSize="sm"
              fontWeight="bold"
              mt={3}
              px={4}
            >
              <Text flex={1}>장소</Text>
              <Text flex={2}>메모</Text>
              <Text flex={1}>방문시각</Text>
              <Text flex={1}></Text>
            </Flex>
            {visitList.map((item, index) => {
              if (item.visitDay === i) {
                return (
                  <Flex
                    justifyContent="space-between"
                    key={index}
                    alignItems="center"
                    px={4}
                    py={2}
                    bg="gray.50"
                    borderRadius="md"
                    mb={2}
                  >
                    <Box flex={1}>{item.title}</Box>
                    <Box flex={2}>{item.description}</Box>
                    <Box flex={1}>{item.visitTime}</Box>
                    <Box flex={1}>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => {
                          setIsEdit(true);
                          setSelectedIndex(item.index);
                          handleEditVisit(item, index);
                        }}
                        mr={2}
                      >
                        수정
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteVisit(index)}
                      >
                        삭제
                      </Button>
                    </Box>
                  </Flex>
                );
              }
              return null;
            })}
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      maxW="1200px"
      mx="auto"
      mt={8}
      p={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      bg="gray.100"
    >
      <Box>{dayPlan}</Box>
      <Center>
        <Button onClick={handleSubmitItinerary} mt={10} colorScheme="blue">
          저장
        </Button>
      </Center>
      {/* 리스트 모달 */}
      <Modal
        isOpen={isOpenList}
        onClose={onCloseList}
        scrollBehavior="inside"
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>장소추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table
              mb={10}
              border={"2px solid"}
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="sm"
            >
              <Tbody>
                <Tr>
                  <Th width={"15%"}>관광타입</Th>
                  <Td width={"85%"}>
                    <Flex gap={3}>
                      <Select
                        value={contentType}
                        onChange={(e) => {
                          setContentType(e.target.value);
                          setSelectedCat1("");
                          setSelectedCat2("");
                          setCategory("");
                        }}
                      >
                        <option value="">전체</option>
                        <option>관광지</option>
                        <option>문화시설</option>
                        <option>축제/공연/행사</option>
                        <option>여행코스</option>
                        <option>레포츠</option>
                        <option>숙박</option>
                        <option>쇼핑</option>
                        <option>음식</option>
                      </Select>
                      {contentType && (
                        <Select
                          value={selectedCat1}
                          onChange={(e) => {
                            setSelectedCat1(e.target.value);
                            setCategory(e.target.value);
                            setSelectedCat2("");
                          }}
                        >
                          <option value="">대분류</option>
                          {cat1.map((item, index) => (
                            <option key={index}>{item}</option>
                          ))}
                        </Select>
                      )}
                      {selectedCat1 && (
                        <Select
                          value={selectedCat2}
                          onChange={(e) => {
                            const opt = e.target.value;
                            setSelectedCat2(opt);
                            setCategory(opt || selectedCat1);
                            setSelectedCat3("");
                          }}
                        >
                          <option value="">중분류</option>
                          {cat2.map((item, index) => (
                            <option key={index}>{item}</option>
                          ))}
                        </Select>
                      )}
                      {selectedCat2 && (
                        <Select
                          value={selectedCat3}
                          onChange={(e) => {
                            const opt = e.target.value;
                            setSelectedCat3(opt);
                            setCategory(opt || selectedCat2);
                          }}
                        >
                          <option value="">소분류</option>
                          {cat3.map((item, index) => (
                            <option key={index}>{item}</option>
                          ))}
                        </Select>
                      )}
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Th width={"15%"}>지역</Th>
                  <Td width={"85%"}>
                    <Flex gap={3}>
                      <Select
                        value={area}
                        onChange={(e) => {
                          setArea(e.target.value);
                          setSigungu("");
                        }}
                      >
                        <option value="">전체</option>
                        {areas.map((item, index) => (
                          <option key={index}>{item}</option>
                        ))}
                      </Select>
                      {area && (
                        <Select
                          value={sigungu}
                          onChange={(e) => setSigungu(e.target.value)}
                        >
                          <option value="">전체</option>
                          {sigungus.map((item, index) => (
                            <option key={index}>{item}</option>
                          ))}
                        </Select>
                      )}
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Th width={"15%"}>검색어</Th>
                  <Td width={"85%"}>
                    <Flex gap={3}>
                      <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleClickSearch();
                        }}
                        placeholder="검색어를 입력하세요"
                      />
                      <Button colorScheme="blue" onClick={handleClickSearch}>
                        검색
                      </Button>
                      <Button colorScheme="gray" onClick={handleClickReset}>
                        초기화
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            </Table>

            <Box mb={10}>
              {tourList.length === 0 ? (
                <Center>검색 결과가 없습니다.</Center>
              ) : (
                <SimpleGrid
                  minChildWidth={"280px"}
                  spacing={5}
                  justifyItems={"center"}
                >
                  {tourList.map((item) => (
                    <Box
                      key={item.id}
                      border={"1px solid"}
                      borderColor="gray.200"
                      borderRadius="md"
                      width={"300px"}
                      height={"240px"}
                      cursor={"pointer"}
                      onClick={() => {
                        setContentId(item.id);
                        onOpenDetail();
                      }}
                      transition="transform 0.2s"
                      _hover={{
                        borderColor: "blue.300",
                        transform: "scale(1.05)",
                      }}
                      overflow="hidden"
                    >
                      <Box
                        height={"190px"}
                        width={"100%"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden" // Ensure the image doesn't overflow its container
                      >
                        {item.firstImage1 ? (
                          <Image
                            objectFit="cover"
                            width="100%"
                            height="100%"
                            src={item.firstImage1}
                          />
                        ) : (
                          <Text>이미지 없음</Text>
                        )}
                      </Box>
                      <Box
                        borderTop={"1px solid"}
                        borderColor="gray.200"
                        height={"40px"}
                        mt={"5px"}
                        fontWeight={"semibold"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        p={2}
                        textAlign="center"
                      >
                        {item.title}
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>

            <Center mb={10}>
              <Flex gap={2}>
                {pageInfo.prevPageNum > 0 && (
                  <>
                    <Button onClick={() => handleClickPage(1)}>처음</Button>
                    <Button
                      onClick={() => handleClickPage(pageInfo.prevPageNum)}
                    >
                      이전
                    </Button>
                  </>
                )}
                {pageNums.map((pageNum) => (
                  <Button
                    key={pageNum}
                    onClick={() => handleClickPage(pageNum)}
                    colorScheme={
                      pageNum === pageInfo.currPageNum ? "blue" : "gray"
                    }
                  >
                    {pageNum}
                  </Button>
                ))}
                {pageInfo.nextPageNum < pageInfo.lastPageNum && (
                  <>
                    <Button
                      onClick={() => handleClickPage(pageInfo.nextPageNum)}
                    >
                      다음
                    </Button>
                    <Button
                      onClick={() => handleClickPage(pageInfo.lastPageNum)}
                    >
                      끝
                    </Button>
                  </>
                )}
              </Flex>
            </Center>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      {/* 상세보기 모달 */}
      <Modal
        isOpen={isOpenDetail}
        onClose={onCloseDetail}
        scrollBehavior="inside"
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>상세보기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={4} mx={{ base: 0, lg: 15 }}>
              <Heading mb={4} size="lg">
                {info.title}
              </Heading>

              <Box p={4} mt={4} boxShadow="md" borderRadius="md">
                <Text mb={2} fontSize="lg" fontWeight="bold">
                  사진
                </Text>
                <Image src={info.firstImage1} alt="이미지" borderRadius="md" />
              </Box>

              <Box p={4} mt={4} boxShadow="md" borderRadius="md">
                <Text mb={2} fontSize="lg" fontWeight="bold">
                  정보
                </Text>
                <Table variant="simple">
                  <Tbody>
                    <Tr>
                      <Th>우편번호</Th>
                      <Td>{info.zipcode}</Td>
                    </Tr>
                    <Tr>
                      <Th>주소</Th>
                      <Td>{info.address}</Td>
                    </Tr>
                    <Tr>
                      <Th>전화번호</Th>
                      <Td>{info.tel}</Td>
                    </Tr>
                    <Tr>
                      <Th>홈페이지</Th>
                      <Td
                        dangerouslySetInnerHTML={{ __html: info.homepage }}
                      ></Td>
                    </Tr>
                    <Tr>
                      <Th>위치</Th>
                      <Td>
                        <Map
                          center={{ lat: info.mapy, lng: info.mapx }}
                          style={{
                            width: "100%",
                            height: "350px",
                            borderRadius: "10px",
                          }}
                          level={6}
                        >
                          <MapMarker
                            style={{ border: "transparent" }}
                            position={{ lat: info.mapy, lng: info.mapx }}
                          ></MapMarker>
                        </Map>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>

              {introInfo && (
                <Box p={4} mt={4} boxShadow="md" borderRadius="md">
                  <Text mb={2} fontSize="lg" fontWeight="bold">
                    소개정보
                  </Text>
                  <Table variant="simple">
                    <Tbody>
                      {introInfo.map((item) => (
                        <Tr key={item.number}>
                          <Th>{item.infoName}</Th>
                          <Td>
                            <Text
                              dangerouslySetInnerHTML={{
                                __html: item.infoText,
                              }}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}

              {info2 && (
                <Box p={4} mt={4} boxShadow="md" borderRadius="md">
                  <Text mb={2} fontSize="lg" fontWeight="bold">
                    상세정보
                  </Text>
                  <Table variant="simple">
                    <Tbody>
                      {info2.map((item) => (
                        <Tr key={item.number}>
                          <Th>{item.infoName}</Th>
                          <Td>
                            {item.infoName === "객실사진" &&
                            item.infoText.trim().length > 0 ? (
                              item.infoText
                                .split(",")
                                .map((imgUrl, index) => (
                                  <Image
                                    key={index}
                                    src={imgUrl.trim()}
                                    alt="객실사진"
                                    borderRadius="md"
                                    mt={2}
                                  />
                                ))
                            ) : (
                              <Text
                                dangerouslySetInnerHTML={{
                                  __html: item.infoText,
                                }}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </Box>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button onClick={onOpenVisit} colorScheme="blue">
              선택
            </Button>
            <Button onClick={onCloseDetail}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* 메모 모달 */}
      <Modal isOpen={isOpenVisit} onClose={onCloseVisit} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>장소추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={4} mx={{ base: 0, lg: 10 }}>
              <Box p={4} boxShadow="md" borderRadius="md" mb={4}>
                <Input
                  onChange={(e) => setTime(e.target.value)}
                  value={time}
                  size="md"
                  type="time"
                  placeholder="시간을 입력하세요"
                />
              </Box>
              <Box p={4} boxShadow="md" borderRadius="md">
                <Textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  h={"150px"}
                  placeholder="메모를 입력하세요"
                ></Textarea>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={isEdit ? handleEditContent : handleAddContent}
              colorScheme="blue"
              mr={3}
            >
              {isEdit ? "수정" : "추가"}
            </Button>
            <Button onClick={onCloseVisit}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
