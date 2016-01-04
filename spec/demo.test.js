
var oMyswipe = null;

System.import("../dist/swipe_es5.js").then(function(Myswipe) {
	oMyswipe = new Myswipe.default(document.getElementById("swipeWrap"), {
                'nDuration' : 100,  //default 100
                'nBackWidth' : 60,  //default 60
                'nSideWidth' : 20,  //default 0
                'nDecisionSlope' : 0.8, //default 0.8
                'nForcedSwipeTime' : 100, //default 0
            });

	oMyswipe.registerCallback({
		"beforeSwipe" : function(n){
			document.querySelector(".pageNumber").innerText = n;
		},
		"afterSwipe"  : function(){}
	});
});


describe("should test ", function(){

	before(function(){

		console.log("=============== [TEST START] swipe test  =============");

		//given
		oMyswipe.bAnimationing  = false
		oMyswipe.bSwipe = true;
		oMyswipe.bFirstTouchMove = false;
		oMyswipe.nPreMoveX = 0;
		oMyswipe.nPreMoveY = 0;

	});

	it('side moving limit', function () {

		oMyswipe.handlerTouchMove({
			"changedTouches" : [ { "pageX" : 100, "pageY" : 100} ],
			"preventDefault" : function(){},
		});

		var nResult = oMyswipe.getTranslate3dX(document.getElementById("swipeWrap"));
		nResult.should.be.equal(20);
	});


	it('movehandler 60px moving', function () {

		oMyswipe.setTranslate3dX(document.getElementById("swipeWrap"), 0);

		//given
		oMyswipe.nPreMoveX = 100;

		//when
		oMyswipe.handlerTouchMove({
			"changedTouches" : [ { "pageX" : 40, "pageY" : 100} ],
			"preventDefault" : function(){},
		});

		//test
		var nResult = oMyswipe.getTranslate3dX(document.getElementById("swipeWrap"));
		nResult.should.be.equal(-60);
	});

 

	it('async animation tests', function (done) {

		var nPreX = oMyswipe.getTranslate3dX(document.getElementById("swipeWrap"));

		var nDistance = 800;

		var nExpectedValue = nPreX + nDistance;

		// given
		oMyswipe.runAnimation(nDistance, 500, {
					'before' : function(){console.log("begin animation")},
					'after' :  function(){
						var nAfterX = oMyswipe.getTranslate3dX(document.getElementById("swipeWrap"));
						nAfterX.should.be.equal(nExpectedValue);
						done();
					}
		});
	});

});
