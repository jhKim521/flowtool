# L4_current_requirement.md

# 현재 작업 지시

## 현재 프로젝트 상태

FlowTool은 기존 전역 Capture Middleware 중심 구조에서 Proxy 중심 구조로 전환 중이다.

현재까지 아래 작업이 완료되었다.

### Backend

* Express.js + TypeScript 프로젝트 구성
* PostgreSQL 연결
* CaptureLog 모델 및 Repository 구성
* Capture Log 목록 조회 기능
* Capture Log 상세 조회 기능
* Capture Log 저장 검증 스크립트
* Express 전역 Capture Middleware 제거
* 사용하지 않는 Capture Middleware 코드 삭제
* Capture 저장 기능을 `saveCaptureLog(input)` 명시적 호출 구조로 분리
* Capture Service 입력을 Express `Request`, `Response` 객체가 아닌 순수 데이터 입력으로 변경
* FlowTool 내부 API 요청 자동 Capture 중단
* 내부 API 비수집 검증 스크립트 추가

현재 Backend 조회 API는 아래 경로를 사용한다.

```text
GET /capture-logs
GET /capture-logs/:id
```

### Frontend

* React + Vite + TypeScript 프로젝트 구성
* Capture Log 목록 화면 구현
* Capture Log 상세 화면 구현
* 목록에서 상세 화면 이동
* 로딩, 빈 목록, 404, API 실패 상태 처리
* Playwright MCP 기반 화면 검증

현재 Frontend는 기존 `/capture-logs` API를 호출한다.

---

# 현재 목표

기존 Capture 목록·상세 조회 기능을 Query 전용 API로 분리한다.

Backend Query API 경로를 아래와 같이 변경한다.

```text
기존

GET /capture-logs
GET /capture-logs/:id
```

```text
변경

GET /api/captures
GET /api/captures/:id
```

Frontend 목록 및 상세 화면도 변경된 Query API를 사용하도록 수정한다.

이번 작업 이후 Query API는 Capture Log를 읽기만 하며, 어떤 Capture Log도 생성하지 않아야 한다.

---

# Sprint Goal

이번 작업에서는 아래 조회 흐름만 완성한다.

```text
React Dashboard
      ↓
GET /api/captures
GET /api/captures/:id
      ↓
Query Controller
      ↓
Query Service
      ↓
CaptureLog Repository
      ↓
PostgreSQL
```

Query 요청은 Capture 저장 흐름과 완전히 분리한다.

```text
Query API
→ 조회만 수행
→ Capture Service 호출 금지
→ Capture Log 생성 금지
```

---

# 이번 작업 범위

이번 작업에서는 아래 항목만 구현한다.

* 기존 Capture 조회 Route를 Query API 경로로 변경
* Query Controller 책임 정리
* Query Service 책임 정리
* 기존 Repository 조회 기능 재사용
* Frontend 목록 API 호출 경로 변경
* Frontend 상세 API 호출 경로 변경
* Frontend 개발용 Vite Proxy 설정 확인 및 수정
* Backend Query API 검증 스크립트 수정
* Query API 호출 전후 DB 개수 비교 검증
* Frontend 목록·상세 화면 회귀 검증
* 기존 404 및 API 실패 처리 회귀 검증
* 관련 API 명세 및 진행 문서 반영

---

# Query API

## Capture 목록 조회

### Endpoint

```http
GET /api/captures
```

### 역할

* 저장된 Capture Log 목록 조회
* 현재 구현된 최신순 정렬 유지
* 현재 목록 응답 형식 유지
* Capture Log 저장 기능 호출 금지

### 응답 항목

현재 구현된 목록 응답 항목을 유지한다.

* id
* method
* path
* responseStatus
* durationMs
* createdAt

현재 데이터 모델에 없는 Proxy 전용 필드는 추가하지 않는다.

---

## Capture 상세 조회

### Endpoint

```http
GET /api/captures/:id
```

### 역할

