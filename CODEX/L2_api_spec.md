# api_spec.md

# FlowTool API 명세

이 문서는 **현재 MVP 단계에서 구현 대상인 API**를 정의한다.

현재 API는 아래 세 가지 역할로 구분한다.

* Proxy API

  * Source Application의 요청을 Target Application으로 전달한다.
  * Target Application의 응답을 Source Application에 반환한다.
  * 중계한 요청과 응답을 Capture Log로 저장한다.
* Query API

  * 저장된 Capture Log를 조회한다.
* System API

  * FlowTool Backend의 실행 상태를 확인한다.

FlowTool Backend는 모든 요청을 자동으로 저장하지 않는다.

Capture Log는 Proxy API를 통해 실제로 중계된 요청과 응답만 저장한다.

---

# 공통 응답 형식

공통 응답 형식은 Query API와 System 내부 오류 응답에 적용한다.

Proxy API의 성공 응답은 Target Application의 상태 코드, Header, Body를 가능한 한 그대로 반환한다.

## 성공

```json
{
  "success": true,
  "data": {},
  "failResponse": null
}
```

---

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

---

# Proxy API

## HTTP 요청 중계

Source Application의 요청을 Target Application으로 전달한다.

FlowTool은 Target Application의 응답을 수신한 뒤 요청·응답 정보를 하나의 Capture Log로 저장하고, Target Application의 응답을 Source Application에 반환한다.

### Endpoint

```http
ANY /proxy
```

MVP 초기 구현에서는 우선 주요 HTTP Method를 지원한다.

* GET
* POST
* PUT
* PATCH
* DELETE

---

## Request Header

| 이름                        | 필수 | 설명                           |
| ------------------------- | -- | ---------------------------- |
| X-FlowTool-Target-Url     | 필수 | 실제 요청을 전달할 Target URL        |
| X-FlowTool-Source-Service | 선택 | 요청을 보낸 Source Application 이름 |
| Content-Type              | 선택 | 원본 요청의 Content-Type          |

예시

```http
POST /proxy
X-FlowTool-Target-Url: http://localhost:4000/ai/jobs
X-FlowTool-Source-Service: private-ai-spring
Content-Type: application/json
```

---

## Request Body

Request Body는 Target Application으로 전달할 원본 Body를 그대로 사용한다.

```json
{
  "jobId": 10,
  "prompt": "Summarize this task."
}
```

---

## 처리 흐름

```text
Source Application 요청
        ↓
Target URL 검증
        ↓
Target Application으로 요청 전달
        ↓
Target 응답 수신
        ↓
요청·응답 Capture Log 저장
        ↓
Target 응답을 Source Application에 반환
```

---

## 성공 응답

Target Application의 아래 정보를 가능한 한 그대로 반환한다.

* HTTP Status
* Response Header
* Response Body

필요한 경우 생성된 Capture Log의 ID를 응답 Header에 포함할 수 있다.

```http
X-FlowTool-Capture-Id: 100
```

Proxy 성공 응답에는 프로젝트 공통 Wrapper를 강제하지 않는다.

기존 Target API의 응답 계약을 유지하는 것을 우선한다.

---

## Target Application 오류 응답

Target Application이 `4xx` 또는 `5xx`를 반환한 경우에도 Target Application이 정상적으로 응답한 것으로 판단한다.

FlowTool은 다음을 수행한다.

* Target Status 저장
* Target Response Header 저장
* Target Response Body 저장
* 동일한 Status와 Body를 Source Application에 반환

---

## Proxy 전달 실패

아래 상황은 Proxy 전달 실패로 처리한다.

* Target URL 누락
* Target URL 형식 오류
* 연결 실패
* DNS 오류
* Connection refused
* Timeout

오류 예시

### 잘못된 요청

```http
400 Bad Request
```

```json
{
  "success": false,
  "data": null,
  "failResponse": {
    "code": "INVALID_PROXY_REQUEST",
    "message": "Proxy request is invalid."
  }
}
```

### Target 연결 실패

```http
502 Bad Gateway
```

```json
{
  "success": false,
  "data": null,
  "failResponse": {
    "code": "TARGET_CONNECTION_FAILED",
    "message": "Failed to connect to target application."
  }
}
```

### Target 응답 Timeout

```http
504 Gateway Timeout
```

```json
{
  "success": false,
  "data": null,
  "failResponse": {
    "code": "TARGET_TIMEOUT",
    "message": "Target application response timed out."
  }
}
```

