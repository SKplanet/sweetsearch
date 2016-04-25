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
* \RecentWordPlugin.js
* \plugin source for SweetSearch.js
* \copyright Copyright (c) 2016, SK PLANET. All Rights Reserved. 
* \license This project is released under the MIT License.
* \contributor Jisu Youn (jisu.youn@gmail.com)
* \warning dont'use this source in other library source.
*/

class RecentWordPlugin extends CommonComponent {
  COMPONENT_CONFIG() {
    return {
	    ELEMENT_SELECTOR: {
        recentWordWrap: ".recent-word-wrap",
        deleteWordBtn: ".delete-word",
        closeLayerBtn: ".close-layer",
        recentULWrap: ".ul-wrap"
      },
	    DEFAULT_COMPONENT_EVENT : [	
        'FN_AFTER_INSERT_RECENT_WORD',
        'FN_AFTER_SELECT_RECENT_WORD',
      ],
      DEFAULT_OPTION : {
        'usage' : true,
        'maxList' : 5
      }
    }
  }

  constructor(elTarget, htOption) {
    super(elTarget, htOption)
  }

  initValue(htOption) {
    this.oStorage = new RecentWordPluginLocalStorageAddOn("searchQuery", this.option.maxList);
    let s = this.COMPONENT_CONFIG().ELEMENT_SELECTOR;
    let _el = this.elTarget;
    this.elRecentWordLayer = _el.querySelector(s.recentWordWrap);
    this.elClearRecentWordBtn = _el.querySelector(s.deleteWordBtn);
    this.elCloseButtonRWL = this.elRecentWordLayer.querySelector(s.closeLayerBtn);
    this.elRecentULWrap	= this.elRecentWordLayer.querySelector(s.recentULWrap);
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
    if (this.isExecuteTouchScroll(nowPageY)) return;
    this.handlerCloseLayer();
    super.runCustomFn("USER", 'FN_AFTER_SELECT_RECENT_WORD', evt.target);
  }

  isExecuteTouchScroll(pageY) {
    var nDiff = this.htTouchStartSelectedWord.y - pageY;
    if (nDiff !== 0) return true;
    return false;
  }

  saveQuery(sQuery) {
    this.oStorage.saveKeyword(sQuery);
  }

  showRecentSearchWord() {
    let sData = this.oStorage.getKeywords();
    if (sData === null || sData === "") return;
    this.elRecentWordLayer.style.display = "block";
    this.elClearRecentWordBtn.style.display = "block";
    let aData = JSON.parse(sData);
    super.runCustomFn("USER", "FN_AFTER_INSERT_RECENT_WORD", aData, this.option.maxList);
  }

  dockingPluginMethod(oParent) {
    oParent.registerPluginMethod({
      'FN_AFTER_FOCUS': this.showRecentSearchWord.bind(this),
      'FN_AFTER_INPUT': this.handlerCloseLayer.bind(this),
      'FN_AFTER_SUBMIT': this.saveQuery.bind(this)
    });
  }
}