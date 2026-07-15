# progress.md

# FlowTool MVP Roadmap

이 문서는 FlowTool MVP의 전체 개발 로드맵을 관리한다.

현재 프로젝트는 반드시 아래 순서대로 구현한다.

새로운 기능은 추가하지 않으며, 현재 Step이 완료되기 전에는 다음 Step으로 진행하지 않는다.

---

# 현재 프로젝트 상태

현재 단계

> **STEP 9 구현 및 자동 검증 완료 / 브라우저 MCP 회귀 검증 보류**

현재 목표

> **브라우저 MCP 로컬 접근 문제를 정리한 뒤 Proxy Core 정상 흐름을 구현한다.**

---

# MVP Roadmap

## STEP 1. Backend 프로젝트 초기 구성

### 목표

Express.js + TypeScript 기반 Backend 프로젝트를 생성한다.

### 완료 상태

⚠️ 구현 및 자동 검증 완료 / 브라우저 MCP 회귀 검증 보류

### 완료 내용

* `backend/` 프로젝트 생성
* Express.js 구성
* TypeScript 설정
* 기본 디렉터리 구조 생성

---

## STEP 2. 기존 Capture Middleware 구현

### 목표

FlowTool Backend에서 HTTP 요청과 응답을 Capture할 수 있는 초기 구조를 구현한다.

### 완료 상태

✅ 완료

### 완료 내용

* Capture Middleware 구현
* Request 정보 수집
* Response 정보 수집
* 처리 시간 계산

### 참고

이 단계는 초기 MVP 검증을 위한 구현이다.

현재 아키텍처가 Proxy 중심으로 변경됨에 따라, 이후 Step에서 전역 Capture Middleware 구조를 제거하고 Capture Service로 책임을 변경한다.

---

## STEP 3. Capture Log 저장

### 목표

Capture 데이터를 PostgreSQL에 저장하고 정상 동작을 검증한다.

### 완료 상태

✅ 완료

### 완료 내용

* PostgreSQL 연결
* CaptureLog 모델 구현
* Repository / Service 구현
* Capture Log 저장
* 테스트 API 작성
* 검증 스크립트 작성
* PostgreSQL MCP 저장 결과 확인 완료

---

## STEP 4. Capture Log 조회 API

### 목표

저장된 Capture Log를 조회할 수 있는 API를 구현한다.

### 완료 상태

✅ 완료

### 완료 내용

* `GET /capture-logs` 구현 완료
* `GET /capture-logs/:id` 구현 완료
* 최신순 조회 확인 완료
* 존재하지 않는 ID 예외 처리 확인 완료
* 자동 API 검증 스크립트 완료
* PostgreSQL MCP로 저장 데이터와 API 응답 비교 완료
* Repository 조회 기능 추가
* Service 조회 기능 추가
* Controller 구현
* Route 구현
* 공통 API 응답 형식 적용

### 참고

기존 조회 API 경로는 이후 Query API 분리 단계에서 아래와 같이 변경한다.

```text
GET /api/captures
GET /api/captures/:id
```

---

## STEP 5. Frontend 프로젝트 생성

### 목표

React + Vite + TypeScript 기반 Frontend 프로젝트를 `frontend/` 폴더 하위에 생성한다.

### 완료 상태

✅ 완료

### 완료 내용

* React + Vite + TypeScript 프로젝트 구성
* 기본 레이아웃 구성
* API 연결 준비
* Vite 환경 변수 예시 추가
* Vite dev proxy 구성
* Frontend Build 검증 완료

---

## STEP 6. Capture 목록 화면

### 목표

저장된 Capture Log 목록을 화면에서 확인할 수 있다.

### 완료 상태

✅ 완료

### 완료 내용

* 기존 `GET /capture-logs` API 연동
* Capture Log 목록 테이블 구현
* Method, Path, Response Status, Duration, Created At 표시
* 로딩 상태 처리
* 빈 목록 상태 처리
* API 실패 상태 처리
* 최신순 표시 확인
* 새로고침 시 재조회 확인
* Playwright MCP 브라우저 검증 완료

### 참고

Query API 분리 시 Frontend 호출 경로를 `GET /api/captures`로 변경한다.

