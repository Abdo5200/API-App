const authMiddleware = require("../middleware/is-auth");

const jwt = require("jsonwebtoken");

const sinon = require("sinon");

const { expect } = require("chai");

describe("Auth middleware", function () {
  it("should throw an error if no authorization header is set", function () {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not Authenticated"
    );
  });
  it("should throw an error if the authorization is only one string", function () {
    const req = {
      get: function () {
        return "abcde";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
  it("should have userId property after decoding the token", function () {
    const req = {
      get: function () {
        return "Bearer abcde";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
  it("should throw an error if the token can't be verified", function () {
    const req = {
      get: function () {
        return "Bearer abcde";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
