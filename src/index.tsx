import { Hono } from 'hono'
import { 
  cities, 
  restaurants, 
  marketProducts, 
  localFoods, 
  usedItems, 
  freeItems, 
  safeZones, 
  coupons, 
  statistics,
  restaurantCategories,
  gyeongsanSpecialties,
  touristSpots,
  festivals,
  chatbotFAQ
} from './data'

const app = new Hono()

// API 라우트
app.get('/api/cities', (c) => c.json(cities))
app.get('/api/restaurants', (c) => c.json(restaurants))
app.get('/api/market-products', (c) => c.json(marketProducts))
app.get('/api/local-foods', (c) => c.json(localFoods))
app.get('/api/used-items', (c) => c.json(usedItems))
app.get('/api/free-items', (c) => c.json(freeItems))
app.get('/api/safe-zones', (c) => c.json(safeZones))
app.get('/api/coupons', (c) => c.json(coupons))
app.get('/api/statistics', (c) => c.json(statistics))
app.get('/api/restaurant-categories', (c) => c.json(restaurantCategories))
app.get('/api/merchant-applications', (c) => c.json(merchantApplications))

// 경산 특산물·관광 API
app.get('/api/specialties', (c) => c.json(gyeongsanSpecialties))
app.get('/api/tourist-spots', (c) => c.json(touristSpots))
app.get('/api/festivals', (c) => c.json(festivals))

// 챗봇 FAQ API
app.get('/api/chatbot/faq', (c) => c.json(chatbotFAQ))

// 관광지 QR 커머스 (관광지별 특산물 추천)
app.get('/api/qr/:spotId', (c) => {
  const spotId = parseInt(c.req.param('spotId'))
  const spot = touristSpots.find(s => s.id === spotId)
  
  if (!spot) {
    return c.json({ error: 'Tourist spot not found' }, 404)
  }
  
  // 계절별 추천 특산물 (간단한 로직)
  const currentMonth = new Date().getMonth() + 1
  let recommendedSpecialties = gyeongsanSpecialties.filter(s => s.inStock)
  
  // 가을(9-11월)에는 대추 우선
  if (currentMonth >= 9 && currentMonth <= 11) {
    recommendedSpecialties.sort((a, b) => {
      if (a.category === 'jujube') return -1
      if (b.category === 'jujube') return 1
      return 0
    })
  }
  
  return c.json({
    spot,
    specialties: recommendedSpecialties.slice(0, 4),
    coupon: {
      code: `QR${spotId}2026`,
      discount: 5000,
      description: '관광지 QR 전용 배송비 지원 쿠폰'
    }
  })
})

// 관리자 대시보드 라우트
app.get('/admin', (c) => {
  return c.redirect('/static/admin.html')
})

// 가맹점 신청 API
app.post('/api/merchant-apply', async (c) => {
  const body = await c.req.json()
  const applicationId = Date.now()
  
  return c.json({
    success: true,
    applicationId,
    status: 'PENDING_ACTIVE',
    message: '가맹점 신청이 완료되었습니다. 24시간 내 검토 후 승인됩니다.',
    data: {
      businessName: body.businessName || '자동인식된 상호명',
      ownerName: body.ownerName || '자동인식된 대표자명',
      businessNumber: body.businessNumber || '123-45-67890',
      address: body.address || '자동인식된 주소',
      phone: body.phone || '',
      city: body.city || 'gyeongsan',
      ocrConfidence: Math.floor(Math.random() * 20) + 75
    }
  })
})

// 가맹점 승인/반려 API
app.post('/api/merchant-applications/:id/approve', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  
  return c.json({
    success: true,
    message: '가맹점이 승인되었습니다.',
    data: {
      id,
      status: 'ACTIVE',
      approvedAt: new Date().toISOString(),
      approvedBy: body.adminId || 'admin_001'
    }
  })
})

app.post('/api/merchant-applications/:id/reject', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  
  return c.json({
    success: true,
    message: '가맹점 신청이 반려되었습니다.',
    data: {
      id,
      status: 'REJECTED',
      rejectedAt: new Date().toISOString(),
      reason: body.reason || '서류 미비'
    }
  })
})

// ==========================================
// 주문/장바구니 API
// ==========================================

// 가게별 메뉴 조회
app.get('/api/stores/:storeId/menus', async (c) => {
  const storeId = c.req.param('storeId')
  
  // 임시 데이터 (실제로는 D1에서 조회)
  const sampleMenus = [
    { menuId: 'MENU-001', menuName: '한우 불고기 정식', price: 18000, category: '한식' },
    { menuId: 'MENU-002', menuName: '제육볶음 정식', price: 12000, category: '한식' },
    { menuId: 'MENU-003', menuName: '김치찌개', price: 8000, category: '한식' },
    { menuId: 'MENU-004', menuName: '된장찌개', price: 8000, category: '한식' },
    { menuId: 'MENU-005', menuName: '비빔밥', price: 10000, category: '한식' }
  ]
  
  return c.json(sampleMenus)
})

// 장바구니 생성 (메뉴보기에서 담기)
app.post('/api/cart/add', async (c) => {
  const body = await c.req.json()
  const cartId = 'CART-' + Date.now()
  
  return c.json({
    success: true,
    cartId,
    status: 'TEMP',
    message: '장바구니에 담겼습니다.'
  })
})

// 주문 시작 (주문하기 버튼)
app.post('/api/orders/start', async (c) => {
  const body = await c.req.json()
  const orderId = 'ORD-' + Date.now()
  
  // 무료배달 조건 체크
  const freeDelivery = true // 기본값
  const deliveryFee = freeDelivery ? 0 : 3000
  
  return c.json({
    success: true,
    orderId,
    status: 'CREATED',
    freeDelivery,
    deliveryFee,
    message: '주문이 생성되었습니다.'
  })
})

// 주문 조회
app.get('/api/orders/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  
  return c.json({
    orderId,
    status: 'CREATED',
    subtotalAmount: 18000,
    deliveryFee: 0,
    totalAmount: 18000,
    freeDelivery: true,
    items: [
      { menuName: '한우 불고기 정식', price: 18000, quantity: 1 }
    ]
  })
})

