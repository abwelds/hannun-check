// Neon(Postgres) 연결. Vercel에서 Neon을 연결하면 DATABASE_URL 환경변수가 자동으로 들어옵니다.
import { neon } from '@neondatabase/serverless';

let _sql = null;
export function getSql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error('DATABASE_URL이 설정되지 않았습니다. Vercel Storage에서 Neon을 연결하세요.');
    _sql = neon(url);
  }
  return _sql;
}

let ready = false;
// 첫 호출 때 표를 자동으로 만듭니다.
export async function ensureTables(sql) {
  if (ready) return;
  await sql`CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    role TEXT, code TEXT, cat TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_public BOOLEAN NOT NULL DEFAULT false,
    approved BOOLEAN NOT NULL DEFAULT false,
    example BOOLEAN NOT NULL DEFAULT false,
    main TEXT, exp TEXT, process TEXT, gap TEXT, change TEXT
  )`;
  await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS wants TEXT[] NOT NULL DEFAULT '{}'`;
  await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS helped TEXT[] NOT NULL DEFAULT '{}'`;
  await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS opinion TEXT`;
  await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS gender TEXT`;
  await sql`CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    page TEXT, rating TEXT, text TEXT
  )`;
  await sql`CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    policy TEXT NOT NULL, status TEXT NOT NULL, follow TEXT
  )`;
  await sql`CREATE TABLE IF NOT EXISTS typetests (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    type TEXT NOT NULL
  )`;
  ready = true;
}
