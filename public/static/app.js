// 경북 공공상생 플랫폼 - 프론트엔드 애플리케이션
// 전통시장·로컬푸드 중심 + 사전등록 가맹점 기능

// 전역 상태
const state = {
  currentPage: 'home',
  currentCity: 'gyeongsan',
  currentTab: 'all',
  restaurants: [],
  marketProducts: [],
  localFoods: [],
  usedItems: [],
  freeItems: [],
  safeZones: [],
  coupons: [],
  statistics: {},
  categories: [],
  cart: []
};

// 초기화
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderPage();
  attachEventListeners();
});

// 데이터 로드
async function loadData() {
  try {
    const [
      restaurants,
      marketProducts,
      localFoods,
      usedItems,
      freeItems,
      safeZones,
      coupons,
      statistics,
      categories
    ] = await Promise.all([
      axios.get('/api/restaurants').then(r => r.data),
      axios.get('/api/market-products').then(r => r.data),
      axios.get('/api/local-foods').then(r => r.data),
      axios.get('/api/used-items').then(r => r.data),
      axios.get('/api/free-items').then(r => r.data),
      axios.get('/api/safe-zones').then(r => r.data),
      axios.get('/api/coupons').then(r => r.data),
      axios.get('/api/statistics').then(r => r.data),
      axios.get('/api/restaurant-categories').then(r => r.data)
    ]);

    state.restaurants = restaurants;
    state.marketProducts = marketProducts;
    state.localFoods = localFoods;
    state.usedItems = usedItems;
    state.freeItems = freeItems;
    state.safeZones = safeZones;
    state.coupons = coupons;
    state.statistics = statistics;
    state.categories = categories;
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
  }
}

// 이벤트 리스너
function attachEventListeners() {
  // 네비게이션
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const page = e.currentTarget.dataset.page;
      navigateTo(page);
    });
  });

  // 도시 선택
  document.getElementById('citySelector').addEventListener('change', (e) => {
    state.currentCity = e.target.value;
    renderPage();
  });

  // 모달 닫기 (배경 클릭)
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

// 페이지 네비게이션
function navigateTo(page) {
  state.currentPage = page;
  
  // 네비게이션 활성화 상태 업데이트
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) {
      item.classList.add('active');
    }
  });
  
  renderPage();
}

// 페이지 렌더링
function renderPage() {
  const app = document.getElementById('app');
  
  switch (state.currentPage) {
    case 'home':
      app.innerHTML = renderHomePage();
      break;
    case 'delivery':
      app.innerHTML = renderDeliveryPage();
      attachDeliveryEventListeners();
      break;
    case 'market':
      app.innerHTML = renderMarketPage();
      attachMarketEventListeners();
      break;
    case 'coupon':
      app.innerHTML = renderCouponPage();
      break;
    case 'my':
      app.innerHTML = renderMyPage();
      break;
    default:
      app.innerHTML = renderHomePage();
  }
}

