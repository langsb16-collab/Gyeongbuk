# 🗂️ 복구용 백업 정보

## 📦 백업 파일

- **백업 이름**: 경산온_한국어전용_배달페이지반응형_2026-01-13
- **다운로드 URL**: https://www.genspark.ai/api/files/s/Np79MrKy
- **파일 크기**: 980 KB (1,003,394 bytes)
- **백업 날짜**: 2026-01-13
- **형식**: tar.gz (압축 아카이브)

## 📋 백업 내용

### 핵심 기능
1. ✅ **한국어 전용** - 7개 국어(영어/중국어/일본어/스페인어/프랑스어/독일어/아랍어) 완전 삭제
2. ✅ **배달 페이지 반응형** - PC/모바일 최적화 (폰트, 이미지, 버튼 크기)
3. ✅ **로컬푸드 이미지 수정** - CORS + onerror 핸들러
4. ✅ **주문 플로우** - 장바구니 API, 메뉴 페이지, 주문 페이지
5. ✅ **반응형 디자인** - PC(3열)/태블릿(2열)/모바일(1열)

### 삭제된 다국어 시스템
- ❌ translations 객체 (555줄)
- ❌ t() 번역 함수
- ❌ applyTranslations() 함수
- ❌ 언어 선택 드롭다운 (PC/Mobile)
- ❌ localStorage.lang 저장 로직
- ❌ data-i18n 속성
- ❌ RTL CSS (아랍어)
- ❌ 다국어 챗봇 링크

### 코드 변경 통계
- **Before**: 2,296줄
- **After**: 1,741줄
- **감소**: 555줄 (24.2%)
- **빌드 크기**: 108.43 kB → 118.63 kB (반응형 CSS 추가)

## 🗄️ 백업 복구 방법

### 1. 백업 파일 다운로드
```bash
# 다운로드
wget https://www.genspark.ai/api/files/s/Np79MrKy -O backup.tar.gz

# 또는 curl 사용
curl -L https://www.genspark.ai/api/files/s/Np79MrKy -o backup.tar.gz
```

### 2. 압축 해제
```bash
# 현재 위치에 압축 해제
tar -xzf backup.tar.gz

# 또는 특정 디렉토리에 압축 해제
mkdir -p ~/restore
tar -xzf backup.tar.gz -C ~/restore
```

### 3. 프로젝트 복원
```bash
# /home/user/webapp 경로로 복원
cd /home/user
rm -rf webapp  # 기존 디렉토리 삭제 (주의!)
tar -xzf backup.tar.gz

# 의존성 설치
cd webapp
npm install

# 빌드
npm run build

# 서버 시작 (PM2)
pm2 start ecosystem.config.cjs
```

## 📊 프로젝트 구조

```
webapp/
├── src/
│   └── index.tsx          # 메인 Hono 앱 (1,741줄, 한국어 전용)
├── public/
│   └── static/
│       ├── localfood.html # 로컬푸드 페이지 (이미지 수정)
│       ├── admin.html     # 관리자 페이지
│       ├── responsive.css # 반응형 CSS
│       └── app.js         # 프론트엔드 JS
├── migrations/
│   ├── 0002_orders_carts.sql      # 주문/장바구니 테이블
│   └── 0003_safety_trading.sql    # 안전거래 테이블
├── .git/                  # Git 저장소
├── .gitignore             # Node.js 프로젝트용
├── ecosystem.config.cjs   # PM2 설정
├── wrangler.jsonc         # Cloudflare 설정
├── package.json           # 의존성 및 스크립트
├── tsconfig.json          # TypeScript 설정
├── vite.config.ts         # Vite 빌드 설정
└── README.md              # 프로젝트 문서
```

## 🌐 배포 정보

### GitHub
- **저장소**: https://github.com/langsb16-collab/Gyeongbuk
- **브랜치**: main
- **최신 커밋**: e11db03

### Cloudflare Pages
- **메인 도메인**: https://inkorea.me
- **프로젝트**: gyeongbuk
- **최신 배포**: https://cc8a83aa.gyeongbuk.pages.dev

## 🔑 주요 커밋 히스토리

1. **98e55f3**: 다국어 지원 완전 제거, 한국어만 유지
2. **437f69d**: 장바구니 및 메뉴 페이지 구현
3. **0ffe7e3**: 로컬푸드 API 응답 형식 수정
4. **9359b8b**: 로컬푸드 이미지 표시 개선
5. **24a8f0f**: 이미지 crossorigin 및 onerror 핸들러 추가
6. **e11db03**: 배달 페이지 반응형 리디자인

## 🎯 백업 시점 기능 상태

### ✅ 완료된 기능
- 한국어 전용 UI (다국어 완전 삭제)
- 배달 페이지 반응형 디자인
- 로컬푸드 주문 시스템
- 장바구니 API (create, add, current)
- 메뉴 페이지 (/store/{id}/menu)
- 주문 페이지 (/store/{id}/order)
- 이미지 CORS 지원 + 폴백
- PC/모바일 반응형 최적화

### 🔄 진행 중
- 주문 페이지 완성 (결제 흐름)
- 실제 음식점 데이터 추가

### 📝 향후 계획
- D1 데이터베이스 마이그레이션
- 결제 시스템 통합
- 관리자 대시보드 완성

## 📞 복구 지원

백업 복구 중 문제가 발생하면:
1. 백업 파일 다운로드 확인
2. tar.gz 압축 해제 확인
3. /home/user/webapp 경로 확인
4. npm install 실행
5. PM2 재시작

---

**💾 백업 완료!**
**언제든지 이 시점으로 복구할 수 있습니다!**