* Capture Log 한 건 조회
* 존재하지 않는 ID의 404 처리
* 현재 상세 응답 형식 유지
* Capture Log 저장 기능 호출 금지

### 응답 항목

현재 구현된 상세 응답 항목을 유지한다.

* id
* method
* path
* query
* requestHeaders
* requestBody
* responseStatus
* responseBody
* durationMs
* errorMessage
* createdAt

현재 DB와 API에 이미 존재하는 필드만 반환한다.

---

# 기존 API 처리 원칙

기존 API는 아래와 같다.

```text
GET /capture-logs
GET /capture-logs/:id
```

현재 프로젝트는 외부 사용자가 없는 로컬 MVP 단계이므로, 기존 API를 호환 목적으로 유지하지 않는다.

아래 원칙을 따른다.

* 기존 `/capture-logs` Route 제거
* 기존 `/capture-logs/:id` Route 제거
* 신규 `/api/captures` Route만 유지
* 동일 기능을 두 경로에서 중복 제공하지 않음
* Deprecated Route를 주석이나 별도 파일로 남기지 않음

기존 경로를 호출하면 `404`가 반환되는 것이 정상이다.

---

# Backend 책임 분리

## Query Controller

해야 하는 일

* HTTP 요청 Parameter 수신
* Query Service 호출
* 공통 응답 형식 반환
* 존재하지 않는 ID에 대한 오류 전달

하지 않는 일

* Repository 직접 접근
* Capture Log 저장
* Capture Service 호출
* DB 데이터 가공 로직 직접 구현
* Proxy 요청 처리

---

## Query Service

해야 하는 일

* Capture Log 목록 조회
* Capture Log 단건 조회
* 존재하지 않는 Capture Log 오류 처리
* 필요한 최소 응답 변환

하지 않는 일

* Capture Log 저장
* Target URL 검증
* HTTP 요청 중계
* Express `Request`, `Response` 객체 처리
* Frontend 전용 표시 형식 생성

---

## CaptureLog Repository

기존 조회 기능을 재사용한다.

필요한 기능

* 최신순 목록 조회
* ID 단건 조회
* 검증을 위한 전체 개수 조회

이번 작업을 위해 Repository를 불필요하게 분리하지 않는다.

---

# 파일 및 명명 원칙

현재 파일명이 `capture-log.controller.ts`, `capture-log.routes.ts`, `capture-log.service.ts` 등으로 구성되어 있을 수 있다.

이번 작업에서는 역할이 혼동되지 않도록 Query 관련 이름을 명확히 정리할 수 있다.

권장 예시

```text
routes/
└── capture-query.routes.ts

controllers/
└── capture-query.controller.ts

services/
├── capture-log.service.ts
└── capture-query.service.ts
```

단, 현재 `capture-log.service.ts`가 저장과 조회 기능을 모두 포함하고 있다면 아래 책임으로 정리한다.

```text
CaptureLogService
→ 명시적 Capture 저장

CaptureQueryService
→ 목록 및 상세 조회
```

파일명 변경으로 과도한 수정이 발생한다면 최소 변경을 우선하되, 하나의 Service에 저장과 조회 책임을 다시 합치지 않는다.

---

# Frontend 변경

Frontend 목록 및 상세 화면의 API 호출 경로를 변경한다.

```text
목록

기존: GET /capture-logs
변경: GET /api/captures
```

```text
상세

기존: GET /capture-logs/:id
변경: GET /api/captures/:id
```

Frontend 화면 URL은 변경하지 않는다.

```text
목록 화면: 현재 경로 유지
상세 화면: /capture/:id 유지
```

화면 URL과 Backend API URL을 혼동하지 않는다.

---

# Vite Proxy 설정

Frontend에서 상대 경로로 API를 호출하는 경우 Vite Proxy가 신규 API 경로를 Backend로 전달할 수 있어야 한다.

예시:

```ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      changeOrigin: true
    }
  }
}
```

