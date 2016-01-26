class RecentWordPlugin extends CommonComponent {

	constructor(elTarget, htOption) {
		super(htOption);
		this.elTarget = elTarget;
		this.init(htOption);
	}

	init(htOption) {
		this._setDefaultOption();
		this.option = {};
		super.execOption(htOption, this._htDefaultOption, this.option);
		this._setInitValue();
		this._registerEvents();
		this._setDefaultFunction();
	}

	_setInitValue() {
		this.elRecentWordLayer 		= this.elTarget.querySelector(".recent-word-wrap");
		this.elClearRecentWordBtn 	= this.elTarget.querySelector(".deleteWord");
		this.elCloseButtonRWL		= this.elRecentWordLayer.querySelector(".closeLayer");
		this.oStorage = new RecentWordPluginLocalStorageAddOn("searchQuery");
	}

	_setDefaultOption () {
		this._htDefaultOption = {
		}
	}

	_setDefaultFunction() {
		this._htDefaultFunction = {
			'fnInsertRecentSearchWord' : function(){}
		}
	}

	onMethod(htFn) {
		this.htFn = {};
		super.execOption(htFn, this._htDefaultFunction, this.htFn);
	}

	_registerEvents() {
		this.elClearRecentWordBtn.addEventListener("touchend", (evt) => { this.handlerClearRecentWord(evt)});	
		this.elCloseButtonRWL.addEventListener("touchend", (evt) => { this.handlerCloseLayer(evt)});
	}

	handlerClearRecentWord(evt) {
		this.oStorage.removeKeywords();
		this.elRecentWordLayer.querySelector("ul").innerHTML = "";
		this.elClearRecentWordBtn.style.display = "none";
	}

	//TODO. duplicate
	handlerCloseLayer(evt) {
		this.elRecentWordLayer.style.display = "none";
	}

	saveQuery(sQuery) {
		this.oStorage.saveKeyword(sQuery);
	}

	showRecentSearchWord() {
		let sData = this.oStorage.getKeywords();
		if(sData === null || sData === "") return;
		this.elRecentWordLayer.style.display = "block";
		this.elClearRecentWordBtn.style.display = "block";
		let aData = JSON.parse(sData);
		this.htFn.fnInsertRecentSearchWord(aData);
	}

}