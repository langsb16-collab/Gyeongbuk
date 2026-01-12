// 샘플 데이터 - 경북 공공상생 플랫폼

// 지자체 목록
export const cities = [
  { id: 'gyeongsan', name: '경산시', status: '시범운영' },
  { id: 'pohang', name: '포항시', status: '준비중' },
  { id: 'gumi', name: '구미시', status: '준비중' },
  { id: 'andong', name: '안동시', status: '준비중' }
];

// 음식점 카테고리
export const restaurantCategories = [
  { id: 'korean', name: '한식', icon: '🍚' },
  { id: 'chinese', name: '중식', icon: '🍜' },
  { id: 'japanese', name: '일식', icon: '🍱' },
  { id: 'western', name: '양식', icon: '🍝' },
  { id: 'cafe', name: '카페', icon: '☕' },
  { id: 'chicken', name: '치킨', icon: '🍗' },
  { id: 'pizza', name: '피자', icon: '🍕' },
  { id: 'snack', name: '분식', icon: '🥟' }
];

// 음식점 목록
export const restaurants = [
  {
    id: 1,
    name: '경산 전통 한정식',
    category: 'korean',
    rating: 4.8,
    reviews: 127,
    deliveryTime: '30-40분',
    deliveryFee: 0,
    minOrder: 15000,
    image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400',
    badges: ['공공추천맛집', '지역화폐', '위생우수'],
    description: '경산 로컬 식재료로 만드는 정갈한 한정식'
  },
  {
    id: 2,
    name: '중앙시장 떡볶이',
    category: 'snack',
    rating: 4.9,
    reviews: 243,
    deliveryTime: '20-30분',
    deliveryFee: 0,
    minOrder: 8000,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    badges: ['전통시장', '착한가격', '시보조배달'],
    description: '50년 전통의 중앙시장 떡볶이 명가'
  },
  {
    id: 3,
    name: '로컬 치킨',
    category: 'chicken',
    rating: 4.7,
    reviews: 189,
    deliveryTime: '25-35분',
    deliveryFee: 0,
    minOrder: 16000,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    badges: ['청년소상공인', '지역화폐'],
    description: '국내산 닭으로 튀긴 건강한 치킨'
  },
  {
    id: 4,
    name: '시골밥상',
    category: 'korean',
    rating: 4.9,
    reviews: 312,
    deliveryTime: '30-40분',
    deliveryFee: 0,
    minOrder: 12000,
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400',
    badges: ['로컬푸드', '당일수확', '농가직배송'],
    description: '오늘 아침 수확한 신선한 채소로 만드는 건강 밥상'
  },
  {
    id: 5,
    name: '경산 커피 로스터스',
    category: 'cafe',
    rating: 4.6,
    reviews: 98,
    deliveryTime: '15-25분',
    deliveryFee: 0,
    minOrder: 5000,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    badges: ['로컬브랜드', '공정무역'],
    description: '직접 로스팅한 신선한 원두 커피'
  },
  {
    id: 6,
    name: '피자 공방',
    category: 'pizza',
    rating: 4.8,
    reviews: 156,
    deliveryTime: '30-40분',
    deliveryFee: 0,
    minOrder: 18000,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    badges: ['수제피자', '지역화폐'],
    description: '매일 아침 반죽하는 수제 화덕 피자'
  }
];

// 전통시장 상품
export const marketProducts = [
  {
    id: 1,
    shopName: '김씨네 반찬가게',
    product: '모듬 반찬 세트',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    category: '반찬',
    market: '중앙시장'
  },
  {
    id: 2,
    shopName: '과일나라',
    product: '제철 과일 박스',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
    category: '과일',
    market: '중앙시장'
  },
  {
    id: 3,
    shopName: '정육점 한우마을',
    product: '국내산 한우 세트',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
    category: '정육',
    market: '중앙시장'
  },
  {
    id: 4,
    shopName: '푸른 채소',
    product: '유기농 채소 꾸러미',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    category: '채소',
    market: '서부시장'
  }
];

// 로컬푸드 상품
export const localFoods = [
  {
    id: 1,
    farmName: '김농부 농장',
    product: '유기농 쌀 10kg',
    price: 35000,
    harvest: '당일수확',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    region: '경산시 와촌면',
    certification: ['유기농', '무농약', '친환경']
  },
  {
    id: 2,
    farmName: '햇살 농원',
    product: '제철 토마토 3kg',
    price: 15000,
    harvest: '당일수확',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
    region: '경산시 남천면',
    certification: ['무농약', '친환경']
  },
  {
    id: 3,
    farmName: '산골 양봉',
    product: '야생화 꿀 1kg',
    price: 28000,
    harvest: '이번주 채취',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784210?w=400',
    region: '경산시 자인면',
    certification: ['유기농', '무항생제']
  },
  {
    id: 4,
    farmName: '푸른 들판',
    product: '무농약 시금치 2kg',
    price: 8000,
    harvest: '당일수확',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    region: '경산시 압량면',
    certification: ['무농약']
  }
];

