const db = require('../db/pool.js');

module.exports = {
  getReviews: (req, res) => {
    const productId = req.query.product_id || req.params.product_id;
    const page = req.query.page || req.params.page || 1;
    const count = req.query.count || req.params.count || 5;
    const sort = req.query.sort || req.params.sort || 'relevant'

    let orderBy;
    if (sort === 'newest') {
      orderBy = 'reviews.date DESC';
    } else if (sort === 'helpful') {
      orderBy = 'reviews.helpfulness DESC';
    } else {
      orderBy = 'reviews.helpfulness DESC, reviews.date DESC';
    }

    const str = `
    SELECT JSON_BUILD_OBJECT (
      'product', ${productId},
      'page', ${page},
      'count', ${count},
      'results', (SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'review_id', reviews.id,
          'rating', reviews.rating,
          'summary', reviews.summary,
          'recommend', reviews.recommend,
          'response', reviews.response,
          'body', reviews.body,
          'date', TO_TIMESTAMP(CAST(reviews.date/1000 AS BIGINT)),
          'reviewer_name', reviews.reviewer_name,
          'helpfulness', reviews.helpfulness,
          'photos', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', photos.id,
                'url', photos.url
              )
            )
            FROM photos
            WHERE photos.review_id = reviews.id
          )
        ) ORDER BY ${orderBy}
      )
      FROM reviews
      WHERE reviews.product_id = $1 AND reviews.reported = false
      )
    )
    reviews;
  `;

    db.query(str, [productId])
      .then(info => {
        res.send(info.rows[0].reviews);
      })
      .catch(err => {
        res.status(404).send(err);
      });
  },

  getReviewsMeta: (req, res) => {
    const productId = req.query.product_id || req.params.product_id;
    // Given a product ID
    // Query for the characteristics associated with productID
    // Query for the values for the given characteristics using characteristics_reviews table
    const str = `
    SELECT
    *
    FROM (
      SELECT
      	JSON_BUILD_OBJECT('true', COUNT(recommend), 'false', (
      		SELECT
		  			COUNT(recommend)
			  		FROM reviews
			  	WHERE
				  	product_id = $1
				  	AND recommend = FALSE)) AS recommended
	  FROM reviews
	  WHERE product_id = $1 AND recommend = TRUE) recommendedObject,
    (
		  SELECT
			  JSON_STRIP_NULLS (JSON_BUILD_OBJECT(
          1, SUM(
					  	CASE WHEN rating = 1
              THEN 1
					  	ELSE NULL
				  		END),
          2, SUM(
						  CASE WHEN rating = 2
              THEN 1
						  ELSE NULL
						  END),
          3, SUM(
					  	CASE WHEN rating = 3
              THEN 1
						  ELSE NULL
						  END),
          4, SUM(
						  CASE WHEN rating = 4
              THEN 1
						  ELSE NULL
					    END),
          5, SUM(
						  CASE WHEN rating = 5
              THEN 1
						  ELSE NULL
						  END)
          )) AS ratings
		FROM reviews
		WHERE product_id = $1) ratingsObject,
    (
			SELECT
				JSONB_OBJECT_AGG(inner_characteristics.name, characteristics_list) AS characteristics
			FROM (
				SELECT
					c.name,
					JSON_BUILD_OBJECT('value', AVG(rc.value), 'id', c.id) AS characteristics_list
				FROM
					characteristics c
					INNER JOIN reviews_characteristics rc ON c.id = rc.characteristic_id
				WHERE
					c.product_id = $1
				GROUP BY
					c.id) AS inner_characteristics) characteristicsObject
    `;
    db.query(str, [productId])
      .then(info => {
        res.send(info.rows[0]);
      })
      .catch(err => {
        res.status(404).send(err);
      });
  },

  addReview: (req, res) => {
    let photosArr = [];
    for (let i = 0; i < req.body.photos.length; i++) {
      photosArr.push(`((SELECT id FROM ins1), '${req.body.photos[i]}')`);
    }
    ['hi', 'bye', 'url3']
    const photos = photosArr.join(', ');
    let characteristicKeys = Object.keys(req.body.characteristics);
    let rcArray = [];
    for (let j = 0; j < characteristicKeys.length; j++) {
      rcArray.push((`((SELECT id FROM ins1), ${characteristicKeys[j]}, ${req.body.characteristics[characteristicKeys[j]]})`));
    }
    const rc = rcArray.join(', ');

    const str = `
    WITH ins1 AS (
      INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
      VALUES ($1, $2, EXTRACT(EPOCH FROM CURRENT_TIMESTAMP(3)) * 1000, $3, $4, $5, $6, $7)
      RETURNING id
      )
      , ins2 AS (
      INSERT INTO reviews_characteristics(review_id, characteristic_id, value)
      VALUES
        ${rc}
      )
      INSERT INTO photos(review_id, url)
      VALUES
        ${photos};
    `;
    db.query(str, [req.body.product_id, req.body.rating, req.body.summary, req.body.body, req.body.recommend, req.body.name, req.body.email])
      .then(() => {
        res.sendStatus(201);
      })
      .catch(err => {
        res.status(404).send(err);
      });
  },

  helpfulReview: (req, res) => {
    const reviewId = req.params.review_id;
    const str = `UPDATE reviews SET helpfulness=helpfulness+1 WHERE id=$1`
    db.query(str, [reviewId])
      .then (() => {
        res.sendStatus(204)
      })
      .catch ((err) => {
        res.status(404).send(err);
      })
  },

  reportReview: (req, res) => {
    const reviewId = req.params.review_id;
    const str = `UPDATE reviews SET reported=true WHERE id=$1`
    db.query(str, [reviewId])
      .then (() => {
        res.sendStatus(204)
      })
      .catch ((err) => {
        res.status(404).send(err);
      })
  }
}

