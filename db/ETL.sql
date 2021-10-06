-- ONLY RUN THIS FILE AFTER schema.sql has been set-up in postgres

-- STEP #1: In command line, type psql catwalkreviews

-- STEP #2: create 'data' directory in SDC directory; move csv data files into 'reviews.csv'
-- 'reviews_photos.csv 'chacteristics.csv' characteristic_reviews.csv'

-- Step #3: run SQL script below to load data into db


COPY reviews
FROM '/Users/kevin-yang/work/Project-Atelier-Reviews/data/reviews.csv'
WITH (FORMAT CSV, HEADER true, NULL 'null');

COPY photos
FROM '/Users/kevin-yang/work/Project-Atelier-Reviews/data/reviews_photos.csv'
WITH (FORMAT CSV, HEADER true, NULL 'null');

COPY characteristics
FROM '/Users/kevin-yang/work/Project-Atelier-Reviews/data/characteristics.csv'
WITH (FORMAT CSV, HEADER true, NULL 'null');

COPY reviews_characteristics
FROM '/Users/kevin-yang/work/Project-Atelier-Reviews/data/characteristic_reviews.csv'
WITH (FORMAT CSV, HEADER true, NULL 'null');

