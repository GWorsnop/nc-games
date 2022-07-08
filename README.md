# NC-Games API : My back-end project

## Introduction

I have built an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

This API uses _routers_ in order to help breakdown the logic into sub routers.
Similarly, the API uses error handling middleware that is separated into it's own file.
All of these should aid in the reading of this API with no loss of functionality.

---

## Access the hosted API

### This API is hosted on Heroku at [NC-Games-API](https://nc-games-GWorsnop.herokuapp.com/)

This API returns JSON objects.
To ease viewing you will need the Chrome (or equivalent) extension - JSON viewer.

---

## Set-up to access this project without hosting

- This API can be accessed via forking from my repository on Github.
  Upon cloning, please use **npm install** in the terminal to install the necessary packages. These can be found in the package.json file.

- As the database is in PSQL format, it requires `.env.test` and `env.development` files in order to run successfully.
- The `dotenv` package loads the variables defined in the `.env` file in the current working directory and sets them as environment variables.

- ### In order to use this repo, **you will need to create `.env` files yourself**.

- See below for the files created and their required content.

- ### .env.test - PGDATABASE=nc_games_test

- ### .env.development - PGDATABASE=nc_games

- Once you have done everything above, **you will need to seed the database yourself**.
  This can be done with the `setup-dbs` script in your terminal.

---

## Current available endpoints

_This is a summary of all the endpoints. More detail about each endpoint is further down this document._

```http
GET /
GET /api
GET /api/categories
POST /api/categories
GET /api/users
GET /api/users/:username
GET /api/reviews
POST /api/reviews
GET /api/reviews/:review_id
PATCH /api/reviews/:review_id
DELETE /api/reviews/:review_id
GET /api/reviews/:review_id/comments
POST /api/reviews/:review_id/comments
PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id
```

---

#### **GET /**

Responds with:

- JSON welcome message, detailing how to access the /api endpoint.

---

#### **GET /api**

Responds with:

- JSON describing all the available endpoints on your API

---

#### **GET /api/categories**

Responds with:

- an array of category objects, each of which has the following properties:
  - `slug`
  - `description`

---

#### **POST /api/categories**

Request body accepts:

- an object with the following properties:
  - `slug`
  - `description`

Responds with:

- the posted category - in the same format as `GET /api/categories`

---

#### **GET /api/users**

Responds with:

- an array of objects, each object should have the following property:
  - `username`
  - `avatar_url`
  - `name`

---

#### **GET /api/users/:username**

Responds with:

- a specific user object, based on the username parameter, which has the following properties:
  - `username`
  - `avatar_url`
  - `name`

---

#### **GET /api/reviews**

Responds with:

- a `reviews` array of review objects, each of which have the following properties:

  - `owner` which references the `username` from the users table
  - `title`
  - `review_id`
  - `category`
  - `review_img_url`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this review_id
  - `total_count` which the total number of reviews with any filters applied

This endpoint accepts the following queries:

- `sort_by`, which sorts the reviews by any valid column (defaults to created_at)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `category`, which filters the reviews by the category value specified in the query
- `limit`, which limits the number of responses (defaults to 10)
- `p`, (stands for page) which specifies the page at which to start

---

#### **POST /api/reviews**

Request body accepts:

- an object with the following properties:
  - `owner` which references the `username` from the users table
  - `title`
  - `body`
  - `designer`
  - `category` which references the `category` from the categories table

Responds with:

- the posted review - in the same format as `GET /api/reviews/:review_id`

---

#### **GET /api/reviews/:review_id**

Responds with:

- a specific review object, based on the review_id parameter, which has the following properties:

  - `owner` which references the `username` from the users table
  - `title`
  - `review_id`
  - `review_body`
  - `designer`
  - `review_img_url`
  - `category`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this review_id

---

#### **PATCH /api/reviews/:review_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current review's vote property by 1

  `{ inc_votes : -100 }` would decrement the current review's vote property by 100

Responds with:

- the updated review - in the same format as `GET /api/reviews/:review_id`

---

#### **DELETE /api/reviews/:review_id**

Should:

- delete the given review by `review_id`

Responds with:

- status 204 and no content

---

#### **GET /api/reviews/:review_id/comments**

Responds with:

- an array of comments for the given `review_id`, each comment has the following properties:

  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which references the `username` from the users table
  - `body`

This endpoint accepts the following queries:

- `limit`, which limits the number of responses (defaults to 10)
- `p`, (stands for page) which specifies the page at which to start

---

#### **POST /api/reviews/:review_id/comments**

Request body accepts:

- an object with the following properties:
  - `username`
  - `body`

Responds with:

- the posted comment - in the same format as `GET /api/reviews/:review_id/comments`

---

#### **PATCH /api/comments/:comment_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current comment's vote property by 1

  `{ inc_votes : -100 }` would decrement the current comment's vote property by 100

Responds with:

- the updated comment - in the same format as `GET /api/reviews/:review_id/comments`

---

#### **DELETE /api/comments/:comment_id**

Should:

- delete the given comment by `comment_id`

Responds with:

- status 204 and no content

---
