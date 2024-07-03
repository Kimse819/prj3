import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
    });

    setSearchType("all");
    setSearchKeyword("");

    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams]);

  const pageNums = [];
  for (let i = pageInfo.leftPageNum; i <= pageInfo.rightPageNum; i++) {
    pageNums.push(i);
  }

  function handleSearch() {
    navigate(`/board/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handlePageClick(pageNum) {
    searchParams.set("page", pageNum);
    navigate(`/board/list?${searchParams}`);
  }

  const bgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.700", "teal.300");
  const searchBgColor = useColorModeValue("gray.50", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.100", "gray.700");
  const buttonBgColor = useColorModeValue("teal.50", "teal.700");

  function handleClickWrite() {}

  return (
    <Box p={8} bg={bgColor} minH="100vh">
      <Heading
        mb={8}
        textAlign="center"
        fontSize="2xl"
        fontWeight="bold"
        color={headingColor}
      >
        게시판
      </Heading>
      <Box mb={8} bg={searchBgColor} p={4} borderRadius="md" boxShadow="sm">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={2}
            align="center"
          >
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              width="150px"
            >
              <option value="all">전체</option>
              <option value="text">제목+내용</option>
              <option value="nickName">작성자</option>
            </Select>
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어 입력"
              width={{ base: "100%", md: "auto" }}
            />
            <Button onClick={handleSearch} colorScheme="blue">
              검색
            </Button>
          </Stack>
          <Box>
            <Button onClick={handleClickWrite} colorScheme="green">
              글쓰기
            </Button>
          </Box>
        </Flex>
      </Box>
      {boardList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {boardList.length > 0 && (
        <Box bg="white" p={6} boxShadow="lg" borderRadius="md">
          <Table variant="simple">
            <Thead bg={tableHeaderBg}>
              <Tr>
                <Th>#</Th>
                <Th>제목</Th>
                <Th>작성자</Th>
                <Th>작성일시</Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardList.map((board) => (
                <Tr key={board.id}>
                  <Td>{board.id}</Td>
                  <Td
                    cursor="pointer"
                    onClick={() => navigate(`/board/${board.id}`)}
                  >
                    {board.numberOfImages > 0 && (
                      <Badge bgColor="white">
                        <FontAwesomeIcon icon={faImages} color="green" />
                      </Badge>
                    )}
                    {board.title}
                    {board.numberOfComments > 0 && (
                      <Badge bgColor="white" ml={1}>
                        [{board.numberOfComments}]
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.writer}</Td>
                  <Td>{board.inserted}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      <Center mt={8}>
        <Flex wrap="wrap" justifyContent="center">
          {pageInfo.prevPageNum && (
            <>
              <Button
                onClick={() => handlePageClick(1)}
                colorScheme="gray"
                variant="outline"
                m={1}
                w={10}
              >
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button
                onClick={() => handlePageClick(pageInfo.prevPageNum)}
                colorScheme="gray"
                variant="outline"
                m={1}
                w={10}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}
          {pageNums.map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              m={1}
              colorScheme={pageNum === pageInfo.currPageNum ? "blue" : "gray"}
              variant="outline"
              // bg={buttonBgColor}
            >
              {pageNum}
            </Button>
          ))}
          {pageInfo.nextPageNum && (
            <>
              <Button
                onClick={() => handlePageClick(pageInfo.nextPageNum)}
                colorScheme="gray"
                variant="outline"
                m={1}
                w={10}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button
                onClick={() => handlePageClick(pageInfo.lastPageNum)}
                colorScheme="gray"
                variant="outline"
                m={1}
                w={10}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </>
          )}
        </Flex>
      </Center>
    </Box>
  );
}

export default BoardList;
