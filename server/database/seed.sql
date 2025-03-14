-- Insert Days (Prevent Duplicates)
DO $$ 
DECLARE i INT;
BEGIN
    FOR i IN 1..30 LOOP
        INSERT INTO days (name) 
        SELECT 'Day ' || i 
        WHERE NOT EXISTS (SELECT 1 FROM days WHERE name = 'Day ' || i);
    END LOOP;
END $$;

-- Insert Goals (Prevent Duplicates)
DO $$ 
DECLARE i INT;
BEGIN
    FOR i IN 1..30 LOOP
        INSERT INTO goals (day_id, name)
        SELECT i, '1 completion → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20)
        WHERE NOT EXISTS (
            SELECT 1 FROM goals WHERE day_id = i AND name = 
            '1 completion → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20)
        );

        INSERT INTO goals (day_id, name)
        SELECT i, '2 completions → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20 + 20)
        WHERE NOT EXISTS (
            SELECT 1 FROM goals WHERE day_id = i AND name = 
            '2 completions → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20 + 20)
        );

        INSERT INTO goals (day_id, name)
        SELECT i, '3 completions → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20 + 40)
        WHERE NOT EXISTS (
            SELECT 1 FROM goals WHERE day_id = i AND name = 
            '3 completions → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20 + 40)
        );

        INSERT INTO goals (day_id, name)
        SELECT i, '5 completions → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20 + 80)
        WHERE NOT EXISTS (
            SELECT 1 FROM goals WHERE day_id = i AND name = 
            '5 completions → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20 + 80)
        );

        INSERT INTO goals (day_id, name)
        SELECT i, '10 completions → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20 + 180)
        WHERE NOT EXISTS (
            SELECT 1 FROM goals WHERE day_id = i AND name = 
            '10 completions → Read pages ' || ((i-1) * 20 + 1) || ' - ' || (i * 20 + 180)
        );
    END LOOP;
END $$;
