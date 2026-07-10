# current_requirement.md

# 현재 작업 지시

## 현재 목표

기존에 구현된 HTTP Capture 기능을 활용하여,
저장된 Capture Log를 조회할 수 있는 API를 구현한다.

이번 작업은 Capture 기능을 확장하는 것이 아니라,
이미 저장된 데이터를 조회하는 기능만 추가한다.

## Sprint Goal

이번 스프린트에서는 "저장된 Capture Log를 조회할 수 있는 최소 기능"만 완성한다.

새로운 기능이나 구조 개선은 하지 않는다.

---

## 이번 작업 범위

이번 작업에서는 아래 기능만 구현한다.

- Capture Log 조회 API
- Capture Log 단건 조회 API
- Repository 조회 기능
- Service 조회 기능
- Controller 구현
- API 검증

이번 작업에서는 수정, 삭제, 검색, 필터링은 구현하지 않는다.

---



## 구현 API

### Capture Log 목록 조회

GET /capture-logs

최신순(createdAt DESC)으로 조회한다.

---

### Capture Log 단건 조회

GET /capture-logs/:id

존재하지 않을 경우 적절한 오류를 반환한다.

---

## 응답 항목

조회 시 아래 정보를 반환한다.

- id
- method
- path
- responseStatus
- durationMs
- createdAt

단건 조회에서는 추가로 아래도 반환한다.

- query
- requestHeaders
- requestBody
- responseBody
- errorMessage

---

## 완료 기준

아래 조건을 만족하면 완료로 판단한다.

- 목록 조회 API 동작
- 단건 조회 API 동작
- 최신순 조회
- 존재하지 않는 id 예외 처리
- Postman 검증 완료

---

## 검증 방법

작업 완료 후 반드시 수행한다.

- 테스트 요청 여러 건 생성
- GET /capture-logs 호출
- GET /capture-logs/{id} 호출
- PostgreSQL 저장 데이터와 API 응답 비교

---

## 작업 완료 후

반드시 수행한다.

- Notion Development History 기록
- L4_progress.md 업데이트
- 작업 결과 보고

---

## 이번 작업에서 제외

- Dashboard
- 검색
- 필터
- 삭제
- 수정
- AI 기능
- Spring Starter
- Node SDK

---

## 참고 문서

- AGENT.md
- L1_coding_rules.md
- L1_mvp_scope.md
- L2_architecture.md
- L2_entity_model.md
- L2_api_spec.md
- L3_test_strategy.md
- L4_progress.md

이번 작업에서는 Capture Log 조회 기능만 구현한다.