# mvp_scope.md

# FlowTool MVP 범위 정의

이 문서는 FlowTool MVP 단계에서 구현할 범위와 제외할 범위를 정의한다.

현재 목표는 **기능을 많이 만드는 것이 아니라, FlowTool의 핵심 가치가 실제로 동작하는지 검증하는 것**이다.

---

# MVP 목표

FlowTool MVP의 핵심 목표는 다음 한 문장으로 정의한다.

> **서비스 간 HTTP 요청과 응답을 Proxy 방식으로 중계하고 저장하여 개발자가 실제 통신 흐름과 실패 지점을 추적할 수 있는가를 검증한다.**

---

# MVP 핵심 기능

## 1. HTTP 요청 중계

Source Application이 FlowTool Proxy로 요청을 보내면, FlowTool이 해당 요청을 Target Application으로 전달한다.

전달 대상

* Target URL
* HTTP Method
* Query Parameter
* Request Header
* Request Body

---

## 2. HTTP 요청/응답 Capture

Proxy가 실제로 중계한 요청과 Target Application의 응답을 수집한다.

수집 대상

* Source Service
* Target URL
* HTTP Method
* Target Path
* Query Parameter
* Request Header
* Request Body
* Response Header
* Response Status
* Response Body
* Processing Time

FlowTool 내부의 Query API와 Health Check 요청은 Capture 대상에 포함하지 않는다.

---

## 3. HTTP 흐름 저장

수집한 데이터를 PostgreSQL에 저장한다.

최소 저장 대상

* Source 및 Target 정보
* Request 정보
* Response 정보
* 처리 시간
* 오류 정보
* 생성 시간

---

## 4. 기본 조회

저장된 데이터를 조회할 수 있어야 한다.

포함 기능

* Capture 목록 조회
* Capture 상세 조회
* 요청 데이터 조회
* 응답 데이터 조회
* Proxy 오류 정보 조회

---

## 5. 실패 흐름 저장

오류가 발생한 경우 아래 정보를 저장한다.

### Target Application 오류 응답

* Response Status
* Response Header
* Response Body
* 처리 시간

### Proxy 전달 실패

* Error Message
* Target URL
* 요청 정보
* 처리 시간

---

# MVP 포함 범위

## Backend

포함

* Express.js API
* Proxy API
* Target Application 요청 전달
* Target Application 응답 반환
* Capture Log 저장
* Capture Query API
* PostgreSQL 저장
* Proxy 및 Query 예외 처리
* 기본 Timeout 처리

제외

* 인증 및 권한
* 사용자 관리
* 메시지 큐
* 분산 처리
* OpenTelemetry 연동
* Target Service DB 관리
* 고급 재시도 정책

---

## Frontend

포함

* Capture Log 목록
* Capture Log 상세
* 요청/응답 데이터 조회
* Target URL 표시
* Proxy 오류 표시

제외

* 고급 UI
* 반응형 디자인 최적화
* 다크 모드
* 실시간 갱신
* 차트 및 통계
* Proxy 요청 생성 화면

---

## AI 기능

AI 기능은 Proxy MVP가 안정화된 이후 진행한다.

포함 예정

* 간단한 로그 요약
* 기본 에러 요약

제외

* 자동 코드 수정
* 자동 문제 해결
* 장기 메모리
* 고급 분석

---

## MCP 활용

포함

* PostgreSQL MCP
* Chrome DevTools MCP
* Playwright MCP
* Notion MCP

활용 목적

* Proxy 요청 및 응답 저장 검증
* Query API 검증
* 브라우저 검증
* 기본 UI 검증
* 개발 히스토리 기록

---

# MVP 제외 기능

현재 MVP에서는 아래 기능을 구현하지 않는다.

* 사용자 인증
* 권한 관리
* 팀 기능
* 실시간 스트리밍
* Trace 비교 기능
* 요청 재실행
* Target Service 관리 화면
* 복잡한 재시도
* 메시지 큐
* OpenTelemetry
* Grafana 연동
* Docker/Kubernetes 배포
* 고급 AI 분석

---

# MVP 성공 기준

아래 조건을 모두 만족하면 MVP가 성공한 것으로 판단한다.

* Source Application 요청을 FlowTool이 수신할 수 있다.
* FlowTool이 요청을 Target Application으로 전달할 수 있다.
* Target Application의 응답을 Source Application에 반환할 수 있다.
* 중계된 요청과 응답을 하나의 Capture Log로 저장할 수 있다.
* Target Application의 `4xx`, `5xx` 응답을 저장하고 그대로 반환할 수 있다.
* 연결 실패 또는 Timeout을 저장할 수 있다.
* Query API 요청은 Capture Log로 저장되지 않는다.
* 저장된 데이터를 목록과 상세 화면에서 조회할 수 있다.
* MCP를 이용하여 저장 결과와 화면 동작을 검증할 수 있다.

---

# 개발 우선순위

## 1단계 — 완료

* Backend 프로젝트 구성
* 기존 HTTP Capture 기반 구현
* PostgreSQL 저장
* 기본 조회 API
* Frontend 목록 및 상세 화면

---

## 2단계 — 아키텍처 전환

* Proxy 중심 아키텍처 문서 수정
* 전역 Capture Middleware 제거
* Capture 저장 책임을 Capture Service로 분리
* Query API 분리

---

## 3단계 — Proxy 핵심 구현

* Proxy API 구현
* Target URL 전달
* Target Application 요청 전송
* Target 응답 수신
* Capture Log 저장
* Source Application에 응답 반환

---

## 4단계 — Proxy 오류 처리

* 잘못된 Target URL
* Connection refused
* Timeout
* `502 Bad Gateway`
* `504 Gateway Timeout`
* 오류 Capture 저장

---

## 5단계 — UI 및 검증

* Proxy 기반 데이터 모델 반영
* 목록 및 상세 화면 수정
* MCP 검증 자동화
* UI 디자인 개선

---

## 6단계 — 연동 확장

* Spring 연동 모듈
* Node 연동 모듈
* Target Service 매핑
* AI 로그 분석

---

# MVP 개발 원칙

모든 구현은 아래 원칙을 따른다.

* 하나의 기능 단위로 구현한다.
* 구현과 검증을 함께 제공한다.
* 빠른 검증을 우선한다.
* Proxy, Capture, Query의 책임을 분리한다.
* 과도한 추상화를 하지 않는다.
* 추후 확장이 가능하도록 최소한의 구조를 유지한다.
* 기존 구현을 가능한 한 재사용하되 잘못된 책임 구조는 유지하지 않는다.

---

# 현재 최우선 목표

현재 가장 중요한 목표는 다음과 같다.

> **기존 전역 Capture Middleware 구조를 Proxy 기반 구조로 전환하기 위해 Capture 저장 기능과 Query 기능의 책임을 분리하는 것**

이 작업이 완료되면 실제 요청 중계 기능을 안정적으로 구현할 수 있다.
