-- ================================================
-- 안전거래 장소 + 중고거래 고도화 마이그레이션
-- 작성일: 2026-01-12
-- 목적: 안전거래 장소, 채팅, 분쟁 신고 시스템
-- ================================================

-- 1. 안전거래 장소 테이블
CREATE TABLE IF NOT EXISTS safe_trade_places (
  place_id        TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL,
  -- POLICE: 경찰서/파출소
  -- GOV: 시청/행정복지센터
  -- CCTV: CCTV 다중 설치 공영공간
  address         TEXT NOT NULL,
  address_detail  TEXT,
  lat             REAL NOT NULL,
  lng             REAL NOT NULL,
  has_cctv        INTEGER DEFAULT 1,
  open_hours      TEXT,
  parking         INTEGER DEFAULT 1,
  verified_by     TEXT,
  city_code       TEXT DEFAULT 'gyeongsan',
  status          TEXT DEFAULT 'ACTIVE',
  -- ACTIVE: 활성
  -- INACTIVE: 비활성
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 중고거래 아이템 테이블 확장
CREATE TABLE IF NOT EXISTS trade_items (
  item_id         TEXT PRIMARY KEY,
  seller_id       TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  price           INTEGER DEFAULT 0,
  category        TEXT,
  is_free         INTEGER DEFAULT 0,
  -- 0: 일반 중고
  -- 1: 무료나눔
  images          TEXT,
  -- JSON array of image URLs
  status          TEXT DEFAULT 'AVAILABLE',
  -- AVAILABLE: 판매중
  -- CHATTING: 채팅중
  -- PLACE_SELECTED: 장소선택됨
  -- COMPLETED: 거래완료
  -- CANCELED: 취소
  safe_place_id   TEXT,
  city_code       TEXT DEFAULT 'gyeongsan',
  view_count      INTEGER DEFAULT 0,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (safe_place_id) REFERENCES safe_trade_places(place_id)
);

-- 3. 채팅방 테이블
CREATE TABLE IF NOT EXISTS chat_rooms (
  room_id         TEXT PRIMARY KEY,
  item_id         TEXT NOT NULL,
  seller_id       TEXT NOT NULL,
  buyer_id        TEXT NOT NULL,
  safe_place_id   TEXT,
  status          TEXT DEFAULT 'ACTIVE',
  -- ACTIVE: 진행중
  -- PLACE_SELECTED: 장소선택됨
  -- COMPLETED: 완료
  -- CANCELED: 취소
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES trade_items(item_id),
  FOREIGN KEY (safe_place_id) REFERENCES safe_trade_places(place_id)
);

-- 4. 채팅 메시지 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
  message_id      TEXT PRIMARY KEY,
  room_id         TEXT NOT NULL,
  sender_id       TEXT NOT NULL,
  message_type    TEXT DEFAULT 'TEXT',
  -- TEXT: 일반 메시지
  -- SYSTEM: 시스템 메시지
  -- PLACE: 장소 선택 알림
  content         TEXT NOT NULL,
  is_read         INTEGER DEFAULT 0,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id)
);

-- 5. 분쟁 신고 테이블
CREATE TABLE IF NOT EXISTS trade_disputes (
  dispute_id      TEXT PRIMARY KEY,
  trade_item_id   TEXT NOT NULL,
  room_id         TEXT,
  reporter_id     TEXT NOT NULL,
  reported_id     TEXT NOT NULL,
  reason_type     TEXT NOT NULL,
  -- NO_CONTACT: 연락 두절
  -- NO_SHOW: 약속 불이행
  -- FRAUD: 금전 요구/사기 의심
  -- THREAT: 폭언/위협
  -- OTHER: 기타
  reason_detail   TEXT,
  evidence        TEXT,
  -- JSON: 채팅 로그, 스크린샷 등
  status          TEXT DEFAULT 'RECEIVED',
  -- RECEIVED: 접수
  -- REVIEWING: 검토중
  -- SENT_TO_POLICE: 경찰 전달
  -- SENT_TO_GOV: 행정 전달
  -- RESOLVED: 해결
  -- CLOSED: 종료
  handed_to       TEXT,
  resolution      TEXT,
  admin_note      TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at     DATETIME,
  FOREIGN KEY (trade_item_id) REFERENCES trade_items(item_id),
  FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id)
);

-- 6. 로컬푸드 생산자 테이블
CREATE TABLE IF NOT EXISTS local_food_farms (
  farm_id         TEXT PRIMARY KEY,
  farm_name       TEXT NOT NULL,
  farmer_name     TEXT NOT NULL,
  phone           TEXT,
  address         TEXT,
  certification   TEXT,
  -- ORGANIC: 유기농
  -- PESTICIDE_FREE: 무농약
  -- LOCAL: 지역 농산물
  city_code       TEXT DEFAULT 'gyeongsan',
  is_verified     INTEGER DEFAULT 0,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. 로컬푸드 상품 테이블
CREATE TABLE IF NOT EXISTS local_food_products (
  product_id      TEXT PRIMARY KEY,
  farm_id         TEXT NOT NULL,
  product_name    TEXT NOT NULL,
  description     TEXT,
  price           INTEGER NOT NULL,
  unit            TEXT,
  -- kg, 개, 박스 등
  today_stock     INTEGER DEFAULT 0,
  harvest_date    TEXT,
  -- 수확일
  category        TEXT,
  images          TEXT,
  is_available    INTEGER DEFAULT 1,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farm_id) REFERENCES local_food_farms(farm_id)
);

-- 8. 로컬푸드 주문 확장 (orders 테이블 업데이트용)
-- 주문 타입 구분을 위한 컬럼 추가 (ALTER 문은 실제 실행 시 사용)
-- ALTER TABLE orders ADD COLUMN order_type TEXT DEFAULT 'DELIVERY';
-- ALTER TABLE orders ADD COLUMN delivery_date TEXT;
-- ALTER TABLE orders ADD COLUMN farm_id TEXT;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_safe_places_city ON safe_trade_places(city_code, status);
CREATE INDEX IF NOT EXISTS idx_trade_items_seller ON trade_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_trade_items_status ON trade_items(status);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_item ON chat_rooms(item_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON trade_disputes(status);
CREATE INDEX IF NOT EXISTS idx_local_products_farm ON local_food_products(farm_id);
