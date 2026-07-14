# HTTPie Examples

현재 FlowTool은 STEP 8 기준으로 전역 Capture Middleware를 사용하지 않는다.

따라서 아래 요청은 Capture Log를 자동 생성하지 않는다.

- `GET /health`
- `GET /capture-logs`
- `GET /capture-logs/:id`
- `POST /api/test/echo`
- `GET /api/test/error`

Capture Log 저장은 현재 Backend 내부 검증 스크립트가 `Capture Service`를 직접 호출하는 방식으로 확인한다.

---

## 1. Backend 실행

```bash
cd backend
npm run dev
```

다른 터미널에서 아래 HTTPie 명령을 실행한다.

---

## 2. Health Check

```bash
http GET :3000/health
```

예상 결과:

```json
{
  "status": "UP"
}
```

이 요청은 Capture Log를 생성하지 않아야 한다.

---

## 3. Capture Log 테스트 데이터 준비

현재 단계에서는 HTTPie 요청으로 Capture Log를 직접 생성하지 않는다.

테스트 데이터가 필요하면 Backend 검증 스크립트를 실행한다.

```bash
cd backend
npm run verify:capture
```

또는 목록/상세 조회용 데이터를 함께 준비한다.

```bash
cd backend
npm run verify:capture-logs
```

---

## 4. Capture Log 목록 조회

```bash
http GET :3000/capture-logs
```

확인 항목:

- `success`가 `true`인지
- `data`가 배열인지
- 최신 Capture Log가 먼저 표시되는지
- 목록 항목에 `requestBody`, `responseBody`가 포함되지 않는지

이 요청은 Capture Log를 생성하지 않아야 한다.

---

## 5. Capture Log 상세 조회

목록 응답에서 확인한 `id`를 사용한다.

```bash
http GET :3000/capture-logs/102
```

확인 항목:

- `success`가 `true`인지
- `data.id`가 요청한 ID와 같은지
- `query`, `requestHeaders`, `requestBody`, `responseBody`, `errorMessage`가 표시되는지

이 요청은 Capture Log를 생성하지 않아야 한다.

---

## 6. 존재하지 않는 Capture Log 조회

```bash
http GET :3000/capture-logs/999999999
```

예상 결과:

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

HTTP Status는 `404`여야 한다.

이 요청도 Capture Log를 생성하지 않아야 한다.

---

## 7. 테스트 API 호출

아래 API는 현재도 응답 확인용으로 사용할 수 있다.

```bash
http POST :3000/api/test/echo \
  source==manual \
  message="hello"
```

예상 결과:

```json
{
  "received": {
    "message": "hello"
  },
  "query": {
    "source": "manual"
  }
}
```

주의:

이 요청은 더 이상 Capture Log를 생성하지 않는다.

---

## 8. 테스트 Error API 호출

```bash
http GET :3000/api/test/error
```

예상 결과:

```json
{
  "message": "Test error response"
}
```

HTTP Status는 `500`이다.

주의:

이 요청도 더 이상 Capture Log를 생성하지 않는다.

---

## 9. 내부 API 비수집 자동 검증

아래 스크립트는 `/health`, `/capture-logs`, `/capture-logs/:id`, 존재하지 않는 상세 조회를 호출한 뒤 `capture_logs` 개수가 변하지 않는지 확인한다.

```bash
cd backend
npm run verify:no-auto-capture
```

성공 시:

```text
No auto capture verification passed.
```

---

## 현재 제외

아래 기능은 아직 구현 전이다.

- `ANY /proxy`
- `GET /api/captures`
- `GET /api/captures/:id`
- Target Application 요청 전달
- Proxy 오류 저장

`/api/captures` 경로는 STEP 9에서 추가될 예정이다.
