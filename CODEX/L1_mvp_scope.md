# mvp_scope.md

# FlowTool MVP 범위 정의

이 문서는 FlowTool MVP 단계에서 구현할 범위와 제외할 범위를 정의한다.

현재 목표는 **기능을 많이 만드는 것이 아니라, FlowTool의 핵심 가치가 실제로 동작하는지 검증하는 것**이다.

---

# MVP 목표

FlowTool MVP의 핵심 목표는 다음 한 문장으로 정의한다.

> **HTTP 요청의 흐름을 수집하고 저장하여 개발자가 문제를 추적할 수 있는가를 검증한다.**

---

# MVP 핵심 기능

## 1. HTTP 요청/응답 수집

Express Middleware를 이용하여 HTTP 요청과 응답을 수집한다.

수집 대상

* URL
* HTTP Method
* Request Header
* Request Body
* Response Status
* Response Body
* Processing Time

---

## 2. HTTP 흐름 저장

수집한 데이터를 PostgreSQL에 저장한다.

최소 저장 대상

* Request 정보
* Response 정보
* 처리 시간
* 생성 시간

---

## 3. 기본 조회

저장된 데이터를 조회할 수 있어야 한다.

포함 기능

* 목록 조회
* 상세 조회
* 요청 데이터 조회
* 응답 데이터 조회

---

## 4. 실패 흐름 저장

예외가 발생한 경우 아래 정보를 저장한다.

* Error Message
* Status Code
* 실패 시점
* 실패 요청 정보

---

# MVP 포함 범위

## Backend

포함

* Express.js API
* HTTP Capture Middleware
* PostgreSQL 저장
* 기본 조회 API
* 예외 처리

제외

* 인증 및 권한
* 사용자 관리
* 실시간 처리
* 메시지 큐
* 분산 처리
* OpenTelemetry 연동

---

## Frontend

포함

* Capture Log 목록
* Capture Log 상세
* 요청/응답 데이터 조회

제외

* 고급 UI
* 반응형 디자인
* 다크 모드
* 실시간 갱신
* 차트 및 통계

---

## AI 기능

포함

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

* DB 저장 검증
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
* OpenTelemetry
* Grafana 연동
* Docker/Kubernetes 배포
* 고급 AI 분석

---

# MVP 성공 기준

아래 조건을 모두 만족하면 MVP가 성공한 것으로 판단한다.

* HTTP 요청을 수집할 수 있다.
* HTTP 응답을 수집할 수 있다.
* 데이터를 PostgreSQL에 저장할 수 있다.
* 저장된 데이터를 조회할 수 있다.
* 실패 요청을 저장할 수 있다.
* MCP를 이용하여 저장 결과를 검증할 수 있다.

---

# 개발 우선순위

## 1단계

* HTTP Capture Middleware
* PostgreSQL 저장
* 기본 조회 API

---

## 2단계

* 실패 흐름 저장
* 처리 시간 계산
* 검증 스크립트

---

## 3단계

* Frontend 조회 화면
* MCP 검증 자동화
* Notion 개발 히스토리 기록

---

## 4단계

* AI 로그 요약
* 기본 에러 분석

---

# MVP 개발 원칙

모든 구현은 아래 원칙을 따른다.

* 하나의 기능 단위로 구현한다.
* 구현과 검증을 함께 제공한다.
* 빠른 검증을 우선한다.
* 과도한 추상화를 하지 않는다.
* 추후 확장이 가능하도록 최소한의 구조를 유지한다.

---

# 현재 최우선 목표

현재 가장 중요한 목표는 다음과 같다.

> **HTTP 요청이 발생했을 때 요청과 응답을 정상적으로 수집하고 PostgreSQL에 저장한 뒤, MCP를 이용해 검증할 수 있는 상태를 만드는 것**

이 기능이 완성되면 FlowTool MVP의 핵심 가치가 실제로 동작함을 검증할 수 있다.