---

## STEP 7. Capture 상세 화면

### 목표

Capture 한 건의 상세 정보를 확인할 수 있다.

### 완료 상태

✅ 완료

### 완료 내용

* React Router 기반 `/capture/:id` 라우팅 추가
* 기존 `GET /capture-logs/:id` API 연동
* 목록 화면 상세 이동 링크 추가
* Method 표시
* Path 표시
* Query 표시
* Request Headers 표시
* Request Body 표시
* Response Body 표시
* Response Status 표시
* Duration 표시
* Error Message 표시
* Created At 표시
* 로딩 상태 처리
* 404 상태 처리
* API 실패 상태 처리
* 새로고침 후 동일 상세 데이터 재조회 확인
* Playwright MCP 브라우저 검증 완료

### 참고

Query API 분리 시 상세 API 호출 경로를 `GET /api/captures/:id`로 변경한다.

---

## STEP 8. Capture 저장 책임 분리

### 목표

기존 전역 Capture Middleware 구조를 제거하고, Proxy가 중계한 요청과 응답만 저장할 수 있도록 Capture 저장 책임을 독립시킨다.

### 완료 상태

✅ 완료

### 완료 조건

* Express 전역 Capture Middleware 적용 제거
* FlowTool 내부 API 요청 자동 저장 중단
* Capture 저장 기능을 명시적인 Service 호출 구조로 변경
* Capture Service와 Repository 책임 정리
* 기존 DB 저장 기능 유지
* Query API와 Health Check 호출 시 Capture Log가 추가되지 않음
* Backend Build 및 TypeScript 검증 성공
* PostgreSQL MCP 저장 결과 검증

### 완료 내용

* Express 전역 Capture Middleware 적용 제거
* Capture Middleware 파일 삭제
* Capture Service 직접 호출 기반 저장 구조 정리
* Capture Service 입력값 기본값 정규화 추가
* Capture Log count 조회 기능 추가
* `verify:capture`를 Capture Service 직접 저장 검증으로 변경
* `verify:capture-logs`를 직접 저장 데이터 기반 Query API 회귀 검증으로 변경
* `verify:no-auto-capture` 추가
* `/health`, `/capture-logs`, `/capture-logs/:id`, 404 조회 호출 시 Capture Log count 불변 확인
* Frontend 목록 및 상세 화면 회귀 검증 완료

---

## STEP 9. Query API 분리

### 목표

기존 Capture 조회 기능을 Query 전용 API로 변경한다.

### 완료 조건

* `GET /api/captures` 구현
* `GET /api/captures/:id` 구현
* 기존 Query Controller/Service 책임 정리
* Frontend 목록 API 경로 변경
* Frontend 상세 API 경로 변경
* 기존 목록 및 상세 화면 정상 동작
* Query 요청으로 Capture Log가 생성되지 않음
* 자동 검증 스크립트 수정
* Playwright MCP 회귀 검증 완료

### 완료 상태

✅ 완료

### 완료 내용

* 기존 `/capture-logs` 조회 Route 제거
* 신규 `GET /api/captures` Query API 구현
* 신규 `GET /api/captures/:id` Query API 구현
* `capture-query.routes.ts`, `capture-query.controller.ts`, `capture-query.service.ts` 추가
* Capture 저장 Service와 Query Service 책임 분리
* Frontend 목록 API 호출 경로를 `/api/captures`로 변경
* Frontend 상세 API 호출 경로를 `/api/captures/:id`로 변경
* Vite dev proxy를 `/api` 기준으로 변경
* `verify:capture-logs`를 신규 Query API 기준으로 수정
* `verify:no-auto-capture`를 신규 Query API 및 기존 404 경로 기준으로 수정
* Query API 호출 전후 Capture Log count 불변 검증 완료
* 기존 `/capture-logs`, `/capture-logs/:id` 404 검증 완료
* PostgreSQL MCP로 Capture Log count 및 최신 데이터 확인 완료
* Playwright MCP 및 Chrome DevTools MCP는 로컬 dev server 접근 제한으로 화면 회귀 검증 미완료

---

## STEP 10. Proxy Core 구현

