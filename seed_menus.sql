-- ================================================
-- 샘플 메뉴 데이터 (시드 데이터)
-- ================================================

-- 경산 전통 한정식 메뉴
INSERT OR IGNORE INTO menus (menu_id, store_id, menu_name, description, price, category, is_available) VALUES
('MENU-001', 'STORE-001', '한우 불고기 정식', '국내산 한우로 만든 불고기 정식', 18000, '한식', 1),
('MENU-002', 'STORE-001', '제육볶음 정식', '돼지고기와 신선한 채소로 만든 제육볶음', 12000, '한식', 1),
('MENU-003', 'STORE-001', '김치찌개', '묵은지로 끓인 얼큰한 김치찌개', 8000, '한식', 1),
('MENU-004', 'STORE-001', '된장찌개', '집된장으로 끓인 된장찌개', 8000, '한식', 1),
('MENU-005', 'STORE-001', '비빔밥', '신선한 나물과 고추장이 어우러진 비빔밥', 10000, '한식', 1);

-- 경산 대추 한과 메뉴
INSERT OR IGNORE INTO menus (menu_id, store_id, menu_name, description, price, category, is_available) VALUES
('MENU-011', 'STORE-002', '경산 대추 세트', '경산 특산 대추 1kg', 25000, '특산물', 1),
('MENU-012', 'STORE-002', '대추 한과 세트', '대추를 넣어 만든 전통 한과', 15000, '특산물', 1),
('MENU-013', 'STORE-002', '대추차', '깊은 맛의 대추차 (30티백)', 12000, '특산물', 1);

-- 전통시장 야채 메뉴
INSERT OR IGNORE INTO menus (menu_id, store_id, menu_name, description, price, category, is_available) VALUES
('MENU-021', 'MARKET-001', '계절 채소 꾸러미', '제철 채소 모음 (5종)', 15000, '채소', 1),
('MENU-022', 'MARKET-001', '감자 5kg', '경북산 햇감자', 10000, '채소', 1),
('MENU-023', 'MARKET-001', '양파 3kg', '국산 햇양파', 6000, '채소', 1);

-- 로컬푸드 메뉴
INSERT OR IGNORE INTO menus (menu_id, store_id, menu_name, description, price, category, is_available) VALUES
('MENU-031', 'LOCAL-001', '당일 수확 상추', '오늘 아침 수확한 신선한 상추', 5000, '로컬푸드', 1),
('MENU-032', 'LOCAL-001', '유기농 방울토마토', '무농약 방울토마토 500g', 8000, '로컬푸드', 1),
('MENU-033', 'LOCAL-001', '경산 딸기', '경산에서 재배한 신선한 딸기 1kg', 20000, '로컬푸드', 1);
