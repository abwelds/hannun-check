// POST /api/submit  { kind: 'stories' | 'experiences' | 'typetests', data: {...}, hp: '' }
import { getSql, ensureTables } from '../lib/db.js';
import { cleanStory, cleanExperience, cleanType } from '../lib/validate.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'POST만 가능해요' }); }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: '잘못된 요청' });
  if (body.hp) return res.status(200).json({ ok: true }); // 자동 등록 프로그램이 채우는 숨은 칸: 조용히 무시
  const { kind, data = {} } = body;
  try {
    const sql = getSql(); await ensureTables(sql);
    if (kind === 'stories') {
      const s = cleanStory(data); if (!s) return res.status(400).json({ error: '필수 항목이 비었어요' });
      await sql`INSERT INTO stories (role, code, cat, tags, is_public, main, exp, process, gap, change)
        VALUES (${s.role}, ${s.code}, ${s.cat}, ${s.tags}, ${s.isPublic}, ${s.main}, ${s.exp}, ${s.process}, ${s.gap}, ${s.change})`;
    } else if (kind === 'experiences') {
      const e = cleanExperience(data); if (!e) return res.status(400).json({ error: '잘못된 응답' });
      await sql`INSERT INTO experiences (policy, status, follow) VALUES (${e.policy}, ${e.status}, ${e.follow})`;
    } else if (kind === 'typetests') {
      const t = cleanType(data); if (!t) return res.status(400).json({ error: '잘못된 응답' });
      await sql`INSERT INTO typetests (type) VALUES (${t.type})`;
    } else return res.status(400).json({ error: '알 수 없는 종류' });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: '저장하지 못했어요' });
  }
}
