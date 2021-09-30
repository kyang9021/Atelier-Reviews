DROP DATABASE IF EXISTS catwalkReviews;
CREATE DATABASE catwalkReviews;

CREATE TABLE reviews(
  id SERIAL,
  product_id INTEGER NOT NULL,
  rating SMALLINT NOT NULL,
  summary VARCHAR(60) DEFAULT NULL,
  recommend BOOLEAN DEFAULT 'false',
  reported BOOLEAN DEFAULT 'false',
  response VARCHAR(1000) DEFAULT NULL,
  body VARCHAR(1000) NOT NULL,
  date BIGINT NOT NULL,
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(60) NOT NULL,
  helpfulness SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

-- ---
-- Table 'photos'
--
-- ---

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  id SERIAL UNIQUE,
  review_id INTEGER
  url VARCHAR,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS characteristics;

CREATE TYPE features AS ENUM ('Size', 'Width', 'Comfort', 'Quality', 'Length', 'Fit');
CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name features
)

DROP TABLE IF EXISTS reviews_characteristics;

CREATE TABLE reviews_characteristics (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER,
  review_id INTEGER,
  value SMALLINT
)

-- ---
-- Foreign Keys
-- ---

ALTER TABLE photos ADD CONSTRAINT photos_review_id_fkey FOREIGN KEY (review_id) REFERENCES review(id);
ALTER TABLE reviews_characteristics ADD CONSTRAINT reviews_characteristics_characteristic_id_fkey FOREIGN KEY (characteristic_id) REFERENCES characteristics(id);
ALTER TABLE reviews_characteristics ADD CONSTRAINT reviews_characteristics_characteristic_id_fkey FOREIGN KEY (review_id) REFERENCES review(id);
