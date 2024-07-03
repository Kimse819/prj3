import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ReviewComponent } from "../../component/review/ReviewComponent.jsx";
import { Map, MapMarker } from "react-kakao-maps-sdk";

export function TourDetail() {
  const { id } = useParams();
  const [info, setInfo] = useState([]);
  const [introInfo, setIntroInfo] = useState(null);
  const [info2, setInfo2] = useState(null);
  const [images, setImages] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showBtnMore, setShowBtnMore] = useState(false);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState("");

  const overviewRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/api/tour/${id}`)
      .then((res) => {
        setInfo(res.data.info1);
        setSelectedImage(res.data.info1.firstImage1);
        function handleResize() {
          if (overviewRef.current) {
            const overviewHeight = overviewRef.current.clientHeight;
            setShowBtnMore(overviewHeight > 96);
          }
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      })
      .catch(() => {});

    axios
      .get(`/api/tour/${id}/info2`)
      .then((res) => {
        setInfo2(res.data);
      })
      .catch();

    axios
      .get(`/api/tour/${id}/intro`)
      .then((res) => {
        setIntroInfo(res.data);
      })
      .catch();

    axios
      .get(`/api/tour/${id}/image`)
      .then((res) => {
        setImages(res.data);
      })
      .catch();
  }, [id]);

  if (info && info.length === 0) {
    return <Spinner />;
  }

  function handleToggleShow() {
    setShowAll(!showAll);
  }

  function handleImageClick(imageUrl) {
    setSelectedImage(imageUrl);
  }

  return (
    <Box
      mt="30px"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={5}
      bg="white"
      mx={{
        base: 4,
        lg: 100,
      }}
      boxShadow="lg"
    >
      <Heading size="lg" mb={6} color="teal.700">
        {info.title}
      </Heading>
      <Box
        mb={6}
        boxShadow="md"
        borderRadius="lg"
        overflow="hidden"
        height={{ base: "400px", md: "500px", lg: "500px" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          src={selectedImage}
          borderRadius="lg"
          height="100%"
          width="100%"
          objectFit="contain"
          transition="transform 0.3s"
          _hover={{ transform: "scale(1.05)" }}
        />
      </Box>

      {/* 작은 이미지 */}
      <Flex wrap="wrap" justify="center" mb={6}>
        <Image
          src={info.firstImage1}
          boxSize="100px"
          objectFit="cover"
          m={2}
          cursor="pointer"
          onClick={() => handleImageClick(info.firstImage1)}
          _hover={{
            shadow: "lg",
            transform: "scale(1.05)",
            transition: "0.3s",
          }}
        />
        {images.map((item) => (
          <Image
            key={item.id}
            src={item.smallUrl}
            boxSize="100px"
            objectFit="cover"
            m={2}
            cursor="pointer"
            onClick={() => handleImageClick(item.originalUrl)}
            _hover={{
              shadow: "lg",
              transform: "scale(1.05)",
              transition: "0.3s",
            }}
          />
        ))}
      </Flex>

      <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
        <Heading size="md" mb={4} color="teal.700">
          개요
        </Heading>
        <Box whiteSpace="pre-wrap" lineHeight="tall">
          <Collapse startingHeight={"7em"} in={showAll}>
            <Box
              ref={overviewRef}
              dangerouslySetInnerHTML={{ __html: info.overview }}
            ></Box>
          </Collapse>
        </Box>
        {showBtnMore && (
          <Flex justifyContent="flex-end">
            <Button
              variant="link"
              colorScheme="teal"
              size="sm"
              onClick={handleToggleShow}
            >
              {showAll ? "접기" : "..더보기"}
            </Button>
          </Flex>
        )}
      </Box>
      <Divider mb={6} />
      <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
        <Heading size="md" mb={4} color="teal.700">
          정보
        </Heading>
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Th>우편번호</Th>
              <Td>{info.zipcode}</Td>
            </Tr>
            <Tr>
              <Th>주소</Th>
              <Td>{info.address}</Td>
            </Tr>
            {info.tel !== null && info.tel !== "" && (
              <Tr>
                <Th>전화번호</Th>
                <Td>{info.tel}</Td>
              </Tr>
            )}
            {info.homepage !== null && info.homepage !== "" && (
              <Tr>
                <Th>홈페이지</Th>
                <Td dangerouslySetInnerHTML={{ __html: info.homepage }}></Td>
              </Tr>
            )}
            <Tr>
              <Th>위치</Th>
              <Td>
                <Button onClick={onOpen} size={"sm"} colorScheme={"blue"}>
                  지도열기
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>지도</ModalHeader>
            <ModalBody align={"center"}>
              <Map
                center={{ lat: info.mapy, lng: info.mapx }}
                style={{
                  width: "400px",
                  height: "350px",
                  border: "1px solid black",
                  borderRadius: "10px",
                }}
                level={6}
              >
                <MapMarker
                  style={{ border: "transparent" }}
                  position={{ lat: info.mapy, lng: info.mapx }}
                ></MapMarker>
              </Map>
            </ModalBody>
            <ModalFooter>
              <Button mr={1} colorScheme={"red"} onClick={onClose}>
                닫기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      {introInfo !== null && introInfo.length > 0 && (
        <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4} color="teal.700">
            소개정보
          </Heading>
          <Table variant="simple">
            <Tbody>
              {introInfo.map((item) => (
                <Tr key={item.number}>
                  <Th>{item.infoName}</Th>
                  <Td>
                    <Text dangerouslySetInnerHTML={{ __html: item.infoText }} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      {info2 !== null && info2.length > 0 && (
        <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4} color="teal.700">
            상세정보
          </Heading>
          <Table variant="simple">
            <Tbody>
              {info2.map((item) => (
                <Tr key={item.number}>
                  <Th>{item.infoName}</Th>
                  <Td>
                    {item.infoName === "객실사진" &&
                    item.infoText.trim().length > 0 ? (
                      item.infoText
                        .split(",")
                        .map((imgUrl, index) => (
                          <Image
                            key={index}
                            src={imgUrl.trim()}
                            borderRadius="lg"
                            boxShadow="md"
                            maxHeight="200px"
                            objectFit="cover"
                            transition="transform 0.3s"
                            _hover={{ transform: "scale(1.05)" }}
                          />
                        ))
                    ) : (
                      <Text
                        dangerouslySetInnerHTML={{ __html: item.infoText }}
                      />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      <Divider mb={6} />
      <Box mb={6}>
        <Heading size="md" mb={4} color="teal.700"></Heading>
        <ReviewComponent contentId={info.id} />
      </Box>
    </Box>
  );
}

export default TourDetail;