// 관리자: 주문 목록 조회
app.get('/api/admin/orders', async (c) => {
  const status = c.req.query('status')
  const date = c.req.query('date')
  
  // 임시 샘플 데이터
  const sampleOrders = [
    {
      orderId: 'ORD-001',
      storeName: '경산 전통 한정식',
      totalAmount: 18000,
      deliveryFee: 0,
      freeDelivery: true,
      status: 'PAID',
      createdAt: new Date().toISOString()
    },
    {
      orderId: 'ORD-002',
      storeName: '경산 대추 한과',
      totalAmount: 25000,
      deliveryFee: 0,
      freeDelivery: true,
      status: 'COOKING',
      createdAt: new Date().toISOString()
    }
  ]
  
  return c.json(sampleOrders)
})

// 관리자: 주문 상태 변경
app.post('/api/admin/orders/:orderId/status', async (c) => {
  const orderId = c.req.param('orderId')
  const body = await c.req.json()
  
  return c.json({
    success: true,
    orderId,
    status: body.status,
    message: '주문 상태가 변경되었습니다.'
  })
})

// ==========================================
// 안전거래 장소 API
// ==========================================

// 안전거래 장소 목록 (위치 기반)
app.get('/api/safe-trade-places', async (c) => {
  const lat = parseFloat(c.req.query('lat') || '35.8252')
  const lng = parseFloat(c.req.query('lng') || '128.7417')
  const city = c.req.query('city') || 'gyeongsan'
  
  // 샘플 데이터 (실제로는 D1에서 조회하고 거리순 정렬)
  const places = [
    {
      placeId: 'SAFE-P-001',
      name: '경산경찰서 민원실 앞',
      type: 'POLICE',
      address: '경북 경산시 중앙로 80',
      distance: 120, // 미터
      hasCctv: true,
      openHours: '24시간',
      parking: true
    },
    {
      placeId: 'SAFE-G-001',
      name: '경산시청 민원실 앞',
      type: 'GOV',
      address: '경북 경산시 시청로 1',
      distance: 300,
      hasCctv: true,
      openHours: '평일 09:00-18:00',
      parking: true
    },
    {
      placeId: 'SAFE-C-001',
      name: '중앙시장 공영주차장',
      type: 'CCTV',
      address: '경북 경산시 중앙시장길 20',
      distance: 450,
      hasCctv: true,
      openHours: '06:00-22:00',
      parking: true
    }
  ]
  
  return c.json(places)
})

// 안전거래 장소 상세
app.get('/api/safe-trade-places/:placeId', async (c) => {
  const placeId = c.req.param('placeId')
  
  return c.json({
    placeId,
    name: '경산경찰서 민원실 앞',
    type: 'POLICE',
    address: '경북 경산시 중앙로 80',
    addressDetail: '1층 민원실 앞 광장',
    lat: 35.8252,
    lng: 128.7417,
    hasCctv: true,
    openHours: '24시간',
    parking: true,
    verifiedBy: '경산경찰서',
    features: [
      'CCTV 24시간 녹화',
      '경찰 순찰 가능',
      '주차 가능',
      '밝은 조명'
    ]
  })
})

// ==========================================
// 중고거래 API
// ==========================================

// 중고거래 아이템 목록
app.get('/api/trade-items', async (c) => {
  const isFree = c.req.query('isFree') === 'true'
  const category = c.req.query('category')
  
  const sampleItems = [
    // 무료나눔 10개
    {
      itemId: 'FREE-001',
      title: '무료나눔 - 유아용 자전거',
      price: 0,
      isFree: true,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1610214379930-6c2c0e96e4a7?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 45,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-002',
      title: '무료나눔 - 책상 스탠드',
      price: 0,
      isFree: true,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 32,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-003',
      title: '무료나눔 - 아기 옷 세트',
      price: 0,
      isFree: true,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 67,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-004',
      title: '무료나눔 - 식탁 의자 2개',
      price: 0,
      isFree: true,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 89,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-005',
      title: '무료나눔 - 공기청정기',
      price: 0,
      isFree: true,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 123,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-006',
      title: '무료나눔 - 유아 놀이매트',
      price: 0,
      isFree: true,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 54,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-007',
      title: '무료나눔 - 책장',
      price: 0,
      isFree: true,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 76,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-008',
      title: '무료나눔 - 전기포트',
      price: 0,
      isFree: true,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 34,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-009',
      title: '무료나눔 - 유모차',
      price: 0,
      isFree: true,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 98,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FREE-010',
      title: '무료나눔 - 옷장',
      price: 0,
      isFree: true,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 112,
      createdAt: new Date().toISOString()
    },
    
    // 전자기기 10개
    {
      itemId: 'ELEC-001',
      title: '갤럭시 S21 (256GB)',
      price: 350000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 234,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-002',
      title: '아이패드 9세대',
      price: 280000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 189,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-003',
      title: 'LG 그램 노트북 (2022)',
      price: 650000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 456,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-004',
      title: '에어팟 프로 2세대',
      price: 180000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 321,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-005',
      title: '갤럭시 워치5',
      price: 150000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 167,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-006',
      title: '닌텐도 스위치 OLED',
      price: 250000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 289,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-007',
      title: '소니 WH-1000XM4 헤드폰',
      price: 220000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 143,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-008',
      title: '로지텍 게이밍 키보드',
      price: 95000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 98,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-009',
      title: '샤오미 공기청정기 4 프로',
      price: 180000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 201,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'ELEC-010',
      title: '갤럭시 탭 S8',
      price: 420000,
      isFree: false,
      category: '전자기기',
      thumbnail: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 267,
      createdAt: new Date().toISOString()
    },
    
    // 가전 10개
    {
      itemId: 'APPL-001',
      title: '삼성 냉장고 (2021년형)',
      price: 350000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 178,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-002',
      title: 'LG 드럼세탁기 15kg',
      price: 280000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 234,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-003',
      title: '에어컨 벽걸이 9평형',
      price: 450000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1585515656671-61c8436d6e96?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 345,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-004',
      title: '다이슨 청소기 V11',
      price: 320000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 289,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-005',
      title: '전자레인지 (23L)',
      price: 85000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 123,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-006',
      title: '공기청정기 삼성 블루스카이',
      price: 150000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 167,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-007',
      title: '식기세척기 빌트인',
      price: 380000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 201,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-008',
      title: '커피머신 드롱기',
      price: 420000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 189,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-009',
      title: '전기밥솥 10인용',
      price: 95000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1585928372040-8b583cc6c644?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 143,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'APPL-010',
      title: '제습기 20L',
      price: 180000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://images.unsplash.com/photo-1626806664770-790d5d47fe61?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 156,
      createdAt: new Date().toISOString()
    },
    
    // 가구 10개
    {
      itemId: 'FURN-001',
      title: '이케아 소파 3인용',
      price: 180000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 234,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-002',
      title: '퀸 사이즈 침대 + 매트리스',
      price: 250000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 312,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-003',
      title: '식탁 세트 (4인용)',
      price: 150000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 189,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-004',
      title: '책상 + 의자 세트',
      price: 120000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 167,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-005',
      title: '옷장 슬라이딩 도어',
      price: 280000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 201,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-006',
      title: '서재용 책장',
      price: 95000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 143,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-007',
      title: 'TV 거치대',
      price: 65000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1598300188962-73af6ec49e64?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 98,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-008',
      title: '화장대 + 거울',
      price: 135000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1595514535116-2d1b5a1f2e7e?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 156,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-009',
      title: '신발장 3단',
      price: 75000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1603912699214-92627f304eb6?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 123,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'FURN-010',
      title: '서랍장 5단',
      price: 110000,
      isFree: false,
      category: '가구',
      thumbnail: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 134,
      createdAt: new Date().toISOString()
    },
    
    // 유아용품 10개
    {
      itemId: 'BABY-001',
      title: '유아용 자전거 (3~5세)',
      price: 85000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1610214379930-6c2c0e96e4a7?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 167,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-002',
      title: '유모차 (2~3세용)',
      price: 120000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 234,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-003',
      title: '아기 침대 + 매트리스',
      price: 150000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 201,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-004',
      title: '카시트 (0~4세)',
      price: 95000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 189,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-005',
      title: '유아 놀이매트 (대형)',
      price: 65000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 143,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-006',
      title: '아기띠 (힙시트)',
      price: 75000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 156,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-007',
      title: '젖병 소독기',
      price: 55000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1584923457660-3e9d5e0e6e3f?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 123,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-008',
      title: '유아 책상 + 의자',
      price: 85000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 134,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-009',
      title: '점프루 (보행기)',
      price: 65000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1578750386766-f3d899c961b7?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 112,
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'BABY-010',
      title: '아기 욕조 + 목욕용품',
      price: 45000,
      isFree: false,
      category: '유아용품',
      thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=200&fit=crop',
      status: 'AVAILABLE',
      viewCount: 98,
      createdAt: new Date().toISOString()
    }
  ]
  
  let filtered = sampleItems
  
  if (isFree) {
    filtered = filtered.filter(i => i.isFree)
  }
  
  if (category && category !== 'all') {
    filtered = filtered.filter(i => i.category === category)
  }
  
  return c.json({ items: filtered })
})

