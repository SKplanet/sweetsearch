'use strict'
describe("CommonComponent methods test", function() {

  var oCC = new CommonComponent();

  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });

  it("methods : setOption", function() {
	let htStorage = {};
	let htDefaultValue = {"name" : "jisu", "age" : 22};
	let htValue = {"name" : "john"};

	oCC.setOption(htValue, htDefaultValue, htStorage);
	expect(htStorage.name).toBe('john');
	expect(htStorage.age).toBe(22);
  });

  it("methods : setOption >> recursive test", function() {
	let htStorage = {};
	let htDefaultValue = {"family" : {"name" : "jisu"}};
	let htValue = {"family" : {"name" : "john"}};

	oCC.setOption(htValue, htDefaultValue, htStorage);
	expect(htValue.family.name).toBe('john');
  });

  it("methods : appendPluginMethod", function() {
	let htStorage 		= {};
	let htDefaultValue 	= {"GO" : function(){}, "BACK" : function(){}};
	let htValue 		= {"GO" : function gomethod(){}, "BACK" : function backmethod(){}};

	oCC.appendPluginMethod(htValue, htDefaultValue, htStorage);
	expect(htStorage["BACK"][0].name).toBe("backmethod");

	let htValue2 		= {"BACK" : function backmethod2(){}};

	oCC.appendPluginMethod(htValue2, htDefaultValue, htStorage);
	expect(htStorage["BACK"][0].name).toBe("backmethod");
	expect(htStorage["BACK"][1].name).toBe("backmethod2");
	expect(htStorage["GO"][0].name).toBe("gomethod");

  });


  it("methods : getDefaultCallbackList", function() {
	var aFn = ["MESSAGE1", "MESSAGE2", "MESSAGE3"];
	let htFn = oCC.getDefaultCallbackList(aFn);

	//check last object type.
	expect(typeof htFn[aFn[aFn.length-1]]).toBe("function");
  });

  it("methods : initPlugins", function() {
  	//golbal MockPlugin.
  	window.MockPlugin = function (elTarget, htOption) {
  		this.elTarget = elTarget;
  		this.htOption = htOption;
  	}

  	MockPlugin.prototype.registerUserMethod = function(fn) {
  		this.fn = fn;
  	}

  	MockPlugin.prototype.dockingPluginMethod = function(oParent) {
  		this.oParent = oParent;
  	}

  	let fnInsertRecentSearchWord = function() {};

  	let aMyPluginName = ["MockPlugin", "MyPlugin", "yourPlugin"];
  	let aPluginList = [{ 
		                'name'      : 'MockPlugin',
		                'option'    : {
		                	'nMaxSize' : 1000
		                },
		                'userMethod' : {'FN_AFTER_INSERT_RECENT_WORD'  : fnInsertRecentSearchWord}
            		}];

    let elTarget = document.createElement("div");

    oCC.initPlugins(aMyPluginName, aPluginList, elTarget);

    let bTest = oCC.htPluginInstance[aPluginList[0].name].constructor === MockPlugin;

    expect(bTest).toBe(true);

  });

});

