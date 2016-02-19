/**
 * @nigayo. SKPlanet.
 * @v0.0.4
 * @UIComponent smartsearch
 */

class SmartSearch extends CommonComponent {

	COMPONENT_CONFIG() {
		 this.COMPONENT_DATA = {
			ELEMENT_SELECTOR 	: {
				inputFieldWrap 		: ".inputWrap",
				inputField 			: ".input-field",
				autoCompleteWrap 	: ".auto-complete-wrap",
				closeLayer 			: ".closeLayer",
				clearQueryBtn 		: ".clearQuery",
				autoULWrap			: ".auto-complete-wrap .ul-wrap",
				realForm 			: "#search-form"
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

		this.COMPONENT_CONFIG();

		let s = this.COMPONENT_DATA.ELEMENT_SELECTOR;

		//TODO. Separate data.
		let aDefaultFnName = [	
			'FN_AFTER_INSERT_AUTO_WORD',
			'FN_AFTER_SELECT_AUTO_WORD', 
			'FN_AFTER_FORM_SUBMIT',
			'FN_AFTER_FOCUS'
		];

		let aDefaultPluginFnName = [	
			'FN_AFTER_FOCUS',
			'FN_AFTER_INPUT',
			'FN_AFTER_SUBMIT'
		];

		this._htDefaultOption 	= {
			"requestType" 		: 'jsonp',
			"sAutoCompleteURL" 	: "",
			"jsonp_callbackName": ""
		}

		this.option 			= {};

		this.elInputFieldWrap	= _el.querySelector(s.inputFieldWrap);
		this.elInputField 		= _el.querySelector(s.inputField);
		this.elAutoCompleteLayer= _el.querySelector(s.autoCompleteWrap);
		this.elClearQueryBtn 	= _el.querySelector(s.clearQueryBtn);
		this.elForm 			= _el.querySelector(s.realForm);

		this.elCloseButton 		= this.elAutoCompleteLayer.querySelector(s.closeLayer);
		this.elAutoULWrap		= this.elAutoCompleteLayer.querySelector(s.autoULWrap);

		this.htCachedData 		= {};
		this.htDefaultFn 		= super.getDefaultCallbackList(aDefaultFnName);
		this.htDefaultPluginFn	= super.getDefaultCallbackList(aDefaultPluginFnName);

		this.htUserFn 			= {};
		this.htPluginFn 		= {};

		//plugins
		this.aMyPluginName 		= ['RecentWordPlugin'];
		this.htPluginInstance 	= {};
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

		this.elForm.addEventListener("submit", 				(evt) => this.handlerSubmitForm(evt));
	}

	onUserMethod(htFn) {
		super.setOption(htFn, this.htDefaultFn, this.htUserFn);
	}

	onPluginMethod(htFn) {
		super.setOption(htFn, this.htDefaultPluginFn, this.htPluginFn);
	}

	onPlugins(aPluginList) {
		this.htPluginInstance = super.initPlugins(this.aMyPluginName, aPluginList,  this.elTarget);
	}

	/***** START EventHandler *****/
	handlerInputWrap(evt) {
		this.htUserFn['FN_AFTER_FOCUS']();
		this.htPluginFn['FN_AFTER_FOCUS']();
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

		this.htPluginFn['FN_AFTER_INPUT']();

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

		let sText = this.htUserFn['FN_AFTER_SELECT_AUTO_WORD'](evt.target);
	}

	handlerSubmitForm(evt, sQuery) {
        if(evt) evt.preventDefault();
        sQuery = sQuery || this.elInputField.value;
		this.htUserFn['FN_AFTER_FORM_SUBMIT'](sQuery);
		this.htPluginFn['FN_AFTER_SUBMIT'](sQuery);
	}
	/***** End EventHandler *****/


	isExecuteTouchScroll(pageY) {
		var nDiff = this.htTouchStartSelectedWord.y - pageY;
		if(nDiff !== 0) return true;
		return false;
	}

	execAfterAutoCompleteAjax(sQuery, sResult) {
		this.htUserFn['FN_AFTER_INSERT_AUTO_WORD'](sResult);
		if(this.elAutoCompleteLayer.querySelector("li") !== null) _cu.showLayer(this.elAutoCompleteLayer);
		else _cu.closeLayer(this.elAutoCompleteLayer);

		//save history
		this.htCachedData[sQuery] = sResult;
	}

	autoCompleteRequestManager(sQuery) {
		let type = this.option.requestType;
		let url = this.option.sAutoCompleteURL;
		switch(type) {
			case 'jsonp':
				this.makeAutoCompleteJSONPRequest(sQuery,url);
				break;
			case 'ajax':
				this.makeAutoCompleteAjaxRequest(sQuery,url);
				break;
			default: 
				//do something..
		}
	}

	makeAutoCompleteJSONPRequest(sQuery, sURL) {
		let sCallbackName = this.option.jsonp_callbackName;
		_cu.sendSimpleJSONP(sURL, sQuery, sCallbackName, this.execAfterAutoCompleteAjax.bind(this,sQuery));
	}

	//TODO. 
	makeAutoCompleteAjaxRequest(sQuery, sURL) {
		// hardcoded url for test.
		let url = "../jsonMock/"+ sQuery +".json";
		let aHeaders = [["Content-Type", "application/json"]];
		_cu.sendSimpleAjax(url, this.execAfterAutoCompleteAjax.bind(this, sQuery), 
			JSON.stringify({
				sQuery : sQuery,
				nTime : Date.now() 
			}), 
		"get", aHeaders, sQuery);
	}

}
