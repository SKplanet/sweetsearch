/*
* The MIT License (MIT)
* Copyright (c) 2016 SK PLANET. All Rights Reserved. *
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: *
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software. *
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE. */

/*!
* \SweetSearch.js
* \core source for auto-complete UI
* \copyright Copyright (c) 2016, SK PLANET. All Rights Reserved. 
* \license This project is released under the MIT License.
* \contributor Jisu Youn (jisu.youn@gmail.com)
* \warning dont'use this source in other library source.
*/

class SweetSearch extends CommonComponent {
  COMPONENT_CONFIG() {
    return {
	  PLUGINS: ['RecentWordPlugin', 'TTViewPlugin'],
	    SELECTOR: {
		  inputFieldWrap: '.input-wrap', 
		  inputField: '.input-field', 
		  autoCompleteWrap: '.auto-complete-wrap',
		  closeLayer: '.close-layer',
		  clearQueryBtn: '.clear-query', 
		  autoULWrap: '.auto-complete-wrap .ul-wrap',
		  realForm: '#search-form'
		}, 
		DEFAULT_COMPONENT_EVENT: [	
		  'FN_AFTER_INSERT_AUTO_WORD',
		  'FN_AFTER_SELECT_AUTO_WORD', 
		  'FN_AFTER_FOCUS',
		  'FN_RUN_AJAX_EXECUTE'
		],
		DEFAULT_PLUGIN_EVENT: [	
		  'FN_AFTER_FOCUS',
		  'FN_AFTER_INPUT',
		  'FN_AFTER_SUBMIT',
		  'FN_AFTER_AC_SHOW',
		  'FN_AFTER_AC_NONE'
		],
		DEFAULT_OPTION: {
		  'AjaxRequestType': 'jsonp',
		  'sAutoCompleteURL': '',
		  'jsonp_callbackName': ''
		}
	}
  }

  constructor(elTarget, htOption) {
    super(elTarget, htOption);
  }

  initValue(htOption) {
    let _el = this.elTarget;
    let s = this.COMPONENT_CONFIG().SELECTOR;

    this.elInputFieldWrap = _el.querySelector(s.inputFieldWrap);
    this.elInputField = _el.querySelector(s.inputField);
    this.elAutoCompleteLayer = _el.querySelector(s.autoCompleteWrap);
    this.elClearQueryBtn = _el.querySelector(s.clearQueryBtn);
    this.elForm = _el.querySelector(s.realForm);
    this.elCloseButton = this.elAutoCompleteLayer.querySelector(s.closeLayer);
    this.elAutoULWrap = this.elAutoCompleteLayer.querySelector(s.autoULWrap);
    this.htCachedData = {};
  }

  registerEvents() {
    this.elInputFieldWrap.addEventListener('touchend',  (evt) => this.handlerInputWrap(evt));
    this.elInputField.addEventListener('keypress',      (evt) => this.handlerInputKeyPress(evt));
    this.elInputField.addEventListener('keydown',       (evt) => this.handlerInputKeydown(evt));
    this.elInputField.addEventListener('input',         (evt) => this.handlerInputKeyInput(evt));
    this.elCloseButton.addEventListener('touchend',     (evt) => this.handlerCloseLayer(evt));
    this.elClearQueryBtn.addEventListener('touchend',   (evt) => this.handlerClearInputValue(evt));
    this.elAutoULWrap.addEventListener('touchstart',    (evt) => this.handlerSelectAutoCompletedWordTouchStart(evt));
    this.elAutoULWrap.addEventListener('touchend',      (evt) => this.handlerSelectAutoCompletedWordTouchEnd(evt));
  }

  /***** START EventHandler *****/
  handlerInputWrap(evt) {
    super.runCustomFn('USER', 'FN_AFTER_FOCUS');
    super.runCustomFn('PLUGIN', 'FN_AFTER_FOCUS');
    this.elInputField.focus();
  }

  //if need something executing of inputed value
  handlerInputKeyPress(evt) {}
	
  //if need something executing of inputed special key value.(e.g. keycode 8: backspace)
  handlerInputKeydown(evt) {}

