
class  RecentWordPluginLocalStorageAddOn {
	
	constructor(sKey) {
		this.sKey = sKey;
	}

	saveKeyword(sKeyword) {
		if(this._validStorage()) return;

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

		aLegacy.push(sKeyword);
		localStorage.setItem(this.sKey, JSON.stringify(aLegacy));
	}

	getKeywords(){ 
		if(this._validStorage()) return;

		let sResult = localStorage.getItem(this.sKey);
		return sResult;
	}

	removeKeywords() {
		if(this._validStorage()) return;

		return localStorage.removeItem(this.sKey);
	}

	_validStorage() {
		if( typeof(Storage) === "undefined") return;
	}

}