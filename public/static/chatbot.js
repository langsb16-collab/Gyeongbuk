// 경산온(ON) 챗봇 시스템
// 고령자 친화 + 경산온 브랜드 컬러 적용

// 챗봇 상태
const chatbotState = {
  isOpen: false,
  currentView: 'home', // 'home', 'categories', 'questions', 'answer'
  selectedCategory: null,
  faqData: null,
  firstVisit: !localStorage.getItem('chatbot_visited')
};

// 챗봇 초기화
function initChatbot() {
  // FAQ 데이터 로드
  loadFAQData();
  
  // 챗봇 버튼 생성
  createChatbotButton();
  
  // 챗봇 모달 생성
  createChatbotModal();
  
  // 첫 방문 시 말풍선 표시
  if (chatbotState.firstVisit) {
    showWelcomeBubble();
    localStorage.setItem('chatbot_visited', 'true');
  }
}

// FAQ 데이터 로드
async function loadFAQData() {
  try {
    const response = await fetch('/api/chatbot/faq');
    chatbotState.faqData = await response.json();
  } catch (error) {
    console.error('FAQ 데이터 로드 실패:', error);
  }
}

// 챗봇 버튼 생성
function createChatbotButton() {
  const button = document.createElement('button');
  button.id = 'chatbot-button';
  button.innerHTML = `
    <div class="chatbot-icon">
      <i class="fas fa-robot"></i>
    </div>
  `;
  button.onclick = toggleChatbot;
  document.body.appendChild(button);
}

