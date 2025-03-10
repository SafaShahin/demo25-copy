-- Droping existing tables to prevent duplication (deleting all data)
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS days;

--  table for days (each day in the reading plan)
CREATE TABLE days (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

--  table for goals (each goal belongs to a day)
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  day_id INTEGER REFERENCES days(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);