// ============================================
// 홈 페이지
// ============================================
function renderHomePage() {
  const stats = state.statistics;
  
  return `
    <div class="p-4 space-y-6">
      <!-- 배너 -->
      <div class="stat-card">
        <h2 class="text-xl font-bold mb-2">🎉 경산시 시범 운영 중</h2>
        <p class="text-sm opacity-90 mb-3">수수료 0% · 광고비 0% · 배달비 지원</p>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <div class="text-2xl font-bold">${(stats.savingsForMerchants / 100000000).toFixed(1)}억원</div>
            <div class="text-xs opacity-80">소상공인 절감액</div>
          </div>
          <div>
            <div class="text-2xl font-bold">${stats.merchantCount}곳</div>
            <div class="text-xs opacity-80">입점 가맹점</div>
          </div>
          <div>
            <div class="text-2xl font-bold">${stats.activeUsers.toLocaleString()}</div>
            <div class="text-xs opacity-80">이용 시민</div>
          </div>
        </div>
      </div>

      <!-- 공공 플랫폼 차별점 -->
      <div class="bg-blue-50 rounded-xl p-4">
        <h3 class="font-bold mb-3 flex items-center gap-2">
          <i class="fas fa-check-circle text-blue-500"></i>
          공공 플랫폼 차별점
        </h3>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="flex items-center gap-2">
            <i class="fas fa-percent text-blue-500"></i>
            <span>수수료 0%</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-ban text-blue-500"></i>
            <span>광고비 0원</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-truck text-blue-500"></i>
            <span>배달비 무료/최소화</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-coins text-blue-500"></i>
            <span>지역화폐 혜택</span>
          </div>
        </div>
      </div>

      <!-- 퀵 메뉴 -->
      <div class="bg-white rounded-xl p-4">
        <div class="grid grid-cols-4 gap-4">
          <div class="text-center cursor-pointer" onclick="showTraditionalMarket()">
            <div class="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i class="fas fa-store text-orange-500 text-xl"></i>
            </div>
            <div class="text-xs font-medium">전통시장</div>
            <div class="text-xs text-orange-500 font-bold">통합장보기</div>
          </div>
          <div class="text-center cursor-pointer" onclick="showLocalFood()">
            <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i class="fas fa-leaf text-green-500 text-xl"></i>
            </div>
            <div class="text-xs font-medium">로컬푸드</div>
            <div class="text-xs text-green-500 font-bold">당일수확</div>
          </div>
          <div class="text-center cursor-pointer" onclick="navigateTo('delivery')">
            <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i class="fas fa-motorcycle text-blue-500 text-xl"></i>
            </div>
            <div class="text-xs font-medium">음식배달</div>
            <div class="text-xs text-blue-500 font-bold">무료배달</div>
          </div>
          <div class="text-center cursor-pointer" onclick="navigateTo('market')">
            <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i class="fas fa-recycle text-purple-500 text-xl"></i>
            </div>
            <div class="text-xs font-medium">중고나눔</div>
            <div class="text-xs text-purple-500 font-bold">안전거래</div>
          </div>
        </div>
      </div>

      <!-- 전통시장 통합 장보기 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">🏪 전통시장 통합 장보기</h3>
          <button class="text-sm text-orange-500 font-semibold" onclick="showTraditionalMarket()">전체보기 →</button>
        </div>
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl mb-3">
          <div class="flex items-start gap-3">
            <i class="fas fa-shopping-basket text-2xl"></i>
            <div class="flex-1">
              <h4 class="font-bold mb-1">여러 가게를 한 번에!</h4>
              <p class="text-xs opacity-90">반찬집 + 정육점 + 과일가게 = 1회 주문</p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          ${state.marketProducts.slice(0, 4).map(p => `
            <div class="card cursor-pointer" onclick="addToMarketCart('${p.id}')">
              <img src="${p.image}" alt="${p.product}" class="w-full h-32 object-cover">
              <div class="p-3">
                <div class="text-xs text-orange-600 font-semibold mb-1">${p.market}</div>
                <h4 class="text-sm font-bold mb-1 line-clamp-1">${p.product}</h4>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold">${p.price.toLocaleString()}원</span>
                  <span class="badge badge-warning text-xs">묶음배달</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 오늘의 로컬푸드 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">🌱 오늘의 로컬푸드</h3>
          <button class="text-sm text-green-500 font-semibold" onclick="showLocalFood()">전체보기 →</button>
        </div>
        <div class="bg-green-50 p-3 rounded-lg mb-3">
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-tractor text-green-600"></i>
            <span class="font-semibold text-green-800">오늘 아침 수확 · 농가 직배송</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          ${state.localFoods.slice(0, 4).map(f => `
            <div class="card">
              <div class="relative">
                <img src="${f.image}" alt="${f.product}" class="w-full h-32 object-cover">
                <div class="absolute top-2 left-2 badge badge-success">${f.harvest}</div>
              </div>
              <div class="p-3">
                <div class="text-xs text-green-600 font-semibold mb-1">${f.farmName}</div>
                <h4 class="text-sm font-bold mb-1 line-clamp-1">${f.product}</h4>
                <div class="text-xs text-gray-500 mb-2">${f.region}</div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold">${f.price.toLocaleString()}원</span>
                  <button class="px-2 py-1 bg-green-500 text-white text-xs rounded-full">주문</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 공공 추천 맛집 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">🏆 공공 추천 맛집</h3>
          <button class="text-sm text-blue-500" onclick="navigateTo('delivery')">전체보기 →</button>
        </div>
        <div class="space-y-3">
          ${state.restaurants.slice(0, 3).map(r => `
            <div class="card cursor-pointer" onclick="showRestaurantDetail(${r.id})">
              <div class="flex gap-3 p-3">
                <img src="${r.image}" alt="${r.name}" class="w-20 h-20 rounded-lg object-cover">
                <div class="flex-1">
                  <h4 class="font-bold text-sm mb-1">${r.name}</h4>
                  <div class="flex items-center gap-1 text-xs text-gray-600 mb-2">
                    <i class="fas fa-star text-yellow-400"></i>
                    <span>${r.rating}</span>
                    <span>·</span>
                    <span>${r.deliveryTime}</span>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    ${r.badges.slice(0, 2).map(b => `<span class="badge badge-primary text-xs">${b}</span>`).join('')}
                  </div>
                </div>
                <div class="text-right text-xs">
                  <div class="font-bold text-blue-500">무료</div>
                  <div class="text-gray-500">배달비</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 중고·나눔 (안전거래) -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">♻️ 중고·나눔 (안전거래)</h3>
          <button class="text-sm text-purple-500" onclick="navigateTo('market')">전체보기 →</button>
        </div>
        <div class="bg-green-50 p-3 rounded-lg mb-3">
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-shield-alt text-green-600"></i>
            <span class="font-semibold text-green-800">경찰서·CCTV 인근 안전거래 존</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          ${state.usedItems.slice(0, 2).map(item => `
            <div class="card">
              <div class="relative">
                <img src="${item.image}" alt="${item.title}" class="w-full h-32 object-cover">
                ${item.safeZone ? '<div class="absolute top-2 left-2 safe-zone-marker"><i class="fas fa-shield-alt"></i> 안전</div>' : ''}
              </div>
              <div class="p-3">
                <h4 class="text-sm font-medium mb-1 line-clamp-1">${item.title}</h4>
                <div class="text-sm font-bold text-blue-600 mb-1">${item.price.toLocaleString()}원</div>
                <div class="text-xs text-gray-500">${item.location}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 사전등록 가맹점 (오픈 예정) -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">🎊 오픈 예정 가맹점</h3>
          <span class="text-xs text-gray-500">입점 준비중 200곳</span>
        </div>
        <div class="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-xl">
          <div class="flex items-start gap-3">
            <i class="fas fa-rocket text-3xl"></i>
            <div class="flex-1">
              <h4 class="font-bold mb-2">곧 만나요! 경산 맛집 200곳</h4>
              <p class="text-xs opacity-90 mb-3">사전등록 완료한 가맹점이 순차 오픈합니다</p>
              <button class="px-4 py-2 bg-white text-purple-600 font-bold rounded-lg text-sm">
                오픈 알림 신청
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 전통시장 바로가기
function showTraditionalMarket() {
  navigateTo('delivery');
  setTimeout(() => {
    const marketTab = document.querySelector('[data-tab="market"]');
    if (marketTab) marketTab.click();
  }, 100);
}

// 로컬푸드 바로가기
function showLocalFood() {
  navigateTo('delivery');
  setTimeout(() => {
    const localfoodTab = document.querySelector('[data-tab="localfood"]');
    if (localfoodTab) localfoodTab.click();
  }, 100);
}

// 전통시장 장바구니 추가
function addToMarketCart(productId) {
  const product = state.marketProducts.find(p => p.id == productId);
  if (!product) return;
  
  state.cart.push(product);
  alert(`${product.product}을(를) 장바구니에 담았습니다!\n\n여러 가게 상품을 담아 한 번에 주문하세요.`);
}

// ============================================
// 배달 페이지
// ============================================
function renderDeliveryPage() {
  return `
    <div class="bg-white sticky top-[57px] z-40 border-b">
      <div class="p-4">
        <div class="flex gap-2 overflow-x-auto pb-2" style="scrollbar-width: none; -webkit-overflow-scrolling: touch;">
          <button class="category-chip active" data-category="all">전체</button>
          ${state.categories.map(cat => `
            <button class="category-chip" data-category="${cat.id}">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
      
      <div class="flex border-t">
        <button class="tab-button active flex-1" data-tab="restaurant">음식점</button>
        <button class="tab-button flex-1" data-tab="market">전통시장</button>
        <button class="tab-button flex-1" data-tab="localfood">로컬푸드</button>
      </div>
    </div>

    <div id="deliveryContent" class="p-4 space-y-3">
      ${renderRestaurantList()}
    </div>
  `;
}

function renderRestaurantList(category = 'all') {
  const filtered = category === 'all' 
    ? state.restaurants 
    : state.restaurants.filter(r => r.category === category);

  if (filtered.length === 0) {
    return '<div class="text-center py-12 text-gray-500">해당 카테고리의 가맹점이 없습니다</div>';
  }

  return filtered.map(r => `
    <div class="card cursor-pointer" onclick="showRestaurantDetail(${r.id})">
      <div class="flex gap-3 p-3">
        <img src="${r.image}" alt="${r.name}" class="w-24 h-24 rounded-lg object-cover">
        <div class="flex-1">
          <h4 class="font-bold mb-1">${r.name}</h4>
          <div class="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <i class="fas fa-star text-yellow-400"></i>
            <span>${r.rating}</span>
            <span>(${r.reviews})</span>
            <span class="mx-1">·</span>
            <span>${r.deliveryTime}</span>
          </div>
          <div class="text-xs text-gray-600 mb-2 line-clamp-1">${r.description}</div>
          <div class="flex flex-wrap gap-1">
            ${r.badges.map(b => `<span class="badge badge-primary text-xs">${b}</span>`).join('')}
          </div>
        </div>
        <div class="text-right text-xs">
          <div class="font-bold text-blue-500">무료</div>
          <div class="text-gray-500">배달비</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMarketList() {
  return `
    <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 mb-4 rounded-xl">
      <div class="flex items-start gap-3">
        <i class="fas fa-shopping-basket text-3xl"></i>
        <div class="flex-1">
          <h4 class="font-bold text-lg mb-2">전통시장 통합 장보기</h4>
          <p class="text-sm opacity-90 mb-3">반찬집·정육점·과일가게를 한 번에 주문하고 묶음 배달받으세요!</p>
          <div class="flex gap-2">
            <div class="badge bg-white text-orange-600">수수료 0%</div>
            <div class="badge bg-white text-orange-600">묶음 배달</div>
            <div class="badge bg-white text-orange-600">시 보조</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 p-4 mb-4 rounded-lg">
      <h4 class="font-bold mb-2 flex items-center gap-2">
        <i class="fas fa-lightbulb text-blue-500"></i>
        이렇게 이용하세요
      </h4>
      <ol class="text-xs text-gray-700 space-y-1">
        <li>1. 여러 가게 상품을 장바구니에 담기</li>
        <li>2. 한 번에 결제 (30,000원 이상 배달비 무료)</li>
        <li>3. 시장에서 묶음 포장 후 배달</li>
      </ol>
    </div>
    
    <div class="mb-3">
      <h4 class="font-bold mb-2">중앙시장 인기 상품</h4>
    </div>
    <div class="space-y-3">
      ${state.marketProducts.map(p => `
        <div class="card cursor-pointer" onclick="addToMarketCart('${p.id}')">
          <div class="flex gap-3 p-3">
            <img src="${p.image}" alt="${p.product}" class="w-20 h-20 rounded-lg object-cover">
            <div class="flex-1">
              <div class="text-xs text-orange-600 font-semibold mb-1">${p.market} · ${p.shopName}</div>
              <h4 class="font-bold text-sm mb-2">${p.product}</h4>
              <div class="text-xs text-gray-500 mb-2">${p.category}</div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold">${p.price.toLocaleString()}원</span>
                <button class="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">장바구니 담기</button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    ${state.cart.length > 0 ? `
      <div class="fixed bottom-20 left-0 right-0 p-4">
        <div class="max-w-md mx-auto bg-orange-500 text-white rounded-xl p-4 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">장바구니</div>
              <div class="font-bold text-lg">${state.cart.length}개 상품</div>
            </div>
            <button class="px-4 py-2 bg-white text-orange-600 font-bold rounded-lg" onclick="alert('장바구니 기능 구현 예정')">
              주문하기
            </button>
          </div>
        </div>
      </div>
    ` : ''}
  `;
}

function renderLocalFoodList() {
  return `
    <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 mb-4 rounded-xl">
      <div class="flex items-start gap-3">
        <i class="fas fa-tractor text-3xl"></i>
        <div class="flex-1">
          <h4 class="font-bold text-lg mb-2">경산 로컬푸드 직거래</h4>
          <p class="text-sm opacity-90 mb-3">오늘 아침 수확한 신선한 농산물을 농가에서 직접 배송합니다</p>
          <div class="flex gap-2">
            <div class="badge bg-white text-green-600">당일수확</div>
            <div class="badge bg-white text-green-600">농가직배송</div>
            <div class="badge bg-white text-green-600">친환경</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-yellow-50 p-4 mb-4 rounded-lg">
      <h4 class="font-bold mb-2 flex items-center gap-2">
        <i class="fas fa-heart text-red-500"></i>
        로컬푸드 구매 혜택
      </h4>
      <ul class="text-xs text-gray-700 space-y-1">
        <li>• 지역화폐 결제 시 10% 추가 적립</li>
        <li>• 친환경 소비 포인트 적립</li>
        <li>• 로컬푸드 쿠폰 발급</li>
        <li>• CO₂ 절감 기여도 확인</li>
      </ul>
    </div>
    
    <div class="grid grid-cols-2 gap-3">
      ${state.localFoods.map(f => `
        <div class="card">
          <div class="relative">
            <img src="${f.image}" alt="${f.product}" class="w-full h-40 object-cover">
            <div class="absolute top-2 left-2 badge badge-success">${f.harvest}</div>
          </div>
          <div class="p-3">
            <div class="text-xs text-green-600 font-semibold mb-1">${f.farmName}</div>
            <h4 class="text-sm font-bold mb-1 line-clamp-1">${f.product}</h4>
            <div class="text-xs text-gray-500 mb-2">${f.region}</div>
            <div class="flex flex-wrap gap-1 mb-2">
              ${f.certification.map(c => `<span class="badge badge-info text-xs">${c}</span>`).join('')}
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold">${f.price.toLocaleString()}원</span>
              <button class="px-3 py-1 bg-green-500 text-white text-xs rounded-full">주문</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function attachDeliveryEventListeners() {
  // 카테고리 필터
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const category = e.currentTarget.dataset.category;
      const currentTab = document.querySelector('.tab-button.active').dataset.tab;
      
      const content = document.getElementById('deliveryContent');
      if (currentTab === 'restaurant') {
        content.innerHTML = renderRestaurantList(category);
      }
    });
  });

  // 탭 전환
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const tab = e.currentTarget.dataset.tab;
      const content = document.getElementById('deliveryContent');
      
      if (tab === 'restaurant') {
        content.innerHTML = renderRestaurantList();
      } else if (tab === 'market') {
        content.innerHTML = renderMarketList();
      } else if (tab === 'localfood') {
        content.innerHTML = renderLocalFoodList();
      }
    });
  });
}

// 음식점 상세 모달
function showRestaurantDetail(id) {
  const restaurant = state.restaurants.find(r => r.id === id);
  if (!restaurant) return;

  const modal = document.getElementById('restaurantModal');
  const content = document.getElementById('restaurantModalContent');

  content.innerHTML = `
    <div class="relative">
      <img src="${restaurant.image}" alt="${restaurant.name}" class="w-full h-48 object-cover">
      <button onclick="closeModal('restaurantModal')" class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="p-4">
      <h2 class="text-xl font-bold mb-2">${restaurant.name}</h2>
      
      <div class="flex items-center gap-2 mb-3">
        <div class="flex items-center gap-1 text-sm">
          <i class="fas fa-star text-yellow-400"></i>
          <span class="font-bold">${restaurant.rating}</span>
          <span class="text-gray-500">(${restaurant.reviews})</span>
        </div>
        <span class="text-gray-300">|</span>
        <span class="text-sm text-gray-600">${restaurant.deliveryTime}</span>
      </div>

      <div class="flex flex-wrap gap-1 mb-4">
        ${restaurant.badges.map(b => `<span class="badge badge-primary">${b}</span>`).join('')}
      </div>

      <p class="text-sm text-gray-600 mb-4">${restaurant.description}</p>

      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-700">배달비</span>
          <span class="text-sm font-bold text-blue-600">무료 (공공 지원)</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-700">최소 주문금액</span>
          <span class="text-sm font-bold">${restaurant.minOrder.toLocaleString()}원</span>
        </div>
      </div>

      <div class="space-y-2">
        <button class="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition">
          주문하기
        </button>
        <button class="w-full py-3 border border-gray-300 font-bold rounded-lg hover:bg-gray-50 transition">
          메뉴 보기
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// ============================================
// 중고·나눔 마켓 페이지
// ============================================
function renderMarketPage() {
  return `
    <div class="bg-white sticky top-[57px] z-40 border-b">
      <div class="flex">
        <button class="tab-button active flex-1" data-market-tab="used">중고거래</button>
        <button class="tab-button flex-1" data-market-tab="free">무료나눔</button>
        <button class="tab-button flex-1" data-market-tab="safezone">안전거래장소</button>
      </div>
    </div>

    <div id="marketContent" class="p-4">
      ${renderUsedItemsList()}
    </div>
  `;
}

function renderUsedItemsList() {
  return `
    <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 mb-4 rounded-xl">
      <div class="flex items-start gap-3">
        <i class="fas fa-shield-alt text-3xl"></i>
        <div class="flex-1">
          <h4 class="font-bold text-lg mb-2">안전거래 장소에서 거래하세요!</h4>
          <p class="text-sm opacity-90 mb-3">경찰서, CCTV 밀집지역에서 안전하게 거래할 수 있습니다</p>
          <button onclick="showSafeZoneMap()" class="px-4 py-2 bg-white text-green-600 font-bold rounded-lg text-sm">
            <i class="fas fa-map-marker-alt mr-1"></i> 안전거래 장소 보기
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      ${state.usedItems.map(item => `
        <div class="card">
          <div class="relative">
            <img src="${item.image}" alt="${item.title}" class="w-full h-40 object-cover">
            ${item.safeZone ? '<div class="absolute top-2 left-2 safe-zone-marker"><i class="fas fa-shield-alt"></i> 안전</div>' : ''}
          </div>
          <div class="p-3">
            <h4 class="text-sm font-medium mb-1 line-clamp-2">${item.title}</h4>
            <div class="text-sm font-bold text-blue-600 mb-1">${item.price.toLocaleString()}원</div>
            <div class="text-xs text-gray-500 mb-1">${item.location}</div>
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>${item.time}</span>
              ${item.safeZone ? '<i class="fas fa-check-circle text-green-500"></i>' : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFreeItemsList() {
  return `
    <div class="bg-purple-50 p-4 mb-4 rounded-lg">
      <div class="flex items-start gap-3">
        <i class="fas fa-gift text-purple-500 text-2xl"></i>
        <div class="flex-1">
          <h4 class="font-bold mb-1">무료 나눔으로 이웃과 함께해요</h4>
          <p class="text-xs text-gray-600">사용하지 않는 물건을 이웃에게 나눠주세요</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      ${state.freeItems.map(item => `
        <div class="card">
          <img src="${item.image}" alt="${item.title}" class="w-full h-40 object-cover">
          <div class="p-3">
            <div class="badge badge-success mb-2">무료나눔</div>
            <h4 class="text-sm font-medium mb-1 line-clamp-2">${item.title}</h4>
            <div class="text-xs text-gray-500 mb-1">${item.location}</div>
            <div class="text-xs text-gray-400">${item.time}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSafeZoneList() {
  return `
    <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 mb-4 rounded-xl">
      <div class="flex items-start gap-4">
        <i class="fas fa-map-marked-alt text-3xl"></i>
        <div>
          <h3 class="text-xl font-bold mb-2">안전거래 장소 ${state.safeZones.length}곳</h3>
          <p class="text-sm opacity-90 mb-3">CCTV와 경찰서 인근에서 안심하고 거래하세요</p>
          <button onclick="showSafeZoneMap()" class="px-4 py-2 bg-white text-blue-600 font-bold rounded-lg text-sm">
            <i class="fas fa-map-marker-alt mr-1"></i> 지도에서 보기
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      ${state.safeZones.map(zone => `
        <div class="card p-4">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              ${zone.type === 'police' ? '<i class="fas fa-shield-alt text-blue-500 text-xl"></i>' : 
                zone.type === 'city_hall' ? '<i class="fas fa-building text-blue-500 text-xl"></i>' : 
                '<i class="fas fa-home text-blue-500 text-xl"></i>'}
            </div>
            <div class="flex-1">
              <h4 class="font-bold mb-1">${zone.name}</h4>
              <p class="text-xs text-gray-600 mb-2">${zone.address}</p>
              <div class="flex flex-wrap gap-1 mb-2">
                ${zone.facilities.map(f => `<span class="badge badge-info text-xs">${f}</span>`).join('')}
              </div>
              <div class="text-xs text-gray-500">
                <i class="far fa-clock mr-1"></i> ${zone.hours}
              </div>
            </div>
            <button onclick="showSafeZoneOnMap(${zone.id})" class="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
              지도
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="mt-6 bg-yellow-50 p-4 rounded-lg">
      <h4 class="font-bold mb-2 flex items-center gap-2">
        <i class="fas fa-lightbulb text-yellow-500"></i>
        안전거래 팁
      </h4>
      <ul class="text-xs text-gray-700 space-y-1">
        <li>• 낮 시간대에 거래하는 것이 안전합니다</li>
        <li>• 고액 거래는 반드시 안전장소에서 진행하세요</li>
        <li>• 거래 전 상품 상태를 꼼꼼히 확인하세요</li>
        <li>• 의심스러운 거래는 신고해주세요</li>
      </ul>
    </div>

    <div class="mt-4 bg-blue-50 p-4 rounded-lg">
      <p class="text-xs text-gray-600">
        <i class="fas fa-info-circle text-blue-500 mr-1"></i>
        본 서비스는 공공시설 인근을 안전거래 장소로 안내합니다. 실시간 CCTV 열람 기능은 제공하지 않습니다.
      </p>
    </div>
  `;
}

function attachMarketEventListeners() {
  document.querySelectorAll('[data-market-tab]').forEach(button => {
    button.addEventListener('click', (e) => {
      document.querySelectorAll('[data-market-tab]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const tab = e.currentTarget.dataset.marketTab;
      const content = document.getElementById('marketContent');
      
      if (tab === 'used') {
        content.innerHTML = renderUsedItemsList();
      } else if (tab === 'free') {
        content.innerHTML = renderFreeItemsList();
      } else if (tab === 'safezone') {
        content.innerHTML = renderSafeZoneList();
      }
    });
  });
}

// 안전거래 지도 모달
function showSafeZoneMap() {
  const modal = document.getElementById('safeZoneModal');
  const content = document.getElementById('safeZoneModalContent');

  content.innerHTML = `
    <div class="p-4 border-b flex items-center justify-between">
      <h3 class="text-lg font-bold">안전거래 장소</h3>
      <button onclick="closeModal('safeZoneModal')" class="w-8 h-8 flex items-center justify-center">
        <i class="fas fa-times text-gray-500"></i>
      </button>
    </div>

    <div class="relative bg-gray-100" style="height: 400px;">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <i class="fas fa-map-marked-alt text-gray-400 text-5xl mb-3"></i>
          <p class="text-gray-600 font-medium">지도 API 연동 예정</p>
          <p class="text-xs text-gray-500 mt-1">실제 서비스에서는 카카오맵/네이버맵 연동</p>
        </div>
      </div>
      
      <!-- 마커 시뮬레이션 -->
      ${state.safeZones.map((zone, idx) => `
        <div 
          class="absolute w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
          style="top: ${20 + idx * 60}px; left: ${50 + (idx % 3) * 120}px;"
          title="${zone.name}"
        >
          ${idx + 1}
        </div>
      `).join('')}
    </div>

    <div class="p-4 space-y-2 max-h-64 overflow-y-auto">
      ${state.safeZones.map((zone, idx) => `
        <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
            ${idx + 1}
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-sm mb-1">${zone.name}</h4>
            <p class="text-xs text-gray-600">${zone.address}</p>
            <div class="flex gap-1 mt-1">
              ${zone.facilities.map(f => `<span class="badge badge-info text-xs">${f}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  modal.classList.add('active');
}

function showSafeZoneOnMap(zoneId) {
  showSafeZoneMap();
}

// ============================================
// 쿠폰 페이지
// ============================================
function renderCouponPage() {
  return `
    <div class="p-4 space-y-4">
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl">
        <h2 class="text-xl font-bold mb-2">💰 경산 지역화폐</h2>
        <p class="text-sm opacity-90 mb-4">지역 경제 활성화를 위한 공공 화폐</p>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">사용 가능 금액</div>
            <div class="text-3xl font-bold">50,000원</div>
          </div>
          <button class="px-4 py-2 bg-white text-purple-600 font-bold rounded-lg">
            충전하기
          </button>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">🎟️ 사용 가능한 쿠폰</h3>
        <div class="space-y-3">
          ${state.coupons.map(coupon => `
            <div class="card p-4">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-ticket-alt text-blue-500 text-xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold mb-1">${coupon.title}</h4>
                  <div class="text-sm text-gray-600 mb-2">
                    ${typeof coupon.discount === 'number' ? 
                      `${coupon.discount.toLocaleString()}원 할인` : 
                      coupon.discount}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <span>최소 ${coupon.minOrder.toLocaleString()}원</span>
                    <span>•</span>
                    <span>${coupon.validUntil}까지</span>
                  </div>
                </div>
                <button class="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg">
                  다운로드
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">📊 이용 혜택</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-blue-600 mb-1">0%</div>
            <div class="text-xs text-gray-600">중개 수수료</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-green-600 mb-1">무료</div>
            <div class="text-xs text-gray-600">배달비 (조건부)</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-purple-600 mb-1">10%</div>
            <div class="text-xs text-gray-600">지역화폐 추가적립</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-orange-600 mb-1">무제한</div>
            <div class="text-xs text-gray-600">쿠폰 발급</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// 마이 페이지
// ============================================
function renderMyPage() {
  return `
    <div class="p-4 space-y-4">
      <div class="card p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-blue-500 text-2xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg">김경산</h3>
            <p class="text-sm text-gray-600">경산시 중방동</p>
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-3 pt-4 border-t">
          <div class="text-center">
            <div class="text-xl font-bold text-blue-600">12</div>
            <div class="text-xs text-gray-600">주문</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-green-600">5</div>
            <div class="text-xs text-gray-600">거래</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-purple-600">3</div>
            <div class="text-xs text-gray-600">나눔</div>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div class="card p-4 flex items-center justify-between cursor-pointer">
          <div class="flex items-center gap-3">
            <i class="fas fa-receipt text-gray-400"></i>
            <span class="font-medium">주문 내역</span>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </div>

        <div class="card p-4 flex items-center justify-between cursor-pointer">
          <div class="flex items-center gap-3">
            <i class="fas fa-heart text-gray-400"></i>
            <span class="font-medium">찜한 가게</span>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </div>

        <div class="card p-4 flex items-center justify-between cursor-pointer">
          <div class="flex items-center gap-3">
            <i class="fas fa-star text-gray-400"></i>
            <span class="font-medium">리뷰 관리</span>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </div>

        <div class="card p-4 flex items-center justify-between cursor-pointer">
          <div class="flex items-center gap-3">
            <i class="fas fa-bell text-gray-400"></i>
            <span class="font-medium">알림 설정</span>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">📈 나의 기여</h3>
        <div class="card p-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b">
              <span class="text-sm text-gray-600">지역 소상공인 지원</span>
              <span class="font-bold text-blue-600">142,000원</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span class="text-sm text-gray-600">배달비 절감</span>
              <span class="font-bold text-green-600">18,000원</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-gray-600">재사용을 통한 환경 기여</span>
              <span class="font-bold text-purple-600">CO₂ 2.5kg</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-4 bg-blue-50">
        <h4 class="font-bold mb-2">ℹ️ 플랫폼 정보</h4>
        <p class="text-xs text-gray-600 mb-2">경북 공공상생 플랫폼 v1.0.0 (시범운영)</p>
        <p class="text-xs text-gray-600 mb-2">경산시 · 포항시 · 구미시 · 안동시</p>
        <p class="text-xs text-gray-500 mt-2">
          "배달 중심의 공공 플랫폼을 통해 소상공인·전통시장·로컬푸드의 실질적 매출을 지원하고, 
          중고·나눔 기능을 통해 시민 안전과 복지를 보완하는 경북형 생활 밀착 공공 디지털 인프라"
        </p>
      </div>
    </div>
  `;
}

// ============================================
// 유틸리티 함수
// ============================================
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// 전역 함수로 노출
window.navigateTo = navigateTo;
window.showRestaurantDetail = showRestaurantDetail;
window.showLocalFood = showLocalFood;
window.showTraditionalMarket = showTraditionalMarket;
window.addToMarketCart = addToMarketCart;
window.showSafeZoneMap = showSafeZoneMap;
window.showSafeZoneOnMap = showSafeZoneOnMap;
window.closeModal = closeModal;