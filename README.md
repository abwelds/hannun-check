# 한눈복지 — Vercel 배포 안내 (서울시 버전)

이 폴더를 Vercel에 올리면, '이야기 남기기'에 남긴 글과 '이용해 보셨나요?' 응답, 정책 유형 테스트 결과가
데이터베이스에 쌓여요. 새로고침해도, 다른 사람이 들어와도 그대로 남아요.

전체 흐름: **① GitHub에 파일 올리기 → ② Vercel에 배포 → ③ 데이터베이스(Neon) 연결 → ④ 다시 배포 → ⑤ 확인**
처음 하면 20~30분 정도 걸려요. 모두 무료예요.

---

## 0. 준비물

- 구글 크롬 같은 PC 브라우저 (휴대폰보다 PC가 편해요)
- 이메일 주소 하나 (GitHub 가입용)
- 이 압축 파일을 풀어 둔 `hannun` 폴더

`hannun` 폴더 안에는 다음 파일이 있어야 해요.

```
hannun/
├─ index.html        화면
├─ package.json      필요한 패키지 목록
├─ api/
│   ├─ submit.js     글·응답 저장
│   └─ data.js       화면에 보여 줄 데이터 불러오기
├─ lib/
│   ├─ db.js         데이터베이스 연결, 표 자동 생성
│   └─ validate.js   허용된 값만 저장하도록 검사
├─ seed.sql          (선택) 예시 이야기 5개
├─ admin.sql         글 승인·삭제·집계용 명령
└─ README.md         이 안내문
```

> 누가 계정을 만들지 먼저 정하세요. 글 승인과 데이터 확인은 **Vercel 프로젝트를 만든 사람**만 할 수 있어요.
> 승인 담당 조원 한 명이 1~5단계를 모두 하는 걸 추천해요.

---

## 1. GitHub 가입하고 저장소 만들기 (약 5분)

GitHub는 코드 파일을 보관하는 곳이에요. Vercel은 여기 있는 파일을 가져가서 사이트로 만들어요.

1. https://github.com 접속 → 오른쪽 위 **Sign up** → 이메일, 비밀번호, 사용자 이름 입력 → 이메일 인증
2. 로그인한 뒤 오른쪽 위 **+** 버튼 → **New repository**
3. 아래처럼 입력하고 **Create repository** 클릭
   - Repository name: `hannun-bokji`
   - **Public** 선택 (Private도 되지만 Public이 설정이 간단해요. 코드에는 개인정보나 비밀번호가 없어요)
   - 나머지 체크박스는 건드리지 않기

## 2. 파일 올리기 (약 3분)

1. 방금 만든 저장소 화면 가운데의 **uploading an existing file** 링크 클릭
   (안 보이면 **Add file → Upload files**)
2. 컴퓨터에서 `hannun` 폴더를 열고, **폴더 안의 내용물 전체**(index.html, package.json, api 폴더, lib 폴더 등)를 선택해서
   브라우저 화면에 끌어다 놓기
   - `hannun` 폴더 자체가 아니라 **그 안의 것들**을 올려야 해요.
   - 크롬에서는 폴더(api, lib)도 끌어다 놓으면 폴더째 올라가요.
3. 아래로 내려 **Commit changes** 클릭
4. 저장소 첫 화면에 `api`, `lib`, `index.html`, `package.json`이 보이는지 확인
   - `api` 폴더를 눌렀을 때 `submit.js`, `data.js`가 있어야 해요.
   - 폴더가 안 올라갔다면: **Add file → Create new file** → 이름 칸에 `api/submit.js`를 입력하면 폴더가 생겨요.
     그 안에 파일 내용을 복사해 붙여 넣고 Commit 하면 돼요. `api/data.js`, `lib/db.js`, `lib/validate.js`도 같은 방법으로.

## 3. Vercel에 배포하기 (약 5분)

1. https://vercel.com 접속 → **Sign Up** → **Continue with GitHub** → GitHub 로그인 허용
   - 플랜을 물으면 **Hobby** (무료, 개인·비상업용) 선택
2. 대시보드에서 **Add New… → Project**
3. **Import Git Repository** 목록에서 `hannun-bokji` 옆 **Import**
   - 목록에 안 보이면 **Adjust GitHub App Permissions**를 눌러 이 저장소 접근을 허용하세요.
4. 설정 화면에서
   - Project Name: `hannun-bokji` (이게 주소가 돼요: `hannun-bokji.vercel.app`)
   - Framework Preset: **Other** 그대로
   - 나머지는 건드리지 않고 **Deploy**
5. 1분쯤 뒤 축하 화면이 나오면 성공이에요. **Continue to Dashboard**

이 단계에서 사이트 화면은 열리지만, 아직 데이터베이스가 없어서 글이 저장되지 않아요. 다음 단계로 가세요.

## 4. 데이터베이스(Neon) 연결하기 (약 5분)

