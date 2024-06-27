import {
  Box,
  Button,
  Collapse,
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
  const [showAll, setShowAll] = useState(false);
  const [showBtnMore, setShowBtnMore] = useState(false);
  const { onClose, onOpen, isOpen } = useDisclosure();

  const overviewRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/api/tour/${id}`)
      .then((res) => {
        setInfo(res.data.info1);
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
  }, [info.overview]);

  useEffect(() => {}, []);

  if (info && info.length === 0) {
    return <Spinner />;
  }

  function handleToggleShow() {
    setShowAll(!showAll);
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
        Detail
      </Heading>
      <Box mb={6}>
        <Image
          src={info.firstImage1}
          borderRadius="lg"
          boxShadow="md"
          maxHeight="400px"
          objectFit="cover"
          width="100%"
        />
      </Box>
      <Box mb={6}>
        <Heading size="md" mb={4} color="teal.700">
          설명
        </Heading>
        <Box whiteSpace="pre-wrap" lineHeight="tall">
          <Collapse startingHeight={"6em"} in={showAll}>
            <div ref={overviewRef}>{info.overview}</div>
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
      <Box mb={6}>
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
            <Tr>
              <Th>전화번호</Th>
              <Td>{info.tel}</Td>
            </Tr>
            <Tr>
              <Th>홈페이지</Th>
              <Td dangerouslySetInnerHTML={{ __html: info.homepage }}></Td>
            </Tr>
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
      {introInfo !== null && (
        <Box mb={6}>
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
      {info2 !== null && (
        <Box mb={6}>
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
                      item.infoText.split(",").map((imgUrl, index) => (
                        <Image key={index} src={imgUrl.trim()} />
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
      <Box mb={6}>
        <Heading size="md" mb={4} color="teal.700">
          리뷰
        </Heading>
        <ReviewComponent contentId={info.id} />
      </Box>
    </Box>
  );
}

export default TourDetail;
