const request = require("supertest");
const app = require("../app");
const db = require("./db");
const Task = require("../models/tasks");
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

describe("Tasks API", () => {
  let cookie;
  beforeAll(async () => {
    const data = "username=test&password=testing&confirmPassword=testing";
    const loginData = "username=test&password=testing";
    await request(app).post("/v1/auth/sign-up").send(data);

    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send(loginData);
    cookie = loginResponse.headers["set-cookie"][0];
  });

  it("Retrieve all tasks", async () => {
    const response = await request(app).get("/v1/tasks").set("Cookie", cookie);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.message).toBe("All tasks retrieved successfully");
  });

  it("Create a task", async () => {
    const signupData = "username=test&password=testing&confirmPassword=testing";
    await request(app).post("/v1/auth/sign-up").send(signupData);

    const data = "title=a new born baby";
    const response = await request(app)
      .post("/v1/tasks")
      .set("cookie", cookie)
      .send(data);

    const taskInDB = await Task.find({
      title: "a new born baby",
    });
    expect(response.headers.location).toBe("/my-todo");
    expect(response.statusCode).toBe(302);
    expect(taskInDB.length).toBe(1);
  });

  it("Complete a task", async () => {
    const signupData = "username=test&password=testing&confirmPassword=testing";
    await request(app).post("/v1/auth/sign-up").send(signupData);

    const data = "title=a new born baby";
    await request(app).post("/v1/tasks").set("cookie", cookie).send(data);

    const task = await Task.find({ title: "a new born baby" });

    const task_id = task[0]._id;

    const response = await request(app)
      .patch(`/v1/tasks/${task_id}`)
      .send("status=completed")
      .set("Cookie", cookie);

    const newTodo = await Task.findById(task_id);

    expect(newTodo.status).toBe("completed");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeTruthy();
    expect(response.body.data.status).toBe("completed");
  });

  it("Edit a task", async () => {
    const signupData = "username=test&password=testing&confirmPassword=testing";
    await request(app).post("/v1/auth/sign-up").send(signupData);

    const data = "title=a new born baby";
    await request(app).post("/v1/tasks").set("cookie", cookie).send(data);

    const task = await Task.find({ title: "a new born baby" });

    const task_id = task[0]._id;

    const response = await request(app)
      .patch(`/v1/tasks/${task_id}`)
      .send("title=i want to play")
      .set("Cookie", cookie);

    const newTodo = await Task.findById(task_id);

    expect(newTodo.title).toBe("i want to play");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeTruthy();
    expect(response.body.data.title).toBe("i want to play");
  });

  it("Delete a task", async () => {
    const signupData = "username=test&password=testing&confirmPassword=testing";
    await request(app).post("/v1/auth/sign-up").send(signupData);

    const data = "title=a new born baby";
    await request(app).post("/v1/tasks").set("cookie", cookie).send(data);

    const task = await Task.find({ title: "a new born baby" });

    const task_id = task[0]._id;

    const response = await request(app)
      .patch(`/v1/tasks/${task_id}`)
      .send("status=deleted")
      .set("Cookie", cookie);

    const newTodo = await Task.findById(task_id);

    expect(newTodo.status).toBe("deleted");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeTruthy();
    expect(response.body.data.status).toBe("deleted");
  });
});
