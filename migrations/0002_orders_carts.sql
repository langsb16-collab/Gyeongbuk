-- ================================================
-- 주문/장바구니 시스템 마이그레이션
-- 작성일: 2026-01-12
-- 목적: 실제 주문 기능 구현
-- ================================================

-- 1. 장바구니 테이블
CREATE TABLE IF NOT EXISTS carts (
  cart_id        TEXT PRIMARY KEY,
  user_id        TEXT,
  store_id       TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'TEMP',
  -- TEMP: 메뉴보기로 담은 상태
  -- READY: 주문하기 눌러 결제 준비
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 장바구니 아이템 테이블
CREATE TABLE IF NOT EXISTS cart_items (
  cart_item_id   TEXT PRIMARY KEY,
  cart_id        TEXT NOT NULL,
  menu_id        TEXT NOT NULL,
  menu_name      TEXT NOT NULL,
  price          INTEGER NOT NULL,
  quantity       INTEGER NOT NULL DEFAULT 1,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE
);

-- 3. 주문 테이블
CREATE TABLE IF NOT EXISTS orders (
  order_id         TEXT PRIMARY KEY,
  user_id          TEXT,
  store_id         TEXT NOT NULL,
  cart_id          TEXT,
  
  -- 주문 상태
  order_status     TEXT NOT NULL DEFAULT 'CREATED',
  -- CREATED: 주문 생성
  -- PAID: 결제 완료
  -- COOKING: 조리 중
  -- DELIVERING: 배달 중
  -- COMPLETED: 완료
  -- CANCELED: 취소
  
  -- 금액
  subtotal_amount  INTEGER NOT NULL,
  delivery_fee     INTEGER NOT NULL DEFAULT 0,
  discount_amount  INTEGER DEFAULT 0,
  total_amount     INTEGER NOT NULL,
  
  -- 무료배달 여부
  free_delivery    INTEGER DEFAULT 1,
  
  -- 배달 정보
  delivery_address TEXT,
  delivery_phone   TEXT,
  delivery_request TEXT,
  
  -- 타임스탬프
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at          DATETIME,
  completed_at     DATETIME,
  canceled_at      DATETIME,
  
  -- 메타
  cancel_reason    TEXT
);

-- 4. 주문 아이템 테이블
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id   TEXT PRIMARY KEY,
  order_id        TEXT NOT NULL,
  menu_id         TEXT NOT NULL,
  menu_name       TEXT NOT NULL,
  price           INTEGER NOT NULL,
  quantity        INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 5. 결제 테이블
CREATE TABLE IF NOT EXISTS payments (
  payment_id      TEXT PRIMARY KEY,
  order_id        TEXT NOT NULL,
  method          TEXT NOT NULL,
  -- CARD: 카드
  -- KAKAO_PAY: 카카오페이
  -- NAVER_PAY: 네이버페이
  -- TOSS: 토스
  -- LOCAL_CURRENCY: 지역화폐
  amount          INTEGER NOT NULL,
  status          TEXT NOT NULL DEFAULT 'REQUESTED',
  -- REQUESTED: 결제 요청
  -- PAID: 결제 완료
  -- FAILED: 결제 실패
  -- REFUNDED: 환불 완료
  pg_tid          TEXT,
  pg_response     TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at         DATETIME,
  refunded_at     DATETIME,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- 6. 무료배달 예산 관리 테이블
CREATE TABLE IF NOT EXISTS delivery_budget (
  budget_id       TEXT PRIMARY KEY,
  date            TEXT NOT NULL,
  total_budget    INTEGER NOT NULL,
  used_budget     INTEGER DEFAULT 0,
  remaining_budget INTEGER,
  is_active       INTEGER DEFAULT 1,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date)
);

-- 7. 무료배달 사용 로그
CREATE TABLE IF NOT EXISTS delivery_support_logs (
  log_id          TEXT PRIMARY KEY,
  order_id        TEXT NOT NULL,
  store_id        TEXT NOT NULL,
  support_amount  INTEGER NOT NULL,
  budget_date     TEXT NOT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- 8. 메뉴 테이블 (가게별 메뉴)
CREATE TABLE IF NOT EXISTS menus (
  menu_id         TEXT PRIMARY KEY,
  store_id        TEXT NOT NULL,
  menu_name       TEXT NOT NULL,
  description     TEXT,
  price           INTEGER NOT NULL,
  category        TEXT,
  is_available    INTEGER DEFAULT 1,
  image_url       TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_store_id ON carts(store_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_menus_store_id ON menus(store_id);

-- 초기 예산 데이터 (오늘)
INSERT OR IGNORE INTO delivery_budget (
  budget_id,
  date,
  total_budget,
  used_budget,
  remaining_budget,
  is_active
) VALUES (
  'BUDGET-' || date('now'),
  date('now'),
  1000000,
  0,
  1000000,
  1
);