### 목표

Source Application 요청을 Target Application으로 전달하고, Target 응답을 Source Application에 반환한다.

### 완료 조건

* Proxy API 구현
* Target URL 전달 방식 구현
* HTTP Method 전달
* Query Parameter 전달
* Request Header 전달
* Request Body 전달
* Target 응답 Status 수신
* Target 응답 Header 수신
* Target 응답 Body 수신
* Target 응답을 Source Application에 반환
* 중계 요청과 응답 Capture Log 저장
* 하나의 Proxy 요청당 하나의 Capture Log 생성
* Proxy 요청 자체가 별도 Capture Log로 중복 저장되지 않음

---

## STEP 11. Proxy 오류 처리

### 목표

Target Application 통신 실패를 구분하고 Capture Log로 저장한다.

### 완료 조건

* Target URL 누락 처리
* 잘못된 Target URL 처리
* Connection refused 처리
* Timeout 처리
* Target `4xx`, `5xx` 응답 그대로 반환
* 연결 실패 시 `502 Bad Gateway`
* Timeout 시 `504 Gateway Timeout`
* Proxy 오류 정보 Capture Log 저장
* 내부 StackTrace 외부 노출 방지

---

## STEP 12. Proxy 데이터 모델 및 화면 반영

### 목표

Proxy 중심 데이터 모델을 목록과 상세 화면에 반영한다.

### 완료 조건

* Source Service 표시
* Target URL 표시
* Response Header 표시
* Proxy 오류 표시
* 목록 및 상세 화면 기존 기능 유지
* API 응답과 화면 데이터 일치
* Playwright MCP 검증 완료

---

## STEP 13. UI 디자인 개선

### 목표

Figma AI 결과를 바탕으로 Dashboard UI를 개선한다.

### 범위

* 목록 화면 디자인
* 상세 화면 디자인
* 요청/응답 정보 가독성 개선
* 최소 반응형 대응

### 제외

* 새로운 Backend 기능
* 검색
* 통계
* 실시간 기능

---

## STEP 14. Spring 연동 모듈

### 목표

Spring Application에서 FlowTool Proxy를 쉽게 호출할 수 있는 연동 방식을 제공한다.

---

## STEP 15. Node 연동 모듈

### 목표

Node Application에서 FlowTool Proxy를 쉽게 호출할 수 있는 연동 방식을 제공한다.

---

## STEP 16. Target Service 매핑

### 목표

전체 Target URL을 매 요청마다 전달하지 않고 서비스 이름과 경로를 기준으로 중계할 수 있도록 한다.

예시

```text
node-bridge
→ http://localhost:4000
```

---

## STEP 17. 통합 자동 검증

### 목표

Proxy 요청, Capture 저장, Query 조회, Frontend 표시를 하나의 E2E 흐름으로 검증한다.


---

# 현재 우선순위

현재는 STEP 9 브라우저 회귀 검증 보류 상태를 먼저 정리한다.

브라우저 MCP 로컬 접근 문제가 정리되면 STEP 10으로 진행한다.

Proxy 오류 상세 처리는 STEP 11에서 구현한다.

다음 구현 단계에서는 Proxy Core 정상 흐름 구현에만 집중한다.

---

# 진행 원칙

항상 아래 순서를 따른다.

1. `progress.md`에서 현재 Step 확인
2. `current_requirement.md`로 오늘 작업 정의
3. 구현
4. Build, TypeScript, IDE Problems 검증
5. 필요한 MCP 검증
6. Notion Development History 기록
7. `L4_progress.md` 업데이트
8. Journal 작성
9. Git Commit 및 Push
10. 다음 Step 진행

---

# 프로젝트 목표

FlowTool MVP 목표는 아래 기능을 완성하는 것이다.

* Source Application 요청 수신
* Target Application으로 HTTP 요청 중계
* Target Application 응답 수신
* Source Application에 응답 반환
* Proxy 요청 및 응답 Capture 저장
* PostgreSQL 저장
* Query API 조회
* Dashboard 목록 및 상세 조회
* Proxy 오류 저장
* MCP 기반 검증

MVP 범위를 벗어나는 기능은 구현하지 않는다.
