import { Box, Container, Heading } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";
import React, { useState } from "react";

export function CommentComponent({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Container
      maxW="container.md"
      bg="white"
      p={6}
      borderRadius="md"
      boxShadow="md"
    >
      <Box mb={7}>
        <Heading mb={6} fontSize="2xl" fontWeight="bold" color={"teal"}>
          댓글
        </Heading>
      </Box>
      <Box mb={7}>
        <CommentWrite
          boardId={boardId}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </Box>

      <CommentList
        boardId={boardId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Container>
  );
}