// 채팅방 생성
app.post('/api/chat-rooms', async (c) => {
  const body = await c.req.json()
  const roomId = 'ROOM-' + Date.now()
  
  return c.json({
    success: true,
    roomId,
    itemId: body.itemId,
    sellerId: body.sellerId,
    buyerId: body.buyerId,
    status: 'ACTIVE',
    systemMessage: '안전거래 장소에서의 만남을 권장합니다.'
  })
})

// 채팅방에 안전거래 장소 선택
app.post('/api/chat-rooms/:roomId/select-place', async (c) => {
  const roomId = c.req.param('roomId')
  const body = await c.req.json()
  
  return c.json({
    success: true,
    roomId,
    placeId: body.placeId,
    placeName: body.placeName,
    status: 'PLACE_SELECTED',
    systemMessage: `거래 장소가 선택되었습니다: ${body.placeName}`
  })
})

// 분쟁 신고
app.post('/api/trade-disputes', async (c) => {
  const body = await c.req.json()
  const disputeId = 'DISPUTE-' + Date.now()
  
  return c.json({
    success: true,
    disputeId,
    status: 'RECEIVED',
    message: '신고가 접수되었습니다. 빠른 시일 내에 처리하겠습니다.',
    estimatedTime: '24시간 이내'
  })
})

// ==========================================
// 로컬푸드 API
// ==========================================

// 로컬푸드 상품 목록
app.get('/api/local-food-products', async (c) => {
  const category = c.req.query('category')
  
  const sampleProducts = [
    {
      productId: 'LOCAL-001',
      farmName: '경산 유기농 농장',
      farmerName: '김농부',
      productName: '당일 수확 상추',
      price: 5000,
      unit: '1kg',
      todayStock: 20,
      harvestDate: new Date().toISOString().split('T')[0],
      certification: 'ORGANIC',
      thumbnail: 'https://via.placeholder.com/300x200'
    },
    {
      productId: 'LOCAL-003',
      farmName: '경산 대추 농장',
      farmerName: '박농부',
      productName: '경산 대추',
      price: 20000,
      unit: '1kg',
      todayStock: 30,
      harvestDate: new Date().toISOString().split('T')[0],
      certification: 'PESTICIDE_FREE',
      thumbnail: 'https://via.placeholder.com/300x200'
    }
  ]
  
  return c.json(sampleProducts)
})

// 로컬푸드 예약 주문
app.post('/api/local-food-orders', async (c) => {
  const body = await c.req.json()
  const orderId = 'LF-ORD-' + Date.now()
  
  // 임시 데이터에서 상품 찾기
  const sampleProducts = [
    { productId: 'LOCAL-001', productName: '당일 수확 상추', todayStock: 20, price: 5000 },
    { productId: 'LOCAL-002', productName: '유기농 방울토마토', todayStock: 15, price: 8000 },
    { productId: 'LOCAL-003', productName: '경산 대추', todayStock: 30, price: 20000 },
    { productId: 'LOCAL-004', productName: '하양 포도', todayStock: 10, price: 35000 }
  ]
  
  const product = sampleProducts.find(p => p.productId === body.productId)
  
  // 재고 확인
  if (product && body.quantity > product.todayStock) {
    return c.json({
      success: false,
      message: `오늘 수확 가능 수량을 초과했습니다. (최대 ${product.todayStock}개)`
    }, 400)
  }
  
  return c.json({
    success: true,
    orderId,
    orderType: 'LOCALFOOD',
    productId: body.productId,
    farmId: body.farmId,
    quantity: body.quantity,
    deliveryDate: body.deliveryDate,
    totalPrice: body.totalPrice,
    deliveryFee: 0,
    freeDelivery: true,
    message: '로컬푸드 예약 주문이 완료되었습니다.',
    notice: '농가에서 수확 후 배송됩니다.'
  })
})

