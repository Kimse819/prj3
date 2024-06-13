import { Box, Button, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function TourSearch() {
  const [area, setArea] = useState([]);
  const [areaCodes, setAreaCodes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const serviceKey = import.meta.env.VITE_API_TOUR_SERVICE_KEY1;

  useEffect(() => {
    setIsProcessing(true);
    axios
      .get(`https://apis.data.go.kr/B551011/KorService1/areaCode1`, {
        params: {
          serviceKey: serviceKey,
          MobileOS: "ETC",
          MobileApp: "AppTest",
          _type: "json",
          numOfRows: 100,
          pageNo: 1,
          // areaCode: 1,
        },
      })
      .then((res) => {
        const data = res.data.response.body.items.item;
        setArea(
          data.map((item) => ({
            areaCode: item.code,
            name: item.name,
          })),
        );
      })
      .catch(() => console.log("get error"))
      .finally(() => {
        setIsProcessing(false);
      });
  }, []);

  if (isProcessing) {
    return <Spinner />;
  }

  function handleAddArea() {
    axios
      .post("/api/tour/add/area", area)
      .then(() => console.log("success"))
      .catch(() => console.log("add error"));
  }

  function handleGetAreaCodes() {
    axios
      .get("/api/tour/get/area")
      .then((res) => {
        setAreaCodes(res.data);
        console.log("get");
      })
      .catch(() => console.log("add error1"))
      .finally();
  }

  async function handleAddSigungu() {
    for (const areaCode of areaCodes) {
      setIsProcessing(true);
      await axios
        .get(`https://apis.data.go.kr/B551011/KorService1/areaCode1`, {
          params: {
            serviceKey: serviceKey,
            MobileOS: "ETC",
            MobileApp: "AppTest",
            _type: "json",
            numOfRows: 100,
            pageNo: 1,
            areaCode: areaCode,
          },
        })
        .then(async (res) => {
          const data = res.data.response.body.items.item;
          const sigungu = data.map((item) => ({
            areaCode: areaCode,
            sigunguCode: item.code,
            name: item.name,
          }));
          await axios
            .post("/api/tour/add/sigungu", sigungu)
            .then(() => console.log("succeeded post sigungu"))
            .catch(() => {
              console.log("sigungu post error");
            });
        })
        .catch(() => console.log("get error"))
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }

  function handleAddCat1() {
    axios
      .get(`https://apis.data.go.kr/B551011/KorService1/categoryCode1`, {
        params: {
          serviceKey: serviceKey,
          MobileOS: "ETC",
          MobileApp: "AppTest",
          _type: "json",
          numOfRows: 50,
          pageNo: 1,
        },
      })
      .then((res) => {
        const data = res.data.response.body.items.item;
        const category1 = data.map((item) => ({
          cat1: item.code,
          name: item.name,
        }));
        axios.post("/api/tour/add/cat1", category1);
      })
      .catch();
  }

  function handleAddCat2() {
    axios
      .get("/api/tour/get/cat1")
      .then((res) => {
        const category1 = res.data;
        // console.log("p5");
        // console.log(category1);
        for (const cat1 of category1) {
          setIsProcessing(true);
          // console.log("p4");
          axios
            .get(`https://apis.data.go.kr/B551011/KorService1/categoryCode1`, {
              params: {
                serviceKey: serviceKey,
                MobileOS: "ETC",
                MobileApp: "AppTest",
                _type: "json",
                numOfRows: 50,
                pageNo: 1,
                cat1: cat1,
              },
            })
            .then(async (res) => {
              const data = res.data.response.body.items.item;
              const category2 = data.map((item) => ({
                cat1: cat1,
                cat2: item.code,
                name: item.name,
              }));
              await axios
                .post("/api/tour/add/cat2", category2)
                .then(() => {
                  // console.log("p3");
                })
                .catch();
              // console.log("p2");
            })
            .catch(() => {})
            .finally(() => setIsProcessing(false));
        }
        // console.log("p1");
      })
      .catch();
  }

  function handleAddCat3() {
    axios
      .get("/api/tour/get/cat2")
      .then((res) => {
        const category2 = res.data;
        for (const cat2 of category2) {
          setIsProcessing(true);
          const cat1 = cat2.toString().slice(0, 3);
          axios
            .get(`https://apis.data.go.kr/B551011/KorService1/categoryCode1`, {
              params: {
                serviceKey: serviceKey,
                MobileOS: "ETC",
                MobileApp: "AppTest",
                _type: "json",
                numOfRows: 50,
                pageNo: 1,
                cat1: cat1,
                cat2: cat2,
              },
            })
            .then(async (res) => {
              const data = res.data.response.body.items.item;
              const category3 = data.map((item) => ({
                cat2: cat2,
                cat3: item.code,
                name: item.name,
              }));
              await axios
                .post("/api/tour/add/cat3", category3)
                .then(() => {})
                .catch(() => {});
            })
            .catch(() => {})
            .finally(() => {
              setIsProcessing(false);
            });
        }
      })
      .catch(() => {});
  }

  function handleAddContent1() {
    axios
      .get(`https://apis.data.go.kr/B551011/KorService1/detailCommon1`, {
        params: {
          serviceKey: serviceKey,
          MobileOS: "ETC",
          MobileApp: "AppTest",
          _type: "json",
          contentId: 126508,
          defaultYN: "Y",
          firstImageYN: "Y",
          areacodeYN: "Y",
          catcodeYN: "Y",
          addrinfoYN: "Y",
          mapinfoYN: "Y",
          overviewYN: "Y",
          numOfRows: 3,
          pageNo: 1,
        },
      })
      .then(async (res) => {
        const data = res.data.response.body.items.item;
        const content = data.map((item) => ({
          contentId: item.contentid,
          typeId: item.contenttypeid,
          cat3: item.cat3,
          areaCode: item.areacode,
          sigunguCode: item.sigungucode,
          title: item.title,
          zipcode: item.zipcode,
          address: item.addr1 + " " + item.addr2,
          tel: item.tel,
          homepage: item.homepage,
          overview: item.overview,
          firstImage1: item.firstimage,
          firstImage2: item.firstimage2,
          mapx: item.mapx,
          mapy: item.mapy,
          created: item.createdtime,
          modified: item.modifiedtime,
        }));
        await axios
          .post("/api/tour/add/content", content)
          .then(() => console.log("post"));
      });
  }

  function handleAddContent2() {
    // for (let pageNo = 5; pageNo > 0; pageNo--) {
    axios
      .get(`https://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`, {
        params: {
          serviceKey: serviceKey,
          MobileOS: "ETC",
          MobileApp: "AppTest",
          _type: "json",
          showflag: 1,
          listYN: "Y", // Y: 목록, N: 개수
          arrange: "C", // 정렬 (A=제목순, C=수정일순, D=생성일순)
          numOfRows: 9000,
          pageNo: 6,
        },
      })
      .then(async (res) => {
        const data = res.data.response.body.items.item;
        const content = data.map((item) => ({
          contentId: item.contentid,
          typeId: item.contenttypeid,
          cat3: item.cat3,
          areaCode: item.areacode,
          sigunguCode: item.sigungucode,
          title: item.title,
        }));
        await axios
          .post("/api/tour/add/content", content)
          .then(() => console.log("post"));
      });
    // }
  }

  return (
    <Box>
      <Button onClick={handleAddArea}>지역 입력</Button>
      <Button onClick={handleGetAreaCodes}>areaCode 받기</Button>
      <Button onClick={handleAddSigungu}>시군구 입력</Button>
      <Button onClick={handleAddCat1}>대분류 입력</Button>
      <Button onClick={handleAddCat2}>중분류 입력</Button>
      <Button onClick={handleAddCat3}>소분류 입력</Button>
      <Button onClick={handleAddContent1}>콘텐츠 입력1</Button>
      <Button onClick={handleAddContent2}>콘텐츠 입력2</Button>
      {area.length > 0 && (
        <Box>
          {areaCodes}
          {area.map((item) => (
            <Box key={item.code}>
              <h2>{item.areaCode}</h2>
              <p>{item.name}</p>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
