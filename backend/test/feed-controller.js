const { expect } = require("chai");

const sinon = require("sinon");

const User = require("../models/user");

const Post = require("../models/post");

const feedController = require("../controller/feed");

const io = require("../socket");

const mongoose = require("mongoose");

describe("Feed Controller", function () {
  before(function (done) {
    sinon.stub(io, "getIO").returns({ emit: () => {} });
    mongoose
      .connect(process.env.MONGODB_TEST)
      .then(() => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "6862fab980fb006521db87ce",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  it("should send a response with a valid user status for an existing user", function (done) {
    const req = {
      userId: "6862fab980fb006521db87ce",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    feedController
      .getStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I am new!");
        done();
      });
  });
  it("should add a created post to the posts of the creator", function (done) {
    const req = {
      body: {
        title: "some title",
        content: "some content",
      },
      userId: "6862fab980fb006521db87ce",
      file: {
        path: "a path",
      },
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };
    feedController
      .createPost(req, res, () => {})
      .then((savedUser) => {
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);
        done();
      });
  });

  after(function (done) {
    sinon.restore();
    User.deleteMany({})
      .then(() => {
        mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
