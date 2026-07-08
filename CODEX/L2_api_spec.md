# api_spec.md

# FlowTool API 명세

이 문서는 **현재 MVP 단계에서 구현 대상인 API**를 정의한다.

현재 API는 HTTP 요청 및 응답 흐름을 조회하기 위한 기능만 제공한다.

HTTP Capture Middleware가 요청 및 응답을 자동으로 저장하므로, 별도의 저장 API는 제공하지 않는다.

---

# 공통 응답 형식

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

# Capture API

## Capture 목록 조회

HTTP Capture 목록을 조회한다.

### Endpoint

```http
GET /api/captures
```

### Query Parameter

| 이름     | 타입     | 설명                  |
| ------ | ------ | ------------------- |
| page   | number | 페이지 번호              |
| size   | number | 페이지 크기              |
| method | string | HTTP Method 필터      |
| status | number | HTTP Status Code 필터 |

---

## Response 예시

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "method": "POST",
        "path": "/api/users",
        "statusCode": 200,
        "durationMs": 48,
        "createdAt": "2026-07-08T14:30:15"
      }
    ]
  },
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
    "method": "POST",
    "path": "/api/users",
    "requestHeaders": {},
    "requestBody": {},
    "responseHeaders": {},
    "responseBody": {},
    "statusCode": 200,
    "durationMs": 48,
    "errorMessage": null,
    "createdAt": "2026-07-08T14:30:15"
  },
  "failResponse": null
}
```

---

## 실패 요청 조회

실패한 Capture Log만 조회한다.

### Endpoint

```http
GET /api/captures/errors
```

### Response

Capture 목록 조회와 동일한 형식을 사용한다.

---

# System API

## Health Check

애플리케이션 실행 상태를 확인한다.

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

| 상태 코드 | 설명       |
| ----- | -------- |
| 200   | 성공       |
| 201   | 생성 성공    |
| 400   | 잘못된 요청   |
| 404   | 데이터 없음   |
| 500   | 서버 내부 오류 |

---

# Error Code

| 코드                | 설명                   |
| ----------------- | -------------------- |
| CAPTURE_NOT_FOUND | Capture Log를 찾을 수 없음 |
| INVALID_REQUEST   | 잘못된 요청               |
| INTERNAL_ERROR    | 서버 내부 오류             |

---

# 현재 MVP 구현 대상 API

현재 MVP에서 구현하는 API는 아래와 같다.

| Method | Endpoint                  | 설명            |
| ------ | ------------------------- | ------------- |
| GET    | /api/captures             | Capture 목록 조회 |
| GET    | /api/captures/{captureId} | Capture 상세 조회 |
| GET    | /api/captures/errors      | 실패 요청 조회      |
| GET    | /health                   | 서버 상태 확인      |

---

# MVP 제외 API

현재는 아래 API를 구현하지 않는다.

* Capture 생성 API
* Capture 수정 API
* Capture 삭제 API
* 사용자 인증 API
* 사용자 관리 API
* AI 분석 API
* Trace 비교 API
* 요청 재실행 API

---

# API 설계 원칙

모든 API는 아래 원칙을 따른다.

* RESTful 스타일을 따른다.
* 응답 형식은 프로젝트 공통 응답 구조를 사용한다.
* HTTP Capture 데이터는 Middleware가 자동으로 저장한다.
* 조회 API를 중심으로 구현한다.
* MVP 범위를 벗어나는 API는 구현하지 않는다.
