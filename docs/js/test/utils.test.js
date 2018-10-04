"use strict";

describe("Utility function", function () {
  describe("isNumeric", function () {
    it("returns true for digits.", function () {
      for (var i = 0; i < 10; i++) {
        expect(isNumeric(i)).to.be.true;
      }
    });
    it("returns false for operators.", function () {
      expect(isNumeric('+')).to.be.false;
      expect(isNumeric('-')).to.be.false;
      expect(isNumeric('/')).to.be.false;
      expect(isNumeric('x')).to.be.false;
    });
    it("returns false for equals.", function () {
      expect(isNumeric('=')).to.be.false;
    });
    it("returns false for the decimal point.", function () {
      expect(isNumeric('.')).to.be.false;
    });
    it("returns false for clear.", function () {
      expect(isNumeric('C')).to.be.false;
    });
  });
  describe("isOperator", function () {
    it("returns false for digits.", function () {
      for (var i = 0; i < 10; i++) {
        expect(isOperator(i)).to.be.false;
      }
    });
    it("returns true for operators.", function () {
      expect(isOperator('+')).to.be.true;
      expect(isOperator('-')).to.be.true;
      expect(isOperator('/')).to.be.true;
      expect(isOperator('x')).to.be.true;
    });
    it("returns false for equals.", function () {
      expect(isOperator('=')).to.be.false;
    });
    it("returns false for the decimal point.", function () {
      expect(isOperator('.')).to.be.false;
    });
    it("returns false for clear.", function () {
      expect(isOperator('C')).to.be.false;
    });
  });
  describe("isEquals", function () {
    it("returns false for digits.", function () {
      for (var i = 0; i < 10; i++) {
        expect(isEquals(i)).to.be.false;
      }
    });
    it("returns false for operators.", function () {
      expect(isEquals('+')).to.be.false;
      expect(isEquals('-')).to.be.false;
      expect(isEquals('/')).to.be.false;
      expect(isEquals('x')).to.be.false;
    });
    it("returns true for equals.", function () {
      expect(isEquals('=')).to.be.true;
    });
    it("returns false for the decimal point.", function () {
      expect(isEquals('.')).to.be.false;
    });
    it("returns false for clear.", function () {
      expect(isEquals('C')).to.be.false;
    });
  });
  describe("isDecimal", function () {
    it("returns false for digits.", function () {
      for (var i = 0; i < 10; i++) {
        expect(isDecimal(i)).to.be.false;
      }
    });
    it("returns false for operators.", function () {
      expect(isDecimal('+')).to.be.false;
      expect(isDecimal('-')).to.be.false;
      expect(isDecimal('/')).to.be.false;
      expect(isDecimal('x')).to.be.false;
    });
    it("returns false for equals.", function () {
      expect(isDecimal('=')).to.be.false;
    });
    it("returns true for the decimal point.", function () {
      expect(isDecimal('.')).to.be.true;
    });
    it("returns false for clear.", function () {
      expect(isDecimal('C')).to.be.false;
    });
  });
  describe("isClear", function () {
    it("returns false for digits.", function () {
      for (var i = 0; i < 10; i++) {
        expect(isClear(i)).to.be.false;
      }
    });
    it("returns false for operators.", function () {
      expect(isClear('+')).to.be.false;
      expect(isClear('-')).to.be.false;
      expect(isClear('/')).to.be.false;
      expect(isClear('x')).to.be.false;
    });
    it("returns false for equals.", function () {
      expect(isClear('=')).to.be.false;
    });
    it("returns false for the decimal point.", function () {
      expect(isClear('.')).to.be.false;
    });
    it("returns true for clear.", function () {
      expect(isClear('C')).to.be.true;
    });
  });
  describe("getLastKey works", function () {
    beforeEach(function () {
      keyStack = [];
    });
    afterEach(function () {
      keyStack = [];
    });
    it("when no key has been clicked yet.", function () {
      expect(getLastKey()).to.be.undefined;
    });
    it("when the last key was a digit.", function () {
      keyStack = ['1', '+', '2'];
      expect(getLastKey()).to.equal('2');
    });
    it("when the last key was an operator.", function () {
      keyStack = ['1', '+'];
      expect(getLastKey()).to.equal('+');
    });
    it("when the last key was equals.", function () {
      keyStack = ['1', '+', '2', '='];
      expect(getLastKey()).to.equal('=');
    });
    it("when the last key was an empty button.", function () {
      keyStack = ['1', '+', '2', '&nbsp;'];
      expect(getLastKey()).to.equal('2');
    });
    it("when the last key was the decimal.", function () {
      keyStack = ['1', '+', '2', '.'];
      expect(getLastKey()).to.equal('.');
    });
  });
  describe("getLastOperator works", function () {
    beforeEach(function () {
      keyStack = [];
    });
    afterEach(function () {
      keyStack = [];
    });
    it("when no key has been clicked yet.", function () {
      expect(getLastOperator()).to.be.null;
    });
    it("when no operator has been clicked yet.", function () {
      keyStack = ['1', '2', '3'];
      expect(getLastOperator()).to.be.null;
    });
    it("when the last key was a digit.", function () {
      keyStack = ['1', '+', '2'];
      expect(getLastOperator()).to.equal('+');
    });
    it("when the last key was an operator.", function () {
      keyStack = ['1', '+'];
      expect(getLastOperator()).to.equal('+');
    });
    it("when the last key was equals.", function () {
      keyStack = ['1', '+', '2', '='];
      expect(getLastOperator()).to.equal('+');
    });
    it("when the last key was an empty button.", function () {
      keyStack = ['1', '+', '2', '&nbsp;'];
      expect(getLastOperator()).to.equal('+');
    });
    it("when the last key was the decimal.", function () {
      keyStack = ['1', '+', '2', '.'];
      expect(getLastOperator()).to.equal('+');
    });
  });
  describe("displayIsFull works", function () {
    beforeEach(function () {
      display = {
        value: ''
      };
    });
    afterEach(function () {
      display = null;
    });
    it("when the display is just \"0\".", function () {
      display.value = '0';
      expect(displayIsFull()).to.be.false;
    });
    it("when the display contains some digits, but isn't full.", function () {
      var string = '1';

      for (var _string = '1'; _string.length < maxDigits; _string += '1') {
        display.value = _string;
        expect(displayIsFull()).to.be.false;
      }
    });
    it("when the display is full.", function () {
      display.value = Array(maxDigits).fill(1).join("");
      expect(displayIsFull()).to.be.true;
    });
  });
  describe("findDecimalPoint", function () {
    it("returns -1 if there is no decimal.", function () {
      expect(findDecimalPoint("123456789")).to.equal(-1);
    });
    it("returns an integer >= 0 if there is a decimal.", function () {
      expect(findDecimalPoint("1.23456789")).to.equal(1);
      expect(findDecimalPoint("0.12345678")).to.equal(1);
      expect(findDecimalPoint("123.00014")).to.equal(3);
      expect(findDecimalPoint("12345678.1")).to.equal(8);
    });
  });
  describe("containsDecimal", function () {
    it("returns true if there is a decimal.", function () {
      expect(containsDecimal("1.23456789")).to.be.true;
      expect(containsDecimal("0.12345678")).to.be.true;
      expect(containsDecimal("123.00014")).to.be.true;
      expect(containsDecimal("12345678.1")).to.be.true;
    });
    it("returns false if there is not a decimal.", function () {
      expect(containsDecimal("123456789")).to.be.false;
    });
  });
});