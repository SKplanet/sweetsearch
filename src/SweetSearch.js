/**
 * @nigayo. SKPlanet.
 * @v0.0.6
 * @UIComponent SweetSearch
 */

class SweetSearch extends CommonComponent {

	COMPONENT_CONFIG() {
		 return {
			PLUGINS 				: ['RecentWordPlugin', 'TTViewPlugin'],
			SELECTOR 				: {
					inputFieldWrap 		: ".inputWrap",
					inputField 			: ".input-field",
					autoCompleteWrap 	: ".auto-complete-wrap",
					closeLayer 			: ".closeLayer",
					clearQueryBtn 		: ".clearQuery",
					autoULWrap			: ".auto-complete-wrap .ul-wrap",
					realForm 			: "#search-form"
			}, 
			DEFAULT_EVENT 			: [	
					'FN_AFTER_INSERT_AUTO_WORD',
					'FN_AFTER_SELECT_AUTO_WORD', 
					'FN_AFTER_FOCUS',
					'FN_RUN_AJAX_EXECUTE'
			],
			DEFAULT_PLUGIN_EVENT 	: [	
					'FN_AFTER_FOCUS',
					'FN_AFTER_INPUT',
					'FN_AFTER_SUBMIT',
					'FN_AFTER_AC_SHOW',
					'FN_AFTER_AC_NONE'
			],
			DEFAULT_OPTION 			: {
					"AjaxRequestType" 	: 'jsonp',
					"sAutoCompleteURL" 	: "",
					"jsonp_callbackName": ""
			}
		}
	}

	constructor(elTarget, htOption) {
		super(htOption)
		this.elTarget = elTarget;
		this.init(htOption);
	}

	init(htOption) {
		this.setInitValue();
		super.setOption(htOption, this._htDefaultOption, this.option);
		this.registerEvents();
	}

	setInitValue() {
		let _el 				= this.elTarget;

		let _d 					= this.COMPONENT_CONFIG();
		let s 					= _d.SELECTOR;

		this._htDefaultOption 	= _d.DEFAULT_OPTION;
		this.aMyPluginName 		= _d.PLUGINS;

		this.htDefaultFn 		= super.getDefaultCallbackList(_d.DEFAULT_EVENT);
		this.htDefaultPluginFn	= super.getDefaultCallbackList(_d.DEFAULT_PLUGIN_EVENT);

		this.option 			= {};
		this.elInputFieldWrap	= _el.querySelector(s.inputFieldWrap);
		this.elInputField 		= _el.querySelector(s.inputField);
		this.elAutoCompleteLayer= _el.querySelector(s.autoCompleteWrap);
		this.elClearQueryBtn 	= _el.querySelector(s.clearQueryBtn);
		this.elForm 			= _el.querySelector(s.realForm);

		this.elCloseButton 		= this.elAutoCompleteLayer.querySelector(s.closeLayer);
		this.elAutoULWrap		= this.elAutoCompleteLayer.querySelector(s.autoULWrap);

		this.htCachedData 		= {};
		this.htUserFn 			= {};
		this.htPluginFn 		= {};
	}

	registerEvents() {
		this.elInputFieldWrap.addEventListener("touchend", 	(evt) => this.handlerInputWrap(evt));

		this.elInputField.addEventListener("keypress", 		(evt) => this.handlerInputKeyPress(evt));
		this.elInputField.addEventListener("keydown", 		(evt) => this.handlerInputKeydown(evt));
		this.elInputField.addEventListener("input", 		(evt) => this.handlerInputKeyInput(evt));

		this.elCloseButton.addEventListener("touchend", 	(evt) => this.handlerCloseLayer(evt));
		this.elClearQueryBtn.addEventListener("touchend", 	(evt) => this.handlerClearInputValue(evt));

		this.elAutoULWrap.addEventListener("touchstart", 	(evt) => this.handlerSelectAutoCompletedWordTouchStart(evt));
		this.elAutoULWrap.addEventListener("touchend", 		(evt) => this.handlerSelectAutoCompletedWordTouchEnd(evt));

		//this.elForm.addEventListener("submit", 				(evt) => this.handlerSubmitForm(evt));
	}

