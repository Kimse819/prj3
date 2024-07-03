import { Box, Button, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function TourSearch() {
  const [area, setArea] = useState([]);
  const [areaCodes, setAreaCodes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const serviceKey = import.meta.env.VITE_API_TOUR_SERVICE_KEY1;
  const [intros, setIntros] = useState([]);
  const [info1Details, setInfo1Details] = useState([]);
  const [info2List, setInfo2List] = useState([]);
  const [lodgingInfo2List, setLodgingInfo2List] = useState([]);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    // setIsProcessing(true);
    // axios
    //   .get(`https://apis.data.go.kr/B551011/KorService1/areaCode1`, {
    //     params: {
    //       serviceKey: serviceKey,
    //       MobileOS: "ETC",
    //       MobileApp: "AppTest",
    //       _type: "json",
    //       numOfRows: 100,
    //       pageNo: 1,
    //     },
    //   })
    //   .then((res) => {
    //     const data = res.data.response.body.items.item.reverse();
    //     setArea(
    //       data.map((item) => ({
    //         areaCode: item.code,
    //         name: item.name,
    //       })),
    //     );
    //   })
    //   .catch(() => console.log("get error"))
    //   .finally(() => {
    //     setIsProcessing(false);
    //   });
  }, []);

  // useEffect(() => {
  //   if (intros.length > 0) {
  //     axios
  //       .post(`/api/tour/add/intro`, intros)
  //       .then(() => {})
  //       .catch()
  //       .finally(() => {});
  //   }
  // }, [handleGetIntroInfo]);

  // useEffect(() => {
  //   if (info1Details.length > 0) {
  //     axios
  //       .put("/api/tour/add/info1detail", info1Details)
  //       .then(() => {})
  //       .catch(() => {})
  //       .finally(() => {
  //         setInfo1Details([]);
  //       });
  //   }
  // }, [handleGetContentInfo1detail]);

  // useEffect(() => {
  //   if (info2List.length > 0) {
  //     axios
  //       .post("/api/tour/add/info2", info2List)
  //       .then(() => {
  //         console.log("post");
  //       })
  //       .catch()
  //       .finally(() => {
  //         setInfo2List([]);
  //       });
  //   }
  //   if (lodgingInfo2List.length > 0) {
  //     axios
  //       .post("/api/tour/add/lodgingInfo2", lodgingInfo2List)
  //       .then(() => {
  //         console.log("post");
  //       })
  //       .catch()
  //       .finally(() => {
  //         setLodgingInfo2List([]);
  //       });
  //   }
  // }, [handleGetContentInfo2]);

  // useEffect(() => {
  //   if (imageList.length > 0) {
  //     axios
  //       .post("/api/tour/add/image", imageList)
  //       .then(() => {
  //         console.log("post");
  //       })
  //       .catch(() => {})
  //       .finally(() => {
  //         setImageList([]);
  //       });
  //   }
  // }, [handleGetImages]);

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
      .catch(() => console.log("get error1"))
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
            .then((res) => {
              const data = res.data.response.body.items.item;
              const category3 = data.map((item) => ({
                cat2: cat2,
                cat3: item.code,
                name: item.name,
              }));
              axios
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
    // 미사용
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
      .then((res) => {
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
        axios
          .post("/api/tour/add/content", content)
          .then(() => console.log("post"));
      });
  }

  async function handleAddContent2() {
    try {
      for (let pageNo = 6; pageNo > 0; pageNo--) {
        setIsProcessing(true);
        await axios
          .get(
            `https://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`,
            {
              params: {
                serviceKey: serviceKey,
                MobileOS: "ETC",
                MobileApp: "AppTest",
                _type: "json",
                showflag: 1,
                listYN: "Y", // Y: 목록, N: 개수
                arrange: "C", // 정렬 (A=제목순, C=수정일순, D=생성일순)
                numOfRows: 9000,
                pageNo: pageNo,
              },
            },
          )
          .then(async (res) => {
            const data = res.data.response.body.items.item.reverse();
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
              .then(() => {
                console.log("post");
              })
              .catch()
              .finally(() => {
                new Promise((resolve) => setTimeout(resolve, 200));
                setIsProcessing(false);
              });
          });
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleAddContentInfo1() {
    try {
      for (let pageNo = 6; pageNo > 0; pageNo--) {
        setIsProcessing(true);
        await axios
          .get(
            `https://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`,
            {
              params: {
                serviceKey: serviceKey,
                MobileOS: "ETC",
                MobileApp: "AppTest",
                _type: "json",
                showflag: 1,
                listYN: "Y", // Y: 목록, N: 개수
                arrange: "C", // 정렬 (A=제목순, C=수정일순, D=생성일순)
                numOfRows: 9000,
                pageNo: pageNo,
              },
            },
          )
          .then(async (res) => {
            const data = res.data.response.body.items.item.reverse();
            const info1 = data.map((item) => ({
              contentId: item.contentid,
              zipcode: item.zipcode,
              address: item.addr1 + " " + item.addr2,
              tel: item.tel,
              //  homepage, overview 는 detailCommon1 조회 필요
              //  상세 정보는 각 content마다 하나하나 api 요청이 필요하므로 운영계정 신청해야 입력 가능
              // homepage: item.homepage,
              // overview: item.overview,
              homepage: null,
              overview: null,
              firstImage1: item.firstimage,
              firstImage2: item.firstimage2,
              mapx: item.mapx,
              mapy: item.mapy,
              created: item.createdtime,
              modified: item.modifiedtime,
            }));

            await axios
              .post("/api/tour/add/info1", info1)
              .then(() => {
                console.log("post");
              })
              .catch(() => {})
              .finally(() => {
                new Promise((resolve) => setTimeout(resolve, 200));
                setIsProcessing(false);
              });
          });
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleGetContentInfo1detail() {
    setIsProcessing(true);
    try {
      await axios
        .get(`/api/tour/get/contentId`)
        .then((res) => {
          const idList = res.data;
          for (const id of idList) {
            // 모든 데이터 호출용
            axios
              .get(`/api/tour/get/content/${id}`)
              .then(async (res) => {
                const contentList = res.data;
                for (const content of contentList) {
                  const exContentId = content.exContentId;

                  await axios
                    .get(
                      `https://apis.data.go.kr/B551011/KorService1/detailCommon1`,
                      {
                        params: {
                          serviceKey: serviceKey,
                          MobileOS: "ETC",
                          MobileApp: "AppTest",
                          _type: "json",
                          contentId: exContentId,
                          defaultYN: "Y",
                          firstImageYN: "N",
                          areacodeYN: "N",
                          catcodeYN: "N",
                          addrinfoYN: "N",
                          mapinfoYN: "N",
                          overviewYN: "Y",
                          numOfRows: 5,
                          pageNo: 1,
                        },
                      },
                    )
                    .then((res) => {
                      const data = res.data.response.body.items.item;
                      const info1detail = data.map((item) => ({
                        // info1 의 나머지 정보
                        id: id,
                        contentId: item.contentid,
                        homepage: item.homepage,
                        overview: item.overview,
                      }));
                      setInfo1Details((prevDetails) => [
                        ...prevDetails,
                        info1detail,
                      ]);
                    })
                    .catch()
                    .finally(() => {
                      new Promise((resolve) => setTimeout(resolve, 200));
                    });
                }
              })
              .catch()
              .finally(() => {});
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setIsProcessing(false));
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleAddContentInfo1detail() {
    if (info1Details.length > 0) {
      const offset = 1000;

      for (let i = 0; i < info1Details.length; i += offset) {
        const batch = info1Details.slice(i, i + offset);
        await axios
          .put("/api/tour/add/info1detail", batch)
          .then(() => {})
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {});

        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  async function handleGetContentInfo2() {
    setIsProcessing(true);
    // 모든 데이터 호출용
    try {
      axios
        .get(`/api/tour/get/contentId`)
        .then((res) => {
          const idList = res.data;
          for (const id of idList) {
            new Promise((resolve) => setTimeout(resolve, 300));
            axios
              .get(`/api/tour/get/content/${id}`)
              .then((res) => {
                const contentList = res.data;
                for (const content of contentList) {
                  const exContentId = content.exContentId;
                  const typeId = content.typeId;

                  // typeId 가 32가 아니면
                  if (typeId !== 32) {
                    axios
                      .get(
                        `https://apis.data.go.kr/B551011/KorService1/detailInfo1`,
                        {
                          params: {
                            serviceKey: serviceKey,
                            MobileOS: "ETC",
                            MobileApp: "AppTest",
                            _type: "json",
                            contentId: exContentId,
                            contentTypeId: typeId,
                            numOfRows: 100,
                            pageNo: 1,
                          },
                        },
                      )
                      .then((res) => {
                        const data = res.data.response.body.items.item;
                        const info2 = data.map((item) => ({
                          contentId: id,
                          number: item.serialnum,
                          infoName: item.infoname,
                          infoText: item.infotext,
                        }));
                        setInfo2List((prev) => [...prev, info2]);
                      })
                      .catch()
                      .finally(() => {
                        new Promise((resolve) => setTimeout(resolve, 300));
                      });
                  }
                  // typeId 가 32일 경우
                  if (typeId === 32) {
                    axios
                      .get(
                        `https://apis.data.go.kr/B551011/KorService1/detailInfo1`,
                        {
                          params: {
                            serviceKey: serviceKey,
                            MobileOS: "ETC",
                            MobileApp: "AppTest",
                            _type: "json",
                            contentId: exContentId,
                            contentTypeId: typeId,
                            numOfRows: 100,
                            pageNo: 1,
                          },
                        },
                      )
                      .then((res) => {
                        const data = res.data.response.body.items.item;
                        const info2 = data.map((item, index) => ({
                          contentId: id,
                          number: index,
                          title: item.roomtitle,
                          size: item.roomsize1,
                          roomCount: item.roomcount,
                          baseAccomCount: item.roombasecount,
                          maxAccomCount: item.roommaxcount,
                          offSeasonFeeWd: item.roomoffseasonminfee1,
                          peakSeasonFeeWd: item.roompeakseasonminfee1,
                          offSeasonFeeWe: item.roomoffseasonminfee2,
                          peakSeasonFeeWe: item.roompeakseasonminfee2,
                          intro: item.roomintro,
                          aircondition: item.roomaircondition,
                          bath: item.roombath,
                          bathFacility: item.roombathfacility,
                          cable: item.roomcable,
                          cook: item.roomcook,
                          hairdryer: item.roomhairdryer,
                          homeTheater: item.roomhometheater, // 추가
                          internet: item.roominternet,
                          pc: item.roompc,
                          sofa: item.roomsofa,
                          refrigerator: item.roomrefrigerator,
                          toiletries: item.roomtoiletries,
                          tv: item.roomtv,
                          img1: item.roomimg1,
                          img2: item.roomimg2,
                          img3: item.roomimg3,
                          img4: item.roomimg4,
                          img5: item.roomimg5,
                        }));
                        setLodgingInfo2List((prev) => [...prev, info2]);
                      })
                      .catch()
                      .finally(() => {
                        new Promise((resolve) => setTimeout(resolve, 300));
                      });
                  }
                }
              })
              .catch()
              .finally(() => {});
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setIsProcessing(false));
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleAddContentInfo2() {
    if (info2List.length > 0) {
      const offset = 100;
      for (let i = 0; i < info2List.length; i += offset) {
        const batch = info2List.slice(i, i + offset);
        await axios
          .post("/api/tour/add/info2", batch)
          .then(() => {
            console.log("post");
          })
          .catch()
          .finally(() => {});
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    if (lodgingInfo2List.length > 0) {
      const offset = 100;
      for (let i = 0; i < lodgingInfo2List.length; i += offset) {
        const batch = lodgingInfo2List.slice(i, i + offset);
        await axios
          .post("/api/tour/add/lodgingInfo2", batch)
          .then(() => {
            console.log("post");
          })
          .catch()
          .finally(() => {});
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  async function handleGetImages() {
    setIsProcessing(true);
    try {
      await axios
        .get(`/api/tour/get/contentId`)
        .then((res) => {
          const idList = res.data;
          for (const id of idList) {
            //   모든 데이터 호출용
            axios.get(`/api/tour/get/content/${id}`).then(async (res) => {
              const contentList = res.data;
              for (const content of contentList) {
                const exContentId = content.exContentId;

                await axios
                  .get(
                    `https://apis.data.go.kr/B551011/KorService1/detailImage1`,
                    {
                      params: {
                        serviceKey: serviceKey,
                        MobileOS: "ETC",
                        MobileApp: "AppTest",
                        _type: "json",
                        contentId: exContentId,
                        imageYN: "Y",
                        subImageYN: "Y",
                        numOfRows: 100,
                        pageNo: 1,
                      },
                    },
                  )
                  .then((res) => {
                    const data = res.data.response.body.items.item;
                    const images = data.map((item) => ({
                      contentId: id,
                      originalUrl: item.originimgurl,
                      smallUrl: item.smallimageurl,
                    }));
                    setImageList((prev) => [...prev, images]);
                  })
                  .catch()
                  .finally(() => {
                    new Promise((resolve) => setTimeout(resolve, 300));
                  });
              }
            });
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setIsProcessing(false));
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleAddImages() {
    setIsProcessing(true);
    if (imageList.length > 0) {
      const offset = 100;
      for (let i = 0; i < imageList.length; i += offset) {
        const batch = imageList.slice(i, i + offset);
        await axios
          .post("/api/tour/add/image", batch)
          .then(() => {
            console.log("post");
          })
          .catch(() => {})
          .finally(() => {});
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    setIsProcessing(false);
  }

  async function handleAddTypeCategoryMapping() {
    setIsProcessing(true);
    await axios
      .get("/api/tour/get/contentType")
      .then((res) => {
        const contentTypes = res.data;
        for (const typeId of contentTypes) {
          axios
            .get(`https://apis.data.go.kr/B551011/KorService1/categoryCode1`, {
              params: {
                serviceKey: serviceKey,
                MobileOS: "ETC",
                MobileApp: "AppTest",
                _type: "json",
                contentTypeId: typeId,
                numOfRows: 20,
                pageNo: 1,
              },
            })
            .then((res) => {
              const data1 = res.data.response.body.items.item;
              data1.map((item1) => {
                const cat1 = item1.code;

                axios
                  .get(
                    `https://apis.data.go.kr/B551011/KorService1/categoryCode1`,
                    {
                      params: {
                        serviceKey: serviceKey,
                        MobileOS: "ETC",
                        MobileApp: "AppTest",
                        _type: "json",
                        contentTypeId: typeId,
                        cat1: cat1,
                        numOfRows: 20,
                        pageNo: 1,
                      },
                    },
                  )
                  .then(async (res) => {
                    const data2 = res.data.response.body.items.item;
                    const typeCatMap = data2.map((item2) => ({
                      contentTypeId: typeId,
                      cat1: cat1,
                      cat2: item2.code,
                    }));

                    await axios
                      .post("/api/tour/add/typeCatMap", typeCatMap)
                      .then(() => {
                        console.log("post");
                      })
                      .catch(() => {})
                      .finally(() => {
                        new Promise((resolve) => setTimeout(resolve, 200));
                      });
                  });
              });
            });
        }
      })
      .catch()
      .finally(() => setIsProcessing(false));
  }

  function getIntroInfo(exContentId, typeId) {
    return axios
      .get(`https://apis.data.go.kr/B551011/KorService1/detailIntro1`, {
        params: {
          serviceKey: serviceKey,
          MobileOS: "ETC",
          MobileApp: "AppTest",
          _type: "json",
          contentId: exContentId,
          contentTypeId: typeId,
          numOfRows: 50,
          pageNo: 1,
        },
      })
      .then((res) => {
        return res.data.response.body.items.item;
      });
  }

  async function handleGetIntroInfo() {
    setIsProcessing(true);
    try {
      await axios
        .get(`/api/tour/get/contentId`)
        .then((res) => {
          const idList = res.data;
          for (const id of idList) {
            //  모든 데이터 호출용
            axios
              .get(`/api/tour/get/content/${id}`)
              .then(async (res) => {
                const contentList = res.data;
                for (const content of contentList) {
                  const exContentId = content.exContentId;
                  const typeId = content.typeId;

                  // 관광지 ( 67257 )
                  if (typeId === 12) {
                    await getIntroInfo(exContentId, typeId)
                      .then((data) => {
                        const intro = data.map((item) => ({
                          contentId: id,
                          typeId: typeId,
                          accomCount: item.accomcount,
                          chkBabyCarriage: item.chkbabycarriage,
                          chkCreditCard: item.chkcreditcard,
                          chkPet: item.chkpet,
                          expAgeRange: item.expagerange,
                          expGuide: item.expguide,
                          heritage1: item.heritage1,
                          heritage2: item.heritage2,
                          heritage3: item.heritage3,
                          parking: item.parking,
                          openDate: item.opendate,
                          restDate: item.restdate,
                          telCenter: item.infocenter,
                          useSeason: item.useseason,
                          useTime: item.usetime,
                        }));
                        setIntros((prev) => [...prev, intro]);
                      })
                      .catch()
                      .finally(() => {});
                  }
                  // 문화시설 ( 40972 )
                  if (typeId === 14) {
                    await getIntroInfo(exContentId, typeId)
                      .then((data) => {
                        const intro = data.map((item) => ({
                          contentId: id,
                          typeId: typeId,
                          accomCount: item.accomcountculture,
                          chkBabyCarriage: item.chkbabycarriageculture,
                          chkCreditCard: item.chkcreditcardculture,
                          chkPet: item.chkpetculture,
                          discount: item.discountinfo,
                          parking: item.parkingculture,
                          parkingFee: item.parkingfee,
                          restDate: item.restdateculture,
                          telCenter: item.infocenterculture,
                          useFee: item.usefee,
                          useTime: item.usetimeculture,
                          scale: item.scale,
                          spendTime: item.spendtime,
                        }));
                        setIntros((prev) => [...prev, intro]);
                      })
                      .catch()
                      .finally(() => {});
                  }
                  // 축제/공연/행사 ( 70878 )
                  if (typeId === 15) {
                    await getIntroInfo(exContentId, typeId)
                      .then((data) => {
                        const intro = data.map((item) => ({
                          contentId: id,
                          typeId: typeId,
                          ageLimit: item.agelimit,
                          bookingPlace: item.bookingplace,
                          discount: item.discountinfofestival,
                          startDate: item.eventstartdate,
                          endDate: item.eventenddate,
                          place: item.eventplace,
                          placeInfo: item.placeinfo,
                          playTime: item.playtime,
                          program: item.program,
                          useFee: item.usetimefestival,
                          spendTime: item.spendtimefestival,
                          sponsor1: item.sponsor1,
                          telSponsor1: item.sponsor1tel,
                          sponsor2: item.sponsor2,
                          telSponsor2: item.sponsor2tel,
                          subEvent: item.subevent,
                        }));
                        setIntros((prev) => [...prev, intro]);
                      })
                      .catch()
                      .finally(() => {});
                  }
                  // 레포츠 ( 41147 )
                  if (typeId === 28) {
                    await getIntroInfo(exContentId, typeId)
                      .then((data) => {
                        const intro = data.map((item) => ({
                          contentId: id,
                          typeId: typeId,
                          accomCount: item.accomcountleports,
                          chkBabyCarriage: item.chkbabycarriageleports,
                          chkCreditCard: item.chkcreditcardleports,
                          chkPet: item.chkpetleports,
                          expAgeRange: item.expagerangeleports,
                          openPeriod: item.openperiod,
                          parking: item.parkingleports,
                          parkingFee: item.parkingfeeleports,
                          restDate: item.restdateleports,
                          reservation: item.reservation,
                          telCenter: item.infocenterleports,
                          useFee: item.usefeeleports,
                          useTime: item.usetimeleports,
                          scale: item.scaleleports,
                        }));
                        setIntros((prev) => [...prev, intro]);
                      })
                      .catch()
                      .finally(() => {});
                  }
                  // 숙박 ( 29777 )
                  if (typeId === 32) {
                    await getIntroInfo(exContentId, typeId)
                      .then((data) => {
                        const intro = data.map((item) => ({
                          contentId: id,
                          typeId: typeId,
                          accomCount: item.accomcountlodging,
                          checkIn: item.checkintime,
                          checkOut: item.checkouttime,
                          chkCooking: item.chkcooking,
                          foodPlace: item.foodplace,
                          parking: item.parkinglodging,
                          pickup: item.pickup,
                          reservationTel: item.reservationlodging,
                          reservationUrl: item.reservationurl,
                          telCenter: item.infocenterlodging,
                          scale: item.scalelodging,
                          roomCount: item.roomcount,
                          roomType: item.roomtype,
                          subFacility: item.subfacility,
                        }));
                        setIntros((prev) => [...prev, intro]);
                      })
                      .catch()
                      .finally(() => {});
                  }
                  // 쇼핑 ( 70734 )
                  if (typeId === 38) {
                    await getIntroInfo(exContentId, typeId)
                      .then((data) => {
                        const intro = data.map((item) => ({
                          contentId: id,
                          typeId: typeId,
                          chkBabyCarriage: item.chkbabycarriageshopping,
                          chkCreditCard: item.chkcreditcardshopping,
                          chkPet: item.chkpetshopping,
                          fairDay: item.fairday,
                          openDate: item.opendateshopping,
                          openTime: item.opentime,
                          parking: item.parkingshopping,
                          restDate: item.restdateshopping,
                          restRoom: item.restroom,
                          telCenter: item.infocentershopping,
                          saleItem: item.saleitem,
                          scale: item.scaleshopping,
                          shopGuide: item.shopguide,
                        }));
                        setIntros((prev) => [...prev, intro]);
                      })
                      .catch()
                      .finally(() => {});
                  }
                  // 음식점 ( 17592 )
                  if (typeId === 39) {
                    await getIntroInfo(exContentId, typeId)
                      .then((data) => {
                        const intro = data.map((item) => ({
                          contentId: id,
                          typeId: typeId,
                          chkCreditCard: item.chkcreditcardfood,
                          discount: item.discountinfofood,
                          firstMenu: item.firstmenu,
                          menu: item.treatmenu,
                          kidsFacility: item.kidsfacility,
                          openDate: item.opendatefood,
                          openTime: item.opentimefood,
                          packing: item.packing,
                          parking: item.parkingfood,
                          restDate: item.restdatefood,
                          reservation: item.reservationfood,
                          telCenter: item.infocenterfood,
                          scale: item.scalefood,
                          seat: item.seat,
                        }));
                        setIntros((prev) => [...prev, intro]);
                      })
                      .catch()
                      .finally(() => {});
                  }
                  new Promise((resolve) => setTimeout(resolve, 200));
                }
              })
              .catch()
              .finally(() => {});
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsProcessing(false);
        });
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleAddIntroInfo() {
    setIsProcessing(true);
    if (intros.length > 0) {
      const offset = 100;
      for (let i = 0; i < intros.length; i += offset) {
        const batch = intros.slice(i, i + offset);
        axios
          .post(`/api/tour/add/intro`, batch)
          .then(() => {
            console.log("post");
          })
          .catch()
          .finally(() => {});
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    setIsProcessing(false);
  }

  function handleAddSyncList() {
    setIsProcessing(true);

    axios.get(`/api/tour/get/lastmd`).then((res) => {
      // api modifiedtime 값이 더 작아질때까지 탐색
      const lastModified = res.data;
      const lastModifiedDate = res.data.toString().substring(0, 8);

      console.log(lastModifiedDate);
      /*
      // for (let pageNo = 6; pageNo > 0; pageNo--) { insert
      axios
        .get(`https://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`, {
          params: {
            serviceKey: serviceKey,
            MobileOS: "ETC",
            MobileApp: "AppTest",
            _type: "json",
            listYN: "Y", // Y: 목록, N: 개수
            arrange: "C", // 정렬 (A=제목순, C=수정일순, D=생성일순)
            numOfRows: 1000,
            pageNo: 1,
          },
        })
        .then((res) => {
          const data = res.data.response.body.items.item.reverse();
          const info1 = data.map((item) => ({
            showFlag: item.showflag,
            contentId: item.contentid,
            zipcode: item.zipcode,
            address: item.addr1 + " " + item.addr2,
            tel: item.tel,
            homepage: null,
            overview: null,
            firstImage1: item.firstimage,
            firstImage2: item.firstimage2,
            mapx: item.mapx,
            mapy: item.mapy,
            created: item.createdtime,
            modified: item.modifiedtime,
          }));

          if (info1.showFlag === 0) {
            // 삭제
            axios.delete(`/api/tour/`);
          }
          if (info1.showFlag === 1) {
            axios.get(`/api/tour/get/id/${info1.contentId}`).then((res) => {
              // id 조회
              const id = res.data;
              if (id === null) {
                // 없으면 추가
                axios
                  .post("/api/tour/add/info1", info1)
                  .then(() => {
                    console.log("post");
                  })
                  .catch(() => {})
                  .finally(() => {});
              } else {
                // 이미 있으면 수정
                axios.put(`/api/tour/modify/${id}`);
              }
            });
          }
        });
      // }

       */
    });

    setIsProcessing(false);
  }

  function handleTest() {
    setIsProcessing(true);

    axios.get(`/api/tour/get/lastmd`).then((res) => {
      // api modifiedtime 값이 더 작아질때까지 탐색
      const lastModified = res.data;
      const lastModifiedDate = res.data.toString().substring(0, 8);

      // for (let pageNo = 6; pageNo > 0; pageNo--) { insert
      axios
        .get(`https://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`, {
          params: {
            serviceKey: serviceKey,
            MobileOS: "ETC",
            MobileApp: "AppTest",
            _type: "json",
            listYN: "Y", // Y: 목록, N: 개수
            arrange: "C", // 정렬 (A=제목순, C=수정일순, D=생성일순)
            numOfRows: 5,
            pageNo: 1,
          },
        })
        .then((res) => {
          const data = res.data.response.body.items.item;
          const content = data.map((item) => ({
            contentId: item.contentid,
            typeId: item.contenttypeid,
            cat3: item.cat3,
            areaCode: item.areacode,
            sigunguCode: item.sigungucode,
            title: item.title,
          }));
          const info1 = data.map((item) => ({
            showFlag: item.showflag,
            contentId: item.contentid,
            zipcode: item.zipcode,
            address: item.addr1 + " " + item.addr2,
            tel: item.tel,
            firstImage1: item.firstimage,
            firstImage2: item.firstimage2,
            mapx: item.mapx,
            mapy: item.mapy,
            created: item.createdtime,
            modified: item.modifiedtime,
          }));

          data.map((item) => {
            const md = item.modifiedtime;
            if (md > lastModified) {
              console.log(md);
            }
          });

          // if (info1.modified === lastModifiedDate) {
          //   console.log(info1.modified);
          // }

          /*
          if (info1.showFlag === 0) {
            // 삭제
            axios
              .delete(`/api/tour/remove/${info1.contentId}`)
              .then()
              .catch()
              .finally();
          }

          if (info1.showFlag === 1) {
            axios.get(`/api/tour/get/id/${info1.contentId}`).then((res) => {
              // id 조회
              const id = res.data;
              if (id === null) {
                // 없으면 추가
                axios
                  .post("/api/tour/add/content", content)
                  .then(() => {
                    console.log("post");
                  })
                  .catch(() => {})
                  .finally(() => {});
                axios
                  .post("/api/tour/add/info1", info1)
                  .then(() => {
                    console.log("post");
                  })
                  .catch(() => {})
                  .finally(() => {});
              } else {
                // 이미 있으면 수정
                // content
                axios.put(`/api/tour/modify/content`, content).then();

                // info1
                axios
                  .get(
                    `https://apis.data.go.kr/B551011/KorService1/detailCommon1`,
                    {
                      params: {
                        serviceKey: serviceKey,
                        MobileOS: "ETC",
                        MobileApp: "AppTest",
                        _type: "json",
                        contentId: info1.contentId,
                        defaultYN: "Y",
                        firstImageYN: "N",
                        areacodeYN: "N",
                        catcodeYN: "N",
                        addrinfoYN: "N",
                        mapinfoYN: "N",
                        overviewYN: "Y",
                        numOfRows: 5,
                        pageNo: 1,
                      },
                    },
                  )
                  .then((res) => {
                    const data = res.data.response.body.items.item;
                    const info1detail = data.map((item) => ({
                      // info1 의 나머지 정보
                      id: id,
                      homepage: item.homepage,
                      overview: item.overview,
                    }));
                    const newInfo1 = info1.concat(info1detail);
                    axios.put(`/api/tour/modify/info1`, newInfo1).then();
                  });

                // info2
                // 삭제 후 다시 post
                // typeId 가 32가 아니면
                if (content.typeId !== 32) {
                  axios
                    .delete(`/api/tour/remove/info2`, id)
                    .then()
                    .catch()
                    .finally();

                  axios
                    .get(
                      `https://apis.data.go.kr/B551011/KorService1/detailInfo1`,
                      {
                        params: {
                          serviceKey: serviceKey,
                          MobileOS: "ETC",
                          MobileApp: "AppTest",
                          _type: "json",
                          contentId: content.contentId,
                          contentTypeId: content.typeId,
                          numOfRows: 100,
                          pageNo: 1,
                        },
                      },
                    )
                    .then((res) => {
                      const data = res.data.response.body.items.item;
                      const info2 = data.map((item) => ({
                        contentId: id,
                        number: item.serialnum,
                        infoName: item.infoname,
                        infoText: item.infotext,
                      }));
                      axios.post(`/api/tour/add/info2`, [info2]).then();
                    });
                }
                // typeId 가 32일 경우
                if (content.typeId === 32) {
                  axios
                    .delete(`/api/tour/remove/lodgingInfo2`, id)
                    .then()
                    .catch()
                    .finally();

                  axios
                    .get(
                      `https://apis.data.go.kr/B551011/KorService1/detailInfo1`,
                      {
                        params: {
                          serviceKey: serviceKey,
                          MobileOS: "ETC",
                          MobileApp: "AppTest",
                          _type: "json",
                          contentId: content.contentId,
                          contentTypeId: content.typeId,
                          numOfRows: 100,
                          pageNo: 1,
                        },
                      },
                    )
                    .then((res) => {
                      const data = res.data.response.body.items.item;
                      const info2 = data.map((item, index) => ({
                        contentId: id,
                        number: index,
                        title: item.roomtitle,
                        size: item.roomsize1,
                        roomCount: item.roomcount,
                        baseAccomCount: item.roombasecount,
                        maxAccomCount: item.roommaxcount,
                        offSeasonFeeWd: item.roomoffseasonminfee1,
                        peakSeasonFeeWd: item.roompeakseasonminfee1,
                        offSeasonFeeWe: item.roomoffseasonminfee2,
                        peakSeasonFeeWe: item.roompeakseasonminfee2,
                        intro: item.roomintro,
                        aircondition: item.roomaircondition,
                        bath: item.roombath,
                        bathFacility: item.roombathfacility,
                        cable: item.roomcable,
                        cook: item.roomcook,
                        hairdryer: item.roomhairdryer,
                        homeTheater: item.roomhometheater, // 추가
                        internet: item.roominternet,
                        pc: item.roompc,
                        sofa: item.roomsofa,
                        refrigerator: item.roomrefrigerator,
                        toiletries: item.roomtoiletries,
                        tv: item.roomtv,
                        img1: item.roomimg1,
                        img2: item.roomimg2,
                        img3: item.roomimg3,
                        img4: item.roomimg4,
                        img5: item.roomimg5,
                      }));
                      axios
                        .post(`/api/tour/modify/lodgingInfo2`, [info2])
                        .then();
                    });
                }

                // image
                axios.delete(`/api/tour/remove/image`, id).then();
                axios
                  .get(
                    `https://apis.data.go.kr/B551011/KorService1/detailImage1`,
                    {
                      params: {
                        serviceKey: serviceKey,
                        MobileOS: "ETC",
                        MobileApp: "AppTest",
                        _type: "json",
                        contentId: content.contentId,
                        imageYN: "Y",
                        subImageYN: "Y",
                        numOfRows: 100,
                        pageNo: 1,
                      },
                    },
                  )
                  .then((res) => {
                    const data = res.data.response.body.items.item;
                    const images = data.map((item) => ({
                      contentId: id,
                      originalUrl: item.originimgurl,
                      smallUrl: item.smallimageurl,
                    }));
                    axios.post(`/api/tour/add/image`, [images]);
                  });

                // IntroInfo
                const introInfo = [];
                const exContentId = content.contentId;
                const typeId = content.typeId;
                if (typeId === 12) {
                  getIntroInfo(exContentId, typeId).then((data) => {
                    const intro = data.map((item) => ({
                      contentId: id,
                      typeId: typeId,
                      accomCount: item.accomcount,
                      chkBabyCarriage: item.chkbabycarriage,
                      chkCreditCard: item.chkcreditcard,
                      chkPet: item.chkpet,
                      expAgeRange: item.expagerange,
                      expGuide: item.expguide,
                      heritage1: item.heritage1,
                      heritage2: item.heritage2,
                      heritage3: item.heritage3,
                      parking: item.parking,
                      openDate: item.opendate,
                      restDate: item.restdate,
                      telCenter: item.infocenter,
                      useSeason: item.useseason,
                      useTime: item.usetime,
                    }));
                    introInfo.push(intro);
                  });
                }
                // 문화시설 ( 40972 )
                if (typeId === 14) {
                  getIntroInfo(exContentId, typeId).then((data) => {
                    const intro = data.map((item) => ({
                      contentId: id,
                      typeId: typeId,
                      accomCount: item.accomcountculture,
                      chkBabyCarriage: item.chkbabycarriageculture,
                      chkCreditCard: item.chkcreditcardculture,
                      chkPet: item.chkpetculture,
                      discount: item.discountinfo,
                      parking: item.parkingculture,
                      parkingFee: item.parkingfee,
                      restDate: item.restdateculture,
                      telCenter: item.infocenterculture,
                      useFee: item.usefee,
                      useTime: item.usetimeculture,
                      scale: item.scale,
                      spendTime: item.spendtime,
                    }));
                    introInfo.push(intro);
                  });
                }
                // 축제/공연/행사 ( 70878 )
                if (typeId === 15) {
                  getIntroInfo(exContentId, typeId).then((data) => {
                    const intro = data.map((item) => ({
                      contentId: id,
                      typeId: typeId,
                      ageLimit: item.agelimit,
                      bookingPlace: item.bookingplace,
                      discount: item.discountinfofestival,
                      startDate: item.eventstartdate,
                      endDate: item.eventenddate,
                      place: item.eventplace,
                      placeInfo: item.placeinfo,
                      playTime: item.playtime,
                      program: item.program,
                      useFee: item.usetimefestival,
                      spendTime: item.spendtimefestival,
                      sponsor1: item.sponsor1,
                      telSponsor1: item.sponsor1tel,
                      sponsor2: item.sponsor2,
                      telSponsor2: item.sponsor2tel,
                      subEvent: item.subevent,
                    }));
                    introInfo.push(intro);
                  });
                }
                // 레포츠 ( 41147 )
                if (typeId === 28) {
                  getIntroInfo(exContentId, typeId).then((data) => {
                    const intro = data.map((item) => ({
                      contentId: id,
                      typeId: typeId,
                      accomCount: item.accomcountleports,
                      chkBabyCarriage: item.chkbabycarriageleports,
                      chkCreditCard: item.chkcreditcardleports,
                      chkPet: item.chkpetleports,
                      expAgeRange: item.expagerangeleports,
                      openPeriod: item.openperiod,
                      parking: item.parkingleports,
                      parkingFee: item.parkingfeeleports,
                      restDate: item.restdateleports,
                      reservation: item.reservation,
                      telCenter: item.infocenterleports,
                      useFee: item.usefeeleports,
                      useTime: item.usetimeleports,
                      scale: item.scaleleports,
                    }));
                    introInfo.push(intro);
                  });
                }
                // 숙박 ( 29777 )
                if (typeId === 32) {
                  getIntroInfo(exContentId, typeId).then((data) => {
                    const intro = data.map((item) => ({
                      contentId: id,
                      typeId: typeId,
                      accomCount: item.accomcountlodging,
                      checkIn: item.checkintime,
                      checkOut: item.checkouttime,
                      chkCooking: item.chkcooking,
                      foodPlace: item.foodplace,
                      parking: item.parkinglodging,
                      pickup: item.pickup,
                      reservationTel: item.reservationlodging,
                      reservationUrl: item.reservationurl,
                      telCenter: item.infocenterlodging,
                      scale: item.scalelodging,
                      roomCount: item.roomcount,
                      roomType: item.roomtype,
                      subFacility: item.subfacility,
                    }));
                    introInfo.push(intro);
                  });
                }
                // 쇼핑 ( 70734 )
                if (typeId === 38) {
                  getIntroInfo(exContentId, typeId).then((data) => {
                    const intro = data.map((item) => ({
                      contentId: id,
                      typeId: typeId,
                      chkBabyCarriage: item.chkbabycarriageshopping,
                      chkCreditCard: item.chkcreditcardshopping,
                      chkPet: item.chkpetshopping,
                      fairDay: item.fairday,
                      openDate: item.opendateshopping,
                      openTime: item.opentime,
                      parking: item.parkingshopping,
                      restDate: item.restdateshopping,
                      restRoom: item.restroom,
                      telCenter: item.infocentershopping,
                      saleItem: item.saleitem,
                      scale: item.scaleshopping,
                      shopGuide: item.shopguide,
                    }));
                    introInfo.push(intro);
                  });
                }
                // 음식점 ( 17592 )
                if (typeId === 39) {
                  getIntroInfo(exContentId, typeId).then((data) => {
                    const intro = data.map((item) => ({
                      contentId: id,
                      typeId: typeId,
                      chkCreditCard: item.chkcreditcardfood,
                      discount: item.discountinfofood,
                      firstMenu: item.firstmenu,
                      menu: item.treatmenu,
                      kidsFacility: item.kidsfacility,
                      openDate: item.opendatefood,
                      openTime: item.opentimefood,
                      packing: item.packing,
                      parking: item.parkingfood,
                      restDate: item.restdatefood,
                      reservation: item.reservationfood,
                      telCenter: item.infocenterfood,
                      scale: item.scalefood,
                      seat: item.seat,
                    }));
                    introInfo.push(intro);
                  });
                }
                axios.put(`/api/tour/modify/intro`, introInfo).then();
              }
            });
          }
          */
        });
      // }
    });

    setIsProcessing(false);
  }

  function handleTest2() {
    axios.get(`/api/tour/get/contentId`).then((res) => {
      const idList = res.data;
      console.log(idList.length);
      console.log(idList.length / 1000);
    });
  }

  return (
    <Box>
      <Box>
        <Button onClick={handleAddArea}>지역 입력</Button>
        <Button onClick={handleGetAreaCodes}>areaCode 받기</Button>
        <Button onClick={handleAddSigungu}>시군구 입력</Button>
        <Button onClick={handleAddCat1}>대분류 입력</Button>
        <Button onClick={handleAddCat2}>중분류 입력</Button>
        <Button onClick={handleAddCat3}>소분류 입력</Button>
        <Button onClick={handleAddTypeCategoryMapping}>
          타입-카테고리 매핑 정보 입력
        </Button>
        <Button isDisabled onClick={handleAddContent1}>
          콘텐츠 입력1
        </Button>
      </Box>
      <Box>
        <Button onClick={handleAddContent2}>콘텐츠 입력2(.1)</Button>
        <Button onClick={handleAddContentInfo1}>
          콘텐츠 기본 정보 입력(.2)
        </Button>
      </Box>
      <Box>
        <Button onClick={handleGetContentInfo1detail}>
          나머지 기본 정보 get(.3-1)
        </Button>
        <Button onClick={handleAddContentInfo1detail}>
          나머지 기본 정보 입력(.3-2)
        </Button>
      </Box>
      <Box>
        <Button onClick={handleGetContentInfo2}>
          콘텐츠 상세 정보 get(.4-1)
        </Button>
        <Button onClick={handleAddContentInfo2}>
          콘텐츠 상세 정보 입력(.4-2)
        </Button>
      </Box>
      <Box>
        <Button onClick={handleGetImages}>이미지 get(.5-1)</Button>
        <Button onClick={handleAddImages}>이미지 입력(.5-2)</Button>
      </Box>
      <Box>
        <Button onClick={handleGetIntroInfo}>소개정보 get(.6-1)</Button>
        <Button onClick={handleAddIntroInfo}>소개정보 입력(.6-2)</Button>
      </Box>
      <Button onClick={handleAddSyncList}>정보 동기화</Button>
      <Box mt={5}>
        <Button onClick={handleTest}>테스트 버튼</Button>
        <Button onClick={handleTest2}>test2</Button>
      </Box>

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
