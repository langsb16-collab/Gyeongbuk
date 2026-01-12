-- ================================================
-- 경산시 안전거래 장소 시드 데이터
-- 작성일: 2026-01-12
-- 목적: 시범 운영용 대표 안전거래 장소 8곳
-- ================================================

-- 경산시 대표 안전거래 장소 (초기 시범용)
INSERT OR IGNORE INTO safe_trade_places (
  place_id, name, type, address, address_detail, lat, lng, has_cctv, open_hours, parking, verified_by, city_code, status
) VALUES
-- 경찰서/파출소 (3곳)
('SAFE-P-001', '경산경찰서 민원실 앞', 'POLICE', '경북 경산시 중앙로 80', '1층 민원실 앞 광장', 35.8252, 128.7417, 1, '24시간', 1, '경산경찰서', 'gyeongsan', 'ACTIVE'),
('SAFE-P-002', '중앙파출소 앞', 'POLICE', '경북 경산시 중앙시장길 15', '중앙시장 인근', 35.8265, 128.7405, 1, '24시간', 1, '경산경찰서', 'gyeongsan', 'ACTIVE'),
('SAFE-P-003', '하양파출소 앞', 'POLICE', '경북 경산시 하양읍 하양로 31', '하양읍사무소 인근', 35.9137, 128.8193, 1, '24시간', 1, '경산경찰서', 'gyeongsan', 'ACTIVE'),

-- 시청/행정복지센터 (2곳)
('SAFE-G-001', '경산시청 민원실 앞', 'GOV', '경북 경산시 시청로 1', '1층 민원실 앞', 35.8250, 128.7411, 1, '평일 09:00-18:00', 1, '경산시청', 'gyeongsan', 'ACTIVE'),
('SAFE-G-002', '중앙동 행정복지센터', 'GOV', '경북 경산시 원효로 80', '1층 로비', 35.8255, 128.7420, 1, '평일 09:00-18:00', 1, '경산시청', 'gyeongsan', 'ACTIVE'),

-- CCTV 다중 설치 공영공간 (3곳)
('SAFE-C-001', '중앙시장 공영주차장', 'CCTV', '경북 경산시 중앙시장길 20', 'A동 주차장', 35.8270, 128.7400, 1, '06:00-22:00', 1, '경산시청', 'gyeongsan', 'ACTIVE'),
('SAFE-C-002', '하양역 공영주차장', 'CCTV', '경북 경산시 하양읍 하양역로 10', '역 광장', 35.9145, 128.8200, 1, '05:00-24:00', 1, '경산시청', 'gyeongsan', 'ACTIVE'),
('SAFE-C-003', '시민회관 광장', 'CCTV', '경북 경산시 시민로 50', '야외 광장', 35.8240, 128.7430, 1, '06:00-22:00', 1, '경산시청', 'gyeongsan', 'ACTIVE');

-- 샘플 중고거래 아이템
INSERT OR IGNORE INTO trade_items (
  item_id, seller_id, title, description, price, category, is_free, status, city_code
) VALUES
('TRADE-001', 'USER-001', '삼성 냉장고 (2021년형)', '이사로 인한 급매. 깨끗하게 사용했습니다.', 150000, '가전', 0, 'AVAILABLE', 'gyeongsan'),
('TRADE-002', 'USER-002', '아이폰 13 Pro (128GB)', '기스 없고 배터리 성능 95%', 550000, '전자기기', 0, 'AVAILABLE', 'gyeongsan'),
('TRADE-003', 'USER-003', '무료나눔 - 유아용 자전거', '아이가 커서 더 이상 사용하지 않습니다. 무료로 드립니다.', 0, '유아용품', 1, 'AVAILABLE', 'gyeongsan'),
('TRADE-004', 'USER-004', '책상 의자 세트', '사무용 책상과 의자 세트입니다.', 100000, '가구', 0, 'AVAILABLE', 'gyeongsan'),
('TRADE-005', 'USER-005', '유아용 자전거 (지역명)', '지역 내 직거래합니다.', 80000, '자전거', 0, 'AVAILABLE', 'gyeongsan');

-- 샘플 로컬푸드 생산자
INSERT OR IGNORE INTO local_food_farms (
  farm_id, farm_name, farmer_name, phone, address, certification, city_code, is_verified
) VALUES
('FARM-001', '경산 유기농 농장', '김농부', '010-1234-5678', '경북 경산시 와촌면', 'ORGANIC', 'gyeongsan', 1),
('FARM-002', '하양 포도 농원', '이농부', '010-2345-6789', '경북 경산시 하양읍', 'LOCAL', 'gyeongsan', 1),
('FARM-003', '경산 대추 농장', '박농부', '010-3456-7890', '경북 경산시 압량면', 'PESTICIDE_FREE', 'gyeongsan', 1);

-- 샘플 로컬푸드 상품
INSERT OR IGNORE INTO local_food_products (
  product_id, farm_id, product_name, description, price, unit, today_stock, harvest_date, category, is_available
) VALUES
('LOCAL-001', 'FARM-001', '당일 수확 상추', '오늘 아침에 수확한 신선한 상추입니다.', 5000, '1kg', 20, date('now'), '채소', 1),
('LOCAL-002', 'FARM-001', '유기농 방울토마토', '무농약 방울토마토 500g', 8000, '500g', 15, date('now'), '과일', 1),
('LOCAL-003', 'FARM-003', '경산 대추', '경산에서 재배한 신선한 대추 1kg', 20000, '1kg', 30, date('now'), '특산물', 1),
('LOCAL-004', 'FARM-002', '하양 포도', '샤인머스캣 포도 2kg', 35000, '2kg', 10, date('now'), '과일', 1);
