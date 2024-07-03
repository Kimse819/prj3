import React, { useEffect, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Home() {
  const [contents1, setContents1] = useState([]);
  const [contents2, setContents2] = useState([]);
  const [contents2Area, setContents2Area] = useState("");
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const navigate = useNavigate();

  const EventCard = ({ event, onClick }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ shadow: "lg", transform: "scale(1.05)", transition: "0.3s" }}
      onClick={() => onClick(event.id)}
      cursor="pointer"
      bg="white"
    >
      <AspectRatio ratio={16 / 9}>
        <Image src={event.imageUrl} alt={event.title} />
      </AspectRatio>
      <Box p={4}>
        <Heading as="h3" size="md" color="teal.600">
          {event.title}
        </Heading>
        <Text mt={2} color="gray.600">
          {event.description}
        </Text>
      </Box>
    </Box>
  );

  const TravelCard = ({ imageSrc, title, description, id, rating }) => (
    <Box
      cursor="pointer"
      onClick={() => navigate(`/tour/${id}`)}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ shadow: "lg", transform: "scale(1.05)", transition: "0.3s" }}
      mx={5}
      bg="white"
    >
      <AspectRatio ratio={16 / 9}>
        <Image src={imageSrc} alt={title} />
      </AspectRatio>
      <Box p={4}>
        <Flex>
          <Heading as="h3" size="md" color="teal.600">
            {title}
          </Heading>
          {rating && (
            <Text ml={2} fontSize={"sm"} color="teal.600" fontWeight="bold">
              (<FontAwesomeIcon icon={faStar} size="sm" color="orange" />{" "}
              {rating})
            </Text>
          )}
        </Flex>

        <Collapse startingHeight={"8em"}>
          <Text
            mt={2}
            color="gray.600"
            overflow={"hidden"}
            dangerouslySetInnerHTML={{ __html: description }}
          ></Text>
        </Collapse>
      </Box>
    </Box>
  );

  useEffect(() => {
    axios.get("/api/home/contents/popular").then((res) => {
      setContents1(res.data);
    });
    axios.get("/api/home/contents/area").then((res) => {
      const data = res.data;
      setContents2(data);
      let area = data[0].areaName;
      if (area === "전북특별자치도") {
        area = "전라북도";
      }
      if (area === "강원특별자치도") {
        area = "강원도";
      }
      if (area === "세종특별자치시") {
        area = "세종";
      }
      setContents2Area(area);
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const largeSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const events = [
    {
      id: 1,
      title: "광화문 관람 패키지",
      description: "판매가 : 550,000~",
      imageUrl: "/image/event-image.png",
    },
    {
      id: 2,
      title: "경주 여행 패키지",
      description: "판매가 : 700,000",
      imageUrl: "/image/event-image2.jpg",
    },
    {
      id: 3,
      title: "광명동굴 패키지",
      description: "판매가 : 400,000",
      imageUrl: "/image/event-image3.jpg",
    },
  ];

  const stories = [
    {
      id: 1,
      title: "북촌한옥마을",
      imageUrl: "/image/slider-image1.jpg",
      description: "북촌한옥마을에 대한 설명입니다.",
    },
    {
      id: 2,
      title: "흥인지문",
      imageUrl: "/image/slider-image2.png",
      description: "스토리 2에 대한 설명입니다.",
    },
    {
      id: 3,
      title: "별마당도서관",
      imageUrl: "/image/slider-image3.jpg",
      description: "스토리 3에 대한 설명입니다.",
    },
    {
      id: 4,
      title: "스토리 4",
      imageUrl: "/image/slider-image4.jpg",
      description: "스토리 4에 대한 설명입니다.",
    },
    {
      id: 5,
      title: "스토리 5",
      imageUrl: "/image/slider-image5.jpg",
      description: "스토리 5에 대한 설명입니다.",
    },
    {
      id: 6,
      title: "스토리 6",
      imageUrl: "/image/slider-image6.jpg",
      description: "스토리 6에 대한 설명입니다.",
    },
  ];

  const handleEventClick = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    setSelectedEvent(event);
  };

  const handleStoryClick = (storyId) => {
    navigate(`/board/${storyId}`);
  };

  const handleBannerClick = () => {
    navigate("/event");
  };

  return (
    <Box mt={10} bg="gray.50" p={4}>
      <VStack spacing={10} align="stretch">
        <Box>
          <Heading as="h2" size="xl" mb={4} ml={5} color="teal.700">
            요즘 뜨는 장소
          </Heading>
          <Slider {...largeSettings}>
            {contents1.map((item, index) => (
              <TravelCard
                key={index}
                id={item.id}
                imageSrc={item.firstImage1}
                title={item.title}
                rating={item.rating.toFixed(1)}
                description={item.overview ? item.overview : "설명(추가예정)"}
              />
            ))}
          </Slider>
        </Box>
        <Divider />

        <Box>
          <Heading as="h2" size="xl" mb={4} ml={5} color="teal.700">
            {contents2Area} 추천 여행지
          </Heading>
          <Slider {...largeSettings}>
            {contents2.map((item, index) => (
              <TravelCard
                key={index}
                id={item.id}
                imageSrc={item.firstImage1}
                title={item.title}
                description={item.overview}
              />
            ))}
          </Slider>
        </Box>
        <Divider />

        <Box>
          <Heading as="h2" size="xl" mb={4} ml={5} color="teal.700">
            스토리
          </Heading>
          <Slider {...settings}>
            {stories.map((story) => (
              <Box
                key={story.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                cursor="pointer"
                onClick={() => handleStoryClick(story.id)}
                _hover={{
                  shadow: "lg",
                  transform: "scale(1.05)",
                  transition: "0.3s",
                }}
                mx={2}
              >
                <AspectRatio ratio={16 / 9}>
                  <Image src={story.imageUrl} alt={story.title} />
                </AspectRatio>
                <Box p={4}>
                  <Heading as="h3" size="md" color="teal.600">
                    {story.title}
                  </Heading>
                  <Text mt={2} color="gray.600">
                    {story.description}
                  </Text>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
        <Divider />

        {/* Banner Section */}
        <Center w="100%">
          <Box
            w={{ base: "100%", md: "80%", lg: "1500px" }}
            mt={8}
            p={6}
            bgImage="url('/image/banner-image.jpg')"
            bgSize="cover"
            bgPosition="center"
            borderRadius="lg"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
            color="white"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Heading as="h2" size="lg">
                (예정)
              </Heading>
              <Button colorScheme="teal" size="lg" onClick={handleBannerClick}>
                More
              </Button>
            </VStack>
          </Box>
        </Center>

        {/* Banner Section2 */}
        <Center w="100%">
          <Box
            w={{ base: "100%", md: "80%", lg: "1500px" }}
            mt={8}
            p={6}
            bgImage="url('/image/baner-image2.png')"
            bgSize="cover"
            bgPosition="center"
            borderRadius="lg"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
            color="white"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Heading as="h2" size="lg">
                (예정)
              </Heading>
              <Button colorScheme="teal" size="lg" onClick={handleBannerClick}>
                More
              </Button>
            </VStack>
          </Box>
        </Center>
      </VStack>

      <Box mt={8}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Home;
