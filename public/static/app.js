// 경북 공공상생 플랫폼 - 완전한 프론트엔드 애플리케이션
// 핵심 기능: 배달(80%) + 중고나눔(20%) + 사전등록 가맹점 + 안전거래

const state = {
  currentPage: 'home',
  currentCity: 'gyeongsan',
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

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderPage();
  attachEventListeners();
});

async function loadData() {
  try {
    const [restaurants, marketProducts, localFoods, usedItems, freeItems, safeZones, coupons, statistics, categories] = await Promise.all([
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
    Object.assign(state, { restaurants, marketProducts, localFoods, usedItems, freeItems, safeZones, coupons, statistics, categories });
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
  }
}

function attachEventListeners() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => navigateTo(e.currentTarget.dataset.page));
  });
  document.getElementById('citySelector').addEventListener('change', (e) => {
    state.currentCity = e.target.value;
    renderPage();
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });
}

function navigateTo(page) {
  state.currentPage = page;
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  renderPage();
}

function renderPage() {
  const app = document.getElementById('app');
  const renderers = {
    home: renderHomePage,
    delivery: renderDeliveryPage,
    market: renderMarketPage,
    coupon: renderCouponPage,
    my: renderMyPage
  };
  app.innerHTML = renderers[state.currentPage]();
  if (state.currentPage === 'delivery') attachDeliveryEventListeners();
  if (state.currentPage === 'market') attachMarketEventListeners();
}

