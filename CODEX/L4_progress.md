# progress.md

# FlowTool MVP Roadmap

이 문서는 FlowTool MVP의 전체 개발 로드맵을 관리한다.

현재 프로젝트는 반드시 아래 순서대로 구현한다.

새로운 기능은 추가하지 않으며, 현재 Step이 완료되기 전에는 다음 Step으로 진행하지 않는다.

---

# 현재 프로젝트 상태

현재 단계

> **STEP 6 완료 / STEP 7 진행 예정**

현재 목표

> **Capture Log 상세 화면 구현 준비**

---

# MVP Roadmap

## STEP 1. Backend 프로젝트 초기 구성

### 목표

Express.js + TypeScript 기반 Backend 프로젝트를 생성한다.

### 완료 상태

✅ 완료

### 완료 내용

- backend/ 프로젝트 생성
- Express.js 구성
- TypeScript 설정
- 기본 디렉터리 구조 생성

---

## STEP 2. Capture Middleware 구현

### 목표

모든 HTTP 요청과 응답을 Capture할 수 있는 Middleware를 구현한다.

### 완료 상태

✅ 완료

### 완료 내용

- Capture Middleware 구현
- Request 정보 수집
- Response 정보 수집
- 처리 시간 계산

---

## STEP 3. Capture Log 저장

### 목표

Capture 데이터를 PostgreSQL에 저장하고 정상 동작을 검증한다.

### 완료 상태

✅ 완료

### 완료 내용

- PostgreSQL 연결
- CaptureLog 모델 구현
- Repository / Service 구현
- Capture Log 저장
- 테스트 API 작성
- 검증 스크립트 작성
- PostgreSQL MCP 저장 결과 확인 완료

---

## STEP 4. Capture Log 조회 API

### 목표

저장된 Capture Log를 조회할 수 있는 API를 구현한다.

### 완료 상태

✅ 완료

### 완료 조건

- GET /capture-logs 구현 완료
- GET /capture-logs/:id 구현 완료
- 최신순 조회 확인 완료
- 존재하지 않는 ID 예외 처리 확인 완료
- 자동 API 검증 스크립트 완료
- PostgreSQL MCP로 저장 데이터와 API 응답 비교 완료

### 완료 내용

- Repository 조회 기능 추가
- Service 조회 기능 추가
- Controller 구현
- Route 구현
- `npm run verify:capture-logs` 검증 스크립트 추가
- API 응답 형식 `{ success, data, failResponse }` 적용

---

## STEP 5. Frontend 프로젝트 생성

### 목표

React + Vite + TypeScript 기반 Frontend 프로젝트를 `frontend/` 폴더 하위에 생성한다.

### 완료 상태

✅ 완료

### 완료 조건

- frontend 프로젝트 생성 완료
- 기본 레이아웃 구성 완료
- API 연결 준비 완료

### 완료 내용

- React + Vite + TypeScript 프로젝트 구성
- Vite 환경 변수 예시 추가
- Vite dev proxy 구성
- Frontend build 검증 완료

---

## STEP 6. Capture 목록 화면

### 목표

저장된 Capture Log 목록을 화면에서 확인할 수 있다.

### 완료 상태

✅ 완료

### 완료 조건

- 목록 조회 완료
- 최신순 표시 확인 완료
- 새로고침 시 재조회 확인 완료

### 완료 내용

- `GET /capture-logs` API 연동
- Capture Log 목록 테이블 구현
- Method, Path, Response Status, Duration, Created At 표시
- 로딩 상태 처리
- 빈 목록 상태 처리
- API 실패 상태 처리
- Playwright MCP 브라우저 검증 완료

---

## STEP 7. Capture 상세 화면

### 목표

Capture 한 건의 상세 정보를 확인할 수 있다.

### 완료 상태

🟡 진행 예정

### 완료 조건

- Request 정보 표시
- Response 정보 표시
- Duration 표시

---

## STEP 8. Spring Starter 연동

### 목표

Spring 프로젝트에서 FlowTool SDK를 추가하면 Capture가 가능하도록 한다.

---

## STEP 9. Node SDK 연동

### 목표

Express 프로젝트에서도 동일한 방식으로 Capture가 가능하도록 한다.

---

## STEP 10. Playwright 기반 검증

### 목표

자동 테스트를 통해 Capture 동작을 검증한다.

---

## STEP 11. AI 분석 (MVP 마지막)

### 목표

Capture Log를 AI가 요약하고 분석할 수 있도록 한다.

---

# 현재 우선순위

현재는 STEP 7만 진행한다.

STEP 7이 완료되기 전까지는
다른 기능을 구현하지 않는다.

---

# 진행 원칙

항상 아래 순서를 따른다.

1. progress.md에서 현재 Step 확인
2. current_requirement.md로 오늘 작업 정의
3. 구현
4. 검증
5. Notion Development History 기록
6. L4_progress.md 업데이트
7. 다음 Step 진행

---

# 프로젝트 목표

FlowTool MVP 목표는 아래 기능을 완성하는 것이다.

- HTTP 요청 수집
- PostgreSQL 저장
- Capture 조회
- Dashboard 조회
- Spring / Node 연동
- AI 분석

MVP 범위를 벗어나는 기능은 구현하지 않는다.
