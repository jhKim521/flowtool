
# entity_model.md

# FlowTool 엔티티 모델

이 문서는 FlowTool MVP 단계에서 사용하는 데이터 모델을 정의한다.

현재 MVP에서는 복잡한 Trace/Step 구조보다 **Proxy를 통해 중계된 HTTP 요청과 응답을 하나의 Capture Log로 저장하는 단순 구조**를 우선한다.

---

# 핵심 엔티티

## CaptureLog

### 설명

하나의 Proxy 중계 요청과 Target Application의 응답 기록을 의미한다.

FlowTool Proxy가 Source Application의 요청을 Target Application으로 전달하고, Target Application의 응답을 받은 뒤 요청과 응답 정보를 하나의 CaptureLog로 저장한다.

CaptureLog는 `/proxy` 요청 자체가 아니라, Target Application으로 전달된 실제 요청을 기준으로 저장한다.

---

## 필드

| 필드명             | 타입                   | DB 컬럼            | 설명                        |
| --------------- | -------------------- | ---------------- | ------------------------- |
| id              | number               | id               | PK                        |
| sourceService   | string / null        | source_service   | 요청을 보낸 Source Application |
| targetUrl       | string               | target_url       | 실제 요청이 전달된 Target URL     |
| method          | string               | method           | Target 요청 HTTP Method     |
| path            | string               | path             | Target 요청 Path            |
| query           | object / json        | query            | Target 요청 Query Parameter |
| requestHeaders  | object / json        | request_headers  | Target 요청 Header          |
| requestBody     | object / json / text | request_body     | Target 요청 Body            |
| responseHeaders | object / json        | response_headers | Target 응답 Header          |
| responseBody    | object / json / text | response_body    | Target 응답 Body            |
| responseStatus  | number / null        | response_status  | Target 응답 HTTP Status     |
| durationMs      | number               | duration_ms      | Proxy 중계 처리 시간            |
| errorMessage    | string / null        | error_message    | Proxy 전달 실패 메시지           |
| createdAt       | Date                 | created_at       | Capture Log 저장 시간         |

---

# 테이블 구조

## capture_logs

```txt
capture_logs
├── id
├── source_service
├── target_url
├── method
├── path
├── query
├── request_headers
├── request_body
├── response_headers
├── response_body
├── response_status
├── duration_ms
├── error_message
└── created_at
```

기존 DB 컬럼명이 `status_code` 또는 `response_status` 중 하나로 이미 구현되어 있다면, 실제 구현과 문서가 일치하도록 하나로 통일한다.

신규 설계에서는 `response_status` 사용을 권장한다.

---

# 요청과 응답 기준

## 요청 정보

CaptureLog의 요청 정보는 Source Application이 FlowTool에 보낸 `/proxy` 요청 형식이 아니라, Target Application에 실제로 전달된 요청을 기준으로 한다.

예시

```text
FlowTool 요청 경로
/proxy

실제 저장 Path
/ai/jobs
```

Target URL 전체는 `target_url`에 저장한다.

---

## 응답 정보

Target Application이 HTTP 응답을 반환한 경우 아래 항목을 저장한다.

* Response Status
* Response Header
* Response Body
* Processing Time

Target Application이 `4xx` 또는 `5xx`를 반환하더라도 정상적인 HTTP 응답으로 저장한다.

---

## Proxy 전달 실패

Target Application에 연결하지 못하거나 Timeout이 발생한 경우 다음과 같이 저장한다.

```text
response_status = null
response_headers = null 또는 빈 객체
response_body = null
error_message = Proxy 실패 원인
```

FlowTool 내부 StackTrace 전체를 저장하거나 외부에 노출하지 않는다.

---

# 상태 판단 기준

CaptureLog의 성공과 실패는 별도 Status Enum을 두지 않고 아래 정보를 기준으로 판단한다.

```txt
response_status < 400
→ Target 요청 성공

response_status >= 400
→ Target Application 오류 응답

response_status IS NULL AND error_message IS NOT NULL
→ Proxy 전달 실패
```

MVP 단계에서는 별도의 `SUCCESS`, `TARGET_ERROR`, `PROXY_ERROR` Enum을 만들지 않는다.

필요성이 확인되면 이후 추가한다.

---

# 저장 전략

MVP 단계에서는 빠른 검증과 조회 가능성을 우선한다.

원칙

* 하나의 Proxy 중계 요청은 하나의 CaptureLog로 저장한다.
* Request/Response 데이터는 가능한 원본에 가깝게 저장한다.
* Query API와 Health Check 요청은 저장하지 않는다.
* `/proxy` 요청 자체가 아니라 Target 요청 정보를 저장한다.
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
* TargetService
* TraceCompare
* TraceMetric

Target Service 매핑이 필요해지면 별도 엔티티 추가를 검토한다.

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

* Target Service 등록 및 URL 매핑
* 요청 내부 단계별 Trace 저장
* 성공/실패 요청 비교
* Runtime Log 수집
* Error StackTrace 저장
* 사용자별 프로젝트 관리
* 팀 단위 공유
* 요청 재실행

---

# 설계 원칙

* MVP 단계에서는 단순 구조를 우선한다.
* Proxy, Capture, Query 책임을 분리한다.
* 빠르게 저장하고 조회할 수 있어야 한다.
* 실제 Target 요청 흐름을 추적할 수 있어야 한다.
* API 명세와 DB 구조가 일치해야 한다.
* 구현과 검증이 쉬운 구조를 우선한다.