
class  LocalStorage {
	
	constructor() {
	}

	saveKeyword(sKeyword) {
		if( typeof(Storage) === "undefined") return;

		let aMergeData = []; 
		let sKey = "searchQuery";

		let newStr = sKeyword.trim();

		let aLegacy = this.getKeywords();

		//to Array
		if(aLegacy === null) aLegacy = []; 
		else aLegacy = JSON.parse(aLegacy);

		//save data 
		let nIndex = aLegacy.indexOf(sKeyword);
		if( nIndex > -1) {
			if(nIndex === (sKeyword.length-1)) return;
			aLegacy.splice(nIndex, 1);
		} 

		aLegacy.push(sKeyword);
		localStorage.setItem(sKey, JSON.stringify(aLegacy));
	}

	getKeywords(){ 
		if( typeof(Storage) === "undefined") return;

		let sKey = "searchQuery";
		let sResult = localStorage.getItem(sKey);
		return sResult;
	}

	removeKeywords() {
		if( typeof(Storage) === "undefined") return;

		let sKey = "searchQuery";
		return localStorage.removeItem(sKey);
	}

}