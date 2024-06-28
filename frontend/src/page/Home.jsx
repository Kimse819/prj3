import React, { useEffect, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

export function Home() {
  const [contents1, setContents1] = useState([]);
  const [contents2, setContents2] = useState([]);
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

  const TravelCard = ({ imageSrc, title, description, id }) => (
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
        <Heading as="h3" size="md" color="teal.600">
          {title}
        </Heading>
        <Text mt={2} color="gray.600">
          {description}
        </Text>
      </Box>
    </Box>
  );

  const ReviewCard = ({ title, description }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ shadow: "lg", transform: "scale(1.05)", transition: "0.3s" }}
      mx={5}
      bg="white"
    >
      <Box p={4}>
        <Heading as="h3" size="md" color="teal.600">
          {title}
        </Heading>
        <Text mt={2} color="gray.600">
          {description}
        </Text>
      </Box>
    </Box>
  );

  useEffect(() => {
    axios.get("/api/home/contents").then((res) => {
      setContents1(res.data);
    });
    axios.get("/api/home/contents").then((res) => {
      setContents2(res.data);
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

  const events = [
    {
      id: 1,
      title: "이벤트 제목 1",
      description: "이벤트 내용 1",
      imageUrl: "/image/event1.jpg",
    },
    {
      id: 2,
      title: "이벤트 제목 2",
      description: "이벤트 내용 2",
      imageUrl: "/image/event2.jpg",
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
    const story = stories.find((s) => s.id === storyId);
    setSelectedStory(story);
  };

  return (
    <Box mt={10} bg="gray.50" p={4}>
      <VStack spacing={10} align="stretch">
        <Box>
          <Heading as="h2" size="xl" mb={4} ml={5} color="teal.700">
            가볼만한곳
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {contents1.map((item, index) => (
              <TravelCard
                key={index}
                id={item.id}
                imageSrc={item.firstImage1}
                title={item.title}
                description={item.overview ? item.overview : "설명(추가예정)"}
              />
            ))}
          </SimpleGrid>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="xl" mb={4} ml={5} color="teal.700">
            추천 여행지
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {contents2.map((item, index) => (
              <TravelCard
                key={index}
                id={item.id}
                imageSrc={item.firstImage1}
                title={item.title}
                description={item.areaName}
              />
            ))}
          </SimpleGrid>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="xl" mb={4} ml={5} color="teal.700">
            최근 리뷰
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <ReviewCard title="리뷰 1" description="리뷰 내용 1" />
            <ReviewCard title="리뷰 2" description="리뷰 내용 2" />
            <ReviewCard title="리뷰 3" description="리뷰 내용 3" />
          </SimpleGrid>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="xl" mb={4} ml={5} color="teal.700">
            스토리
          </Heading>
          {selectedStory ? (
            <Box p={4} bg="white" borderRadius="lg" boxShadow="lg">
              <Button mb={4} onClick={() => setSelectedStory(null)}>
                뒤로가기
              </Button>
              <AspectRatio ratio={16 / 9}>
                <Image src={selectedStory.imageUrl} alt={selectedStory.title} />
              </AspectRatio>
              <Box mt={4}>
                <Heading as="h3" size="lg" color="teal.700">
                  {selectedStory.title}
                </Heading>
                <Text mt={2} color="gray.600">
                  {selectedStory.description}
                </Text>
              </Box>
            </Box>
          ) : (
            <Slider {...settings}>
              {stories.map((story) => (
                <Box
                  key={story.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="white"
                  mx={2} // Margin between slides
                  cursor="pointer"
                  onClick={() => handleStoryClick(story.id)}
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
          )}
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="xl" mb={4} ml={5} color="teal.700">
            이벤트
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </SimpleGrid>

          {selectedEvent && (
            <Box mt={8} p={4} borderWidth="1px" borderRadius="lg" bg="white">
              <Center mb={4}>
                <Image src={selectedEvent.imageUrl} alt={selectedEvent.title} />
              </Center>
              <Heading as="h3" size="lg" mb={2} color="teal.700">
                {selectedEvent.title}
              </Heading>
              <Text mb={4} color="gray.600">
                {selectedEvent.description}
              </Text>
              <Button onClick={() => setSelectedEvent(null)} colorScheme="teal">
                뒤로가기
              </Button>
            </Box>
          )}
        </Box>
      </VStack>

      <Box mt={8}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Home;
