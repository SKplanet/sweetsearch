
class SmartSearch extends CommonComponent {
	
	constructor(elTarget, htOption) {
		super(htOption)
		this.elTarget = elTarget;
		this.init(htOption);
	}

	init(htOption) {

		this._setDefaultOption();
		//option variable declaration
		this.option = {};
		super.execOption(htOption, this._htDefaultOption, this.option);
		this._setInitValue();
		this._registerEvents();

	}

	_setInitValue() {

		this.elInputField 			= this.elTarget.querySelector(".input-field");
		this.elAutoCompleteLayer 	= this.elTarget.querySelector(".auto-complete-wrap");
		this.elRecentWordLayer 		= this.elTarget.querySelector(".recent-word-wrap");

	}

	_setDefaultOption () {

		this._htDefaultOption = {
			//'bCircular' : false,
		}
	}

	_setDefaultFunction() {

		this._htDefaultFunction = {
			// 'beforeSwipe' : function(){},
			// 'afterSwipe' : function(){},
		}

	}

	registerCallback(htFn) {

		this.htFn = {};
 		this._setDefaultFunction();
		super.execOption(htFn, this._htDefaultFunction, this.htFn);

	}

	_registerEvents() {

		this.elInputField.addEventListener("touchstart", (evt) => { this.handlerInputTouchStart(evt) });
		this.elInputField.addEventListener("keypress", (evt) => { this.handlerInputKeydown(evt) });

	}

	/* start EVENT-HANDLER */ 
	handlerInputTouchStart(evt) {

		this.elRecentWordLayer.style.display = "block";

	}

	handlerInputKeydown(evt) {

		let currentChar = String.fromCharCode(evt.charCode);

		//console.log("lodash test > ", _.indexOf([1,2,3,9,5], 39));

		// fetch("../jsonMock/j.json").then(function(res){
		// 	return res.json()
		// }).then(function(json) {
		// 	console.log('parsed json', json)
		// }).catch(function(ex) {
		// 	console.log('parsing failed', ex)
		// });
	}

}