기존 `/capture-logs` 전용 Proxy 설정이 있다면 제거하거나 `/api` 기준으로 변경한다.

`/capture/:id`는 React Router 화면 경로이므로 Backend로 Proxy하지 않는다.

---

# 공통 응답 형식

현재 프로젝트의 공통 응답 형식을 유지한다.

## 성공

```json
{
  "success": true,
  "data": {},
  "failResponse": null
}
```

## 실패

```json
{
  "success": false,
  "data": null,
  "failResponse": {
    "code": "CAPTURE_NOT_FOUND",
    "message": "Capture log not found."
  }
}
```

목록 응답의 `data`가 현재 배열 형태라면 해당 형식을 유지한다.

이번 작업에서 페이지네이션 응답 구조로 변경하지 않는다.

---

# 완료 기준

아래 조건을 모두 만족하면 이번 작업은 완료로 판단한다.

## Backend

* `GET /api/captures`가 정상 동작한다.
* `GET /api/captures/:id`가 정상 동작한다.
* 목록은 기존과 동일하게 최신순으로 조회된다.
* 존재하지 않는 ID는 `404`와 `CAPTURE_NOT_FOUND`를 반환한다.
* 기존 `/capture-logs` 경로는 제거된다.
* 기존 `/capture-logs/:id` 경로는 제거된다.
* Query Controller와 Query Service의 책임이 분리된다.
* Query API에서 Capture Service를 호출하지 않는다.
* Query API 호출로 Capture Log가 생성되지 않는다.
* Health Check 호출로 Capture Log가 생성되지 않는다.

## Frontend

* 목록 화면이 `GET /api/captures`를 호출한다.
* 상세 화면이 `GET /api/captures/:id`를 호출한다.
* 기존 목록 데이터가 정상 표시된다.
* 기존 상세 데이터가 정상 표시된다.
* 목록에서 상세 화면 이동이 정상 동작한다.
* 상세 화면 새로고침이 정상 동작한다.
* 존재하지 않는 ID의 404 화면이 정상 동작한다.
* Backend 중단 시 API 실패 화면이 정상 동작한다.
* Browser Console Error가 없다.

## 검증

* Backend Build 성공
* Backend TypeScript 검사 성공
* Frontend Build 성공
* Frontend TypeScript 검사 성공
* Query API 자동 검증 성공
* Query API 호출 전후 DB 개수가 동일함
* Playwright MCP 회귀 검증 성공
* PostgreSQL MCP 비수집 검증 성공
* IDE Problems 기준 Error 없음
* Deprecated 설정 경고 없음

---

# 검증 방법

## 1. Backend Build 및 TypeScript 검사

```bash
cd backend
npm run build
npx tsc --noEmit
```

---

## 2. Query API 검증

Backend 서버를 실행한다.

```bash
npm run dev
```

목록 조회:

```bash
http GET :3000/api/captures
```

상세 조회:

```bash
http GET :3000/api/captures/{existingId}
```

존재하지 않는 ID:

```bash
http GET :3000/api/captures/999999999
```

기존 경로 제거 확인:

```bash
http GET :3000/capture-logs
http GET :3000/capture-logs/{existingId}
```

예상 결과:

```text
/api/captures             → 200
/api/captures/{id}        → 200
/api/captures/999999999   → 404
/capture-logs             → 404
/capture-logs/{id}        → 404
```

---

## 3. 자동 검증 스크립트

기존 `verify:capture-logs` 스크립트를 신규 Query API 기준으로 수정한다.

최소 검증 항목:

* 목록 조회 성공
* 상세 조회 성공
* 최신순 정렬 확인
* 없는 ID 404 확인
* 기존 경로 404 확인
* API 응답과 DB 데이터 비교
* 조회 전후 Capture Log 개수 동일

실제 실행 명령과 결과를 작업 보고에 포함한다.

예시:

```bash
npm run verify:capture-logs
```

별도 비수집 검증 스크립트가 존재한다면 함께 실행한다.

