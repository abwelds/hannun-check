-- Vercel 대시보드 > Storage > (Neon DB) > Query 탭에 붙여 넣어 쓰는 관리용 SQL

-- 1) 공개를 기다리는 글 보기
SELECT id, created_at, role, cat, main, opinion, exp, process, gap, change
FROM stories WHERE is_public AND NOT approved ORDER BY created_at;

-- 2) 확인을 마친 글 공개하기 (id를 바꿔서 실행)
UPDATE stories SET approved = true WHERE id IN (1, 2, 3);

-- 3) 부적절한 글 지우기 (id를 바꿔서 실행)
DELETE FROM stories WHERE id = 4;

-- 1-2) 비공개(팀 분석용) 글 보기 — 사이트에는 절대 보이지 않아요
SELECT id, created_at, role, code, cat, tags, main, opinion, exp, process, gap, change
FROM stories WHERE NOT is_public AND NOT example ORDER BY created_at;

-- 1-3) 정책 제안 근거용: 공개·비공개 상관없이 글이 있는 모든 이야기
SELECT id, created_at, is_public, role, cat, tags, helped, wants, main, opinion, exp, process, gap, change
FROM stories WHERE NOT example AND coalesce(main, opinion, exp, process, gap, change) IS NOT NULL ORDER BY cat, created_at;

-- 4) 분석용 집계
SELECT role, cat, count(*) FROM stories WHERE NOT example GROUP BY role, cat ORDER BY 3 DESC;
SELECT unnest(tags) AS tag, count(*) FROM stories WHERE NOT example GROUP BY 1 ORDER BY 2 DESC;
SELECT code, count(*) FROM stories WHERE NOT example GROUP BY code ORDER BY 2 DESC;
SELECT policy, status, count(*) FROM experiences GROUP BY policy, status ORDER BY 1, 3 DESC;

-- 6) 정책 제안 우선순위: '더 좋아졌으면 하는 것' 집계
SELECT unnest(wants) AS want, count(*) FROM stories WHERE NOT example GROUP BY 1 ORDER BY 2 DESC;
-- cliff 소득 기준 / amount 지원 금액 / apply 신청 절차·서류 / info 정보 안내 / care 돌봄 / support 양육비 이행 / house 주거 / stigma 편견·시선 / etc 기타

-- 6-2) '가장 도움이 된 지원' 집계 (지키고 넓힐 지원의 근거)
SELECT unnest(helped) AS helped, count(*) FROM stories WHERE NOT example GROUP BY 1 ORDER BY 2 DESC;
-- cash 아동양육비 등 현금 / tax 근로·자녀장려금 / care 아이돌봄·보육 / support 양육비 이행·선지급 / house 주거 / mind 상담·자조모임 / work 일·교육 / health 의료·건강 / none 없음

-- 6-3) 지원에 대한 생각(열린 질문) 모아 보기
SELECT id, is_public, helped, wants, opinion FROM stories WHERE opinion IS NOT NULL ORDER BY created_at;

-- 7) 사이트 사용 의견 (UI 개선용)
SELECT id, created_at, page, rating, text FROM feedback ORDER BY created_at DESC;
SELECT rating, count(*) FROM feedback GROUP BY rating;

-- 5) 프로젝트 종료 후(2026-12-31) 모든 응답 삭제
-- DROP TABLE stories, experiences, typetests, feedback;
