
class  LocalStorage {
	
	constructor(sKey) {
		this.sKey = sKey;
	}

	saveKeyword(sKeyword) {
		if( typeof(Storage) === "undefined") return;

		let aMergeData = []; 

		let newStr = sKeyword.trim();

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
		if( typeof(Storage) === "undefined") return;

		let sResult = localStorage.getItem(this.sKey);
		return sResult;
	}

	removeKeywords() {
		if( typeof(Storage) === "undefined") return;

		return localStorage.removeItem(this.sKey);
	}

	_validStorage() {

	}

}