# architecture.md

# FlowTool 시스템 아키텍처

이 문서는 FlowTool의 전체 시스템 구조와 컴포넌트 간 데이터 흐름을 정의한다.

---

# 프로젝트 개요

FlowTool은 HTTP 요청과 응답을 중계하면서 저장하고, 개발자가 서비스 간 요청 흐름을 쉽게 확인할 수 있도록 지원하는 디버깅 도구이다.

현재는 MVP 단계이며, 핵심 목표는 **관측 대상 서비스 사이의 HTTP 요청과 응답을 Proxy 방식으로 중계하고 저장하는 구조를 완성하는 것**이다.

FlowTool은 단순히 전달받은 로그를 저장하는 Collector가 아니라, 실제 HTTP 통신 경로 중간에서 요청과 응답을 전달하는 Proxy 역할을 수행한다.

---

# 전체 시스템 구성

```text
┌────────────────────┐
│ Source Application │
│ Spring / Node      │
└─────────┬──────────┘
          │ HTTP Request
          ▼
┌────────────────────────────────┐
│ Express Backend                │
├────────────────────────────────┤
│ Proxy API                      │
│ Proxy Service                  │
│ Capture Service                │
│ Query API                      │
│ Repository                     │
└─────────┬───────────┬──────────┘
          │           │
          │           │ Forwarded Request
          │           ▼
          │   ┌────────────────────┐
          │   │ Target Application │
          │   │ Spring / Node      │
          │   └─────────┬──────────┘
          │             │ Target Response
          │             ▼
          │   Express Backend
          │
          ▼
┌────────────────┐
│ PostgreSQL DB  │
└───────┬────────┘
        │ Query
        ▼
┌────────────────────┐
│ React + Vite Front │
└────────────────────┘
```

---

# 시스템 구성 요소

## Source Application

역할

* 원래 Target Application으로 전송하려던 HTTP 요청을 FlowTool Proxy로 전송
* Target URL 또는 Target 식별 정보 전달
* FlowTool을 통해 Target Application의 응답 수신

예시

* Spring Backend
* Node.js Backend
* 로컬 개발 중인 테스트 애플리케이션

---

## Target Application

역할

* FlowTool이 전달한 실제 HTTP 요청 처리
* 처리 결과를 FlowTool에 응답
* FlowTool을 통해 Source Application에 최종 응답 전달

예시

* Node Bridge
* Spring API 서버
* 외부 또는 로컬 개발 서버

---

## Frontend

역할

* Capture 목록 조회
* Capture 상세 조회
* Proxy를 통해 전달된 요청/응답 데이터 확인
* 요청 실패 및 처리 시간 확인

기술

* React
* Vite
* TypeScript

Frontend는 FlowTool의 Query API만 사용한다.

Frontend의 조회 요청은 Capture 대상에 포함하지 않는다.

---

## Backend

역할

* Proxy 요청 수신
* Target Application으로 HTTP 요청 전달
* Target Application 응답 수신
* 요청 및 응답 Capture Log 저장
* Capture 조회 API 제공
* Proxy 및 Query 예외 처리

기술

* Node.js
* Express.js
* TypeScript

Backend는 아래 세 가지 책임으로 구분한다.

### Proxy

* Source Application의 요청 수신
* Target URL 확인
* Target Application으로 요청 전달
* Target Application 응답 수신
* 응답을 Source Application에 반환

### Capture

* Proxy가 중계한 원래 요청 정보 저장
* Target Application의 응답 정보 저장
* 처리 시간 및 오류 정보 기록

### Query

* Capture Log 목록 조회
* Capture Log 단건 조회
* Frontend에 조회 데이터 제공

---

## Database

역할

* Capture Log 저장
* 요청 정보 저장
* 응답 정보 저장
* Proxy 처리 시간 및 오류 정보 저장

기술

* PostgreSQL

---

# 데이터 흐름

기본적인 Proxy 요청 흐름은 아래와 같다.