// 관리자: 무료배달 예산 조회
app.get('/api/admin/delivery-budget', async (c) => {
  const date = c.req.query('date') || new Date().toISOString().split('T')[0]
  
  return c.json({
    date,
    totalBudget: 1000000,
    usedBudget: 350000,
    remainingBudget: 650000,
    isActive: true,
    dailyOrders: 47,
    avgSupport: 7447
  })
})

// 관리자 대시보드 페이지
app.get('/admin', (c) => {
  return c.redirect('/static/admin.html')
})

// 배달 페이지
app.get('/delivery', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>배달 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div class="max-w-7xl mx-auto p-6">
            <h1 class="text-3xl font-bold mb-6"><i class="fas fa-motorcycle mr-2"></i>배달 서비스</h1>
            <div class="bg-white rounded-lg shadow-sm p-6">
                <p class="text-gray-600 mb-4">배달비 0원으로 경산 전역 배달 서비스를 제공합니다.</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="border rounded-lg p-4">
                        <h3 class="font-bold mb-2">🍜 음식점 배달</h3>
                        <p class="text-sm text-gray-600">다양한 음식점에서 주문하세요</p>
                    </div>
                    <div class="border rounded-lg p-4">
                        <h3 class="font-bold mb-2">🏪 전통시장 배달</h3>
                        <p class="text-sm text-gray-600">전통시장 상품을 한번에</p>
                    </div>
                    <div class="border rounded-lg p-4">
                        <h3 class="font-bold mb-2">🥬 로컬푸드 배달</h3>
                        <p class="text-sm text-gray-600">당일 수확 신선 배송</p>
                    </div>
                </div>
                <div class="mt-6 text-center">
                    <a href="/" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i class="fas fa-home mr-2"></i>메인으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `)
})

// 전통시장 페이지
app.get('/market', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>전통시장 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div class="max-w-7xl mx-auto p-6">
            <h1 class="text-3xl font-bold mb-6"><i class="fas fa-store mr-2"></i>전통시장</h1>
            <div class="bg-white rounded-lg shadow-sm p-6">
                <p class="text-gray-600 mb-4">경산 전통시장에서 신선한 상품을 만나보세요.</p>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 class="font-bold text-blue-900 mb-2"><i class="fas fa-gift mr-2"></i>전통시장 특별 혜택</h3>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>✓ 여러 가게 한번에 주문 가능</li>
                        <li>✓ 장날 자동 알림</li>
                        <li>✓ 묶음배달 시스템</li>
                    </ul>
                </div>
                <div class="mt-6 text-center">
                    <a href="/" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i class="fas fa-home mr-2"></i>메인으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `)
})

// 특산물 페이지
app.get('/specialty', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>경산 특산물 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div class="max-w-7xl mx-auto p-6">
            <h1 class="text-3xl font-bold mb-6"><i class="fas fa-apple-alt mr-2"></i>경산 특산물</h1>
            <div class="bg-white rounded-lg shadow-sm p-6">
                <p class="text-gray-600 mb-6">경산의 자랑, 4대 특산물을 만나보세요.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="border rounded-lg p-4 text-center">
                        <div class="text-5xl mb-3">🌰</div>
                        <h3 class="font-bold text-lg mb-2">경산 대추</h3>
                        <p class="text-sm text-gray-600 mb-2">지리적 표시 등록</p>
                        <span class="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">9-11월 제철</span>
                    </div>
                    <div class="border rounded-lg p-4 text-center">
                        <div class="text-5xl mb-3">🍇</div>
                        <h3 class="font-bold text-lg mb-2">경산 포도</h3>
                        <p class="text-sm text-gray-600 mb-2">시설재배 거봉</p>
                        <span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">7-9월 제철</span>
                    </div>
                    <div class="border rounded-lg p-4 text-center">
                        <div class="text-5xl mb-3">🍑</div>
                        <h3 class="font-bold text-lg mb-2">경산 복숭아</h3>
                        <p class="text-sm text-gray-600 mb-2">천도복숭아 주산지</p>
                        <span class="inline-block px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">6-8월 제철</span>
                    </div>
                    <div class="border rounded-lg p-4 text-center">
                        <div class="text-5xl mb-3">🍐</div>
                        <h3 class="font-bold text-lg mb-2">경산 자두</h3>
                        <p class="text-sm text-gray-600 mb-2">신선한 자두</p>
                        <span class="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">6-7월 제철</span>
                    </div>
                </div>
                <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 class="font-bold text-yellow-900 mb-2"><i class="fas fa-map-marker-alt mr-2"></i>관광지 QR 커머스</h3>
                    <p class="text-sm text-yellow-800 mb-3">관광지에서 QR코드를 스캔하면 특산물 구매 시 배송비 5,000원 지원!</p>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-white rounded-lg text-sm">📿 팔공산 갓바위</span>
                        <span class="px-3 py-1 bg-white rounded-lg text-sm">🌊 반곡지</span>
                        <span class="px-3 py-1 bg-white rounded-lg text-sm">🌳 자인계정숲</span>
                    </div>
                </div>
                <div class="mt-6 text-center">
                    <a href="/" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i class="fas fa-home mr-2"></i>메인으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `)
})

// 가맹점 신청 페이지
app.get('/partner/apply', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>가맹점 신청 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div class="max-w-3xl mx-auto p-6">
            <h1 class="text-3xl font-bold mb-6"><i class="fas fa-handshake mr-2"></i>가맹점 신청</h1>
            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 class="font-bold text-blue-900 mb-2"><i class="fas fa-gift mr-2"></i>가맹 혜택</h3>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>✓ 중개 수수료 0%</li>
                        <li>✓ 광고비 0원</li>
                        <li>✓ 배달비 무료/최소화</li>
                        <li>✓ 24시간 내 승인</li>
                    </ul>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">가게 이름</label>
                        <input type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="예: 경산 맛집">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">연락처</label>
                        <input type="tel" class="w-full px-4 py-2 border rounded-lg" placeholder="010-0000-0000">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">사업자등록증</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <i class="fas fa-camera text-4xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-600">사진을 촬영하거나 업로드하세요</p>
                            <p class="text-xs text-gray-500 mt-1">OCR 자동 인식으로 3분 등록</p>
                        </div>
                    </div>
                    <button class="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                        <i class="fas fa-paper-plane mr-2"></i>신청하기
                    </button>
                </div>
                <div class="mt-6 text-center">
                    <a href="/" class="text-gray-600 hover:text-gray-900">
                        <i class="fas fa-home mr-1"></i>메인으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `)
})

