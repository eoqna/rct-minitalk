# 미니톡 (Minitalk)

커플을 위한 심플한 실시간 채팅 웹 애플리케이션입니다.

## 🚀 주요 기능

- 간단한 PIN 인증으로 빠른 접속
- 실시간 1:1 채팅
- 이모티콘 전송
- 모바일 최적화 UI

## 🛠 기술 스택

- **Frontend**: React + TypeScript + Vite
- **Backend/DB**: Supabase (실시간 데이터베이스 및 인증)
- **스타일링**: TailwindCSS

## 📱 페이지 구성

### 1. 로그인 페이지 (`/`)

#### 레이아웃
- 모바일 화면 크기 (max-width: 480px)
- 화면 중앙 정렬
- 전체 높이 100vh
  
#### 기능
- 숫자 PIN 입력 (4-6자리)
- PIN 입력 시 자동 포커스 이동
- 입력된 PIN을 호이스팅하여 저장
- 유효한 PIN 입력 시 자동으로 채팅 페이지로 이동

### 2. 채팅 페이지 (`/chat`)

#### 레이아웃
- 모바일 화면 크기 (max-width: 480px)
- 화면 중앙 정렬
- 전체 높이 100vh
- 헤더, 채팅 영역, 입력 영역으로 구분

#### 기능
1. 채팅 메시지 표시
   - 메시지 시간 표시
   - 본인/상대방 메시지 구분 (좌/우 정렬)
   - 메시지 전송 상태 표시
   - 자동 스크롤

2. 메시지 입력
   - 텍스트 입력
   - 전송 버튼
   - 이모티콘 선택 버튼

3. 이모티콘 기능
   - emoji-mart를 활용한 이모티콘 선택기
   - 카테고리별 이모티콘 분류
   - 이모티콘 검색 기능
   - 최근 사용한 이모티콘 기록
   - 자주 사용하는 이모티콘 즐겨찾기

## 💾 데이터 구조 (Supabase)

### 채팅방 테이블 (rooms)
```sql
id: uuid (PK)
pin: string
created_at: timestamp
```

### 메시지 테이블 (messages)
```sql
id: uuid (PK)
room_id: uuid (FK)
content: string
type: string (text | emoticon)
created_at: timestamp
```

## 🔒 보안 및 제한사항

- PIN 기반의 간단한 인증
- 채팅방 접속 시 PIN 검증
- 메시지 길이 제한 (최대 1000자)
- 이모티콘 크기 제한

## ✨ 추가 기능 (선택적)

- 메시지 읽음 표시
- 입력 중 표시
- 오프라인 상태 표시
- 메시지 전송 실패 시 재전송
- 채팅 내역 로컬 캐싱

## 🚦 시작하기

```bash
# 프로젝트 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📝 라이센스

MIT License
