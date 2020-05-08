const express = require("express");
const app = express();
const request = require("supertest");
const connectDB = require("../config/db");
const userRoute = require("../routes/api/users");
let allUsersresponse = require("./mocks.js");
const User = require("../models/userModel");

app.use(express.json());

beforeAll(async () => {
  // Connect to a Mongo DB
  await connectDB();
}, 1000000);

afterAll(async () => {
  // Removes the User collection
  await User.deleteMany({});
});

app.use(express.urlencoded({ extended: false }));
app.use("/", userRoute);

it("Should send no User if DB is Empty", async (done) => {
  const res = await request(app).get("/");
  expect(res.body).toEqual({ message: "No Users" });
  done();
});

it("Should save user to database", async (done) => {
  const response = await request(app).post("/").send({
    name: "Zell",
    email: "testing@gmail.com",
    password: "12345",
  });
  expect(response.body).toEqual({ message: "User Resgisterd Sucessfully" });
  done();
});

it("Should throw error if body is not correct", async (done) => {
  const response = await request(app).post("/").send({
    name: "",
    email: "testing@gmail.com",
    password: "12345",
  });
  expect(response.error).toBeTruthy();
  done();
});

it("Should throw error if user already exists", async (done) => {
  const response = await request(app).post("/").send({
    name: "Zell",
    email: "testing@gmail.com",
    password: "12345",
  });
  expect(response.error).toBeTruthy();
  done();
});

it("Should fetch user from database", async (done) => {
  const res = await request(app).get("/");
  expect(res.body[0].name).toEqual(allUsersresponse[0].name);
  expect(res.body[0].email).toEqual(allUsersresponse[0].email);
  expect(res.body[0].password).toEqual(allUsersresponse[0].password);
  done();
});
