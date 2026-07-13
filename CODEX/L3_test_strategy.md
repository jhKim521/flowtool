# test_strategy.md

# FlowTool Feature Verification Strategy

---

# 목적


이 문서는 **개별 기능 구현이 요구사항대로 완료되었는지 검증하기 위한 Feature Verification 전략**을 정의한다.

모든 기능은 구현과 함께 검증되어야 하며, 검증이 완료되지 않은 기능은 Done으로 판단하지 않는다.
모든 기능은 가능한 한 자동으로 검증할 수 있어야 하며, 검증 결과는 재현 가능해야 한다.

본 문서는 **현재 작업 중인 기능**을 대상으로 한다.

전체 시스템 품질 및 사용자 시나리오 검증은 이 문서에서 고려하지 않는다.

---

# Feature Verification 원칙

모든 기능은 아래 원칙을 따른다.

- 구현과 함께 검증 방법을 제공한다.
- 가능한 경우 자동 검증을 우선한다.
- 검증 결과는 재현 가능해야 한다.
- 검증 결과는 Notion Development History에 기록할 수 있어야 한다.
- 검증 없이 완료(Done) 처리하지 않는다.

---

# 검증 범위

Feature Verification은 다음 범위를 검증한다.

- 이번 작업에서 구현한 기능
- 해당 기능과 직접 연결되는 기존 기능
- 변경으로 영향을 받는 데이터 흐름

전체 시스템 흐름은 검증 대상이 아니다.

---

# Feature 우선순위

## P0

핵심 기능

- HTTP 요청 수집
- HTTP 응답 수집
- Trace 저장
- Capture Log 저장

---

## P1

기능 검증

- API 조회
- 예외 처리
- 실패 흐름 저장
- 처리 시간 계산

---

## P2

UI 기능

- 화면 렌더링
- 화면 이동
- 로그 표시

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

# 검증 절차

가능한 경우 아래 순서로 진행한다.

```txt
1. Build / Type Check
2. 자동 테스트 또는 검증 스크립트 실행
3. Integration Verification
4. PostgreSQL MCP 확인
5. Chrome DevTools 또는 Playwright 확인
6. 결과 보고
```
---
# Integration Verification

Feature Verification에서는
이번 작업과 직접 연결되는 구성 요소가 정상적으로 동작하는지 확인한다.

예시

```text
HTTP Request
    ↓
Middleware
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

또는

```text
Frontend
    ↓
API
    ↓
Backend
    ↓
Database
```

검증 항목

- 데이터 저장
- 데이터 조회
- Validation
- 예외 처리
- 변경된 기능이 기존 기능과 정상 연결되는지 확인

---

# Backend 검증

## 검증 대상

- Middleware
- API Endpoint
- Service
- Repository
- Database

## 검증 항목

- 저장
- 조회
- Validation
- Exception
- 처리 시간
- Integration Verification

---

# Frontend 검증

## 검증 대상

- 구현한 화면
- 변경한 컴포넌트
- API 연동

## 검증 항목

- 정상 렌더링
- 버튼 동작
- API 호출
- 화면 갱신
- Console Error

---

# PostgreSQL 검증

PostgreSQL MCP를 이용하여 확인한다.

- 데이터 저장 여부
- 컬럼 값
- NULL 여부
- Trace 생성 여부
- Capture Log 생성 여부

---

# Chrome DevTools 검증

Chrome DevTools MCP를 이용하여 확인한다.

- HTTP Request
- HTTP Response
- Status Code
- Console Error
- Network Error

---

# Playwright 검증

필요한 경우 Playwright MCP를 이용하여
이번 작업 범위의 기능을 검증한다.

예시

- 페이지 진입
- 버튼 클릭
- API 호출
- 화면 변경

전체 사용자 시나리오는
System Test Strategy에서 수행한다.

---

# 실패 검증

반드시 확인한다.

- Validation 실패
- Exception 발생
- Timeout
- DB 저장 실패
- Network Error

---

# 테스트 데이터 전략

MVP 단계에서는 빠른 검증을 우선한다.

## 허용

- 하드코딩 테스트 데이터
- 임시 테스트 API
- 테스트용 Capture Log

## 금지

- 운영 데이터 사용
- 운영 DB 변경
- 운영 데이터와 테스트 데이터 혼합

---

# 완료 기준

아래 조건을 모두 만족하면
Feature Verification 완료로 판단한다.

- 기능이 요구사항대로 동작한다.
- Build / Type Check를 통과한다.
- 자동 테스트 또는 검증 스크립트가 성공한다.
- Integration Verification을 통과한다.
- PostgreSQL MCP 검증을 통과한다.
- Console Error가 없다.
- 필요한 경우 Playwright 또는 Chrome DevTools 검증을 완료한다.

---

# 결과 보고

Feature Verification 완료 후 아래 내용을 보고한다.

- 실행한 테스트
- 검증 명령
- Build 결과
- Integration Verification 결과
- MCP 검증 결과
- 발견된 이슈
- 현재 한계
- 다음 작업 추천
