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
  merchantCount: 234,
  pendingMerchants: 47,
  previewMerchants: 153
};

// 가맹점 신청 샘플 데이터 (사전 등록용 - 시민 앱용)
export const previewMerchants = [
  {
    id: 1,
    businessName: '경산김밥',
    ownerName: '홍길동',
    businessNumber: '123-45-67890',
    address: '경상북도 경산시 중앙로 123',
    phone: '053-811-1234',
    status: 'PENDING_ACTIVE',
    submittedAt: '2026-01-12T09:30:00',
    category: 'snack'
  },
  {
    id: 2,
    businessName: '맛나 분식',
    ownerName: '김영희',
    businessNumber: '234-56-78901',
    address: '경상북도 경산시 사동 45',
    phone: '010-1234-5678',
    status: 'APPLIED',
    submittedAt: '2026-01-12T10:15:00',
    category: 'snack'
  },
  {
    id: 3,
    businessName: '전통 순대국',
    ownerName: '박철수',
    businessNumber: '345-67-89012',
    address: '경상북도 경산시 중앙시장 내',
    phone: '053-812-3456',
    status: 'CONSENTED_PREVIEW',
    submittedAt: '2026-01-11T14:20:00',
    category: 'korean'
  }
];

// 가맹점 신청 데이터 (관리자 대시보드용)
export const merchantApplications = {
  success: true,
  total: 3,
  data: [
    {
      id: 1001,
      businessName: '경산 전통 한정식',
      ownerName: '김영희',
      businessNumber: '123-45-67890',
      address: '경북 경산시 중앙동 123-45',
      phone: '053-111-2222',
      city: 'gyeongsan',
      status: 'PENDING_ACTIVE',
      appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      ocrConfidence: 92,
      documentUrl: '/uploads/cert_1001.jpg'
    },
    {
      id: 1002,
      businessName: '중앙시장 떡볶이',
      ownerName: '박철수',
      businessNumber: '234-56-78901',
      address: '경북 경산시 중앙시장 3길 12',
      phone: '053-222-3333',
      city: 'gyeongsan',
      status: 'ACTIVE',
      appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      ocrConfidence: 88,
      documentUrl: '/uploads/cert_1002.jpg'
    },
    {
      id: 1003,
      businessName: '포항 로컬푸드 직판장',
      ownerName: '이순자',
      businessNumber: '345-67-89012',
      address: '경북 포항시 북구 123번지',
      phone: '054-333-4444',
      city: 'pohang',
      status: 'PENDING_ACTIVE',
      appliedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      ocrConfidence: 75,
      documentUrl: '/uploads/cert_1003.jpg',
      needsReview: true
    }
  ]
};

// 경산 특산물 데이터
export const gyeongsanSpecialties = [
  {
    id: 1,
    name: '경산 대추',
    category: 'jujube',
    description: '지리적표시 등록 상품, 경산의 대표 특산물',
    season: '가을 (9-11월)',
    price: 39000,
    unit: '1kg',
    image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400',
    badges: ['지리적표시', '당일출고', '선물추천'],
    inStock: true,
    farmDirect: true
  },
  {
    id: 2,
    name: '경산 포도 (거봉)',
    category: 'grape',
    description: '시설포도 강점, 청포도 생산 확대',
    season: '여름-가을 (7-10월)',
    price: 45000,
    unit: '2kg',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400',
    badges: ['시설재배', '당일배송', '선물세트'],
    inStock: true,
    farmDirect: true
  },
  {
    id: 3,
    name: '경산 복숭아 (천도)',
    category: 'peach',
    description: '경산 복숭아 주산지, 천도복숭아 명품',
    season: '여름 (6-8월)',
    price: 38000,
    unit: '2kg',
    image: 'https://images.unsplash.com/photo-1629828874514-a4e2c7e8f963?w=400',
    badges: ['주산지', '당일수확', '프리미엄'],
    inStock: false,
    farmDirect: true
  },
  {
    id: 4,
    name: '경산 자두',
    category: 'plum',
    description: '경산 자두, 신선하고 달콤한 맛',
    season: '여름 (6-7월)',
    price: 32000,
    unit: '2kg',
    image: 'https://images.unsplash.com/photo-1593105813562-7ac64418c7d3?w=400',
    badges: ['신선', '농가직송', '가성비'],
    inStock: false,
    farmDirect: true
  }
];

