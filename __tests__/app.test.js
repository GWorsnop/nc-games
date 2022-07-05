const seed = require("../db/seeds/seed");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");
const connection = require("../db/connection");
const request = require("supertest");
const app = require("../app/app");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
afterAll(() => connection.end());

describe("GET: /api/categories", () => {
  test("200: returns array of category objects with correct keys", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.categories)).toBe(true);
        body.categories.forEach((category) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET: /api/reviews/:review_id", () => {
  test("200: returns a review object, with correct properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          review: {
            review_id: 1,
            title: "Agricola",
            category: "euro game",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1,
            comment_count: 0,
          },
        });
      });
  });
  test("ERROR 404: returns review does not exist if review_id does not exist", () => {
    return request(app)
      .get("/api/reviews/500")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - review_id does not exist");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200, responds with the updated review", () => {
    const reviewUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          review: {
            review_id: 1,
            title: "Agricola",
            category: "euro game",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 2,
          },
        });
      });
  });
  test("ERROR 400, responds with the unchanged review when passed no inc_votes", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          errorMessage: "Bad Request - Please provide inc_votes in request",
          review: {
            review_id: 1,
            title: "Agricola",
            category: "euro game",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1,
            comment_count: 0,
          },
        });
      });
  });
  test("ERROR 422: if inc_votes is not a number", () => {
    const reviewUpdate = { inc_votes: "George" };
    return request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - inc_votes must be a number"
        );
      });
  });
  test("ERROR 404: returns review does not exist if review_id does not exist", () => {
    const reviewUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/500")
      .send(reviewUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - review_id does not exist");
      });
  });
});
describe("GET: /api/users", () => {
  test("200: returns array of user objects with correct keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET: /api/reviews", () => {
  test("200: returns array of review objects with correct keys", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        body.reviews.forEach((review) => {
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: returns reviews ordered by date descending by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
});

describe("Generic errors of API", () => {
  test("ERROR 404: returns bad path if wrong endpoint written", () => {
    return request(app)
      .get("/api/categorys")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found");
      });
  });
});