```text
Source Application Request
          │
          ▼
Proxy API
          │
          ▼
Proxy Controller
          │
          ▼
Proxy Service
          │
          ├───────────────┐
          │               │
          │               ▼
          │       Target Application
          │               │
          │               ▼
          │       Target Response
          │               │
          └───────────────┘
          │
          ▼
Capture Service
          │
          ▼
Repository
          │
          ▼
PostgreSQL
          │
          ▼
Source Application Response
```

Proxy Service는 Source Application이 전달한 요청을 Target Application으로 전송하고, Target Application의 응답을 Source Application에 반환한다.

Capture Service는 Proxy 요청 자체의 URL이 아니라, **원래 Target Application으로 전달된 요청과 Target Application이 반환한 응답**을 하나의 Capture Log로 저장한다.

---

# Query 데이터 흐름

Capture 조회 흐름은 아래와 같다.

```text
Frontend
    │
    ▼
Query API
    │
    ▼
Query Controller
    │
    ▼
Query Service
    │
    ▼
Repository
    │
    ▼
PostgreSQL
    │
    ▼
Frontend Response
```

Query API는 조회만 수행한다.

아래 요청은 Capture Log를 생성하지 않는다.

* Health Check
* Capture 목록 조회
* Capture 상세 조회
* Frontend 정적 리소스 요청

---

# Proxy 요청 구조

MVP에서는 Source Application이 FlowTool Proxy에 아래 정보를 전달한다.

* Target URL
* HTTP Method
* Request Header
* Query Parameter
* Request Body
* Source Service 정보

초기 MVP에서는 Target URL을 전용 Header로 전달할 수 있다.

예시

```http
POST /proxy
X-FlowTool-Target-Url: http://localhost:4000/ai/jobs
X-FlowTool-Source-Service: private-ai-spring
Content-Type: application/json
```

Request Body는 원래 Target Application으로 전달하려던 Body를 그대로 사용한다.

```json
{
  "jobId": 10,
  "prompt": "..."
}
```

FlowTool은 Target Application의 상태 코드와 응답 Body를 Source Application에 가능한 한 그대로 반환한다.

필요한 경우 Capture ID는 응답 Header로 전달할 수 있다.

```http
X-FlowTool-Capture-Id: 100
```

---

# Backend 구조

권장 구조

```text
src/
├── config
├── middleware
├── routes
│   ├── proxy.routes.ts
│   ├── capture-query.routes.ts
│   └── health.routes.ts
├── controllers
│   ├── proxy.controller.ts
│   └── capture-query.controller.ts
├── services
│   ├── proxy.service.ts
│   ├── capture.service.ts
│   └── capture-query.service.ts
├── repositories
├── models
├── utils
├── types
└── tests
```

역할

* `proxy.*`

  * 실제 HTTP 요청 중계
* `capture.service`

  * Proxy 요청 및 응답 저장
* `capture-query.*`

  * Capture 목록 및 상세 조회
* `repository`

  * PostgreSQL 접근

현재 MVP에서는 과도한 계층 분리를 하지 않는다.

다만 Proxy, Capture, Query의 책임은 명확히 구분한다.

---

# Frontend 구조

권장 구조

```text
src/
├── api
├── pages
├── components
├── hooks
├── layouts
├── types
└── utils
```

Frontend는 Query API를 통해서만 Capture 데이터를 조회한다.

Proxy 호출 기능은 Source Application의 책임이며, Frontend Dashboard에서는 직접 Proxy 요청을 생성하지 않는다.

---

# Capture 구조

하나의 Proxy 중계 요청은 하나의 Capture Log로 저장한다.

Capture Log는 최소 아래 정보를 가진다.

* Source Service
* Target URL
* HTTP Method
* Target Path
* Query Parameter
* Request Header
* Request Body
* Response Status
* Response Header
* Response Body
* Processing Time
* Error Message
* Created At

