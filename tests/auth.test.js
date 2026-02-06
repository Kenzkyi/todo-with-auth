const request = require("supertest");
const app = require("../app");
const db = require("./db");
const User = require("../models/users");

beforeAll(async () => {
  await db.connect();
}, 10000);

afterEach(async () => {
  await db.clear();
}, 10000);

afterAll(async () => {
  await db.disconnect();
}, 10000);

describe("Authentication Tests", () => {
  it("should register", async () => {
    const data = "username=test&password=testing&confirmPassword=testing";
    const response = await request(app).post("/v1/auth/sign-up").send(data);
    const users = await User.find({ username: "test" });

    expect(response.status).toBe(302);
    expect(users.length).toBe(1);
    expect(response.headers.location).toBe("/");
  });
  it("should login", async () => {
    const data = "username=test&password=testing&confirmPassword=testing";
    const loginData = "username=test&password=testing";
    await request(app).post("/v1/auth/sign-up").send(data);

    const response = await request(app).post("/v1/auth/login").send(loginData);
    const cookie = response.headers["set-cookie"][0];
    const session = await request(app).get("/my-todo").set("cookie", cookie);

    expect(response.status).toBe(302);
    expect(response.headers["set-cookie"][0]).toBeDefined();
    expect(response.headers.location).toBe("/my-todo");
    expect(session.statusCode).toBe(200);
  });
  it("should logout", async () => {
    const data = "username=test&password=testing&confirmPassword=testing";
    const loginData = "username=test&password=testing";
    await request(app).post("/v1/auth/sign-up").send(data);
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send(loginData);
    const cookie = loginResponse.headers["set-cookie"][0];

    const response = await request(app)
      .post("/v1/auth/logout")
      .set("cookie", cookie);
    const session = await request(app).get("/my-todo").set("cookie", cookie);
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/");
    expect(session.statusCode).toBe(302);
  });
});
