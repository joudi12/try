-- DROP TABLE IF EXISTS facts;

-- CREATE TABLE facts(
--     id SERIAL PRIMARY KEY,
--     text VARCHAR(255),
--     type VARCHAR(10000)
-- )

DROP TABLE IF EXISTS details;

CREATE TABLE details(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    authors VARCHAR(10000),
    description VARCHAR(100000),
     image_url VARCHAR(255)
)