Capture Log의 요청 정보는 `/proxy` 요청 자체가 아니라, Target Application으로 전달된 실제 요청을 기준으로 저장한다.

---

# 오류 처리 구조

Proxy 오류는 아래 두 종류로 구분한다.

## Target Application의 HTTP 오류 응답

Target Application이 `4xx` 또는 `5xx`를 반환한 경우

* Target 응답 Status 저장
* Target 응답 Body 저장
* 같은 Status와 Body를 Source Application에 반환

이는 Proxy 연결 실패가 아니라 Target Application의 정상적인 HTTP 응답으로 처리한다.

---

## Proxy 전달 실패

아래와 같은 경우

* 연결 실패
* DNS 실패
* Connection refused
* Timeout
* 잘못된 Target URL

FlowTool은 오류 정보를 Capture Log에 저장하고 Source Application에 적절한 Gateway 오류를 반환한다.

예시

* 연결 실패: `502 Bad Gateway`
* Timeout: `504 Gateway Timeout`

FlowTool 내부 예외 정보 전체를 Source Application에 노출하지 않는다.

---

# MCP 활용 구조

FlowTool은 구현보다 **검증 자동화**를 중요하게 생각한다.

MCP는 아래와 같이 활용한다.

| MCP                 | 역할                             |
| ------------------- | ------------------------------ |
| PostgreSQL MCP      | Proxy 요청 및 응답 저장 결과 검증         |
| Chrome DevTools MCP | Query API Network 및 Console 검증 |
| Playwright MCP      | 목록, 상세 및 Proxy 연동 E2E 검증       |
| Notion MCP          | 개발 히스토리 기록                     |

---

# 데이터 저장 전략

현재 MVP에서는 빠른 검증을 우선한다.

원칙

* 단순한 구조를 우선한다.
* 조회 가능한 구조를 우선한다.
* Proxy 요청과 Query 요청을 명확히 분리한다.
* Query 요청은 Capture 대상으로 저장하지 않는다.
* 과도한 정규화는 하지 않는다.
* 추후 확장이 가능하도록 최소한의 구조를 유지한다.

---

# 보안 및 안정성 원칙

Proxy는 외부 URL로 요청을 전달할 수 있으므로 Target URL 검증이 필요하다.

현재 로컬 MVP에서는 단순한 구조를 우선하지만, 향후 아래 항목을 고려한다.

* 허용된 Target Host만 요청 가능하도록 제한
* 내부 네트워크 및 민감 주소 요청 제한
* 요청 Timeout 적용
* 민감 Header 저장 제외
* API Key 및 인증
* 최대 Request/Response Body 크기 제한

현재 MVP에서는 보안 기능을 과도하게 구현하지 않지만, 임의 URL 전달이 가능한 구조라는 점을 문서에 명시한다.

---

# 향후 확장 방향

MVP 이후 아래 기능을 순차적으로 추가할 수 있다.

* Target Service 매핑
* Spring 연동 모듈
* Node 연동 모듈
* Trace 단계 분석
* 요청 비교 기능
* 요청 재전송
* AI 로그 분석
* OpenTelemetry 연동
* Grafana 연동
* Docker 배포
* Kubernetes 환경 지원

---

# 현재 MVP 핵심 구조

현재 가장 중요한 구조는 아래와 같다.

```text
Source Application
      │
      ▼
Proxy API
      │
      ▼
Target Application으로 요청 전달
      │
      ▼
Target Response 수신
      │
      ▼
Capture Log 저장
      │
      ▼
Source Application에 응답 반환
      │
      ▼
Query API
      │
      ▼
Frontend 확인
      │
      ▼
MCP 검증
```

---

# 현재 시스템 목표

현재 목표는 다음과 같다.

> **서비스 간 HTTP 요청과 응답을 Proxy 방식으로 안정적으로 중계하고 저장한 뒤, 개발자가 이를 쉽게 조회하고 MCP를 이용해 검증할 수 있는 구조를 완성하는 것**