Proxy 실패도 가능한 범위에서 Capture Log로 저장한다.

---

# Capture Query API

Query API는 Capture Log 조회만 담당한다.

Query API 요청 자체는 Capture Log로 저장하지 않는다.

## Capture 목록 조회

저장된 Capture Log 목록을 조회한다.

### Endpoint

```http
GET /api/captures
```

### Query Parameter

MVP 초기 단계에서는 페이지, 검색, 필터를 구현하지 않아도 된다.

추후 아래 항목을 추가할 수 있다.

| 이름            | 타입     | 설명                    |
| ------------- | ------ | --------------------- |
| page          | number | 페이지 번호                |
| size          | number | 페이지 크기                |
| method        | string | HTTP Method 필터        |
| status        | number | HTTP Status Code 필터   |
| sourceService | string | Source Application 필터 |

---

## Response 예시

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sourceService": "private-ai-spring",
      "targetUrl": "http://localhost:4000/ai/jobs",
      "method": "POST",
      "path": "/ai/jobs",
      "responseStatus": 200,
      "durationMs": 48,
      "createdAt": "2026-07-08T14:30:15"
    }
  ],
  "failResponse": null
}
```

---

## Capture 상세 조회

Capture Log 상세 정보를 조회한다.

### Endpoint

```http
GET /api/captures/{captureId}
```

---

## Response 예시

```json
{
  "success": true,
  "data": {
    "id": 1,
    "sourceService": "private-ai-spring",
    "targetUrl": "http://localhost:4000/ai/jobs",
    "method": "POST",
    "path": "/ai/jobs",
    "query": {},
    "requestHeaders": {},
    "requestBody": {},
    "responseHeaders": {},
    "responseBody": {},
    "responseStatus": 200,
    "durationMs": 48,
    "errorMessage": null,
    "createdAt": "2026-07-08T14:30:15"
  },
  "failResponse": null
}
```

---

# System API

## Health Check

FlowTool Backend의 실행 상태를 확인한다.

Health Check 요청은 Capture Log로 저장하지 않는다.

### Endpoint

```http
GET /health
```

### Response

```json
{
  "status": "UP"
}
```

---

# HTTP 상태 코드

| 상태 코드 | 설명                            |
| ----- | ----------------------------- |
| 200   | 성공                            |
| 201   | 생성 성공                         |
| 400   | 잘못된 요청                        |
| 404   | 데이터 없음                        |
| 502   | Target Application 연결 실패      |
| 504   | Target Application 응답 Timeout |
| 500   | FlowTool 서버 내부 오류             |

---

# Error Code

| 코드                       | 설명                            |
| ------------------------ | ----------------------------- |
| CAPTURE_NOT_FOUND        | Capture Log를 찾을 수 없음          |
| INVALID_PROXY_REQUEST    | Proxy 요청 형식이 잘못됨              |
| TARGET_URL_REQUIRED      | Target URL이 누락됨               |
| TARGET_CONNECTION_FAILED | Target Application 연결 실패      |
| TARGET_TIMEOUT           | Target Application 응답 Timeout |
| INVALID_REQUEST          | 잘못된 요청                        |
| INTERNAL_ERROR           | FlowTool 서버 내부 오류             |

---

# 현재 MVP 구현 대상 API

현재 MVP에서 구현하는 API는 아래와 같다.

| Method | Endpoint                  | 설명                      |
| ------ | ------------------------- | ----------------------- |
| ANY    | /proxy                    | HTTP 요청 중계 및 Capture 저장 |
| GET    | /api/captures             | Capture 목록 조회           |
| GET    | /api/captures/{captureId} | Capture 상세 조회           |
| GET    | /health                   | 서버 상태 확인                |

---

# MVP 제외 API

현재는 아래 API를 구현하지 않는다.

* Capture 직접 생성 API
* Capture 수정 API
* Capture 삭제 API
* 사용자 인증 API
* 사용자 관리 API
* AI 분석 API
* Trace 비교 API
* 요청 재실행 API
* Target Service 등록·관리 API

---

# API 설계 원칙

모든 API는 아래 원칙을 따른다.

* Proxy API와 Query API의 책임을 분리한다.
* Proxy API만 Capture Log를 생성한다.
* Query API와 Health Check 요청은 Capture하지 않는다.
* Proxy API는 Target Application의 응답 계약을 가능한 한 유지한다.
* Query API는 프로젝트 공통 응답 구조를 사용한다.
* MVP 범위를 벗어나는 API는 구현하지 않는다.

