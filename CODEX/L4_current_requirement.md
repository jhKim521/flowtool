# L4_current_requirement.md

# 현재 작업 지시

## 현재 프로젝트 상태

현재 FlowTool은 아래 기능까지 구현되어 있다.

### Backend

* Express.js + TypeScript 프로젝트 구성
* PostgreSQL 연결
* CaptureLog 모델 및 `capture_logs` 테이블 구성
* HTTP 요청/응답 Capture Middleware 구현
* Capture Log 저장 기능 구현
* Capture Log 목록 조회 API 구현
* Capture Log 상세 조회 API 구현
* 자동 검증 스크립트 구현

현재 조회 API는 아래 경로를 사용한다.

```text
GET /capture-logs
GET /capture-logs/:id
```

### Frontend

* React + Vite + TypeScript 프로젝트 구성
* Capture Log 목록 화면 구현
* Capture Log 상세 화면 구현
* 로딩, 빈 목록, 404, API 실패 상태 처리
* Playwright MCP 검증 완료

### 아키텍처 변경

FlowTool의 구조를 기존 전역 Capture Middleware 방식에서 Proxy 중심 구조로 변경하기로 결정했다.

최종적으로 FlowTool은 아래 책임을 가진다.

```text
Proxy
- Source Application 요청 수신
- Target Application으로 요청 전달
- Target Application 응답 수신
- Source Application에 응답 반환

Capture
- Proxy가 실제로 중계한 요청과 응답 저장

Query
- 저장된 Capture Log 목록 및 상세 조회
```

이번 작업에서는 Proxy 기능을 구현하지 않는다.

---

# 현재 목표

기존 Express 전역 Capture Middleware 구조를 제거하고, Capture Log 저장 기능을 명시적으로 호출할 수 있는 Capture Service 구조로 분리한다.

현재는 FlowTool Backend에 들어오는 모든 요청이 Capture Middleware를 통과하므로 아래 요청도 Capture Log로 저장된다.

```text
GET /health
GET /capture-logs
GET /capture-logs/:id
Frontend 조회 요청
```

이번 작업 이후에는 FlowTool 내부 관리 및 조회 요청이 자동으로 Capture Log에 저장되지 않아야 한다.

Capture 저장은 이후 Proxy Service가 요청·응답 데이터를 전달했을 때만 명시적으로 수행할 수 있는 구조여야 한다.

---

# Sprint Goal

이번 작업에서는 아래 구조 전환만 완료한다.

```text
기존

Express 전역 요청
    ↓
Capture Middleware
    ↓
Capture Log 자동 저장
```

```text
변경

Proxy Service
    ↓ 명시적 저장 요청
Capture Service
    ↓
CaptureLog Repository
    ↓
PostgreSQL
```

현재는 Proxy Service가 아직 없으므로, Capture Service를 독립된 저장 책임으로 구성하고 검증 코드에서 직접 호출하여 저장 기능을 확인한다.

---

# 이번 작업 범위

이번 작업에서는 아래 항목만 구현한다.

* Express 애플리케이션의 전역 Capture Middleware 적용 제거
* 기존 Capture 저장 로직 분석
* Capture Log 저장 기능을 독립적인 Capture Service로 정리
* Capture Service가 저장에 필요한 데이터를 명시적으로 전달받도록 수정
* Capture Service와 CaptureLog Repository의 책임 정리
* FlowTool 내부 API 요청 자동 저장 중단
* Capture Service 직접 호출 기반 저장 검증 추가 또는 기존 검증 스크립트 수정
* 기존 Query API 정상 동작 확인
* 기존 Frontend 목록·상세 화면 회귀 검증
* PostgreSQL MCP 저장 결과 검증

---

# Capture Service 책임

Capture Service는 Proxy가 전달한 요청과 응답 정보를 하나의 Capture Log로 저장하는 내부 서비스다.

Capture Service는 Express의 `Request`, `Response` 객체에 직접 의존하지 않는다.

아래와 같은 순수 데이터 객체를 전달받아야 한다.

```ts
interface CreateCaptureInput {
  sourceService?: string | null;
  targetUrl?: string | null;
  method: string;
  path: string;
  query?: unknown;
  requestHeaders?: unknown;
  requestBody?: unknown;
  responseHeaders?: unknown;
  responseBody?: unknown;
  responseStatus?: number | null;
  durationMs: number;
  errorMessage?: string | null;
}
```

현재 DB 모델에 아직 존재하지 않는 필드는 이번 작업에서 무리하게 추가하지 않아도 된다.

