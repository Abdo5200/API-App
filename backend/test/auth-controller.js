const { expect } = require("chai");

const sinon = require("sinon");

const authController = require("../controller/auth");

const User = require("../models/user");

describe("Auth controller", function () {
  it("should throw an error if accessing the database fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@test.com",
        password: "123456",
      },
    };
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      });

    User.findOne.restore();
  });
});
