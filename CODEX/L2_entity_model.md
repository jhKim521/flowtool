# entity_model.md

# FlowTool 엔티티 모델

이 문서는 FlowTool MVP 단계에서 사용하는 데이터 모델을 정의한다.

현재 MVP에서는 복잡한 Trace/Step 구조보다 **HTTP 요청과 응답을 하나의 Capture Log로 저장하는 단순 구조**를 우선한다.

---

# 핵심 엔티티

## CaptureLog

### 설명

하나의 HTTP 요청/응답 기록을 의미한다.

Express Capture Middleware가 요청 시작 시점과 응답 완료 시점을 기준으로 데이터를 수집하고, 하나의 CaptureLog로 저장한다.

---

## 필드

| 필드명             | 타입                   | DB 컬럼            | 설명               |
| --------------- | -------------------- | ---------------- | ---------------- |
| id              | number               | id               | PK               |
| method          | string               | method           | HTTP Method      |
| path            | string               | path             | 요청 Path          |
| query           | object / json        | query            | Query Parameter  |
| requestHeaders  | object / json        | request_headers  | Request Header   |
| requestBody     | object / json / text | request_body     | Request Body     |
| responseHeaders | object / json        | response_headers | Response Header  |
| responseBody    | object / json / text | response_body    | Response Body    |
| statusCode      | number               | status_code      | HTTP Status Code |
| durationMs      | number               | duration_ms      | 처리 시간            |
| errorMessage    | string / null        | error_message    | 오류 메시지           |
| createdAt       | Date                 | created_at       | 생성 시간            |

---

# 테이블 구조

## capture_logs

```txt
capture_logs
├── id
├── method
├── path
├── query
├── request_headers
├── request_body
├── response_headers
├── response_body
├── status_code
├── duration_ms
├── error_message
└── created_at
```

---

# 상태 판단 기준

CaptureLog의 성공/실패 여부는 별도 status 필드를 두지 않고 `status_code`를 기준으로 판단한다.

기준

```txt
status_code < 400  → 성공
status_code >= 400 → 실패
```

MVP 단계에서는 별도의 `SUCCESS`, `FAIL` enum을 만들지 않는다.

---

# 저장 전략

MVP 단계에서는 빠른 검증과 조회 가능성을 우선한다.

원칙

* 하나의 HTTP 요청은 하나의 CaptureLog로 저장한다.
* Request/Response 데이터는 가능한 원본에 가깝게 저장한다.
* 복잡한 정규화를 하지 않는다.
* JSON 데이터는 PostgreSQL JSONB 사용을 우선한다.
* 대용량 데이터 처리나 마스킹은 MVP 이후로 미룬다.

---

# 제외 엔티티

현재 MVP에서는 아래 엔티티를 만들지 않는다.

* Trace
* TraceStep
* TraceError
* RuntimeLog
* User
* Team
* TraceCompare
* TraceMetric

이 엔티티들은 MVP 이후 필요성이 확인되면 추가한다.

---

# 향후 확장 방향

MVP 이후 아래와 같은 구조로 확장할 수 있다.

```txt
CaptureLog
 ├── TraceStep
 ├── RuntimeLog
 ├── ErrorDetail
 └── CompareSnapshot
```

확장 예시

* 요청 내부 단계별 Trace 저장
* 성공/실패 요청 비교
* Runtime Log 수집
* Error StackTrace 저장
* 사용자별 프로젝트 관리
* 팀 단위 공유

---

# 설계 원칙

* MVP 단계에서는 단순 구조를 우선한다.
* 빠르게 저장하고 조회할 수 있어야 한다.
* 데이터 흐름을 추적할 수 있어야 한다.
* API 명세와 DB 구조가 일치해야 한다.
* 구현과 검증이 쉬운 구조를 우선한다.
