-- (선택) 화면 구성을 보여 주기 위한 익명 예시 5개. '예시' 표시가 붙어요.
-- 표가 아직 없다면 사이트를 한 번 열어서 표를 만든 뒤 실행하세요.
INSERT INTO stories (cat, tags, is_public, approved, example, main) VALUES
 ('apply',   ARRAY['info'],                   true, true, true, '신청하고 싶어도 어디서 해야 할지 찾는 데 시간이 너무 오래 걸렸어요.'),
 ('apply',   ARRAY['info'],                   true, true, true, '지원금 신청을 어디서 해야 하는지 찾는 것부터 어려웠어요.'),
 ('care',    ARRAY['care','money'],           true, true, true, '아이 병원 때문에 일을 빠지면 생활비가 바로 부족해져요.'),
 ('apply',   ARRAY['info'],                   true, true, true, '지원은 있는데 내가 받을 수 있는지 확인하기가 너무 복잡했어요.'),
 ('support', ARRAY['support','care','money'], true, true, true, '양육비 지원을 받고 있지만 아이가 아플 때 일을 쉬어야 해서 생활비가 부족해요.');
