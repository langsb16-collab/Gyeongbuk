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

// 장바구니 생성 API
app.post('/api/cart/create', async (c) => {
  const { storeId } = await c.req.json()
  const cartId = `CART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  return c.json({
    success: true,
    cartId,
    storeId,
    createdAt: new Date().toISOString()
  })
})

// 가게 메뉴 조회 API
app.get('/api/stores/:storeId/menus', (c) => {
  const storeId = c.req.param('storeId')
  
  // 샘플 메뉴 데이터
  const sampleMenus = {
    '중앙시장 떡볶이': [
      {
        menuId: 'M001',
        name: '떡볶이',
        description: '매콤달콤한 즉석 떡볶이',
        price: 4000,
        image: '/static/images/product.svg',
        category: '메인'
      },
      {
        menuId: 'M002',
        name: '순대',
        description: '쫄깃한 수제 순대',
        price: 5000,
        image: '/static/images/product.svg',
        category: '메인'
      },
      {
        menuId: 'M003',
        name: '튀김',
        description: '바삭바삭한 모듬 튀김',
        price: 3000,
        image: '/static/images/product.svg',
        category: '사이드'
      },
      {
        menuId: 'M004',
        name: '김밥',
        description: '신선한 야채가 가득한 김밥',
        price: 3500,
        image: '/static/images/product.svg',
        category: '메인'
      }
    ]
  }
  
  const menus = sampleMenus[storeId] || [
    {
      menuId: 'M001',
      name: '대표 메뉴',
      description: '가게의 시그니처 메뉴',
      price: 8000,
      image: '/static/images/product.svg',
      category: '메인'
    },
    {
      menuId: 'M002',
      name: '특선 메뉴',
      description: '오늘의 특별한 메뉴',
      price: 12000,
      image: '/static/images/product.svg',
      category: '메인'
    }
  ]
  
  return c.json(menus)
})

// 주문 접수 API
app.post('/api/orders', async (c) => {
  const orderData = await c.req.json()
  const orderId = `ORD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Date.now()).slice(-4)}`
  
  // 실제 구현에서는 DB에 저장
  return c.json({
    success: true,
    orderId,
    status: 'RECEIVED',
    estimatedTime: 30,
    message: '주문이 접수되었습니다.'
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

// 장바구니 생성 (주문하기 버튼 - 장바구니 먼저 생성)
app.post('/api/cart/create', async (c) => {
  const body = await c.req.json()
  const { storeId } = body
  const cartId = 'CART-' + Date.now() + '-' + Math.random().toString(36).substring(7)
  
  return c.json({
    success: true,
    cartId,
    storeId,
    status: 'READY', // 주문 준비 상태
    message: '장바구니가 생성되었습니다.'
  })
})

// 현재 장바구니 조회
app.get('/api/cart/current', async (c) => {
  // 실제로는 세션/쿠키에서 cartId를 가져와야 함
  const cartId = c.req.query('cartId')
  
  if (!cartId) {
    return c.json({ cart: null, items: [] })
  }
  
  // 임시 응답 (실제로는 D1에서 조회)
  return c.json({
    cart: {
      cartId,
      storeId: 'STORE-001',
      status: 'READY',
      createdAt: new Date().toISOString()
    },
    items: []
  })
})

// 장바구니에 메뉴 추가 (메뉴보기에서 담기)
app.post('/api/cart/add', async (c) => {
  const body = await c.req.json()
  const { cartId, menuId, menuName, price, quantity } = body
  
  return c.json({
    success: true,
    cartId,
    message: '장바구니에 담겼습니다.',
    item: {
      menuId,
      menuName,
      price,
      quantity: quantity || 1
    }
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
      farmId: 'FARM-001',
      farmName: '경산 유기농 농장',
      farmerName: '김농부',
      productName: '유기농 쌀',
      price: 35000,
      unit: '2kg',
      todayStock: 50,
      harvestDate: new Date().toISOString().split('T')[0],
      certification: 'ORGANIC',
      thumbnail: '/static/images/rice.svg?v=2',
      category: 'grain'
    },
    {
      productId: 'LOCAL-002',
      farmId: 'FARM-002',
      farmName: '햇살 농원',
      farmerName: '이농부',
      productName: '제철 토마토',
      price: 15000,
      unit: '3kg',
      todayStock: 15,
      harvestDate: new Date().toISOString().split('T')[0],
      certification: 'ORGANIC',
      thumbnail: '/static/images/tomato.svg?v=2',
      category: 'vegetable'
    },
    {
      productId: 'LOCAL-003',
      farmId: 'FARM-003',
      farmName: '경산 대추 농장',
      farmerName: '박농부',
      productName: '경산 대추',
      price: 20000,
      unit: 'kg',
      todayStock: 30,
      harvestDate: new Date().toISOString().split('T')[0],
      certification: 'PESTICIDE_FREE',
      thumbnail: '/static/images/jujube.svg?v=2',
      category: 'fruit'
    },
    {
      productId: 'LOCAL-004',
      farmId: 'FARM-004',
      farmName: '모닝팜',
      farmerName: '최농부',
      productName: '하양 포도',
      price: 35000,
      unit: '2kg',
      todayStock: 10,
      harvestDate: new Date().toISOString().split('T')[0],
      certification: 'ORGANIC',
      thumbnail: '/static/images/grape.svg?v=2',
      category: 'fruit'
    },
    {
      productId: 'LOCAL-005',
      farmId: 'FARM-005',
      farmName: '푸른 들판',
      farmerName: '정농부',
      productName: '무농약 시금치',
      price: 8000,
      unit: '2kg',
      todayStock: 25,
      harvestDate: new Date().toISOString().split('T')[0],
      certification: 'PESTICIDE_FREE',
      thumbnail: '/static/images/spinach.svg?v=2',
      category: 'vegetable'
    },
    {
      productId: 'LOCAL-006',
      farmId: 'FARM-006',
      farmName: '산골 양봉',
      farmerName: '김양봉',
      productName: '야생화 꿀',
      price: 28000,
      unit: 'kg',
      todayStock: 12,
      harvestDate: new Date().toISOString().split('T')[0],
      certification: 'ORGANIC',
      thumbnail: '/static/images/honey.svg?v=2',
      category: 'processed'
    }
  ]
  
  // 카테고리 필터링
  const filteredProducts = category && category !== 'all' 
    ? sampleProducts.filter(p => p.category === category)
    : sampleProducts
  
  return c.json({
    success: true,
    products: filteredProducts,
    total: filteredProducts.length
  })
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
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        <title>배달 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            /* 반응형 카드 스타일 */
            .restaurant-card {
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .restaurant-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            /* PC 화면 (768px 이상) */
            @media (min-width: 768px) {
                .restaurant-image {
                    height: 200px;
                }
                .restaurant-title {
                    font-size: 1.25rem; /* 20px */
                }
                .restaurant-info {
                    font-size: 0.875rem; /* 14px */
                }
                .btn-menu, .btn-order {
                    font-size: 0.875rem; /* 14px */
                    padding: 0.5rem 1rem;
                }
                .badge-text {
                    font-size: 0.75rem; /* 12px */
                }
            }
            
            /* 모바일 화면 (767px 이하) */
            @media (max-width: 767px) {
                .restaurant-image {
                    height: 160px;
                }
                .restaurant-title {
                    font-size: 1rem; /* 16px */
                }
                .restaurant-info {
                    font-size: 0.75rem; /* 12px */
                }
                .btn-menu, .btn-order {
                    font-size: 0.75rem; /* 12px */
                    padding: 0.375rem 0.75rem;
                }
                .badge-text {
                    font-size: 0.625rem; /* 10px */
                }
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 헤더 -->
        <div class="bg-white shadow-sm sticky top-0 z-10">
            <div class="max-w-7xl mx-auto px-4 py-3 md:py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 md:gap-3">
                        <a href="/" class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-arrow-left text-lg md:text-xl"></i>
                        </a>
                        <h1 class="text-xl md:text-2xl font-bold text-gray-900">
                            <i class="fas fa-motorcycle mr-1 md:mr-2"></i>배달
                        </h1>
                    </div>
                    <button class="text-gray-600 hover:text-gray-900">
                        <i class="fas fa-search text-lg md:text-xl"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <!-- 배너 -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl md:rounded-2xl p-4 md:p-8 mb-4 md:mb-6 text-white text-center">
                <div class="mb-3 md:mb-4">
                    <span class="inline-block px-4 py-2 bg-white/20 rounded-full text-sm md:text-base font-semibold mb-2">🎉 경산시 시범 운영 중</span>
                </div>
                <p class="text-xs md:text-sm opacity-90 mb-3 md:mb-4">수수료 0% · 광고비 0% · 배달비 지원</p>
                <div class="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <div>
                        <p class="text-2xl md:text-3xl font-bold mb-1">8.9억</p>
                        <p class="text-xs md:text-sm opacity-80">소상공인 절감</p>
                    </div>
                    <div>
                        <p class="text-2xl md:text-3xl font-bold mb-1">234곳</p>
                        <p class="text-xs md:text-sm opacity-80">입점 가맹점</p>
                    </div>
                    <div>
                        <p class="text-2xl md:text-3xl font-bold mb-1">8.9K</p>
                        <p class="text-xs md:text-sm opacity-80">이용 시민</p>
                    </div>
                </div>
            </div>

            <!-- 음식점 목록 -->
            <div class="mb-4 md:mb-6">
                <h2 class="text-base md:text-xl font-bold text-gray-900 mb-3 md:mb-4">인기 음식점</h2>
                <div id="restaurantGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <!-- 로딩 중 -->
                    <div class="col-span-full text-center py-8 md:py-12">
                        <i class="fas fa-spinner fa-spin text-3xl md:text-4xl text-gray-400 mb-2 md:mb-4"></i>
                        <p class="text-sm md:text-base text-gray-600">음식점 정보를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // 페이지 로드 시 음식점 목록 가져오기
            async function loadRestaurants() {
                try {
                    const response = await axios.get('/api/restaurants');
                    const restaurants = response.data || [];
                    renderRestaurants(restaurants);
                } catch (error) {
                    console.error('음식점 로딩 실패:', error);
                    document.getElementById('restaurantGrid').innerHTML = \`
                        <div class="col-span-full text-center py-8 md:py-12 text-gray-500">
                            <i class="fas fa-exclamation-circle text-3xl md:text-4xl mb-2 md:mb-4"></i>
                            <p class="text-sm md:text-base">음식점을 불러오는데 실패했습니다.</p>
                        </div>
                    \`;
                }
            }

            // 음식점 렌더링
            function renderRestaurants(restaurants) {
                const grid = document.getElementById('restaurantGrid');
                
                if (restaurants.length === 0) {
                    grid.innerHTML = \`
                        <div class="col-span-full text-center py-8 md:py-12 text-gray-500">
                            <i class="fas fa-store-slash text-3xl md:text-4xl mb-2 md:mb-4"></i>
                            <p class="text-sm md:text-base">등록된 음식점이 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                grid.innerHTML = '';
                restaurants.forEach(restaurant => {
                    // 카드 생성
                    const card = document.createElement('div');
                    card.className = 'restaurant-card bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden';
                    
                    // 이미지
                    const img = document.createElement('img');
                    img.src = restaurant.image || '/static/images/restaurant.svg';
                    img.alt = restaurant.name;
                    img.className = 'restaurant-image w-full object-cover';
                    img.crossOrigin = 'anonymous';
                    img.loading = 'lazy';
                    img.onerror = function() { this.src = '/static/images/restaurant.svg'; };
                    
                    // 카드 내용
                    const cardBody = document.createElement('div');
                    cardBody.className = 'p-3 md:p-4';
                    
                    // 제목 & 카테고리
                    const titleRow = document.createElement('div');
                    titleRow.className = 'flex items-start justify-between mb-2';
                    
                    const title = document.createElement('h3');
                    title.className = 'restaurant-title font-bold text-gray-900 flex-1';
                    title.textContent = restaurant.name;
                    
                    const badge = document.createElement('span');
                    badge.className = 'badge-text bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap ml-2';
                    badge.textContent = restaurant.category || '음식점';
                    
                    titleRow.appendChild(title);
                    titleRow.appendChild(badge);
                    
                    // 평점 & 배달시간
                    const infoRow = document.createElement('div');
                    infoRow.className = 'restaurant-info flex items-center text-gray-600 mb-2';
                    infoRow.innerHTML = \`
                        <div class="flex items-center text-yellow-500 mr-3">
                            <i class="fas fa-star mr-1"></i>
                            <span class="font-semibold">\${restaurant.rating || '4.5'}</span>
                            <span class="text-gray-500 ml-1">(\${restaurant.reviewCount || restaurant.reviews || '0'})</span>
                        </div>
                        <span class="text-gray-500">|</span>
                        <span class="ml-3">\${restaurant.deliveryTime || '30-40'}분</span>
                    \`;
                    
                    // 설명
                    const desc = document.createElement('p');
                    desc.className = 'restaurant-info text-gray-600 mb-3 line-clamp-1';
                    desc.textContent = restaurant.description || '';
                    
                    // 하단 버튼 영역
                    const bottom = document.createElement('div');
                    bottom.className = 'flex items-center justify-between';
                    
                    const deliveryBadge = document.createElement('span');
                    deliveryBadge.className = 'badge-text bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full font-medium';
                    deliveryBadge.innerHTML = '<i class="fas fa-motorcycle mr-1"></i>배달비 0원';
                    
                    const btnGroup = document.createElement('div');
                    btnGroup.className = 'flex gap-2';
                    
                    const menuBtn = document.createElement('button');
                    menuBtn.className = 'btn-menu bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium px-4 py-2';
                    menuBtn.textContent = '메뉴';
                    
                    const orderBtn = document.createElement('button');
                    orderBtn.className = 'btn-order bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold px-4 py-2';
                    orderBtn.textContent = '주문';
                    
                    btnGroup.appendChild(menuBtn);
                    btnGroup.appendChild(orderBtn);
                    
                    bottom.appendChild(deliveryBadge);
                    bottom.appendChild(btnGroup);
                    
                    // 조립
                    cardBody.appendChild(titleRow);
                    cardBody.appendChild(infoRow);
                    cardBody.appendChild(desc);
                    cardBody.appendChild(bottom);
                    
                    card.appendChild(img);
                    card.appendChild(cardBody);
                    
                    // 이벤트 리스너
                    const storeId = restaurant.id || restaurant.name;
                    menuBtn.addEventListener('click', () => goToMenu(storeId));
                    orderBtn.addEventListener('click', () => startOrder(storeId));
                    
                    grid.appendChild(card);
                });
            }

            // 메뉴 보기
            function goToMenu(storeId) {
                window.location.href = '/store/' + encodeURIComponent(storeId) + '/menu';
            }

            // 주문하기 (장바구니 생성)
            async function startOrder(storeId) {
                try {
                    const response = await axios.post('/api/cart/create', { storeId });
                    const { cartId } = response.data;
                    
                    // localStorage에 저장
                    localStorage.setItem('cartId', cartId);
                    localStorage.setItem('storeId', storeId);
                    
                    // 메뉴 페이지로 이동
                    window.location.href = '/store/' + encodeURIComponent(storeId) + '/menu';
                } catch (error) {
                    console.error('장바구니 생성 실패:', error);
                    alert('주문을 시작할 수 없습니다. 다시 시도해주세요.');
                }
            }

            // 페이지 로드 시 실행
            document.addEventListener('DOMContentLoaded', () => {
                loadRestaurants();
            });
        </script>
    </body>
    </html>
  `)
})

