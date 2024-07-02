import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Select,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function TourList() {
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
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/tour/get/areaName").then((res) => {
      setAreas(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/tour/list?${searchParams}`).then((res) => {
      setTourList(res.data.tourList);
      setPageInfo(res.data.pageInfo);

      setContentType("");
      setCategory("");
      setArea("");
      setSigungu("");
      setKeyword("");

      const typeParam = searchParams.get("type");
      const categoryParam = searchParams.get("category");
      const areaParam = searchParams.get("area");
      const sigunguParam = searchParams.get("sigungu");
      const keywordParam = searchParams.get("keyword");

      if (typeParam) {
        setContentType(typeParam);
      }
      if (categoryParam) {
        setCategory(categoryParam);
      }
      if (areaParam) {
        setArea(areaParam);
      }
      if (sigunguParam) {
        setSigungu(sigunguParam);
      }
      if (keywordParam) {
        setKeyword(keywordParam);
      }
    });
  }, [searchParams]);

  useEffect(() => {
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
  }, [contentType, selectedCat1, selectedCat2, area]);

  const pageNums = [];
  for (let i = pageInfo.leftPageNum; i <= pageInfo.rightPageNum; i++) {
    pageNums.push(i);
  }

  function handleClickPage(pageNum) {
    searchParams.set("page", pageNum);
    navigate(`/tour/list?${searchParams}`);
  }

  function handleClickSearch() {
    const params = new URLSearchParams();

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

    navigate(`/tour/list?${params.toString()}`);
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

  function handlePressEnter(e) {
    if (e.key === "Enter") {
      handleClickSearch();
    }
  }

  return (
    <Box
      mx={{
        base: 4,
        lg: 100,
      }}
      mt={10}
      bg="gray.50"
      p={4}
      borderRadius="lg"
      boxShadow="md"
    >
      <Box mb={10}>
        <Heading textAlign="center" mb={4} mt={5} color="teal.700">
          관광지 리스트
        </Heading>
        <Flex justify="center" mb={6}>
          <Text color="gray.600">원하는 관광지를 검색하세요.</Text>
        </Flex>
      </Box>
      <Table
        mb={10}
        border="2px solid"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow="sm"
        bg="white"
      >
        <Tbody>
          <Tr>
            <Th width="15%">관광타입</Th>
            <Td width="85%">
              <Flex gap={3}>
                <Select
                  value={contentType}
                  onChange={(e) => {
                    setContentType(e.target.value);
                    setSelectedCat1("");
                    setSelectedCat2("");
                    setCategory("");
                  }}
                  bg="white"
                  borderColor="gray.300"
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
                    bg="white"
                    borderColor="gray.300"
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
                    bg="white"
                    borderColor="gray.300"
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
                    bg="white"
                    borderColor="gray.300"
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
            <Th width="15%">지역</Th>
            <Td width="85%">
              <Flex gap={3}>
                <Select
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value);
                    setSigungu("");
                  }}
                  bg="white"
                  borderColor="gray.300"
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
                    bg="white"
                    borderColor="gray.300"
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
            <Th width="15%">검색어</Th>
            <Td width="85%">
              <Flex gap={3}>
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handlePressEnter}
                  placeholder="검색어를 입력하세요"
                  bg="white"
                  borderColor="gray.300"
                />
                <Button
                  colorScheme="blue"
                  onClick={handleClickSearch}
                  _hover={{ bg: "blue.600" }}
                >
                  검색
                </Button>
                <Button
                  colorScheme="gray"
                  onClick={handleClickReset}
                  _hover={{ bg: "gray.400" }}
                >
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
            minChildWidth="280px"
            spacing={5}
            justifyItems="center"
            mt={5}
          >
            {tourList.map((item) => (
              <Box
                key={item.id}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                width="300px"
                height="240px"
                cursor="pointer"
                onClick={() => navigate(`/tour/${item.id}`)}
                transition="transform 0.2s"
                _hover={{
                  borderColor: "blue.300",
                  transform: "scale(1.05)",
                }}
                overflow="hidden"
              >
                <Box height="190px" display="flex" alignItems="center" justifyContent="center">
                  {item.firstImage1 ? (
                    <Image objectFit="cover" width="100%" height="100%" src={item.firstImage1} />
                  ) : (
                    <Text>이미지 없음</Text>
                  )}
                </Box>
                <Box
                  borderTop="1px solid"
                  borderColor="gray.200"
                  height="40px"
                  mt="5px"
                  fontWeight="semibold"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  p={2}
                  textAlign="center"
                  bg="white"
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
              <Button onClick={() => handleClickPage(1)} _hover={{ bg: "blue.600" }}>
                처음
              </Button>
              <Button onClick={() => handleClickPage(pageInfo.prevPageNum)} _hover={{ bg: "blue.600" }}>
                이전
              </Button>
            </>
          )}
          {pageNums.map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => handleClickPage(pageNum)}
              colorScheme={pageNum === pageInfo.currPageNum ? "blue" : "gray"}
              _hover={{ bg: "blue.600" }}
            >
              {pageNum}
            </Button>
          ))}
          {pageInfo.nextPageNum < pageInfo.lastPageNum && (
            <>
              <Button onClick={() => handleClickPage(pageInfo.nextPageNum)} _hover={{ bg: "blue.600" }}>
                다음
              </Button>
              <Button onClick={() => handleClickPage(pageInfo.lastPageNum)} _hover={{ bg: "blue.600" }}>
                끝
              </Button>
            </>
          )}
        </Flex>
      </Center>
    </Box>
  );
}
