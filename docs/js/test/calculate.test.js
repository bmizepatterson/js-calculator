"use strict";

describe("The calculate() function", function () {
  beforeEach(function () {
    operand1 = '3';
    operand2 = '2';
  });
  afterEach(function () {
    operand1 = null;
    operand2 = null;
    operator = null;
  });
  it("handles addition.", function () {
    operator = '+';
    expect(calculate()).to.equal('5');
  });
  it("handles subtraction.", function () {
    operator = '-';
    expect(calculate()).to.equal('1');
  });
  it("handles multiplication.", function () {
    operator = 'x';
    expect(calculate()).to.equal('6');
  });
  it("handles division.", function () {
    operator = '/';
    expect(calculate()).to.equal('1.5');
  });
  it("handles decimal numbers.", function () {
    operand1 = '4.4';
    operator = '+';
    expect(calculate()).to.equal('6.4');
  });
  it("handles negative numbers.", function () {
    operand1 = "-4";
    operator = "+";
    expect(calculate()).to.equal('-2');
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