// 고객센터 페이지
app.get('/support', (c) => {
  return c.redirect('/static/support.html')
})

// 로그인 페이지
app.get('/login', (c) => {
  return c.redirect('/static/login.html')
})

// 고객센터 문의 접수 API
app.post('/api/support/inquiry', async (c) => {
  const { type, title, content, phone } = await c.req.json()
  
  const ticketId = 'TKT-' + Date.now()
  
  // TODO: Save to database
  
  return c.json({
    success: true,
    ticketId,
    message: '문의가 접수되었습니다. 답변까지 1~2일 소요됩니다.'
  })
})

// 인증번호 발송 API
app.post('/api/auth/send-code', async (c) => {
  const { phone } = await c.req.json()
  
  // TODO: Send SMS verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  return c.json({
    success: true,
    message: '인증번호가 발송되었습니다.',
    // In development, return code for testing
    code: process.env.NODE_ENV === 'development' ? code : undefined
  })
})

// 휴대폰 로그인 API
app.post('/api/auth/login-phone', async (c) => {
  const { phone, code } = await c.req.json()
  
  // TODO: Verify code and create session
  
  return c.json({
    success: true,
    token: 'temp-token-' + Date.now(),
    user: {
      userId: 'USER-' + Date.now(),
      phone,
      loginAt: new Date().toISOString()
    }
  })
})

// 이메일 로그인 API
app.post('/api/auth/login-email', async (c) => {
  const { email, password } = await c.req.json()
  
  // TODO: Verify credentials
  
  return c.json({
    success: true,
    token: 'temp-token-' + Date.now(),
    user: {
      userId: 'USER-' + Date.now(),
      email,
      loginAt: new Date().toISOString()
    }
  })
})

