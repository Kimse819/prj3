import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Calendar from "react-calendar";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export function ItineraryDate() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const mode = useColorModeValue("white", "gray.700");

  const start =
    startDate !== null ? moment(startDate).format("YYYY-MM-DD") : "";
  const end = endDate !== null ? moment(endDate).format("YYYY-MM-DD") : "";

  const navigate = useNavigate();
  const toast = useToast();
  const inputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        status: "warning",
        description: "로그인 후 이용해주세요.",
        position: "top",
      });
      navigate(`/login`);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (endDate) {
      inputRef.current.focus();
    }
  }, [endDate]);

  const handleDateChange = (date) => {
    if (date.length === 2) {
      setStartDate(date[0]);
      setEndDate(date[1]);
    } else {
      setStartDate(date);
    }
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      handleClickNext();
    }
  };

  const handleClickNext = () => {
    navigate(`/itinerary/detail`, { state: { startDate, endDate, name } });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={8}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg={mode}
    >
      <Heading textAlign="center">새 일정</Heading>
      <Text textAlign="center" fontWeight="bold" mt={2}>
        여행 날짜를 설정하세요
      </Text>
      <Divider my={6} />
      <VStack spacing={6}>
        <Calendar
          onChange={handleDateChange}
          value={startDate && endDate ? [startDate, endDate] : startDate}
          selectRange={true}
        />
        <Stack spacing={4} width="100%">
          <Box>
            <Text>시작일: {start}</Text>
            <Text>종료일: {end}</Text>
          </Box>
          {endDate && (
            <Box>
              <Text>여행 제목을 입력하세요</Text>
              <Input
                mt={2}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handlePressEnter}
                ref={inputRef}
                placeholder="여행 제목"
                size="lg"
              />
            </Box>
          )}
        </Stack>
        <Button
          isDisabled={!endDate || !name}
          colorScheme="blue"
          onClick={handleClickNext}
          width="100%"
        >
          다음
        </Button>
      </VStack>
    </Box>
  );
}
