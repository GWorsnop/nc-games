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
