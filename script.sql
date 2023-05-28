create extension if not exists "uuid-ossp"

create table carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  created_at date not null,
  updated_at date not null,
  status text not null
)

create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid references carts(id) not null,
  product_id uuid not null,
  count integer not null,
  price integer not null
)

create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  cart_id uuid references carts(id) not null,
  payment json not null,
  delivery json not null,
  comments text not null,
  status text not null,
  total integer not null
)

insert into carts (user_id, created_at, updated_at, status) values ('6244ff5d-f34f-4fa1-a052-be9bfadc207c', '2023-05-28', '2023-05-28', 'OPEN')
insert into carts (user_id, created_at, updated_at, status) values ('28576b5d-e4ea-4923-8f97-7bc2fa4eeced', '2023-05-28', '2023-05-28', 'ORDERED')
insert into carts (user_id, created_at, updated_at, status) values ('d3f8b59b-98f4-4e17-ba60-145e5fee5bc3', '2023-05-28', '2023-05-28', 'OPEN')
insert into carts (user_id, created_at, updated_at, status) values ('b13330fb-630e-4e68-a926-fb787c7cf9fe', '2023-05-28', '2023-05-28', 'ORDERED')
insert into carts (user_id, created_at, updated_at, status) values ('d8e17e6a-7ec2-4ff6-a15d-37f8de0e228e', '2023-05-28', '2023-05-28', 'OPEN')

insert into cart_items (cart_id, product_id, count, price) values ('___REPLACE___', 'd37ca9f6-fcde-4864-a906-6cc9941286bf', 1, 5)
insert into cart_items (cart_id, product_id, count, price) values ('___REPLACE___', '1806982d-86b7-4c7d-915a-7ab2804c082d', 2, 4)
insert into cart_items (cart_id, product_id, count, price) values ('___REPLACE___', '06a51a5c-e710-4d91-a981-7289e890fb8a', 3, 3)
insert into cart_items (cart_id, product_id, count, price) values ('___REPLACE___', '19a3e2c9-056b-4cd0-8b19-dbb0f5aabd92', 4, 2)
insert into cart_items (cart_id, product_id, count, price) values ('___REPLACE___', '8bc1826d-8ae4-4e27-8e20-545665f7d9e4', 5, 1)
