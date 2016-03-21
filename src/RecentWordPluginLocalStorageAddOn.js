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
* \RecentWordPluginLocalStorageAddOn.js
* \Addon source for RecentWordPlugin.js
* \copyright Copyright (c) 2016, SK PLANET. All Rights Reserved. 
* \license This project is released under the MIT License.
* \contributor Jisu Youn (jisu.youn@gmail.com)
* \warning dont'use this source in other library source.
*/

class  RecentWordPluginLocalStorageAddOn {
	
	constructor(sKey, nMaxList) {
		this.sKey = sKey;
		this.nMaxList = nMaxList;
	}

	saveKeyword(sKeyword) {
		if(this.validStorage()) return;

		let aLegacy = this.getKeywords();

		//to Array
		if(aLegacy === null) aLegacy = []; 
		else aLegacy = JSON.parse(aLegacy);

		//save data 
		let nIndex = aLegacy.indexOf(sKeyword);
		if( nIndex > -1) {
			if(nIndex === (aLegacy.length-1)) return;
			aLegacy.splice(nIndex, 1);
		} 

		aLegacy.unshift(sKeyword);
		if(aLegacy.length >= this.nMaxList) aLegacy.length = this.nMaxList;
		localStorage.setItem(this.sKey, JSON.stringify(aLegacy));
	}

	getKeywords(){ 
		if(this.validStorage()) return;

		let sResult = localStorage.getItem(this.sKey);
		return sResult;
	}

	removeKeywords() {
		if(this.validStorage()) return;

		return localStorage.removeItem(this.sKey);
	}

	validStorage() {
		if( typeof(Storage) === "undefined") return;
	}

}