// 챗봇 모달 생성
function createChatbotModal() {
  const modal = document.createElement('div');
  modal.id = 'chatbot-modal';
  modal.className = 'chatbot-modal';
  modal.innerHTML = `
    <div class="chatbot-container">
      <div class="chatbot-header">
        <div class="chatbot-header-left">
          <div class="chatbot-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="chatbot-header-info">
            <div class="chatbot-header-title">온이에요! 😊</div>
            <div class="chatbot-header-subtitle">무엇을 도와드릴까요?</div>
          </div>
        </div>
        <button class="chatbot-close" onclick="closeChatbot()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="chatbot-body" id="chatbot-body">
        <!-- 동적 콘텐츠 -->
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// 챗봇 열기/닫기
function toggleChatbot() {
  if (chatbotState.isOpen) {
    closeChatbot();
  } else {
    openChatbot();
  }
}

function openChatbot() {
  chatbotState.isOpen = true;
  document.getElementById('chatbot-modal').classList.add('active');
  document.getElementById('chatbot-button').classList.add('active');
  renderChatbotHome();
}

function closeChatbot() {
  chatbotState.isOpen = false;
  document.getElementById('chatbot-modal').classList.remove('active');
  document.getElementById('chatbot-button').classList.remove('active');
}

// 홈 화면 렌더링
function renderChatbotHome() {
  const body = document.getElementById('chatbot-body');
  body.innerHTML = `
    <div class="chatbot-welcome">
      <div class="chatbot-welcome-icon">🤖</div>
      <h3>안녕하세요!</h3>
      <p>궁금한 내용을 선택해주세요</p>
    </div>
    <div class="chatbot-categories">
      ${renderCategories()}
    </div>
    <div class="chatbot-quick-actions">
      <button class="quick-action-btn" onclick="startMerchantRegistration()">
        <i class="fas fa-store"></i>
        <span>가맹점 등록</span>
      </button>
      <button class="quick-action-btn" onclick="window.location.href='/admin'">
        <i class="fas fa-headset"></i>
        <span>사람 연결</span>
      </button>
    </div>
  `;
}

// 카테고리 목록 렌더링
function renderCategories() {
  if (!chatbotState.faqData) return '<p>데이터를 불러오는 중...</p>';
  
  return chatbotState.faqData.categories.map(cat => `
    <button class="category-card" onclick="selectCategory('${cat.id}')">
      <div class="category-icon">
        <i class="fas ${cat.icon}"></i>
      </div>
      <div class="category-info">
        <div class="category-title">${cat.title}</div>
        <div class="category-count">${cat.questions.length}개 질문</div>
      </div>
      <i class="fas fa-chevron-right category-arrow"></i>
    </button>
  `).join('');
}

// 카테고리 선택
function selectCategory(categoryId) {
  chatbotState.selectedCategory = categoryId;
  renderQuestionsList(categoryId);
}

// 질문 목록 렌더링
function renderQuestionsList(categoryId) {
  const category = chatbotState.faqData.categories.find(c => c.id === categoryId);
  if (!category) return;
  
  const body = document.getElementById('chatbot-body');
  body.innerHTML = `
    <button class="chatbot-back-btn" onclick="renderChatbotHome()">
      <i class="fas fa-arrow-left"></i>
      <span>뒤로</span>
    </button>
    <div class="chatbot-section-title">
      <i class="fas ${category.icon}"></i>
      <span>${category.title}</span>
    </div>
    <div class="chatbot-questions">
      ${category.questions.map((q, index) => `
        <button class="question-item" onclick='showAnswer(${JSON.stringify(q).replace(/'/g, "&apos;")})'>
          <div class="question-number">${index + 1}</div>
          <div class="question-text">${q.q}</div>
          <i class="fas fa-chevron-right question-arrow"></i>
        </button>
      `).join('')}
    </div>
  `;
}

// 답변 표시
function showAnswer(question) {
  const body = document.getElementById('chatbot-body');
  body.innerHTML = `
    <button class="chatbot-back-btn" onclick="selectCategory('${chatbotState.selectedCategory}')">
      <i class="fas fa-arrow-left"></i>
      <span>뒤로</span>
    </button>
    <div class="chatbot-answer-container">
      <div class="chatbot-question-display">
        <div class="question-icon">Q</div>
        <div class="question-text">${question.q}</div>
      </div>
      <div class="chatbot-answer-display">
        <div class="answer-icon">
          <i class="fas fa-robot"></i>
        </div>
        <div class="answer-text">${question.a}</div>
      </div>
    </div>
    <div class="chatbot-helpful">
      <p>도움이 되셨나요?</p>
      <div class="helpful-buttons">
        <button class="helpful-btn yes" onclick="handleHelpful(true)">
          <i class="fas fa-thumbs-up"></i>
          <span>네</span>
        </button>
        <button class="helpful-btn no" onclick="handleHelpful(false)">
          <i class="fas fa-thumbs-down"></i>
          <span>아니요</span>
        </button>
      </div>
    </div>
  `;
}

// 도움 여부 처리
function handleHelpful(isHelpful) {
  const container = document.querySelector('.chatbot-helpful');
  container.innerHTML = `
    <div class="helpful-response">
      <i class="fas fa-check-circle"></i>
      <p>${isHelpful ? '도움이 되어 기쁩니다!' : '더 나은 답변을 준비하겠습니다.'}</p>
    </div>
  `;
  
  setTimeout(() => {
    renderChatbotHome();
  }, 2000);
}

// 첫 방문 말풍선 표시
function showWelcomeBubble() {
  const bubble = document.createElement('div');
  bubble.id = 'chatbot-welcome-bubble';
  bubble.className = 'chatbot-welcome-bubble';
  bubble.innerHTML = `
    <div class="bubble-content">
      <p>도움이 필요하신가요? 😊</p>
      <button class="bubble-close" onclick="closeWelcomeBubble()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  document.body.appendChild(bubble);
  
  // 5초 후 자동 닫기
  setTimeout(() => {
    closeWelcomeBubble();
  }, 5000);
}

function closeWelcomeBubble() {
  const bubble = document.getElementById('chatbot-welcome-bubble');
  if (bubble) {
    bubble.remove();
  }
}

// 페이지 로드 시 챗봇 초기화
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initChatbot, 1000); // 1초 후 초기화
  });
}

// 전역 함수 노출
window.toggleChatbot = toggleChatbot;
window.closeChatbot = closeChatbot;
window.openChatbot = openChatbot;
window.selectCategory = selectCategory;
window.showAnswer = showAnswer;
window.handleHelpful = handleHelpful;
window.renderChatbotHome = renderChatbotHome;
window.closeWelcomeBubble = closeWelcomeBubble;