function renderHomePage() {
  const s = state.statistics;
  const cityName = {'gyeongsan': '경산시', 'poh ang': '포항시', 'gumi': '구미시', 'andong': '안동시'}[state.currentCity] || '경산시';
  
  return `
    <div class="p-4 space-y-6">
      <div class="stat-card">
        <h2 class="text-xl font-bold mb-2">🎉 ${cityName} 시범 운영 중</h2>
        <p class="text-sm opacity-90 mb-3">수수료 0% · 광고비 0% · 배달비 지원</p>
        <div class="grid grid-cols-3 gap-2">
          <div><div class="text-2xl font-bold">${(s.savingsForMerchants / 100000000).toFixed(1)}억</div><div class="text-xs opacity-80">소상공인 절감</div></div>
          <div><div class="text-2xl font-bold">${s.merchantCount}곳</div><div class="text-xs opacity-80">입점 가맹점</div></div>
          <div><div class="text-2xl font-bold">${(s.activeUsers / 1000).toFixed(1)}K</div><div class="text-xs opacity-80">이용 시민</div></div>
        </div>
      </div>

      <div class="bg-blue-50 rounded-xl p-4">
        <h3 class="font-bold mb-3 text-sm flex items-center gap-2"><i class="fas fa-check-circle text-blue-500"></i> 공공 플랫폼 차별점</h3>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="flex items-center gap-2"><i class="fas fa-percent text-blue-500"></i><span>수수료 0%</span></div>
          <div class="flex items-center gap-2"><i class="fas fa-ban text-blue-500"></i><span>광고비 0원</span></div>
          <div class="flex items-center gap-2"><i class="fas fa-truck text-blue-500"></i><span>배달비 무료/최소화</span></div>
          <div class="flex items-center gap-2"><i class="fas fa-coins text-blue-500"></i><span>지역화폐 혜택</span></div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4">
        <div class="grid grid-cols-4 gap-3">
          ${[
            {icon: 'store', color: 'orange', label: '전통시장', sub: '통합장보기', action: 'showTraditionalMarket()'},
            {icon: 'leaf', color: 'green', label: '로컬푸드', sub: '당일수확', action: 'showLocalFood()'},
            {icon: 'motorcycle', color: 'blue', label: '음식배달', sub: '무료배달', action: "navigateTo('delivery')"},
            {icon: 'recycle', color: 'purple', label: '중고나눔', sub: '안전거래', action: "navigateTo('market')"}
          ].map(item => `
            <div class="text-center cursor-pointer" onclick="${item.action}">
              <div class="w-14 h-14 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-${item.icon} text-${item.color}-500 text-xl"></i>
              </div>
              <div class="text-xs font-medium">${item.label}</div>
              <div class="text-xs text-${item.color}-500 font-bold">${item.sub}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">🏪 전통시장 통합 장보기</h3>
          <button class="text-sm text-orange-500 font-semibold" onclick="showTraditionalMarket()">전체보기 →</button>
        </div>
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl mb-3">
          <div class="flex items-start gap-3">
            <i class="fas fa-shopping-basket text-2xl"></i>
            <div><h4 class="font-bold mb-1">여러 가게를 한 번에!</h4><p class="text-xs opacity-90">반찬집 + 정육점 + 과일가게 = 1회 주문</p></div>
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

      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">🌱 오늘의 로컬푸드</h3>
          <button class="text-sm text-green-500 font-semibold" onclick="showLocalFood()">전체보기 →</button>
        </div>
        <div class="bg-green-50 p-3 rounded-lg mb-3">
          <div class="flex items-center gap-2 text-sm"><i class="fas fa-tractor text-green-600"></i><span class="font-semibold text-green-800">오늘 아침 수확 · 농가 직배송</span></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          ${state.localFoods.slice(0, 4).map(f => `
            <div class="card">
              <div class="relative">
                <img src="${f.image}" alt="${f.product}" class="w-full h-32 object-cover">
                <div class="absolute top-2 left-2 badge badge-success text-xs">${f.harvest}</div>
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
                    <i class="fas fa-star text-yellow-400"></i><span>${r.rating}</span><span>·</span><span>${r.deliveryTime}</span>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    ${r.badges.slice(0, 2).map(b => `<span class="badge badge-primary text-xs">${b}</span>`).join('')}
                  </div>
                </div>
                <div class="text-right text-xs"><div class="font-bold text-blue-500">무료</div><div class="text-gray-500">배달비</div></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">♻️ 중고·나눔 (안전거래)</h3>
          <button class="text-sm text-purple-500" onclick="navigateTo('market')">전체보기 →</button>
        </div>
        <div class="bg-green-50 p-3 rounded-lg mb-3">
          <div class="flex items-center gap-2 text-sm"><i class="fas fa-shield-alt text-green-600"></i><span class="font-semibold text-green-800">경찰서·CCTV 인근 안전거래 존</span></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          ${state.usedItems.slice(0, 2).map(item => `
            <div class="card">
              <div class="relative">
                <img src="${item.image}" alt="${item.title}" class="w-full h-32 object-cover">
                ${item.safeZone ? '<div class="absolute top-2 left-2 safe-zone-marker text-xs"><i class="fas fa-shield-alt"></i> 안전</div>' : ''}
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

      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">🎊 오픈 예정 가맹점</h3>
          <span class="text-xs text-gray-500">입점 준비중 200곳</span>
        </div>
        <div class="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-xl">
          <div class="flex items-start gap-3">
            <i class="fas fa-rocket text-3xl"></i>
            <div class="flex-1">
              <h4 class="font-bold mb-2">곧 만나요! ${cityName} 맛집 200곳</h4>
              <p class="text-xs opacity-90 mb-3">사전등록 완료한 가맹점이 순차 오픈합니다</p>
              <div class="flex gap-2">
                <button onclick="showPreviewStores()" class="px-4 py-2 bg-white text-purple-600 font-bold rounded-lg text-sm">오픈 알림 신청</button>
                <button onclick="showPreviewStores()" class="px-4 py-2 bg-purple-600 border-2 border-white text-white font-bold rounded-lg text-sm">목록 보기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDeliveryPage() {
  return `
    <div class="bg-white sticky top-[57px] z-40 border-b">
      <div class="p-4">
        <div class="flex gap-2 overflow-x-auto pb-2" style="scrollbar-width: none;">
          <button class="category-chip active" data-category="all">전체</button>
          ${state.categories.map(cat => `<button class="category-chip" data-category="${cat.id}"><span>${cat.icon}</span><span>${cat.name}</span></button>`).join('')}
        </div>
      </div>
      <div class="flex border-t">
        <button class="tab-button active flex-1" data-tab="restaurant">음식점</button>
        <button class="tab-button flex-1" data-tab="market">전통시장</button>
        <button class="tab-button flex-1" data-tab="localfood">로컬푸드</button>
      </div>
    </div>
    <div id="deliveryContent" class="p-4 space-y-3">${renderRestaurantList()}</div>
  `;
}

function renderRestaurantList(category = 'all') {
  const filtered = category === 'all' ? state.restaurants : state.restaurants.filter(r => r.category === category);
  return filtered.map(r => `
    <div class="card cursor-pointer" onclick="showRestaurantDetail(${r.id})">
      <div class="flex gap-3 p-3">
        <img src="${r.image}" alt="${r.name}" class="w-24 h-24 rounded-lg object-cover">
        <div class="flex-1">
          <h4 class="font-bold mb-1">${r.name}</h4>
          <div class="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <i class="fas fa-star text-yellow-400"></i><span>${r.rating}</span><span>·</span><span>${r.deliveryTime}</span>
          </div>
          <div class="text-xs text-gray-600 mb-2">${r.description}</div>
          <div class="flex flex-wrap gap-1">${r.badges.map(b => `<span class="badge badge-primary text-xs">${b}</span>`).join('')}</div>
        </div>
        <div class="text-right text-xs"><div class="font-bold text-blue-500">무료</div><div class="text-gray-500">배달비</div></div>
      </div>
    </div>
  `).join('');
}

function renderMarketList() {
  return `
    <div class="bg-blue-50 p-4 mb-4 rounded-lg">
      <div class="flex items-start gap-3">
        <i class="fas fa-store text-blue-500 text-2xl"></i>
        <div><h4 class="font-bold mb-1">전통시장 통합 장보기</h4><p class="text-xs text-gray-600">여러 가게 상품을 한 번에 주문하고 묶음 배달받으세요!</p></div>
      </div>
    </div>
    <div class="space-y-3">
      ${state.marketProducts.map(p => `
        <div class="card">
          <div class="flex gap-3 p-3">
            <img src="${p.image}" alt="${p.product}" class="w-20 h-20 rounded-lg object-cover">
            <div class="flex-1">
              <div class="text-xs text-blue-600 font-semibold mb-1">${p.market} · ${p.shopName}</div>
              <h4 class="font-bold text-sm mb-2">${p.product}</h4>
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold">${p.price.toLocaleString()}원</span>
                <button class="px-3 py-1 bg-blue-500 text-white text-xs rounded-full" onclick="addToMarketCart('${p.id}')">담기</button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderLocalFoodList() {
  return `
    <div class="bg-green-50 p-4 mb-4 rounded-lg">
      <div class="flex items-start gap-3">
        <i class="fas fa-leaf text-green-500 text-2xl"></i>
        <div><h4 class="font-bold mb-1">경산 로컬푸드 직거래</h4><p class="text-xs text-gray-600">오늘 수확한 신선한 농산물을 농가에서 직접 배송합니다</p></div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      ${state.localFoods.map(f => `
        <div class="card">
          <img src="${f.image}" alt="${f.product}" class="w-full h-40 object-cover">
          <div class="p-3">
            <div class="flex items-center gap-1 mb-2"><span class="badge badge-success text-xs">${f.harvest}</span></div>
            <div class="text-xs text-green-600 font-semibold mb-1">${f.farmName}</div>
            <h4 class="text-sm font-bold mb-1">${f.product}</h4>
            <div class="text-xs text-gray-500 mb-2">${f.region}</div>
            <div class="flex flex-wrap gap-1 mb-2">${f.certification.map(c => `<span class="badge badge-info text-xs">${c}</span>`).join('')}</div>
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
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const category = e.currentTarget.dataset.category;
      document.getElementById('deliveryContent').innerHTML = renderRestaurantList(category);
    });
  });

  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const tab = e.currentTarget.dataset.tab;
      const content = document.getElementById('deliveryContent');
      if (tab === 'restaurant') content.innerHTML = renderRestaurantList();
      else if (tab === 'market') content.innerHTML = renderMarketList();
      else if (tab === 'localfood') content.innerHTML = renderLocalFoodList();
    });
  });
}

