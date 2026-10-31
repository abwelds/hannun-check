// 들어온 값을 허용된 값과 길이로만 걸러 냅니다.
export const ROLES = ['self', 'child', 'worker', 'other'];
export const CATS = ['apply', 'care', 'house', 'work', 'edu', 'support', 'etc'];
export const TAGS = ['info', 'money', 'care', 'house', 'work', 'support', 'mind', 'etc'];
export const EXP_STATUS = ['using', 'denied', 'skip', 'new', 'na'];
export const FOLLOWS = ['complex', 'small', 'review', 'none', 'income', 'docs', 'notelig', 'unknown', 'hard', 'time', 'stigma', 'center', 'school', 'msg', 'sns'];
export const TYPES = ['CT', 'CW', 'ST', 'SW'];
export const WANTS = ['cliff', 'amount', 'apply', 'info', 'care', 'support', 'house', 'stigma', 'etc'];
export const HELPED = ['cash', 'tax', 'care', 'support', 'house', 'mind', 'work', 'health', 'none'];
export const PAGES = ['home', 'find', 'story', 'voices', 'test', 'proposal'];
export const RATINGS = ['good', 'ok', 'bad'];
export const GENDERS = ['f', 'm', 'n'];
const POLICY_RE = /^[a-z0-9-]{1,32}$/;
const CODE_RE = /^[A-Z0-9-]{2,16}$/;

const txt = (v) => (typeof v === 'string' ? v.trim().slice(0, 600) : '') || null;
const pick = (v, list) => (list.includes(v) ? v : null);

export function cleanStory(d) {
  const role = pick(d.role, ROLES), cat = pick(d.cat, CATS); // 분야(cat)는 선택: 비어 있으면 조원이 나중에 분류
  if (!role) return null;
  const tags = Array.isArray(d.tags) ? [...new Set(d.tags.filter((t) => TAGS.includes(t)))] : [];
  const code = typeof d.code === 'string' && CODE_RE.test(d.code.toUpperCase()) ? d.code.toUpperCase() : null;
  const wants = Array.isArray(d.wants) ? [...new Set(d.wants.filter((w) => WANTS.includes(w)))].slice(0, 2) : [];
  const helped = Array.isArray(d.helped) ? [...new Set(d.helped.filter((w) => HELPED.includes(w)))].slice(0, 2) : [];
  const isPublic = d.public === true;
  const gender = pick(d.gender, GENDERS); // 선택 문항: 고르지 않으면 null
  const out = { role, gender, cat, tags, wants, helped, code, isPublic, opinion: null, main: null, exp: null, process: null, gap: null, change: null };
  // 비공개를 고른 글도 팀 분석용으로 저장합니다. 사이트에는 is_public && approved 인 글만 보입니다 (api/data.js).
  out.opinion = txt(d.opinion); out.main = txt(d.main); out.exp = txt(d.exp); out.process = txt(d.process); out.gap = txt(d.gap); out.change = txt(d.change);
  const hasText = out.opinion || out.main || out.exp || out.process || out.gap || out.change;
  if (!hasText && !tags.length && !wants.length && !helped.length) return null;
  return out;
}
export function cleanExperience(d) {
  const status = pick(d.status, EXP_STATUS);
  if (!status || typeof d.policy !== 'string' || !POLICY_RE.test(d.policy)) return null;
  return { policy: d.policy, status, follow: pick(d.follow, FOLLOWS) };
}
export function cleanType(d) {
  const type = pick(d.type, TYPES);
  return type ? { type } : null;
}
export function cleanFeedback(d) {
  const page = pick(d.page, PAGES) || 'home', rating = pick(d.rating, RATINGS);
  const text = (typeof d.text === 'string' ? d.text.trim().slice(0, 300) : '') || null;
  if (!rating && !text) return null;
  return { page, rating, text };
}