// 메뉴 페이지
app.get('/store/:storeId/menu', (c) => {
  const storeId = c.req.param('storeId')
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>메뉴 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            .menu-item { transition: transform 0.2s; }
            .menu-item:hover { transform: translateY(-4px); }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 헤더 -->
        <div class="bg-white shadow-sm sticky top-0 z-10">
            <div class="max-w-7xl mx-auto px-4 py-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <a href="/delivery" class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-arrow-left text-xl"></i>
                        </a>
                        <h1 class="text-xl font-bold text-gray-900">메뉴</h1>
                    </div>
                    <button onclick="viewCart()" class="relative text-gray-600 hover:text-gray-900">
                        <i class="fas fa-shopping-cart text-xl"></i>
                        <span id="cartBadge" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hidden">0</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- 가게 정보 -->
        <div class="max-w-7xl mx-auto px-4 py-4">
            <div id="storeInfo" class="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div class="flex items-center gap-3">
                    <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <span class="text-gray-600">가게 정보 로딩 중...</span>
                </div>
            </div>

            <!-- 메뉴 목록 -->
            <div class="mb-6">
                <h2 class="text-lg font-bold text-gray-900 mb-3">메뉴</h2>
                <div id="menuGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- 로딩 중 -->
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">메뉴를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 장바구니 모달 -->
        <div id="cartModal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">장바구니</h3>
                    <button onclick="closeCart()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="cartItems" class="p-6">
                    <!-- 장바구니 아이템 -->
                </div>
                <div class="sticky bottom-0 bg-white border-t p-6">
                    <div class="flex justify-between mb-4">
                        <span class="font-bold">총 금액</span>
                        <span id="totalPrice" class="font-bold text-blue-600 text-xl">0원</span>
                    </div>
                    <button onclick="submitOrder()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700">
                        주문하기
                    </button>
                </div>
            </div>
        </div>

        <!-- 주문 폼 모달 -->
        <div id="orderModal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-lg w-full">
                <div class="px-6 py-4 border-b">
                    <h3 class="text-xl font-bold">주문 정보 입력</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
                            <input type="text" id="customerName" placeholder="홍길동" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                            <input type="tel" id="customerPhone" placeholder="010-1234-5678" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">배송지 주소</label>
                            <input type="text" id="customerAddress" placeholder="경산시 ○○동 ○○" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">요청사항</label>
                            <textarea id="orderMemo" placeholder="예) 문 앞에 두고 가주세요" rows="3"
                                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 border-t flex gap-3">
                    <button onclick="closeOrderModal()" class="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                        취소
                    </button>
                    <button onclick="confirmOrder()" class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                        주문 접수
                    </button>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            const storeId = '${storeId}';
            let cart = JSON.parse(localStorage.getItem('cart_' + storeId)) || [];
            let storeInfo = null;

            // 가게 정보 로드
            async function loadStoreInfo() {
                try {
                    const response = await axios.get('/api/restaurants');
                    const restaurants = response.data || [];
                    storeInfo = restaurants.find(r => (r.id || r.name) === storeId);
                    
                    if (storeInfo) {
                        document.getElementById('storeInfo').innerHTML = \`
                            <div class="flex items-center gap-4">
                                <img src="\${storeInfo.image || '/static/images/restaurant.svg'}" 
                                     alt="\${storeInfo.name}" 
                                     class="w-16 h-16 rounded-lg object-cover">
                                <div>
                                    <h2 class="text-xl font-bold text-gray-900">\${storeInfo.name}</h2>
                                    <div class="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                        <span class="flex items-center text-yellow-500">
                                            <i class="fas fa-star mr-1"></i>\${storeInfo.rating || '4.5'}
                                        </span>
                                        <span>\${storeInfo.deliveryTime || '30-40'}분</span>
                                        <span class="text-green-600 font-semibold">배달비 0원</span>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }
                } catch (error) {
                    console.error('가게 정보 로딩 실패:', error);
                }
            }

            // 메뉴 목록 로드
            async function loadMenus() {
                try {
                    const response = await axios.get(\`/api/stores/\${storeId}/menus\`);
                    const menus = response.data || [];
                    renderMenus(menus);
                } catch (error) {
                    console.error('메뉴 로딩 실패:', error);
                    document.getElementById('menuGrid').innerHTML = \`
                        <div class="col-span-full text-center py-12 text-gray-500">
                            <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                            <p>메뉴를 불러오는데 실패했습니다.</p>
                        </div>
                    \`;
                }
            }

            // 메뉴 렌더링
            function renderMenus(menus) {
                const grid = document.getElementById('menuGrid');
                
                if (menus.length === 0) {
                    grid.innerHTML = \`
                        <div class="col-span-full text-center py-12 text-gray-500">
                            <i class="fas fa-utensils text-4xl mb-4"></i>
                            <p>등록된 메뉴가 없습니다.</p>
                        </div>
                    \`;
                    return;
                }

                grid.innerHTML = menus.map(menu => \`
                    <div class="menu-item bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer" onclick="addToCart('\${menu.menuId}')">
                        <img src="\${menu.image || '/static/images/product.svg'}" 
                             alt="\${menu.name}"
                             class="w-full h-48 object-cover">
                        <div class="p-4">
                            <h3 class="font-bold text-gray-900 mb-1">\${menu.name}</h3>
                            <p class="text-sm text-gray-600 mb-3 line-clamp-2">\${menu.description || ''}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xl font-bold text-blue-600">\${menu.price.toLocaleString()}원</span>
                                <button onclick="event.stopPropagation(); addToCart('\${menu.menuId}')" 
                                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                                    <i class="fas fa-plus mr-1"></i>담기
                                </button>
                            </div>
                        </div>
                    </div>
                \`).join('');
            }

            // 장바구니에 추가
            async function addToCart(menuId) {
                try {
                    const response = await axios.get(\`/api/stores/\${storeId}/menus\`);
                    const menus = response.data || [];
                    const menu = menus.find(m => m.menuId === menuId);
                    
                    if (!menu) return;

                    const existing = cart.find(item => item.menuId === menuId);
                    if (existing) {
                        existing.qty += 1;
                    } else {
                        cart.push({ ...menu, qty: 1 });
                    }

                    localStorage.setItem('cart_' + storeId, JSON.stringify(cart));
                    updateCartBadge();
                    
                    // 간단한 피드백
                    const btn = event.target.closest('button');
                    if (btn) {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<i class="fas fa-check mr-1"></i>담김';
                        setTimeout(() => btn.innerHTML = originalText, 1000);
                    }
                } catch (error) {
                    console.error('장바구니 추가 실패:', error);
                }
            }

            // 장바구니 보기
            function viewCart() {
                if (cart.length === 0) {
                    alert('장바구니가 비어있습니다.');
                    return;
                }

                renderCart();
                document.getElementById('cartModal').classList.remove('hidden');
            }

            // 장바구니 닫기
            function closeCart() {
                document.getElementById('cartModal').classList.add('hidden');
            }

            // 장바구니 렌더링
            function renderCart() {
                const container = document.getElementById('cartItems');
                
                if (cart.length === 0) {
                    container.innerHTML = \`
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-shopping-cart text-4xl mb-4"></i>
                            <p>장바구니가 비어있습니다.</p>
                        </div>
                    \`;
                    document.getElementById('totalPrice').textContent = '0원';
                    return;
                }

                container.innerHTML = cart.map((item, index) => \`
                    <div class="flex items-center gap-4 mb-4 pb-4 border-b">
                        <img src="\${item.image || '/static/images/product.svg'}" 
                             alt="\${item.name}" 
                             class="w-20 h-20 rounded-lg object-cover">
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-900">\${item.name}</h4>
                            <p class="text-blue-600 font-semibold">\${item.price.toLocaleString()}원</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="updateQty(\${index}, -1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">
                                <i class="fas fa-minus text-xs"></i>
                            </button>
                            <span class="w-8 text-center font-semibold">\${item.qty}</span>
                            <button onclick="updateQty(\${index}, 1)" class="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                                <i class="fas fa-plus text-xs"></i>
                            </button>
                        </div>
                        <button onclick="removeFromCart(\${index})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                \`).join('');

                const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
                document.getElementById('totalPrice').textContent = total.toLocaleString() + '원';
            }

            // 수량 변경
            function updateQty(index, delta) {
                cart[index].qty += delta;
                if (cart[index].qty <= 0) {
                    cart.splice(index, 1);
                }
                localStorage.setItem('cart_' + storeId, JSON.stringify(cart));
                updateCartBadge();
                renderCart();
            }

            // 장바구니에서 제거
            function removeFromCart(index) {
                cart.splice(index, 1);
                localStorage.setItem('cart_' + storeId, JSON.stringify(cart));
                updateCartBadge();
                renderCart();
            }

            // 장바구니 배지 업데이트
            function updateCartBadge() {
                const badge = document.getElementById('cartBadge');
                const count = cart.reduce((sum, item) => sum + item.qty, 0);
                if (count > 0) {
                    badge.textContent = count;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }

            // 주문하기
            function submitOrder() {
                if (cart.length === 0) {
                    alert('장바구니가 비어있습니다.');
                    return;
                }

                const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
                if (total < 8000) {
                    alert('최소 주문금액은 8,000원입니다.');
                    return;
                }

                closeCart();
                document.getElementById('orderModal').classList.remove('hidden');
            }

            // 주문 모달 닫기
            function closeOrderModal() {
                document.getElementById('orderModal').classList.add('hidden');
            }

            // 주문 확정
            async function confirmOrder() {
                const name = document.getElementById('customerName').value.trim();
                const phone = document.getElementById('customerPhone').value.trim();
                const address = document.getElementById('customerAddress').value.trim();
                const memo = document.getElementById('orderMemo').value.trim();

                if (!name || !phone || !address) {
                    alert('이름, 연락처, 주소는 필수입니다.');
                    return;
                }

                const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

                const orderData = {
                    storeId,
                    customer: { name, phone, address },
                    items: cart,
                    pricing: {
                        itemsTotal: total,
                        deliveryFee: 0,
                        grandTotal: total
                    },
                    deliveryType: 'PUBLIC',
                    memo
                };

                try {
                    const response = await axios.post('/api/orders', orderData);
                    alert(\`주문이 접수되었습니다!\\n주문번호: \${response.data.orderId}\`);
                    
                    // 장바구니 초기화
                    cart = [];
                    localStorage.removeItem('cart_' + storeId);
                    updateCartBadge();
                    
                    closeOrderModal();
                    window.location.href = '/delivery';
                } catch (error) {
                    console.error('주문 실패:', error);
                    alert('주문에 실패했습니다. 다시 시도해주세요.');
                }
            }

            // 페이지 로드 시 실행
            document.addEventListener('DOMContentLoaded', () => {
                loadStoreInfo();
                loadMenus();
                updateCartBadge();
            });
        </script>
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

// 메뉴 페이지
app.get('/store/:storeId/menu', async (c) => {
  const storeId = c.req.param('storeId')
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>메뉴 보기 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div class="max-w-4xl mx-auto p-4">
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
                <button onclick="history.back()" class="text-gray-600 mb-4">
                    <i class="fas fa-arrow-left mr-2"></i>뒤로 가기
                </button>
                <h1 class="text-2xl font-bold mb-2">메뉴 보기</h1>
                <p class="text-gray-600">마음에 드는 메뉴를 장바구니에 담아보세요</p>
            </div>
            
            <div id="menuList" class="space-y-4">
                <div class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                    <p class="text-gray-500 mt-2">메뉴 불러오는 중...</p>
                </div>
            </div>
            
            <!-- 장바구니 플로팅 버튼 -->
            <div class="fixed bottom-4 right-4">
                <button onclick="goToOrder()" class="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition">
                    <i class="fas fa-shopping-cart mr-2"></i>
                    <span id="cartCount">0</span>개 담김
                </button>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
          const storeId = '${storeId}';
          let cartId = localStorage.getItem('cartId');
          let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          
          // 페이지 로드 시 메뉴 불러오기
          async function loadMenus() {
            try {
              const res = await axios.get(\`/api/stores/\${storeId}/menus\`);
              const menus = res.data;
              
              const menuList = document.getElementById('menuList');
              menuList.innerHTML = menus.map(menu => \`
                <div class="bg-white rounded-lg shadow-sm p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="text-lg font-bold mb-1">\${menu.menuName}</h3>
                      <p class="text-gray-600 text-sm mb-2">\${menu.category || '한식'}</p>
                      <p class="text-blue-600 font-bold text-xl">\${menu.price.toLocaleString()}원</p>
                    </div>
                    <button onclick="addToCart('\${menu.menuId}', '\${menu.menuName}', \${menu.price})" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      담기
                    </button>
                  </div>
                </div>
              \`).join('');
              
              updateCartCount();
            } catch (error) {
              console.error('메뉴 불러오기 실패:', error);
            }
          }
          
          // 장바구니에 담기
          async function addToCart(menuId, menuName, price) {
            // 로컬 장바구니에 추가
            const existingItem = cartItems.find(item => item.menuId === menuId);
            if (existingItem) {
              existingItem.quantity++;
            } else {
              cartItems.push({ menuId, menuName, price, quantity: 1 });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
            
            // 토스트 메시지
            alert('장바구니에 담았습니다!');
          }
          
          function updateCartCount() {
            const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cartCount').textContent = totalCount;
          }
          
          function goToOrder() {
            if (cartItems.length === 0) {
              alert('장바구니가 비어있습니다');
              return;
            }
            window.location.href = \`/store/\${storeId}/order\`;
          }
          
          loadMenus();
        </script>
    </body>
    </html>
  `)
})

// 메뉴 페이지
app.get('/store/:storeId/menu', async (c) => {
  const storeId = c.req.param('storeId')
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>메뉴 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <style>
          .menu-card {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .menu-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          }
          .order-btn {
            background: #22c55e;
            color: #fff;
            padding: 10px 14px;
            border-radius: 8px;
            font-weight: bold;
            transition: all 0.2s;
          }
          .order-btn:hover {
            background: #16a34a;
          }
          .order-btn:active {
            transform: scale(0.97);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 헤더 -->
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <button onclick="history.back()" class="text-gray-600 hover:text-gray-900">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h1 class="text-xl font-bold text-gray-900">메뉴</h1>
                    <button onclick="goToCart()" class="relative text-gray-600 hover:text-gray-900">
                        <i class="fas fa-shopping-cart text-xl"></i>
                        <span id="cartBadge" class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- 메뉴 목록 -->
        <div class="max-w-7xl mx-auto px-4 py-6">
            <div id="menuList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- 메뉴 카드들이 여기에 렌더링됩니다 -->
            </div>
        </div>

        <script>
          const storeId = '${storeId}';
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          
          // 메뉴 로드
          async function loadMenus() {
            try {
              const res = await axios.get(\`/api/stores/\${storeId}/menus\`);
              const menus = res.data;
              
              const menuList = document.getElementById('menuList');
              menuList.innerHTML = menus.map(menu => \`
                <div class="menu-card bg-white rounded-lg shadow-sm overflow-hidden">
                  <div class="p-4">
                    <h3 class="text-lg font-bold mb-2">\${menu.menuName}</h3>
                    <p class="text-2xl font-bold text-blue-600 mb-3">\${menu.price.toLocaleString()}원</p>
                    <button 
                      class="order-btn w-full"
                      data-menu-id="\${menu.menuId}"
                      data-menu-name="\${menu.menuName}"
                      data-price="\${menu.price}"
                      onclick="addToCart(this)"
                    >
                      <i class="fas fa-cart-plus mr-2"></i>
                      장바구니에 담기
                    </button>
                  </div>
                </div>
              \`).join('');
              
              updateCartBadge();
            } catch (error) {
              console.error('메뉴 로드 실패:', error);
              alert('메뉴를 불러오는데 실패했습니다');
            }
          }
          
          // 장바구니에 추가
          function addToCart(btn) {
            const product = {
              id: btn.dataset.menuId,
              name: btn.dataset.menuName,
              price: parseInt(btn.dataset.price),
              qty: 1,
              storeId: storeId,
              addedAt: new Date().toISOString()
            };
            
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // 사용자 피드백
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>담았습니다!';
            btn.style.background = '#10b981';
            
            setTimeout(() => {
              btn.innerHTML = '<i class="fas fa-cart-plus mr-2"></i>장바구니에 담기';
              btn.style.background = '#22c55e';
            }, 1500);
            
            updateCartBadge();
            console.log('🛒 현재 장바구니:', cart);
          }
          
          // 장바구니 배지 업데이트
          function updateCartBadge() {
            const badge = document.getElementById('cartBadge');
            if (cart.length > 0) {
              badge.textContent = cart.length;
              badge.classList.remove('hidden');
            } else {
              badge.classList.add('hidden');
            }
          }
          
          // 장바구니로 이동
          function goToCart() {
            if (cart.length === 0) {
              alert('장바구니가 비어있습니다');
              return;
            }
            window.location.href = \`/store/\${storeId}/order\`;
          }
          
          // 페이지 로드
          loadMenus();
        </script>
    </body>
    </html>
  `)
})

// 주문 페이지
app.get('/store/:storeId/order', async (c) => {
  const storeId = c.req.param('storeId')
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>주문하기 - 경산온(ON)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div class="max-w-4xl mx-auto p-4">
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
                <button onclick="history.back()" class="text-gray-600 mb-4">
                    <i class="fas fa-arrow-left mr-2"></i>뒤로 가기
                </button>
                <h1 class="text-2xl font-bold mb-2">주문하기</h1>
                <p class="text-gray-600">주문 내역을 확인하고 결제해주세요</p>
            </div>
            
            <!-- 주문 내역 -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h2 class="text-lg font-bold mb-4">주문 내역</h2>
                <div id="orderItems" class="space-y-3">
                    <!-- 주문 아이템들이 여기에 표시됩니다 -->
                </div>
            </div>
            
            <!-- 무료배달 안내 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div class="flex items-center">
                    <i class="fas fa-truck text-blue-600 text-2xl mr-3"></i>
                    <div>
                        <p class="font-bold text-blue-900">배달비 0원</p>
                        <p class="text-sm text-blue-700">경산은 모든 배달이 무료입니다!</p>
                    </div>
                </div>
            </div>
            
            <!-- 금액 정보 -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">주문 금액</span>
                        <span id="subtotal" class="font-bold">0원</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">배달비</span>
                        <span class="text-blue-600 font-bold">0원</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between">
                        <span class="font-bold text-lg">총 결제 금액</span>
                        <span id="total" class="font-bold text-xl text-blue-600">0원</span>
                    </div>
                </div>
            </div>
            
            <!-- 결제 버튼 -->
            <button onclick="processOrder()" class="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition">
                결제하기
            </button>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
          const storeId = '${storeId}';
          let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          
          // 페이지 로드 시 초기화
          function init() {
            if (cartItems.length === 0) {
              alert('장바구니가 비어있습니다');
              window.location.href = \`/store/\${storeId}/menu\`;
              return;
            }
            
            displayOrderItems();
            calculateTotal();
          }
          
          function displayOrderItems() {
            const orderItemsDiv = document.getElementById('orderItems');
            orderItemsDiv.innerHTML = cartItems.map(item => \`
              <div class="flex justify-between items-center border-b pb-3">
                <div>
                  <p class="font-bold">\${item.menuName}</p>
                  <p class="text-sm text-gray-600">\${item.price.toLocaleString()}원 × \${item.quantity}</p>
                </div>
                <p class="font-bold">\${(item.price * item.quantity).toLocaleString()}원</p>
              </div>
            \`).join('');
          }
          
          function calculateTotal() {
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('subtotal').textContent = subtotal.toLocaleString() + '원';
            document.getElementById('total').textContent = subtotal.toLocaleString() + '원';
          }
          
          async function processOrder() {
            try {
              const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              
              // 주문 생성 API 호출
              const res = await axios.post('/api/orders/start', {
                storeId,
                items: cartItems,
                subtotalAmount: subtotal,
                deliveryFee: 0,
                totalAmount: subtotal
              });
              
              if (res.data.success) {
                alert('주문이 완료되었습니다!\\n주문번호: ' + res.data.orderId);
                
                // 장바구니 비우기
                localStorage.removeItem('cartItems');
                localStorage.removeItem('cartId');
                
                // 홈으로 이동
                window.location.href = '/';
              }
            } catch (error) {
              console.error('주문 실패:', error);
              alert('주문 처리 중 오류가 발생했습니다');
            }
          }
          
          init();
        </script>
    </body>
    </html>
  `)
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
                <span>경산온(ON)</span>
            </a>
            
            <nav class="pc-header-nav">
                <a href="/" class="active">홈</a>
                <a href="/delivery">배달</a>
                <a href="/market">전통시장</a>
                <a href="/static/localfood.html">로컬푸드</a>
                <a href="/specialty">특산물</a>
                <a href="/static/trade.html">중고·나눔</a>
                <a href="/partner/apply">가맹점 신청</a>
                <a href="#support">고객센터</a>
            </nav>
            
            <div class="pc-header-actions">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <i class="fas fa-user mr-2"></i>
                    <span>로그인</span>
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
                            <h1 class="text-lg font-bold text-gray-900">경산온(ON)</h1>
                            <p class="text-xs text-gray-500">배달비 0원</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <select id="citySelector" class="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
                            <option value="gyeongsan">경산시</option>
                            <option value="pohang">포항시</option>
                            <option value="gumi">구미시</option>
                            <option value="andong">안동시</option>
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
                            <span>홈</span>
                        </a>
                        <a href="/delivery" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-motorcycle mr-3 text-blue-600"></i>
                            <span>배달</span>
                        </a>
                        <a href="/market" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-store mr-3 text-blue-600"></i>
                            <span>전통시장</span>
                        </a>
                        <a href="/static/localfood.html" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-leaf mr-3 text-green-600"></i>
                            <span>로컬푸드</span>
                        </a>
                        <a href="/specialty" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-star mr-3 text-orange-600"></i>
                            <span>특산물</span>
                        </a>
                        <a href="/static/trade.html" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-exchange-alt mr-3 text-purple-600"></i>
                            <span>중고·나눔</span>
                        </a>
                        <a href="/partner/apply" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-handshake mr-3 text-indigo-600"></i>
                            <span>가맹점 신청</span>
                        </a>
                        <a href="/support" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-headset mr-3 text-pink-600"></i>
                            <span>고객센터</span>
                        </a>
                    </nav>
                    <div class="mt-6 pt-6 border-t">
                        <button class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-user mr-2"></i>
                            <span>로그인</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 메인 콘텐츠 -->
        <div id="app" class="app-container">
            <!-- 샘플 레스토랑 카드 -->
            <div class="p-4 max-w-6xl mx-auto">
                <div class="mb-4">
                    <h2 class="text-2xl font-bold mb-2">🍜 배달 음식점</h2>
                    <p class="text-gray-600">배달비 0원! 경산온에서 주문하세요</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- 레스토랑 카드 1 -->
                    <div class="card">
                        <img src="/static/images/restaurant.svg" alt="장산 커피 로스터스" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-lg font-bold">장산 커피 로스터스</h3>
                                <span class="badge badge-info text-xs">카페·디저트</span>
                            </div>
                            <div class="flex items-center text-yellow-500 text-sm mb-2">
                                <i class="fas fa-star mr-1"></i>
                                <span class="font-bold mr-1">4.6</span>
                                <span class="text-gray-500">(26)</span>
                                <span class="mx-2">|</span>
                                <span class="text-gray-600">15-25분</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">스페셜 로스팅 신선한 모든 커피</p>
                            <div class="flex items-center justify-between">
                                <span class="badge badge-primary text-xs">배달비 0원</span>
                                <div class="flex gap-2">
                                    <button onclick="goToMenu('경산커피1')" class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
                                        메뉴 보기
                                    </button>
                                    <button onclick="startOrder('경산커피1')" class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                                        주문하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 레스토랑 카드 2 -->
                    <div class="card">
                        <img src="/static/images/restaurant.svg" alt="경산 전통 한정식" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-lg font-bold">경산 전통 한정식</h3>
                                <span class="badge badge-success text-xs">한식</span>
                            </div>
                            <div class="flex items-center text-yellow-500 text-sm mb-2">
                                <i class="fas fa-star mr-1"></i>
                                <span class="font-bold mr-1">4.8</span>
                                <span class="text-gray-500">(42)</span>
                                <span class="mx-2">|</span>
                                <span class="text-gray-600">20-30분</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">경산 대표 한식당</p>
                            <div class="flex items-center justify-between">
                                <span class="badge badge-primary text-xs">배달비 0원</span>
                                <div class="flex gap-2">
                                    <button onclick="goToMenu('경산한식1')" class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
                                        메뉴 보기
                                    </button>
                                    <button onclick="startOrder('경산한식1')" class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                                        주문하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 레스토랑 카드 3 -->
                    <div class="card">
                        <img src="/static/images/restaurant.svg" alt="경산 치킨" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-lg font-bold">경산 치킨</h3>
                                <span class="badge badge-warning text-xs">치킨·피자</span>
                            </div>
                            <div class="flex items-center text-yellow-500 text-sm mb-2">
                                <i class="fas fa-star mr-1"></i>
                                <span class="font-bold mr-1">4.5</span>
                                <span class="text-gray-500">(38)</span>
                                <span class="mx-2">|</span>
                                <span class="text-gray-600">15-20분</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">바삭한 국내산 치킨</p>
                            <div class="flex items-center justify-between">
                                <span class="badge badge-primary text-xs">배달비 0원</span>
                                <div class="flex gap-2">
                                    <button onclick="goToMenu('경산치킨1')" class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
                                        메뉴 보기
                                    </button>
                                    <button onclick="startOrder('경산치킨1')" class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                                        주문하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 로컬푸드 섹션 -->
                <div class="p-4 max-w-6xl mx-auto mt-8">
                    <div class="mb-4 flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">🥬 로컬 푸드</h2>
                            <p class="text-gray-600">당일 수확 신선 배송</p>
                        </div>
                        <a href="/static/localfood" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            전체보기 <i class="fas fa-chevron-right ml-1"></i>
                        </a>
                    </div>
                    
                    <div id="localFoodGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- 로딩 중 -->
                        <div class="col-span-full text-center py-8">
                            <i class="fas fa-spinner fa-spin text-3xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-600">로컬푸드를 불러오는 중...</p>
                        </div>
                    </div>
                </div>

                <!-- 공공 주문 맛집 섹션 -->
                <div class="p-4 max-w-6xl mx-auto mt-8 mb-20">
                    <div class="mb-4">
                        <h2 class="text-2xl font-bold mb-2">🏪 공공 주문 맛집</h2>
                        <p class="text-gray-600">경산시가 추천하는 맛집</p>
                    </div>
                    
                    <div id="publicRestaurantGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- 공공 주문 맛집 카드들이 여기에 렌더링됩니다 -->
                    </div>
                </div>
            </div>
        </div>

        <!-- 챗봇 플로팅 버튼 -->
        <a href="/static/i18n/chatbot-ko" class="chatbot-button" title="온이 챗봇">
            <i class="fas fa-comments"></i>
        </a>

        <!-- 모바일 하단 네비게이션 -->
        <nav class="mobile-tab bottom-nav">
            <div class="nav-item active" data-page="home">
                <i class="fas fa-home text-xl mb-1"></i>
                <span class="text-xs">홈</span>
            </div>
            <div class="nav-item" data-page="delivery">
                <i class="fas fa-motorcycle text-xl mb-1"></i>
                <span class="text-xs">배달</span>
            </div>
            <div class="nav-item" data-page="market">
                <i class="fas fa-store text-xl mb-1"></i>
                <span class="text-xs">중고·나눔</span>
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
          // 햄버거 메뉴 기능
          function openMenu() {
            document.getElementById('menuDrawer').classList.remove('hidden');
          }
          
          function closeMenu() {
            document.getElementById('menuDrawer').classList.add('hidden');
          }
          
          // 메뉴 보기 버튼 클릭 (장바구니 없이 메뉴만 보기)
          function goToMenu(storeId) {
            window.location.href = \`/store/\${storeId}/menu\`;
          }
          
          // 주문하기 버튼 클릭 (장바구니 생성 후 주문 페이지로)
          async function startOrder(storeId) {
            try {
              // 1. 장바구니 생성
              const res = await axios.post('/api/cart/create', { storeId });
              
              if (res.data.success) {
                const cartId = res.data.cartId;
                
                // 2. localStorage에 cartId 저장
                localStorage.setItem('cartId', cartId);
                localStorage.setItem('storeId', storeId);
                
                // 3. 메뉴 페이지로 이동
                window.location.href = \`/store/\${storeId}/menu\`;
              }
            } catch (error) {
              console.error('주문 시작 실패:', error);
              alert('주문 시작 중 오류가 발생했습니다');
            }
          }
          
          // 로컬푸드 로드
          async function loadLocalFoods() {
            try {
              const response = await axios.get('/api/local-food-products');
              const products = response.data.products || [];
              renderLocalFoods(products.slice(0, 3)); // 상위 3개만 표시
            } catch (error) {
              console.error('로컬푸드 로딩 실패:', error);
              document.getElementById('localFoodGrid').innerHTML = \`
                <div class="col-span-full text-center py-8 text-gray-500">
                  <i class="fas fa-exclamation-circle text-3xl mb-2"></i>
                  <p class="text-sm">로컬푸드를 불러오는데 실패했습니다.</p>
                </div>
              \`;
            }
          }

          // 로컬푸드 렌더링
          function renderLocalFoods(products) {
            const grid = document.getElementById('localFoodGrid');
            
            if (!grid) {
              console.error('localFoodGrid element not found');
              return;
            }
            
            if (products.length === 0) {
              grid.innerHTML = \`
                <div class="col-span-full text-center py-8 text-gray-500">
                  <i class="fas fa-box-open text-3xl mb-2"></i>
                  <p class="text-sm">등록된 상품이 없습니다.</p>
                </div>
              \`;
              return;
            }

            grid.innerHTML = products.map(product => {
              const fallbackImage = 'https://via.placeholder.com/400x300/22c55e/ffffff?text=' + product.productName.substring(0, 10);
              return \`
                <div class="card cursor-pointer hover:shadow-lg transition" onclick="window.location.href='/static/localfood'">
                  <div class="relative h-48 bg-gray-200">
                    <img src="\${product.thumbnail || '/static/images/product.svg'}" 
                         alt="\${product.productName}"
                         crossorigin="anonymous"
                         loading="lazy"
                         onerror="this.onerror=null; this.src='\${fallbackImage}';"
                         class="w-full h-full object-cover">
                    <span class="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      <i class="fas fa-leaf mr-1"></i>당일수확
                    </span>
                  </div>
                  <div class="p-3">
                    <h4 class="font-medium text-gray-900 mb-1 line-clamp-1">\${product.productName}</h4>
                    <p class="text-sm text-gray-600 mb-2">
                      <i class="fas fa-user-farmer mr-1"></i>\${product.farmerName}
                    </p>
                    <div class="flex items-center justify-between">
                      <span class="text-lg font-bold text-gray-900">
                        \${product.price.toLocaleString()}원
                      </span>
                      <button onclick="event.stopPropagation(); window.location.href='/static/localfood'" 
                              class="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition font-medium">
                        담기
                      </button>
                    </div>
                  </div>
                </div>
              \`;
            }).join('');
            
            console.log('로컬푸드 렌더링 완료:', products.length, '개');
          }

          // 공공 주문 맛집 로드
          async function loadPublicRestaurants() {
            try {
              const response = await axios.get('/api/restaurants');
              const restaurants = response.data || [];
              renderPublicRestaurants(restaurants.slice(3, 6)); // 4~6번째 음식점 표시
            } catch (error) {
              console.error('공공 주문 맛집 로딩 실패:', error);
              document.getElementById('publicRestaurantGrid').innerHTML = \`
                <div class="col-span-full text-center py-8 text-gray-500">
                  <i class="fas fa-exclamation-circle text-3xl mb-2"></i>
                  <p class="text-sm">음식점을 불러오는데 실패했습니다.</p>
                </div>
              \`;
            }
          }

          // 공공 주문 맛집 렌더링
          function renderPublicRestaurants(restaurants) {
            const grid = document.getElementById('publicRestaurantGrid');
            
            if (!grid) {
              console.error('publicRestaurantGrid element not found');
              return;
            }
            
            if (restaurants.length === 0) {
              grid.innerHTML = \`
                <div class="col-span-full text-center py-8 text-gray-500">
                  <i class="fas fa-store-slash text-3xl mb-2"></i>
                  <p class="text-sm">등록된 음식점이 없습니다.</p>
                </div>
              \`;
              return;
            }

            grid.innerHTML = restaurants.map(restaurant => {
              const fallbackImage = 'https://via.placeholder.com/400x250/3b82f6/ffffff?text=' + restaurant.name.substring(0, 10);
              return \`
                <div class="card">
                  <img src="\${restaurant.image || '/static/images/restaurant.svg'}" 
                       alt="\${restaurant.name}"
                       crossorigin="anonymous"
                       loading="lazy"
                       onerror="this.onerror=null; this.src='\${fallbackImage}';"
                       class="w-full h-48 object-cover">
                  <div class="p-4">
                    <div class="flex items-center justify-between mb-2">
                      <h3 class="text-lg font-bold">\${restaurant.name}</h3>
                      <span class="badge badge-info text-xs">\${restaurant.category || '음식점'}</span>
                    </div>
                    <div class="flex items-center text-yellow-500 text-sm mb-2">
                      <i class="fas fa-star mr-1"></i>
                      <span class="font-bold mr-1">\${restaurant.rating || '4.5'}</span>
                      <span class="text-gray-500">(\${restaurant.reviewCount || '0'})</span>
                      <span class="mx-2">|</span>
                      <span class="text-gray-600">\${restaurant.deliveryTime || '30-40'}분</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">\${restaurant.description || ''}</p>
                    <div class="flex items-center justify-between">
                      <span class="badge badge-primary text-xs">배달비 0원</span>
                      <div class="flex gap-2">
                        <button onclick="goToMenu('\${restaurant.id || restaurant.name}')" 
                                class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition font-medium">
                          메뉴 보기
                        </button>
                        <button onclick="startOrder('\${restaurant.id || restaurant.name}')" 
                                class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition font-semibold">
                          주문하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              \`;
            }).join('');
            
            console.log('공공 주문 맛집 렌더링 완료:', restaurants.length, '개');
          }
          
          // 페이지 초기화
          document.addEventListener('DOMContentLoaded', function() {
            console.log('페이지 초기화 시작');
            
            // 햄버거 메뉴 버튼 이벤트
            const menuBtn = document.getElementById('menuBtn');
            if (menuBtn) {
              menuBtn.addEventListener('click', openMenu);
              console.log('햄버거 메뉴 버튼 이벤트 등록 완료');
            }
            
            // 로컬푸드 및 공공 주문 맛집 로드
            loadLocalFoods();
            loadPublicRestaurants();
            
            // 언어를 한국어로 설정
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'ko');
            
            console.log('페이지 초기화 완료');
          });
        </script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
