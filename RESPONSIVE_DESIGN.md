# PC·휴대폰 UI 동기화 가이드 - 경산온(ON)

## 🎯 핵심 원칙

> **"PC와 모바일은 같은 서비스, 같은 데이터, 다른 표현"**

- ✅ 기능·데이터·상태는 100% 동일
- ✅ 레이아웃·크기·상호작용만 기기별 분리
- ✅ CSS/디자인 토큰은 공통, 브레이크포인트로 분기

---

## 1️⃣ 공통 디자인 토큰

### 🎨 Color (PC·모바일 100% 공유)
```css
:root {
  /* 경산온 브랜드 컬러 */
  --color-primary: #1F3A5F;      /* 경산 네이비 */
  --color-secondary: #6B3E26;    /* 대추 브라운 */
  --color-accent: #C9A24D;       /* 소프트 골드 */
  --color-background: #F8F9FA;   /* 아이보리 화이트 */
  --color-card: #FFFFFF;         /* 화이트 */
  --color-line: #E5E7EB;         /* 소프트 그레이 */
  --color-success: #2F7D4C;      /* 포레스트 그린 */
  --color-warning: #C05621;      /* 딥 오렌지 */
}
```

### 🔤 Font (공통)
```css
:root {
  --font-base: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-title: 'Noto Serif KR', serif;
}
```

---

## 2️⃣ 브레이크포인트 기준

```css
/* Mobile: 0~767px */
@media (max-width: 767px) {
  /* 휴대폰 전용 스타일 */
}

/* Tablet: 768~1199px */
@media (min-width: 768px) and (max-width: 1199px) {
  /* 태블릿 전용 스타일 (선택) */
}

/* PC: 1200px+ */
@media (min-width: 1200px) {
  /* PC 전용 스타일 */
}
```

**중요**: 기능 분기 ❌ / 표현 분기만 ⭕

---

## 3️⃣ 레이아웃 설정

### 📱 휴대폰 UI
```css
.container {
  width: 100%;
  padding: 0 16px;
}

.button-primary {
  height: 58px;
  font-size: 20px;
  border-radius: 12px;
}

.card {
  margin-bottom: 12px;
  border-radius: 12px;
}
```

**특징**:
- 콘텐츠 최대폭: 100%
- 좌우 패딩: 16px
- 카드 간격: 12px
- 버튼 높이: 56~60px
- 화면당 주요 버튼: 1개
- 스크롤: 세로 1방향

### 🖥 PC UI
```css
@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .button-primary {
    height: 46px;
    font-size: 16px;
    border-radius: 8px;
  }

  .card {
    margin-bottom: 20px;
    border-radius: 8px;
  }
}
```

**특징**:
- 콘텐츠 최대폭: 1200px
- 좌우 여백: auto (센터 정렬)
- 카드 간격: 20~24px
- 버튼 높이: 44~48px
- 화면당 버튼: 2~3개

---

## 4️⃣ 폰트 크기 자동 동기화

```css
/* 휴대폰 (기본) */
h1 { font-size: 22px; font-weight: 700; }
h2 { font-size: 20px; font-weight: 600; }
body { font-size: 18px; line-height: 1.6; }
.btn-text { font-size: 20px; }

/* PC */
@media (min-width: 1200px) {
  h1 { font-size: 28px; }
  h2 { font-size: 22px; }
  body { font-size: 15px; line-height: 1.5; }
  .btn-text { font-size: 16px; }
}
```

**중요**: 텍스트 내용 동일 / 크기만 자동 조정

---

## 5️⃣ UI 컴포넌트 동기화

### 버튼
```css
.btn {
  background: var(--color-primary);
  color: white;
  border: none;
  cursor: pointer;
  min-height: 44px; /* WCAG 접근성 */
  transition: all 0.2s;
}

/* 휴대폰 */
.btn {
  height: 58px;
  font-size: 20px;
  border-radius: 12px;
  padding: 0 24px;
}

/* PC */
@media (min-width: 1200px) {
  .btn {
    height: 46px;
    font-size: 16px;
    border-radius: 8px;
    padding: 0 20px;
  }
}
```

### 카드
```css
.card {
  background: var(--color-card);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

/* 휴대폰 */
.card {
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

/* PC */
@media (min-width: 1200px) {
  .card {
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
}
```

---

