/**
 * @nigayo. SKPlanet.
 * @v0.0.3
 * @UIComponent RecentWordPlugin 
 */

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
		this.oStorage = new RecentWordPluginLocalStorageAddOn("searchQuery", this.option.maxList);

	}

	setInitValue() {
		let htDefaultFn = ['fnInsertRecentSearchWord', 'fnSelectRecentSearchWord'];
		this.htDefaultOption = {
			'usage' : true,
            'maxList' : 5
        }

		this.elRecentWordLayer 		= this.elTarget.querySelector(".recent-word-wrap");
		this.elClearRecentWordBtn 	= this.elTarget.querySelector(".deleteWord");
		this.elCloseButtonRWL		= this.elRecentWordLayer.querySelector(".closeLayer");
		this.elRecentULWrap			= this.elRecentWordLayer.querySelector(".ul-wrap");

		this.htDefaultFn 			= super.getDefaultCallbackList(htDefaultFn);
		this.htFn 					= {};
		this.option 				= {};
	}

	onMethod(htFn) {
		super.setOption(htFn, this.htDefaultFn, this.htFn);
	}

	registerEvents() {
		this.elClearRecentWordBtn.addEventListener("touchend", 	(evt) => { this.handlerClearRecentWord(evt)});	
		this.elCloseButtonRWL.addEventListener("touchend", 		(evt) => { this.handlerCloseLayer(evt)});
		this.elRecentULWrap.addEventListener("touchstart", 		(evt) => { this.handlerSelectRecentWordTouchStart(evt)});
		this.elRecentULWrap.addEventListener("touchend", 		(evt) => { this.handlerSelectRecentWordTouchEnd(evt)});
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

	handlerSelectRecentWordTouchStart(evt) {
		this.htTouchStartSelectedWord = {'x' : evt.changedTouches[0].pageX, 'y' : evt.changedTouches[0].pageY};
	}

	handlerSelectRecentWordTouchEnd(evt) {
		let nowPageY = evt.changedTouches[0].pageY;
		if(this.isExecuteTouchScroll(nowPageY)) return;
		this.htFn.fnSelectRecentSearchWord(evt.target);
	}

	isExecuteTouchScroll(pageY) {
		var nDiff = this.htTouchStartSelectedWord.y - pageY;
		if(nDiff !== 0) return true;
		return false;
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
		this.htFn.fnInsertRecentSearchWord(aData, this.option.maxList);
	}

}