	registerUserMethod(htFn) {
		super.setOption(htFn, this.htDefaultFn, this.htUserFn);
	}

	registerPluginMethod(htFn) {
		super.appendPluginMethod(htFn, this.htDefaultPluginFn, this.htPluginFn);
	}

	onPlugins(aPluginList) {
		super.initPlugins(this.aMyPluginName, aPluginList,  this.elTarget);
	}

	/***** START EventHandler *****/
	handlerInputWrap(evt) {
		super.runCustomFn("USER", 'FN_AFTER_FOCUS');
		super.runCustomFn("PLUGIN", 'FN_AFTER_FOCUS');
		this.elInputField.focus();
	}

	//if need something executing of inputed value
	handlerInputKeyPress(evt) {}
	
	//if need something executing of inputed special key value.(e.g. keycode 8: backspace)
	handlerInputKeydown(evt) {}

	handlerInputKeyInput(evt) {
		let sInputData = this.elInputField.value;

		if(sInputData.length > 0 ) _cu.setCSS(this.elClearQueryBtn, "display", "inline-block");
		else _cu.closeLayer(this.elClearQueryBtn);

		super.runCustomFn("PLUGIN", "FN_AFTER_INPUT");

		if (typeof this.htCachedData[sInputData] === "undefined") this.autoCompleteRequestManager(sInputData);
		else this.execAfterAutoCompleteAjax(sInputData, this.htCachedData[sInputData]);
	}

	handlerClearInputValue(evt) {
		this.elInputField.value = "";
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
		if(this.isExecuteTouchScroll(nowPageY)) return;

		let sQueryText = super.runCustomFn("USER", "FN_AFTER_SELECT_AUTO_WORD", evt.target);

		//if keyword is selected, save to storage.
		super.runCustomFn("PLUGIN", "FN_AFTER_SUBMIT", sQueryText);
	}

	isExecuteTouchScroll(pageY) {
		var nDiff = this.htTouchStartSelectedWord.y - pageY;
		if(nDiff !== 0) return true;
		return false;
	}

	execAfterAutoCompleteAjax(sQuery, sResult) {
		super.runCustomFn("USER", "FN_AFTER_INSERT_AUTO_WORD", sQuery, sResult);
		if(this.elAutoCompleteLayer.querySelector("li") !== null) {
			_cu.showLayer(this.elAutoCompleteLayer);
			super.runCustomFn("PLUGIN", "FN_AFTER_AC_SHOW");
		} else  {
			_cu.closeLayer(this.elAutoCompleteLayer);
			super.runCustomFn("PLUGIN", "FN_AFTER_AC_NONE");
		}

		//save history
		this.htCachedData[sQuery] = sResult;
	}

	autoCompleteRequestManager(sQuery) {
		let url = null;
		let type = this.option.AjaxRequestType;

		switch(type) {
			case 'jsonp':
				url = this.option.sAutoCompleteURL;
				this.makeAutoCompleteJSONPRequest(sQuery,url);
				break;
			case 'ajax':
				url = this.option.sAutoCompleteURL;
				this.makeAutoCompleteAjaxRequest(sQuery,url);
				break;
			case 'user':
				super.runCustomFn("USER", "FN_RUN_AJAX_EXECUTE", sQuery, this.execAfterAutoCompleteAjax.bind(this, sQuery));
				break;
			default: 
				super.runCustomFn("USER", "FN_RUN_AJAX_EXECUTE", sQuery);
		}
	}

	makeAutoCompleteJSONPRequest(sQuery, sURL) {
		let sCallbackName = this.option.jsonp_callbackName;
		_cu.sendSimpleJSONP(sURL, sQuery, sCallbackName, this.execAfterAutoCompleteAjax.bind(this,sQuery));
	}

	//query name is 'qs'.
	makeAutoCompleteAjaxRequest(sQuery, sURL) {
		sURL = sURL+"?qs="+sQuery;
		let aHeaders = "";
		_cu.sendSimpleAjax(sURL, this.execAfterAutoCompleteAjax.bind(this, sQuery), 
			JSON.stringify({
				sQuery : sQuery,
				nTime : Date.now() 
			}), 
		"get", aHeaders, sQuery);
	}
}