## 6️⃣ 내비게이션 설정

### 📱 휴대폰 (하단 탭)
```html
<nav class="bottom-nav">
  <a href="/" class="nav-item active">
    <i class="fas fa-home"></i>
    <span>홈</span>
  </a>
  <a href="/market" class="nav-item">
    <i class="fas fa-store"></i>
    <span>전통시장</span>
  </a>
  <a href="/localfood" class="nav-item">
    <i class="fas fa-leaf"></i>
    <span>로컬푸드</span>
  </a>
  <a href="/my" class="nav-item">
    <i class="fas fa-user"></i>
    <span>내정보</span>
  </a>
</nav>
```

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-top: 1px solid var(--color-line);
  z-index: 1000;
}

@media (min-width: 1200px) {
  .bottom-nav {
    display: none; /* PC에서는 숨김 */
  }
}
```

### 🖥 PC (상단 메뉴)
```html
<header class="top-nav">
  <div class="container">
    <div class="logo">경산온(ON)</div>
    <nav class="menu">
      <a href="/">홈</a>
      <a href="/market">전통시장</a>
      <a href="/localfood">로컬푸드</a>
      <a href="/specialty">특산물</a>
      <a href="/merchant">가맹점</a>
    </nav>
    <div class="actions">
      <button>로그인</button>
    </div>
  </div>
</header>
```

```css
.top-nav {
  display: none; /* 휴대폰에서는 숨김 */
}

@media (min-width: 1200px) {
  .top-nav {
    display: block;
    background: white;
    border-bottom: 1px solid var(--color-line);
    padding: 16px 0;
  }
}
```

---

## 7️⃣ 기능 동기화 예시

### 가맹점 등록
| 기능 | 휴대폰 | PC |
|------|--------|-----|
| 입력 방식 | 사진 촬영 | 파일 업로드 |
| OCR 처리 | 자동 | 동일 API |
| 결과 표시 | 카드 UI | 테이블 |
| 승인 권한 | ❌ | ⭕ (관리자) |

**중요**: API/로직은 하나, UI만 다름

---

## 8️⃣ 접근성 (고령자 친화)

```css
/* 최소 터치 영역 (WCAG) */
button, a {
  min-height: 44px;
  min-width: 44px;
}

/* 포커스 표시 */
button:focus, a:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 색상 대비 4.5:1 이상 */
.text-primary {
  color: var(--color-primary); /* #1F3A5F on #FFFFFF = 8.59:1 ✅ */
}

/* 아이콘 단독 사용 금지 */
.icon-button {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-button i {
  margin-right: 4px;
}
.icon-button span {
  display: inline; /* 텍스트 필수 */
}
```

---

## 9️⃣ 실무 구조

```
공통 UI 컴포넌트
 ├─ Button (btn.css)
 ├─ Card (card.css)
 ├─ Input (input.css)
 ├─ Modal (modal.css)
 └─ Badge (badge.css)

     ↓ (CSS Media Query)

Mobile UI (max-width: 767px)
 ├─ 하단 탭 내비게이션
 ├─ 전체 화면 모달
 └─ 세로 스크롤 카드

PC UI (min-width: 1200px)
 ├─ 상단 메뉴 내비게이션
 ├─ 센터 정렬 모달
 └─ 그리드 레이아웃 카드
```

---

## 🔟 체크리스트

### 개발 시작 전
- [ ] 브레이크포인트 767px / 1200px 확인
- [ ] 디자인 토큰 변수 설정
- [ ] 폰트 크기 자동 조정 확인

### 컴포넌트 개발 시
- [ ] 휴대폰 UI 먼저 완성 (Mobile First)
- [ ] PC 미디어쿼리 추가
- [ ] 접근성 최소 터치 영역 확인

### 배포 전
- [ ] Chrome DevTools 반응형 모드 테스트
- [ ] 실제 휴대폰 테스트 (iPhone/Android)
- [ ] PC 브라우저 테스트 (1920px, 1366px)

---

## 🎯 한 줄 요약

**"PC와 모바일은 같은 서비스, 같은 데이터, 다른 표현"**

→ 기능 분기 ❌ / CSS 미디어쿼리만 ⭕

---

**작성일**: 2026-01-12  
**프로젝트**: 경산온(ON)  
**슬로건**: "경산은 배달비가 없습니다"
