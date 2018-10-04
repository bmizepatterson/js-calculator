"use strict";

describe("The calculate() function", function () {
  beforeEach(function () {
    operand1 = null;
    operand2 = null;
  });
  afterEach(function () {
    operand1 = null;
    operand2 = null;
  });
  describe("performs addition correctly:", function () {
    beforeEach(function () {
      operator = '+';
    });
    afterEach(function () {
      operator = null;
    });
    it("2 + 3 = 5", function () {
      operand1 = "2";
      operand2 = "3";
      expect(calculate()).to.equal("5");
    });
    it("8 + 9 = 17", function () {
      operand1 = "8";
      operand2 = "9";
      expect(calculate()).to.equal("17");
    });
    it("89 + 98 = 187", function () {
      operand1 = "89";
      operand2 = "98";
      expect(calculate()).to.equal("187");
    });
    it("-4 + 5 = 1", function () {
      operand1 = "-4";
      operand2 = "5";
      expect(calculate()).to.equal("1");
    });
    it("-4 + 3 = -1", function () {
      operand1 = "-4";
      operand2 = "3";
      expect(calculate()).to.equal("-1");
    });
    it("-4 + 4 = 0", function () {
      operand1 = "-4";
      operand2 = "4";
      expect(calculate()).to.equal("0");
    });
    it("0.2 + 0.4 = 0.6", function () {
      operand1 = "0.2";
      operand2 = "0.4";
      expect(calculate()).to.equal("0.6");
    });
    it("0.2 + 0.04 = 0.24", function () {
      operand1 = "0.2";
      operand2 = "0.04";
      expect(calculate()).to.equal("0.24");
    });
    it("0.001 + 0.009 = 0.01", function () {
      operand1 = "0.001";
      operand2 = "0.009";
      expect(calculate()).to.equal("0.01");
    });
  });
  describe("performs subtraction correctly:", function () {
    beforeEach(function () {
      operator = '-';
    });
    afterEach(function () {
      operator = null;
    });
    it("3 - 2 = 1", function () {
      operand1 = "3";
      operand2 = "2";
      expect(calculate()).to.equal("1");
    });
    it("2 - 3 = -1", function () {
      operand1 = "2";
      operand2 = "3";
      expect(calculate()).to.equal("-1");
    });
    it("98 - 98 = 0", function () {
      operand1 = "98";
      operand2 = "98";
      expect(calculate()).to.equal("0");
    });
    it("-4 - 5 = -9", function () {
      operand1 = "-4";
      operand2 = "5";
      expect(calculate()).to.equal("-9");
    });
    it("0.4 - 0.3 = 0.1", function () {
      operand1 = "0.4";
      operand2 = "0.3";
      expect(calculate()).to.equal("0.1");
    });
    it("0.2 - 0.04 = 0.16", function () {
      operand1 = "0.2";
      operand2 = "0.04";
      expect(calculate()).to.equal("0.16");
    });
    it("0.01 - 0.009 = 0.001", function () {
      operand1 = "0.01";
      operand2 = "0.009";
      expect(calculate()).to.equal("0.001");
    });
  });
  describe("performs multiplication correctly:", function () {
    beforeEach(function () {
      operator = 'x';
    });
    afterEach(function () {
      operator = null;
    });
    it("2 * 3 = 6", function () {
      operand1 = "2";
      operand2 = "3";
      expect(calculate()).to.equal("6");
    });
    it("8 * 9 = 72", function () {
      operand1 = "8";
      operand2 = "9";
      expect(calculate()).to.equal("72");
    });
    it("89 * 98 = 8722", function () {
      operand1 = "89";
      operand2 = "98";
      expect(calculate()).to.equal("8722");
    });
    it("-4 * 5 = -20", function () {
      operand1 = "-4";
      operand2 = "5";
      expect(calculate()).to.equal("-20");
    });
    it("-4 * -3 = 12", function () {
      operand1 = "-4";
      operand2 = "-3";
      expect(calculate()).to.equal("12");
    });
    it("0.2 * 0.4 = 0.08", function () {
      operand1 = "0.2";
      operand2 = "0.4";
      expect(calculate()).to.equal("0.08");
    });
    it("0.2 * 0.04 = 0.008", function () {
      operand1 = "0.2";
      operand2 = "0.04";
      expect(calculate()).to.equal("0.008");
    });
    it("100 * 0.009 = 0.9", function () {
      operand1 = "100";
      operand2 = "0.009";
      expect(calculate()).to.equal("0.9");
    });
  });
  describe("performs division correctly:", function () {
    beforeEach(function () {
      operator = '/';
    });
    afterEach(function () {
      operator = null;
    });
    it("6 / 2 = 3", function () {
      operand1 = "6";
      operand2 = "2";
      expect(calculate()).to.equal("3");
    });
    it("72 / 8 = 9", function () {
      operand1 = "72";
      operand2 = "8";
      expect(calculate()).to.equal("9");
    });
    it("98 / 89 = 1.1011236", function () {
      operand1 = "98";
      operand2 = "89";
      expect(calculate()).to.equal("1.1011236");
    });
    it("-20 / -4 = 5", function () {
      operand1 = "-20";
      operand2 = "-4";
      expect(calculate()).to.equal("5");
    });
    it("-12 / 3 = -4", function () {
      operand1 = "-12";
      operand2 = "3";
      expect(calculate()).to.equal("-4");
    });
    it("0.2 / 0.04 = 5", function () {
      operand1 = "0.2";
      operand2 = "0.04";
      expect(calculate()).to.equal("5");
    });
    it("0.9 / 100 = 0.009", function () {
      operand1 = "0.9";
      operand2 = "100";
      expect(calculate()).to.equal("0.009");
    });
  });
  it("returns undefined when operator is not set.", function () {
    expect(calculate()).to.be.undefined;
  });
  it("returns null when operator is not set to an operator.", function () {
    operator = 'Q';
    expect(calculate()).to.be.null;
  });
  it("returns undefined when an operand is not set.", function () {
    operand1 = null;
    expect(calculate()).to.be.undefined;
    operand2 = null;
    expect(calculate()).to.be.undefined;
  });
  it("returns undefined when an operand is not a digit.", function () {
    operand1 = "foo";
    expect(calculate()).to.be.undefined;
  });
});