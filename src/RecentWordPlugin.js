class RecentWordPlugin extends CommonComponent {

	constructor(elTarget, htOption) {
		super(htOption);
		this.elTarget = elTarget;
		this.init(htOption);
	}

	init(htOption) {
		this.setInitValue();
		super.setOption(htOption, this.htDefaultOption, this.option);
		this.registerEvents();
	}

	setInitValue() {
		let htDefaultFn = ['fnInsertRecentSearchWord'];
		this.htDefaultOption = {
			'usage' : true,
            'maxList' : 5
        }

		this.elRecentWordLayer 		= this.elTarget.querySelector(".recent-word-wrap");
		this.elClearRecentWordBtn 	= this.elTarget.querySelector(".deleteWord");
		this.elCloseButtonRWL		= this.elRecentWordLayer.querySelector(".closeLayer");
		this.oStorage 				= new RecentWordPluginLocalStorageAddOn("searchQuery");

		this.htDefaultFn 			= super.getDefaultCallbackList(htDefaultFn);
		this.htFn 					= {};
		this.option 				= {};
	}

	onMethod(htFn) {
		super.setOption(htFn, this.htDefaultFn, this.htFn);
	}

	registerEvents() {
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