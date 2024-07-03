import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Flex,
  Hide,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Spacer,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  faCog,
  faHouse,
  faMagnifyingGlass,
  faPencil,
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      navigate(`/tour/list?keyword=${searchQuery}`);
    }
  };

  const handleButtonClick = () => {
    navigate(`/tour/list?keyword=${searchQuery}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };

  const images = [
    "/image/slider-image1.jpg",
    "/image/sea.jpg",
    "/image/slider-image.jpg",
  ];

  return (
    <Box position="relative" fontFamily="HSSaemaul-Regular, sans-serif">
      <Slider {...settings} style={{ height: "500px" }}>
        {images.map((src, index) => (
          <Box
            key={index}
            height="500px"
            bgImage={`url(${src})`}
            bgSize="cover"
            bgPosition="center"
          />
        ))}
      </Slider>

      <Flex
        width="100%"
        px={{ lg: 200, base: 4 }}
        gap={3}
        height={500}
        position="absolute"
        top={0}
        left={0}
        right={0}
        align="center"
        fontFamily="HSSaemaul-Regular, sans-serif"
      >
        <Center
          onClick={() => navigate("/")}
          cursor={"pointer"}
          _hover={{ bgColor: "rgba(255, 255, 255, 0.5)" }}
          p={6}
          fontSize={25}
          fontWeight={700}
          color={"white"}
        >
          <Show below={"lg"}>
            <FontAwesomeIcon icon={faHouse} />
          </Show>
          <Hide below={"lg"}>Travel Place</Hide>
        </Center>

        <Center ml={4} mb={5}>
          <InputGroup width="300px">
            <Input
              placeholder="검색어를 입력하세요!"
              onKeyPress={handleSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="rgba(255, 255, 255, 0.8)"
              _hover={{ bg: "rgba(255, 255, 255, 1)" }}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleButtonClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Center>

        {account.isLoggedIn() && (
          <Center
            onClick={() => navigate("/write")}
            cursor={"pointer"}
            _hover={{ bgColor: "rgba(255, 255, 255, 0.5)" }}
            p={6}
            fontSize={20}
            fontWeight={600}
            color={"white"}
          >
            <Show below={"lg"}>
              <FontAwesomeIcon icon={faPencil} />
            </Show>
            <Hide below={"lg"}>글쓰기</Hide>
          </Center>
        )}

        <Spacer />

        {account.isLoggedIn() && (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Flex gap={2}>
                <Box
                  onClick={() => navigate(`/member/${account.id}`)}
                  cursor={"pointer"}
                  _hover={{
                    bgColor: "gray.200",
                  }}
                >
                  <FontAwesomeIcon icon={faUser} />
                </Box>
                <Box>
                  <Hide below={"lg"}>{account.nickName}</Hide>
                </Box>
              </Flex>
            </MenuButton>

            <MenuList>
              <MenuItem onClick={() => navigate(`/member/${account.id}`)}>
                <FontAwesomeIcon icon={faCog} />
                <Box ml={2}>마이페이지</Box>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  account.logout();
                  navigate("/login");
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <Box ml={2}>로그아웃</Box>
              </MenuItem>

              {account.isAdmin() && (
                <MenuItem
                  onClick={() => navigate("/member/list")}
                  cursor={"pointer"}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  <Box ml={2}>회원목록</Box>
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        )}

        {!account.isLoggedIn() && (
          <Center>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Show below={"lg"}>
                  <FontAwesomeIcon icon={faRightToBracket} />
                </Show>
                <Hide below={"lg"}>로그인</Hide>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate("/login")}>
                  <FontAwesomeIcon icon={faRightToBracket} />
                  <Box ml={2}>로그인</Box>
                </MenuItem>
                <MenuItem onClick={() => navigate("/signup")}>
                  <FontAwesomeIcon icon={faUserPlus} />
                  <Box ml={2}>회원가입</Box>
                </MenuItem>
              </MenuList>
            </Menu>
          </Center>
        )}

        <Center
          ml={4}
          cursor={"pointer"}
          onClick={() => navigate("/board/list")}
          _hover={{ bgColor: "rgba(255, 255, 255, 0.5)" }}
          p={6}
          fontSize={20}
          fontWeight={600}
          color={"white"}
        >
          게시판
        </Center>

        <Center
          ml={4}
          cursor={"pointer"}
          onClick={() => navigate("/tour/list")}
          _hover={{ bgColor: "rgba(255, 255, 255, 0.5)" }}
          p={6}
          fontSize={20}
          fontWeight={600}
          color={"white"}
        >
          추천코스
        </Center>

        <Center
          ml={4}
          cursor={"pointer"}
          onClick={() => navigate("/itinerary")}
          _hover={{ bgColor: "rgba(255, 255, 255, 0.5)" }}
          p={6}
          fontSize={20}
          fontWeight={600}
          color={"white"}
        >
          일정관리
        </Center>
      </Flex>
    </Box>
  );
}
