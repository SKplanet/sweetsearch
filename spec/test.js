'use strict'

describe("constructor", function() {
  it("touchEnd event on inputarea", function() {
    expect(true).toBe(true);
  });
});



var util = {
  simpleFireEvent : function(eventType) {
    var ev;
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

var oSS = null;

describe("constructor", function() {
  var elTarget = document.querySelector(".search-form");
  var sAutoCompleteURLAmazon = 'http://completion.amazon.com/search/complete?mkt=1&client=amazon-search-ui&x=String&search-alias=aps&';
  var htOption = {
            'sAutoCompleteURL'    : sAutoCompleteURLAmazon,
            'AjaxRequestType'         : 'jsonp',
            'jsonp_callbackName'  : 'completion'
  }

  beforeAll(function() {
    oSS = new SweetSearch(elTarget, htOption);
  });

  it("touchEnd event on inputarea", function() {
    expect(oSS.elTarget).toBe(elTarget);
    expect(oSS.option.AjaxRequestType).toBe(htOption.AjaxRequestType);
    expect(oSS.elClearQueryBtn.className).toBe("clearQuery");
  });

  it("trigger touchend event after initialization ", function() {
    var bFocus = false;

    function fnAfterFocus() { 
      bFocus = true;
    }

    oSS.registerUserMethod({
      'FN_AFTER_FOCUS' : fnAfterFocus,
    });

    var ev = util.simpleFireEvent('touchend');
    oSS.elInputFieldWrap.dispatchEvent(ev);

    expect(bFocus).toBe(true);
  });
 
});


describe("clear button", function() {
  it("should clear input text when clear button", function() { 
    var ev = util.simpleFireEvent('touchend');
    oSS.elClearQueryBtn.dispatchEvent(ev);

    var sText = oSS.elInputField.value;
    expect(sText.length).toEqual(0);
  });
});


describe("JSONP request", function() {
  var bInsertWord = false;

  beforeEach(function(done) {
    oSS.elInputField.value = "mouse";

    setTimeout(function() {
       function fnInsertAutoCompleteWord(sQuery, sResponseObj) {
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

  it("callback function should execute after JSONP request", function() { 
      expect(bInsertWord).toEqual(true);
  });
});



describe("Ajax Request", function() {

  var elTarget = document.querySelector(".search-form");
  var ajaxURL = '../jsonMock/javascript.json';
  var htOption = {
            'sAutoCompleteURL'    : ajaxURL,
            'AjaxRequestType'     : 'ajax'
  }
  var sResult = null;

  beforeEach(function(done) {
    setTimeout(function() {
      function fnInsertAutoCompleteWord(sQuery, sResponseObj) {
        sResult = sResponseObj;
        done();
      }

      oSS = new SweetSearch(elTarget, htOption);
      oSS.registerUserMethod({
        'FN_AFTER_INSERT_AUTO_WORD' : fnInsertAutoCompleteWord,
      });


      var clickEvent = new Event('input');
      oSS.elInputField.dispatchEvent(clickEvent);

    },0);
  });

  it("should success AJAX request", function() { 
    expect(true).toEqual(true);
    expect(sResult.items[0][0][0]).toEqual("html javascript 삽입");
  });
});


describe("Ajax Request (user Custom)", function() {

  var elTarget = document.querySelector(".search-form");
  var ajaxURL = '../jsonMock/javascript.json';
  var htOption = {
            'AjaxRequestType'     : 'user'
  }
  var sResult = null;

  beforeEach(function(done) {
    setTimeout(function() {

      function fnInsertAutoCompleteWord(sQuery, sResponseObj) {
        sResult = sResponseObj;
        done();
      }

      var fnMyAjax = function(sQuery, fnCallback) {
        let method = "get";
        let url = "../jsonMock/javascript.json";
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.addEventListener("load", function() {
          if (xhr.status === 200) {
            var sResult = JSON.parse(xhr.responseText);
            if(fnCallback && typeof fnCallback === 'function') fnCallback.call(this,sResult);
          }
        }.bind(this));
        xhr.send();
      }

      oSS = new SweetSearch(elTarget, htOption);
      oSS.registerUserMethod({
        'FN_AFTER_INSERT_AUTO_WORD' : fnInsertAutoCompleteWord,
        'FN_RUN_AJAX_EXECUTE'       : fnMyAjax
      });

      var clickEvent = new Event('input');
      oSS.elInputField.dispatchEvent(clickEvent);

    },0);
  });

  it("should success AJAX request", function() { 
    expect(true).toEqual(true);
    expect(sResult.items[0][0][0]).toEqual("html javascript 삽입");
  });
});


