'use strict'


let util = {
  simpleFireEvent : function(eventType) {
    let ev;
    try {
      ev = document.createEvent('TouchEvent');
      ev.initTouchEvent(eventType, true, true);
    }
    catch (err) {
      ev = document.createEvent('UIEvent');
      ev.initUIEvent(eventType, true, true);
    }
    return ev;
  }
};

let oSS = null;

describe("constructor", function() {

  //prepare setting
	//let oSS = null;
  let elTarget = document.querySelector(".search-form");
  let sAutoCompleteURLAmazon = 'http://completion.amazon.com/search/complete?mkt=1&client=amazon-search-ui&x=String&search-alias=aps&';

  let htOption = {
            'sAutoCompleteURL'    : sAutoCompleteURLAmazon,
            'requestType'         : 'jsonp',
            'jsonp_callbackName'  : 'completion'
  }

  beforeAll(function() {
    oSS = new SweetSearch(elTarget, htOption);

  });

  it("initialize constructor ", function() {
    expect(oSS.elTarget).toBe(elTarget);
    expect(oSS.option.requestType).toBe(htOption.requestType);
    expect(oSS.elClearQueryBtn.className).toBe("clearQuery");
  });

  it("trigger touchend event after initialization ", function() {
    let bFocus = false;

    function _handler() {bFocus = true;}
    oSS.elInputField.addEventListener("focus", _handler);

    let ev = util.simpleFireEvent('touchend');
    oSS.elInputField.dispatchEvent(ev);

    expect(bFocus).toBe(true);

    oSS.elInputField.removeEventListener("focus", _handler);
  });
 
});


 describe("request Ajax", function() {
  let bInsertWord = false;

  beforeEach(function(done) {
    oSS.elInputField.value = "mouse";
    setTimeout(function() {
       function fnInsertAutoCompleteWord() {
          bInsertWord = true;
          done();
       }

       oSS.registerUserMethod({
        'FN_AFTER_INSERT_AUTO_WORD' : fnInsertAutoCompleteWord,
       });

       var clickEvent = new Event('input');
       oSS.elInputField.dispatchEvent(clickEvent);
    },0);
  });

  it("should have a valid season", function() { 
      expect(bInsertWord).toEqual(true);
  });
});