`sourceService`, `targetUrl`, `responseHeaders` 등 Proxy 전용 필드 추가가 스키마 변경을 요구한다면 다음 Proxy 데이터 모델 반영 단계로 미룬다.

이번 작업의 핵심은 아래와 같다.

> Express 요청 객체에서 자동 수집하여 저장하는 구조를 제거하고, 명시적인 입력값을 받아 저장하는 구조로 전환한다.

---

# Capture Service가 해야 하는 일

* 저장 입력값 수신
* CaptureLog 모델 또는 Repository 입력 형식으로 변환
* CaptureLog Repository 호출
* 저장 결과 반환
* 필요한 최소한의 저장 예외 처리

---

# Capture Service가 하지 않는 일

* Target Application으로 HTTP 요청 전달
* Target URL 검증
* HTTP Method별 Proxy 처리
* 목록 조회
* 상세 조회
* Frontend 응답 생성
* Express `Request`, `Response` 객체 직접 처리
* Query API 호출 자동 Capture

---

# 전역 Capture Middleware 처리 원칙

현재 `app.ts` 또는 관련 설정에서 아래와 유사하게 등록된 전역 Middleware를 확인한다.

```ts
app.use(captureMiddleware);
```

전역 적용을 제거한다.

Capture Middleware가 더 이상 사용되지 않는다면 이번 작업에서 삭제할 수 있다.

다만 삭제 전 아래를 확인한다.

* 저장 로직 중 Capture Service에서 재사용해야 하는 코드가 있는지
* Response Body 수집 관련 유틸리티가 이후 Proxy 구현에 활용 가능한지
* 타입 또는 테스트 코드에서 참조하고 있는지

사용되지 않는 코드를 단순히 `legacy`, `deprecated`, 주석 처리 상태로 남기지 않는다.

필요한 로직은 Capture Service 또는 적절한 유틸리티로 이동하고, 불필요한 코드는 제거한다.

Git 이력을 통해 기존 구현을 확인할 수 있으므로 사용되지 않는 코드를 보존할 필요는 없다.

---

# 기존 Query 기능 유지

이번 작업에서는 기존 Query API 경로를 변경하지 않는다.

아래 API는 현재와 동일하게 유지한다.

```text
GET /capture-logs
GET /capture-logs/:id
```

Query API를 아래 경로로 변경하는 작업은 STEP 9에서 수행한다.

```text
GET /api/captures
GET /api/captures/:id
```

이번 작업에서는 기존 목록 및 상세 조회 기능이 깨지지 않는지만 검증한다.

---

# 저장 검증 방식

기존 검증 스크립트가 테스트 API 요청을 발생시킨 뒤 Capture Middleware가 자동 저장하는 방식이라면 현재 아키텍처와 맞지 않는다.

검증 스크립트를 아래 방식으로 변경한다.

```text
Capture Service 직접 호출
    ↓
Capture Log 저장
    ↓
Repository 또는 Query API 조회
    ↓
저장 결과 비교
```

검증 스크립트에서 HTTP 요청을 통해 저장해야 한다면 테스트 전용 API를 새로 만들지 않는다.

이번 단계에서는 Capture Service를 호출하는 Backend 내부 검증 스크립트를 우선한다.

테스트 전용 API 추가는 MVP 범위 확장이므로 금지한다.

---

# 완료 기준

아래 조건을 모두 만족하면 이번 작업은 완료로 판단한다.

## 구조

* Express 전역 Capture Middleware 적용이 제거된다.
* Capture Log 저장 기능이 독립적인 Capture Service로 구성된다.
* Capture Service가 Express `Request`, `Response` 객체에 직접 의존하지 않는다.
* Capture Service가 명시적인 입력값으로 Capture Log를 저장한다.
* Capture Service와 Query Service의 책임이 구분된다.
* 사용되지 않는 Capture Middleware 코드가 정리된다.

## 동작

* Capture Service 직접 호출 시 Capture Log가 PostgreSQL에 저장된다.
* 저장된 데이터가 기존 Query API에서 조회된다.
* `GET /health` 호출로 Capture Log가 추가되지 않는다.
* `GET /capture-logs` 호출로 Capture Log가 추가되지 않는다.
* `GET /capture-logs/:id` 호출로 Capture Log가 추가되지 않는다.
* Frontend 목록 화면 새로고침으로 Capture Log가 추가되지 않는다.
* Frontend 상세 화면 접근으로 Capture Log가 추가되지 않는다.
* 기존 목록 조회 API가 정상 동작한다.
* 기존 상세 조회 API가 정상 동작한다.
* 존재하지 않는 ID의 404 처리가 정상 동작한다.