```bash
npm run verify:no-auto-capture
```

---

## 4. PostgreSQL MCP 검증

Query API 호출 전 `capture_logs` 개수를 확인한다.

아래 요청을 여러 번 호출한다.

```text
GET /health
GET /api/captures
GET /api/captures/:id
```

호출 후 다시 개수를 확인한다.

완료 조건:

```text
호출 전 Capture Log 개수
=
호출 후 Capture Log 개수
```

Query API 응답과 PostgreSQL 데이터가 일치하는지도 확인한다.

---

## 5. Frontend Build 및 TypeScript 검사

```bash
cd frontend
npm run build
npx tsc --noEmit
```

Lint 명령이 정의되어 있다면 함께 실행한다.

---

## 6. 브라우저 회귀 검증

Backend와 Frontend를 실행한다.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Playwright MCP 또는 브라우저에서 아래를 확인한다.

* 목록 화면 렌더링
* Network에서 `GET /api/captures` 응답 `200`
* 목록 데이터 표시
* 상세 화면 이동
* Network에서 `GET /api/captures/:id` 응답 `200`
* 상세 데이터 표시
* 상세 화면 새로고침
* 존재하지 않는 ID의 404 화면
* Backend 중단 시 API 실패 화면
* 정상 흐름에서 Console Error 없음
* 목록 및 상세 접근 전후 DB 개수 증가 없음

---

# 작업 완료 후 문서 반영

반드시 아래 문서를 확인하고 필요한 부분을 업데이트한다.

* `L2_api_spec.md`
* `L4_progress.md`
* API 경로를 참조하는 테스트 문서
* API 경로를 참조하는 검증 스크립트

`L4_progress.md`에는 아래 상태를 반영한다.

```text
STEP 9 Query API 분리 → 완료
STEP 10 Proxy Core 구현 → 진행 예정
```

---

# 작업 완료 후 절차

아래 절차를 따른다.

* Notion Development History 업데이트
* `L4_progress.md` 업데이트
* `JournalGuide.md` 기준 Journal 작성
* `EndTask.md` 기준 Git 변경사항 검토
* 적절한 Conventional Commit 메시지 선정
* Git Commit
* Git Push
* 작업 결과 보고

---

# 이번 작업에서 제외

이번 작업에서는 아래 기능을 구현하지 않는다.

* Proxy API
* Target Application 요청 전달
* Target Application 응답 수신
* Target URL Header 처리
* Proxy Timeout
* `502 Bad Gateway`
* `504 Gateway Timeout`
* CaptureLog DB 스키마 변경
* `sourceService` 필드 추가
* `targetUrl` 필드 추가
* `responseHeaders` 필드 추가
* Capture 저장 방식 변경
* Frontend 화면 URL 변경
* UI 디자인 수정
* 검색
* 필터
* 페이징
* 정렬 기능 추가
* 요청 재실행
* Spring 연동
* Node 연동
* Target Service 매핑
* AI 기능

---

# 다음 작업

이번 작업 완료 후 다음 작업으로 아래 항목 하나만 진행한다.

> `POST /proxy`를 통해 Source Application의 요청을 Target Application으로 전달하고, Target 응답을 Source Application에 반환하는 Proxy Core를 구현한다.

다음 작업에서는 Proxy Core 정상 흐름만 구현하고, Connection refused 및 Timeout 등 상세 오류 처리는 별도 단계로 분리한다.

---

# 참고 문서

작업 시작 전 반드시 아래 문서를 확인한다.

* `AGENT.md`
* `StartTask.md`
* `EndTask.md`
* `JournalGuide.md`
* `L1_coding_rules.md`
* `L1_mvp_scope.md`
* `L2_architecture.md`
* `L2_entity_model.md`
* `L2_api_spec.md`
* `L3_test_strategy.md`
* `L4_progress.md`

현재는 기존 Capture 조회 기능을 Query 전용 API로 분리하고 Frontend 호출 경로를 변경하는 작업에만 집중한다.