// 관광지 데이터
export const touristSpots = [
  {
    id: 1,
    name: '팔공산 갓바위',
    type: 'mountain',
    address: '경상북도 경산시 와촌면 갓바위로 181',
    description: '팔공산의 대표 유적, 갓바위 석불',
    lat: 35.9753,
    lng: 128.6891,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    facilities: ['주차장', '화장실', '매점', '안내소'],
    qrEnabled: true,
    specialtyLink: true
  },
  {
    id: 2,
    name: '반곡지',
    type: 'lake',
    address: '경상북도 경산시 반곡동',
    description: '경산 가볼만한 곳, 아름다운 저수지',
    lat: 35.8389,
    lng: 128.7428,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    facilities: ['주차장', '포토존', '산책로'],
    qrEnabled: true,
    specialtyLink: true
  },
  {
    id: 3,
    name: '자인계정숲',
    type: 'forest',
    address: '경상북도 경산시 자인면',
    description: '경산 베스트 10 관광지',
    lat: 35.7856,
    lng: 128.7542,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    facilities: ['주차장', '화장실', '쉼터'],
    qrEnabled: true,
    specialtyLink: true
  }
];

// 축제 정보
export const festivals = [
  {
    id: 1,
    name: '경산 대추축제 & 농산물 한마당',
    date: '2025.10.17~10.19',
    location: '경산시 일원',
    description: '경산 대추와 농산물을 한자리에',
    specialEvents: ['대추 할인판매', '농산물 경매', '체험 프로그램'],
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400'
  }
];