  handlerInputKeyInput(evt) {
    let sInputData = this.elInputField.value;
    if (sInputData.length > 0 ) _cu.setCSS(this.elClearQueryBtn, 'display', 'inline-block');
    else {
	    _cu.closeLayer(this.elClearQueryBtn);
	    _cu.closeLayer(this.elAutoCompleteLayer);
	}

    super.runCustomFn('PLUGIN', 'FN_AFTER_INPUT');

    if (typeof this.htCachedData[sInputData] === 'undefined') this.autoCompleteRequestManager(sInputData);
    else this.execAfterAutoCompleteAjax(sInputData, this.htCachedData[sInputData]);
  }

  handlerClearInputValue(evt) {
    this.elInputField.value = '';
    this.handlerCloseLayer();
    _cu.closeLayer(this.elClearQueryBtn);
	//evt.stopPropagation();
  }
	
  handlerCloseLayer(evt) {
    _cu.closeLayer(this.elAutoCompleteLayer);
  }

  handlerSelectAutoCompletedWordTouchStart(evt) {
    this.htTouchStartSelectedWord = {'x' : evt.changedTouches[0].pageX, 'y' : evt.changedTouches[0].pageY};
  }

  handlerSelectAutoCompletedWordTouchEnd(evt) {
    let nowPageY = evt.changedTouches[0].pageY;

    if (this.isExecuteTouchScroll(nowPageY)) return;

    let sQueryText = super.runCustomFn('USER', 'FN_AFTER_SELECT_AUTO_WORD', evt.target);
    _cu.closeLayer(this.elAutoCompleteLayer);
	//if keyword is selected, save to storage.
    super.runCustomFn('PLUGIN', 'FN_AFTER_SUBMIT', sQueryText);
  }

  isExecuteTouchScroll(pageY) {
    var nDiff = this.htTouchStartSelectedWord.y - pageY;
    if (nDiff !== 0) return true;
    return false;
  }

  execAfterAutoCompleteAjax(sQuery, sResult) {
    super.runCustomFn('USER', 'FN_AFTER_INSERT_AUTO_WORD', sQuery, sResult);

    if (this.elAutoCompleteLayer.querySelector('li') !== null) {
      _cu.showLayer(this.elAutoCompleteLayer);
      super.runCustomFn('PLUGIN', 'FN_AFTER_AC_SHOW');
    } else  {
      _cu.closeLayer(this.elAutoCompleteLayer);
      super.runCustomFn('PLUGIN', 'FN_AFTER_AC_NONE');
    }

	//save history
    this.htCachedData[sQuery] = sResult;
  }

  autoCompleteRequestManager(sQuery) {
    let url = null;
    let type = this.option.AjaxRequestType;

    switch (type) {
      case 'jsonp': {
        url = this.option.sAutoCompleteURL;
        this.makeAutoCompleteJSONPRequest(sQuery,url);
        break;
      }
      case 'ajax': {
        url = this.option.sAutoCompleteURL;
        this.makeAutoCompleteAjaxRequest(sQuery,url);
        break;
      }
      case 'user': {
        super.runCustomFn('USER', 'FN_RUN_AJAX_EXECUTE', sQuery, this.execAfterAutoCompleteAjax.bind(this, sQuery));
        break;
      }
      default: {
        super.runCustomFn('USER', 'FN_RUN_AJAX_EXECUTE', sQuery);
      }
    }
  }

  makeAutoCompleteJSONPRequest(sQuery, sURL) {
    let sCallbackName = this.option.jsonp_callbackName;
    _cu.sendSimpleJSONP(sURL, sQuery, sCallbackName, this.execAfterAutoCompleteAjax.bind(this,sQuery));
  }

  //query name is 'qs'.
  makeAutoCompleteAjaxRequest(sQuery, sURL) {
    sURL = sURL+'?qs='+sQuery;
    let aHeaders = '';
    _cu.sendSimpleAjax(sURL, this.execAfterAutoCompleteAjax.bind(this, sQuery), 
      JSON.stringify({
        sQuery: sQuery,
        nTime: Date.now() 
      }), 
    'get', aHeaders, sQuery);
  }
}
