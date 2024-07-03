import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { CommentComponent } from "../../component/comment/CommentComponent.jsx";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        const data = res.data.board;
        const files = data.fileList;
        if (files) {
          let newContent = data.content;

          for (let i = 0; i < files.length; i++) {
            newContent = newContent.replaceAll(
              data.fileList[i].name,
              data.fileList[i].src,
            );
          }
          data.content = newContent;
        }
        setBoard(res.data.board);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "게시물이 존재하지 않습니다.",
            position: "top",
          });
          navigate("/board/list");
        }
      });
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete(`/api/board/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        toast({
          status: "success",
          description: `게시물이 삭제되었습니다.`,
          position: "top",
        });
        navigate("/board/list");
      })
      .catch(() => {
        toast({
          status: "error",
          description: `게시물 삭제 중 오류가 발생하였습니다.`,
          position: "top",
        });
      })
      .finally(() => {
        onClose();
      });
  }

  return (
    <Box py={8} px={4} minH="100vh" bg="gray.50">
      <Container
        maxW="container.md"
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="md"
      >
        <Heading
          mb={6}
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
          color={"teal"}
        >
          게시판
        </Heading>
        <VStack spacing={6} align="stretch">
          <Box>
            <FormControl>
              <FormLabel fontWeight="bold">제목</FormLabel>
              <Input readOnly value={board.title} />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontWeight="bold">작성자</FormLabel>
              <Input readOnly value={board.writer} />
            </FormControl>
          </Box>
          <Box>
            <FormControl>작성일시</FormControl>
            <Input type={"datetime-local"} value={board.inserted} readOnly />
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontWeight="bold">본문</FormLabel>
              <Box
                mt={2}
                minH="500px"
                px={5}
                py={4}
                borderRadius={5}
                outlineColor="#3182ce"
                border="1px solid #E5EAF1"
                dangerouslySetInnerHTML={{ __html: board.content }}
              ></Box>
            </FormControl>
          </Box>
          {/*<Box>*/}
          {/*  {board.fileList &&*/}
          {/*    board.fileList.map((file) => (*/}
          {/*      <Card m={3} key={file.name}>*/}
          {/*        <CardBody>*/}
          {/*          <Image w={"100%"} src={file.src} />*/}
          {/*        </CardBody>*/}
          {/*      </Card>*/}
          {/*    ))}*/}
          {/*</Box>*/}
          {account.hasAccess(board.memberId) && (
            <Center gap={2}>
              <Button
                onClick={() => navigate(`/board/edit/${board.id}`)}
                colorScheme="blue"
                alignSelf="center"
              >
                수정
              </Button>
              <Button onClick={onOpen} colorScheme="red" alignSelf="center">
                삭제
              </Button>
            </Center>
          )}
        </VStack>
      </Container>

      <Box mb={20}></Box>

      <CommentComponent boardId={board.id} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제</ModalHeader>
          <ModalBody>삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={onClose}>취소</Button>
              <Button colorScheme={"red"} onClick={handleDelete}>
                확인
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
