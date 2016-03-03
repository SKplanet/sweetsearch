/**
 * @nigayo. SKPlanet.
 * @v0.0.6
 * @UIComponent TTViewPlugin
 */

class TTViewPlugin extends CommonComponent {

	COMPONENT_CONFIG() {
		 return {
			SELECTOR 	: {
				TTWrap 			: ".tt-wrap",
				TTWrapCloseBtn 	: ".tt-wrap .closeLayer"
			},
			DEFAULT_EVENT : [	
					'FN_AFTER_RECEIVE_DATA',
			],
			OPTIONS : {
					'usage' : true,
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
	}

	setInitValue() {
		let _d 						= this.COMPONENT_CONFIG();
		let s 						= _d.SELECTOR;
		this.htDefaultOption 		= _d.OPTIONS;
		this.htDefaultFn 			= super.getDefaultCallbackList(_d.DEFAULT_EVENT);

		this.elTTWrap 				= this.elTarget.querySelector(s.TTWrap);
		this.elTTWrapCloseBtn 		= this.elTarget.querySelector(s.TTWrapCloseBtn);

		this.htUserFn 				= {};
		this.option 				= {};
	}

	registerUserMethod(htFn) {
		super.setOption(htFn, this.htDefaultFn, this.htUserFn);
	}

	closeLayer() {
		this.closeTTView();
	}

	registerEvents() {
		this.elTTWrapCloseBtn.addEventListener("click", this.closeLayer.bind(this), false);
	}

	showTTView() {
		this.elTTWrap.style.display = "block";
	}

	closeTTView() {
		this.elTTWrap.style.display = "none";
	}

	dockingPluginMethod(oParent) {
		oParent.registerPluginMethod({
			'FN_AFTER_AC_NONE' : this.showTTView.bind(this),
			'FN_AFTER_AC_SHOW' : this.closeTTView.bind(this)
		});
	}
}