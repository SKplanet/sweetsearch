/**
 * @nigayo. SKPlanet.
 * @v0.0.3
 * @UIComponent RecentWordPlugin 
 */

class RecentWordPlugin extends CommonComponent {

	COMPONENT_CONFIG() {
		 return {
			ELEMENT_SELECTOR 	: {
				recentWordWrap 		: ".recent-word-wrap",
				deletwWordBtn 		: ".deleteWord",
				closeLayerBtn 		: ".closeLayer",
				recentULWrap 		: ".ul-wrap"
			},
			DEFAULT_EVENT : [	
					'FN_AFTER_INSERT_RECENT_WORD',
					'FN_AFTER_SELECT_RECENT_WORD'
			],
			OPTIONS : {
					'usage' : true,
		            'maxList' : 5
        	}
		}
	}

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
		let _d 						= this.COMPONENT_CONFIG();
		let s 						= _d.ELEMENT_SELECTOR;

		let htDefaultFn 			= _d.DEFAULT_EVENT;
		this.htDefaultOption 		= _d.OPTIONS;

		this.elRecentWordLayer 		= this.elTarget.querySelector(s.recentWordWrap);
		this.elClearRecentWordBtn 	= this.elTarget.querySelector(s.deletwWordBtn);
		this.elCloseButtonRWL		= this.elRecentWordLayer.querySelector(s.closeLayerBtn);
		this.elRecentULWrap			= this.elRecentWordLayer.querySelector(s.recentULWrap);

		this.htDefaultFn 			= super.getDefaultCallbackList(htDefaultFn);
		this.htUserFn 				= {};
		this.option 				= {};
	}

	registerUserMethod(htFn) {
		super.setOption(htFn, this.htDefaultFn, this.htUserFn);
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
		super.runCustomFn("USER", 'FN_AFTER_SELECT_RECENT_WORD', evt.target);
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
		super.runCustomFn("USER", "FN_AFTER_INSERT_RECENT_WORD", aData, this.option.maxList);
	}

	dockingPluginMethod(oParent) {
		oParent.registerPluginMethod({
			'FN_AFTER_FOCUS' 	: this.showRecentSearchWord.bind(this),
			'FN_AFTER_INPUT'	: this.handlerCloseLayer.bind(this),
			'FN_AFTER_SUBMIT'	: this.saveQuery.bind(this)
		});
	}


}