1. Vercel 프로젝트 화면 위쪽 탭에서 **Storage** 클릭
2. **Create Database** (또는 Marketplace의 데이터베이스 목록) → **Neon** 선택 → **Continue**
3. 설정
   - Plan: **Free**
   - Region: 서울과 가까운 곳 (Singapore 또는 Tokyo)
   - Database name: `hannun-db`
   - **Create** (또는 Install / Accept)
4. 연결 화면에서 이 프로젝트(`hannun-bokji`)에 **Connect**
   - 환경(Environments)은 Production, Preview, Development 모두 체크된 그대로 두세요.
5. 연결 확인: 프로젝트 **Settings → Environment Variables**에 `DATABASE_URL`이 생겼는지 보세요.

## 5. 다시 배포하기 (꼭 해야 해요, 1분)

데이터베이스 연결 정보는 **새로 배포할 때만** 사이트에 반영돼요.

1. 프로젝트 화면 **Deployments** 탭
2. 맨 위 배포 줄 오른쪽 **⋯** → **Redeploy** → 다시 **Redeploy**
3. 상태가 **Ready**가 되면 끝

## 6. 잘 되는지 확인하기 (3분)

1. `https://hannun-bokji.vercel.app` 접속
2. 주소 뒤에 `/api/data`를 붙여 열어 보세요 → `{"stories":[],"experiences":[],"typetests":[]}`처럼 나오면 정상
   (처음 열 때 데이터베이스에 표가 자동으로 만들어져요)
3. 사이트에서 **이야기 남기기** → 동의 체크, 입장 선택, 분야 선택, 글 입력 → 제출
4. 새로고침 → **목소리 모아보기**에서 이야기 수가 늘었으면 성공
   - 글 내용은 승인 전이라 아직 목록에 안 보이는 게 정상이에요 (7단계)
5. (선택) 예시 이야기 넣기: **Storage → hannun-db → Query**(또는 Open in Neon → SQL Editor)에
   `seed.sql` 내용을 붙여 넣고 **Run**

## 7. 글 공개 승인하기

공개에 동의한 글도 조원이 개인정보(이름, 동네, 직장, 아이 학교 등)가 없는지 확인한 뒤에만 공개돼요.

- 방법 A: **Storage → hannun-db → Data → stories** 표에서 해당 줄의 `approved`를 `true`로 바꾸고 저장
- 방법 B: **Query** 탭에서 `admin.sql`의 1)번으로 대기 글을 보고, 2)번의 id를 바꿔 실행

## 8. 기관별 링크 나눠 주기

링크 끝에 `#code-기관코드`를 붙이면 '이야기 남기기' 화면이 열리고 참여 코드가 미리 채워져요.

- 예: `https://hannun-bokji.vercel.app/#code-SEOUL01` (서울시 한부모가족지원센터용)
- 예: `https://hannun-bokji.vercel.app/#code-GROUP01` (자조모임용)
- 코드는 영문 대문자·숫자 2~16자로 정하고, 어느 코드를 어디에 줬는지 조원끼리 기록해 두세요.

## 9. 사이트 고치기

- **글자 수정**: GitHub 저장소에서 `index.html` 열기 → 연필 아이콘 → 수정 → **Commit changes** → 1분 뒤 자동 반영
- **파일 통째로 바꾸기**: 저장소에서 **Add file → Upload files** → 새 `index.html` 끌어다 놓기 → Commit
- **되돌리기**: Vercel **Deployments**에서 예전 배포의 **⋯ → Promote**(또는 Instant Rollback)
- 모인 글은 데이터베이스에 있어서 사이트를 고쳐도 지워지지 않아요.
- `api/`, `lib/` 파일과 선택지 값(입장·분야 등의 영어 값)은 바꾸면 저장이 안 될 수 있으니 건드리지 마세요.

## 10. 프로젝트가 끝나면 (2026-12-31)

동의 안내에 이 날짜까지 보관한다고 적었어요. 날짜가 되면
`admin.sql`의 5)번을 실행하거나 **Storage → hannun-db → Settings → Delete**로 데이터베이스를 지우세요.

---

## 막힐 때

| 증상 | 원인과 해결 |
|---|---|
| 글을 남기면 "저장 서버에 연결되지 않아…" | 4~5단계 확인. `DATABASE_URL`이 있는지, 연결 후 **Redeploy** 했는지 |
| `/api/data`가 404 | `api` 폴더가 GitHub에 안 올라감. 2단계 4번 방법으로 다시 올리기 |
| `/api/data`가 500 | 데이터베이스 미연결 또는 재배포 안 함. Vercel 프로젝트 **Logs**에서 오류 확인 |
| 고쳤는데 사이트가 그대로 | GitHub에서 Commit을 눌렀는지, Deployments에 새 배포가 Ready인지 확인. 브라우저 새로고침(Ctrl+Shift+R) |
| 다운받은 index.html을 컴퓨터에서 바로 열면 저장이 안 됨 | 정상이에요. 저장은 Vercel에 올린 주소에서만 돼요 |
