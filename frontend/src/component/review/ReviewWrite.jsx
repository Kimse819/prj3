import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export function ReviewWrite({ contentId, isSending, setIsSending }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const toast = useToast();

  function handleClickReviewSubmit() {
    setIsSending(true);
    axios
      .post("/api/tour/add/review", {
        contentId,
        review,
        rating,
      })
      .then((res) => {
        setReview("");
        toast({
          description: "리뷰가 등록되었습니다.",
          status: "success",
          position: "top",
        });
      })
      .catch()
      .finally(() => {
        setReview("");
        setIsSending(false);
      });
  }

  function printStars(index) {
    const stars = [];
    for (let i = 0; i < index; i++) {
      stars.push(<FontAwesomeIcon icon={faStar} color={"orange"} />);
    }
    return stars;
  }

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading as="h3" size="lg" mb={4} textAlign="center" color="teal.500">
        리뷰 작성란
      </Heading>
      <Flex direction="column" mb={4}>
        <RadioGroup defaultValue="5" onChange={setRating}>
          <Stack spacing={4} direction="row" justify="center">
            {[1, 2, 3, 4, 5].map((index) => (
              <Radio
                key={index}
                value={index.toString()}
                size="lg"
                colorScheme="teal"
              >
                {printStars(index)}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Flex>
      <Flex direction="column">
        <Textarea
          onChange={(e) => setReview(e.target.value)}
          placeholder="리뷰를 작성해주세요"
          value={review}
          mb={4}
          bg="gray.50"
          borderColor="teal.500"
          _focus={{ borderColor: "teal.600" }}
          size="lg"
          minHeight="170px" //텍스트 영역의 최소 높이를 설정
          resize="vertical" //사용자가 세로 방향으로만 크기를 조절가능
        />
        <Button
          onClick={handleClickReviewSubmit}
          isLoading={isSending}
          isDisabled={review.trim().length === 0}
          alignSelf="center"
          colorScheme="teal"
          size="lg"
          px={8}
        >
          등록
        </Button>
      </Flex>
    </Box>
  );
}