// 챗봇 FAQ 데이터
export const chatbotFAQ = {
  categories: [
    {
      id: 'citizen',
      title: '시민용 (이용자)',
      icon: 'fa-user',
      questions: [
        { q: '이 앱은 무엇인가요?', a: '경산시에서 운영하는 무료배달·로컬푸드 공공 플랫폼입니다.' },
        { q: '정말 배달비가 무료인가요?', a: '네. 참여 가맹점은 배달비 없이 주문할 수 있습니다. (일부 조건 제외)' },
        { q: '수수료는 없나요?', a: '시민과 가맹점 모두 중개 수수료 0원입니다.' },
        { q: '어떤 가게를 주문할 수 있나요?', a: '전통시장, 동네 음식점, 로컬푸드 농가 등 경산 지역 가게입니다.' },
        { q: '전통시장도 한 번에 주문할 수 있나요?', a: '네. 여러 점포를 한 번에 묶음 주문할 수 있습니다.' },
        { q: '로컬푸드는 어떤 상품인가요?', a: '경산에서 생산된 농산물로 당일 수확·당일 배송이 가능한 상품입니다.' },
        { q: '관광객도 사용할 수 있나요?', a: '네. 회원가입 없이도 상품 보기는 가능하며, 주문은 간단 가입 후 가능합니다.' },
        { q: '지역화폐 사용이 가능한가요?', a: '네. 경산 지역화폐 결제가 가능합니다.' },
        { q: '주문하면 언제 도착하나요?', a: '보통 당일 또는 익일 배송됩니다. 상품별로 다를 수 있습니다.' },
        { q: '주문 취소는 어떻게 하나요?', a: '\'내 주문\'에서 출고 전까지 무료 취소가 가능합니다.' },
        { q: '상품에 문제가 있으면 어떻게 하나요?', a: '사진과 함께 신고하면 관리자가 바로 처리합니다.' },
        { q: '고령자도 사용하기 쉬운가요?', a: '네. 큰 글씨, 단순 화면으로 설계되어 있습니다.' },
        { q: '회원가입이 복잡한가요?', a: '아닙니다. 전화번호만으로 간단 가입이 가능합니다.' },
        { q: '쿠폰이나 혜택이 있나요?', a: '관광지 QR, 장날, 로컬푸드 구매 시 자동 혜택이 제공됩니다.' },
        { q: '다른 지역에서도 사용할 수 있나요?', a: '현재는 경산시 시범 운영 중이며, 포항·구미·안동으로 확대 예정입니다.' }
      ]
    },
    {
      id: 'merchant',
      title: '가맹점용 (사장님)',
      icon: 'fa-store',
      questions: [
        { q: '가맹비가 있나요?', a: '없습니다. 가맹비·수수료 모두 0원입니다.' },
        { q: '어떻게 가맹 신청하나요?', a: '사업자등록증 사진 1장만 찍어 올리면 됩니다.' },
        { q: '메뉴 등록도 해야 하나요?', a: '아닙니다. 나중에 등록하셔도 됩니다.' },
        { q: '휴대폰 사용이 어려운데 괜찮을까요?', a: '네. 현장 등록 모드로 직원이 대신 등록해 드립니다.' },
        { q: '언제부터 주문을 받을 수 있나요?', a: '보통 24시간 이내 승인 후 바로 가능합니다.' },
        { q: '배달은 누가 하나요?', a: '지역 배달망 또는 묶음배송으로 진행됩니다.' },
        { q: '정산은 어떻게 되나요?', a: '주문 금액은 정기적으로 자동 정산됩니다.' },
        { q: '사진이 흐리게 찍혔어요. 다시 찍어야 하나요?', a: '아닙니다. 관리자가 직접 확인합니다.' },
        { q: '전통시장 상인도 참여할 수 있나요?', a: '네. 전통시장 상인은 우선 참여 대상입니다.' },
        { q: '장날에 혜택이 있나요?', a: '네. 장날에는 우선 노출·묶음배송이 적용됩니다.' },
        { q: '여러 점포를 한 번에 등록할 수 있나요?', a: '네. 상인회 단위 등록이 가능합니다.' },
        { q: '가게 정보가 틀리면 어떻게 하나요?', a: '관리자에게 요청하면 즉시 수정됩니다.' },
        { q: '가입 후 비용이 생기나요?', a: '아닙니다. 계속 무료입니다.' },
        { q: '나중에 탈퇴할 수 있나요?', a: '네. 언제든 자유롭게 탈퇴하실 수 있습니다.' },
        { q: '문의는 어디로 하나요?', a: '앱 내 \'문의하기\' 또는 전화 상담이 가능합니다.' }
      ]
    },
    {
      id: 'elderly',
      title: '고령자·현장 등록용',
      icon: 'fa-hands-helping',
      questions: [
        { q: '글자를 못 치는데 괜찮나요?', a: '네. 사진만 찍으면 됩니다.' },
        { q: '비밀번호를 만들어야 하나요?', a: '아닙니다. 비밀번호 없이 등록됩니다.' },
        { q: '지금 안 해도 되나요?', a: '네. 언제든 다시 오셔도 됩니다.' },
        { q: '등록하면 바로 뭐 해야 하나요?', a: '없습니다. 아무것도 안 하셔도 됩니다.' },
        { q: '내가 뭘 잘못 누를까 봐 걱정돼요.', a: '걱정 마세요. 직원이 대신 처리해 드립니다.' }
      ]
    },
    {
      id: 'admin',
      title: '행정·운영·신뢰',
      icon: 'fa-shield-alt',
      questions: [
        { q: '무단으로 가게가 등록되지는 않나요?', a: '아닙니다. 동의 없는 등록은 불가능합니다.' },
        { q: '공공 앱인가요?', a: '네. 경산시 공공 플랫폼입니다.' },
        { q: '개인정보는 안전한가요?', a: '네. 최소 정보만 수집하며 안전하게 관리합니다.' },
        { q: '왜 이런 앱을 만들었나요?', a: '소상공인 부담을 줄이고 지역경제를 살리기 위해서입니다.' },
        { q: '앞으로 어떻게 확대되나요?', a: '경산 시범 후 포항·구미·안동으로 확대될 예정입니다.' }
      ]
    }
  ]
};
