# basic_capture.md

# Scenario 001

## Capture Analysis Basic Journey

---

# 목적

사용자가 FlowTool를 이용하여

방금 발생한 HTTP 요청을 찾아
요청 및 응답 데이터를 확인할 수 있는지 검증한다.

이 시나리오는
현재까지 구현된 Capture 기능의 핵심 사용자 흐름을 검증한다.

---

# 테스트 범위

현재 구현 범위

- HTTP Capture
- Capture Log 저장
- Capture Log 목록 조회
- Capture Log 상세 조회

제외

- Search
- Filter
- Capture 대상 제외
- Spring Starter
- Node SDK
- AI 분석

---

# 사용자 시나리오

사용자는
애플리케이션에서 발생한 HTTP 요청 하나를 분석하려고 한다.

FlowTool를 열고

방금 발생한 요청을 찾은 뒤

상세 화면에서

Request와 Response를 확인한다.

---

# 테스트 절차

## STEP 1

테스트용 HTTP 요청을 발생시킨다.

예시

- GET
- POST
- Error Response

---

## STEP 2

Capture Log가 생성되는지 확인한다.

검증

- DB 저장
- Method
- Path
- Status

---

## STEP 3

Capture Log 목록 화면에 진입한다.

검증

- 정상 렌더링
- API 호출 성공
- Console Error 없음

---

## STEP 4

방금 생성된 요청이 목록에 표시되는지 확인한다.

검증

- 최신순 정렬
- Method 표시
- Path 표시
- Status 표시
- Duration 표시

---

## STEP 5

해당 Capture Log를 선택한다.

검증

- 상세 화면 이동
- URL 변경
- 새로고침 가능

---

## STEP 6

상세 데이터를 확인한다.

검증

- Query
- Request Header
- Request Body
- Response Status
- Response Body
- Error Message

---

## STEP 7

Database와 화면을 비교한다.

검증

- Method 동일
- Path 동일
- Request Body 동일
- Response Body 동일

---

# 체크리스트

## Capture

- [ ] HTTP 요청이 생성되었다.
- [ ] Capture Log가 저장되었다.

---

## 목록

- [ ] 목록 화면 진입 성공
- [ ] 최신 요청 확인
- [ ] Method 표시
- [ ] Path 표시
- [ ] Status 표시

---

## 상세

- [ ] 상세 화면 진입
- [ ] Request Header 표시
- [ ] Request Body 표시
- [ ] Response Body 표시

---

## Database

- [ ] DB 저장 확인
- [ ] 화면과 동일

---

## 사용성

- [ ] 방금 생성한 요청을 쉽게 찾을 수 있다.
- [ ] 어떤 항목을 클릭해야 하는지 알 수 있다.
- [ ] JSON이 읽기 어렵지 않다.
- [ ] 필요한 데이터를 쉽게 확인할 수 있다.

---

# 발견 가능한 개선사항 예시

아래 항목은 테스트 중 발견되면 기록한다.

- 목록에서 최신 요청을 찾기 어렵다.
- Method 색상이 구분되지 않는다.
- Status가 눈에 잘 들어오지 않는다.
- JSON이 읽기 어렵다.
- 복사 기능이 없다.
- Request와 Response 비교가 어렵다.
- 빈 데이터 표현이 어색하다.
- FlowTool 내부 API도 함께 표시된다.

---

# 성공 기준

다음 조건을 만족하면 PASS

- 요청 생성 성공
- Capture 저장 성공
- 목록 표시 성공
- 상세 조회 성공
- Database와 화면 데이터가 일치한다.
- 치명적인 Console Error가 없다.

---

# 결과 기록

System Test 종료 후 아래 내용을 기록한다.

- 실행 환경
- 테스트 결과
- 발견한 문제
- 개선 아이디어
- 다음 작업 후보