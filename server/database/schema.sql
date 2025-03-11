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

--  sessions table (Manages user sessions manually)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_timestamp
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();