class SmartSearch extends CommonComponent {
	
	constructor(elTarget, htOption) {
		super(htOption)
		this.elTarget = elTarget;
		this.init(htOption);
	}

	//TODO. think about moving super class.
	init(htOption) {
		this._setDefaultOption();
		//option variable declaration
		this.option = {};
		super.execOption(htOption, this._htDefaultOption, this.option);
		this._setInitValue();
		this._registerEvents();
	}

	_setInitValue() {
		const _cssSelector = {
			inputField 			: ".input-field",
			autoCompleteWrap 	: ".auto-complete-wrap",
			closeLayer 			: ".closeLayer",
			clearQueryBtn 		: ".clearQuery"
		} 

		this.elInputField 			= this.elTarget.querySelector(_cssSelector.inputField);
		this.elAutoCompleteLayer 	= this.elTarget.querySelector(_cssSelector.autoCompleteWrap);
		this.elCloseButton 			= this.elAutoCompleteLayer.querySelector(_cssSelector.closeLayer);
		this.elClearQueryBtn 		= this.elTarget.querySelector(_cssSelector.clearQueryBtn);
		this.htCachedData 			= {};

		//plugins
		this.aPluginList			= ['RecentWordPlugin'];
		this.htPluginInstance 		= {};
	}

	_setDefaultOption () {
		this._htDefaultOption = {
			//'bCircular' : false,
		}
	}

	_setDefaultFunction() {
		this._htDefaultFunction = {
			'fnInsertAutoCompleteWord' : function(){},
		}
	}

	_registerEvents() {
		this.elInputField.addEventListener("focus" , 	(evt) => this.handlerInputFocus(evt));
		this.elInputField.addEventListener("keypress", 	(evt) => this.handlerInputKeyPress(evt));
		this.elInputField.addEventListener("keydown", 	(evt) => this.handlerInputKeydown(evt));
		this.elInputField.addEventListener("input", 	(evt) => this.handlerInputKeyInput(evt));
		this.elCloseButton.addEventListener("touchend", (evt) => this.handlerCloseAllLayer(evt));
		this.elClearQueryBtn.addEventListener("touchend", (evt) => this.handlerClearInputValue(evt));
	}

	registerCallback(htFn) {
		this.htFn = {};
 		this._setDefaultFunction();
		super.execOption(htFn, this._htDefaultFunction, this.htFn);
	}

	/* start EVENT-HANDLER */ 
	handlerInputFocus(evt) {
		CommonUtil.setCSS(this.elClearQueryBtn, "display", "inline-block");
		this.execAfterFocus(evt);
	}

	//입력필드에 들어가는 값의 어떠한 처리가 필요할때 여기서 처리한다.
	handlerInputKeyPress(evt) {}
	
	//특수키(keycode 8인 backspace등) 작업 조정이 필요한 경우 여기서 처리.
	handlerInputKeydown(evt) {}

	handlerInputKeyInput(evt) {
		let sInputData = this.elInputField.value;
		console.log("input evet fired : ", sInputData);

		//after input word, must hide a recent word layer
		let oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
		if(oRecentWordPlugin) oRecentWordPlugin.elRecentWordLayer.style.display = "none";

		if (typeof this.htCachedData[sInputData] === "undefined") this._makeAutoCompleteAjaxRequest(sInputData);
		else this.execAfterAutoCompleteAjax(sInputData, this.htCachedData[sInputData]);
	}

	handlerClearInputValue(evt) {
		this.elInputField.value = "";
		this.handlerCloseAllLayer();
	}
	
	handlerCloseAllLayer(evt) {
		CommonUtil.setCSS(this.elAutoCompleteLayer, "display", "none");
	}

	execAfterFocus(evt) {
		//execute RecentWordPlugin.
		let oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
		if(!oRecentWordPlugin) return;
		oRecentWordPlugin.showRecentSearchWord(this.htFn.fnInsertRecentSearchWord);

		//execute other plugin or other logic.
	}

	execAfterAutoCompleteAjax(sQuery, sResult) {
		this.htFn.fnInsertAutoCompleteWord(sResult);
		this.elAutoCompleteLayer.style.display = "block";

		//save history
		this.htCachedData[sQuery] = sResult;

		//save keyword to localstorage 
		//this.saveKeyword(sQuery);
	}

	_makeAutoCompleteAjaxRequest(sQuery) {
		let url = "../jsonMock/"+ sQuery +".json";
		let aHeaders = [["Content-Type", "application/json"]];

		this.sendSimpleAjax(url, this.execAfterAutoCompleteAjax.bind(this, sQuery), 
			JSON.stringify({
				sQuery : sQuery,
				nTime : Date.now() 
			}), 
		"get", aHeaders, sQuery);
	}

	//TODO. move to a CommmonComponent or AjaxUtils.
	sendSimpleAjax(url, fnCallback, sData, method, aHeaders, sQuery) {

		let xhr = new XMLHttpRequest();
		xhr.open(method, url);

		aHeaders.forEach( (v) => {
			xhr.setRequestHeader(v[0], v[1]);
		});

		xhr.addEventListener("load", function() {
			if (xhr.status === 200) {
				var sResult = JSON.parse(xhr.responseText);
				fnCallback.call(this, sResult);
			}
		}.bind(this));
		xhr.send(sData);
	}

	addOnPlugin(fnName) {
		return this._addOnPlugin(fnName, this.htPluginInstance, this.aPluginList, this.elTarget);
	}

}
