\c nc_games_test

SELECT *, count(*) OVER()::INT AS total_count
FROM reviews;