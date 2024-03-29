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
const endpoints = require("../endpoints.json");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
afterAll(() => connection.end());

describe("GET: /api/categories", () => {
  test("200: returns array of category objects with correct keys", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.categories)).toBe(true);
        expect(body.categories.length).toBeGreaterThan(0);
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
        expect(body.message).toBe("Not Found - review_id does not exist");
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
        expect(body.message).toBe("Not Found - review_id does not exist");
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
  test("200: now accepts limit as a query", () => {
    return request(app)
      .get("/api/reviews/3/comments?limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(2);
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
  test("200: now accepts p as a query", () => {
    return request(app)
      .get("/api/reviews/3/comments?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(0);
      });
  });
  test("400: bad request if limit is wrong", () => {
    return request(app)
      .get("/api/reviews/3/comments?limit=George")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, limit must be a number");
      });
  });
  test("400: bad request if p is wrong", () => {
    return request(app)
      .get("/api/reviews/3/comments?p=George")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, p must be a number");
      });
  });
  test("400: bad request if query is wrong", () => {
    return request(app)
      .get("/api/reviews/3/comments?George=3")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect method");
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
        expect(body.message).toBe("Not Found - review_id does not exist");
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
        expect(body.reviews.length).toBeGreaterThan(0);
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
        expect(body.reviews.length).toBeGreaterThan(0);
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
        expect(body.reviews.length).toBe(10);
        expect(body.reviews).toBeSortedBy("review_id", {
          descending: true,
          coerce: true,
        });
        expect(body.reviews[0]).toEqual({
          category: "social deduction",
          created_at: expect.any(String),
          designer: "Klaus Teuber",
          owner: "mallionaire",
          review_body:
            "You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.",
          review_id: 13,
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          title: "Settlers of Catan: Don't Settle For Less",
          votes: 16,
          total_count: 13,
          comment_count: 0,
        });
      });
  });
  test("200: endpoint now accepts query order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(10);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: false,
          coerce: true,
        });
        expect(body.reviews[0]).toEqual({
          category: "social deduction",
          created_at: expect.any(String),
          designer: "Klaus Teuber",
          owner: "mallionaire",
          review_body:
            "You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.",
          review_id: 13,
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          title: "Settlers of Catan: Don't Settle For Less",
          votes: 16,
          total_count: 13,
          comment_count: 0,
        });
      });
  });
  test("200: returns with all reviews with same category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBeGreaterThan(0);
        body.reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
      });
  });
  test("200: endpoint now accepts multiple queries", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(10);
        expect(body.reviews).toBeSortedBy("review_id", {
          descending: false,
          coerce: true,
        });
        expect(body.reviews[0]).toEqual({
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_id: 1,
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          title: "Agricola",
          votes: 1,
          total_count: 13,
          comment_count: 0,
        });
      });
  });
  test("200: endpoint now accepts query limit", () => {
    return request(app)
      .get("/api/reviews?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(5);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        expect(body.reviews[0]).toEqual({
          owner: "mallionaire",
          category: "social deduction",
          created_at: "2021-01-25T11:16:54.963Z",
          designer: "Avery Wunzboogerz",
          review_body:
            "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
          review_id: 7,
          review_img_url:
            "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          title: "Mollit elit qui incididunt veniam occaecat cupidatat",
          votes: 9,
          total_count: 13,
          comment_count: 0,
        });
      });
  });
  test("200: endpoint now accepts query p", () => {
    return request(app)
      .get("/api/reviews?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(3);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        expect(body.reviews[0]).toEqual({
          owner: "mallionaire",
          category: "social deduction",
          created_at: "2021-01-07T09:06:08.077Z",
          designer: "Seymour Buttz",
          review_body:
            "Labore occaecat sunt qui commodo anim anim aliqua adipisicing aliquip fugiat. Ad in ipsum incididunt esse amet deserunt aliqua exercitation occaecat nostrud irure labore ipsum. Culpa tempor non voluptate reprehenderit deserunt pariatur cupidatat aliqua adipisicing. Nostrud labore dolor fugiat sint consequat excepteur dolore irure eu. Anim ex adipisicing magna deserunt enim fugiat do nulla officia sint. Ex tempor ut aliquip exercitation eiusmod. Excepteur deserunt officia voluptate sunt aliqua esse deserunt velit. In id non proident veniam ipsum id in consequat duis ipsum et incididunt. Qui cupidatat ea deserunt magna proident nisi nulla eiusmod aliquip magna deserunt fugiat fugiat incididunt. Laboris nisi velit mollit ullamco deserunt eiusmod deserunt ea dolore veniam.",
          review_id: 5,
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          title: "Proident tempor et.",
          votes: 5,
          total_count: 13,
          comment_count: 0,
        });
      });
  });
  test("400: bad request if category does not exist", () => {
    return request(app)
      .get("/api/reviews?category=George")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad Request, Category does not exist");
      });
  });
  test("400: bad request if sort_by category does not exist", () => {
    return request(app)
      .get("/api/reviews?sort_by=George")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect sort_by");
      });
  });
  test("400: bad request if method is wrong", () => {
    return request(app)
      .get("/api/reviews?George=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect method");
      });
  });
  test("400: bad request if order is wrong", () => {
    return request(app)
      .get("/api/reviews?order=George")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect order");
      });
  });
  test("400: bad request if limit is wrong", () => {
    return request(app)
      .get("/api/reviews?limit=George")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, limit must be a number");
      });
  });
  test("400: bad request if p is wrong", () => {
    return request(app)
      .get("/api/reviews?p=George")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, p must be a number");
      });
  });
  test("400: bad request if method is wrong with multiple queries", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&George=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect method");
      });
  });
});

