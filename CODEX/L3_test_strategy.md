# test_strategy.md

# FlowTool 테스트 전략

---

# 목적

FlowTool의 테스트 목표는 기능 구현 자체가 아니라 **기능이 정상적으로 동작하는지 검증하는 것**이다.

모든 기능은 가능한 한 자동으로 검증할 수 있어야 하며, 검증 결과는 재현 가능해야 한다.

---

# 테스트 원칙

FlowTool는 100% 바이브 코딩으로 개발된다.

따라서 모든 기능은 아래 원칙을 따른다.

* 구현과 함께 검증 방법을 제공한다.
* 가능한 경우 자동 검증을 우선한다.
* 테스트 결과는 재현 가능해야 한다.
* 검증 결과는 Notion Development History에 기록할 수 있어야 한다.
* 검증 없이 완료(Done) 처리하지 않는다.

---

# 테스트 우선순위

## P0

MVP 진행을 위한 핵심 기능

* HTTP 요청 수집
* HTTP 응답 수집
* Trace 저장
* Capture Log 저장

---

## P1

기본 기능 검증

* API 조회
* 예외 처리
* 실패 흐름 저장
* 처리 시간 계산

---

## P2

사용자 경험 검증

* UI 렌더링
* 화면 이동
* 로그 표시

---

# 테스트 방법

가능한 경우 아래 순서로 검증한다.

```txt
1. 자동 테스트 실행
2. 검증 스크립트 실행
3. PostgreSQL MCP 확인
4. Chrome DevTools MCP 확인
5. Playwright MCP 확인
6. Notion Development History 기록
```

---

# Backend 테스트

## 검증 대상

* HTTP Capture Middleware
* API Endpoint
* Service
* Repository
* DB 저장

검증 항목

* 데이터 저장
* 데이터 조회
* Validation
* 예외 처리
* 처리 시간 계산

---

# Frontend 테스트

MVP에서는 자동화보다 기능 검증을 우선한다.

검증 항목

* 페이지 정상 렌더링
* 버튼 클릭
* API 호출
* 화면 갱신
* Console Error 여부

---

# PostgreSQL 검증

PostgreSQL MCP를 이용하여 아래 항목을 확인한다.

* 데이터 저장 여부
* 컬럼 값
* NULL 여부
* Trace 생성 여부
* Capture Log 생성 여부

---

# Chrome DevTools 검증

Chrome DevTools MCP를 이용하여 아래 항목을 확인한다.

* HTTP Request
* HTTP Response
* Status Code
* Console Error
* Network Error

---

# Playwright 검증

Playwright MCP를 이용하여 주요 사용자 시나리오를 검증한다.

예시

* 페이지 진입
* 버튼 클릭
* API 호출
* 화면 변경
* 기본 E2E 시나리오

---

# 실패 테스트

반드시 검증해야 하는 항목

* 잘못된 요청
* Validation 실패
* Exception 발생
* Timeout
* DB 저장 실패
* 네트워크 오류

---

# 테스트 데이터 전략

MVP 단계에서는 빠른 검증을 우선한다.

허용

* 하드코딩 테스트 데이터
* 임시 테스트 API
* 테스트용 Capture Log

금지

* 운영 데이터 사용
* 운영 환경 DB 변경
* 운영 데이터와 테스트 데이터 혼합

---

# 완료 기준

아래 조건을 모두 만족하면 테스트 완료로 판단한다.

* 기능이 정상 동작한다.
* 자동 테스트 또는 검증 스크립트가 성공한다.
* PostgreSQL MCP 검증을 통과한다.
* Console Error가 없다.
* 필요한 경우 Playwright 또는 Chrome DevTools MCP 검증을 완료한다.
* Notion Development History에 작업 결과를 기록한다.

---

# 테스트 결과 보고

테스트 완료 후 아래 내용을 사용자에게 보고한다.

* 실행한 테스트
* 검증 명령
* 성공 여부
* MCP 검증 결과
* 발견된 이슈
* 현재 한계
* 다음 작업 추천
