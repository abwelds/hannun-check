// GET /api/data  — 화면에 필요한 데이터만 돌려줍니다.
// 이야기 본문은 '공개 동의 + 조원 승인(approved)'된 것만 내보내고, 나머지는 분야·태그·입장만 집계용으로 보냅니다.
import { getSql, ensureTables } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'GET만 가능해요' }); }
  try {
    const sql = getSql(); await ensureTables(sql);
    const [st, ex, ty] = await Promise.all([
      sql`SELECT role, code, cat, tags, is_public, approved, example, main, exp, process, gap, change,
                 extract(epoch from created_at)*1000 AS t
          FROM stories ORDER BY created_at DESC LIMIT 1000`,
      sql`SELECT policy, status, follow FROM experiences ORDER BY created_at DESC LIMIT 3000`,
      sql`SELECT type FROM typetests ORDER BY created_at DESC LIMIT 3000`,
    ]);
    const stories = st.map((r) => {
      const shown = r.is_public && r.approved;
      const o = { role: r.role, code: r.code ? true : null, cat: r.cat, tags: r.tags || [], public: shown, example: r.example, createdAt: Number(r.t) };
      if (shown) Object.assign(o, { main: r.main, exp: r.exp, process: r.process, gap: r.gap, change: r.change });
      return o;
    });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ stories, experiences: ex, typetests: ty });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: '불러오지 못했어요' });
  }
}
