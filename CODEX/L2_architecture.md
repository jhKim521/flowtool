# architecture.md

# FlowTool 시스템 아키텍처

이 문서는 FlowTool의 전체 시스템 구조와 컴포넌트 간 데이터 흐름을 정의한다.

---

# 프로젝트 개요

FlowTool는 HTTP 요청과 응답을 수집하여 저장하고, 개발자가 요청 흐름을 쉽게 확인할 수 있도록 지원하는 디버깅 도구이다.

현재는 MVP 단계이며, 핵심 목표는 **HTTP 요청과 응답을 수집하고 저장하는 구조를 완성하는 것**이다.

---

# 전체 시스템 구성

```text
                ┌────────────────────┐
                │ React + Vite Front │
                └─────────┬──────────┘
                          │ HTTP
                          ▼
                ┌────────────────────┐
                │ Express Backend     │
                ├────────────────────┤
                │ Capture Middleware  │
                │ REST API            │
                │ Service             │
                │ Repository          │
                └─────────┬──────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │ PostgreSQL DB  │
                  └────────────────┘
```

---

# 시스템 구성 요소

## Frontend

역할

* Capture 목록 조회
* Capture 상세 조회
* 요청/응답 데이터 확인

기술

* React
* Vite
* TypeScript

---

## Backend

역할

* HTTP Capture
* Capture Log 저장
* Capture 조회 API
* 예외 처리

기술

* Node.js
* Express.js
* TypeScript

---

## Database

역할

* Capture Log 저장
* 요청 정보 저장
* 응답 정보 저장

기술

* PostgreSQL

---

# 데이터 흐름

기본적인 요청 흐름은 아래와 같다.

```text
Client Request
      │
      ▼
Capture Middleware
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
PostgreSQL
      │
      ▼
Response
      │
      ▼
Capture Middleware
      │
      ▼
Capture Log 저장
```

Capture Middleware는 요청 시작 시점과 응답 완료 시점을 모두 기록하여 하나의 Capture Log를 생성한다.

---

# Backend 구조

권장 구조

```text
src/
├── config
├── middleware
├── routes
├── controllers
├── services
├── repositories
├── models
├── utils
├── types
└── tests
```

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

---

# Capture 구조

하나의 HTTP 요청은 하나의 Capture Log로 저장한다.

Capture Log는 최소 아래 정보를 가진다.

* HTTP Method
* URL
* Request Header
* Request Body
* Response Status
* Response Body
* Processing Time
* Created At

---

# MCP 활용 구조

FlowTool는 구현보다 **검증 자동화**를 중요하게 생각한다.

MCP는 아래와 같이 활용한다.

| MCP                 | 역할                   |
| ------------------- | -------------------- |
| PostgreSQL MCP      | DB 저장 결과 검증          |
| Chrome DevTools MCP | Network 및 Console 검증 |
| Playwright MCP      | 기본 UI 및 E2E 검증       |
| Notion MCP          | 개발 히스토리 기록           |

---

# 데이터 저장 전략

현재 MVP에서는 빠른 검증을 우선한다.

원칙

* 단순한 구조를 우선한다.
* 조회 가능한 구조를 우선한다.
* 과도한 정규화는 하지 않는다.
* 추후 확장이 가능하도록 최소한의 구조를 유지한다.

---

# 향후 확장 방향

MVP 이후 아래 기능을 순차적으로 추가할 수 있다.

* Trace 단계 분석
* 요청 비교 기능
* AI 로그 분석
* OpenTelemetry 연동
* Grafana 연동
* Docker 배포
* Kubernetes 환경 지원

---

# 현재 MVP 핵심 구조

현재 가장 중요한 구조는 아래와 같다.

```text
HTTP Request
      │
      ▼
Capture Middleware
      │
      ▼
PostgreSQL 저장
      │
      ▼
조회 API
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

> **HTTP 요청과 응답을 안정적으로 수집하고 저장한 뒤, 개발자가 쉽게 조회하고 MCP를 이용해 검증할 수 있는 구조를 완성하는 것**
