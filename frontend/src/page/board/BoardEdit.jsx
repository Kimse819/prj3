import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function BoardEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [touristSpot, setTouristSpot] = useState("");
  const [schedule, setSchedule] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
      setTouristSpot(res.data.touristSpot);
      setSchedule(res.data.schedule);
    });
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("touristSpot", touristSpot);
    formData.append("schedule", schedule);

    try {
      await axios.put(`/api/board/${id}`, formData);
      toast({
        title: "게시글이 성공적으로 수정되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/board/${id}`);
    } catch (error) {
      toast({
        title: "게시글 수정에 실패했습니다.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="lg"
      mx="auto"
      mt={8}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <Heading as="h1" size="lg" textAlign="center" mb={6} color="deepskyblue">
        게시글 수정
      </Heading>
      <VStack as="form" spacing={5} onSubmit={handleSubmit}>
        <FormControl id="title" isRequired>
          <FormLabel>제목</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </FormControl>
        <FormControl id="content" isRequired>
          <FormLabel>내용</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </FormControl>
        <FormControl id="image">
          <FormLabel>사진 첨부</FormLabel>
          <Input type="file" onChange={handleImageChange} />
        </FormControl>
        <FormControl id="touristSpot">
          <FormLabel>관광지 첨부</FormLabel>
          <Input
            value={touristSpot}
            onChange={(e) => setTouristSpot(e.target.value)}
            placeholder="관광지 이름을 입력하세요"
          />
        </FormControl>
        <FormControl id="schedule">
          <FormLabel>일정 첨부</FormLabel>
          <Input
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="일정을 입력하세요"
          />
        </FormControl>
        <Button colorScheme="blue" size="lg" width="full" type="submit">
          수정
        </Button>
      </VStack>
    </Box>
  );
}