// 메인 페이지
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>경산온(ON) - 경산은 배달비가 없습니다</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/responsive.css" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', sans-serif;
            background: #f8f9fa;
          }
          
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 4px;
            margin-bottom: 4px;
          }
          
          .badge-primary { background: #3b82f6; color: white; }
          .badge-success { background: #10b981; color: white; }
          .badge-warning { background: #f59e0b; color: white; }
          .badge-info { background: #06b6d4; color: white; }
          
          .card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 12px;
            color: #6b7280;
            cursor: pointer;
            transition: color 0.2s;
          }
          
          .nav-item.active {
            color: #3b82f6;
          }
          
          .nav-item:hover {
            color: #3b82f6;
          }
          
          .pc-header-nav a {
            position: relative;
            padding-bottom: 4px;
          }
          
          .pc-header-nav a.active {
            color: #2563EB;
            font-weight: 600;
          }
          
          .pc-header-nav a.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: #2563EB;
          }
          
          .tab-button {
            padding: 8px 16px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
          }
          
          .tab-button.active {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
          }
          
          .category-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
          }
          
          .category-chip:hover {
            border-color: #3b82f6;
            background: #eff6ff;
          }
          
          .category-chip.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }
          
          .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
          }
          
          #app {
            min-height: calc(100vh - 140px);
            padding-bottom: 80px;
          }
          
          .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-around;
            z-index: 1000;
          }
          
          .safe-zone-marker {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            background: #10b981;
            color: white;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }
          
          .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 2000;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .modal.active {
            display: flex;
          }
          
          .modal-content {
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .loading {
            display: none;
            text-align: center;
            padding: 40px;
          }
          
          .loading.active {
            display: block;
          }
        </style>
    </head>
    <body>
        <!-- PC 상단 헤더 -->
        <header class="pc-header">
            <a href="/" class="pc-header-logo">
                <i class="fas fa-handshake"></i>
                <span data-i18n="brand">경산온(ON)</span>
            </a>
            
            <nav class="pc-header-nav">
                <a href="/" class="active" data-i18n="home">홈</a>
                <a href="/delivery" data-i18n="delivery">배달</a>
                <a href="/market" data-i18n="market">전통시장</a>
                <a href="/static/localfood.html" data-i18n="localFood">로컬푸드</a>
                <a href="/specialty" data-i18n="specialty">특산물</a>
                <a href="/static/trade.html" data-i18n="usedTrade">중고·나눔</a>
                <a href="/partner/apply" data-i18n="partnerApply">가맹점 신청</a>
                <a href="#support" data-i18n="support">고객센터</a>
            </nav>
            
            <div class="pc-header-actions">
                <!-- 다국어 선택 (HTML Select) -->
                <select id="langSelector" class="text-sm border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none">
                    <option value="ko">🇰🇷 한국어</option>
                    <option value="en">🇺🇸 English</option>
                    <option value="zh">🇨🇳 中文</option>
                    <option value="ja">🇯🇵 日本語</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="ar">🇸🇦 العربية</option>
                    <option value="de">🇩🇪 Deutsch</option>
                </select>
                
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <i class="fas fa-user mr-2"></i>
                    <span data-i18n="login">로그인</span>
                </button>
            </div>
        </header>

        <!-- 모바일 헤더 -->
        <header class="bg-white shadow-sm sticky top-0 z-50 mobile-header">
            <div class="px-4 py-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <button id="menuBtn" class="text-gray-700 text-xl">
                            <i class="fas fa-bars"></i>
                        </button>
                        <i class="fas fa-handshake text-blue-500 text-2xl"></i>
                        <div>
                            <h1 class="text-lg font-bold text-gray-900" data-i18n="brand">경산온(ON)</h1>
                            <p class="text-xs text-gray-500" data-i18n="noDeliveryFee">배달비 0원</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <select id="citySelector" class="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
                            <option value="gyeongsan">경산시</option>
                            <option value="pohang">포항시</option>
                            <option value="gumi">구미시</option>
                            <option value="andong">안동시</option>
                        </select>
                        <!-- 모바일 다국어 선택 (HTML Select) -->
                        <select id="langSelectorMobile" class="text-sm border border-gray-300 rounded-lg px-2 py-1.5 cursor-pointer">
                            <option value="ko">🇰🇷 KO</option>
                            <option value="en">🇺🇸 EN</option>
                            <option value="zh">🇨🇳 ZH</option>
                            <option value="ja">🇯🇵 JA</option>
                            <option value="es">🇪🇸 ES</option>
                            <option value="fr">🇫🇷 FR</option>
                            <option value="ar">🇸🇦 AR</option>
                            <option value="de">🇩🇪 DE</option>
                        </select>
                    </div>
                </div>
            </div>
        </header>

        <!-- 모바일 햄버거 메뉴 -->
        <div id="menuDrawer" class="hidden fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black bg-opacity-50" onclick="closeMenu()"></div>
            <div class="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl transform transition-transform duration-300">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-bold text-gray-900">메뉴</h2>
                        <button onclick="closeMenu()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    <nav class="space-y-2">
                        <a href="/" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-home mr-3 text-blue-600"></i>
                            <span data-i18n="home">홈</span>
                        </a>
                        <a href="/delivery" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-motorcycle mr-3 text-blue-600"></i>
                            <span data-i18n="delivery">배달</span>
                        </a>
                        <a href="/market" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-store mr-3 text-blue-600"></i>
                            <span data-i18n="market">전통시장</span>
                        </a>
                        <a href="/static/localfood.html" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-leaf mr-3 text-green-600"></i>
                            <span data-i18n="localFood">로컬푸드</span>
                        </a>
                        <a href="/specialty" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-star mr-3 text-orange-600"></i>
                            <span data-i18n="specialty">특산물</span>
                        </a>
                        <a href="/static/trade.html" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-exchange-alt mr-3 text-purple-600"></i>
                            <span data-i18n="usedTrade">중고·나눔</span>
                        </a>
                        <a href="/partner/apply" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-handshake mr-3 text-indigo-600"></i>
                            <span data-i18n="partnerApply">가맹점 신청</span>
                        </a>
                        <a href="/support" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-headset mr-3 text-pink-600"></i>
                            <span data-i18n="support">고객센터</span>
                        </a>
                    </nav>
                    <div class="mt-6 pt-6 border-t">
                        <button class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-user mr-2"></i>
                            <span data-i18n="login">로그인</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 메인 콘텐츠 -->
        <div id="app" class="app-container"></div>

        <!-- 챗봇 플로팅 버튼 -->
        <a href="/static/i18n/chatbot-ko" class="chatbot-button" title="온이 챗봇">
            <i class="fas fa-comments"></i>
        </a>

        <!-- 모바일 하단 네비게이션 -->
        <nav class="mobile-tab bottom-nav">
            <div class="nav-item active" data-page="home">
                <i class="fas fa-home text-xl mb-1"></i>
                <span class="text-xs" data-i18n="home">홈</span>
            </div>
            <div class="nav-item" data-page="delivery">
                <i class="fas fa-motorcycle text-xl mb-1"></i>
                <span class="text-xs" data-i18n="delivery">배달</span>
            </div>
            <div class="nav-item" data-page="market">
                <i class="fas fa-store text-xl mb-1"></i>
                <span class="text-xs" data-i18n="usedTrade">중고·나눔</span>
            </div>
            <div class="nav-item" data-page="coupon">
                <i class="fas fa-ticket-alt text-xl mb-1"></i>
                <span class="text-xs">쿠폰</span>
            </div>
            <div class="nav-item" data-page="my">
                <i class="fas fa-user text-xl mb-1"></i>
                <span class="text-xs">마이</span>
            </div>
        </nav>

        <!-- 모달: 음식점 상세 -->
        <div id="restaurantModal" class="modal">
            <div class="modal-content">
                <div id="restaurantModalContent"></div>
            </div>
        </div>

        <!-- 모달: 안전거래 지도 -->
        <div id="safeZoneModal" class="modal">
            <div class="modal-content">
                <div id="safeZoneModalContent"></div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
          // 다국어 번역 객체
          const translations = {
            ko: {
              // 브랜드
              brand: '경산온(ON)',
              tagline: '경산은 배달비가 없습니다',
              
              // 메뉴
              home: '홈',
              delivery: '배달',
              market: '전통시장',
              localFood: '로컬푸드',
              specialty: '특산물',
              usedTrade: '중고·나눔',
              partnerApply: '가맹점 신청',
              support: '고객센터',
              login: '로그인',
              
              // 중고거래 카테고리
              all: '전체',
              freeGiveaway: '무료나눔',
              electronics: '전자기기',
              appliances: '가전',
              furniture: '가구',
              babyItems: '유아용품',
              
              // 버튼
              orderNow: '주문하기',
              viewMenu: '메뉴 보기',
              mapView: '지도보기',
              tradeHere: '이곳에서 거래',
              register: '등록하기',
              search: '검색',
              filter: '필터',
              
              // 상태
              available: '판매중',
              soldOut: '판매완료',
              free: '무료',
              
              // 기타
              won: '원',
              viewCount: '조회',
              safeTradingPlace: '안전거래 장소',
              todayDelivery: '당일 배송',
              noDeliveryFee: '배달비 0원',
              noCommission: '중개수수료 0%',
              noAd: '광고비 0원'
            },
            en: {
              // Brand
              brand: 'Gyeongsan ON',
              tagline: 'No Delivery Fee in Gyeongsan',
              
              // Menu
              home: 'Home',
              delivery: 'Delivery',
              market: 'Market',
              localFood: 'Local Food',
              specialty: 'Specialty',
              usedTrade: 'Used & Free',
              partnerApply: 'Partner Apply',
              support: 'Support',
              login: 'Login',
              
              // Used Trade Categories
              all: 'All',
              freeGiveaway: 'Free',
              electronics: 'Electronics',
              appliances: 'Appliances',
              furniture: 'Furniture',
              babyItems: 'Baby Items',
              
              // Buttons
              orderNow: 'Order Now',
              viewMenu: 'View Menu',
              mapView: 'Map',
              tradeHere: 'Trade Here',
              register: 'Register',
              search: 'Search',
              filter: 'Filter',
              
              // Status
              available: 'Available',
              soldOut: 'Sold Out',
              free: 'Free',
              
              // Others
              won: 'KRW',
              viewCount: 'Views',
              safeTradingPlace: 'Safe Trading Place',
              todayDelivery: 'Same Day Delivery',
              noDeliveryFee: 'Free Delivery',
              noCommission: '0% Commission',
              noAd: '0 Ad Cost'
            },
            zh: {
              // 品牌
              brand: '庆山ON',
              tagline: '庆山免配送费',
              
              // 菜单
              home: '首页',
              delivery: '配送',
              market: '传统市场',
              localFood: '本地食品',
              specialty: '特产',
              usedTrade: '二手·免费',
              partnerApply: '商户申请',
              support: '客服中心',
              login: '登录',
              
              // 二手交易类别
              all: '全部',
              freeGiveaway: '免费赠送',
              electronics: '电子产品',
              appliances: '家电',
              furniture: '家具',
              babyItems: '婴儿用品',
              
              // 按钮
              orderNow: '立即订购',
              viewMenu: '查看菜单',
              mapView: '地图',
              tradeHere: '在这交易',
              register: '注册',
              search: '搜索',
              filter: '筛选',
              
              // 状态
              available: '在售',
              soldOut: '已售出',
              free: '免费',
              
              // 其他
              won: '韩元',
              viewCount: '浏览',
              safeTradingPlace: '安全交易地点',
              todayDelivery: '当日配送',
              noDeliveryFee: '免配送费',
              noCommission: '0%佣金',
              noAd: '0广告费'
            },
            ja: {
              // ブランド
              brand: '慶山ON',
              tagline: '慶山は配達料無料',
              
              // メニュー
              home: 'ホーム',
              delivery: '配達',
              market: '伝統市場',
              localFood: 'ローカルフード',
              specialty: '特産品',
              usedTrade: '中古・譲渡',
              partnerApply: '加盟店申請',
              support: 'サポート',
              login: 'ログイン',
              
              // 中古取引カテゴリー
              all: '全体',
              freeGiveaway: '無料譲渡',
              electronics: '電子機器',
              appliances: '家電',
              furniture: '家具',
              babyItems: 'ベビー用品',
              
              // ボタン
              orderNow: '注文する',
              viewMenu: 'メニュー',
              mapView: '地図',
              tradeHere: 'ここで取引',
              register: '登録',
              search: '検索',
              filter: 'フィルター',
              
              // ステータス
              available: '販売中',
              soldOut: '売り切れ',
              free: '無料',
              
              // その他
              won: 'ウォン',
              viewCount: '閲覧',
              safeTradingPlace: '安全取引場所',
              todayDelivery: '当日配送',
              noDeliveryFee: '配達料無料',
              noCommission: '手数料0%',
              noAd: '広告費0円'
            },
            es: {
              // Marca
              brand: 'Gyeongsan ON',
              tagline: 'Sin Tarifa de Entrega en Gyeongsan',
              
              // Menú
              home: 'Inicio',
              delivery: 'Entrega',
              market: 'Mercado',
              localFood: 'Comida Local',
              specialty: 'Especialidad',
              usedTrade: 'Usado y Gratis',
              partnerApply: 'Solicitud de Socio',
              support: 'Soporte',
              login: 'Iniciar Sesión',
              
              // Categorías de Comercio Usado
              all: 'Todo',
              freeGiveaway: 'Gratis',
              electronics: 'Electrónica',
              appliances: 'Electrodomésticos',
              furniture: 'Muebles',
              babyItems: 'Artículos para Bebés',
              
              // Botones
              orderNow: 'Ordenar Ahora',
              viewMenu: 'Ver Menú',
              mapView: 'Mapa',
              tradeHere: 'Comerciar Aquí',
              register: 'Registrarse',
              search: 'Buscar',
              filter: 'Filtrar',
              
              // Estado
              available: 'Disponible',
              soldOut: 'Agotado',
              free: 'Gratis',
              
              // Otros
              won: 'KRW',
              viewCount: 'Vistas',
              safeTradingPlace: 'Lugar de Comercio Seguro',
              todayDelivery: 'Entrega el Mismo Día',
              noDeliveryFee: 'Entrega Gratis',
              noCommission: '0% Comisión',
              noAd: '0 Costo de Publicidad'
            },
            fr: {
              // Marque
              brand: 'Gyeongsan ON',
              tagline: 'Pas de Frais de Livraison à Gyeongsan',
              
              // Menu
              home: 'Accueil',
              delivery: 'Livraison',
              market: 'Marché',
              localFood: 'Nourriture Locale',
              specialty: 'Spécialité',
              usedTrade: 'D\'occasion et Gratuit',
              partnerApply: 'Demande de Partenaire',
              support: 'Support',
              login: 'Connexion',
              
              // Catégories de Commerce d\'occasion
              all: 'Tout',
              freeGiveaway: 'Gratuit',
              electronics: 'Électronique',
              appliances: 'Appareils',
              furniture: 'Meubles',
              babyItems: 'Articles pour Bébés',
              
              // Boutons
              orderNow: 'Commander Maintenant',
              viewMenu: 'Voir le Menu',
              mapView: 'Carte',
              tradeHere: 'Échanger Ici',
              register: 'S\'inscrire',
              search: 'Rechercher',
              filter: 'Filtrer',
              
              // Statut
              available: 'Disponible',
              soldOut: 'Épuisé',
              free: 'Gratuit',
              
              // Autres
              won: 'KRW',
              viewCount: 'Vues',
              safeTradingPlace: 'Lieu d\'Échange Sûr',
              todayDelivery: 'Livraison le Jour Même',
              noDeliveryFee: 'Livraison Gratuite',
              noCommission: '0% Commission',
              noAd: '0 Coût Publicitaire'
            },
            ar: {
              // العلامة التجارية
              brand: 'غيونغسان أون',
              tagline: 'لا توجد رسوم توصيل في غيونغسان',
              
              // القائمة
              home: 'الرئيسية',
              delivery: 'التوصيل',
              market: 'السوق',
              localFood: 'الطعام المحلي',
              specialty: 'المنتجات المميزة',
              usedTrade: 'مستعمل ومجاني',
              partnerApply: 'طلب شريك',
              support: 'الدعم',
              login: 'تسجيل الدخول',
              
              // فئات التجارة المستعملة
              all: 'الكل',
              freeGiveaway: 'مجاني',
              electronics: 'إلكترونيات',
              appliances: 'أجهزة',
              furniture: 'أثاث',
              babyItems: 'مستلزمات الأطفال',
              
              // الأزرار
              orderNow: 'اطلب الآن',
              viewMenu: 'عرض القائمة',
              mapView: 'الخريطة',
              tradeHere: 'التجارة هنا',
              register: 'تسجيل',
              search: 'بحث',
              filter: 'تصفية',
              
              // الحالة
              available: 'متاح',
              soldOut: 'نفذ',
              free: 'مجاني',
              
              // أخرى
              won: 'وون',
              viewCount: 'المشاهدات',
              safeTradingPlace: 'مكان تجاري آمن',
              todayDelivery: 'التوصيل في نفس اليوم',
              noDeliveryFee: 'توصيل مجاني',
              noCommission: '0٪ عمولة',
              noAd: '0 تكلفة إعلانية'
            },
            de: {
              // Marke
              brand: 'Gyeongsan ON',
              tagline: 'Keine Liefergebühr in Gyeongsan',
              
              // Menü
              home: 'Startseite',
              delivery: 'Lieferung',
              market: 'Markt',
              localFood: 'Lokales Essen',
              specialty: 'Spezialität',
              usedTrade: 'Gebraucht & Kostenlos',
              partnerApply: 'Partner-Antrag',
              support: 'Support',
              login: 'Anmelden',
              
              // Gebrauchthandel-Kategorien
              all: 'Alle',
              freeGiveaway: 'Kostenlos',
              electronics: 'Elektronik',
              appliances: 'Geräte',
              furniture: 'Möbel',
              babyItems: 'Babyartikel',
              
              // Schaltflächen
              orderNow: 'Jetzt Bestellen',
              viewMenu: 'Menü Ansehen',
              mapView: 'Karte',
              tradeHere: 'Hier Handeln',
              register: 'Registrieren',
              search: 'Suchen',
              filter: 'Filtern',
              
              // Status
              available: 'Verfügbar',
              soldOut: 'Ausverkauft',
              free: 'Kostenlos',
              
              // Sonstiges
              won: 'KRW',
              viewCount: 'Ansichten',
              safeTradingPlace: 'Sicherer Handelsplatz',
              todayDelivery: 'Lieferung am selben Tag',
              noDeliveryFee: 'Kostenlose Lieferung',
              noCommission: '0% Provision',
              noAd: '0 Werbekosten'
            }
          };
          
          // 번역 함수
          function t(key) {
            const lang = localStorage.getItem('lang') || 'ko';
            return translations[lang]?.[key] || translations['ko'][key] || key;
          }
          
          // 페이지 번역 적용 함수
          function applyTranslations() {
            console.log('번역 적용 시작');
            const lang = localStorage.getItem('lang') || 'ko';
            console.log('현재 언어:', lang);
            
            // data-i18n 속성이 있는 모든 요소 번역 (드롭다운 제외)
            const elements = document.querySelectorAll('[data-i18n]');
            console.log('번역할 요소 개수:', elements.length);
            
            elements.forEach(el => {
              const key = el.getAttribute('data-i18n');
              // 언어 선택 메뉴 항목은 번역하지 않음
              if (key && !el.closest('.lang-menu')) {
                const translated = t(key);
                el.textContent = translated;
                console.log('번역:', key, '->', translated);
              }
            });
            
            // placeholder 번역
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
              const key = el.getAttribute('data-i18n-placeholder');
              if (key) {
                el.placeholder = t(key);
              }
            });
            
            // title 번역
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
              const key = el.getAttribute('data-i18n-title');
              if (key) {
                el.title = t(key);
              }
            });
            
            console.log('번역 적용 완료');
          }
          
          // 햄버거 메뉴 기능
          function openMenu() {
            document.getElementById('menuDrawer').classList.remove('hidden');
          }
          
          function closeMenu() {
            document.getElementById('menuDrawer').classList.add('hidden');
          }
          
          // 모든 초기화를 DOMContentLoaded 안에서 실행
          document.addEventListener('DOMContentLoaded', function() {
            console.log('페이지 초기화 시작');
            
            // 햄버거 메뉴 버튼 이벤트
            const menuBtn = document.getElementById('menuBtn');
            if (menuBtn) {
              menuBtn.addEventListener('click', openMenu);
              console.log('햄버거 메뉴 버튼 이벤트 등록 완료');
            }
            
            // 저장된 언어 불러오기
            const savedLang = localStorage.getItem('lang') || 'ko';
            console.log('저장된 언어:', savedLang);
            
            // 언어 선택자 초기화 (PC)
            const langSelector = document.getElementById('langSelector');
            if (langSelector) {
              langSelector.value = savedLang;
              langSelector.addEventListener('change', function() {
                const selectedLang = this.value;
                console.log('언어 변경:', selectedLang);
                localStorage.setItem('lang', selectedLang);
                
                // 챗봇 링크 업데이트
                const chatbotBtn = document.querySelector('.chatbot-button');
                if (chatbotBtn) {
                  chatbotBtn.href = '/static/i18n/chatbot-' + selectedLang;
                }
                
                // 페이지 리로드
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
              console.log('PC 언어 선택자 초기화 완료');
            }
            
            // 언어 선택자 초기화 (Mobile)
            const langSelectorMobile = document.getElementById('langSelectorMobile');
            if (langSelectorMobile) {
              langSelectorMobile.value = savedLang;
              langSelectorMobile.addEventListener('change', function() {
                const selectedLang = this.value;
                console.log('언어 변경 (모바일):', selectedLang);
                localStorage.setItem('lang', selectedLang);
                
                // 챗봇 링크 업데이트
                const chatbotBtn = document.querySelector('.chatbot-button');
                if (chatbotBtn) {
                  chatbotBtn.href = '/static/i18n/chatbot-' + selectedLang;
                }
                
                // 페이지 리로드
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
              console.log('모바일 언어 선택자 초기화 완료');
            }
            
            // 챗봇 버튼 URL 초기화
            const chatbotBtn = document.querySelector('.chatbot-button');
            if (chatbotBtn) {
              chatbotBtn.href = '/static/i18n/chatbot-' + savedLang;
            }
            
            // 번역 적용
            applyTranslations();
            console.log('페이지 초기화 완료');
          });
        </script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
