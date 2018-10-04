"use strict";

describe("Clicking", function () {
  var fullDisplay = Array(maxDigits).fill(1).join("");
  beforeEach(function () {
    display = {
      value: ''
    };
    operand1 = null;
    operand2 = null;
    operator = null;
    keyStack = [];
  });
  afterEach(function () {
    display = null;
    operand1 = null;
    operand2 = null;
    operator = null;
    keyStack = [];
  });

  function getClickEvent(string) {
    return {
      target: {
        innerHTML: string
      }
    };
  }

  it("on an empty button does nothing.", function () {
    display.value = '1';
    input(getClickEvent('&nbsp;'));
    expect(display.value).to.equal('1');
    expect(keyStack).to.be.an('array').that.is.empty;
  });
  describe("on a digit button", function () {
    it("adds it to the keyStack.", function () {
      input(getClickEvent('1'));
      expect(keyStack[0]).to.equal('1');
    });
    it("does nothing if the display is full.", function () {
      display.value = fullDisplay;
      input(getClickEvent('1'));
      expect(display.value).to.equal(fullDisplay);
    });
    describe("replaces the display", function () {
      it("at the beginning of input.", function () {
        display.value = '0';
        input(getClickEvent('1'));
        expect(display.value).to.equal('1');
      });
      it("after an operator is clicked.", function () {
        display.value = '12';
        keyStack = ['+'];
        input(getClickEvent('1'));
        expect(display.value).to.equal('1');
      });
    });
    describe("appends to the display", function () {
      it("in the middle of input.", function () {
        display.value = '12';
        input(getClickEvent('3'));
        expect(display.value).to.equal('123');
      });
    });
  });
  describe("on the decimal button", function () {
    it("adds it to the keyStack.", function () {
      input(getClickEvent('.'));
      expect(keyStack[0]).to.equal('.');
    });
    describe("does not append a decimal", function () {
      it("if there is already a decimal in the display.", function () {
        display.value = '12.3';
        input(getClickEvent('.'));
        expect(display.value).to.equal('12.3');
      });
      it("if the display is full.", function () {
        display.value = fullDisplay;
        input(getClickEvent('.'));
        expect(display.value).to.equal(fullDisplay);
      });
    });
    describe("appends a decimal to the dislay", function () {
      it("at the beginning of input.", function () {
        display.value = '0';
        input(getClickEvent('.'));
        expect(display.value).to.equal('0.');
      });
      it("in the middle of input, if the display doesn't already have one.", function () {
        display.value = '12';
        input(getClickEvent('.'));
        expect(display.value).to.equal('12.');
      });
      it("after an operator key is pressed.", function () {
        keyStack = ['+'];
        display.value = '12';
        input(getClickEvent('.'));
        expect(display.value).to.equal('0.');
        display.value = fullDisplay;
        input(getClickEvent('.'));
        expect(display.value).to.equal('0.');
      });
      it("after the equals key is pressed.", function () {
        keyStack = ['='];
        display.value = '12';
        input(getClickEvent('.'));
        expect(display.value).to.equal('0.');
        display.value = fullDisplay;
        input(getClickEvent('.'));
        expect(display.value).to.equal('0.');
      });
    });
  });
  describe("on the clear button", function () {
    it("adds it to the keyStack.", function () {
      input(getClickEvent('C'));
      expect(keyStack[0]).to.equal('C');
    });
    it("clears the display.", function () {
      display.value = '12.3';
      input(getClickEvent('C'));
      expect(display.value).to.equal('0');
    });
    it("resets the global variables.", function () {
      operand1 = '1';
      operator = '+';
      operand2 = '2';
      keyStack = ['1', '+', '2'];
      input(getClickEvent('C'));
      expect(operand1).to.be.null;
      expect(operator).to.be.null;
      expect(operand2).to.be.null;
      expect(keyStack).to.be.an('array').that.is.empty;
    });
  });
});