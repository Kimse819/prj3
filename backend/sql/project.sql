# DDL
USE prj3;

# 회원 테이블
CREATE TABLE member
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    email     VARCHAR(100) NOT NULL UNIQUE,
    password  VARCHAR(100) NOT NULL,
    name      VARCHAR(20)  NOT NULL,
    nick_name VARCHAR(50)  NOT NULL UNIQUE,
    gender    INT(1)       NOT NULL, # 남자면 0, 여자면 1
    birth     DATETIME     NOT NULL,
    phone     VARCHAR(20)  NOT NULL,
    inserted  DATETIME     NOT NULL DEFAULT NOW()
);
# 회원 권한 테이블
CREATE TABLE authority
(
    member_id INT         NOT NULL REFERENCES member (id),
    name      VARCHAR(20) NOT NULL,
    PRIMARY KEY (member_id, name)
);

SELECT *
FROM member;


# 게시판 테이블
CREATE TABLE board
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    title     VARCHAR(100)  NOT NULL,
    content   VARCHAR(2000) NOT NULL,
    member_id INT           NOT NULL REFERENCES member (id),
    inserted  DATETIME      NOT NULL DEFAULT NOW()
);
# 게시판 댓글 테이블
CREATE TABLE comment
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    board_id  INT          NOT NULL REFERENCES board (id),
    member_id INT          NOT NULL REFERENCES member (id),
    comment   VARCHAR(500) NOT NULL,
    inserted  DATETIME     NOT NULL DEFAULT NOW()
);
# 게시판 파일(사진) 테이블
CREATE TABLE board_file
(
    board_id INT          NOT NULL REFERENCES board (id),
    name     VARCHAR(500) NOT NULL,
    inserted DATETIME     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (board_id, name)
);

# 카테고리 테이블
CREATE TABLE category1
(
    cat1 CHAR(3) PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);
CREATE TABLE category2
(
    cat1 CHAR(3) REFERENCES category1 (cat1),
    cat2 CHAR(5) PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);
CREATE TABLE category3
(
    cat2 CHAR(5) REFERENCES category2 (cat2),
    cat3 CHAR(9) PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);
# 지역 테이블
CREATE TABLE area
(
    area_code INT PRIMARY KEY,
    name      VARCHAR(20) NOT NULL
);
CREATE TABLE sigungu
(
    area_code    INT REFERENCES area (area_code),
    sigungu_code INT,
    name         VARCHAR(20) NOT NULL,
    PRIMARY KEY (area_code, sigungu_code)
);
# 관광타입 테이블
CREATE TABLE content_type
(
    id   INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);
# 관광타입-카테고리 맵핑 테이블
CREATE TABLE type_category_mapping
(
    type_id INT REFERENCES content_type (id),
    cat1    CHAR(3) REFERENCES category2 (cat1),
    cat2    CHAR(5) REFERENCES category2 (cat2)
);
# 관광지 공통 정보 테이블
CREATE TABLE content
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    ex_content_id INT          NOT NULL UNIQUE,
    type_id       INT REFERENCES content_type (id),
    cat3          CHAR(9) REFERENCES category3 (cat3),
    area_code     INT REFERENCES area (area_code),
    sigungu_code  INT,
    FOREIGN KEY (area_code, sigungu_code) REFERENCES sigungu (area_code, sigungu_code),
    title         VARCHAR(100) NOT NULL
);
CREATE TABLE info1
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    content_id   INT REFERENCES content (id),
    zipcode      VARCHAR(255),
    address      VARCHAR(255),
    tel          VARCHAR(255),
    homepage     VARCHAR(2048),
    overview     TEXT,
    first_image1 VARCHAR(512),
    first_image2 VARCHAR(512),
    mapx         DECIMAL(13, 10),
    mapy         DECIMAL(12, 10),
    created      VARCHAR(15),
    modified     VARCHAR(15)
);
# 상세 정보 테이블
CREATE TABLE info2
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT REFERENCES content (id),
    number     INT,
    info_name  VARCHAR(32),
    info_text  TEXT
);
# 이미지 테이블
CREATE TABLE image
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    content_id   INT REFERENCES content (id),
    original_url VARCHAR(1024),
    small_url    VARCHAR(1024)
);

