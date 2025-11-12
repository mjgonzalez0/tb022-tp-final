-- Usuarios
create table
  users (
    id uuid primary key default uuidv4 (),
    username text unique not null,
    email text unique not null,
    password text not null,
    bio text default '',
    created_at timestamptz not null default now (),
    updated_at timestamptz default null
  );

-- Sesiones
create table
  sessions (
    id text primary key,
    user_id uuid not null references users (id),
    expires_at timestamptz not null
  );

-- Snippets
create table
  snippets (
    id serial primary key,
    title text not null,
    code text not null,
    is_public boolean not null default true,
    upvotes integer not null default 0,
    runtime text not null,
    user_id uuid not null references users (id),
    created_at timestamptz not null default now (),
    updated_at timestamptz default null
  );

-- Comentarios
create table
  comments (
    id serial primary key,
    content text not null,
    user_id uuid not null references users (id),
    snippet_id integer not null references snippets (id),
    upvotes integer not null default 0,
    created_at timestamptz not null default now (),
    updated_at timestamptz default null
  );