## 품질

* `npm run build` 성공
* `npx tsc --noEmit` 성공
* 관련 검증 스크립트 성공
* Deprecated 설정 경고 없음
* IDE Problems 기준 Error 없음
* 불필요한 코드 및 import 없음

---

# 검증 방법

## 1. Backend Build 및 TypeScript 검증

```bash
cd backend
npm run build
npx tsc --noEmit
```

---

## 2. Capture 저장 검증

Capture Service를 직접 호출하는 검증 스크립트를 실행한다.

기존 스크립트를 수정했다면 실제 명령을 작업 결과에 명시한다.

예시:

```bash
npm run verify:capture-storage
```

검증 항목:

* 저장 전 Capture Log 개수 확인
* Capture Service 직접 호출
* 저장 후 Capture Log 개수가 정확히 1건 증가
* 입력한 Method, Path, Body, Status, Duration이 DB 값과 일치
* Query API에서 저장된 데이터 조회 가능

---

## 3. 내부 API 비수집 검증

아래 API를 각각 호출한다.

```bash
http GET :3000/health
http GET :3000/capture-logs
http GET :3000/capture-logs/{existingId}
```

호출 전후 `capture_logs` 개수를 비교한다.

아래 조건을 만족해야 한다.

```text
호출 전 개수 = 호출 후 개수
```

PostgreSQL MCP를 이용해 실제 DB 결과를 확인한다.

---

## 4. Frontend 회귀 검증

Backend 실행:

```bash
cd backend
npm run dev
```

Frontend 실행:

```bash
cd frontend
npm run dev
```

브라우저에서 아래를 확인한다.

* 목록 화면 정상 표시
* 목록 새로고침 정상 동작
* 상세 화면 정상 이동
* 상세 화면 새로고침 정상 동작
* 404 상태 정상 처리
* Console Error 없음
* 화면 접근 전후 Capture Log 개수 변화 없음

필요한 경우 Playwright MCP를 사용한다.

---

## 5. PostgreSQL MCP 검증

아래 내용을 검증한다.

* Capture Service가 저장한 데이터 존재
* 저장 데이터가 입력값과 일치
* Health Check 호출로 데이터가 추가되지 않음
* Query API 호출로 데이터가 추가되지 않음
* Frontend 목록 및 상세 조회로 데이터가 추가되지 않음

---

# 작업 완료 후 문서 반영

반드시 아래 문서를 업데이트한다.

* `L4_progress.md`
* 필요한 경우 `handoff.md`
* 검증 명령이 변경되었다면 관련 테스트 문서

`L4_progress.md`에는 아래 상태를 반영한다.

```text
STEP 8 Capture 저장 책임 분리 → 완료
STEP 9 Query API 분리 → 진행 예정
```

---

# 작업 완료 후 절차

아래 절차를 따른다.

* Notion Development History 업데이트
* `L4_progress.md` 업데이트
* `JournalGuide.md` 기준 Journal 작성
* `EndTask.md` 기준 Git 변경사항 확인
* Conventional Commit 메시지 선정
* Git Commit
* Git Push
* 작업 결과 보고

---

# 이번 작업에서 제외

이번 작업에서는 아래 기능을 구현하지 않는다.

* Proxy API
* Target Application으로 HTTP 요청 전달
* Target Application 응답 수신
* Target URL Header 처리
* Proxy Timeout
* `502 Bad Gateway`
* `504 Gateway Timeout`
* Query API 경로 변경
* Frontend API 경로 변경
* DB 스키마 확장
* `sourceService` 필드 추가
* `targetUrl` 필드 추가
* `responseHeaders` 필드 추가
* Spring 연동
* Node 연동
* Target Service 매핑
* 검색
* 필터
* 페이징
* UI 디자인 변경
* AI 기능

---

# 다음 작업

이번 작업이 완료되면 다음 작업으로 아래 항목 하나만 진행한다.

> 기존 Capture 목록·상세 조회 기능을 Query 전용 API인 `GET /api/captures`, `GET /api/captures/:id`로 분리하고 Frontend 호출 경로를 변경한다.

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
* `handoff.md`
* `L4_progress.md`

현재는 기존 전역 Capture Middleware를 제거하고 Capture 저장 책임을 독립시키는 작업에만 집중한다.