# 타입별 정보 테이블
# 관광지
CREATE TABLE spot_info
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    content_id        INT REFERENCES content (id),
    accom_count       VARCHAR(50),
    chk_baby_carriage VARCHAR(10),
    chk_credit_card   VARCHAR(10),
    chk_pet           VARCHAR(10),
    exp_age_range     VARCHAR(255),
    exp_guide         VARCHAR(2048),
    heritage          INT,
    parking           VARCHAR(255),
    open_date         VARCHAR(255),
    rest_date         VARCHAR(255),
    tel_center        VARCHAR(255),
    use_season        VARCHAR(255),
    use_time          VARCHAR(1024)
);
# 문화시설
CREATE TABLE culture_info
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    content_id        INT REFERENCES content (id),
    accom_count       VARCHAR(50),
    chk_baby_carriage VARCHAR(10),
    chk_credit_card   VARCHAR(10),
    chk_pet           VARCHAR(10),
    discount          VARCHAR(255),
    parking           VARCHAR(255),
    parking_fee       VARCHAR(255),
    rest_date         VARCHAR(255),
    tel_center        VARCHAR(255),
    use_fee           VARCHAR(255),
    use_time          VARCHAR(255),
    scale             VARCHAR(255),
    spend_time        VARCHAR(255)
);
# 축제/공연/행사
CREATE TABLE festival_info
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    content_id    INT REFERENCES content (id),
    age_limit     VARCHAR(20),
    booking_place VARCHAR(20),
    discount      VARCHAR(255),
    start_date    VARCHAR(255),
    end_date      VARCHAR(255),
    place         VARCHAR(255),
    place_info    VARCHAR(255),
    play_time     VARCHAR(255),
    program       VARCHAR(255),
    use_fee       VARCHAR(1024),
    spend_time    VARCHAR(255),
    sponsor1      VARCHAR(50),
    tel_sponsor1  VARCHAR(50),
    sponsor2      VARCHAR(50),
    tel_sponsor2  VARCHAR(50),
    sub_event     VARCHAR(255)
);
# 레포츠
CREATE TABLE leports_info
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    content_id        INT REFERENCES content (id),
    accom_count       VARCHAR(50),
    chk_baby_carriage VARCHAR(10),
    chk_credit_card   VARCHAR(10),
    chk_pet           VARCHAR(10),
    exp_age_range     VARCHAR(255),
    open_period       VARCHAR(255),
    parking           VARCHAR(255),
    parking_fee       VARCHAR(255),
    rest_date         VARCHAR(255),
    reservation       VARCHAR(1024),
    tel_center        VARCHAR(255),
    use_fee           VARCHAR(255),
    use_time          VARCHAR(255),
    scale             VARCHAR(255)
);
# 숙박
CREATE TABLE lodging_info
(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    content_id      INT REFERENCES content (id),
    accom_count     VARCHAR(50),
    check_in        VARCHAR(30),
    check_out       VARCHAR(30),
    chk_cooking     VARCHAR(30),
    food_place      VARCHAR(30),
    parking         VARCHAR(255),
    pickup          VARCHAR(255),
    reservation_tel VARCHAR(255),
    reservation_url VARCHAR(1024),
    tel_center      VARCHAR(255),
    scale           VARCHAR(255),
    room_count      VARCHAR(255),
    room_type       VARCHAR(255),
    sub_facility    VARCHAR(255)
);
# 숙박 상세정보
CREATE TABLE lodging_info2
(
    id                 INT PRIMARY KEY AUTO_INCREMENT,
    content_id         INT REFERENCES content (id),
    number             INT,
    title              VARCHAR(50),
    size               INT,
    room_count         INT,
    base_accom_count   INT,
    max_accom_count    INT,
    off_season_fee_wd  INT,
    peak_season_fee_wd INT,
    off_season_fee_we  INT,
    peak_season_fee_we INT,
    intro              VARCHAR(255),
    aircondition       VARCHAR(10),
    bath               VARCHAR(10),
    bath_facility      VARCHAR(10),
    cable              VARCHAR(10),
    cook               VARCHAR(10),
    hairdryer          VARCHAR(10),
    home_theater       VARCHAR(10),
    internet           VARCHAR(10),
    pc                 VARCHAR(10),
    sofa               VARCHAR(10),
    refrigerator       VARCHAR(10),
    toiletries         VARCHAR(10),
    tv                 VARCHAR(10)
);
# 숙박 상세정보 이미지
CREATE TABLE lodging_info2_img
(
    id               INT PRIMARY KEY AUTO_INCREMENT,
    content_id       INT REFERENCES content (id),
    lodging_info2_id INT REFERENCES lodging_info2 (id),
    img_url          VARCHAR(1024)
);
# 쇼핑
CREATE TABLE shopping_info
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    content_id        INT REFERENCES content (id),
    chk_baby_carriage VARCHAR(10),
    chk_credit_card   VARCHAR(10),
    chk_pet           VARCHAR(10),
    fair_day          VARCHAR(255),
    open_date         VARCHAR(255),
    open_time         VARCHAR(255),
    parking           VARCHAR(100),
    rest_date         VARCHAR(255),
    rest_room         VARCHAR(255),
    tel_center        VARCHAR(255),
    sale_item         VARCHAR(255),
    scale             VARCHAR(255),
    shop_guide        VARCHAR(1024)
);
# 음식점
CREATE TABLE food_info
(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    content_id      INT REFERENCES content (id),
    chk_credit_card VARCHAR(10),
    discount        VARCHAR(255),
    first_menu      VARCHAR(255),
    menu            VARCHAR(255),
    kids_facility   VARCHAR(255),
    open_date       VARCHAR(255),
    open_time       VARCHAR(255),
    packing         VARCHAR(255),
    parking         VARCHAR(255),
    rest_date       VARCHAR(255),
    reservation     VARCHAR(1024),
    tel_center      VARCHAR(255),
    scale           VARCHAR(255),
    seat            VARCHAR(255)
);

# 일정 테이블
CREATE TABLE itinerary
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    member_id  INT          NOT NULL REFERENCES member (id),
    name       VARCHAR(255) NOT NULL,
    start_date DATE         NOT NULL,
    end_date   DATE         NOT NULL,
    inserted   DATETIME     NOT NULL DEFAULT NOW()
);
# 일정상세 테이블
CREATE TABLE itinerary_detail
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    itinerary_id INT  NOT NULL REFERENCES itinerary (id),
    content_id   INT  NOT NULL REFERENCES content (id),
    description  VARCHAR(512),
    visit_day    INT  NOT NULL,
    visit_time   TIME NOT NULL DEFAULT ('00:00:00')
);

# 리뷰 테이블
CREATE TABLE review
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT          NOT NULL REFERENCES content (id),
    member_id  INT          NOT NULL REFERENCES member (id),
    rating     INT          NOT NULL,
    review     VARCHAR(500) NOT NULL,
    inserted   DATETIME     NOT NULL DEFAULT NOW()
);