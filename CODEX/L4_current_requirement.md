# L4_current_requirement.md

# 현재 작업 지시

## 현재 프로젝트 상태

이전 작업에서 아래 기능까지 완료되었다.

- Express.js + TypeScript Backend 프로젝트 구성
- PostgreSQL 연결
- HTTP Capture Middleware 구현
- Capture Log 저장
- Capture Log 조회 API
- React + Vite + TypeScript Frontend 프로젝트 구성
- Capture Log 목록 조회 화면 구현
- 로딩 / 빈 목록 / 오류 상태 처리
- Playwright MCP 브라우저 검증 완료

현재 구현된 API는 다음과 같다.

```txt
GET /capture-logs
GET /capture-logs/:id
```

이번 작업에서는 Backend API를 변경하지 않는다.

---

# 현재 목표

FlowTool MVP를 다음 단계로 진행한다.

이미 구현된 Capture Log 목록 화면에서 하나의 Capture Log를 선택하면,
상세 정보를 확인할 수 있는 화면을 구현한다.

이번 작업에서는 UI 디자인보다
데이터 확인이 가능한 최소 기능 구현을 목표로 한다.

---

# Sprint Goal

이번 작업에서는 아래 흐름만 완성한다.

```txt
Capture Log 목록

↓

항목 선택

↓

GET /capture-logs/:id 호출

↓

Capture Log 상세 화면 표시
```

새로운 기능은 추가하지 않는다.

---

# 이번 작업 범위

이번 작업에서는 아래 항목만 구현한다.

- Capture Log 상세 화면 생성
- React Router를 이용한 상세 페이지 라우팅
- GET /capture-logs/:id API 연동
- 목록 화면에서 상세 화면 이동
- 상세 데이터 표시
- 로딩 상태 처리
- API 실패 상태 처리
- 존재하지 않는 Capture Log(404) 처리
- 브라우저 검증

이번 작업에서는 Backend 수정을 하지 않는다.

---

# 구현 대상

## 목록 화면

현재 목록에서 행(Row) 또는 상세보기 버튼을 클릭하면
상세 화면으로 이동한다.

예시

```txt
/capture/15
```

또는 현재 프로젝트 라우팅 규칙을 따른다.

---

## 상세 화면

현재 API 응답을 그대로 표시한다.

최소 표시 항목

기본 정보

- Method
- Path
- Query
- Response Status
- Duration
- Created At

Request 정보

- Request Headers
- Request Body

Response 정보

- Response Body

Error 정보

- Error Message

Backend 응답 구조를 우선으로 한다.

---

# 화면 상태 처리

## 로딩

예시

```txt
Loading capture log...
```

---

## 조회 실패

API 요청 실패 시

```txt
Failed to load capture log.
```

를 표시한다.

---

## 존재하지 않는 Capture Log

404 응답인 경우

```txt
Capture Log not found.
```

를 표시한다.

오류 스택이나 내부 정보를 화면에 출력하지 않는다.

---

# 최소 UI 원칙

이번 작업에서는 디자인을 구현하지 않는다.

허용 범위

- 제목
- 카드 또는 단순 Section
- JSON 문자열 또는 pre 태그 출력
- 최소 CSS

디자인 시스템이나 컴포넌트 라이브러리는 도입하지 않는다.

---

# 완료 기준

아래 조건을 모두 만족하면 완료로 판단한다.

- 상세 화면이 생성된다.
- 목록에서 상세 화면으로 이동할 수 있다.
- GET /capture-logs/:id API가 호출된다.
- Method가 표시된다.
- Path가 표시된다.
- Query가 표시된다.
- Request Headers가 표시된다.
- Request Body가 표시된다.
- Response Body가 표시된다.
- Response Status가 표시된다.
- Duration이 표시된다.
- Error Message가 표시된다.
- Created At이 표시된다.
- 로딩 상태가 동작한다.
- 404 상태가 처리된다.
- API 실패 상태가 처리된다.
- Frontend Build 성공
- TypeScript Error 없음
- IDE Problems(Error) 없음

---

# 검증 방법

## Backend 실행

```bash
cd backend
npm run dev
```

---

## 테스트 데이터 준비

```bash
npm run verify:capture-logs
```

---

## Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

---

## 브라우저 검증

아래 항목을 확인한다.

- 목록 화면 진입
- Capture Log 선택
- 상세 화면 이동
- API 호출 확인
- 모든 상세 정보 표시
- 새로고침 후 동일 데이터 조회
- 존재하지 않는 ID 접근 시 404 화면 확인

예시

```txt
/capture/999999
```

---

## HTTPie 검증

정상 조회

```bash
http GET :3000/capture-logs/1
```

존재하지 않는 데이터

```bash
http GET :3000/capture-logs/999999
```

API 응답과 화면 표시가 일치하는지 확인한다.

---

## 빌드 및 정적 검증

```bash
cd frontend

npm run build

npx tsc --noEmit
```

프로젝트에 lint가 존재하면 함께 실행한다.

IDE Problems(Error)가 남아 있으면 작업 완료로 간주하지 않는다.

---

# 작업 완료 후

반드시 아래 항목을 수행한다.

- Notion Development History 업데이트
- L4_progress.md 업데이트
- JournalGuide.md 기준 Journal 작성
- EndTask.md 기준 Git Commit 및 Push
- 작업 결과 보고

Progress에는 아래 상태를 반영한다.

- STEP 7 Capture 상세 화면 → 완료

---

# 이번 작업에서 제외

이번 작업에서는 구현하지 않는다.

- Capture 대상 분리
- 검색
- 필터
- 페이징
- 삭제
- 수정
- 자동 새로고침
- AI 기능
- Spring Starter
- Node SDK
- OpenTelemetry
- Dashboard 리디자인
- Figma 기반 UI 적용

---

# 다음 작업

이번 작업 완료 후 다음 작업은 아래 하나만 진행한다.

> FlowTool 내부 관리 API를 Capture 대상에서 제외하여 Dashboard 조회 요청과 실제 Capture 데이터를 분리한다.

---

# 참고 문서

작업 시작 전 반드시 아래 문서를 확인한다.

- AGENT.md
- StartTask.md
- EndTask.md
- L1_coding_rules.md
- L1_mvp_scope.md
- L2_architecture.md
- L2_api_spec.md
- L3_test_strategy.md
- L4_progress.md

현재는 Capture Log 상세 화면 구현에만 집중한다.