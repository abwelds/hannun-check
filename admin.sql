-- Vercel 대시보드 > Storage > (Neon DB) > Query 탭에 붙여 넣어 쓰는 관리용 SQL

-- 1) 공개를 기다리는 글 보기
SELECT id, created_at, role, cat, main, exp, process, gap, change
FROM stories WHERE is_public AND NOT approved ORDER BY created_at;

-- 2) 확인을 마친 글 공개하기 (id를 바꿔서 실행)
UPDATE stories SET approved = true WHERE id IN (1, 2, 3);

-- 3) 부적절한 글 지우기 (id를 바꿔서 실행)
DELETE FROM stories WHERE id = 4;

-- 1-2) 비공개(팀 분석용) 글 보기 — 사이트에는 절대 보이지 않아요
SELECT id, created_at, role, code, cat, tags, main, exp, process, gap, change
FROM stories WHERE NOT is_public AND NOT example ORDER BY created_at;

-- 1-3) 정책 제안 근거용: 공개·비공개 상관없이 글이 있는 모든 이야기
SELECT id, created_at, is_public, role, cat, tags, main, exp, process, gap, change
FROM stories WHERE NOT example AND coalesce(main, exp, process, gap, change) IS NOT NULL ORDER BY cat, created_at;

-- 4) 분석용 집계
SELECT role, cat, count(*) FROM stories WHERE NOT example GROUP BY role, cat ORDER BY 3 DESC;
SELECT unnest(tags) AS tag, count(*) FROM stories WHERE NOT example GROUP BY 1 ORDER BY 2 DESC;
SELECT code, count(*) FROM stories WHERE NOT example GROUP BY code ORDER BY 2 DESC;
SELECT policy, status, count(*) FROM experiences GROUP BY policy, status ORDER BY 1, 3 DESC;

-- 5) 프로젝트 종료 후(2026-12-31) 모든 응답 삭제
-- DROP TABLE stories, experiences, typetests;
