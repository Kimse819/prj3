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
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast({
            status: "warning",
            description: "로그인 후 이용해주세요.",
            position: "top",
          });
          navigate("/login");
        }
      })
      .finally();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Center mt={10}>
        <Button colorScheme="blue" onClick={() => navigate(`/itinerary/new`)}>
          새 일정
        </Button>
      </Center>
      <Center>
        <Table
          maxW={1000}
          mt={8}
          p={4}
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
        >
          <Thead>
            <Tr>
              <Th>여행일자</Th>
              <Th>여행제목</Th>
              <Th>저장일시</Th>
            </Tr>
          </Thead>
          <Tbody>
            {itinerary.map((item, index) => (
              <Tr key={index}>
                <Td>
                  {item.startDate} ~ {item.endDate}
                </Td>
                <Td>
                  <Text
                    onClick={() => navigate(`/itinerary/${item.id}`)}
                    cursor="pointer"
                  >
                    {item.name}
                  </Text>
                </Td>
                <Td>{moment(item.inserted).format("YYYY-MM-DD HH:MM:SS")}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Center>
    </Box>
  );
}
