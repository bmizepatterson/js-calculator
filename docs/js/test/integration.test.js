"use strict";

describe("Button event handler", function () {
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

  it("does nothing when an empty button is clicked.", function () {
    display.value = '1';
    input(getClickEvent('&nbsp;'));
    expect(display.value).to.equal('1');
  });
  describe("on the digit buttons", function () {
    describe("does NOTHING when a digit is clicked", function () {
      it("if the display is full.", function () {
        display.value = fullDisplay;
        input(getClickEvent('1'));
        expect(display.value).to.equal(fullDisplay);
      });
    });
    describe("REPLACES the display when a digit is clicked", function () {
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
    describe("APPENDS to the display when a digit is clicked", function () {
      it("in the middle of input.", function () {
        display.value = '12';
        input(getClickEvent('3'));
        expect(display.value).to.equal('123');
      });
    });
  });
  describe("on the decimal button", function () {
    describe("does NOT append a decimal", function () {
      it("if it already has one.", function () {
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
    describe("appends a decimal to the dislay when the decimal button is clicked", function () {
      it("at the beginning of input.", function () {
        display.value = '0';
        input(getClickEvent('.'));
        expect(display.value).to.equal('0.');
      });
      it("in the middle of input if the display doesn't already have one.", function () {
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
    it("clears the display when the clear button is clicked.", function () {});
  });
});