/*
* The MIT License (MIT)
* Copyright (c) 2016 SK PLANET. All Rights Reserved. *
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: *
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software. *
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE. */

/*!
* \TTViewPlugin.js
* \plugin source for SweetSearch.js
* \copyright Copyright (c) 2016, SK PLANET. All Rights Reserved. 
* \license This project is released under the MIT License.
* \contributor Jisu Youn (jisu.youn@gmail.com)
* \warning dont'use this source in other library source.
*/

class TTViewPlugin extends CommonComponent {

	COMPONENT_CONFIG() {
		 return {
			SELECTOR 	: {
				TTWrap 			: ".tt-wrap",
				TTWrapCloseBtn 	: ".tt-wrap .close-layer"
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