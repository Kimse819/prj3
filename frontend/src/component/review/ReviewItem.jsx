import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../LoginProvider.jsx";

export function ReviewItem({ review, isSending, setIsSending, StarIcon }) {
  const account = useContext(LoginContext);

  function handleClickRemove() {
    setIsSending(true);
    axios
      .delete(`/api/tour/remove/review`, { data: { id: review.id } })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setIsSending(false);
      });
  }

  return (
    <Box key={review.id} my={3}>
      <Flex>
        <Box>{review.nickName}</Box>
        <Spacer />
        <Box>{review.inserted}</Box>
      </Flex>
      <Flex alignItems="center">
        {[0, 1, 2, 3, 4].map((index) => (
          <StarIcon key={index} index={index} rating={review.rating} />
        ))}
        <Text ml={1}>{review.rating}</Text>
      </Flex>
      <Flex>
        <Box>{review.review}</Box>
        <Spacer />
        {account.hasAccess(review.memberId) && (
          <Box>
            <Button size="sm" colorScheme="green">
              수정
            </Button>
            <Button
              onClick={handleClickRemove}
              colorScheme="red"
              size="sm"
              isSending={isSending}
            >
              삭제
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
