import React, { useContext, useRef, useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();
  const editorRef = useRef(null);
  const [images, setImages] = useState([]);

  function updateContent() {
    setContent(editorRef.current.innerHTML);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = document.createElement("img");
        image.src = event.target.result;
        setImages((prev) => [...prev, event.target.result]);
        image.style.maxHeight = "100%";
        image.style.maxWidth = "100%";
        image.style.marginTop = "10px";
        image.style.borderRadius = "8px";
        editorRef.current.appendChild(image);
        updateContent();
      };
      reader.readAsDataURL(file);
    }
  }

  function handleClickSave() {
    if (!title || !content) {
      toast({
        title: "제목과 내용을 입력해주세요.",
        status: "warning",
        position: "top",
        duration: 2000,
      });
      return;
    }
    let updatedContent = content;
    if (images.length > 0) {
      images.forEach((item, index) => {
        updatedContent = updatedContent.replace(
          images[index],
          files[index].name,
        );
      });
    }
    axios
      .postForm("/api/board/add", {
        title: title,
        content: updatedContent,
        files: files,
      })
      .then(() => {
        toast({
          description: "새 글이 등록되었습니다.",
          status: "success",
          position: "top",
        });
        navigate("/board/list");
      })
      .catch(() => {
        toast({
          title: "저장 중 오류가 발생했습니다.",
          status: "error",
          position: "top",
          duration: 2000,
        });
      });
  }

  function removeFile(index) {
    setFiles(files.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
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
          글쓰기
        </Heading>
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel fontWeight="bold">제목</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              bg="gray.100"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold">작성자</FormLabel>
            <Input readOnly value={account.nickName} />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold">내용</FormLabel>
            <Box
              mt={2}
              h="400px"
              p={4}
              borderWidth={1}
              borderRadius={4}
              outlineColor="#3182ce"
              bg="gray.100"
              ref={editorRef}
              _placeholder="내용"
              contentEditable={true}
              overflowY={"scroll"}
              onInput={updateContent}
            ></Box>
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold">파일</FormLabel>
            <Input
              multiple
              type="file"
              accept="image/*"
              cursor={"pointer"}
              onChange={(e) => {
                handleFileChange(e);
                setFiles((prev) => [...prev, ...e.target.files]);
              }}
            />
            <FormHelperText>
              총 용량은 20MB, 한 파일은 10MB를 초과할 수 없습니다!
            </FormHelperText>
          </FormControl>
          {files.length > 0 && (
            <Box width="100%">
              <Heading size="sm" mt={4} mb={2}>
                첨부 파일
              </Heading>
              <VStack spacing={2} align="stretch">
                {files.map((file, index) => (
                  <HStack key={index} justifyContent="space-between">
                    <Box>{file.name}</Box>
                    <IconButton
                      size="sm"
                      icon={<CloseIcon />}
                      onClick={() => removeFile(index)}
                    />
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}
          <Center gap={2} mt={6}>
            <Button
              colorScheme="blue"
              onClick={handleClickSave}
              alignSelf="center"
            >
              저장
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => navigate(`/board/list`)}
              alignSelf="center"
            >
              목록
            </Button>
          </Center>
        </VStack>
      </Container>
    </Box>
  );
}

export default BoardWrite;