describe("POST: /api/reviews/:review_id/comments", () => {
  test("201: adds comment to the database and responds with newly created comment", () => {
    const newComment = {
      username: "mallionaire",
      body: "Amazing! I love it.",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        const postedComment = res.body.comment;
        expect(postedComment).toEqual(
          expect.objectContaining({
            comment_id: 7,
            body: "Amazing! I love it.",
            votes: 0,
            author: "mallionaire",
            review_id: 1,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400: does not post if username is incorrect", () => {
    const newComment = {
      username: "george",
      body: "Amazing! I love it.",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - Username does not exist");
      });
  });
  test("400: does not post if body is missing", () => {
    const newComment = {
      username: "mallionaire",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - Missing fields");
      });
  });
  test("404: does not post if review does not exist", () => {
    const newComment = {
      username: "mallionaire",
      body: "Incredible!!!",
    };
    return request(app)
      .post("/api/reviews/500/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found - review_id does not exist");
      });
  });
  test("ERROR 422: returns error if review_id is incorrect", () => {
    const newComment = {
      username: "mallionaire",
      body: "Incredible!!!",
    };
    return request(app)
      .post("/api/reviews/banana/comments")
      .expect(422)
      .send(newComment)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - request must be a number"
        );
      });
  });
  test("ERROR 422: returns error if body is incorrect", () => {
    const newComment = {
      username: "mallionaire",
      body: 12345,
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(422)
      .send(newComment)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - body must be a suitable review"
        );
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: responds with 204 and returns nothing", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("ERROR 404: returns comment does not exist if comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/500")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found - comment_id does not exist");
      });
  });
  test("ERROR 422: returns error if review_id is not a number", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - request must be a number"
        );
      });
  });
});

describe("GET /api", () => {
  test("200: returns an object with the list of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("GET: /api/users/:username", () => {
  test("200: returns a user object, with correct properties", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          user: {
            username: "mallionaire",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            name: "haz",
          },
        });
      });
  });
  test("ERROR 404: returns username does not exist if username does not exist", () => {
    return request(app)
      .get("/api/users/george")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found - username does not exist");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200, responds with the updated comment", () => {
    const commentUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/2")
      .send(commentUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          comment: {
            comment_id: 2,
            votes: 14,
            created_at: "2021-01-18T10:09:05.410Z",
            author: "mallionaire",
            body: "My dog loved this game too!",
            review_id: 3,
          },
        });
      });
  });
  test("ERROR 400, responds with the unchanged comment when passed no inc_votes", () => {
    return request(app)
      .patch("/api/comments/2")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          errorMessage: "Bad Request - Please provide inc_votes in request",
          comment: {
            comment_id: 2,
            votes: 13,
            created_at: "2021-01-18T10:09:05.410Z",
            author: "mallionaire",
            body: "My dog loved this game too!",
            review_id: 3,
          },
        });
      });
  });
  test("ERROR 422: if inc_votes is not a number", () => {
    const commentUpdate = { inc_votes: "George" };
    return request(app)
      .patch("/api/reviews/2")
      .send(commentUpdate)
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - request must be a number"
        );
      });
  });
  test("ERROR 404: returns review does not exist if review_id does not exist", () => {
    const commentUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/500")
      .send(commentUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found - comment_id does not exist");
      });
  });
  test("ERROR 404: returns review does not exist if review_id is not a number", () => {
    const commentUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/george")
      .send(commentUpdate)
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - request must be a number"
        );
      });
  });
});

