-- ONLY RUN THIS FILE AFTER schema.sql has been set-up in postgres

-- STEP #1: In command line, type psql catwalkoverview

-- STEP #2: create 'data' directory in SDC directory; move csv data files into 'data'
-- product.csv, features.csv, related.csv, styles.csv, skus.csv, photos.csv

-- Step #3: run SQL script below to load data into db


COPY reviews
FROM '/Users/kevin-yang/work/Project-Atelier-Reviews/data/reviews.csv'
WITH (FORMAT CSV, HEADER true, NULL 'null');