// 중고거래 상품
export const usedItems = [
  {
    id: 1,
    title: '삼성 냉장고 (2021년형)',
    price: 150000,
    location: '경산시 중방동',
    category: '가전제품',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
    seller: '김**',
    time: '10분 전',
    status: '판매중',
    safeZone: true
  },
  {
    id: 2,
    title: '아이폰 13 Pro (128GB)',
    price: 550000,
    location: '경산시 사동',
    category: '디지털/가전',
    image: 'https://images.unsplash.com/photo-1592286927505-b75c1a6a1beb?w=400',
    seller: '이**',
    time: '1시간 전',
    status: '판매중',
    safeZone: true
  },
  {
    id: 3,
    title: '유아용 자전거 (거의 새것)',
    price: 80000,
    location: '경산시 옥산동',
    category: '유아동',
    image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400',
    seller: '박**',
    time: '3시간 전',
    status: '판매중',
    safeZone: false
  },
  {
    id: 4,
    title: '책상 의자 세트',
    price: 100000,
    location: '경산시 하양읍',
    category: '가구/인테리어',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400',
    seller: '최**',
    time: '5시간 전',
    status: '판매중',
    safeZone: true
  }
];

// 무료나눔 상품
export const freeItems = [
  {
    id: 1,
    title: '아기옷 (6-12개월)',
    location: '경산시 중방동',
    category: '유아동',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
    donor: '김**',
    time: '30분 전',
    status: '나눔가능'
  },
  {
    id: 2,
    title: '소설책 10권',
    location: '경산시 사동',
    category: '도서',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    donor: '이**',
    time: '2시간 전',
    status: '나눔가능'
  },
  {
    id: 3,
    title: '화분 5개',
    location: '경산시 옥산동',
    category: '생활/가전',
    image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400',
    donor: '박**',
    time: '4시간 전',
    status: '나눔가능'
  }
];

// 안전거래 장소
export const safeZones = [
  {
    id: 1,
    name: '경산시청',
    type: 'city_hall',
    address: '경상북도 경산시 동부로 430',
    lat: 35.8253,
    lng: 128.7417,
    facilities: ['CCTV', '주차장', '화장실'],
    hours: '09:00-18:00 (주말 휴무)'
  },
  {
    id: 2,
    name: '경산경찰서',
    type: 'police',
    address: '경상북도 경산시 원효로 67',
    lat: 35.8231,
    lng: 128.7389,
    facilities: ['CCTV', '주차장', '24시간'],
    hours: '24시간 운영'
  },
  {
    id: 3,
    name: '중앙파출소',
    type: 'police',
    address: '경상북도 경산시 중앙동',
    lat: 35.8198,
    lng: 128.7401,
    facilities: ['CCTV', '24시간'],
    hours: '24시간 운영'
  },
  {
    id: 4,
    name: '중방동 행정복지센터',
    type: 'community',
    address: '경상북도 경산시 중방동',
    lat: 35.8267,
    lng: 128.7423,
    facilities: ['CCTV', '주차장', '화장실'],
    hours: '09:00-18:00 (주말 휴무)'
  },
  {
    id: 5,
    name: '사동 행정복지센터',
    type: 'community',
    address: '경상북도 경산시 사동',
    lat: 35.8145,
    lng: 128.7512,
    facilities: ['CCTV', '주차장', '화장실'],
    hours: '09:00-18:00 (주말 휴무)'
  },
  {
    id: 6,
    name: '하양경찰서',
    type: 'police',
    address: '경상북도 경산시 하양읍',
    lat: 35.9123,
    lng: 128.8201,
    facilities: ['CCTV', '주차장', '24시간'],
    hours: '24시간 운영'
  }
];

// 쿠폰 목록
export const coupons = [
  {
    id: 1,
    title: '경산 전통시장 5천원 할인',
    discount: 5000,
    minOrder: 30000,
    validUntil: '2026-02-28',
    type: 'market'
  },
  {
    id: 2,
    title: '로컬푸드 10% 할인',
    discount: '10%',
    minOrder: 20000,
    validUntil: '2026-03-31',
    type: 'localfood'
  },
  {
    id: 3,
    title: '첫 주문 무료배달',
    discount: '무료배달',
    minOrder: 10000,
    validUntil: '2026-01-31',
    type: 'delivery'
  }
];

// 통계 데이터
export const statistics = {
  totalOrders: 15234,
  savingsForMerchants: 892000000,
  localCurrencyUsage: 3420000000,
  wasteReduction: 12.5,
  activeUsers: 8932,
  merchantCount: 234
};