describe("POST: /api/reviews", () => {
  test("201: adds review to the database and responds with newly created review", () => {
    const newReview = {
      category: "euro game",
      designer: "George Worsnop",
      owner: "mallionaire",
      review_body: "Incredible, amazing, a delight.",
      title: "George's Amazing Game!",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(201)
      .then((res) => {
        const postedReview = res.body.review;
        expect(postedReview).toEqual(
          expect.objectContaining({
            category: "euro game",
            designer: "George Worsnop",
            owner: "mallionaire",
            review_body: "Incredible, amazing, a delight.",
            title: "George's Amazing Game!",
            votes: 0,
            created_at: expect.any(String),
            review_id: 14,
            review_img_url:
              "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          })
        );
      });
  });
  test("ERROR 400: does not post if username is incorrect", () => {
    const newReview = {
      category: "euro game",
      designer: "George Worsnop",
      owner: "GWorsnop",
      review_body: "Incredible, amazing, a delight.",
      title: "George's Amazing Game!",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - Username does not exist");
      });
  });
  test("ERROR 400: does not post if any part of req object is missing", () => {
    const newReview = {
      category: "euro game",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - Missing fields");
      });
  });
  test("ERROR 422: returns error if body is incorrect", () => {
    const newReview = {
      category: "euro game",
      designer: 12345,
      owner: "mallionaire",
      review_body: "Incredible, amazing, a delight.",
      title: "George's Amazing Game!",
    };
    return request(app)
      .post("/api/reviews")
      .expect(422)
      .send(newReview)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - Your comment object must only contain strings"
        );
      });
  });
});

describe("POST: /api/categories", () => {
  test("201: adds category to the database and responds with newly created category", () => {
    const newCategory = {
      slug: "co-operative game",
      description:
        "Players work together to achieve a common goal rather than competing against each other.",
    };
    return request(app)
      .post("/api/categories")
      .send(newCategory)
      .expect(201)
      .then((res) => {
        const postedCategory = res.body.category;
        expect(postedCategory).toEqual(
          expect.objectContaining({
            slug: "co-operative game",
            description:
              "Players work together to achieve a common goal rather than competing against each other.",
          })
        );
      });
  });
  test("ERROR 400: does not post if any part of req object is missing", () => {
    const newCategory = {
      slug: "co-operative game",
    };
    return request(app)
      .post("/api/categories")
      .send(newCategory)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - Missing fields");
      });
  });
  test("ERROR 422: returns error if body is incorrect", () => {
    const newCategory = {
      slug: "euro game",
      description: 12345,
    };
    return request(app)
      .post("/api/categories")
      .expect(422)
      .send(newCategory)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - Your comment object must only contain strings"
        );
      });
  });
});
describe("DELETE: /api/reviews/:review_id", () => {
  test("204: responds with 204 and returns nothing", () => {
    return request(app).delete("/api/reviews/1").expect(204);
  });
  test("ERROR 404: returns comment does not exist if review_id does not exist", () => {
    return request(app)
      .delete("/api/reviews/500")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found - review_id does not exist");
      });
  });
  test("ERROR 422: returns error if review_id is not a number", () => {
    return request(app)
      .delete("/api/reviews/banana")
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Unprocessable Entity - request must be a number"
        );
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
  test("ERROR 405: returns method not allowed if wrong method written on endpoint", () => {
    return request(app)
      .post("/api")
      .expect(405)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Not Allowed - Method not allowed on this endpoint"
        );
      });
  });
});