// WITH ratings AS (
//   SELECT rating, recommend, id AS review_id
//   FROM reviews
//   WHERE reviews.product_id = ${productId}
// ), characteristic AS (
//   SELECT name, id AS characteristic_id
//   FROM characteristics
//   WHERE characteristics.product_id = ${productId}
// ), characteristics_id AS (
//   SELECT value
//   FROM reviews_characteristics
//   WHERE reviews_characteristics.characteristic_id = characteristic_id
// )
// SELECT rating,
//        recommend,
//        name,
//        characteristic_id,
//        value
// FROM ratings, characteristic, characteristics_id
// GROUP BY ratings.rating, ratings.recommend, characteristic.name, characteristic.characteristic_id, characteristics_id.value;


// SELECT r.rating, r.recommend, c.name, rc.id, rc.value
// FROM reviews r, characteristics c, reviews_characteristics rc
// WHERE r.product_id=${productId} AND c.product_id=${productId} AND rc.characteristic_id=c.id
// GROUP BY  rc.id, r.rating, r.recommend, c.name, rc.value;

// INNER JOIN reviews ON rc.review_id = reviews.id


// SELECT JSON_BUILD_OBJECT(
//   'counts', (
//     SELECT JSONB_AGG(
//       JSON_BUILD_OBJECT(
//         'ratings', reviews.rating,
//         'recommend', reviews.recommend
//       )
//     )
//     FROM reviews
//     WHERE reviews.product_id = ${productId}
//   ),
//   'characteristics', (
//     SELECT JSONB_OBJECT_AGG(
//       c.name, JSON_BUILD_OBJECT(
//         'id', rc.characteristic_id
//         'value', rc.value
//       )
//     )
//     FROM characteristics c, reviews_characteristics rc
//     WHERE c.product_id = ${productId} AND reviews_characteristics.review_id = reviews.id
//   )
// )
// FROM reviews
// WHERE reviews.product_id = ${productId}
// GROUP BY reviews.id;