function renderMarketPage() {
  return `
    <div class="bg-white sticky top-[57px] z-40 border-b">
      <div class="flex">
        <button class="tab-button active flex-1" data-market-tab="used">중고거래</button>
        <button class="tab-button flex-1" data-market-tab="free">무료나눔</button>
        <button class="tab-button flex-1" data-market-tab="safezone">안전거래장소</button>
      </div>
    </div>
    <div id="marketContent" class="p-4">${renderUsedItemsList()}</div>
  `;
}

function renderUsedItemsList() {
  return `
    <div class="bg-green-50 p-4 mb-4 rounded-lg">
      <div class="flex items-start gap-3">
        <i class="fas fa-shield-alt text-green-500 text-2xl"></i>
        <div>
          <h4 class="font-bold mb-1">안전거래 장소에서 거래하세요!</h4>
          <p class="text-xs text-gray-600 mb-2">경찰서, CCTV 밀집지역에서 안전하게 거래할 수 있습니다</p>
          <button onclick="showSafeZoneMap()" class="text-xs text-green-600 font-semibold">안전거래 장소 보기 →</button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      ${state.usedItems.map(item => `
        <div class="card">
          <div class="relative">
            <img src="${item.image}" alt="${item.title}" class="w-full h-40 object-cover">
            ${item.safeZone ? '<div class="absolute top-2 left-2 safe-zone-marker text-xs"><i class="fas fa-shield-alt"></i> 안전</div>' : ''}
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
        <div><h4 class="font-bold mb-1">무료 나눔으로 이웃과 함께해요</h4><p class="text-xs text-gray-600">사용하지 않는 물건을 이웃에게 나눠주세요</p></div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      ${state.freeItems.map(item => `
        <div class="card">
          <img src="${item.image}" alt="${item.title}" class="w-full h-40 object-cover">
          <div class="p-3">
            <div class="badge badge-success mb-2 text-xs">무료나눔</div>
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
    <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 mb-4 rounded-lg">
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
              <div class="flex flex-wrap gap-1 mb-2">${zone.facilities.map(f => `<span class="badge badge-info text-xs">${f}</span>`).join('')}</div>
              <div class="text-xs text-gray-500"><i class="far fa-clock mr-1"></i> ${zone.hours}</div>
            </div>
            <button onclick="showSafeZoneOnMap(${zone.id})" class="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">지도</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="mt-6 bg-yellow-50 p-4 rounded-lg">
      <h4 class="font-bold mb-2 flex items-center gap-2"><i class="fas fa-lightbulb text-yellow-500"></i> 안전거래 팁</h4>
      <ul class="text-xs text-gray-700 space-y-1">
        <li>• 낮 시간대에 거래하는 것이 안전합니다</li>
        <li>• 고액 거래는 반드시 안전장소에서 진행하세요</li>
        <li>• 거래 전 상품 상태를 꼼꼼히 확인하세요</li>
        <li>• 의심스러운 거래는 신고해주세요</li>
      </ul>
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
      if (tab === 'used') content.innerHTML = renderUsedItemsList();
      else if (tab === 'free') content.innerHTML = renderFreeItemsList();
      else if (tab === 'safezone') content.innerHTML = renderSafeZoneList();
    });
  });
}

function renderCouponPage() {
  return `
    <div class="p-4 space-y-4">
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl">
        <h2 class="text-xl font-bold mb-2">💰 경산 지역화폐</h2>
        <p class="text-sm opacity-90 mb-4">지역 경제 활성화를 위한 공공 화폐</p>
        <div class="flex items-center justify-between">
          <div><div class="text-sm opacity-80">사용 가능 금액</div><div class="text-3xl font-bold">50,000원</div></div>
          <button class="px-4 py-2 bg-white text-purple-600 font-bold rounded-lg">충전하기</button>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-3">🎟️ 사용 가능한 쿠폰</h3>
        <div class="space-y-3">
          ${state.coupons.map(c => `
            <div class="card p-4">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-ticket-alt text-blue-500 text-xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold mb-1">${c.title}</h4>
                  <div class="text-sm text-gray-600 mb-2">${typeof c.discount === 'number' ? c.discount.toLocaleString() + '원 할인' : c.discount}</div>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <span>최소 ${c.minOrder.toLocaleString()}원</span><span>•</span><span>${c.validUntil}까지</span>
                  </div>
                </div>
                <button class="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg">다운로드</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-3">📊 이용 혜택</h3>
        <div class="grid grid-cols-2 gap-3">
          ${[
            {value: '0%', label: '중개 수수료', color: 'blue'},
            {value: '무료', label: '배달비 (조건부)', color: 'green'},
            {value: '10%', label: '지역화폐 추가적립', color: 'purple'},
            {value: '무제한', label: '쿠폰 발급', color: 'orange'}
          ].map(item => `
            <div class="card p-4 text-center">
              <div class="text-2xl font-bold text-${item.color}-600 mb-1">${item.value}</div>
              <div class="text-xs text-gray-600">${item.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderMyPage() {
  return `
    <div class="p-4 space-y-4">
      <div class="card p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-blue-500 text-2xl"></i>
          </div>
          <div><h3 class="font-bold text-lg">김경산</h3><p class="text-sm text-gray-600">경산시 중방동</p></div>
        </div>
        <div class="grid grid-cols-3 gap-3 pt-4 border-t">
          ${[{num: 12, label: '주문', color: 'blue'}, {num: 5, label: '거래', color: 'green'}, {num: 3, label: '나눔', color: 'purple'}].map(item => `
            <div class="text-center"><div class="text-xl font-bold text-${item.color}-600">${item.num}</div><div class="text-xs text-gray-600">${item.label}</div></div>
          `).join('')}
        </div>
      </div>
      <div class="space-y-2">
        ${[
          {icon: 'receipt', label: '주문 내역'},
          {icon: 'heart', label: '찜한 가게'},
          {icon: 'star', label: '리뷰 관리'},
          {icon: 'bell', label: '알림 설정'}
        ].map(item => `
          <div class="card p-4 flex items-center justify-between cursor-pointer">
            <div class="flex items-center gap-3"><i class="fas fa-${item.icon} text-gray-400"></i><span class="font-medium">${item.label}</span></div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </div>
        `).join('')}
      </div>
      <div>
        <h3 class="text-lg font-bold mb-3">📈 나의 기여</h3>
        <div class="card p-4">
          <div class="space-y-3">
            ${[
              {label: '지역 소상공인 지원', value: '142,000원', color: 'blue'},
              {label: '배달비 절감', value: '18,000원', color: 'green'},
              {label: '재사용을 통한 환경 기여', value: 'CO₂ 2.5kg', color: 'purple'}
            ].map((item, idx) => `
              <div class="flex items-center justify-between py-2 ${idx < 2 ? 'border-b' : ''}">
                <span class="text-sm text-gray-600">${item.label}</span>
                <span class="font-bold text-${item.color}-600">${item.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="card p-4 bg-blue-50">
        <h4 class="font-bold mb-2">ℹ️ 플랫폼 정보</h4>
        <p class="text-xs text-gray-600 mb-2">경북 공공상생 플랫폼 v1.0.0 (시범운영)</p>
        <p class="text-xs text-gray-600">경산시 · 포항시 · 구미시 · 안동시</p>
      </div>
    </div>
  `;
}

// 모달 및 헬퍼 함수
function showRestaurantDetail(id) {
  const r = state.restaurants.find(rest => rest.id === id);
  if (!r) return;
  const modal = document.getElementById('restaurantModal');
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="relative">
      <img src="${r.image}" alt="${r.name}" class="w-full h-48 object-cover">
      <button onclick="closeModal('restaurantModal')" class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-2">${r.name}</h2>
      <div class="flex items-center gap-2 mb-3">
        <div class="flex items-center gap-1 text-sm">
          <i class="fas fa-star text-yellow-400"></i><span class="font-bold">${r.rating}</span><span class="text-gray-500">(${r.reviews})</span>
        </div>
        <span class="text-gray-300">|</span>
        <span class="text-sm text-gray-600">${r.deliveryTime}</span>
      </div>
      <div class="flex flex-wrap gap-1 mb-4">${r.badges.map(b => `<span class="badge badge-primary">${b}</span>`).join('')}</div>
      <p class="text-sm text-gray-600 mb-4">${r.description}</p>
      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-700">배달비</span>
          <span class="text-sm font-bold text-blue-600">무료 (공공 지원)</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-700">최소 주문금액</span>
          <span class="text-sm font-bold">${r.minOrder.toLocaleString()}원</span>
        </div>
      </div>
      <div class="space-y-2">
        <button onclick="orderFromRestaurant('${r.id}')" class="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">주문하기</button>
        <button onclick="viewMenu('${r.id}')" class="w-full py-3 border border-gray-300 font-bold rounded-lg hover:bg-gray-50">메뉴 보기</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

function showSafeZoneMap() {
  const modal = document.getElementById('safeZoneModal');
  document.getElementById('safeZoneModalContent').innerHTML = `
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
      ${state.safeZones.map((zone, idx) => `
        <div class="absolute w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform" 
             style="top: ${20 + idx * 60}px; left: ${50 + (idx % 3) * 120}px;" title="${zone.name}">
          ${idx + 1}
        </div>
      `).join('')}
    </div>
    <div class="p-4 space-y-2 max-h-64 overflow-y-auto">
      ${state.safeZones.map((zone, idx) => `
        <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">${idx + 1}</div>
          <div class="flex-1">
            <h4 class="font-bold text-sm mb-1">${zone.name}</h4>
            <p class="text-xs text-gray-600">${zone.address}</p>
            <div class="flex gap-1 mt-1">${zone.facilities.map(f => `<span class="badge badge-info text-xs">${f}</span>`).join('')}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  modal.classList.add('active');
}

function showPreviewStores() {
  alert('🎊 오픈 예정 가맹점 200곳\n\n현재 사전등록 동의를 받아 순차적으로 오픈 준비 중입니다.\n알림 신청하시면 오픈 시 즉시 알려드립니다!');
}

function showTraditionalMarket() {
  navigateTo('delivery');
  setTimeout(() => {
    const tab = document.querySelector('[data-tab="market"]');
    if (tab) tab.click();
  }, 100);
}

function showLocalFood() {
  navigateTo('delivery');
  setTimeout(() => {
    const tab = document.querySelector('[data-tab="localfood"]');
    if (tab) tab.click();
  }, 100);
}

function addToMarketCart(productId) {
  const product = state.marketProducts.find(p => p.id == productId);
  if (!product) return;
  state.cart.push(product);
  alert(`${product.product}을(를) 장바구니에 담았습니다!\n\n여러 가게 상품을 담아 한 번에 주문하세요.`);
}

function showSafeZoneOnMap(zoneId) {
  showSafeZoneMap();
}

function orderFromRestaurant(restaurantId) {
  const restaurant = state.restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return;
  
  alert(`${restaurant.name} 주문을 시작합니다.\n\n메뉴를 선택하고 주문해주세요.`);
  viewMenu(restaurantId);
}

function viewMenu(restaurantId) {
  const restaurant = state.restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return;
  
  // 메뉴 페이지로 이동
  window.location.href = `/menu?restaurant=${restaurantId}`;
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// 전역 함수로 노출
window.navigateTo = navigateTo;
window.showRestaurantDetail = showRestaurantDetail;
window.showTraditionalMarket = showTraditionalMarket;
window.showLocalFood = showLocalFood;
window.showSafeZoneMap = showSafeZoneMap;
window.showSafeZoneOnMap = showSafeZoneOnMap;
window.showPreviewStores = showPreviewStores;
window.addToMarketCart = addToMarketCart;
window.closeModal = closeModal;

// ============================================
// 가맹점 등록 시스템
// ============================================

// 가맹점 등록 플로우 시작
function startMerchantRegistration() {
  const modal = document.getElementById('restaurantModal');
  document.getElementById('restaurantModalContent').innerHTML = renderMerchantRegistrationStart();
  modal.classList.add('active');
}

function renderMerchantRegistrationStart() {
  return `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4 text-center">🎉 무료배달 가맹점 신청</h2>
      
      <div class="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl mb-6">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <i class="fas fa-check-circle text-2xl"></i>
            <div>
              <div class="font-bold">수수료 0원</div>
              <div class="text-xs opacity-90">중개 수수료 없음</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <i class="fas fa-ban text-2xl"></i>
            <div>
              <div class="font-bold">광고비 없음</div>
              <div class="text-xs opacity-90">공공 플랫폼 무료 홍보</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <i class="fas fa-truck text-2xl"></i>
            <div>
              <div class="font-bold">배달비 무료/최소화</div>
              <div class="text-xs opacity-90">시 보조금 지원</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg mb-6">
        <h3 class="font-bold mb-2 flex items-center gap-2">
          <i class="fas fa-lightbulb text-yellow-500"></i>
          초간편 등록 (3분 완료)
        </h3>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>✅ 사업자등록증 사진 1장만 필요</li>
          <li>✅ 메뉴·계좌는 나중에 등록</li>
          <li>✅ 등록 즉시 무료배달 가맹점 표시</li>
          <li>✅ 24시간 내 승인</li>
        </ul>
      </div>

      <div class="space-y-3">
        <button onclick="startOCRCapture()" class="w-full py-4 bg-blue-500 text-white font-bold rounded-xl text-lg">
          <i class="fas fa-camera mr-2"></i> 사업자등록증으로 간편 신청하기
        </button>
        <button onclick="startFieldRegistration()" class="w-full py-4 bg-green-500 text-white font-bold rounded-xl">
          <i class="fas fa-user-friends mr-2"></i> 고령자 현장 등록 모드
        </button>
        <button onclick="closeModal('restaurantModal')" class="w-full py-3 border-2 border-gray-300 font-bold rounded-xl">
          취소
        </button>
      </div>
    </div>
  `;
}

// OCR 캡처 화면
function startOCRCapture() {
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4 text-center">📷 사업자등록증 촬영</h2>
      
      <div class="bg-gray-100 rounded-xl p-8 mb-4 text-center" style="min-height: 300px;">
        <div class="flex flex-col items-center justify-center h-full">
          <i class="fas fa-id-card text-gray-400 text-6xl mb-4"></i>
          <p class="text-gray-600 mb-4">사업자등록증을 촬영하거나<br>사진을 선택해주세요</p>
          <div class="space-y-2 w-full max-w-xs">
            <button onclick="simulateOCR()" class="w-full py-3 bg-blue-500 text-white font-bold rounded-lg">
              <i class="fas fa-camera mr-2"></i> 촬영하기
            </button>
            <button onclick="simulateOCR()" class="w-full py-3 bg-gray-500 text-white font-bold rounded-lg">
              <i class="fas fa-image mr-2"></i> 사진에서 불러오기
            </button>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <p class="text-sm text-blue-800">
          <i class="fas fa-info-circle mr-2"></i>
          사진 1장으로 자동 입력됩니다. 메뉴·계좌는 나중에 등록하셔도 됩니다.
        </p>
      </div>

      <button onclick="closeModal('restaurantModal')" class="w-full py-3 border-2 border-gray-300 font-bold rounded-xl">
        취소
      </button>
    </div>
  `;
}

// OCR 시뮬레이션 (실제로는 OCR API 호출)
function simulateOCR() {
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4 text-center">✅ 자동 인식 결과 확인</h2>
      
      <div class="bg-green-50 p-4 rounded-lg mb-4 text-center">
        <i class="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
        <p class="text-green-800 font-bold">사업자등록증이 인식되었습니다</p>
      </div>

      <div class="space-y-3 mb-6">
        <div>
          <label class="text-sm text-gray-600 mb-1 block">상호명</label>
          <input type="text" id="businessName" value="경산맛집" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="text-sm text-gray-600 mb-1 block">대표자명</label>
          <input type="text" id="ownerName" value="홍길동" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="text-sm text-gray-600 mb-1 block">사업자등록번호</label>
          <input type="text" id="businessNumber" value="123-45-67890" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="text-sm text-gray-600 mb-1 block">사업장 주소</label>
          <input type="text" id="businessAddress" value="경상북도 경산시 중앙로 123" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
        </div>
      </div>

      <div class="bg-yellow-50 p-3 rounded-lg mb-4">
        <p class="text-xs text-gray-700">
          <i class="fas fa-info-circle mr-1"></i>
          자동으로 입력된 정보를 확인해주세요. 수정이 필요하면 직접 입력할 수 있습니다.
        </p>
      </div>

      <button onclick="showContactStep()" class="w-full py-4 bg-blue-500 text-white font-bold rounded-xl">
        다음 단계
      </button>
    </div>
  `;
}

// 연락처 및 동의 단계
function showContactStep() {
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4 text-center">📞 연락처 입력</h2>
      
      <div class="space-y-4 mb-6">
        <div>
          <label class="text-sm text-gray-600 mb-1 block">매장 전화번호 (또는 휴대폰)</label>
          <input type="tel" id="businessPhone" placeholder="010-0000-0000" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg mb-4 space-y-2">
        <label class="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" id="agreeTerms" checked class="mt-1">
          <span class="text-sm">무료배달 가맹 약관에 동의합니다</span>
        </label>
        <label class="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" id="agreePrivacy" checked class="mt-1">
          <span class="text-sm">개인정보 처리 방침에 동의합니다</span>
        </label>
        <label class="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" id="agreeFalseInfo" checked class="mt-1">
          <span class="text-sm">허위 정보 제공 시 등록이 취소될 수 있음을 확인했습니다</span>
        </label>
      </div>

      <button onclick="submitMerchantApplication()" class="w-full py-4 bg-blue-500 text-white font-bold rounded-xl text-lg">
        <i class="fas fa-check mr-2"></i> 가맹 신청 완료
      </button>
    </div>
  `;
}

// 가맹점 신청 제출
async function submitMerchantApplication() {
  const applicationData = {
    businessName: document.getElementById('businessName')?.value || '경산맛집',
    ownerName: document.getElementById('ownerName')?.value || '홍길동',
    businessNumber: document.getElementById('businessNumber')?.value || '123-45-67890',
    address: document.getElementById('businessAddress')?.value || '경상북도 경산시 중앙로 123',
    phone: document.getElementById('businessPhone')?.value || '010-0000-0000'
  };

  try {
    const response = await axios.post('/api/merchant-apply', applicationData);
    showApplicationComplete(response.data);
  } catch (error) {
    console.error('신청 실패:', error);
    showApplicationComplete({ success: true, status: 'PENDING_ACTIVE' });
  }
}

// 신청 완료 화면
function showApplicationComplete(data) {
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="p-6">
      <div class="text-center mb-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check text-green-500 text-4xl"></i>
        </div>
        <h2 class="text-2xl font-bold mb-2">🎉 신청이 완료되었습니다!</h2>
        <p class="text-gray-600">무료배달 가맹점으로 등록되었습니다</p>
      </div>

      <div class="bg-blue-50 p-4 rounded-xl mb-4">
        <div class="text-center">
          <div class="text-sm text-blue-600 mb-1">현재 상태</div>
          <div class="text-lg font-bold text-blue-800">무료배달 가맹점 (준비중)</div>
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 class="font-bold mb-2">다음 단계</h3>
        <ul class="text-sm text-gray-700 space-y-2">
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span><strong>24시간 내</strong> 관리자가 서류를 확인합니다</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>승인 즉시 <strong>주문 접수</strong>가 가능합니다</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-info-circle text-blue-500 mt-1"></i>
            <span>메뉴·사진은 <strong>나중에</strong> 등록하셔도 됩니다</span>
          </li>
        </ul>
      </div>

      <div class="space-y-2">
        <button onclick="closeModal('restaurantModal')" class="w-full py-3 bg-blue-500 text-white font-bold rounded-xl">
          확인
        </button>
        <button onclick="showMenuRegistrationGuide()" class="w-full py-3 border-2 border-blue-500 text-blue-500 font-bold rounded-xl">
          메뉴 등록 하러 가기
        </button>
      </div>
    </div>
  `;
}

// 고령자 현장 등록 모드
function startFieldRegistration() {
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4 text-center">👵 현장 등록 모드</h2>
      
      <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl mb-6 text-center">
        <i class="fas fa-user-friends text-4xl mb-3"></i>
        <h3 class="text-xl font-bold mb-2">사장님은</h3>
        <p class="text-2xl font-bold mb-2">📄 사업자등록증만 주시면 됩니다</p>
        <p class="text-sm opacity-90">메뉴·계좌·비밀번호 필요 없음</p>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg mb-6">
        <h3 class="font-bold mb-2 flex items-center gap-2">
          <i class="fas fa-info-circle text-yellow-500"></i>
          현장 담당자용 안내
        </h3>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>1️⃣ 사업자등록증을 테이블에 올려주세요</li>
          <li>2️⃣ 자동 촬영됩니다 (버튼 누르지 않음)</li>
          <li>3️⃣ 정보 확인만 하시면 끝!</li>
        </ul>
      </div>

      <button onclick="startFieldOCR()" class="w-full py-4 bg-green-500 text-white font-bold rounded-xl text-lg mb-3">
        <i class="fas fa-camera mr-2"></i> 현장 등록 시작
      </button>
      
      <button onclick="startMerchantRegistration()" class="w-full py-3 border-2 border-gray-300 font-bold rounded-xl">
        일반 등록으로 돌아가기
      </button>
    </div>
  `;
}

// 현장 등록 OCR
function startFieldOCR() {
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4 text-center">📸 자동 촬영 중...</h2>
      
      <div class="bg-gradient-to-b from-blue-100 to-blue-50 rounded-xl p-8 mb-4 text-center" style="min-height: 300px;">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="animate-pulse mb-4">
            <i class="fas fa-id-card text-blue-500 text-6xl"></i>
          </div>
          <p class="text-2xl font-bold text-blue-800 mb-2">사업자등록증을</p>
          <p class="text-2xl font-bold text-blue-800 mb-4">네모 안에 올려주세요</p>
          <div class="w-full max-w-sm h-2 bg-blue-200 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 animate-pulse" style="width: 60%"></div>
          </div>
          <p class="text-sm text-gray-600 mt-3">자동으로 촬영됩니다...</p>
        </div>
      </div>

      <div class="bg-green-50 p-4 rounded-lg">
        <p class="text-sm text-green-800 text-center">
          <i class="fas fa-info-circle mr-2"></i>
          잠시만 기다려주세요. 자동으로 인식됩니다.
        </p>
      </div>

      <button onclick="showFieldConfirmation()" class="w-full py-3 bg-blue-500 text-white font-bold rounded-xl mt-4">
        촬영 완료 (테스트)
      </button>
    </div>
  `;
}

// 현장 등록 확인
function showFieldConfirmation() {
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4 text-center">✅ 정보 확인</h2>
      
      <div class="bg-white border-2 border-blue-500 rounded-xl p-6 mb-6">
        <div class="space-y-3 text-lg">
          <div>
            <div class="text-sm text-gray-500">상호명</div>
            <div class="font-bold">경산 맛집</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">주소</div>
            <div class="font-bold">경산시 중앙로 123</div>
          </div>
        </div>
      </div>

      <p class="text-center text-xl mb-6">맞으면 '맞아요' 누르세요</p>

      <div class="space-y-3">
        <button onclick="showFieldComplete()" class="w-full py-4 bg-green-500 text-white font-bold rounded-xl text-xl">
          ✅ 맞아요
        </button>
        <button onclick="alert('관리자가 직접 확인하겠습니다')" class="w-full py-3 border-2 border-gray-300 font-bold rounded-xl">
          다르면 관리자 확인
        </button>
      </div>
    </div>
  `;
}

// 현장 등록 완료
function showFieldComplete() {
  document.getElementById('restaurantModalContent').innerHTML = `
    <div class="p-6">
      <div class="text-center mb-6">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check text-green-500 text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold mb-2">신청 완료되었습니다</h2>
      </div>

      <div class="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl mb-6">
        <div class="text-center">
          <p class="text-lg mb-2">✅ 무료배달 가맹점 (준비중)</p>
          <p class="text-lg mb-4">✅ 내일 주문 가능</p>
          <div class="border-t border-white/30 pt-4 mt-4">
            <p class="text-2xl font-bold">사장님은</p>
            <p class="text-2xl font-bold">아무것도 더 안 하셔도 됩니다</p>
          </div>
        </div>
      </div>

      <button onclick="closeModal('restaurantModal')" class="w-full py-4 bg-blue-500 text-white font-bold rounded-xl text-lg">
        확인
      </button>
    </div>
  `;
}

// 메뉴 등록 안내
function showMenuRegistrationGuide() {
  alert('메뉴 등록 기능은 정식 버전에서 제공됩니다.\n\n현재는 프로토타입 데모입니다.');
}

// 전역 함수로 노출
window.startMerchantRegistration = startMerchantRegistration;
window.startOCRCapture = startOCRCapture;
window.simulateOCR = simulateOCR;
window.showContactStep = showContactStep;
window.submitMerchantApplication = submitMerchantApplication;
window.startFieldRegistration = startFieldRegistration;
window.startFieldOCR = startFieldOCR;
window.showFieldConfirmation = showFieldConfirmation;
window.showFieldComplete = showFieldComplete;
window.showMenuRegistrationGuide = showMenuRegistrationGuide;
