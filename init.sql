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

-- Snippets
create table
  snippets (
    id serial primary key,
    title text not null,
    code text not null,
    is_public boolean not null default true,
    upvotes integer not null default 0,
    runtime text not null,
    user_id uuid not null references users (id) on delete cascade,
    created_at timestamptz not null default now (),
    updated_at timestamptz default null
  );

-- Comentarios
create table
  comments (
    id serial primary key,
    content text not null,
    user_id uuid not null references users (id) on delete cascade,
    snippet_id integer not null references snippets (id) on delete cascade,
    upvotes integer not null default 0,
    created_at timestamptz not null default now (),
    updated_at timestamptz default null
  );

ALTER TABLE users ADD avatar TEXT NOT NULL DEFAULT '';

insert into users
    (id, username, email, password, bio)
values
    ('f26929ab-e5db-4544-acc8-bd052c6ff4b3', 'Mateo', 'mateo@example.com', '$argon2id$v=19$m=19456,t=2,p=1$jwQ9xczE8i6RonCbWnOkrg$DTvj2Ku1l7iwGUYCsxV736vELR2zokKQaVBjUSzGsVY', 'Desarrollador Web'),
    ('1422f821-1ac5-4324-90fe-9e34229f7987', 'antfu', 'antfu@example.com', '$argon2id$v=19$m=19456,t=2,p=1$jwQ9xczE8i6RonCbWnOkrg$DTvj2Ku1l7iwGUYCsxV736vELR2zokKQaVBjUSzGsVY', 'A ship in harbor is safe, but that is not what ships are built for.'),
    ('3e302e0b-1d83-42a7-ad62-a7d13d3f0d04', 'fabian-hiller', 'fh@example.com', '$argon2id$v=19$m=19456,t=2,p=1$jwQ9xczE8i6RonCbWnOkrg$DTvj2Ku1l7iwGUYCsxV736vELR2zokKQaVBjUSzGsVY', 'Creator of Valibot, creator of Formisch, co-creator of Standard Schema and engineer at Motion'),
    ('ec8901ec-54c7-48f1-9b3b-f33d2239cc62','joel','joel@example.com', '$argon2id$v=19$m=19456,t=2,p=1$jwQ9xczE8i6RonCbWnOkrg$DTvj2Ku1l7iwGUYCsxV736vELR2zokKQaVBjUSzGsVY', '');

INSERT INTO snippets (title, code, is_public, runtime, user_id, created_at)
VALUES
  ('Debounce',
$$function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}$$,
   true, 'javascript', '1422f821-1ac5-4324-90fe-9e34229f7987', '2025-12-31T14:42:54.000Z'),

  ('Mejorar seguridad de SSHd',
$$# Deshabilita login del usuario root
PermitRootLogin no

# Deshabilita autenticación por contraseña
PasswordAuthentication no

# Deshabilita contraseñas vacías
PermitEmptyPasswords no

# Habilita autenticación por clave pública
PubkeyAuthentication yes

# Verifica permisos correctos en archivos SSH
StrictModes yes$$,
   true, 'markdown', 'f26929ab-e5db-4544-acc8-bd052c6ff4b3', '2026-01-01T14:42:54.000Z'),
   ('Borrar carpeta en sistemas UNIX', 'rm -r /directorio', true, 'bash', 'ec8901ec-54c7-48f1-9b3b-f33d2239cc62', '2026-01-25T19:42:54.000Z');

INSERT INTO comments
    (content, user_id, snippet_id)
VALUES
    ('También se puede cambiar el puerto con PORT 4000', 'f26929ab-e5db-4544-acc8-bd052c6ff4b3', 2);
