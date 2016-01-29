
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