TRUNCATE wfd_dishes, wfd_days, wfd_assignments RESTART IDENTITY CASCADE;

INSERT INTO wfd_days (day_name)
VALUES
  ('Sunday'),
  ('Monday'),
  ('Tuesday'),
  ('Wednesday'),
  ('Thursday'),
  ('Friday'),
  ('Saturday');

INSERT INTO wfd_dishes (dish_category, dish_name)
VALUES
  ('Drink', 'water'),
  ('Drink', 'juice'),
  ('Main', 'spaghetti'),
  ('Main', 'steak'),
  ('Main', 'pizza'),
  ('Side', 'salad'),
  ('Side', 'green beans'),
  ('Dessert', 'ice cream');

INSERT INTO wfd_assignments (day_id, dish_id)
VALUES
  (1, 1),
  (1, 3),
  (1, 6),
  (1, 8),
  (2, 2),
  (2, 4),
  (2, 7);