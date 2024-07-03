import {
  Box,
  Button,
  Center,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

export function ItineraryList() {
  const [itinerary, setItinerary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/itinerary/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setItinerary(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          toast({
            status: "warning",
            description: "로그인 후 이용해주세요.",
            position: "top",
          });
          navigate("/login");
        } else {
          toast({
            status: "error",
            description: "일정을 불러오는 중 오류가 발생했습니다.",
            position: "top",
          });
        }
        setIsLoading(false);
      });
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" p={4} mt={8}>
      <Center mb={8}>
        <Button colorScheme="blue" onClick={() => navigate(`/itinerary/new`)}>
          새 일정
        </Button>
      </Center>
      <Center>
        <Table
          w="100%"
          maxW="1000px"
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
          overflow="hidden"
        >
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">여행일자</Th>
              <Th textAlign="center">여행제목</Th>
              <Th textAlign="center">저장일시</Th>
            </Tr>
          </Thead>
          <Tbody>
            {itinerary.map((item, index) => (
              <Tr key={index}>
                <Td textAlign="center">
                  {item.startDate} ~ {item.endDate}
                </Td>
                <Td textAlign="center">
                  <Text
                    onClick={() => navigate(`/itinerary/${item.id}`)}
                    cursor="pointer"
                    color="blue.500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    {item.name}
                  </Text>
                </Td>
                <Td textAlign="center">
                  {moment(item.inserted).format("YYYY-MM-DD HH:mm:ss")}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Center>
    </Box>
  );
}
