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
          "Unprocessable Entity - request must be a number"
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

describe("GET: /api/reviews/:review_id/comments", () => {
  test("200: returns array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(3);
        expect(body.comments[0]).toEqual({
          comment_id: 2,
          votes: 13,
          created_at: "2021-01-18T10:09:05.410Z",
          author: "mallionaire",
          body: "My dog loved this game too!",
          review_id: 3,
        });
      });
  });
  test("200: returns empty array when there are no comments for this review_id", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(0);
      });
  });
  test("ERROR 422: returns error if review_id is incorrect", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - request must be a number"
        );
      });
  });
  test("ERROR 404: returns review does not exist if review_id does not exist", () => {
    return request(app)
      .get("/api/reviews/500/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - review_id does not exist");
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
  test("200: endpoint now accepts query sort_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(13);
        expect(body.reviews[0]).toEqual({
          review_id: 1,
          title: "",
          category: "",
          designer: "",
          owner: "",
          review_body: "",
          review_img_url: "",
          created_at: "",
          votes: "",
          comment_count: "",
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
