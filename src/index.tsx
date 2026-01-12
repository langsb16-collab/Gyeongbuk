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
    {
      itemId: 'TRADE-001',
      title: '삼성 냉장고 (2021년형)',
      price: 150000,
      isFree: false,
      category: '가전',
      thumbnail: 'https://via.placeholder.com/300x200',
      status: 'AVAILABLE',
      createdAt: new Date().toISOString()
    },
    {
      itemId: 'TRADE-003',
      title: '무료나눔 - 유아용 자전거',
      price: 0,
      isFree: true,
      category: '유아용품',
      thumbnail: 'https://via.placeholder.com/300x200',
      status: 'AVAILABLE',
      createdAt: new Date().toISOString()
    }
  ]
  
  return c.json(isFree ? sampleItems.filter(i => i.isFree) : sampleItems)
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
                <!-- 다국어 드롭다운 -->
                <div class="lang-select">
                    <button class="lang-btn">
                        <span class="lang-text">한국어</span>
                        <span class="lang-arrow">▾</span>
                    </button>
                    <ul class="lang-menu">
                        <li class="active" data-lang="ko">한국어</li>
                        <li data-lang="en">English</li>
                        <li data-lang="zh">中文</li>
                        <li data-lang="ja">日本語</li>
                        <li data-lang="es">Español</li>
                        <li data-lang="fr">Français</li>
                        <li data-lang="ar">العربية</li>
                        <li data-lang="de">Deutsch</li>
                    </ul>
                </div>
                
                <button class="lang-btn">
                    <i class="fas fa-user"></i>
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
                        <!-- 모바일 다국어 드롭다운 -->
                        <div class="lang-select">
                            <button class="lang-btn" style="padding: 6px 10px; font-size: 13px;">
                                <span class="lang-text">한국어</span>
                                <span class="lang-arrow">▾</span>
                            </button>
                            <ul class="lang-menu">
                                <li class="active" data-lang="ko">한국어</li>
                                <li data-lang="en">English</li>
                                <li data-lang="zh">中文</li>
                                <li data-lang="ja">日本語</li>
                                <li data-lang="es">Español</li>
                                <li data-lang="fr">Français</li>
                                <li data-lang="ar">العربية</li>
                                <li data-lang="de">Deutsch</li>
                            </ul>
                        </div>
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
                            홈
                        </a>
                        <a href="/delivery" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-motorcycle mr-3 text-blue-600"></i>
                            배달
                        </a>
                        <a href="/market" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-store mr-3 text-blue-600"></i>
                            전통시장
                        </a>
                        <a href="/static/localfood.html" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-leaf mr-3 text-green-600"></i>
                            로컬푸드
                        </a>
                        <a href="/specialty" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-star mr-3 text-orange-600"></i>
                            특산물
                        </a>
                        <a href="/static/trade.html" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-exchange-alt mr-3 text-purple-600"></i>
                            중고·나눔
                        </a>
                        <a href="/partner/apply" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-handshake mr-3 text-indigo-600"></i>
                            가맹점 신청
                        </a>
                        <a href="/support" class="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
                            <i class="fas fa-headset mr-3 text-pink-600"></i>
                            고객센터
                        </a>
                    </nav>
                    <div class="mt-6 pt-6 border-t">
                        <button class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-user mr-2"></i>
                            로그인
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
          
          document.getElementById('menuBtn')?.addEventListener('click', openMenu);
          
          // 다국어 드롭다운 기능
          document.addEventListener('DOMContentLoaded', function() {
            const langSelects = document.querySelectorAll('.lang-select');
            
            langSelects.forEach(select => {
              const btn = select.querySelector('.lang-btn');
              const menu = select.querySelector('.lang-menu');
              const langText = select.querySelector('.lang-text');
              const items = select.querySelectorAll('.lang-menu li');
              
              // 버튼 클릭 시 토글
              btn.addEventListener('click', (e) => {
                e.stopPropagation();
                select.classList.toggle('open');
                
                // 다른 드롭다운 닫기
                langSelects.forEach(other => {
                  if (other !== select) other.classList.remove('open');
                });
              });
              
              // 언어 선택
              items.forEach(item => {
                item.addEventListener('click', () => {
                  const lang = item.dataset.lang;
                  const text = item.textContent;
                  
                  // 선택된 언어 표시
                  items.forEach(i => i.classList.remove('active'));
                  item.classList.add('active');
                  
                  // 버튼 텍스트 변경
                  langText.textContent = text;
                  
                  // 로컬 스토리지에 저장
                  localStorage.setItem('lang', lang);
                  
                  // 챗봇 페이지로 이동 (언어별)
                  const chatbotBtn = document.querySelector('.chatbot-button');
                  if (chatbotBtn) {
                    chatbotBtn.href = '/static/i18n/chatbot-' + lang;
                  }
                  
                  // 드롭다운 닫기
                  select.classList.remove('open');
                  
                  // 토스트 메시지 (선택사항)
                  console.log('언어가 변경되었습니다: ' + text);
                });
              });
            });
            
            // 외부 클릭 시 드롭다운 닫기
            document.addEventListener('click', () => {
              langSelects.forEach(select => {
                select.classList.remove('open');
              });
            });
            
            // 저장된 언어 불러오기
            const savedLang = localStorage.getItem('lang') || 'ko';
            const langNames = {
              'ko': '한국어',
              'en': 'English',
              'zh': '中文',
              'ja': '日本語',
              'es': 'Español',
              'fr': 'Français',
              'ar': 'العربية',
              'de': 'Deutsch'
            };
            
            langSelects.forEach(select => {
              const langText = select.querySelector('.lang-text');
              const items = select.querySelectorAll('.lang-menu li');
              
              if (langText) {
                langText.textContent = langNames[savedLang] || '한국어';
              }
              
              items.forEach(item => {
                if (item.dataset.lang === savedLang) {
                  item.classList.add('active');
                } else {
                  item.classList.remove('active');
                }
              });
            });
            
            // 챗봇 버튼 URL 초기화
            const chatbotBtn = document.querySelector('.chatbot-button');
            if (chatbotBtn) {
              chatbotBtn.href = '/static/i18n/chatbot-' + savedLang;
            }
          });
        </script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
