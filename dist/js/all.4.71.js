var opdGame={};//checked
opdGame.Views={};
opdGame.Modules={};

if(document.readyState==='complete'){
	opdGame.init();
}else{
	document.addEventListener('DOMContentLoaded',function(){opdGame.init();});
}

opdGame.init=function(){
	console.log(opdGame.model.version);

	//serverMets
	opdGame.serverMetrics.saveProgress(0);
	console.log('sent metrics 0');

	opdWrapper.setup('myCanvas','containerDiv');
	opdGame.model.orientation=opdWrapper.getOrientation();
	opdGame.model.canvasRatio=opdWrapper.getCanvasRatio();
	opdGame.stage=opdWrapper.makeStage();
	opdGame.view=new opdGame.View();
	opdGame.stage.addChild(opdGame.view);
	opdWrapper.setOrientationCallback(opdGame.view.orientationChange);
	opdWrapper.setResizeCallback(opdGame.view.updateResize);

	if(createjs.Sound.capabilities.ogg===false)opdGame.model.audOn=false;	
	if(createjs.BrowserDetect.isIOS){
		opdGame.model.touchMode=true;
		opdGame.model.userContentOn=false;
	}

	if(createjs.BrowserDetect.isAndroid){
		opdGame.model.touchMode=true;
		opdGame.model.userContentOn=false;
	}

	opdGame.model.siteLock=false;

	opdGame.controller.init();
};



(function(oG){//checked

oG.model={
	orientation:0,
	canvasRatio:1,

	preloadComplete:false,
	getPresetHash:true,
	usingPresetFlag:false,
	presetLoadingFlag:false,
	presetWaitingFlag:false,
	mainSpriteSheet:null,

	gameMode:null,
	loadTarget:'',

	gameScore:0,
	gameTime:0,
	gameLim:80,
	roundLim:10,
	speedVar:1,

	contentSpriteSheet:null,
	textArray:[],
	contentLim:0,
	contentCode:0,
	contentTitle:'title here',
	audioLoaded:false,
	loadDescriptions:false,

	useUserImages:false,
	useUserAudio:false,
	userImageArray:[],
	userAudioArray:[],

	showText:true,
	showAudio:true,
	gameSpeed:{val:2},

	autoReview:false,
	showReviewText:true,
	showReviewAudio:false,
	reviewAutoDelay:{val:1},
	reviewAudioDelay:{val:0},
	reviewTextDelay:{val:0},

	version:'v4.7',
	mainSpriteSrc:'mySprite.png',

	/*resFolder:'http://localhost/main/games/span/res/',
	preLoaderImageSrc:'http://localhost/main/games/span/res/siteLogo.png',
	contentFolder:'http://localhost/main/content_2/',*/
	/*resFolder:'http://192.168.2.132/main/games/span/res/',
	preLoaderImageSrc:'http://192.168.2.132/main/games/span/res/siteLogo.png',
	contentFolder:'http://192.168.2.132/main/content_2/',*/
	resFolder:'https://www.spanishinflow.com/res/',
	preLoaderImageSrc:'https://www.spanishinflow.com/res/siteLogo.png',
	contentFolder:'https://www.spanishinflow.com/content/',

	audioFolder:'audio/es/use/',
	siteUrl:'www.spanishinflow.com',
	siteUrlFull:'https://www.spanishinflow.com',
	scoresUrl:'https://www.spanishinflow.com/php/scores_all.php',
	scoresTable:'spanish_scores',

	gameType:0,
	userContentOn:true,
	contentMin:5,
	contentMax:24,
	siteLock:false,
	offSite:false,
	touchMode:false,
	audOn:false,
	lettersOnly:false,
	language:'Spanish'
};

}(opdGame));

(function(oG){
	var myReq=new XMLHttpRequest();
	var callback=function(jsonArr){};

	function getScoresLoc(getType,playerName,playerLocation){
		myReq=new XMLHttpRequest();
		myReq.addEventListener('readystatechange',gotScores);
		myReq.open('POST',oG.model.scoresUrl,true);
		myReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		var dTime=0;
		var dMoves=0;

		var myVars='name='+playerName;
		myVars+='&local='+playerLocation;
		myVars+='&score='+oG.model.gameScore;
		myVars+='&date='+new Date().getTime();
		myVars+='&time='+dTime;
		myVars+='&moves='+dMoves;
		myVars+='&content='+oG.model.contentCode;
		myVars+='&table='+oG.model.scoresTable;
		myVars+='&inBool='+getType;
		myVars+='&gameType='+oG.model.gameType;

		myReq.send(myVars);
	}

	function gotScores(){
		if(myReq.readyState==4&&myReq.status==200){
			var jsonArr=JSON.parse(myReq.responseText);
			callback(jsonArr);
			myReq.removeEventListener('readystatechange',gotScores);
		}
	}

	function setCallbackLoc(myFun){callback=myFun;}

	oG.scoresModel={
		getScores:getScoresLoc,
		setCallback:setCallbackLoc
	};

}(opdGame));


(function(oG){//checked
	function AboutView(){
		this.Container_constructor();
		this.setup();
	}
	var p=createjs.extend(AboutView,createjs.Container);

	p.setup=function(){
		this.backBut=new oG.Modules.Button('textBack','title',90);	
		this.myPaneBack=new createjs.Shape();
		this.myPane=new createjs.Shape();

		var aboutText="This is a mini game for learning Spanish.  You just listen or read the words and then click the matching image.  If you don't know the item, then you can guess or wait for some of the images to disappear until only the correct item remains, then try to remember the word for next time it comes up.\r\n\r\nThis is made completely with Javascript using the CreateJS framework and it should be completely usable on mobile and tablet devices.\r\n\r\nEmail me with any feedback or suggestion using the contact link in this page.";

		this.aboutTextField=new createjs.Text('','bold 18px Reem Kufi', '#555');
		this.aboutTitle=new createjs.Text('About','bold 26px Reem Kufi', '#555');
		this.aboutTextField.text=aboutText;

		this.addChild(this.myPaneBack,this.myPane);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			this.myPaneBack.graphics.clear().beginFill('#ffc').drawRoundRect(40,80,720,350,24);
			this.myPane.graphics.clear().beginFill('#fff').drawRoundRect(48,88,704,334,20);

			this.aboutTextField.lineWidth=600;

			opdLib.dispItem(this.aboutTextField,this,100,170);
			opdLib.dispItem(this.aboutTitle,this,360,120);
			opdLib.dispItem(this.backBut,this,400,480);
		}else{
			this.myPaneBack.graphics.clear().beginFill('#ffc').drawRoundRect(40,160,470,440,24);
			this.myPane.graphics.clear().beginFill('#fff').drawRoundRect(48,168,454,424,20);

			this.aboutTextField.lineWidth=360;

			opdLib.dispItem(this.aboutTextField,this,100,250);
			opdLib.dispItem(this.aboutTitle,this,235,200);
			opdLib.dispItem(this.backBut,this,275,680);
		}
	};

	p.orientationChange=function(){
		this.setupDisplay();
	};

	p.init=function(){
		this.backBut.addLists();

		opdLib.fadeIn(this,200,300);
	};

	p.deit=function(){
		this.backBut.removeLists();
	};

	oG.Views.AboutView=createjs.promote(AboutView,'Container');
}(opdGame));


(function(oG){//checked
	var audFramesEng=[];
	var audFramesSpa=[];
	var audFramesChi=[];

	function getAudFramesLoc($var){
		switch(oG.model.language){
			case 'English':
			return audFramesEng[$var];
			case 'Spanish':
			return audFramesSpa[$var];
			case 'Chinese':
			return audFramesChi[$var];
			default:
			return audFramesEng[$var];
		}
	}

	audFramesEng[0]=[915, 805, 865, 945, 1015, 995, 965, 675, 1075, 835, 995, 865, 785, 1095, 995, 805, 625, 915, 755, 995, 885, 735, 835, 735, 995, 705, 1075, 755, 1125, 1075];
	audFramesEng[1]=[1015, 1145, 1145, 1305, 915, 1045, 805, 1095, 1285, 965, 915, 785, 755, 675, 885, 945, 965, 885, 915, 865];
	audFramesEng[2]=[1515, 1015, 945, 965, 1075, 1255, 1095, 1435, 805, 1125, 1095, 1075, 1415, 1125, 965, 1355, 1305, 1675, 1015, 1595];

	audFramesEng[3]=[1075, 995, 885, 965, 1095, 1285, 1125, 1145, 915, 1015, 1225, 1045, 1205, 995, 1175, 865, 1045, 965, 965, 1125];

	audFramesEng[4]=[785, 865, 965, 1045, 995, 885, 885, 995, 945, 965];

	audFramesEng[5]=[1255, 1095, 1125, 965, 1095, 915, 945, 1225, 1045, 1175, 1855, 1305, 1935, 1015, 1205, 1145, 755, 1015, 1255];

	audFramesEng[6]=[915, 945, 835, 1075, 625, 995, 805, 1095, 835, 1145, 1175, 885, 1015, 1075, 995, 885, 1145, 1175, 1385, 1145, 945, 835, 915, 1355, 945, 1145, 1285, 915, 1125, 1095];

	audFramesEng[7]=[1205, 1075, 995, 1075, 965, 995, 865, 885, 885, 1125, 1225, 995, 1045, 1385, 805, 1415, 945, 1045, 1225, 805, 1225, 1225, 1285, 865, 995, 995, 1355, 1205, 945];

	audFramesEng[8]=[1255, 835, 885, 865, 1045, 1415, 785, 1145, 1075, 1005, 995, 1015, 1015, 1125, 1095, 2375, 1485, 1045, 755, 1205];

	audFramesEng[9]=[1645, 1015, 865, 1045, 1415, 1045, 1515, 1515, 1145, 885, 1145, 1465, 1645, 1125, 965, 965, 1255, 1175];

	audFramesEng[10]=[1045, 1125, 1095, 1205, 1225, 995, 1385, 1225, 915, 965, 1485, 995, 1175, 1095, 1075, 995, 1285, 1545, 1335, 1175, 1415, 1205, 1675, 1145, 1355, 1305];

	audFramesEng[11]=[885, 1095, 605, 945, 1095, 945, 785, 965, 885, 1285, 945, 1095, 1145, 945, 1335, 835, 915, 1205, 1125, 735, 1415, 1045, 945, 1205, 785, 1095, 1305, 1305, 1075, 945];

	audFramesEng[12]=[865, 1045, 995, 995, 915, 915, 1335, 1095, 1015, 1175, 1205, 1125, 1095, 1075, 1205, 965, 1145, 1095, 1335, 995];

	audFramesEng[13]=[915, 785, 735, 865, 785, 995, 835, 755, 965, 675, 865, 915, 1205, 1095, 1015, 1145, 1205, 965, 1145, 915, 1045];

	audFramesEng[14]=[915, 1045, 885, 1205, 885, 1565, 945, 1565, 965, 1075, 1095, 1305, 915, 1125, 995, 965, 1175, 835, 1415, 1305, 735, 785, 1355, 1045, 1015, 1485, 1075, 785, 1385];

	audFramesEng[15]=[1145, 1125, 995, 1125, 835, 1285, 1175, 1045, 1045, 915, 1125, 1015, 915, 1125, 755, 1145, 1695, 1075, 965, 1045, 965, 1015, 1385, 995, 1335, 1075, 1015, 1255, 1145];

	audFramesEng[16]=[1225, 1305, 1175, 835, 915, 915, 1305, 995, 1125, 1145, 805, 1335, 995, 995, 1255, 1485, 915, 1305, 1355, 865];

	audFramesEng[17]=[865, 995, 995, 1255, 1045, 995, 1095, 945, 1045, 1175, 1125, 1125, 1335, 1095, 1305, 995, 1435, 1205, 965];

	audFramesEng[18]=[865, 1075, 785, 945, 785, 1175, 945, 805, 1255, 785, 1045, 965, 1145, 835, 885, 1015, 805, 995, 1125, 945, 1225, 865, 1075, 1015, 965, 1075, 1015, 1095, 1095, 1125, 995, 675, 755, 1225, 965, 835, 995, 995, 915, 755];

	audFramesEng[19]=[1095, 995, 1435, 915, 915, 1015, 865, 1175, 1205, 865, 1125, 1225, 1205, 995, 965, 1175, 805, 705, 1045, 995];

	audFramesEng[20]=[965, 1335, 1515, 1515, 1015, 1045, 945, 1645, 1415, 1015, 1015, 945, 835, 1225, 965, 1675, 1015, 1255, 1565, 965];

	audFramesEng[21]=[1075, 1095, 1145, 915, 965, 1205, 1045, 1125, 1095, 865, 1145, 1125, 1125, 1095, 1385, 915, 1125, 1145, 995, 785, 1225, 1205, 945, 945, 1205, 865, 1285, 1255];

	audFramesEng[22]=[805, 705, 865, 735, 785, 705, 785, 865, 915, 995, 945, 945, 835, 785, 755, 785, 735, 805, 805, 705, 885, 1095, 995, 885, 915, 1075];


	audFramesSpa[0]=[810,840,680,990,520,810,840,910,1070,710,710,710,630,970,780,910,570,860,760,890,
710,680,650,730,860,570,760,860,810,1020];
	audFramesSpa[1]=[840,940,780,680,570,780,860,760,760,1120,650,760,710,1020,680,970,890,860,970,840];
	audFramesSpa[2]=[1780,890,840,890,970,730,780,1250,730,1310,760,1540,730,810,680,840,1020,910,780,1100];
	audFramesSpa[3]=[910,1040,970,990,940,1460,860,1250,840,940,910,910,1020,780,970,890,760,910,840,1020];
	audFramesSpa[4]=[];
	audFramesSpa[5]=[990,940,910,760,940,1150,1040,1150,1020,970,810,910,2140,1100,780,1040,970,940,840];
	audFramesSpa[6]=[1020,760,630,910,810,810,810,1070,860,840,1150,810,1180,630,840,890,810,890,1070,910,890,970,910,1280,
1070,890,990,760,910,1020];
	audFramesSpa[7]=[990,840,710,730,780,970,890,810,860,910,910,730,1150,1310,840,1020,680,990,780,760,990,970,710,990,730,
730,650,860,890];
	audFramesSpa[8]=[1040,860,810,780,1100,1490,1040,600,860,600,890,970,840,910,780,2090,940,810,860,1020];
	audFramesSpa[9]=[1100,710,780,1280,1540,890,1330,1410,1020,910,1020,1040,940,1100,910,1020,810,1230];
	audFramesSpa[10]=[910,940,940,1180,890,1040,860,1020,940,860,1330,970,1040,1070,940,1020,1120,2380,1230,1070,1310,860,2010,1150,1440,1200];


//[860,890,900,1140,860,1000,810,980,890,830,1280,930,990,1030,900,980,1070,2340,1200,1030,1260,820,1970,1100,1390,1160];

//[910,940,940,1180,890,1040,860,1020,940,860,2510,970,2040,1070,940,1020,1120,2380,1230,1070,1310,
//860,2010,1150,1440,1200];

	audFramesSpa[11]=[890,680,600,650,780,650,840,910,730,840,780,810,1180,970,780,940,780,1410,1280,780,1100,1880,
650,940,780,890,890,940,710,1020];
	audFramesSpa[12]=[730,1070,600,730,730,650,990,710,680,500,710,1100,710,810,1020,680,970,680,890,910];
	audFramesSpa[13]=[];
	audFramesSpa[14]=[910,680,910,970,860,1150,940,1040,860,810,780,1200,730,680,650,940,1490,760,910,1180,810,780,
910,1100,1020,1180,680,650,1120];
	audFramesSpa[15]=[1280,890,680,1120,760,1280,860,840,1020,860,890,910,710,910,630,860,1570,760,780,710,990,970,
1070,1280,1440,970,1360,1380,1570];
	audFramesSpa[16]=[1230,1380,780,710,680,730,940,860,940,1280,810,1100,990,760,1460,2220,990,30,1280,890];
	audFramesSpa[17]=[760,860,710,1100,710,840,600,780,730,1150,1040,1380,1590,910,1040,730,970,810,1040];
	audFramesSpa[18]=[890,780,600,810,810,1120,710,680,810,890,810,940,860,1020,940,710,780,1250,780,970,
1070,840,970,860,730,910,990,810,780,760,730,1150,910,1280,860,860,810,860,860,970];
	audFramesSpa[19]=[680,910,910,680,840,710,730,780,1100,890,940,890,730,730,910,1440,760,810,1120,860];
	audFramesSpa[20]=[860,1280,1310,1150,840,860,1040,760,990,970,730,910,890,780,1100,970,1100,1150,1230,940];
	audFramesSpa[21]=[940,860,1250,780,990,1720,780,760,840,470,710,970,730,1150,1280,890,1250,1120,780,1180,
710,890,730,1150,840,760,1330,1040];

	audFramesChi[0]=[1010,700,940,940,880,940,1120,750,1010,1170,990,860,780,1170,1140,860,780,880,880,1140,1040,
1040,1070,960,1200,1170,1220,910,860,1120];
	audFramesChi[1]=[910,960,1070,1300,960,990,910,910,960,1300,1090,830,1040,1200,1220,910,1070,1070,910,1040];
	audFramesChi[2]=[1350,1220,1120,1170,1010,1090,1140,1330,1120,1170,940,1770,1640,1250,880,1220,990,1070,1590,1200];
	audFramesChi[3]=[1140,1430,910,910,960,1010,1090,1010,1140,1090,1090,1090,1200,1070,1120,1140,1220,1070,1140,1170];
	audFramesChi[4]=[880,940,990,1070,990,960,990,1040,990,1010];
	audFramesChi[5]=[1120,1220,1140,1800,1330,1040,1330,1170,1140,1040,1410,1170,1350,1200,780,1330,1200,1040,1350];
	audFramesChi[6]=[1220,1140,1040,1250,1010,1200,1250,990,1040,1010,1200,1070,1220,1010,1070,1040,1330,1140,1140,
1480,1040,1120,1140,1010,960,1040,1380,940,1170,1200];
	audFramesChi[7]=[830,960,910,1090,990,1140,940,1170,1280,1170,960,990,1200,1120,1120,960,990,1140,1140,830,1350,1040,
1410,1040,1090,1170,1010,1670,990];
	audFramesChi[8]=[1140,830,1040,880,800,1220,830,880,1040,910,1170,1120,1010,1140,910,1820,1070,1120,1140,1480];
	audFramesChi[9]=[880,1090,1170,910,1380,1220,1120,1010,860,670,960,990,960,600,860,1140,1280,1120];
	audFramesChi[10]=[1140,940,1040,1090,1410,1040,1120,1010,1010,1280,1010,1220,1120,1010,1040,1590,1120,1070,
1140,1070,1010,1090,1040,1120,1330,1300];
	audFramesChi[11]=[880,910,730,800,1010,670,860,800,940,1070,1170,1410,1040,830,1560,1280,960,1070,1010,1010,
1120,990,880,1120,1200,990,960,990,1120,1040];
	audFramesChi[12]=[1170,880,750,860,940,880,910,910,800,910,1010,1170,1040,880,1220,940,1090,1070,1280,860];
	audFramesChi[13]=[730,650,860,800,860,730,830,700,960,1090,1170,1010,1170,1090,1250,990,1120,1120,1330,1120];
	audFramesChi[14]=[700,1250,860,990,960,1120,1040,1380,1280,1140,1220,1250,1140,990,1040,990,1430,1220,1430,1280,
1090,1120,1200,1010,1070,1300,1330,800,1410];
	audFramesChi[15]=[1200,1220,1220,1090,1560,1380,1200,1010,1070,1140,1220,1120,1220,1280,1300,1040,1590,1980,1380,
1120,1120,1250,1070,1090,1170,1010,1120,1590,1090];
	audFramesChi[16]=[1140,1220,1140,960,1010,1250,1410,1090,1170,1300,1200,1220,990,1120,1380,1220,1330,1120,1330,940];
	audFramesChi[17]=[1300,1040,1170,1350,1010,940,1200,1140,910,1280,960,1170,1380,1200,1250,1040,1070,1300,1010];
	audFramesChi[18]=[1280,1140,1170,1170,830,1070,940,1120,1200,780,1170,670,1090,1250,990,1170,1170,1300,1140,1220,1200,1250,960,
1250,1040,1070,1460,1220,1250,1140,780,1200,1300,1170,1040,1170,1010,1220,1070,1220];
	audFramesChi[19]=[830,1170,750,910,1250,1140,1200,1090,1220,1170,1120,1090,1280,940,1280,1120,1510,1300,1200,1170];
	audFramesChi[20]=[1090,1140,1010,1170,1200,1070,1220,1120,1350,1120,1250,1300,1170,940,1170,1750,700,1460,1300,700];
	audFramesChi[21]=[1120,1220,1120,830,1200,1090,1140,1040,960,990,1120,1200,960,1040,1300,1090,990,1250,1220,1140,
1220,1640,990,960,910,1350,1140,1410];

	oG.audioVars={getAudFrames:getAudFramesLoc};
}(opdGame));



(function(oG){//checked
	var contentLoader=null;
	var tSection=[];

	function initLoc(){
		createFileInputEl();
		if(oG.model.userContentOn)document.getElementById('leFileIn').addEventListener('change',fileInputEvent);
		contentLoader=new oG.Modules.ContentLoader();
		contentLoader.addEventListener('loadComplete',loadComplete);
		contentLoader.addEventListener('audComplete',audContentLoaded);
		tSection=oG.textContent.getSections();
		for(var i=0;i<tSection.length;i++){
			tSection[i]=tSection[i].replace(' ','');
		}
		if(oG.model.getPresetHash===true)hashCheck();
	}

	function loadCompleteStartGame(){
		oG.controller.loadComplete();
	}

	function loadContentLoc(gVar){
		loadSetContentVars(gVar);
		contentLoader.loadContentSet(gVar);
	}

	function loadSetContentVars(gVar){
		oG.model.contentCode=gVar;
		oG.model.textArray=oG.textContent.getText(gVar);
		oG.model.contentTitle=oG.textContent.getSection(gVar);
		oG.model.contentLim=oG.textContent.getContentLim(gVar);
		oG.model.useUserImages=false;
		oG.model.useUserAudio=false;
	}

	function loadComplete(){
		if(oG.model.usingPresetFlag){
			oG.model.presetLoadingFlag=false;
			presetLoadingSwtichLoc();
		}else{
			loadCompleteStartGame();
		}
	}

	function dontLoadAudioLoc(){
		contentLoader.loadAudioBool=false;
	}

	function audContentLoaded(){
		if(oG.model.preloadComplete)oG.controller.audContentLoaded();
	}

	function presetLoadingSwtichLoc(){
		if(!oG.model.presetLoadingFlag&&!oG.model.presetWaitingFlag){
			loadCompleteStartGame();
			return true;
		}else{
			return false;
		}
	}

	function createFileInputEl(){
		var fileIn=document.createElement('input');
		fileIn.id='leFileIn';
		fileIn.setAttribute('type','file');
		fileIn.setAttribute('multiple','multiple');
		fileIn.style.display='none';
		document.getElementById('containerDiv').appendChild(fileIn);
		document.getElementById('leFileIn').onclick=function(){this.value=null;};
	}

	function openFileDialogLoc(){document.getElementById('leFileIn').click();}

	function fileInputEvent(e){oG.view.contentView.fileInputEvent(e.target.files);}

	function addClickedLoc(){
		if(oG.view.contentView.user.active===true){
			oG.view.contentView.showUser();
		}else{
			openFileDialogLoc();
		}
	}

	function beginClickLoc(){
		oG.view.contentView.user.items.setContent();
		oG.model.contentTitle='user content';
		oG.model.contentCode=-2;
		oG.model.useUserImages=true;
		oG.model.useUserAudio=true;
		oG.model.audioLoaded=true;

		loadCompleteStartGame();
	}

	function clearClickLoc(){oG.view.contentView.user.items.clearAll();}

	function hashCheck(){
		var myHash=window.location.hash.substr(1);
		if(myHash){
			//comments append like this - comment-page-4/#comment-8658
			var isCom=myHash.indexOf('comment-');
			if(isCom==-1){
				var gStr=myHash.split('/')[1];
				var gVar=tSection.indexOf(gStr);
				if(gVar!=-1){
					oG.model.siteLock=false;
					oG.model.usingPresetFlag=true;
					oG.model.presetLoadingFlag=true;
					oG.model.presetWaitingFlag=true;
					loadContentLoc(gVar);
				}
			}
		}
	}

	function resizeInputBitLoc(){
		oG.view.contentView.user.resizeInputBit();
	}

	var out={
		init:initLoc,
		openFileDialog:openFileDialogLoc,
		addClicked:addClickedLoc,
		beginClick:beginClickLoc,
		clearClick:clearClickLoc,
		loadContent:loadContentLoc,
		resizeInputBit:resizeInputBitLoc,
		presetLoadingSwtich:presetLoadingSwtichLoc,
		dontLoadAudio:dontLoadAudioLoc
	};

	oG.contentController=out;
}(opdGame));


(function(oG){//checked
	function contentLoader(){
		this.EventDispatcher_constructor();
		this.imagesLoadedFun=this.imagesLoaded.bind(this);
		this.imagesLoadErrorFun=this.imagesLoadError.bind(this);
		this.audioLoadedFun=this.audioLoaded.bind(this);
		this.audioLoadErrorFun=this.audioLoadError.bind(this);
		this.setup();
	}
	var p=createjs.extend(contentLoader,createjs.EventDispatcher);

	p.setup=function(){
		this.loadAudioBool=true;
		this.myContentLoader=null;
		this.imFolder=oG.model.contentFolder+'images/use/';
		this.auFolder=oG.model.contentFolder+oG.model.audioFolder;
		if(oG.model.loadDescriptions)this.deFolder=oG.model.contentFolder+'descText/';
		createjs.Sound.alternateExtensions=["mp3"];
	};

	p.loadContentSet=function(gVar){
		this.gVar=gVar;
		this.retriedOnce=false;
		this.retriedOnceAudio=false;

		createjs.Sound.removeSound('soundId');
		oG.model.audioLoaded=false;

		if(this.myContentLoader!==null){
			this.clearupContentLoader();
		}
		this.loadImages();
	};

	p.loadImages=function(){
		this.myManifest=[{src:this.imFolder+'s_'+this.gVar+'.png',id:'mySprite'}];
		if(oG.model.loadDescriptions)this.myManifest.push({src:this.deFolder+'desc_'+this.gVar+'.json',id:'myText'});
		this.myContentLoader=new createjs.LoadQueue(false);
		this.myContentLoader.addEventListener('error',this.imagesLoadErrorFun);
		this.myContentLoader.addEventListener('complete',this.imagesLoadedFun);
		this.myContentLoader.loadManifest(this.myManifest,true);
	};

	p.imagesLoadError=function(){
		this.clearupContentLoader();
		if(!this.retriedOnce){
			console.log('Load Error - retrying one time');
			this.retriedOnce=true;
			this.loadImages();
		}else{
			console.log('Load Error - giving up');
			oG.view.changeView('content');
		}
	};

	p.imagesLoaded=function(){
		var frms=oG.imageVars.getImFrames(this.gVar);
		oG.model.contentSpriteSheet=new createjs.SpriteSheet({
			images:[this.myContentLoader.getResult('mySprite')],
			frames:frms
		});
		if(oG.model.loadDescriptions){			
			oG.model.gameDescSeq=this.myContentLoader.getResult('myText').order;
			oG.model.descArray=this.myContentLoader.getResult('myText').texts;
		}
		this.myContentLoader.removeEventListener('complete',this.imagesLoadedFun);
		this.myContentLoader.removeEventListener('error',this.imagesLoadErrorFun);
		this.myContentLoader.destroy();
		this.myContentLoader=null;
		this.dispatchEvent('loadComplete');
		if(this.loadAudioBool)this.loadAudio();
	};

	p.loadAudio=function(){
		this.myAuSpri=[];
		var myAudDur=oG.audioVars.getAudFrames(this.gVar);
		var cumDur=0;
		for(var i=0;i<myAudDur.length;i++){
			this.myAuSpri.push({id:'s_'+i,startTime:cumDur,duration:myAudDur[i]});
			cumDur+=myAudDur[i];
		}
		this.audManifest=[{src:this.auFolder+'s_'+this.gVar+'.ogg',id:'soundId',data:{audioSprite:this.myAuSpri}}];
		this.myContentLoader=new createjs.LoadQueue(false);
		this.myContentLoader.installPlugin(createjs.Sound);
		this.myContentLoader.addEventListener('complete',this.audioLoadedFun);
		this.myContentLoader.addEventListener('error',this.audioLoadErrorFun);
		this.myContentLoader.loadManifest(this.audManifest,true);
	};

	p.audioLoadError=function(){
		this.clearupContentLoader();
		oG.model.audioLoaded=false;
		if(!this.retriedOnceAudio){
			console.log('Audio load failure - retrying once');
			this.retriedOnceAudio=true;
			this.loadAudio();
		}else{
			console.log('Audio load failure - giving up');
		}
	};

	p.audioLoaded=function(){
		oG.model.audioLoaded=true;
		this.clearupContentLoader();
		this.dispatchEvent('audComplete');
	};

	p.clearupContentLoader=function(){
		this.myContentLoader.removeEventListener('complete',this.audioLoadedFun);
		this.myContentLoader.removeEventListener('error',this.audioLoadErrorFun);
		this.myContentLoader.removeEventListener('complete',this.contentLoadedFun);
		this.myContentLoader.removeEventListener('error',this.imageLoadErrorFun);
		this.myContentLoader.destroy();
		this.myContentLoader=null;
	};

	oG.Modules.ContentLoader=createjs.promote(contentLoader,'EventDispatcher');
}(opdGame));


(function(oG){//checked
	function UserAudioTextPane(gText,gInd,gHas){
		this.Container_constructor();
		this.aText=gText;
		this.ind=gInd;
		this.hasSound=gHas;
		this.setup();
	}
	var p=createjs.extend(UserAudioTextPane,createjs.Container);

	p.setup=function(){
		this.mouseChildren=false;
		this.cursor='pointer';
		this.audioBack=new createjs.Shape();
		if(this.gHas){
			this.audioBack.graphics.beginFill('#ddd');
		}else{
			this.audioBack.graphics.beginFill('#ccc');
		}
		this.audioBack.graphics.drawRoundRect(5,0,80,20,6);
		this.audioText=new createjs.Text(this.aText,'bold 10px Arial','#333');
		opdLib.centerText(this.audioText);
		this.addChild(this.audioBack);
		opdLib.dispItem(this.audioText,this,45,14);
	};

	p.deSetup=function(){
		this.aText=null;
		this.ind=null;
		this.hasSound=null;
		this.cursor='default';
		this.removeChild(this.audioBack);
		this.removeChild(this.audioText);
		this.audioBack=null;
		this.audioText=null;
	};

	oG.Modules.UserAudioTextPane=createjs.promote(UserAudioTextPane,'Container');
}(opdGame));

(function(oG){
	function UserContentBit(gInd,gIm,gText){
		this.Container_constructor();
		this.im=gIm;
		this.ind=gInd;
		this.imText=gText.slice(0,gText.indexOf('.'));
		this.setup();
	}
	var p=createjs.extend(UserContentBit,createjs.Container);

	p.setup=function(){
		this.addChild(this.im);

		this.clearBut=new createjs.Container();
		this.clearBut.mouseChildren=false;
		this.clearBut.ind=this.ind;
		var clearButOut=new createjs.Shape();
		clearButOut.graphics.beginFill('#FF6262').drawCircle(0,0,6);
		opdLib.dispItem(clearButOut,this.clearBut,0,0);
		var clearButIn=new createjs.Shape();
		clearButIn.graphics.beginFill('#ddd').drawCircle(0,0,4);
		opdLib.dispItem(clearButIn,this.clearBut,0,0);

		opdLib.dispItem(this.clearBut,this,3,3);

		this.textPane=new createjs.Container();
		this.textPane.ind=this.ind;
		this.textPane.mouseChildren=false;
		this.textBack=new createjs.Shape();
		this.textBack.graphics.beginStroke('#ccc').beginFill('#eee').drawRoundRect(0,0,86,24,6);
		this.textPane.addChild(this.textBack);
		this.dText=new createjs.Text('','bold 12px Arial','#333');

		this.textPane.cursor='pointer';
		this.clearBut.cursor='pointer';
		opdLib.centerText(this.dText);
		opdLib.dispItem(this.dText,this.textPane,43,16);
		opdLib.dispItem(this.textPane,this,-3,60);
		this.setText();
	};

	p.changeBit=function(gIm,gText){
		this.removeChild(this.im);
		this.im=null;
		this.im=gIm;
		this.addChild(this.im);
		this.imText=gText;
		this.setText();
		this.removeChild(this.textPane);
		this.addChild(this.textPane);
		this.removeChild(this.clearBut);
		this.addChild(this.clearBut);
		
	};

	p.removeIm=function(){
		this.textPane.cursor='default';
		this.clearBut.cursor='default';
		this.removeChild(this.im);
		this.im=null;
	};

	p.setText=function(){
		this.imText=this.imText.slice(0,16);
		var len=this.imText.length;
		if(oG.model.lettersOnly){
			for(var i=0;i<len;i++){
				this.imText=this.imText.replace(/[^a-z ]/,'');
			}
		}
		this.dText.text=this.imText;
	};

	p.resetImPos=function(){
		this.im.x=0;
		this.im.y=0;
		this.removeChild(this.im);
		this.addChild(this.im);
		this.removeChild(this.textPane);
		this.addChild(this.textPane);
		opdLib.scaleImage(this.im,80);
	};

	oG.Modules.UserContentBit=createjs.promote(UserContentBit,'Container');
}(opdGame));


(function(oG){
	function ContentButton(gLabel){
		this.Container_constructor();
		this.label=gLabel;
		this.outerFun=this.outer.bind(this);
		this.overerFun=this.overer.bind(this);
		this.clickerFun=this.clicker.bind(this);
		this.setup();
	}
	var p=createjs.extend(ContentButton,createjs.Container);

	p.setup=function(){
		this.mouseChildren=false;
		this.back=new createjs.Shape();
		this.back.graphics.beginStroke('#ccc').beginFill('#ff8').drawRoundRect(0,0,120,40,12);
		var back2=new createjs.Shape();
		back2.graphics.beginStroke('#ccc').beginFill('#fff').drawRoundRect(0,0,120,40,12);

		this.addChild(back2,this.back);

		var mText=new createjs.Text(this.label,'bold 20px Arial','#555');
		opdLib.centerText(mText);
		opdLib.dispItem(mText,this,60,27);
	};

	p.overer=function(event){
		createjs.Tween.removeTweens(this.back);
		createjs.Tween.get(this.back,{loop:false}).to({alpha:0},100);
	};

	p.outer=function(event){
		createjs.Tween.removeTweens(this.back);
		createjs.Tween.get(this.back,{loop:false}).to({alpha:1},100);
	};

	p.clicker=function(event){
		createjs.Tween.removeTweens(this.back);
		createjs.Tween.get(this.back,{loop:false}).to({alpha:1},100);
	};

	p.init=function(){		
		this.cursor='pointer';
		if(!oG.model.touchMode){
			this.addEventListener('mouseover',this.overerFun);
			this.addEventListener('mouseout',this.outerFun);
		}
		this.addEventListener('click',this.clickerFun);
	};

	p.deit=function(){		
		this.cursor='default';
		if(!oG.model.touchMode){
			this.removeEventListener('mouseover',this.overerFun);
			this.removeEventListener('mouseout',this.outerFun);
		}
		this.removeEventListener('click',this.clickerFun);
	};
	
	oG.Modules.ContentButton=createjs.promote(ContentButton,'Container');
}(opdGame));


(function(oG){//checked
	function ContentView(){
		this.Container_constructor();
		this.closeUserFun=this.closeUser.bind(this);
		this.setup();
	}
	var p=createjs.extend(ContentView,createjs.Container);

	p.setup=function(){
		this.main=new oG.Views.ContentViewMain();
		this.user=new oG.Views.ContentViewUser();
		this.addChild(this.main);
		this.addChild(this.user);
		this.main.visible=false;
		this.user.visible=false;
		this.curView='main';
		this.main.setupDisplay();
		this.user.setupDisplay();
	};

	p.orientationChange=function(){
		this.main.setupDisplay();
		this.user.setupDisplay();
	};

	p.showMain=function(){
		this.curView='main';
		this.main.visible=true;
		this.main.init();
	};

	p.closeMain=function(){
		this.main.deit();
		this.main.visible=false;
	};

	p.showUser=function(){
		this.curView='user';
		this.closeMain();
		this.user.visible=true;
		this.user.init();
		this.user.menu.closeBut.addEventListener('click',this.closeUserFun);
	};

	p.closeUser=function(){
		this.user.deit();
		this.user.menu.closeBut.removeEventListener('click',this.closeUserFun);
		this.user.visible=false;
		this.showMain();
	};

	p.fileInputEvent=function(files){
		if(this.curView=='main')this.showUser();
		this.user.items.addFiles(files);
	};

	p.init=function(){
		switch(this.curView){
			case 'main':
			this.showMain();
			break;
			case 'user':
			this.showUser();
			break;
		}
	};

	p.deit=function(){
		this.user.menu.closeBut.removeEventListener('click',this.closeUserFun);
		this.user.deit();
		this.user.visible=false;
		this.closeMain();
	};

	oG.Views.ContentView=createjs.promote(ContentView,'Container');
}(opdGame));


(function(oG){//checked
	function ContentViewMain(){
		this.Container_constructor();
		this.contentItemClickedFun=this.contentItemClicked.bind(this);
		this.shapeOverFun=this.shapeOver.bind(this);
		this.shapeOutFun=this.shapeOut.bind(this);
		this.tockerFun=this.tocker.bind(this);
		this.setup();
	}
	var p=createjs.extend(ContentViewMain,createjs.Container);

	var SHAPES_Y=[158,249,340,431];
	var PSHAPES_Y=[270,360,450,540,630];
	var SHAPE_INI=[222,130,176];
	var PSHAPE_INI=[50,97,189];
	var SHAPE_WID=92;
	var CONTENT_SEQ_LAND=[
			14,6,0,16,3,
			1,15,10,5,7,17,
			11,2,8,12,
			20,19,21,18,9];

	var CONTENT_SEQ_PORT=[
			14,6,0,16,3,
			11,2,8,12,
			1,15,10,5,7,
			17,9,
			20,19,21,18];

	p.setup=function(){
		this.paneContainer=new createjs.Container();

		this.contentTitle=new createjs.Text('Select Content','bold 36px Alegreya Sans','#333');
		this.contentTitleSmall=new createjs.Text('Select Content','bold 22px Alegreya Sans','#333');
		this.overText=new createjs.Text('','bold 14px Arial','#333');
		this.overTextSmall=new createjs.Text('','bold 13px Arial','#333');

		this.tmpBorder=new createjs.Shape();
		this.tmpInner=new createjs.Shape();
		this.textPaneBorder=new createjs.Shape();
		this.textPaneInner=new createjs.Shape();

		this.contentTitleSmall.visible=false;
		this.overTextSmall.visible=false;

		opdLib.centerText(this.contentTitle);
		opdLib.centerText(this.contentTitleSmall);
		opdLib.centerText(this.overTextSmall);
		opdLib.centerText(this.overText);

		this.contentPaneIms=new oG.Modules.ContentPaneImages();

		this.myShapesHolder=new createjs.Container();
		this.myShapes=[];
		for(var i=0;i<21;i++){
			this.myShapes[i]=new createjs.Shape();
			this.myShapes[i].cursor='pointer';
			this.myShapes[i].val=i;
			this.myShapes[i].graphics.beginFill('#000').drawRoundRect(0,0,80,80,8);
			this.myShapes[i].alpha=0.01;
			this.myShapesHolder.addChild(this.myShapes[i]);
		}

		if(!oG.model.userContentOn)this.myShapesHolder.removeChild(this.myShapes[20]);

		this.paneContainer.addChild(this.tmpBorder,this.tmpInner,this.textPaneBorder,this.textPaneInner);
		this.paneContainer.addChild(this.contentTitle,this.contentTitleSmall,this.overText,this.overTextSmall);
		this.addChild(this.paneContainer,this.contentPaneIms,this.myShapesHolder);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		this.tmpInner.graphics.clear().setStrokeStyle(4).beginStroke('#ddd').beginFill('#F1F1F1');
		this.tmpBorder.graphics.clear().setStrokeStyle(2).beginStroke('#333').beginFill('#555');

		this.textPaneBorder.graphics.clear().setStrokeStyle(3).beginStroke('#999').beginFill('#ccc');
		this.textPaneInner.graphics.clear().beginFill('#fff');

		if(oG.model.orientation===0){
			this.overText.lineWidth=520;
			this.overTextSmall.lineWidth=520;

			this.textPaneWid=560;
			this.textPaneHei=126;
			this.textPaneBord=20;
			this.textPaneX=400;
			this.textPaneY=80;

			this.paneWid=740;
			this.paneHei=470;
			this.paneBord=20;
			this.paneX=400;
			this.paneY=300;

			opdLib.posItem(this.contentTitle,400,90);
			opdLib.posItem(this.contentTitleSmall,400,53);
			opdLib.posItem(this.overText,400,78);
			opdLib.posItem(this.overTextSmall,400,78);

			this.contentSeq=CONTENT_SEQ_LAND;
		}else{
			this.overText.lineWidth=380;
			this.overTextSmall.lineWidth=380;

			this.textPaneWid=420;
			this.textPaneHei=166;
			this.textPaneBord=20;
			this.textPaneX=275;
			this.textPaneY=160;

			this.paneWid=512;
			this.paneHei=600;
			this.paneBord=20;
			this.paneX=275;
			this.paneY=444;

			opdLib.posItem(this.contentTitle,275,170);
			opdLib.posItem(this.contentTitleSmall,275,133);
			opdLib.posItem(this.overText,275,158);
			opdLib.posItem(this.overTextSmall,275,158);

			this.contentSeq=CONTENT_SEQ_PORT;
		}

		this.textPaneBorder.graphics.drawRoundRect(-this.textPaneWid/2,-this.textPaneHei/2,this.textPaneWid,this.textPaneHei,12);
		var wid=this.textPaneWid-this.textPaneBord;
		var hei=this.textPaneHei-this.textPaneBord;
		this.textPaneInner.graphics.drawRoundRect(-wid/2,-hei/2,wid,hei,8);
		opdLib.posItem(this.textPaneBorder,this.textPaneX,this.textPaneY);
		opdLib.posItem(this.textPaneInner,this.textPaneX,this.textPaneY);

		wid=this.paneWid-this.paneBord;
		hei=this.paneHei-this.paneBord;
		this.tmpBorder.graphics.drawRoundRect(-this.paneWid/2,-this.paneHei/2,this.paneWid,this.paneHei,20);
		this.tmpInner.graphics.drawRoundRect(-wid/2,-hei/2,wid,hei,12);
		opdLib.posItem(this.tmpBorder,this.paneX,this.paneY);
		opdLib.posItem(this.tmpInner,this.paneX,this.paneY);

		this.contentPaneIms.setupDisplay();
		this.posShapes();
	};

	p.posShapes=function(){
		var myShapesX=[];
		var myShapesY=[];
		var i=0;

		if(oG.model.orientation===0){
			var ini=SHAPE_INI[1];
			if(oG.model.userContentOn===false)ini=SHAPE_INI[2];
			for(i=0;i<5;i++){
				myShapesX[i]=SHAPE_INI[2]+i*SHAPE_WID;
				myShapesY[i]=SHAPES_Y[0];
			}
			for(i=0;i<6;i++){
				myShapesX[i+5]=SHAPE_INI[1]+i*SHAPE_WID;
				myShapesY[i+5]=SHAPES_Y[1];
				myShapesX[i+15]=ini+i*SHAPE_WID;
				myShapesY[i+15]=SHAPES_Y[3];
			}
			for(i=0;i<4;i++){
				myShapesX[i+11]=SHAPE_INI[0]+i*SHAPE_WID;
				myShapesY[i+11]=SHAPES_Y[2];
			}
			this.myShapes[20].visible=true;
		}else{
			for(i=0;i<5;i++){
				myShapesX[i]=PSHAPE_INI[0]+i*SHAPE_WID;
				myShapesY[i]=PSHAPES_Y[0];
				myShapesX[i+9]=PSHAPE_INI[0]+i*SHAPE_WID;
				myShapesY[i+9]=PSHAPES_Y[2];
			}
			for(i=0;i<4;i++){
				myShapesX[i+5]=PSHAPE_INI[1]+i*SHAPE_WID;
				myShapesY[i+5]=PSHAPES_Y[1];
				myShapesX[i+16]=PSHAPE_INI[1]+i*SHAPE_WID;
				myShapesY[i+16]=PSHAPES_Y[4];
			}
			for(i=0;i<2;i++){
				myShapesX[i+14]=PSHAPE_INI[2]+i*SHAPE_WID;
				myShapesY[i+14]=PSHAPES_Y[3];
			}
			this.myShapes[20].visible=false;
		}

		for(i=0;i<21;i++){
			this.myShapes[i].x=myShapesX[i];
			this.myShapes[i].y=myShapesY[i];
		}
	};

	p.contentItemClicked=function(event){
		var cVar=event.target.val;
		if(cVar==20){
			if(oG.model.userContentOn)oG.contentController.addClicked();
		}else{
			this.displayLoading();
			oG.contentController.loadContent(this.contentSeq[cVar]);
		}
	};

	p.displayLoading=function(){
		this.myShapesHolder.removeEventListener('click',this.contentItemClickedFun);
		this.myShapesHolder.removeEventListener('mouseover',this.shapeOverFun);
		this.myShapesHolder.removeEventListener('mouseout',this.shapeOutFun);
		this.contentTitle.visible=true;
		this.contentTitleSmall.visible=false;
		this.overTextSmall.visible=false;
		this.overText.visible=false;
		this.contentTitle.text='loading';
		this.contentTitle.textAlign='left';
		if(oG.model.orientation===0){
			this.contentTitle.x=300;
		}else{
			this.contentTitle.x=175;
		}
		this.loadProgressVar=0;

		createjs.Ticker.addEventListener('tick',this.tockerFun);
	};

	p.tocker=function(event){
		var pText='loading';
		this.loadProgressVar++;
		if(this.loadProgressVar>20)this.loadProgressVar=0;
		for(i=0;i<this.loadProgressVar;i+=2)pText+='.';
		this.contentTitle.text=pText;
	};

	p.shapeOver=function(event){
		var tarVal=event.target.val;
		this.contentTitle.visible=false;
		this.contentTitleSmall.visible=true;
		if(tarVal!=20){
			var tmp=oG.textContent.getText(this.contentSeq[tarVal]);
			var oText=tmp[0];
			for(i=1;i<tmp.length;i++){
				oText+=', ';
				oText+=tmp[i];
			}
			this.overText.text=oText;
			if(this.contentSeq[tarVal]==18||this.contentSeq[tarVal]==15||this.contentSeq[tarVal]==10){
				this.overTextSmall.visible=true;
				this.overTextSmall.text=oText;
				this.overText.visible=false;
			}
		}else{
			if(oG.model.userContentOn){
				this.overText.text='Use images from your own computer';
			}else{
				this.overText.text='Adding content is disabled on Android and iOS';
			}
		}
	};

	p.shapeOut=function(event){
		this.overText.text='';
		this.overTextSmall.visible=false;
		this.overTextSmall.text='';
		this.overText.visible=true;
		this.contentTitle.visible=true;
		this.contentTitleSmall.visible=false;
	};

	p.init=function($tar){
		opdGame.serverMetrics.saveProgress(1);
		console.log('sent metrics 1','init contentView');
		this.contentTitle.text='Select Content';
		this.contentTitle.textAlign='center';
		if(oG.model.orientation===0){
			this.contentTitle.x=400;
		}else{
			this.contentTitle.x=275;
		}
		this.myShapesHolder.addEventListener('click',this.contentItemClickedFun);
		if(!oG.model.touchMode){
			this.myShapesHolder.addEventListener('mouseover',this.shapeOverFun);
			this.myShapesHolder.addEventListener('mouseout',this.shapeOutFun);
		}

		opdLib.fadeIn(this.paneContainer,300,200);
		opdLib.fadeIn(this.contentPaneIms,300,600);
		opdLib.fadeIn(this.contentTitle,300,600);

		if(oG.model.usingPresetFlag){
			oG.model.presetWaitingFlag=false;
			//careful
			var stat=oG.contentController.presetLoadingSwtich();
			if(stat===false){
				this.displayLoading();
			}else{
				this.visible=false;
			}
		}
	};

	p.deit=function(){
		createjs.Ticker.removeEventListener('tick',this.tockerFun);
		this.myShapesHolder.removeEventListener('click',this.contentItemClickedFun);
		if(!oG.model.touchMode){
			this.myShapesHolder.removeEventListener('mouseover',this.shapeOverFun);
			this.myShapesHolder.removeEventListener('mouseout',this.shapeOutFun);
		}
		
		createjs.Tween.removeTweens(this.paneContainer);
		createjs.Tween.removeTweens(this.contentPaneIms);
		createjs.Tween.removeTweens(this.contentTitle);
	};

	oG.Views.ContentViewMain=createjs.promote(ContentViewMain,'Container');
}(opdGame));

(function(oG){
	function ContentPaneImages(){
		this.Container_constructor();
		this.setup();
	}
	var p=createjs.extend(ContentPaneImages,createjs.Container);

	p.setup=function(){
		this.contentBits=[];
		for(var i=0;i<10;i++){
			this.contentBits[i]=new createjs.Sprite(oG.model.mainSpriteSheet);
			this.contentBits[i].gotoAndStop('contentBit'+i);
			this.addChild(this.contentBits[i]);
		}
		this.removeChild(this.contentBits[2]);
		this.removeChild(this.contentBits[3]);
		this.removeChild(this.contentBits[4]);

		if(!oG.model.userContentOn)this.removeChild(this.contentBits[5]);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		var yArr=[];
		var xArr=[];
		if(oG.model.orientation===0){
			xArr=[486,578,625,441,533,578,165,118,212,118];
			yArr=[420,240,330,330,330,420,150,240,330,420];
			if(!oG.model.userContentOn){
				xArr[0]+=46;
				xArr[9]+=46;
			}
			this.contentBits[5].visible=true;
		}else{
			xArr=[272,180,364,180,272,0,41,41,88,88];
			yArr=[530,530,530,530,530,0,260,440,350,620];
			this.contentBits[5].visible=false;
		}
		for(var i=0;i<this.contentBits.length;i++){
			opdLib.posItem(this.contentBits[i],xArr[i],yArr[i]);
		}
	};

	p.init=function(){
	};

	p.deit=function(){
	};

	oG.Modules.ContentPaneImages=createjs.promote(ContentPaneImages,'Container');
}(opdGame));


(function(oG){//checked
	function ContentViewUser(){
		this.Container_constructor();
		this.updateNumbersFun=this.updateNumbers.bind(this);
		this.editTextFun=this.editText.bind(this);
		this.keyPressFun=this.keyPress.bind(this);
		this.outClickFun=this.outClick.bind(this);
		this.myCan=document.getElementById('myCanvas');
		this.setup();
	}
	var p=createjs.extend(ContentViewUser,createjs.Container);

	p.setup=function(){
		this.active=false;
		this.items=new oG.Views.ContentViewUserItems();
		this.menu=new oG.Views.ContentViewUserMenu();
		this.addChild(this.menu);
		this.addChild(this.items);

		this.uDiv=document.createElement('input');
		this.uDiv.id='inputContent';
		this.setInputStyle(this.uDiv);
		document.getElementById('containerDiv').appendChild(this.uDiv);
		this.uObj=new createjs.DOMElement('inputContent');
		this.uCont=new createjs.Container();
		this.uCont.addChild(this.uObj);
		this.addChild(this.uCont);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			this.items.visible=true;
		}else{
			this.items.visible=false;
			//$(document).off("keyup",this.keyPressFun);
			document.removeEventListener('keyup',this.keyPressFun);
			this.uDiv.blur();
			this.myCan.removeEventListener('mousedown',this.outClickFun);
			this.uDiv.style.display='none';
		}
		this.menu.setupDisplay();
	};

	p.updateNumbers=function(){
		var num=this.items.dispBits.length;
		this.menu.infoText_1.text='total items : '+num;
		if(num>=oG.model.contentMin){
			this.menu.infoText_2.text='max : '+oG.model.contentMax;
			this.menu.enableDoneButs();
		}else{
			this.menu.infoText_2.text='min : '+oG.model.contentMin;
			this.menu.disableDoneButs();
		}
	};

	p.editText=function(){
		this.updateTextArray();
		this.inInd=this.items.inInd;
		this.positionUserInput();
		this.uDiv.style.display='block';
		this.uObj.htmlElement.value=this.items.dispBits[this.inInd].imText;
		this.uDiv.focus();

		this.myCan.addEventListener('mousedown',this.outClickFun);
		//$(document).on("keyup",this.keyPressFun);
		document.addEventListener('keyup',this.keyPressFun);
	};

	p.updateTextArray=function(){
		if(this.inInd!=-1){
			this.items.dispBits[this.inInd].imText=this.uObj.htmlElement.value;
			this.items.dispBits[this.inInd].setText();
		}
		this.inInd=-1;
	};

	p.keyPress=function(e){
		if(oG.model.lettersOnly)this.removeNonLetters();
		this.limInput();
		if(e.which==13){
			this.outClick(null);
		}
	};

	p.limInput=function(){
		var toxt=this.uObj.htmlElement.value;
		if(toxt.length>16)toxt=toxt.slice(0,16);
		this.uObj.htmlElement.value=toxt;
	};

	p.removeNonLetters=function(){
		var toxt=this.uObj.htmlElement.value;
		toxt=toxt.replace(/[^a-z ]/, '');
		this.uObj.htmlElement.value=toxt;
	};

	p.outClick=function(e){
		//$(document).off("keyup",this.keyPressFun);
		document.removeEventListener('keyup',this.keyPressFun);
		this.updateTextArray();
		this.uDiv.blur();
		this.myCan.removeEventListener('mousedown',this.outClickFun);
		this.uDiv.style.display='none';
	};

	p.positionUserInput=function(){
		var rat=oG.model.canvasRatio;
		var xTar=this.items.xTar;
		var yTar=this.items.yTar;
		var wid=Math.round(80*rat);
		var hei=Math.round(20*rat);
		var xOff=Math.round(this.myCan.offsetLeft-0/2);
		var yOff=Math.round(this.myCan.offsetTop-0/2);
		var newFontSize=Math.round(20*rat);
		newFontSize=Math.floor(newFontSize);

		this.uCont.x=Math.floor(xOff+(xTar*rat));
		this.uCont.y=Math.floor(yOff+(yTar*rat));

		this.uDiv.style.fontSize=newFontSize+'px';
		this.uDiv.style.height=hei+'px';
		this.uDiv.style.width=wid+'px';
	};

	p.resizeInputBit=function(){
		if(this.inInd!=-1)this.positionUserInput();
	};

	p.setInputStyle=function(div){		
		div.setAttribute('type','text');
		div.setAttribute('maxlength',16);
		div.style.position='absolute';
		div.style.left=0;
		div.style.top=0;
		div.style.display='none';
		div.style.textAlign='center';
		div.style.fontFamily='Arial';
		div.style.textDecoration='none';
		div.style.border='none';
		div.style.margin='0px';
		div.style.padding='0px';
		div.style.backgroundColor='#eee';
	};

	p.init=function(){
		this.active=true;
		this.inInd=-1;
		this.uDiv.style.display='none';
		this.items.init();
		this.items.addEventListener('editText',this.editTextFun);
		this.items.addEventListener('updateNumbers',this.updateNumbersFun);
		this.menu.init();
		this.updateNumbers();
	};

	p.deit=function(){
		this.inInd=-1;
		this.uDiv.style.display='none';
		//$(document).off("keyup",this.keyPressFun);//probably not needed
		document.removeEventListener('keyup',this.keyPressFun);
		this.items.deit();
		this.menu.deit();
		this.myCan.removeEventListener('mousedown',this.outClickFun);
		this.items.removeEventListener('editText',this.editTextFun);
		this.items.removeEventListener('updateNumbers',this.updateNumbersFun);
	};

	oG.Views.ContentViewUser=createjs.promote(ContentViewUser,'Container');
}(opdGame));

(function(oG){//checked
	function ContentViewUserItems(){
		this.Container_constructor();
		this.editTextFun=this.editText.bind(this);
		this.imLoadedFun=this.imLoaded.bind(this);
		this.soLoadedFun=this.soLoaded.bind(this);
		this.clearImageFun=this.clearImage.bind(this);
		this.audioTextPressFun=this.audioTextPress.bind(this);
		this.audioTextDownFun=this.audioTextDown.bind(this);
		this.audioTextClickFun=this.audioTextClick.bind(this);
		this.setup();
	}
	var p=createjs.extend(ContentViewUserItems,createjs.Container);

	var xArr=[45,135,225,315,405,495,585,675,
		45,135,225,315,405,495,585,675,
		45,135,225,315,405,495,585,675];

	var yArr=[40,40,40,40,40,40,40,40,
		165,165,165,165,165,165,165,165,
		290,290,290,290,290,290,290,290];

	p.setup=function(){
		this.playSoundBool=false;
		this.curSoundPlayingInd=-1;

		this.delArea=new createjs.Container();
		var delAreaBack=new createjs.Shape();
		delAreaBack.graphics.beginFill('#ddd').drawRoundRect(0,0,760,120,24);
		delAreaBack.alpha=0.6;
		this.delArea.addChild(delAreaBack);
		var delAreaText=new createjs.Text('Drag here to remove','bold 32px Arial','#555');
		opdLib.centerText(delAreaText);
		opdLib.dispItem(delAreaText,this.delArea,380,70);
		opdLib.dispItem(this.delArea,this,20,410);

		this.dispBits=[];
		this.audBits=[];
		this.backBits=[];
		this.curIms=[];
		this.curSnds=[];

		for(var i=0;i<24;i++){
			this.backBits[i]=new createjs.Shape();
			this.backBits[i].graphics.beginStroke('#ccc').beginFill('#fff').drawRoundRect(0,0,80,100,16);
			opdLib.dispItem(this.backBits[i],this,xArr[i],yArr[i]);
			this.backBits[i].visible=false;
			this.backBits[i].alpha=0.901;
		}
	};

//////////adding files is main entry function here
	p.addFiles=function(gFiles){
		for(var i=0;i<gFiles.length;i++){
			if(gFiles[i].type.match('image.*')){
				this.loadFileImage(gFiles[i]);
			}
			if(gFiles[i].type.match('audio.*')){
				this.loadFileSound(gFiles[i]);
			}
		}
		this.noAudioCheck();
		this.arrangeAudioPanes();
		this.dispatchEvent('updateNumbers');
	};

///////////////adding images stuff
	p.loadFileImage=function(iFile){
		var objectUrl=URL.createObjectURL(iFile);
		var iInd=this.curIms.length;
		if(iInd<oG.model.contentMax){
			this.curIms[iInd]=new createjs.Bitmap(objectUrl);
			this.curIms[iInd].image.ind=iInd;
			this.curIms[iInd].image.addEventListener('load',this.imLoadedFun);
			this.dispBits[iInd]=new oG.Modules.UserContentBit(iInd,this.curIms[iInd],iFile.name);
			opdLib.dispItem(this.dispBits[iInd],this,xArr[iInd],yArr[iInd]);
			this.dispBits[iInd].textPane.addEventListener('click',this.editTextFun);
			this.dispBits[iInd].clearBut.addEventListener('click',this.clearImageFun);
			this.backBits[iInd].visible=true;
		}else{
			//lim reached
		}
	};
	
	p.imLoaded=function(e){
		URL.revokeObjectURL(e.target.src);
		this.curIms[e.target.ind].image.removeEventListener('load',this.imLoadedFun);
		opdLib.scaleImage(this.curIms[e.target.ind],80);
	};

/////////adding sounds stuff
	p.loadFileSound=function(sFile){
		var iInd=0;
		while(iInd<this.audBits.length&&this.audBits[iInd].hasSound){iInd++;}
		if(iInd<oG.model.contentMax){
			var objectUrl=URL.createObjectURL(sFile);
			if(iInd<this.curSnds.length){this.removeAudioTextPane(iInd);}
			this.curSnds[iInd]=new Audio(objectUrl);
			this.curSnds[iInd].ind=iInd;
			this.curSnds[iInd].addEventListener('canplaythrough',this.soLoadedFun);
			this.newAudioTextPane(sFile.name,iInd,true);
			this.backBits[iInd].visible=true;
		}else{
			//lim reached
		}
	};

	p.soLoaded=function(e){
		URL.revokeObjectURL(e.target.src);
		this.curSnds[e.target.ind].removeEventListener('canplaythrough',this.soLoadedFun);
	};

/////////audio pane stuff
	p.newAudioTextPane=function(gText,gInd,gHas){
		if(gText.length>10)gText=gText.slice(0,11);
		this.audBits[gInd]=new oG.Modules.UserAudioTextPane(gText,gInd,gHas);
		this.addChild(this.audBits[gInd]);
		this.audBits[gInd].addEventListener('click',this.audioTextClickFun);
		this.audBits[gInd].addEventListener('pressmove',this.audioTextPressFun);
		this.audBits[gInd].addEventListener('mousedown',this.audioTextDownFun);
	};

	p.removeAudioTextPane=function(gInd){
		this.removeChild(this.audBits[gInd]);
		this.audBits[gInd].deSetup();
		this.audBits[gInd].removeEventListener('click',this.audioTextClickFun);
		this.audBits[gInd].removeEventListener('pressmove',this.audioTextPressFun);
		this.audBits[gInd].removeEventListener('mousedown',this.audioTextDownFun);
		this.audBits[gInd]=null;
	};

	p.makeAudioBlank=function(gInd){
		if(gInd>=this.dispBits.length){
			this.clearAudio(gInd);
		}else{
			if(this.curSnds[gInd]!==null){
				this.curSnds[gInd].removeEventListener('canplaythrough',this.soLoadedFun);
			}
			this.curSnds[gInd]=null;
			this.removeAudioTextPane(gInd);
			this.newAudioTextPane('no audio',gInd,false);
			this.arrangeAudioPanes();
		}
	};

	p.blankItemCheck=function(){
		for(var i=0;i<this.curSnds.length;i++){
			var len=this.dispBits.length;
			if(this.curSnds[i]===null&&i>=len){
				this.clearAudio(i);
			}
		}
		this.removeBackBitCheck();
	};

	p.getSoundsLength=function(){
		var len=0;
		for(var i=0;i<this.curSnds.length;i++){
			if(this.curSnds[i]!==null){
				len++;
			}
		}
		return len;
	};

	p.removeBackBitCheck=function(){
		var iLim=this.dispBits.length;
		var sLim=this.audBits.length;
		if(iLim>sLim)sLim=iLim;
		for(var i=sLim;i<this.backBits.length;i++){
			this.backBits[sLim].visible=false;
		}
	};

	p.noAudioCheck=function(){
		var iLim=this.dispBits.length;
		var sLim=this.audBits.length;
		for(var i=sLim;i<iLim;i++){
			this.newAudioTextPane('no audio',i,false);
			this.curSnds[i]=null;
		}
		this.arrangeAudioPanes();
	};

	p.arrangeAudioPanes=function(){
		for(var i=0;i<this.audBits.length;i++){
			var ind=this.audBits[i].ind;
			this.audBits[i].x=xArr[ind]-5;
			this.audBits[i].y=yArr[ind]+86;
		}
	};

///////////moving audio panes stuff
	p.audioTextPress=function(e){
		this.playSoundBool=false;
		var i=0;
		for(i=0;i<this.audBits.length;i++){
			this.audBits[i].ind=i;
		}
		var cTarInd=e.currentTarget.ind;
		for(i=0;i<this.backBits.length;i++){
			if(this.backBits[i].visible===true){
				var myPnt=this.backBits[i].globalToLocal(e.stageX,e.stageY);
				if(this.backBits[i].hitTest(myPnt.x,myPnt.y)){
					if(i!=cTarInd){
						this.audBits[i].ind=cTarInd;
						e.currentTarget.ind=i;
					}
				}	
			}
		}
		this.arrangeAudioPanes();

		e.currentTarget.x=e.stageX-40;
		e.currentTarget.y=e.stageY-10;
	};

	p.audioTextDown=function(e){
		this.stopAudio();
		this.playSoundBool=true;
		this.removeChild(e.currentTarget);
		this.addChild(e.currentTarget);
		this.delArea.visible=true;
	};

	p.audioTextClick=function(e){
		if(this.playSoundBool){
			var cSnd=this.curSnds[e.currentTarget.ind];
			this.curSoundPlayingInd=e.currentTarget.ind;
			if(cSnd!==null)cSnd.play();
		}
		this.rearrangeAudio();
		this.arrangeAudioPanes();

		var myPnt=this.delArea.globalToLocal(e.stageX,e.stageY);
		if(this.delArea.hitTest(myPnt.x,myPnt.y)){
			this.makeAudioBlank(e.currentTarget.ind);
		}
		this.delArea.visible=false;
		this.blankItemCheck();
	};

	p.rearrangeAudio=function(){
		for(var i=0;i<this.audBits.length;i++){
			var ind=this.audBits[i].ind;
			if(i!=ind){
				var tmp=this.audBits[i];
				this.audBits[i]=this.audBits[ind];
				this.audBits[ind]=tmp;
				var tmp2=this.curSnds[i];
				this.curSnds[i]=this.curSnds[ind];
				this.curSnds[ind]=tmp2;
			}
		}
	};

	p.stopAudio=function(){
		if(this.curSoundPlayingInd!=-1){
			var cSnd=this.curSnds[this.curSoundPlayingInd];
			if(cSnd!==null){
				cSnd.pause();
				cSnd.currentTime=0;
			}
		}
	};

////////////edit text stuff
	p.editText=function(e){
		this.inInd=e.currentTarget.ind;
		this.xTar=xArr[this.inInd]+0;
		this.yTar=yArr[this.inInd]+62;
		this.dispatchEvent('editText');
	};

////////////clearing stuff
	p.clearAll=function(){
		this.stopAudio();
		var lim=this.dispBits.length-1;
		for(var i=lim;i>=0;i--){
			this.clearImageSpecific(i);
			this.backBits[i].visible=false;
		}
		for(i=0;i<this.curSnds.length;i++){
			if(this.curSnds[i]!==null){
				this.curSnds[i].removeEventListener('canplaythrough',this.soLoadedFun);
			}
			this.curSnds[i]=null;
			this.removeAudioTextPane(i);
			this.backBits[i].visible=false;
		}

		this.curSnds=[];
		this.audBits=[];
		this.curIms=[];
		this.dispBits=[];

		this.removeBackBitCheck();
		this.dispatchEvent('updateNumbers');
	};

	p.clearImage=function(e){
		var gInd=e.target.ind;
		for(var i=gInd;i<this.dispBits.length-1;i++){
			nIm=this.curIms[i+1];
			var txt=this.dispBits[i+1].imText;
			this.dispBits[i].changeBit(nIm,txt);
			this.curIms[i]=this.curIms[i+1];
		}
		var lInd=this.dispBits.length-1;
		this.clearImageSpecific(lInd);
		this.clearAudio(gInd);
		this.backBits[this.curSnds.length].visible=false;
		this.dispatchEvent('updateNumbers');
	};

	p.clearImageSpecific=function(gInd){
		this.dispBits[gInd].textPane.removeEventListener('click',this.editTextFun);
		this.dispBits[gInd].clearBut.removeEventListener('click',this.clearImageFun);
		this.dispBits[gInd].removeIm();
		this.removeChild(this.dispBits[gInd]);
		this.dispBits[gInd]=null;
		this.curIms[gInd].image.removeEventListener('load',this.imLoadedFun);
		this.curIms[gInd]=null;
		this.dispBits.pop();
		this.curIms.pop();
	};

	p.clearAudio=function(gInd){
		for(i=gInd;i<this.curSnds.length-1;i++){
			var tmp=this.audBits[i];
			this.audBits[i]=this.audBits[i+1];
			this.audBits[i+1]=tmp;
			this.audBits[i].ind=i;
			var tmp2=this.curSnds[i];
			this.curSnds[i]=this.curSnds[i+1];
			this.curSnds[i+1]=tmp2;
		}
		var sLen=this.curSnds.length-1;
		this.removeAudioTextPane(sLen);
		if(this.curSnds[sLen]!==null){
			this.curSnds[sLen].removeEventListener('canplaythrough',this.soLoadedFun);
		}
		this.curSnds[sLen]=null;
		this.audBits.pop();
		this.curSnds.pop();
		this.arrangeAudioPanes();
		this.noAudioCheck();
		this.removeBackBitCheck();
		this.dispatchEvent('updateNumbers');
	};

	p.setContent=function(){
		this.stopAudio();
		var tArr=[];
		for(var i=0;i<this.dispBits.length;i++){
			tArr[i]=this.dispBits[i].imText;
			if(tArr[i]==='')tArr[i]='none';
		}
		oG.model.userImageArray=this.curIms;
		oG.model.userAudioArray=this.curSnds;
		oG.model.textArray=tArr;
		oG.model.contentLim=this.dispBits.length;
	};
	
	p.init=function(){
		this.delArea.visible=false;
		for(var i=0;i<this.dispBits.length;i++){
			this.dispBits[i].textPane.addEventListener('click',this.editTextFun);
			this.dispBits[i].textPane.cursor='pointer';
			this.dispBits[i].clearBut.addEventListener('click',this.clearImageFun);
			this.dispBits[i].clearBut.cursor='pointer';
			this.dispBits[i].resetImPos();
		}
		
		for(i=0;i<this.audBits.length;i++){
			this.audBits[i].addEventListener('click',this.audioTextClickFun);
			this.audBits[i].addEventListener('pressmove',this.audioTextPressFun);
			this.audBits[i].addEventListener('mousedown',this.audioTextDownFun);
		}
	};

	p.deit=function(){
		this.stopAudio();
		for(var i=0;i<this.dispBits.length;i++){
			this.dispBits[i].textPane.removeEventListener('click',this.editTextFun);
			this.dispBits[i].textPane.cursor='default';
			this.dispBits[i].clearBut.removeEventListener('click',this.clearImageFun);
			this.dispBits[i].clearBut.cursor='default';
		}
		
		for(i=0;i<this.audBits.length;i++){
			this.audBits[i].removeEventListener('click',this.audioTextClickFun);
			this.audBits[i].removeEventListener('pressmove',this.audioTextPressFun);
			this.audBits[i].removeEventListener('mousedown',this.audioTextDownFun);
		}
	};

	oG.Views.ContentViewUserItems=createjs.promote(ContentViewUserItems,'Container');
}(opdGame));


(function(oG){//checked
	function ContentViewUserMenu(){
		this.Container_constructor();
		this.setup();
	}
	var p=createjs.extend(ContentViewUserMenu,createjs.Container);

	p.setup=function(){
		this.tmpBorder=new createjs.Shape();
		this.tmpBorder.graphics.beginStroke('#ccc').beginFill('#ABC7E1').drawRoundRect(10,10,780,530,32);
		this.addChild(this.tmpBorder);
		this.tmpInner=new createjs.Shape();
		this.tmpInner.graphics.beginStroke('#ccc').beginFill('#F1F1F1').drawRoundRect(20,20,760,510,24);
		this.addChild(this.tmpInner);

		this.infoPane=new createjs.Shape();
		this.infoPane.graphics.beginFill('#ddd').drawRoundRect(150,425,500,35,8);
		this.addChild(this.infoPane);
		this.infoText_1=new createjs.Text('total items : 12','bold 20px Arial','#666');
		opdLib.centerText(this.infoText_1);
		opdLib.dispItem(this.infoText_1,this,320,450);
		this.infoText_2=new createjs.Text('min : 5','bold 20px Arial','#666');
		opdLib.centerText(this.infoText_2);
		opdLib.dispItem(this.infoText_2,this,480,450);

		this.closeBut=new oG.Modules.ContentButton('back');
		this.addBut=new oG.Modules.ContentButton('add');
		this.beginBut=new oG.Modules.ContentButton('start');
		this.clearBut=new oG.Modules.ContentButton('clear');

		opdLib.dispItem(this.addBut,this,340,475);
		opdLib.dispItem(this.beginBut,this,640,475);
		opdLib.dispItem(this.clearBut,this,215,475);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			opdLib.dispItem(this.closeBut,this,40,475);
			this.tmpBorder.visible=true;
			this.tmpInner.visible=true;
			this.infoPane.visible=true;
			this.infoText_1.visible=true;
			this.infoText_2.visible=true;
			this.addBut.visible=true;
			this.beginBut.visible=true;
			this.clearBut.visible=true;
		}else{
			opdLib.dispItem(this.closeBut,this,220,380);
			this.tmpBorder.visible=false;
			this.tmpInner.visible=false;
			this.infoPane.visible=false;
			this.infoText_1.visible=false;
			this.infoText_2.visible=false;
			this.addBut.visible=false;
			this.beginBut.visible=false;
			this.clearBut.visible=false;
		}
	};


	p.enableDoneButs=function(){
		this.beginBut.addEventListener('click',oG.contentController.beginClick);
		this.beginBut.init();
		this.beginBut.alpha=1;
	};

	p.disableDoneButs=function(){
		this.beginBut.removeEventListener('click',oG.contentController.beginClick);
		this.beginBut.deit();
		this.beginBut.alpha=0.3;
	};

	p.init=function(){
		this.addBut.addEventListener('click',oG.contentController.openFileDialog);
		this.addBut.init();
		this.clearBut.addEventListener('click',oG.contentController.clearClick);
		this.clearBut.init();
		this.closeBut.init();
	};

	p.deit=function(){
		this.addBut.removeEventListener('click',oG.contentController.openFileDialog);
		this.addBut.deit();
		this.clearBut.removeEventListener('click',oG.contentController.clearClick);
		this.clearBut.deit();
		this.closeBut.deit();
	};

	oG.Views.ContentViewUserMenu=createjs.promote(ContentViewUserMenu,'Container');
}(opdGame));



(function(oG){//checked
	var contentLoader;
	function initLoc(){
		oG.model.preloadComplete=false;
		oG.contentController.init();
		if(window.location.host===oG.model.siteUrl){
			oG.view.init();
		}else{
			if(oG.model.siteLock===false){
				//oG.model.offSite=true;
				oG.view.init();
			}
		}
	}

	function preloadCompleteLoc(){
		oG.model.preloadComplete=true;
		oG.view.preloadComplete();
		oG.view.changeView('title');
		//oG.view.changeView('end');
	}

	function setContentLoadedTargetLoc($tar){
		oG.model.loadTarget=$tar;
	}

	function loadCompleteLoc(){
		var gLim=oG.model.contentLim*3;
		if(gLim>40)gLim-=10;
		if(gLim>80)gLim=80;
		oG.model.gameLim=gLim;
		oG.view.changeView(oG.model.loadTarget);
	}

	function gameFinishedLoc(){
	}

	function audContentLoadedLoc(){
		oG.view.gameView.checkAudioLoaded();
		oG.view.reviewView.checkAudioLoaded();
	}

	var out={
		init:initLoc,
		preloadComplete:preloadCompleteLoc,
		setContentLoadedTarget:setContentLoadedTargetLoc,
		loadComplete:loadCompleteLoc,
		gameFinished:gameFinishedLoc,
		audContentLoaded:audContentLoadedLoc
	};

	oG.controller=out;

}(opdGame));


(function(oG){//checked

	function CountdownBar(){
		this.Container_constructor();
		this.countdownFun=this.countdown.bind(this);
		this.setup();
	}
	var p=createjs.extend(CountdownBar,createjs.Container);

	p.setup=function(){
		this.countdownVar=0;
		this.isPlayerFast=false;
		this.countdownAddVar=0;

		this.hintCount=0;

		this.lSpeedVar=0;
		this.lSpeedVarAlt=0;

		var countdownBack=new createjs.Sprite(oG.model.mainSpriteSheet);
		countdownBack.gotoAndStop('countdownBackId');
		var countdownFront=new createjs.Sprite(oG.model.mainSpriteSheet);
		countdownFront.gotoAndStop('countdownFrontId');
		this.upText=new createjs.Text('+200','bold 24px Reem Kufi','#FAE32F');
		this.countdownGold=new createjs.Shape();
		this.myMask=new createjs.Shape();

		this.countdownGold.graphics.beginFill('#F5EC79').drawRoundRect(0,0,498,26,4);
		this.countdownGold.cache(0,0,500,26);
		this.countdownGold.alpha=0;
		opdLib.centerText(this.upText);
		this.upText.visible=false;
		this.upText.cache(-40,0,80,40);
		this.myMask.graphics.beginFill('#ccc').drawRect(0,-10,550,40);

		opdLib.dispItem(this.upText,this,490,0);

		opdLib.dispItem(countdownBack,this,0,0);
		opdLib.dispItem(countdownFront,this,4,4);
		opdLib.dispItem(this.countdownGold,this,4,4);

		countdownFront.mask=this.myMask;

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			this.scaleX=1;
		}else{
			this.scaleX=0.8;
		}
	};

	p.countdown=function(event){
		this.hintCount++;
		if(this.hintCount>=100){
			this.hintCount=60;
			oG.view.gameView.imagePane.timeRemoveItem();
		}
		if(this.countdownAddVar>0){
			this.countdownAddVar-=50;
			this.countdownVar+=50;
			if(this.countdownVar>=5000){
				//oG.view.musicPlayer.playDing();
				this.countdownVar=5100;
				this.countdownAddVar=0;
				if(oG.model.gameSpeed.val>1){
					oG.view.gameView.scoreBox.addScore(200);
					this.showUpText();
				}
			}
		}
		var adjVar=Math.round(event.delta)*25;
		var adjVar2=Math.floor(this.lSpeedVarAlt*adjVar)/1000;	
		this.countdownVar-=adjVar2;
		if(this.countdownVar<=0){
			this.countdownVar=0;
			createjs.Ticker.removeEventListener("tick", this.countdownFun);
			oG.view.gameView.timeout();
		}
		var bWidth=Math.round(this.countdownVar/10);
		if(bWidth>4){
			this.myMask.x=-550+bWidth; 
		}
	};

	p.showUpText=function(){
		this.countdownGold.alpha=1;
		this.upText.visible=true;
		this.upText.alpha=1;
		var yTar=-36;
		this.upText.y=yTar;
		createjs.Tween.get(this.countdownGold,{loop:false}).wait(1000).to({alpha:0},500);
		if(createjs.Tween.hasActiveTweens(this.upText)){
			createjs.Tween.removeTweens(this.upText);
		}
		createjs.Tween.get(this.upText,{loop:false}).wait(150).to({alpha:0,y:yTar-30},800);
	};

	p.init=function(){
		this.lSpeedVar=7;
		this.updateSpeed();
		this.countdownVar=5000;
		this.isPlayerFast=false;
		this.countdownAddVar=0;
		if(oG.model.gameMode=='fast'){
			this.visible=true;
			createjs.Ticker.addEventListener("tick", this.countdownFun);
		}else{
			this.visible=false;
		}
		this.myMask.x=-50;
	};

	p.resetHintVar=function(){
		this.hintCount=0;
	};

	p.deit=function(){
		createjs.Ticker.removeEventListener("tick", this.countdownFun);
	};

	p.addTime=function($missVar){
		this.countdownAddVar+=1000;
		if(this.countdownVar>3000){
			this.isPlayerFast=true;
			this.lSpeedVar++;
		}else{
			if(oG.view.gameView.roundCountVar>25)this.lSpeedVar++;
			this.isPlayerFast=false;
		}
		if(oG.model.gameSpeed.val<2)this.countdownAddVar+=1000-(500*oG.model.gameSpeed.val);
		//if($missVar)this.countdownAddVar+=500;
		if(this.countdownVar<2000&&this.lSpeedVar<14)this.countdownAddVar+=1000;
		if(this.countdownVar<1500&&this.lSpeedVar<10)this.countdownAddVar+=500;
		this.updateSpeed();
		if(createjs.Tween.hasActiveTweens(this.countdownGold)==1){
			createjs.Tween.removeTweens(this.countdownGold);
			this.countdownGold.alpha=0;
		}
	};

	p.updateSpeed=function(){
		var sVar=Math.floor(this.lSpeedVar*((oG.model.gameSpeed.val+1)/3));
		if(sVar>10)sVar=Math.floor(10+(sVar-10)/2);
		var limVar=22+Math.floor(((oG.model.gameSpeed.val+1)/3)*13);
		if(sVar>limVar)sVar=limVar;
		this.lSpeedVarAlt=sVar;
	};

	p.pause=function(){
		if(this.visible==true){createjs.Ticker.removeEventListener("tick", this.countdownFun);}
	};

	p.unpause=function(){
		this.updateSpeed();
		if(this.visible==true&&this.countdownVar!=0){createjs.Ticker.addEventListener("tick", this.countdownFun);}
	};

	oG.Modules.CountdownBar=createjs.promote(CountdownBar,'Container');
}(opdGame));


(function(oG){//checked
	function EndView(){
		this.Container_constructor();
		this.gotScores=this.gotScoresFun.bind(this);
		this.sendNewHighScoreFun=this.sendNewHighScore.bind(this);
		this.setup();
	}
	var p=createjs.extend(EndView,createjs.Container);
	
	p.setup=function(){
		this.showInput=false;
		this.scoresSent=false;

		this.exitBut=new oG.Modules.Button('textBack','title',90);
		this.againBut=new oG.Modules.Button('textAgain','game',90);

		this.myScoresTable=new oG.Modules.HighScoresTable();
		this.myScoresTable.titleFont='bold 26px Reem Kufi';
		this.myScoresTable.titleFontColor='#111';
		this.myScoresTable.titlesFont='bold 30px Reem Kufi';
		this.myScoresTable.titlesFontColor='#333';
		this.myScoresTable.fieldsFont='bold 22px Reem Kufi';
		this.myScoresTable.fieldsFontColor='#444';
		this.myScoresTable.backPaneColor='#fff';
		this.myScoresTable.backPaneBorderColor='#444';
		this.myScoresTable.backPaneBorderWidth=0;
		this.myScoresTable.tableType='score';
		this.myScoresTable.backPaneAlpha=0.8;
		this.myScoresTable.initialSetup();

		this.scorePane=new oG.Modules.ScorePane();
		this.scorePane.fontOne='bold 16px Reem Kufi';
		this.scorePane.fontOneColor='#333';
		this.scorePane.fontTwo='bold 18px Reem Kufi';
		this.scorePane.fontTwoColor='#444';
		this.scorePane.paneLength='short';
		this.scorePane.scoreLabelText1='Score';
		this.scorePane.paneBorderColor='#ff8';
		this.scorePane.initialSetup();

		this.scorePane.setCallback(this.sendNewHighScoreFun);
		oG.scoresModel.setCallback(this.gotScores);
		this.addChild(this.myScoresTable,this.scorePane);
		this.addChild(this.exitBut,this.againBut);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			this.exitBut.scaleX=this.exitBut.scaleY=1.3;
			this.againBut.scaleX=this.againBut.scaleY=1.3;
			this.myScoresTable.y=30;
			opdLib.posItem(this.exitBut,325,510);
			opdLib.posItem(this.againBut,475,510);
		}else{
			this.exitBut.scaleX=this.exitBut.scaleY=1.3;
			this.againBut.scaleX=this.againBut.scaleY=1.3;
			opdLib.posItem(this.exitBut,200,750);
			opdLib.posItem(this.againBut,350,750);
			this.myScoresTable.y=20;
		}
	};

	p.orientationChange=function(){
		this.setupDisplay();
		this.myScoresTable.setupDisplay();
		this.scorePane.setupDisplay();
	};

	p.sendNewHighScore=function(nom,local){
		this.scoresSent=true;
		this.showInput=false;
		oG.scoresModel.getScores(1,nom,local);
		this.scorePane.setInputVisibility(false);
	};

	p.gotScoresFun=function(jsonArr){
		var len=jsonArr.scores.length;
		this.showInput=true;
		if(len>25){
			var minScore=jsonArr.scores[len-1].Score;
			if(oG.model.gameScore>=minScore){
				this.showInput=true;
			}else{
				this.showInput=false;
			}
		}
		if(this.scoresSent)this.showInput=false;
		if(this.showInput){
			this.scorePane.setInputVisibility(true);
		}
		this.myScoresTable.showScores(jsonArr);
	};

	p.init=function(){
		this.showInput=false;
		this.scoresSent=false;

		opdLib.fadeIn(this,500,200);
		opdLib.fadeIn(this.exitBut,500,700);
		opdLib.fadeIn(this.againBut,500,700);
		opdLib.fadeIn(this.scorePane,500,1600);

		this.scorePane.init();
		this.scorePane.scoreDisp1.text=oG.model.gameScore;
		this.scorePane.setInputVisibility(false);
		
		opdWrapper.lock();

		this.exitBut.addLists();
		this.againBut.addLists();
		this.myScoresTable.init();

		oG.scoresModel.getScores(0,'','');
	};

	p.deit=function(){
		opdWrapper.unlock();
		this.againBut.removeLists();
		this.exitBut.removeLists();
		this.myScoresTable.deit();
		this.scorePane.deit();
	};

	oG.Views.EndView=createjs.promote(EndView,'Container');
}(opdGame));


(function(oG){//checked
	function GameView(){
		this.Container_constructor();
		this.settingsClickFun=this.settingsClick.bind(this);
		this.audioClickFun=this.audioClick.bind(this);
		this.exitClickFun=this.exitClick.bind(this);
		this.gameTimerFun=this.gameTimer.bind(this);
		this.routineFun=this.routine.bind(this);
		this.endScreenFun=this.endScreen.bind(this);
		this.reAddAudioListFun=this.reAddAudioList.bind(this);
		this.setup();
	}
	var p=createjs.extend(GameView,createjs.Container);

	p.setup=function(){
		this.mtrs=oG.Modules.Metrics;
		this.settingsPane=new oG.Modules.SettingsPane();
		this.imagePane=new oG.Modules.ImagePane();
		this.scoreBox=new oG.Modules.ScoreBox();
		this.countdownBar=new oG.Modules.CountdownBar();
		this.textPane=new oG.Modules.TextPane('#000',36,150);

		this.overText=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.overText.gotoAndStop('gameOverTextId');
		this.winText=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.winText.gotoAndStop('youWinTextId');
		this.settingsBut=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.settingsBut.gotoAndStop('settingsButId');
		this.audioBut=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.audioBut.gotoAndStop('audButId');

		this.exitBut=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.exitBut.gotoAndStop('backBut');

		this.roundText=new createjs.Text('', 'bold 14px Reem Kufi', '#fff');
		this.timerText=new createjs.Text('', 'bold 14px Reem Kufi', '#fff');

		opdLib.centerText(this.roundText);
		opdLib.centerText(this.timerText);

		this.routineDelay=new opdLib.timer(this.routineFun);
		this.endDelay=new opdLib.timer(this.endScreenFun);

		this.curArray=[];
		this.missVar=false;
		this.roundCountVar=0;
		this.gamePaused=false;
		this.streak=0;
		this.gameTimerVar=0;
		this.settingsBut.cursor='pointer';
		this.audioBut.cursor='pointer';
		this.exitBut.cursor='pointer';
		this.settingsPane.visible=false;

		this.addChild(this.roundText,this.timerText,this.exitBut,this.imagePane,this.textPane,this.countdownBar);
		this.addChild(this.settingsBut,this.audioBut,this.overText,this.winText,this.scoreBox,this.exitBut,this.settingsPane);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			oG.model.roundLim=10;

			opdLib.posItem(this.roundText,40,130);
			opdLib.posItem(this.timerText,760,130);
			opdLib.posItem(this.exitBut,8,486);
			opdLib.posItem(this.imagePane,50,130);
			opdLib.posItem(this.textPane,185,25);
			opdLib.posItem(this.countdownBar,150,486);
			opdLib.posItem(this.settingsBut,730,5);
			opdLib.posItem(this.audioBut,670,5);
			opdLib.posItem(this.overText,310,255);
			opdLib.posItem(this.winText,260,240);
		}else{
			oG.model.roundLim=7;

			opdLib.posItem(this.roundText,40,190);
			opdLib.posItem(this.timerText,510,190);
			opdLib.posItem(this.imagePane,0,225);
			opdLib.posItem(this.textPane,60,65);
			opdLib.posItem(this.exitBut,8,736);
			opdLib.posItem(this.countdownBar,72,700);
			opdLib.posItem(this.settingsBut,480,5);
			opdLib.posItem(this.audioBut,420,5);
			opdLib.posItem(this.overText,185,380);
			opdLib.posItem(this.winText,135,365);
		}
	};

	p.orientationChange=function(){
		this.setupDisplay();
		this.countdownBar.setupDisplay();
		this.scoreBox.setupDisplay();
		this.imagePane.orientationChange();
		this.settingsPane.setupDisplay();
	};

	p.routine=function(){
		this.roundCountVar++;
		if(this.roundCountVar>oG.model.gameLim){
		//if(this.roundCountVar>1){
			oG.controller.gameFinished();
			this.gameWin();
		}else{
			this.missVar=false;
			this.curArray=this.mtrs.getItems();
			this.imagePane.routine(this.curArray);
			this.roundText.text=this.roundCountVar+'/'+oG.model.gameLim;
			this.stopAudio();
			if(oG.model.showAudio){this.playAudio();}
			this.textPane.setText(oG.model.textArray[this.curArray[0]]);
			this.countdownBar.resetHintVar();
		}
	};

	p.clickOutcome=function(gRes){
		if(gRes=='hit'){
			//oG.view.musicPlayer.playDing();
			this.streak++;
			this.scoreBox.showStreak(this.streak);
			if(oG.model.speedVar==0&&this.missVar==false&&oG.model.gameSpeed.val>1){
				this.routine();
			}else{
				var turnVar=Math.floor(1500*oG.model.speedVar);
				if(oG.model.gameSpeed.val<2)turnVar+=1000-(500*oG.model.gameSpeed.val);
				this.routineDelay.start(turnVar);
			}
			this.countdownBar.addTime(this.missVar);
			this.mtrs.setOutcome(this.missVar,this.countdownBar.isPlayerFast);
		}else{
			this.streak=0;
			this.missVar=true;
		}
	};

	p.timeout=function(){
		createjs.Ticker.removeEventListener('tick', this.gameTimerFun);
		this.countdownBar.deit();
		this.imagePane.timeout();
		this.endDelay.start(4000);
		this.fadeOutAll();
		this.overText.visible=true;
		opdLib.fadeIn(this.overText,1000,2000);
	};

	p.gameWin=function(){
		createjs.Ticker.removeEventListener('tick', this.gameTimerFun);
		this.countdownBar.deit();
		this.imagePane.timeout();
		this.endDelay.start(4000);
		this.fadeOutAll();
		this.winText.visible=true;
		opdLib.fadeIn(this.winText,1000,2000);
	};

	p.exitClick=function(){
		oG.view.changeView('title');
	};

	p.endScreen=function(){
		oG.model.gameScore=this.scoreBox.myScore;
		oG.model.gameTime=this.gameTimerVar;
		oG.view.changeView('end');
	};

	p.fadeOutAll=function(){
		opdLib.fadeOut(this.scoreBox,500,1000);
		opdLib.fadeOut(this.textPane,500,1000);
		opdLib.fadeOut(this.imagePane,500,1000);
		opdLib.fadeOut(this.audioBut,500,1000);
		opdLib.fadeOut(this.settingsBut,500,1000);
		opdLib.fadeOut(this.countdownBar,500,1000);
		opdLib.fadeOut(this.timerText,500,1000);
		opdLib.fadeOut(this.roundText,500,1000);
		opdLib.fadeOut(this.exitBut,500,1000);
	};

	p.fadeInAll=function(){
		opdLib.fadeIn(this.scoreBox,500,200);
		opdLib.fadeIn(this.textPane,500,200);
		opdLib.fadeIn(this.imagePane,500,200);
		opdLib.fadeIn(this.audioBut,500,200);
		opdLib.fadeIn(this.settingsBut,500,200);
		opdLib.fadeIn(this.countdownBar,500,200);
		opdLib.fadeIn(this.timerText,500,200);
		opdLib.fadeIn(this.roundText,500,200);
		opdLib.fadeIn(this.exitBut,500,200);
	};

	p.updateGameTextSetting=function(){
		if(oG.model.showText){
			this.textPane.init();
		}else{
			this.textPane.deit();
		}
	};

	p.gameTimer=function(event){
		this.gameTimerVar++;
		var tmpCount=Math.floor(this.gameTimerVar/10);
		this.timerText.text=tmpCount+'s';
	};

	p.stopAudio=function(){
		createjs.Sound.stop();
		if(this.soundPlayVar!=-1){
			if(oG.model.userAudioArray[this.soundPlayVar]!=null){
				oG.model.userAudioArray[this.soundPlayVar].pause();
				oG.model.userAudioArray[this.soundPlayVar].currentTime=0;
			}
		}
	};

	p.audioClick=function(){
		this.playAudio();
		this.audioBut.removeEventListener('click',this.audioClickFun);
		this.audioBut.alpha=0.5;
		this.addAudioTimeout=setTimeout(this.reAddAudioListFun,1000);
	};

	p.reAddAudioList=function(){
		this.audioBut.alpha=1;
		this.audioBut.addEventListener('click',this.audioClickFun);
	};

	p.playAudio=function(){
		var aVar=this.curArray[0];
		if(oG.model.useUserAudio){
			this.soundPlayVar=aVar;
			if(oG.model.userAudioArray[aVar]!=null){
				oG.model.userAudioArray[aVar].play();
			}
		}else{
			createjs.Sound.stop();
			createjs.Sound.play('s_'+aVar);
		}
	};

	p.checkAudioLoaded=function(){
		if(oG.model.audioLoaded){
			this.audioBut.visible=true;
		}else{
			this.audioBut.visible=false;
		}
	};

	p.settingsClick=function(event){
		if(this.settingsPane.visible){
			createjs.Ticker.addEventListener('tick', this.gameTimerFun);
			this.countdownBar.unpause();
			this.settingsPane.deit();
			this.settingsPane.exitBut.removeEventListener('click',this.settingsClickFun);
			this.settingsPane.fullBack.removeEventListener('click',this.settingsClickFun);
			this.routineDelay.unpause();
			this.endDelay.unpause();
			this.updateGameTextSetting();
		}else{
			createjs.Ticker.removeEventListener('tick', this.gameTimerFun);
			this.countdownBar.pause();
			this.settingsPane.init();
			this.settingsPane.exitBut.addEventListener('click',this.settingsClickFun);
			this.settingsPane.fullBack.addEventListener('click',this.settingsClickFun);
			this.routineDelay.pause();
			this.endDelay.pause();
		}
	};

	p.init=function(){
		opdGame.serverMetrics.saveProgress(2);
		console.log('sent metrics 2','init gameView');
		oG.model.speedVar=1;
		oG.model.gameScore=0;
		oG.model.gameTime=0;
		this.streak=0;
		this.gameTimerVar=0;
		this.roundCountVar=0;
		this.timerText.text='0.0s';
		this.roundText.text='0/'+oG.model.gameLim;
		this.scoreBox.setScore(0);
		this.soundPlayVar=-1;

		this.overText.visible=false;
		this.winText.visible=false;
		if(oG.model.useUserImages){
			for(i=0;i<oG.model.userImageArray.length;i++){
				opdLib.scaleImage(oG.model.userImageArray[i],120);
			}
		}

		this.settingsBut.addEventListener('click',this.settingsClickFun);
		this.audioBut.addEventListener('click',this.audioClickFun);
		this.exitBut.addEventListener('click',this.exitClickFun);
		createjs.Ticker.addEventListener('tick', this.gameTimerFun);

		this.mtrs.init(oG.model.contentLim);
		this.countdownBar.init();
		this.textPane.init();
		this.textPane.clearText();
		this.imagePane.init();
		this.checkAudioLoaded();
		this.updateGameTextSetting();
		this.fadeInAll();
		this.routineDelay.start(1000);
	};

	p.deit=function(){
		this.settingsBut.removeEventListener('click',this.settingsClickFun);
		this.audioBut.removeEventListener('click',this.audioClickFun);
		this.exitBut.addEventListener('click',this.exitClickFun);
		createjs.Ticker.removeEventListener('tick', this.gameTimerFun);

		this.stopAudio();
		this.mtrs.deit();
		this.imagePane.deit();
		this.countdownBar.deit();
		this.scoreBox.deit();
		this.endDelay.clear();
		this.routineDelay.clear();
		this.textPane.deit();

		clearTimeout(this.addAudioTimeout);
	};

	oG.Views.GameView=createjs.promote(GameView,'Container');
}(opdGame));



(function(oG){//checked
	var monthText=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var LINE_HEIGHT=38;

	function HighScoresTable(){
		this.Container_constructor();
		this.startUpFun=this.startUp.bind(this);
		this.stopUpFun=this.stopUp.bind(this);
		this.startDownFun=this.startDown.bind(this);
		this.stopDownFun=this.stopDown.bind(this);
		this.scrollUpFun=this.scrollUp.bind(this);
		this.scrollDownFun=this.scrollDown.bind(this);
		this.setup();
	}
	var p=createjs.extend(HighScoresTable,createjs.Container);

	p.setup=function(){
		this.addScoresFunction=function(){};
		this.rowsCount=0;
		this.fieldsMade=false;
		this.rows=8;
		this.tableType='scores';
		this.titleFont='bold 32px Arial';
		this.titleFontColor='#000';
		this.titlesFont='bold 22px Arial';
		this.titlesFontColor='#222';
		this.fieldsFont='bold 20px Arial';
		this.fieldsFontColor='#333';
		this.backPaneColor='#fff';
		this.backPaneAlpha=0.3;
		this.backPaneBorderColor='#000';
		this.backPaneBorderWidth=0;
	};

	p.initialSetup=function(){
		this.backPane=new createjs.Shape();

		this.titleText=new createjs.Text('',this.titleFont,this.titleFontColor);
		opdLib.centerText(this.titleText);

		this.titlesContainer=new createjs.Container();
		this.fieldsContainer=new createjs.Container();

		this.fieldsMask=new createjs.Shape();
		this.fieldsContainer.mask=this.fieldsMask;

		this.backPane.alpha=this.backPaneAlpha;

		this.myUpBut=opdLib.drawArrow(28,'#ff8');
		this.myDownBut=opdLib.drawArrow(28,'#ff8');
		this.myUpBut.rotation=-90;
		this.myDownBut.rotation=90;
		this.myUpBut.cursor='pointer';
		this.myDownBut.cursor='pointer';

		switch(this.tableType){
			case 'time':
			this.titleLabels=['Name','Time','Date','Location'];
			this.xInd=[94,214,305,415];
			this.addScoresFunction=this.addScoresFunTime;
			break;
			case 'timeRound':
			this.titleLabels=['Name','Time','Round','Date','Location'];
			this.xInd=[72,170,240,320,420];
			this.addScoresFunction=this.addScoresFunTimeRound;
			break;
			case 'movesTime':
			this.titleLabels=['Name','Moves','Time','Date','Location'];
			this.xInd=[77,175,245,320,420];
			this.addScoresFunction=this.addScoresFunMovesTime;
			break;
			case 'scoreMoves':
			this.titleLabels=['Name','Score','Moves','Date','Location'];
			this.xInd=[77,175,245,320,420];
			this.addScoresFunction=this.addScoresFunScoreMoves;
			break;
			case 'scoreTime':
			this.titleLabels=['Name','Score','Time','Date','Location'];
			this.xInd=[77,175,245,320,420];
			this.addScoresFunction=this.addScoresFunScoreTime;
			break;
			default:
			//'scores'
			this.titleLabels=['Name','Score','Date','Location'];
			this.xInd=[94,214,305,415];
			this.addScoresFunction=this.addScoresFunScores;
			break;
		}

		this.columns=this.titleLabels.length;

		this.tFields=[];
		this.titles=[];
		for(var i=0;i<this.columns;i++){
			this.titles[i]=new createjs.Text(this.titleLabels[i],this.titlesFont,this.titlesFontColor);
			this.titlesContainer.addChild(this.titles[i]);
			this.titles[i].x=this.xInd[i];
			opdLib.centerText(this.titles[i]);

			this.tFields[i]=new createjs.Text('',this.fieldsFont,this.fieldsFontColor);
			this.fieldsContainer.addChild(this.tFields[i]);
			this.tFields[i].maxWidth=150;
			this.tFields[i].lineHeight=LINE_HEIGHT;
			this.tFields[i].x=this.xInd[i];
			opdLib.centerText(this.tFields[i]);
		}

		this.addChild(this.backPane,this.titlesContainer,this.fieldsContainer,this.titleText);
		this.addChild(this.myUpBut,this.myDownBut);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			this.fieldsMask.graphics.clear().beginFill('#000').drawRect(160,130,600,296);
			opdLib.posItem(this.titleText,415,64);
			opdLib.posItem(this.titlesContainer,168,109);
			this.baseY=151;
			this.fieldsX=168;
			opdLib.posItem(this.myUpBut,730,200);
			opdLib.posItem(this.myDownBut,730,310);
		}else{
			this.fieldsMask.graphics.clear().beginFill('#000').drawRect(35,260,600,296);
			opdLib.posItem(this.titleText,278,194);
			opdLib.posItem(this.titlesContainer,31,239);
			this.baseY=281;
			this.fieldsX=31;
			opdLib.posItem(this.myUpBut,275,32);
			opdLib.posItem(this.myDownBut,275,118);
		}
		opdLib.posItem(this.fieldsContainer,this.fieldsX,this.baseY);
		this.drawBackPane();
		this.setMinY();
	};

	p.drawBackPane=function(){
		this.backPane.graphics.clear().beginFill(this.backPaneColor);
		if(this.backPaneBorderWidth>0){
			this.backPane.graphics.setStrokeStyle(this.backPaneBorderWidth).beginStroke(this.backPaneBorderColor);
		}
		if(oG.model.orientation===0){
			this.backPane.graphics.drawRoundRect(170,20,500,426,24);
		}else{
			this.backPane.graphics.drawRoundRect(25,150,500,426,24);
		}
		this.backPane.alpha=this.backPaneAlpha;
	};

	p.setMinY=function(){
		if(this.rowsCount<=this.rows){
			this.minY=this.baseY;
		}else{
			this.minY=this.baseY-((this.rowsCount-8)*LINE_HEIGHT);
		}
	};

	p.showScores=function(jsonArr){
		this.jsonArr=jsonArr;
		this.addScoresFunction();
		this.setMinY();
	};

	p.startUp=function(event){
		this.delta=0;
		createjs.Ticker.addEventListener('tick',this.scrollUpFun);
		this.myUpBut.addEventListener('mouseout',this.stopUpFun);
	};

	p.stopUp=function(event){
		if(!oG.model.touchMode){
			createjs.Ticker.removeEventListener('tick',this.scrollUpFun);
			this.myUpBut.removeEventListener('mouseout',this.stopUpFun);
		}
		if(this.delta===0){
			for(var i=0;i<this.rows;i++){this.scrollUp();}
		}
		this.delta=0;
	};

	p.startDown=function(event){
		this.delta=0;
		createjs.Ticker.addEventListener('tick',this.scrollDownFun);
		this.myDownBut.addEventListener('mouseout',this.stopDownFun);
	};

	p.stopDown=function(event){
		if(!oG.model.touchMode){
			createjs.Ticker.removeEventListener('tick',this.scrollDownFun);
			this.myDownBut.removeEventListener('mouseout',this.stopDownFun);
		}
		if(this.delta===0){
			for(var i=0;i<this.rows;i++){this.scrollDown();}
		}
		this.delta=0;
	};

	p.scrollUp=function(){
		this.delta++;
		this.fieldsContainer.y+=LINE_HEIGHT;
		if(this.fieldsContainer.y>=this.baseY){
			this.fieldsContainer.y=this.baseY;
			createjs.Ticker.removeEventListener('tick',this.scrollUpFun);
			this.myUpBut.removeEventListener('mouseout',this.stopUpFun);
		}
	};

	p.scrollDown=function(){
		this.delta++;
		this.fieldsContainer.y-=LINE_HEIGHT;
		if(this.fieldsContainer.y<=this.minY){
			this.fieldsContainer.y=this.minY;
			createjs.Ticker.removeEventListener('tick',this.scrollDownFun);
			this.myDownBut.removeEventListener('mouseout',this.stopDownFun);
		}
	};

	p.addLists=function(){
		if(!oG.model.touchMode){
			this.myUpBut.addEventListener('mousedown',this.startUpFun);
			this.myDownBut.addEventListener('mousedown',this.startDownFun);
		}
		this.myUpBut.addEventListener('click',this.stopUpFun);
		this.myDownBut.addEventListener('click',this.stopDownFun);
	};

	p.removeLists=function(){
		if(!oG.model.touchMode){
			this.myUpBut.removeEventListener('mousedown',this.startUpFun);
			this.myDownBut.removeEventListener('mousedown',this.startDownFun);
		}
		this.myUpBut.removeEventListener('click',this.stopUpFun);
		this.myDownBut.removeEventListener('click',this.stopDownFun);
	};

	p.init=function(){
		this.delta=0;
		this.rowsCount=0;
		opdLib.posItem(this.fieldsContainer,this.fieldsX,this.baseY);
		this.titleText.text='Content : '+oG.model.contentTitle;
		this.addLists();
	};

	p.deit=function(){
		this.rowsCount=0;
		this.removeLists();
	};

	p.addScoresFunMovesTime=function(){
		var i=0;
		for(i=0;i<this.tFields.length;i++)this.tFields[i].text='';
		var myDate=new Date();
		this.rowsCount=this.jsonArr.scores.length;
		for(i=0;i<this.rowsCount;i++){
			myDate.setTime(this.jsonArr.scores[i].Dote);
			var myMon=monthText[myDate.getMonth()];
			var myDay=myDate.getDate();
			this.tFields[0].text+=this.jsonArr.scores[i].Nom+'\r\n';
			this.tFields[1].text+=this.jsonArr.scores[i].Muves+'\r\n';
			this.tFields[2].text+=this.jsonArr.scores[i].Tome+'s\r\n';
			this.tFields[3].text+=myDay+'-'+myMon+'\r\n';
			this.tFields[4].text+=this.jsonArr.scores[i].Local+'\r\n';
		}
	};

	p.addScoresFunScoreMoves=function(){
		var i=0;
		for(i=0;i<this.tFields.length;i++)this.tFields[i].text='';
		var myDate=new Date();
		this.rowsCount=this.jsonArr.scores.length;
		for(i=0;i<this.rowsCount;i++){
			myDate.setTime(this.jsonArr.scores[i].Dote);
			var myMon=monthText[myDate.getMonth()];
			var myDay=myDate.getDate();
			this.tFields[0].text+=this.jsonArr.scores[i].Nom+'\r\n';
			this.tFields[1].text+=this.jsonArr.scores[i].Score+'\r\n';
			this.tFields[2].text+=this.jsonArr.scores[i].Muves+'\r\n';
			this.tFields[3].text+=myDay+'-'+myMon+'\r\n';
			this.tFields[4].text+=this.jsonArr.scores[i].Local+'\r\n';
		}
	};

	p.addScoresFunScoreTime=function(){
		var i=0;
		for(i=0;i<this.tFields.length;i++)this.tFields[i].text='';
		var myDate=new Date();
		this.rowsCount=this.jsonArr.scores.length;
		for(i=0;i<this.rowsCount;i++){
			myDate.setTime(this.jsonArr.scores[i].Dote);
			var myMon=monthText[myDate.getMonth()];
			var myDay=myDate.getDate();
			this.tFields[0].text+=this.jsonArr.scores[i].Nom+'\r\n';
			this.tFields[1].text+=this.jsonArr.scores[i].Score+'\r\n';
			this.tFields[2].text+=this.jsonArr.scores[i].Tome+'\r\n';
			this.tFields[3].text+=myDay+'-'+myMon+'\r\n';
			this.tFields[4].text+=this.jsonArr.scores[i].Local+'\r\n';
		}
	};

	p.addScoresFunTimeRound=function(){
		var i=0;
		for(i=0;i<this.tFields.length;i++)this.tFields[i].text='';
		var myDate=new Date();
		this.rowsCount=this.jsonArr.scores.length;
		for(i=0;i<this.rowsCount;i++){
			myDate.setTime(this.jsonArr.scores[i].Dote);
			var myMon=monthText[myDate.getMonth()];
			var myDay=myDate.getDate();
			this.tFields[0].text+=this.jsonArr.scores[i].Nom+'\r\n';
			this.tFields[1].text+=this.jsonArr.scores[i].Tome+'s\r\n';
			this.tFields[2].text+=this.jsonArr.scores[i].Score+'\r\n';
			this.tFields[3].text+=myDay+'-'+myMon+'\r\n';
			this.tFields[4].text+=this.jsonArr.scores[i].Local+'\r\n';
		}
	};

	p.addScoresFunScores=function(){
		var i=0;
		for(i=0;i<this.tFields.length;i++)this.tFields[i].text='';
		var myDate=new Date();
		this.rowsCount=this.jsonArr.scores.length;
		for(i=0;i<this.rowsCount;i++){
			myDate.setTime(this.jsonArr.scores[i].Dote);
			var myMon=monthText[myDate.getMonth()];
			var myDay=myDate.getDate();
			this.tFields[0].text+=this.jsonArr.scores[i].Nom+'\r\n';
			this.tFields[1].text+=this.jsonArr.scores[i].Score+'\r\n';
			this.tFields[2].text+=myDay+'-'+myMon+'\r\n';
			this.tFields[3].text+=this.jsonArr.scores[i].Local+'\r\n';
		}
	};

	p.addScoresFunTime=function(){
		var i=0;
		for(i=0;i<this.tFields.length;i++)this.tFields[i].text='';
		var myDate=new Date();
		this.rowsCount=this.jsonArr.scores.length;
		for(i=0;i<this.rowsCount;i++){
			myDate.setTime(this.jsonArr.scores[i].Dote);
			var myMon=monthText[myDate.getMonth()];
			var myDay=myDate.getDate();
			this.tFields[0].text+=this.jsonArr.scores[i].Nom+'\r\n';
			this.tFields[1].text+=this.jsonArr.scores[i].Tome+'\r\n';
			this.tFields[2].text+=myDay+'-'+myMon+'\r\n';
			this.tFields[3].text+=this.jsonArr.scores[i].Local+'\r\n';
		}
	};

	oG.Modules.HighScoresTable=createjs.promote(HighScoresTable,'Container');
}(opdGame));


(function(oG){//checked
	function ImageItem(){
		this.Container_constructor();
		this.setup();
	}
	var p=createjs.extend(ImageItem,createjs.Container);

	p.setup=function(){
		this.mouseChildren=false;
		this.cursor='pointer';
		this.mySprite=null;
		this.myImVar=-1;
		this.defAlpha=0.6;

		this.myBackShade=new createjs.Shape();
		this.myBackShade.graphics.beginFill('#fff').drawRoundRect(0,0,130,130,8);
		this.myBackShade.alpha=this.defAlpha;
		this.addChild(this.myBackShade);

		var myBack=new createjs.Sprite(oG.model.mainSpriteSheet);
		myBack.gotoAndStop('itemId');

		opdLib.dispItem(myBack,this,-10,-10);
	};

	p.setSize=function(gSize){
		if(gSize=='big'){
			this.scaleX=1.20;
			this.scaleY=1.20;
		}else{
			this.scaleX=1;
			this.scaleY=1;
		}
	};

	p.init=function(){
		this.visible=true;
		if(!oG.model.useUserImages){
			this.mySprite=new createjs.Sprite(oG.model.contentSpriteSheet);
			this.addChild(this.mySprite);
			this.mySprite.x=5;
			this.mySprite.y=5;
		}
		this.myImVar=-1;
	};

	p.deit=function(){
		if(!oG.model.useUserImages){
			this.removeChild(this.mySprite);
			this.mySprite=null;
		}else{
			if(this.myImVar!=-1){
				this.removeChild(oG.model.userImageArray[this.myImVar]);
			}
		}
	};

	p.setSprite=function(gVar){
		if(!oG.model.useUserImages){
			this.mySprite.gotoAndStop(gVar);
		}else{
			if(this.myImVar!=-1){
				if(this.myImVar<oG.model.userImageArray.length){
					this.removeChild(oG.model.userImageArray[this.myImVar]);
				}
			}
			this.myImVar=gVar;
			if(this.myImVar<oG.model.userImageArray.length){
				this.addChild(oG.model.userImageArray[gVar]);
				this.visible=true;
			}else{
				this.visible=false;
			}
		}
	};

	p.overer=function(){
		createjs.Tween.removeTweens(this.myBackShade);
		createjs.Tween.get(this.myBackShade,{loop:false}).to({alpha:1},200);
	};

	p.outer=function(){
		createjs.Tween.removeTweens(this.myBackShade);
		createjs.Tween.get(this.myBackShade,{loop:false}).to({alpha:this.defAlpha},100);
	};

	oG.Modules.ImageItem=createjs.promote(ImageItem,'Container');
}(opdGame));


(function(oG){//checked
	var positionArrayX=[];
	var positionArrayY=[];

	function ImagePane(){
		this.Container_constructor();
		this.clickerFun=this.clicker.bind(this);
		this.mouseOutFun=this.mouseOut.bind(this);
		this.mouseOverFun=this.mouseOver.bind(this);
		this.setup();
	}

	var p=createjs.extend(ImagePane,createjs.Container);
	var NUM_ITEMS=10;

	p.setup=function(){
		this.active=false;
		this.myItems=[];
		this.imageContainer=new createjs.Container();
		this.addChild(this.imageContainer);

		for(var i=0;i<NUM_ITEMS;i++){
			this.myItems[i]=new oG.Modules.ImageItem();
			this.myItems[i].val=i;
		}
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			positionArrayX=[-20,130,280,430,580,-20,130,280,430,580];
			positionArrayY=[20,40,20,40,20,170,190,170,190,170];
			this.leSize='small';
		}else{
			positionArrayX=[
				112,282,
				27,197,367,
				112,282];
			positionArrayY=[
				-40,-40,
				130,130,130,
				300,300];
			this.leSize='big';
		}

		this.scrambleArray=[];
		for(var i=0;i<oG.model.roundLim;i++){
			this.scrambleArray.push(i);
			this.imageContainer.addChild(this.myItems[i]);
			this.myItems[i].init();
			this.myItems[i].setSize(this.leSize);
			this.myItems[i].x=positionArrayX[i];
			this.myItems[i].y=positionArrayY[i];
			this.myItems[i].alpha=0;
		}
	};

	p.orientationChange=function(){
		if(this.active){
			for(var i=0;i<NUM_ITEMS;i++){
				this.imageContainer.removeChild(this.myItems[i]);
				this.myItems[i].deit();
			}

			this.setupDisplay();
			
			if(this.curArray.length>0){
				opdLib.shuffleArray(this.scrambleArray);
				for(i=0;i<oG.model.roundLim;i++){
					this.myItems[this.scrambleArray[i]].setSprite(this.curArray[i]);
					this.myItems[i].outer();
					this.myItems[i].alpha=1;
				}
			}
		}
	};

	p.clicker=function(event){
		if(event.target.val===this.scrambleArray[0]){
			for(var i=1;i<oG.model.roundLim;i++){
				this.myItems[this.scrambleArray[i]].alpha=0;
			}
			this.removeItemLists();
			oG.view.gameView.clickOutcome('hit');
		}else{
			event.target.alpha=0;
			oG.view.gameView.clickOutcome('miss');
			if(this.leSize=='small')this.removeAnother();
			//oG.view.gameView.countdownBar.resetHintVar();
		}
	};

	p.mouseOver=function(event){
		event.target.overer();
	};

	p.mouseOut=function(event){
		event.target.outer();
	};

	p.timeRemoveItem=function(){
		this.removeAnother();
		if(this.leSize=='small')this.removeAnother();
	};

	p.removeAnother=function(){
		var removeAnother=1;
		var lim=oG.model.roundLim-1;
		while(this.myItems[this.scrambleArray[removeAnother]].alpha==0&&removeAnother<lim){
			removeAnother++;
		}
		this.myItems[this.scrambleArray[removeAnother]].alpha=0;
	};

	p.routine=function($curArray){
		this.curArray=$curArray;
		opdLib.shuffleArray(this.scrambleArray);
		for(var i=0;i<oG.model.roundLim;i++){
			this.myItems[this.scrambleArray[i]].setSprite(this.curArray[i]);
			this.myItems[i].alpha=1;
			this.myItems[i].outer();
		}
		var sDel=Math.round(600*oG.model.speedVar);
		if(sDel>80){
			this.imageContainer.alpha=0;
			createjs.Tween.get(this.imageContainer,{loop:false}).to({alpha:1},sDel);
		}
		this.addItemLists();

	};

	p.timeout=function(){
		this.removeItemLists();
	};

	p.addItemLists=function(){
		this.imageContainer.addEventListener('click',this.clickerFun);
		if(!oG.model.touchMode){
			this.imageContainer.addEventListener('mouseover',this.mouseOverFun);
			this.imageContainer.addEventListener('mouseout',this.mouseOutFun);
		}
	};

	p.removeItemLists=function(){
		this.imageContainer.removeEventListener('click',this.clickerFun);
		if(!oG.model.touchMode){
			this.imageContainer.removeEventListener('mouseover',this.mouseOverFun);
			this.imageContainer.removeEventListener('mouseout',this.mouseOutFun);
		}
	};

	p.init=function(){
		this.curArray=[];
		this.active=true;
		this.setupDisplay();
	};

	p.deit=function(){
		for(var i=0;i<NUM_ITEMS;i++){
			this.myItems[i].deit();
			this.imageContainer.removeChild(this.myItems[i]);
		}
		this.removeItemLists();
		this.active=false;
	};

	oG.Modules.ImagePane=createjs.promote(ImagePane,'Container');
}(opdGame));

(function(oG){//checked
	var imsFrames=[];
	var imsSeqs=[];

	function getImFramesLoc($var){
		var frms=imsFrames[$var];
		var tmpFrms=[];
		for(var i=0;i<frms.length;i++){
			tmpFrms[i]=frms[imsSeqs[$var][i]];
		}
		return tmpFrms;
	}

function getImSeqLoc($var){
	return imsSeqs[$var];
}

	imsSeqs[0]=[14,13,16,3,7,21,5,9,27,18,10,8,4,0,25,15,24,26,28,23,12,2,20,6,11,1,17,22,29,19];
	imsSeqs[1]=[8,2,0,5,11,17,7,1,4,3,12,9,15,13,18,19,14,16,6,10];
	imsSeqs[2]=[18,5,16,8,3,6,12,17,2,11,0,19,1,14,13,9,10,15,4,7];
	imsSeqs[3]=[9,16,12,17,14,6,11,1,19,7,15,4,2,0,8,10,18,3,13,5];
	imsSeqs[4]=[1,2,3,4,5,6,7,0,8,9];
	imsSeqs[5]=[7,11,1,10,12,6,8,17,18,16,0,9,3,14,2,13,5,4,15];
	imsSeqs[6]=[4,19,11,14,17,12,7,5,28,26,13,20,3,9,21,6,22,1,2,0,29,25,23,27,16,8,10,18,24,15];
	imsSeqs[7]=[14,28,23,3,15,13,24,5,19,10,0,21,18,9,7,4,22,1,20,17,6,11,2,26,8,25,12,16,27];
	imsSeqs[8]=[13,4,0,2,18,17,7,12,14,1,5,10,15,8,16,11,9,3,19,6];
	imsSeqs[9]=[7,4,17,14,5,6,9,10,13,11,0,8,3,1,2,15,16,12];
	imsSeqs[10]=[16,13,3,22,6,21,10,2,1,14,0,8,15,9,17,20,11,23,5,7,24,19,12,4,25,18];
	imsSeqs[11]=[25,6,21,11,27,28,24,10,2,5,0,9,7,26,1,12,17,14,8,29,15,23,3,19,22,20,16,18,13,4];
	imsSeqs[12]=[9,14,19,11,15,17,7,3,5,16,8,2,4,10,12,6,1,0,18,13];
	imsSeqs[13]=[0,5,14,17,15,8,19,16,20,3,1,4,9,10,11,7,18,12,13,6,2];
	imsSeqs[14]=[1,8,5,3,2,24,4,20,22,26,27,15,17,6,21,14,0,11,23,7,13,9,12,25,19,16,10,18,28];
	imsSeqs[15]=[20,12,8,4,25,7,26,18,5,21,14,17,0,24,2,23,28,13,6,27,9,22,1,10,16,15,3,19,11];
	imsSeqs[16]=[16,9,5,6,10,14,8,2,0,1,7,19,15,12,3,18,4,17,11,13];
	imsSeqs[17]=[9,11,10,12,7,14,2,3,18,0,17,16,1,13,8,15,4,5,6];
	imsSeqs[18]=[26,18,31,36,11,4,33,0,13,23,32,12,15,27,24,3,5,39,14,29,25,2,1,6,7,20,19,16,34,17,28,10,22,21,37,30,8,35,9,38];
	imsSeqs[19]=[6,12,11,1,7,14,0,4,5,10,8,9,17,15,2,18,3,16,19,13];
	imsSeqs[20]=[11,5,13,15,9,8,19,2,18,12,17,7,4,16,14,10,0,6,3,1];
	imsSeqs[21]=[25,15,2,11,24,9,18,3,4,16,12,5,22,20,26,19,8,1,0,10,14,27,7,6,17,21,23,13];
	imsSeqs[22]=[19,12,7,13,17,20,5,15,8,6,14,11,3,18,24,9,0,23,4,1,16,25,21,22,10,2];

	imsFrames[0]=[
		[1, 1, 86, 120, 0, -20, 0],
		[1, 123, 110, 111, 0, -4, -7],
		[89, 1, 117, 110, 0, -2, -7],
		[113, 113, 119, 107, 0, 0, -10],
		[208, 1, 99, 105, 0, -11, -10],
		[113, 222, 80, 28, 0, -26, -47],
		[234, 108, 93, 99, 0, -15, -11],
		[234, 209, 109, 40, 0, -7, -42],
		[309, 1, 95, 98, 0, -16, -12],
		[329, 101, 93, 98, 0, -14, -14],
		[406, 1, 117, 97, 0, -2, -13],
		[424, 100, 70, 96, 0, -26, -14],
		[424, 198, 80, 56, 0, -19, -39],
		[496, 100, 110, 95, 0, -4, -15],
		[525, 1, 102, 94, 0, -9, -19],
		[608, 97, 112, 93, 0, -8, -15],
		[629, 1, 108, 93, 0, -7, -22],
		[608, 192, 120, 61, 0, 0, -27],
		[722, 96, 116, 88, 0, -2, -21],
		[730, 186, 110, 68, 0, -5, -28],
		[739, 1, 114, 88, 0, -3, -21],
		[840, 91, 110, 88, 0, -8, -20],
		[855, 1, 112, 87, 0, -5, -20],
		[842, 181, 118, 73, 0, -2, -22],
		[952, 90, 112, 84, 0, -4, -24],
		[962, 176, 79, 75, 0, -22, -25],
		[1043, 176, 108, 73, 0, -6, -26],
		[969, 1, 113, 81, 0, -7, -20],
		[1066, 84, 112, 81, 0, -3, -27],
		[1084, 1, 96, 65, 0, -10, -30]
	];

	imsFrames[1]=[
		[1, 1, 119, 26, 0, 0, -47],
		[122, 1, 108, 40, 0, -8, -43],
		[232, 1, 115, 73, 0, -3, -25],
		[349, 1, 111, 73, 0, -4, -25],
		[1, 29, 54, 80, 0, -33, -20],
		[462, 1, 34, 112, 0, -49, -4],
		[57, 43, 107, 95, 0, -9, -18],
		[166, 43, 63, 120, 0, -31, 0],
		[231, 76, 106, 101, 0, -6, -9],
		[339, 76, 95, 101, 0, -10, -10],
		[1, 140, 104, 101, 0, -7, -14],
		[107, 165, 103, 103, 0, -9, -9],
		[212, 179, 91, 105, 0, -15, -8],
		[305, 179, 106, 107, 0, -9, -8],
		[413, 179, 81, 108, 0, -23, -6],
		[1, 243, 101, 108, 0, -8, -7],
		[104, 270, 93, 109, 0, -14, -8],
		[199, 286, 92, 114, 0, -17, -4],
		[293, 288, 80, 115, 0, -20, -3],
		[375, 289, 79, 119, 0, -19, -1]
	];

	imsFrames[2]=[
		[1, 1, 119, 101, 0, 0, -10],
		[122, 1, 119, 59, 0, 0, -33],
		[122, 62, 118, 76, 0, -2, -30],
		[1, 104, 117, 55, 0, -1, -34],
		[120, 140, 114, 95, 0, -3, -16],
		[1, 161, 112, 115, 0, -4, -3],
		[115, 237, 105, 109, 0, -8, -6],
		[222, 237, 27, 113, 0, -46, -5],
		[1, 278, 102, 101, 0, -10, -14],
		[105, 348, 98, 70, 0, -22, -26],
		[205, 352, 49, 117, 0, -38, -2],
		[1, 381, 91, 118, 0, -12, -1],
		[94, 420, 89, 120, 0, -18, 0],
		[185, 471, 63, 117, 0, -36, -2],
		[1, 501, 79, 118, 0, -25, -1],
		[82, 542, 78, 112, 0, -23, -5],
		[1, 621, 63, 116, 0, -29, -2],
		[162, 590, 57, 120, 0, -33, 0],
		[66, 656, 47, 103, 0, -37, -10],
		[115, 656, 44, 113, 0, -37, -4]
	];

	imsFrames[3]=[
		[1, 1, 114, 118, 0, -2, -1],
		[1, 121, 112, 116, 0, -5, -2],
		[115, 121, 112, 114, 0, -4, -3],
		[117, 1, 111, 112, 0, -5, -5],
		[229, 115, 106, 119, 0, -6, -1],
		[230, 1, 96, 112, 0, -10, -5],
		[328, 1, 91, 106, 0, -16, -8],
		[337, 109, 105, 119, 0, -7, -1],
		[421, 1, 118, 81, 0, -1, -19],
		[444, 84, 101, 116, 0, -9, -3],
		[541, 1, 119, 73, 0, 0, -23],
		[547, 76, 90, 103, 0, -15, -9],
		[547, 181, 117, 65, 0, -1, -29],
		[639, 76, 83, 91, 0, -19, -16],
		[662, 1, 113, 59, 0, -4, -37],
		[666, 169, 118, 54, 0, -1, -37],
		[777, 1, 66, 117, 0, -27, -2],
		[786, 120, 63, 120, 0, -34, 0],
		[845, 1, 50, 117, 0, -36, -3],
		[851, 120, 34, 117, 0, -44, -2]
	];

	imsFrames[4]=[
		[1, 1, 104, 104, 0, -8, -8],
		[1, 107, 102, 102, 0, -9, -9],
		[105, 107, 102, 102, 0, -9, -9],
		[107, 1, 102, 102, 0, -9, -9],
		[209, 105, 102, 102, 0, -9, -9],
		[211, 1, 102, 102, 0, -9, -9],
		[313, 105, 102, 102, 0, -9, -9],
		[315, 1, 102, 102, 0, -9, -9],
		[417, 105, 102, 102, 0, -9, -9],
		[419, 1, 102, 102, 0, -9, -9]
	];

	imsFrames[5]=[
		[1, 1, 89, 47, 0, -14, -39],
		[92, 1, 114, 53, 0, -4, -35],
		[1, 56, 114, 69, 0, -4, -27],
		[117, 56, 111, 78, 0, -4, -24],
		[1, 127, 99, 86, 0, -11, -19],
		[102, 136, 118, 94, 0, -1, -17],
		[1, 215, 87, 102, 0, -19, -11],
		[90, 232, 120, 95, 0, 0, -16],
		[1, 329, 114, 99, 0, 0, -10],
		[117, 329, 101, 100, 0, -11, -11],
		[1, 430, 114, 100, 0, -4, -11],
		[117, 431, 105, 106, 0, -7, -9],
		[1, 532, 113, 106, 0, -4, -9],
		[116, 539, 109, 108, 0, -6, -6],
		[1, 640, 53, 112, 0, -36, -4],
		[56, 649, 91, 113, 0, -19, -4],
		[149, 649, 66, 113, 0, -28, -5],
		[1, 764, 96, 114, 0, -11, -5],
		[99, 764, 87, 115, 0, -17, -3]
	];

	imsFrames[6]=[
		[1, 1, 116, 118, 0, -1, -2],
		[119, 1, 118, 104, 0, -1, -10],
		[1, 121, 113, 109, 0, -3, -6],
		[1, 232, 104, 117, 0, -12, -1],
		[1, 351, 103, 117, 0, -12, -2],
		[239, 1, 118, 101, 0, -1, -13],
		[359, 1, 118, 52, 0, -1, -34],
		[1, 470, 96, 116, 0, -13, -3],
		[1, 588, 100, 111, 0, -11, -4],
		[359, 55, 117, 95, 0, -1, -10],
		[119, 107, 119, 74, 0, 0, -27],
		[240, 104, 117, 62, 0, -1, -39],
		[116, 183, 120, 76, 0, 0, -28],
		[107, 261, 116, 92, 0, -2, -15],
		[106, 355, 114, 107, 0, -4, -9],
		[359, 152, 116, 100, 0, -3, -11],
		[240, 168, 115, 100, 0, -3, -11],
		[225, 270, 114, 95, 0, -3, -15],
		[222, 367, 113, 95, 0, -5, -13],
		[99, 470, 71, 116, 0, -25, -3],
		[172, 464, 110, 102, 0, -6, -10],
		[103, 588, 73, 117, 0, -26, -2],
		[178, 568, 102, 109, 0, -9, -5],
		[284, 464, 104, 104, 0, -9, -8],
		[282, 570, 113, 95, 0, -3, -11],
		[357, 254, 112, 93, 0, -3, -16],
		[341, 349, 105, 82, 0, -7, -23],
		[390, 433, 75, 118, 0, -28, -2],
		[397, 553, 74, 114, 0, -27, -4],
		[282, 667, 89, 33, 0, -18, -50]
	];

	imsFrames[7]=[
		[1, 1, 120, 70, 0, 0, -28],
		[123, 1, 119, 92, 0, 0, -16],
		[1, 73, 119, 72, 0, -1, -26],
		[122, 95, 118, 53, 0, -1, -42],
		[1, 147, 116, 100, 0, -3, -8],
		[119, 150, 115, 115, 0, -3, -3],
		[1, 249, 115, 107, 0, -2, -8],
		[118, 267, 115, 104, 0, -3, -7],
		[1, 358, 114, 74, 0, -4, -22],
		[117, 373, 114, 67, 0, -3, -33],
		[1, 434, 113, 118, 0, -2, -2],
		[116, 442, 113, 103, 0, -4, -10],
		[116, 547, 113, 95, 0, -3, -15],
		[1, 554, 112, 80, 0, -4, -23],
		[1, 636, 111, 93, 0, -5, -16],
		[114, 644, 110, 80, 0, -6, -28],
		[114, 726, 108, 65, 0, -7, -27],
		[1, 731, 104, 99, 0, -7, -13],
		[107, 793, 92, 117, 0, -15, -2],
		[201, 793, 49, 93, 0, -37, -17],
		[201, 888, 45, 109, 0, -43, -7],
		[1, 832, 91, 115, 0, -15, -3],
		[94, 912, 89, 108, 0, -18, -8],
		[185, 999, 66, 118, 0, -25, -1],
		[1, 949, 84, 115, 0, -19, -3],
		[87, 1022, 83, 113, 0, -17, -5],
		[1, 1137, 74, 113, 0, -27, -2],
		[77, 1137, 70, 113, 0, -29, -5],
		[149, 1137, 77, 112, 0, -23, -5]
	];

	imsFrames[8]=[
		[1, 1, 117, 30, 0, -2, -48],
		[120, 1, 120, 44, 0, 0, -39],
		[242, 1, 117, 58, 0, -2, -33],
		[361, 1, 117, 71, 0, -2, -29],
		[1, 33, 84, 88, 0, -17, -21],
		[87, 47, 115, 89, 0, -3, -18],
		[204, 61, 113, 103, 0, -4, -11],
		[319, 74, 118, 108, 0, -1, -8],
		[439, 74, 51, 115, 0, -36, -2],
		[1, 123, 84, 115, 0, -17, -3],
		[87, 138, 112, 109, 0, -5, -8],
		[201, 166, 102, 113, 0, -10, -3],
		[305, 184, 117, 109, 0, -1, -8],
		[424, 191, 67, 116, 0, -27, -3],
		[1, 240, 53, 116, 0, -37, -3],
		[56, 249, 107, 116, 0, -8, -2],
		[165, 281, 99, 116, 0, -6, -2],
		[266, 295, 95, 116, 0, -15, -3],
		[363, 295, 48, 120, 0, -38, 0],
		[413, 309, 75, 117, 0, -28, -2]
	];

	imsFrames[9]=[
		[1, 1, 87, 119, 0, -19, -1],
		[90, 1, 48, 116, 0, -38, -2],
		[140, 1, 42, 116, 0, -40, -2],
		[184, 1, 98, 115, 0, -18, -3],
		[284, 1, 75, 115, 0, -24, -3],
		[361, 1, 69, 115, 0, -27, -4],
		[432, 1, 49, 115, 0, -35, -3],
		[483, 1, 99, 114, 0, -11, -3],
		[584, 1, 111, 113, 0, -6, -3],
		[697, 1, 106, 113, 0, -8, -4],
		[805, 1, 94, 113, 0, -14, -4],
		[901, 1, 109, 112, 0, -5, -5],
		[1012, 1, 116, 109, 0, -1, -6],
		[1130, 1, 112, 109, 0, -3, -7],
		[1244, 1, 118, 98, 0, -2, -16],
		[1364, 1, 91, 82, 0, -15, -23],
		[1457, 1, 116, 71, 0, -2, -27],
		[1457, 74, 115, 44, 0, -3, -40]
	];

	imsFrames[10]=[
		[1, 1, 117, 78, 0, -2, -19],
		[120, 1, 117, 78, 0, -1, -25],
		[1, 81, 116, 86, 0, -1, -24],
		[119, 81, 116, 92, 0, -3, -18],
		[1, 169, 115, 92, 0, -3, -16],
		[118, 175, 116, 96, 0, -3, -15],
		[1, 263, 107, 103, 0, -6, -9],
		[110, 273, 118, 98, 0, -1, -11],
		[1, 368, 76, 106, 0, -23, -7],
		[79, 373, 110, 104, 0, -6, -10],
		[191, 373, 63, 114, 0, -30, -3],
		[1, 479, 111, 106, 0, -7, -7],
		[114, 479, 68, 115, 0, -27, -3],
		[184, 489, 57, 116, 0, -31, -3],
		[1, 587, 109, 109, 0, -6, -7],
		[112, 596, 55, 117, 0, -32, -2],
		[169, 607, 83, 117, 0, -20, -1],
		[1, 698, 106, 111, 0, -7, -5],
		[109, 715, 52, 118, 0, -37, -1],
		[163, 726, 80, 117, 0, -20, -2],
		[1, 811, 98, 112, 0, -11, -4],
		[101, 845, 116, 109, 0, -2, -8],
		[1, 925, 97, 114, 0, -14, -3],
		[100, 956, 113, 110, 0, -5, -7],
		[1, 1041, 95, 116, 0, -13, -2],
		[98, 1068, 88, 117, 0, -17, -1]
	];

	imsFrames[11]=[
		[1, 1, 120, 66, 0, 0, -30],
		[123, 1, 114, 94, 0, -2, -15],
		[1, 69, 120, 46, 0, 0, -41],
		[123, 97, 114, 56, 0, -3, -33],
		[1, 117, 120, 27, 0, 0, -48],
		[1, 146, 119, 70, 0, 0, -25],
		[122, 155, 115, 68, 0, -3, -37],
		[1, 218, 118, 56, 0, -1, -28],
		[121, 225, 116, 111, 0, -2, -3],
		[1, 276, 117, 98, 0, -2, -13],
		[120, 338, 117, 89, 0, -2, -21],
		[1, 376, 117, 88, 0, -2, -19],
		[120, 429, 117, 76, 0, -2, -27],
		[1, 466, 116, 90, 0, -1, -13],
		[119, 507, 116, 42, 0, -3, -42],
		[119, 551, 115, 36, 0, -4, -44],
		[1, 558, 113, 85, 0, -4, -20],
		[116, 589, 113, 74, 0, -4, -22],
		[1, 645, 113, 68, 0, -5, -26],
		[116, 665, 113, 64, 0, -5, -30],
		[1, 715, 112, 96, 0, -4, -12],
		[115, 731, 110, 99, 0, -7, -13],
		[1, 813, 94, 104, 0, -12, -8],
		[97, 832, 89, 111, 0, -18, -5],
		[1, 919, 85, 118, 0, -21, -1],
		[188, 832, 35, 117, 0, -44, -2],
		[1, 1039, 63, 117, 0, -28, -2],
		[88, 945, 77, 112, 0, -25, -6],
		[66, 1059, 76, 115, 0, -23, -3],
		[144, 1059, 34, 115, 0, -43, -2]
	];

	imsFrames[12]=[
		[1, 1, 116, 115, 0, -2, -2],
		[1, 118, 113, 108, 0, -3, -5],
		[116, 118, 108, 105, 0, -5, -12],
		[119, 1, 92, 108, 0, -14, -6],
		[213, 1, 98, 99, 0, -11, -10],
		[226, 102, 89, 117, 0, -18, -2],
		[313, 1, 96, 98, 0, -14, -2],
		[317, 101, 119, 77, 0, 0, -22],
		[317, 180, 120, 75, 0, 0, -23],
		[411, 1, 118, 75, 0, -1, -24],
		[438, 78, 93, 95, 0, -16, -5],
		[531, 1, 117, 75, 0, -2, -23],
		[439, 175, 116, 72, 0, -1, -24],
		[533, 78, 117, 70, 0, -2, -25],
		[650, 1, 117, 62, 0, -1, -31],
		[557, 150, 118, 59, 0, -1, -39],
		[557, 211, 120, 41, 0, 0, -40],
		[652, 65, 117, 45, 0, -1, -39],
		[679, 112, 74, 118, 0, -26, -1],
		[755, 112, 53, 115, 0, -32, -4]
	];

	imsFrames[13]=[
		[1, 1, 33, 63, 0, -42, -31],
		[36, 1, 72, 63, 0, -23, -32],
		[110, 1, 50, 65, 0, -36, -30],
		[162, 1, 86, 65, 0, -18, -30],
		[250, 1, 86, 65, 0, -17, -30],
		[338, 1, 49, 66, 0, -36, -30],
		[389, 1, 100, 66, 0, -11, -31],
		[1, 66, 86, 67, 0, -19, -29],
		[89, 68, 52, 67, 0, -35, -28],
		[143, 68, 85, 68, 0, -19, -30],
		[230, 68, 86, 68, 0, -17, -29],
		[318, 69, 86, 68, 0, -19, -32],
		[406, 69, 85, 68, 0, -20, -28],
		[1, 135, 86, 68, 0, -18, -31],
		[89, 137, 50, 68, 0, -37, -28],
		[141, 138, 50, 68, 0, -36, -31],
		[193, 138, 50, 68, 0, -37, -28],
		[245, 138, 51, 69, 0, -33, -28],
		[298, 139, 83, 69, 0, -19, -30],
		[383, 139, 47, 69, 0, -37, -30],
		[432, 139, 51, 69, 0, -35, -30]
	];

	imsFrames[14]=[
		[1, 1, 120, 71, 0, 0, -33],
		[123, 1, 118, 96, 0, -1, -11],
		[1, 74, 118, 78, 0, -1, -25],
		[121, 99, 118, 55, 0, -1, -39],
		[1, 154, 117, 79, 0, -1, -24],
		[120, 156, 117, 64, 0, -2, -31],
		[120, 222, 117, 60, 0, -2, -29],
		[1, 235, 116, 102, 0, -2, -10],
		[119, 284, 116, 93, 0, -3, -16],
		[1, 339, 116, 64, 0, -2, -27],
		[119, 379, 115, 111, 0, -3, -6],
		[1, 405, 115, 91, 0, -3, -17],
		[118, 492, 115, 62, 0, -4, -31],
		[1, 498, 114, 108, 0, -2, -6],
		[117, 556, 112, 86, 0, -4, -20],
		[1, 608, 112, 78, 0, -4, -26],
		[115, 644, 108, 110, 0, -6, -8],
		[225, 644, 19, 117, 0, -51, -1],
		[1, 688, 105, 83, 0, -8, -19],
		[108, 756, 104, 118, 0, -10, -1],
		[1, 773, 99, 114, 0, -12, -4],
		[102, 876, 94, 116, 0, -19, -3],
		[1, 889, 91, 113, 0, -16, -4],
		[94, 994, 88, 113, 0, -18, -3],
		[184, 994, 64, 113, 0, -31, -5],
		[1, 1004, 86, 112, 0, -18, -6],
		[1, 1118, 62, 115, 0, -28, -2],
		[89, 1109, 63, 118, 0, -27, -1],
		[154, 1109, 79, 116, 0, -23, -3]
	];

	imsFrames[15]=[
		[1, 1, 116, 66, 0, -3, -29],
		[119, 1, 117, 68, 0, -1, -25],
		[1, 71, 117, 69, 0, -1, -26],
		[120, 71, 120, 70, 0, 0, -25],
		[1, 142, 115, 76, 0, -3, -25],
		[118, 143, 117, 79, 0, -2, -22],
		[1, 220, 99, 94, 0, -10, -13],
		[102, 224, 117, 95, 0, -2, -17],
		[1, 321, 115, 97, 0, -3, -14],
		[118, 321, 117, 99, 0, -2, -13],
		[1, 420, 112, 100, 0, -3, -14],
		[115, 422, 105, 100, 0, -8, -9],
		[1, 524, 114, 102, 0, -3, -10],
		[117, 524, 120, 106, 0, 0, -11],
		[1, 628, 113, 111, 0, -3, -7],
		[116, 632, 113, 111, 0, -4, -5],
		[1, 741, 104, 112, 0, -8, -4],
		[107, 745, 108, 113, 0, -7, -4],
		[1, 855, 84, 114, 0, -22, -3],
		[87, 860, 113, 114, 0, -3, -3],
		[1, 971, 57, 115, 0, -34, -4],
		[60, 976, 94, 114, 0, -13, -3],
		[156, 976, 84, 116, 0, -21, -2],
		[1, 1092, 100, 116, 0, -9, -2],
		[103, 1094, 101, 117, 0, -19, -2],
		[1, 1210, 97, 117, 0, -15, -2],
		[100, 1213, 96, 117, 0, -15, -1],
		[1, 1329, 89, 120, 0, -15, 0],
		[92, 1332, 99, 120, 0, -12, 0]
	];

	imsFrames[16]=[
		[1, 1, 120, 84, 0, 0, -21],
		[123, 1, 90, 85, 0, -15, -19],
		[1, 87, 118, 83, 0, -1, -22],
		[121, 88, 85, 114, 0, -23, -3],
		[1, 172, 116, 65, 0, -2, -28],
		[119, 204, 99, 118, 0, -11, -1],
		[1, 239, 115, 108, 0, -2, -6],
		[118, 324, 100, 107, 0, -11, -8],
		[1, 349, 115, 67, 0, -2, -31],
		[1, 418, 112, 105, 0, -3, -8],
		[115, 433, 103, 107, 0, -7, -8],
		[1, 525, 111, 85, 0, -5, -19],
		[114, 542, 84, 111, 0, -18, -5],
		[1, 612, 111, 71, 0, -5, -24],
		[114, 655, 79, 116, 0, -21, -2],
		[1, 685, 109, 112, 0, -4, -4],
		[112, 773, 106, 81, 0, -7, -21],
		[1, 799, 109, 74, 0, -6, -24],
		[1, 875, 107, 105, 0, -6, -8],
		[110, 875, 108, 104, 0, -5, -10]
	];

	imsFrames[17]=[
		[1, 1, 120, 84, 0, 0, -19],
		[123, 1, 120, 75, 0, 0, -24],
		[123, 78, 120, 59, 0, 0, -35],
		[1, 87, 119, 70, 0, -1, -25],
		[122, 139, 117, 75, 0, -2, -26],
		[1, 159, 116, 86, 0, -3, -17],
		[119, 216, 116, 67, 0, -2, -31],
		[1, 247, 116, 65, 0, -2, -27],
		[119, 285, 114, 73, 0, -2, -25],
		[1, 314, 113, 73, 0, -3, -26],
		[116, 360, 113, 64, 0, -4, -30],
		[1, 389, 112, 69, 0, -5, -26],
		[115, 426, 109, 70, 0, -6, -27],
		[1, 460, 107, 99, 0, -6, -11],
		[110, 498, 99, 110, 0, -13, -6],
		[1, 561, 90, 114, 0, -15, -4],
		[93, 610, 85, 118, 0, -22, -1],
		[180, 610, 65, 119, 0, -26, -1],
		[1, 677, 60, 108, 0, -33, -6]
	];

	imsFrames[18]=[
		[1, 1, 107, 120, 0, -5, 0],
		[1, 123, 92, 119, 0, -15, 0],
		[95, 123, 84, 119, 0, -16, -1],
		[110, 1, 82, 119, 0, -18, 0],
		[181, 122, 65, 119, 0, -27, -1],
		[194, 1, 42, 118, 0, -45, -1],
		[238, 1, 57, 117, 0, -33, -2],
		[248, 120, 108, 116, 0, -8, -3],
		[297, 1, 100, 112, 0, -10, -4],
		[358, 115, 119, 111, 0, -1, -4],
		[399, 1, 105, 107, 0, -9, -6],
		[479, 110, 119, 106, 0, 0, -11],
		[506, 1, 111, 101, 0, -3, -10],
		[600, 104, 110, 95, 0, -9, -13],
		[600, 201, 119, 50, 0, -1, -34],
		[619, 1, 88, 94, 0, -16, -15],
		[709, 1, 99, 92, 0, -14, -15],
		[712, 95, 115, 91, 0, -2, -17],
		[810, 1, 105, 91, 0, -7, -15],
		[721, 188, 117, 61, 0, -2, -28],
		[829, 94, 117, 90, 0, -2, -17],
		[840, 186, 118, 66, 0, -1, -29],
		[917, 1, 118, 89, 0, -1, -16],
		[948, 92, 114, 87, 0, -3, -24],
		[1037, 1, 113, 87, 0, -4, -25],
		[960, 181, 107, 68, 0, -7, -29],
		[1064, 90, 78, 85, 0, -20, -20],
		[1069, 177, 115, 72, 0, -3, -27],
		[1144, 90, 116, 84, 0, -2, -22],
		[1152, 1, 111, 84, 0, -4, -18],
		[1186, 176, 105, 68, 0, -10, -26],
		[1262, 87, 120, 82, 0, 0, -24],
		[1293, 171, 118, 81, 0, 0, -23],
		[1265, 1, 114, 82, 0, -4, -21],
		[1381, 1, 109, 82, 0, -7, -21],
		[1384, 85, 84, 82, 0, -19, -20],
		[1413, 169, 113, 80, 0, -5, -26],
		[1470, 85, 115, 77, 0, -3, -22],
		[1528, 164, 88, 65, 0, -17, -27],
		[1492, 1, 120, 65, 0, 0, -29]
	];

	imsFrames[19]=[
		[1, 1, 116, 76, 0, -3, -23],
		[119, 1, 104, 112, 0, -9, -5],
		[1, 79, 116, 70, 0, -1, -26],
		[119, 115, 100, 110, 0, -13, -6],
		[1, 151, 115, 88, 0, -2, -17],
		[118, 227, 105, 117, 0, -7, -2],
		[1, 241, 114, 97, 0, -4, -12],
		[1, 340, 114, 87, 0, -1, -19],
		[117, 346, 93, 114, 0, -13, -2],
		[1, 429, 114, 66, 0, -3, -31],
		[117, 462, 83, 114, 0, -18, -3],
		[1, 497, 112, 99, 0, -3, -13],
		[115, 578, 108, 112, 0, -7, -5],
		[1, 598, 111, 112, 0, -2, -4],
		[114, 692, 109, 118, 0, -8, -1],
		[1, 712, 111, 40, 0, -6, -41],
		[1, 754, 109, 64, 0, -4, -31],
		[1, 820, 83, 113, 0, -22, -2],
		[86, 820, 83, 113, 0, -23, -4],
		[171, 812, 51, 115, 0, -34, -3]
	];

	imsFrames[20]=[
		[1, 1, 79, 120, 0, -26, 0],
		[1, 123, 108, 116, 0, -6, -3],
		[82, 1, 89, 116, 0, -15, -2],
		[111, 119, 72, 116, 0, -29, -2],
		[173, 1, 89, 115, 0, -17, -3],
		[185, 118, 59, 115, 0, -33, -3],
		[246, 118, 81, 114, 0, -19, -3],
		[264, 1, 116, 110, 0, -2, -3],
		[329, 113, 90, 109, 0, -16, -6],
		[382, 1, 68, 109, 0, -28, -6],
		[421, 112, 109, 108, 0, -7, -6],
		[452, 1, 98, 106, 0, -12, -9],
		[532, 109, 108, 96, 0, -6, -14],
		[532, 207, 115, 45, 0, -3, -38],
		[552, 1, 47, 96, 0, -36, -9],
		[601, 1, 117, 95, 0, -2, -15],
		[642, 98, 116, 92, 0, -2, -16],
		[720, 1, 118, 91, 0, -1, -16],
		[649, 192, 116, 57, 0, -3, -30],
		[760, 94, 112, 65, 0, -5, -31]
	];

	imsFrames[21]=[
		[1, 1, 117, 55, 0, -1, -36],
		[120, 1, 106, 64, 0, -6, -33],
		[228, 1, 109, 64, 0, -6, -31],
		[339, 1, 116, 66, 0, -2, -27],
		[1, 58, 106, 71, 0, -9, -26],
		[109, 67, 99, 72, 0, -12, -26],
		[210, 67, 103, 72, 0, -9, -26],
		[315, 69, 92, 77, 0, -20, -18],
		[409, 69, 78, 78, 0, -21, -21],
		[1, 131, 71, 88, 0, -25, -18],
		[74, 141, 116, 81, 0, -2, -29],
		[192, 141, 109, 86, 0, -5, -14],
		[303, 149, 116, 89, 0, -2, -17],
		[421, 149, 83, 91, 0, -22, -16],
		[1, 224, 109, 90, 0, -5, -13],
		[112, 229, 109, 91, 0, -6, -17],
		[223, 240, 111, 92, 0, -3, -15],
		[336, 242, 112, 96, 0, -4, -12],
		[450, 242, 57, 116, 0, -34, -3],
		[1, 316, 103, 97, 0, -9, -12],
		[106, 322, 113, 97, 0, -3, -13],
		[221, 334, 101, 102, 0, -11, -11],
		[324, 340, 114, 102, 0, -4, -10],
		[440, 360, 65, 106, 0, -32, -6],
		[1, 421, 116, 102, 0, -3, -14],
		[119, 421, 87, 113, 0, -18, -3],
		[208, 438, 107, 111, 0, -7, -4],
		[317, 444, 117, 107, 0, -2, -5]
	];

	imsFrames[22]=[
		[1, 1, 80, 96, 0, -25, -14],
		[83, 1, 35, 81, 0, -43, -18],
		[83, 84, 44, 62, 0, -38, -26],
		[1, 99, 79, 64, 0, -23, -30],
		[82, 148, 45, 63, 0, -41, -29],
		[1, 165, 50, 92, 0, -35, -16],
		[53, 165, 25, 88, 0, -43, -16],
		[80, 213, 47, 65, 0, -37, -27],
		[53, 255, 18, 83, 0, -52, -18],
		[1, 259, 50, 89, 0, -40, -18],
		[73, 280, 51, 87, 0, -35, -17],
		[53, 340, 16, 83, 0, -54, -18],
		[1, 350, 50, 83, 0, -40, -16],
		[71, 369, 51, 83, 0, -35, -17],
		[1, 435, 49, 83, 0, -40, -15],
		[52, 454, 48, 83, 0, -38, -16],
		[1, 520, 48, 64, 0, -39, -29],
		[51, 539, 51, 65, 0, -36, -28],
		[1, 586, 48, 63, 0, -39, -30],
		[51, 606, 58, 57, 0, -32, -32],
		[1, 651, 32, 83, 0, -44, -19],
		[35, 665, 80, 63, 0, -22, -29],
		[35, 730, 52, 63, 0, -36, -27],
		[89, 730, 33, 63, 0, -46, -31],
		[1, 795, 51, 64, 0, -35, -29],
		[54, 795, 51, 63, 0, -37, -30]
	];

	oG.imageVars={getImFrames:getImFramesLoc,getImSeq:getImSeqLoc};
}(opdGame));



(function(oG){//checked
	var fullLim=0;
	var curLim=13;
	var recentArray=[];

	function initLoc(gLim){
		fullLim=gLim;
		curLim=13;
		if(curLim>fullLim){curLim=fullLim;}
		var rLen=8;
		if(rLen>=fullLim)rLen=fullLim-1;
		recentArray=[];
		for(var i=0;i<rLen;i++){
			recentArray.push(-1);
		}
	}

	function deitLoc(){
	}

	function setOutcomeLoc($out,$spd){
		if(!$out){
			curLim++;
			if(curLim>fullLim){curLim=fullLim;}
		}
		var spd=oG.model.speedVar;
		if($spd&&oG.model.gameMode=='fast'){
			spd-=0.08;
		}else{
			spd-=0.04;
		}
		if(spd<0.04)spd=0;
		spd=Math.round(spd*1000)/1000;
		oG.model.speedVar=spd;
	}

	function getItemsLoc(){
		var rVar=setRoundVar();
		pushRecent(rVar);
		var tmpArray=[];
		for(var i=0;i<curLim;i++){
			tmpArray[i]=i;
		}
		opdLib.shuffleArrayForceInitial(tmpArray,rVar);
		return(tmpArray);
	}

	function pushRecent($rVar){
		for(var i=0;i<recentArray.length;i++){
			recentArray[i]=recentArray[i+1];
		}
		recentArray[recentArray.length-1]=$rVar;
	}

	function setRoundVar(){
		var loopVar=20;
		var rVar=0;
		do{
			rVar=Math.floor(Math.random()*curLim);
			loopVar--;
		}while(checkRecent(rVar)&&loopVar>0);
		return rVar;
	}

	function checkRecent($rVar){
		var out=false;
		for(var i in recentArray){
			if(recentArray[i]===$rVar){out=true;}
		}
		return out;
	}

	oG.Modules.Metrics={init:initLoc,deit:deitLoc,setOutcome:setOutcomeLoc,getItems:getItemsLoc};
}(opdGame));


(function(oG){//checked
	function MusicPlayer(){
		this.Container_constructor();
		this.clickerFun=this.clicker.bind(this);
		this.tickerFun=this.ticker.bind(this);
		this.setup();
	}
	var p=createjs.extend(MusicPlayer,createjs.Container);

	p.setup=function(){
		this.musicBut=new createjs.Container();
		var musicButShade=new createjs.Shape();
		musicButShade.graphics.beginFill('#ccc').drawRoundRect(0,0,42,42,4);
		musicButShade.alpha=0.1;
		var musicButBorder=new createjs.Shape();
		musicButBorder.graphics.beginStroke('#333').drawRoundRect(0,0,42,42,4);
		var musicButIcon=new createjs.Sprite(oG.model.mainSpriteSheet);
		musicButIcon.gotoAndStop('musicIcon');
		this.musicButCross=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.musicButCross.gotoAndStop('redCross');

		var musicBorder=new createjs.Shape();
		musicBorder.graphics.beginStroke('#333').drawRoundRect(0,0,42,42,4);

		this.musicBut.addChild(musicButShade);
		this.musicBut.addChild(musicButBorder);
		this.musicBut.addChild(musicButIcon);
		this.musicBut.addChild(this.musicButCross);

		opdLib.dispItem(musicBorder,this,0,0);
		opdLib.dispItem(this.musicBut,this,45,0);

		this.playing=false;
		this.active=true;
		this.musicButCross.visible=false;
		this.musicBut.cursor='pointer';
		this.musicBut.addEventListener('click',this.clickerFun);
		this.addChild(this.musicBut);

		this.mInstance=null;
		this.fadeOutVar=0;
		this.fadeInVar=0;

		this.g=new createjs.Shape();
		this.addChild(this.g);

		this.startVisualizer();
	};

	p.clicker=function(){
		if(this.active==true){
			this.active=false;
			this.musicButCross.visible=true;
			if(this.playing)this.stopPlaying();
		}else{
			this.active=true;
			this.musicButCross.visible=false;
			if(this.playing)this.startPlaying();
		}
	};

	p.play=function(){
		if(this.playing==false){
			this.playing=true;
			if(this.active)this.startPlaying();
		}
	};

	p.stop=function(){
		if(this.playing==true){
			this.playing=false;
			if(this.active)this.stopPlaying();
		}
	};

	p.startPlaying=function(){
		if(oG.model.audOn){
			if(this.mInstance==null){
				this.mInstance=createjs.Sound.play('music_song',{loop:-1});
				this.mInstance.volume=0;
			}
			this.fadeOutVar=0;
			this.fadeInVar=100;
		}
	};

	p.stopPlaying=function(){
		if(oG.model.audOn){
			this.fadeInVar=0;
			this.fadeOutVar=60;
		}
	};

	p.startVisualizer=function(){
		var context=createjs.Sound.activePlugin.context;
		this.aNode=context.createAnalyser();
		this.aNode.connect(context.destination);

		var dynamicsNode=createjs.Sound.activePlugin.dynamicsCompressorNode;
		dynamicsNode.disconnect();
		dynamicsNode.connect(this.aNode);

		this.freqByteData=new Uint8Array(this.aNode.frequencyBinCount);

		createjs.Ticker.addEventListener("tick",this.tickerFun);
	};

	p.ticker=function(){
		this.aNode.getByteFrequencyData(this.freqByteData);
		var bArr=[];
		var i=0;
		for(i=10;i<28;i+=2){
			var tmp=this.freqByteData[i];
			if(tmp>40)tmp/=2;
			tmp/=4;
			if(tmp>32)tmp=32;
			bArr.push(tmp);
		}
		this.g.graphics.clear();
		this.g.graphics.beginFill('#810000');
		for(i=0;i<9;i++){
			this.g.graphics.drawRect(3.5+i*4,39,3,-2-bArr[i]);
		}
		if(this.fadeOutVar&&oG.model.audOn){
			this.fadeOutVar--;
			this.mInstance.volume-=0.02;
			if(this.fadeOutVar==0){
				createjs.Sound.stop(this.mInstance);
				this.mInstance=null;
			}
		}
		if(this.fadeInVar&&oG.model.audOn){
			this.fadeInVar--;
			this.mInstance.volume+=0.01;
		}
	};

	p.playDing=function(){
		if(oG.model.audOn){
			createjs.Sound.play('effects_ding');
		}
	};

	p.init=function(){
	};

	p.deit=function(){
	};
	
	oG.Modules.MusicPlayer=createjs.promote(MusicPlayer,'Container');
}(opdGame));


var opdLib={
	capitalize:function(){
    		return this.charAt(0).toUpperCase()+this.slice(1);
	},
	
	capitalizeFirst:function(inText){
    		return inText.charAt(0).toUpperCase()+inText.slice(1);
	},

	spacedCapitalize:function(inText){
		 return inText.replace(/(?:^|\s)\S/g,function(a){return a.toUpperCase();});
	},

	removeRightClick:function(){
		//$('body').attr('oncontextmenu','return false');
		document.oncontextmenu=function(){return false;};
	},

	getRandomInteger:function(lim){
		return Math.floor(Math.random()*lim);
	},

	shuffleArray:function(array){
		for(i=array.length-1;i>0;i--){
        		j=Math.floor(Math.random()*(i+1));
        		var temp=array[i];
        		array[i]=array[j];
        		array[j]=temp;
    		}
    		return array;
	},

	invertArray:function(array){
		var invArr=[];
		for(i=0;i<array.length;i++){
			invArr[array[i]]=i;
		}
    		return invArr;
	},

	fadeIn:function($item,$time,$delay){
		$item.alpha=0;
		createjs.Tween.get($item,{override:true}).wait($delay).to({alpha:1},$time);
	},

	fadeOut:function($item,$time,$delay){
		createjs.Tween.get($item,{override:true}).wait($delay).to({alpha:0},$time);
	},

	fadeInOut:function($item,$time1,$delay,$time2){
		$item.alpha=0;
		createjs.Tween.removeTweens($item);
		createjs.Tween.get($item,{override:true}).to({alpha:1},$time1).wait($delay).to({alpha:0},$time2);
	},

	fadeInOutDelayed:function($item,$delay1,$time1,$delay2,$time2){
		$item.alpha=0;
		createjs.Tween.removeTweens($item);
		createjs.Tween.get($item,{override:true}).wait($delay1).to({alpha:1},$time1).wait($delay2).to({alpha:0},$time2);
	},

	arraySameCheck:function(array1,array2){
		var out=true;
		if(array1.length!=array2.length)out=false;
		for(var i=0;i<array1.length;i++){
			if(array1[i]!=array2[i])out=false;
		}
		return out;
	},

	shuffleArrayDifferent:function(array){
		var newArr=[];
		for(var i=0;i<array.length;i++)newArr[i]=array[i];
		do{
			newArr=opdLib.shuffleArray(newArr);
		}while(opdLib.arraySameCheck(newArr,array));
    		return newArr;
	},

	shuffleArrayForceInitial:function(array,initial){
	    	for(var i=array.length-1;i>0;i--){
			var j=Math.floor(Math.random() * (i + 1));
			var temp=array[i];
			array[i]=array[j];
			array[j]=temp;
	    	}
		var pos=0;
		for(i=0;i<array.length;i++){
			if(array[i]===initial){pos=i;}
		}
		var tmp=array[0];
		array[0]=array[pos];
		array[pos]=tmp;
	    	return array;
	},

	shuffleArrayKeepInitial:function(array,initial){
		initial--;
	    	for(var i=array.length-1;i>initial;i--){
			var j=Math.ceil(Math.random()*(i-initial))+initial;
			var temp=array[i];
			array[i]=array[j];
			array[j]=temp;
	    	}
	    	return array;
	},

	shuffleArrayForceFinal:function(array,final){
		var pos=0;
		var i=0;
	    	for(i=array.length-1;i>0;i--){
			var j=Math.floor(Math.random()*(i+1));
			var temp=array[i];
			array[i]=array[j];
			array[j]=temp;
	    	}
		for(i=0;i<array.length;i++){
			if(array[i]===final){pos=i;}
		}
		var tmp=array[array.length-1];
		array[array.length-1]=array[pos];
		array[pos]=tmp;
	    	return array;
	},

	doesArrayContain:function(item,array){
		for(var i=0;i<array.length;i++){
			if(item==array[i])return true;
		}
		return false;
	},

	drawArrow:function(size,color){
		var outShape=new createjs.Shape();
		outShape.graphics.beginFill(color);
		outShape.graphics.arc(0,0,size*0.56,-1,1);
		outShape.graphics.arc(-size,size,size*0.40,1,Math.PI);
		outShape.graphics.arc(-size,-size,size*0.40,Math.PI,-1);
		outShape.graphics.closePath();
		return outShape;
	},

	scaleImage:function(im,maxLen){
		var myRatio=0;
		if(im.image.width>im.image.height){
			myRatio=maxLen/im.image.width;
		}else{
			myRatio=maxLen/im.image.height;
		}
		im.scaleX=myRatio;
		im.scaleY=myRatio;
		im.x=(maxLen-(im.image.width*myRatio))/2;
		im.y=(maxLen-(im.image.height*myRatio))/2;
	},

	dispItem:function($item,$tar,$x,$y){
		$tar.addChild($item);
		$item.x=$x;
		$item.y=$y;
	},

	posItem:function($item,$x,$y){
		$item.x=$x;
		$item.y=$y;
	},

	centerText:function($txt){
		$txt.textBaseline='center';
		$txt.textAlign='center';
	},

	centerItemFromWidth:function($item,$width){
		$item.x=$width/2-$item.image.width/2;
	},

	makeRectangle:function($wid,$hei,$rnd,$col){
		var shape=new createjs.Shape();
		shape.graphics.beginFill($col);
		shape.graphics.drawRoundRect(-$wid/2,-$hei/2,$wid,$hei,$rnd);
		return shape;
	},

	getArrayPosition:function(gArr,gPos){
		var pos=0;
		for(var i=0;i<gArr.length;i++){
			if(gArr[i]===gPos)pos=i;
		}
		return pos;
	}
};

(function(oL){
	oL.timer=function($callback){
		var timeout, started, remaining, callback=$callback, running=false;

		this.start=function($delay){	
			if(running){
				clearTimeout(timeout);
			}
			running=true;
			remaining=$delay;
			timeout=setTimeout(localFunction,remaining);
			started=new Date();
		};

		this.pause=function(){
			if(running){
				clearTimeout(timeout);
				remaining-=new Date()-started;
			}
		};

		this.unpause=function(){
			if(running){
				timeout=setTimeout(localFunction,remaining);
				started=new Date();
			}
		};

		this.clear=function(){		
			if(running){
				clearTimeout(timeout);
				running=false;
			}
		};

		function localFunction(){
			running=false;
			$callback();
		}
	};
}(opdLib));



opdWrapper=(function(){
	var locked=false;
	var orientation=0;
	var aspectRatio=0;
	var canvasRatio=1;
	var orientationChangeCallback=function(){};
	var resizeCallback=function(){};
	var winHei=0;
	var winWid=0;
	var waiting=false;
	var scrollWaiting=false;
	var fullScreen=false;

	var doc=null;
	var docEl=null;
	var cancelFullScreen=null;
	var requestFullScreen=null;

	var waitingTimeout=null;
	var scrollTimeout=null;

	var myCanvas=null;
	var myContainer=null;

	var dimension1=800;
	var dimension2=550;

	var fixedLand=false;

	function makeStageLoc(){
		var stage=new createjs.Stage(myCanvas);
		createjs.Sound.initializeDefaultPlugins();
		stage.enableMouseOver(10);
		stage.snapToPixelEnabled=true;
		stage.mouseMoveOutside=true;
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick",stage);
		return stage;
	}

	function fixOrientationLoc(orien){
		if(orien=='land')fixedLand=true;
	}

	function setupLoc(myCan,myCont){
		myCanvas=myCan;
		myContainer=myCont;
		doc=window.document;
		docEl=document.getElementById(myCanvas);
		cancelFullScreen=doc.exitFullscreen||doc.mozCancelFullScreen||doc.webkitExitFullscreen||doc.msExitFullscreen;
		requestFullScreen=docEl.requestFullscreen||docEl.mozRequestFullScreen||docEl.webkitRequestFullScreen||docEl.msRequestFullscreen;

		setWinDimensions();
		setCanvasOrientation();
		stretchCanvas();
		window.addEventListener('resize',windowResize);

		document.addEventListener('webkitfullscreenchange',changeHandler,false);
		document.addEventListener('mozfullscreenchange',changeHandler,false);
		document.addEventListener('fullscreenchange',changeHandler,false);
		document.addEventListener('MSFullscreenChange',changeHandler,false);

		//setTimeout(function winScroll(){window.scrollTo(0,document.getElementById("myCanvas").offsetTop);},100);
	}

	function alterDimensionsLoc(dim1,dim2){
		dimension1=dim1;
		dimension2=dim2;
		setWinDimensions();
		setCanvasOrientation();
		stretchCanvas();
	}

	function windowScroll(){
		if(!scrollWaiting){
			scrollWaiting=true;
			scrollTimeout=setTimeout(winScroll,700);
		}
	}

	function winScroll(){
		var pageY=window.pageYOffset;
		var rect=document.getElementById(myCanvas).getBoundingClientRect();
		var canY=rect.top+pageY;
		var canMinY=canY-40;
		var canMaxY=canY+40;
		if(pageY<canMaxY&&pageY>canMinY)window.scrollTo(0,canY);
		scrollWaiting=false;
	}

	function setWinDimensions(){
		winHei=window.innerHeight;
		winWid=document.getElementById(myContainer).clientWidth;
		orientation=winWid>winHei?0:1;
		if(fixedLand)orientation=0;
	}

	function setCanvasOrientation(){
		var leCan=document.getElementById(myCanvas);
		if(orientation===0){
			leCan.width=dimension1;
			leCan.height=dimension2;
			aspectRatio=dimension1/dimension2;
		}else{
			leCan.width=dimension2;
			leCan.height=dimension1;
			aspectRatio=dimension2/dimension1;
		}
	}

	function stretchCanvas(){
		var wid,hei=0;
		if(winWid/winHei>aspectRatio){
			hei=winHei;
			wid=hei*aspectRatio;
			window.addEventListener('scroll',windowScroll);
			windowScroll();
		}else{
			wid=winWid;
			hei=wid/aspectRatio;
			window.removeEventListener('scroll',windowScroll);
		}
		if(orientation===0){
			canvasRatio=wid/dimension1;
		}else{
			canvasRatio=wid/dimension2;
		}
		if(!fullScreen){
			document.getElementById(myCanvas).style.width=wid+'px';
			document.getElementById(myCanvas).style.height=hei+'px';
		}else{
//only do this if dimens are near enough - maybe
			document.getElementById(myCanvas).style.width=winWid+'px';
			document.getElementById(myCanvas).style.height=winHei+'px';
		}
	}

	function windowResize(){
		if(!waiting){
			waiting=true;
			waitingTimeout=setTimeout(winResize,500);
		}
	}

	function winResize(){
		if(!locked){
			var ori=orientation;
			setWinDimensions();
			if(orientation!==ori){
				setCanvasOrientation();
				stretchCanvas();
				orientationChangeCallback();
			}else{
				stretchCanvas();
			}
		}
		resizeCallback();
		waiting=false;
	}

	function lockLoc(){
		locked=true;
	}

	function unlockLoc(){
		locked=false;
		setTimeout(windowResize,150);
	}

	function toggleFullLoc(){
		if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl);
		}else{
			cancelFullScreen.call(doc);
		}
	}

	function changeHandler(){
		if (doc.fullscreenElement||document.webkitIsFullScreen||document.mozFullScreen||document.msFullscreenElement){
			fullScreen=true;
		}else{
			fullScreen=false;
		}
		scrollWaiting=false;
		clearTimeout(scrollTimeout);
		waiting=true;
		clearTimeout(waitingTimeout);
		waitingTimeout=setTimeout(winResize,300);
	}

	function setOrientationCallbackLoc($callBack){orientationChangeCallback=$callBack;}

	function setResizeCallbackLoc($callBack){resizeCallback=$callBack;}

	function getCanvasRatioLoc(){return canvasRatio;}

	function getOrientationLoc(){return orientation;}

	return{
		setup:setupLoc,
		getCanvasRatio:getCanvasRatioLoc,
		getOrientation:getOrientationLoc,
		setOrientationCallback:setOrientationCallbackLoc,
		setResizeCallback:setResizeCallbackLoc,
		lock:lockLoc,
		unlock:unlockLoc,
		toggleFull:toggleFullLoc,
		makeStage:makeStageLoc,
		alterDimensions:alterDimensionsLoc,
		fixOrientation:fixOrientationLoc
	};
}());



(function(oG){

	function OptionPair($callback){
		this.Container_constructor();
		this.callback=$callback;
		this.tickClickFun=this.tickClick.bind(this);
		this.crossClickFun=this.crossClick.bind(this);
		this.setup();
	}

	var p=createjs.extend(OptionPair,createjs.Container);

	p.setup=function(){
		this.tick=new createjs.Container();
		this.cross=new createjs.Container();
		var tickBack=new createjs.Shape();
		var crossBack=new createjs.Shape();

		var crossIm=new createjs.Sprite(oG.model.mainSpriteSheet);
		crossIm.gotoAndStop('crossId');
		var tickIm=new createjs.Sprite(oG.model.mainSpriteSheet);
		tickIm.gotoAndStop('tickId');

		//var crossIm=new createjs.Bitmap(oG.mainLoader.getResult('crossId'));
		//var tickIm=new createjs.Bitmap(oG.mainLoader.getResult('tickId'));

		tickBack.graphics.beginFill('#FFF3A5').beginStroke('#ccc').drawCircle(0,0,46);
		this.tick.cursor='pointer';
		crossBack.graphics.beginFill('#FFF3A5').beginStroke('#ccc').drawCircle(0,0,46);
		this.cross.cursor='pointer';

		this.tick.addChild(tickBack);
		this.cross.addChild(crossBack);
		opdLib.dispItem(this.cross,this,120,30);
		opdLib.dispItem(this.tick,this,20,30);
		opdLib.dispItem(crossIm,this.cross,-29,-29);
		opdLib.dispItem(tickIm,this.tick,-30,-28);
	};

	p.init=function($bool){
		this.tick.addEventListener('click',this.tickClickFun);
		this.cross.addEventListener('click',this.crossClickFun);
		bitsUpdate(this,$bool);
	};

	p.deit=function(){
		this.tick.removeEventListener('click',this.tickClickFun);
		this.cross.removeEventListener('click',this.crossClickFun);
	};

	p.tickClick=function(event){
		this.callback(true);
		bitsUpdate(this,true);
	};

	p.crossClick=function(event){
		this.callback(false);
		bitsUpdate(this,false);
	};

	function bitsUpdate($this,$bool){
		if($bool==true){
			$this.tick.alpha=1;
			$this.cross.alpha=0.2;
		}else{
			$this.tick.alpha=0.2;
			$this.cross.alpha=1;
		}
	}

	oG.Modules.OptionPair=createjs.promote(OptionPair,'Container');
}(opdGame));


(function(oG){
	var myLoadQueue=null;
	var tryTimes=10;
	var aSpriteData=[];
	aSpriteData[0]={id:'music_song',startTime:0,duration:48000};
	aSpriteData[1]={id:'effects_ding',startTime:48000,duration:600};

	function initLoc(){
		createjs.Sound.alternateExtensions=["mp3"];
		load();
	}

	function load(){
		var myManifest=[];
		myManifest.push({src:oG.model.mainSpriteSrc,id:'allSprite'});
		if(oG.model.audOn===true)myManifest.push({src:'audioSprite.ogg',data:{audioSprite:aSpriteData}});

		myLoadQueue=new createjs.LoadQueue(false);
		myLoadQueue.installPlugin(createjs.Sound);
		myLoadQueue.addEventListener('complete',setupSpriteSheet);
		myLoadQueue.addEventListener('error',gotError);
		myLoadQueue.loadManifest(myManifest,true,oG.model.resFolder);
	}

	function gotError(){
		console.log('Load Error - retrying');
		myLoadQueue.removeEventListener('complete',setupSpriteSheet);
		myLoadQueue.removeEventListener('error',gotError);
		myLoadQueue.destroy();
		myLoadQueue=null;
		
		tryTimes--;
		if(tryTimes>0){
			load();
		}else{
			oG.view.preloadView.preloadError();
		}
	}

	function setupSpriteSheet(event){
		var mySheet=new createjs.SpriteSheet(
{
"images":[myLoadQueue.getResult('allSprite')],
"frames":[[955,1,60,60,0,0,0],[955,63,60,60,0,0,0],[1,1,800,550,0,0,0],[955,125,60,60,0,0,0],[803,153,84,84,0,-8,-8],[803,239,84,84,0,-8,-8],[803,325,84,84,0,-8,-8],[929,330,84,84,0,-8,-8],[803,411,84,84,0,-8,-8],[889,416,84,84,0,-8,-8],[1,845,452,84,0,-8,-8],[455,553,452,84,0,-8,-8],[455,840,360,84,0,-8,-8],[588,724,360,84,0,-8,-8],[1,931,505,34,0,0,0],[508,926,498,26,0,0,0],[950,249,54,53,0,-3,-4],[289,639,414,83,0,-8,-9],[705,688,169,34,0,-5,-3],[803,1,150,150,0,0,0],[864,502,92,37,0,-2,-6],[889,305,38,31,0,-1,-6],[889,338,34,34,0,-4,-4],[889,153,60,60,0,0,0],[289,724,297,114,0,-12,-24],[1,553,286,290,0,0,0],[803,522,56,24,0,-17,-4],[889,277,54,26,0,-18,-4],[958,502,47,24,0,-21,-4],[951,187,60,60,0,0,0],[975,416,41,23,0,-24,-5],[803,497,59,23,0,-16,-4],[945,304,63,24,0,-14,-4],[958,528,43,24,0,-24,-4],[889,215,59,60,0,0,0],[705,639,254,47,0,-11,-12]],

"animations":{"audButId":[0],"autoButId":[1],"back":[2],"backBut":[3],"contentBit0":[4],"contentBit1":[5],"contentBit2":[6],"contentBit3":[7],"contentBit4":[8],"contentBit5":[9],"contentBit6":[10],"contentBit7":[11],"contentBit8":[12],"contentBit9":[13],"countdownBackId":[14],"countdownFrontId":[15],"crossId":[16],"dispBoxId":[17],"gameOverTextId":[18],"itemId":[19],"miniTitle2":[20],"musicIcon":[21],"redCross":[22],"settingsButId":[23],"spanTitle":[24],"starId":[25],"textAbout":[26],"textAgain":[27],"textBack":[28],"textButId":[29],"textFast":[30],"textGames":[31],"textReview":[32],"textSlow":[33],"tickId":[34],"youWinTextId":[35]}
});
	
		myLoadQueue.removeEventListener('complete',setupSpriteSheet);
		myLoadQueue.removeEventListener('error',gotError);
		myLoadQueue.destroy();
		myLoadQueue=null;

		oG.model.mainSpriteSheet=mySheet;
		oG.controller.preloadComplete();
	}

	function deitLoc(){
	}

	oG.preloader={init:initLoc,deit:deitLoc};
}(opdGame));


(function(oG){//checked
	function PreloadView(){
		this.Container_constructor();
		this.loadLineFun=this.loadLine.bind(this);
		this.setup();
	}
	var p=createjs.extend(PreloadView,createjs.Container);

	p.setup=function(){
		var preLoaderImage=new Image();
		preLoaderImage.src=oG.model.preLoaderImageSrc;
		this.preloaderIm=new createjs.Bitmap(preLoaderImage);
		this.preloadBits=[];
		for(var i=0;i<8;i++){
			this.preloadBits[i]=opdLib.makeRectangle(26,26,8,'#9F291F');
			this.addChild(this.preloadBits[i]);
			this.preloadBits[i].visible=false;
		}
		this.addChild(this.preloaderIm);
		this.setupDisplay();
	};

	p.setupDisplay=function(){
		var i=0;
		if(oG.model.orientation===0){
			for(i=0;i<8;i++){
				opdLib.posItem(this.preloadBits[i],308+i*28,315);
			}
			opdLib.posItem(this.preloaderIm,285,185);
		}else{
			for(i=0;i<8;i++){
				opdLib.posItem(this.preloadBits[i],183+i*28,425);
			}
			opdLib.posItem(this.preloaderIm,160,295);
		}
	};

	p.orientationChange=function(){
		this.setupDisplay();
	};

	p.preloadError=function(){
		createjs.Ticker.removeEventListener('tick',this.loadLineFun);
		this.preloadText=new createjs.Text("Error - can't load",'bold 16px Arial','#555');
		opdLib.centerText(this.preloadText);
		opdLib.dispItem(this.preloadText,this,400,320);
		for(var i=0;i<8;i++){
			this.preloadBits[i].graphics.clear();
			this.preloadBits[i].visible=true;
		}
	};

	p.init=function(){
		this.loadLineVar=0;
		createjs.Ticker.addEventListener('tick',this.loadLineFun);
		oG.preloader.init();
	};

	p.loadLine=function(event){
		this.loadLineVar++;
		if(this.loadLineVar>28)this.loadLineVar=0;

		var bitVar=Math.floor(this.loadLineVar/2);
		for(var i=0;i<8;i++){
			if(bitVar<i){
				this.preloadBits[i].visible=false;
			}else{
				this.preloadBits[i].visible=true;
			}
		}
	};

	p.deit=function(){
		createjs.Ticker.removeEventListener('tick',this.loadLineFun);
		oG.preloader.deit();
	};

	oG.Views.PreloadView=createjs.promote(PreloadView,'Container');
}(opdGame));


(function(oG){//checked
	function ReviewView(){
		this.Container_constructor();
		this.playTextFun=this.playText.bind(this);
		this.playAudioFun=this.playAudio.bind(this);
		this.autoPlayFun=this.autoPlay.bind(this);
		this.leftClickFun=this.leftClick.bind(this);
		this.rightClickFun=this.rightClick.bind(this);
		this.audioButClickFun=this.audioButClick.bind(this);
		this.textButClickFun=this.textButClick.bind(this);
		this.settingsClickFun=this.settingsClick.bind(this);
		this.setup();
	}
	var p=createjs.extend(ReviewView,createjs.Container);

	p.setup=function(){
		this.showTextDelay=new opdLib.timer(this.playTextFun);
		this.showAudioDelay=new opdLib.timer(this.playAudioFun);
		this.autoPlayDelay=new opdLib.timer(this.autoPlayFun);

		this.mainPane=new createjs.Container();

		this.backBut=new oG.Modules.Button('textBack','title',90);

		this.audioBut=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.audioBut.gotoAndStop('audButId');
		this.textBut=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.textBut.gotoAndStop('textButId');
		this.settingsBut=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.settingsBut.gotoAndStop('settingsButId');

		this.settingsPane=new oG.Modules.SettingsReviewPane();
		this.textPane=new oG.Modules.TextPane('#555',32,0);
		this.textPane.backPane.visible=false;
		this.textPane.dispText.maxWidth=250;
		
		this.mySprite=null;
		this.reviewVar=0;
		
		this.leftArrow=opdLib.drawArrow(50,'#ff8');
		this.rightArrow=opdLib.drawArrow(50,'#ff8');
		this.mySpriteContainer=new createjs.Container();

		this.myPane=new createjs.Shape();
		this.myPaneBack=new createjs.Shape();

		this.audioBut.cursor='pointer';
		this.textBut.cursor='pointer';
		this.settingsBut.cursor='pointer';

		this.leftArrow.rotation=180;

		this.myPaneBack.graphics.beginFill('#ffc').drawRoundRect(-140,-140,280,280,24);
		this.myPane.graphics.beginFill('#fff').drawRoundRect(-131,-131,262,262,20);

		this.mainPane.addChild(this.myPaneBack,this.myPane,this.textPane,this.mySpriteContainer);
		this.addChild(this.audioBut,this.textBut,this.settingsBut,this.leftArrow,this.rightArrow,this.backBut);
		this.addChild(this.mainPane);

		opdLib.posItem(this.textPane,-215,47);
		opdLib.posItem(this.mySpriteContainer,-90,-100);

		this.mainPane.x=400;
		this.mainPane.y=255;

		this.settingsPane.visible=false;
		this.addChild(this.settingsPane);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			opdLib.posItem(this.audioBut,339,415);
			opdLib.posItem(this.textBut,401,415);
			opdLib.posItem(this.settingsBut,730,480);
			opdLib.posItem(this.leftArrow,130,250);
			opdLib.posItem(this.rightArrow,670,250);
			opdLib.posItem(this.backBut,70,520);
			opdLib.posItem(this.mainPane,400,255);
		}else{
			opdLib.posItem(this.audioBut,214,445);
			opdLib.posItem(this.textBut,276,445);
			opdLib.posItem(this.settingsBut,480,730);
			opdLib.posItem(this.leftArrow,200,600);
			opdLib.posItem(this.rightArrow,350,600);
			opdLib.posItem(this.backBut,74,770);
			opdLib.posItem(this.mainPane,275,280);
		}
	};

	p.orientationChange=function(){
		this.setupDisplay();
		this.settingsPane.setupDisplay();
	};

	p.showItem=function(){
		this.stopAudio();
		if(!oG.model.useUserImages){
			this.mySprite.gotoAndStop(this.reviewVar);
		}else{
			if(this.myImVar!=-1){
				this.mySpriteContainer.removeChild(oG.model.userImageArray[this.myImVar]);
			}
			this.myImVar=this.reviewVar;
			this.mySpriteContainer.addChild(oG.model.userImageArray[this.reviewVar]);
			this.visible=true;
		}

		if(oG.model.showReviewAudio){this.showAudioDelay.start(oG.model.reviewAudioDelay.val*1000);}
		if(oG.model.showReviewText){this.showTextDelay.start(oG.model.reviewTextDelay.val*1000);}
		if(oG.model.autoReview){this.autoPlayDelay.start(oG.model.reviewAutoDelay.val*1000);}
		this.textPane.clearText();
	};

	p.playText=function(event){
		this.textPane.setText(oG.model.textArray[this.reviewVar]);
	};

	p.playAudio=function(event){
		if(oG.model.useUserAudio){
			this.stopAudio();
			this.soundPlayVar=this.reviewVar;
			if(oG.model.userAudioArray[this.reviewVar]!=null){
				oG.model.userAudioArray[this.reviewVar].play();
			}
		}else{
			createjs.Sound.stop();
			if(oG.model.audioLoaded)createjs.Sound.play('s_'+this.reviewVar);
		}
	};

	p.stopAudio=function(){
		createjs.Sound.stop();
		if(this.soundPlayVar!=-1){
			if(oG.model.userAudioArray[this.soundPlayVar]!=null){
				oG.model.userAudioArray[this.soundPlayVar].pause();
				oG.model.userAudioArray[this.soundPlayVar].currentTime=0;
			}
		}
	};

	p.autoPlay=function(event){
		this.reviewVar++;
		if(this.reviewVar>=oG.model.contentLim){this.reviewVar=0;}
		this.showItem();
	};

	p.autoPlayCheck=function(){
		if(oG.model.autoReview){this.autoPlayDelay.start(oG.model.reviewAutoDelay.val*1000);}
	};

	p.checkAudioLoaded=function(){
		if(oG.model.audioLoaded){
			this.audioBut.visible=true;
		}else{
			this.audioBut.visible=false;
		}
	};

	p.textButClick=function(){
		this.showTextDelay.clear();
		this.playText();
	};

	p.audioButClick=function(){
		this.showAudioDelay.clear();
		this.playAudio();
	};

	p.addArrowLists=function(){
		this.leftArrow.addEventListener('click',this.leftClickFun);
		this.rightArrow.addEventListener('click',this.rightClickFun);
		this.leftArrow.cursor='pointer';
		this.rightArrow.cursor='pointer';
		this.audioBut.addEventListener('click',this.audioButClickFun);
		this.textBut.addEventListener('click',this.textButClickFun);
	};

	p.removeArrowLists=function(){
		this.leftArrow.removeEventListener('click',this.leftClickFun);
		this.rightArrow.removeEventListener('click',this.rightClickFun);
		this.leftArrow.cursor='default';
		this.rightArrow.cursor='default';
		this.audioBut.removeEventListener('click',this.audioButClickFun);
		this.textBut.removeEventListener('click',this.textButClickFun);
	};

	p.leftClick=function(event){
		this.reviewVar--;
		if(this.reviewVar<0){this.reviewVar=oG.model.contentLim-1;}
		this.showItem();
	};

	p.rightClick=function(event){
		this.reviewVar++;
		if(this.reviewVar>=oG.model.contentLim){this.reviewVar=0;}
		this.showItem();
	};

	p.settingsClick=function(event){
		if(this.settingsPane.visible){
			this.settingsPane.visible=false;
			this.settingsPane.deit();
			this.settingsPane.exitBut.removeEventListener('click',this.settingsClickFun);
			this.settingsPane.fullBack.removeEventListener('click',this.settingsClickFun);
			this.showTextDelay.unpause();
			this.showAudioDelay.unpause();
			this.autoPlayDelay.unpause();
			this.autoPlayCheck();
			if(!oG.model.showReviewText)this.textPane.clearText();
		}else{
			this.settingsPane.visible=true;
			this.settingsPane.init();
			this.settingsPane.exitBut.addEventListener('click',this.settingsClickFun);
			this.settingsPane.fullBack.addEventListener('click',this.settingsClickFun);
			this.showTextDelay.pause();
			this.showAudioDelay.pause();
			this.autoPlayDelay.pause();
		}
	};

	p.init=function(){
		this.checkAudioLoaded();
		this.reviewVar=0;
		this.myImVar=-1;
		this.soundPlayVar=-1;
		this.backBut.addLists();
		if(!oG.model.useUserImages){
			this.mySprite=new createjs.Sprite(oG.model.contentSpriteSheet);
			this.mySprite.scaleY=this.mySprite.scaleX=1.5;
			opdLib.dispItem(this.mySprite,this.mySpriteContainer,0,0);
		}else{
			for(i=0;i<oG.model.userImageArray.length;i++){
				opdLib.scaleImage(oG.model.userImageArray[i],180);
			}
		}
		this.showItem();
		this.addArrowLists();
		this.settingsBut.addEventListener('click',this.settingsClickFun);
		this.autoPlayCheck();
		this.textPane.init();
		this.textPane.clearText();

		opdLib.fadeIn(this.myPaneBack,300,600);
		opdLib.fadeIn(this.myPane,300,600);
		opdLib.fadeIn(this.leftArrow,300,600);
		opdLib.fadeIn(this.rightArrow,300,600);
		opdLib.fadeIn(this.mySpriteContainer,300,600);
		opdLib.fadeIn(this.textPane,300,600);
		opdLib.fadeIn(this.audioBut,300,600);
		opdLib.fadeIn(this.textBut,300,600);
		opdLib.fadeIn(this.settingsBut,500,300);
		opdLib.fadeIn(this.backBut,500,300);
	};

	p.deit=function(){
		this.stopAudio();
		this.backBut.removeLists();
		if(!oG.model.useUserImages){
			this.mySpriteContainer.removeChild(this.mySprite);
			this.mySprite=null;
		}else{
			if(this.myImVar!=-1){
				this.mySpriteContainer.removeChild(oG.model.userImageArray[this.myImVar]);
			}
		}
		this.removeArrowLists();
		this.settingsBut.removeEventListener('click',this.settingsClickFun);
		this.showAudioDelay.clear();
		this.showTextDelay.clear();
		this.autoPlayDelay.clear();
		this.textPane.deit();
	};

	oG.Views.ReviewView=createjs.promote(ReviewView,'Container');
}(opdGame));


(function(oG){//checked
	function ScoreBox(){
		this.Container_constructor();
		this.setup();
	}
	var p=createjs.extend(ScoreBox,createjs.Container);

	p.setup=function(){
		this.myScore=0;
		this.scorePane=new createjs.Shape();
		this.scoreLabel=new createjs.Text('Score', 'bold 22px Reem Kufi', '#333');
		this.scoreText=new createjs.Text('', 'bold 22px Reem Kufi', '#333');
		this.upText=new createjs.Text('+50','bold 24px Reem Kufi','#FAE32F');

		this.hitStar=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.hitStar.gotoAndStop('starId');

		this.scorePane.alpha=0.8;
		this.upText.visible=false;
		this.upText.cache(-40,-40,80,40);
		this.hitStar.visible=false;
		opdLib.centerText(this.scoreLabel);
		opdLib.centerText(this.scoreText);
		opdLib.centerText(this.upText);
		this.addChild(this.scorePane);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		this.scorePane.graphics.clear();
		if(oG.model.orientation===0){
			this.scorePane.graphics.beginFill('#fff').drawRoundRect(0,0,100,68,8);
			opdLib.dispItem(this.upText,this,45,6);
			opdLib.dispItem(this.hitStar,this,-70,-76);
			opdLib.dispItem(this.scoreLabel,this,50,30);
			opdLib.dispItem(this.scoreText,this,50,58);
			this.hitStar.scaleX=0.8;
			this.hitStar.scaleY=0.8;
			this.x=680;
			this.y=466;
		}else{
			this.scorePane.graphics.beginFill('#fff').drawRoundRect(0,0,190,42,8);
			opdLib.dispItem(this.upText,this,145,6);
			opdLib.dispItem(this.hitStar,this,54,-66);
			opdLib.dispItem(this.scoreLabel,this,50,30);
			opdLib.dispItem(this.scoreText,this,145,30);
			this.hitStar.scaleX=0.6;
			this.hitStar.scaleY=0.6;
			this.x=180;
			this.y=744;
		}
	};

	p.setScore=function($scr){
		this.myScore=$scr;
		this.scoreText.text=this.myScore;
	};

	p.addScore=function($add){//hide this?
		this.myScore+=$add;
		this.scoreText.text=this.myScore;
	};

	p.showUpText=function(){
		if(createjs.Tween.hasActiveTweens(this.upText)){createjs.Tween.removeTweens(this.upText);}
		this.upText.visible=true;
		this.upText.alpha=1;
		this.upText.y=6;
		createjs.Tween.get(this.upText,{loop:false}).wait(250).to({alpha:0,y:-36},800);
		this.upText.updateCache();
	};

	p.showStreak=function($str){
		if($str>5){
			this.addScore(100);
			this.upText.text='+100';
			this.hitStar.visible=true;
			this.hitStar.alpha=0.8;
			if(createjs.Tween.hasActiveTweens(this.hitStar)){createjs.Tween.removeTweens(this.hitStar);}
			createjs.Tween.get(this.hitStar,{loop:false}).wait(150).to({alpha:0},300);
		}else{
			this.addScore(50);
			this.upText.text='+50';
		}
		this.showUpText();
	};

	p.init=function(){
	};

	p.deit=function(){
		if(createjs.Tween.hasActiveTweens(this.upText)){createjs.Tween.removeTweens(this.upText);}
		if(createjs.Tween.hasActiveTweens(this.hitStar)){createjs.Tween.removeTweens(this.hitStar);}
	};
	
	oG.Modules.ScoreBox=createjs.promote(ScoreBox,'Container');
}(opdGame));


(function(oG){//checked
	function ScorePane(){
		this.Container_constructor();
		this.submitClickFun=this.submitClick.bind(this);
		this.showFieldsFun=this.showFields.bind(this);
		this.keyPressFun=this.keyPress.bind(this);
		this.showFieldsTimeout=null;
		this.setup();
	}

	var p=createjs.extend(ScorePane,createjs.Container);
	var paneBord=8;

	p.setup=function(){
		this.fontOne='bold 16px Arial';
		this.fontOneColor='#333';
		this.fontTwo='bold 18px Arial';
		this.fontTwoColor='#444';
		this.paneLength='short';
		this.scoreLabelText1='Score';
		this.scoreLabelText2='Time';
		this.paneBorderColor='#666';
	};

	p.initialSetup=function(){
		this.inputActive=false;
		this.submitCallback=function(){};
		this.myCan=document.getElementById('myCanvas');
		this.entryPaneContainer=new createjs.Container();
		this.scoreDispContainer=new createjs.Container();

		this.submitBut=new createjs.Container();
		this.submitButBack=new createjs.Shape();
		this.scoreDisp1=new createjs.Text('0',this.fontOne,this.fontOneColor);
		this.scoreDisp2=new createjs.Text('0',this.fontOne,this.fontOneColor);

		this.entryPaneBack=new createjs.Shape();
		this.entryPane=new createjs.Shape();
		this.scoreDispPaneBack=new createjs.Shape();
		this.scoreDispPane=new createjs.Shape();

		this.submitText=new createjs.Text('Submit',this.fontTwo,this.fontTwoColor);
		this.nameLabel=new createjs.Text('Name',this.fontOne,this.fontOneColor);
		this.localLabel=new createjs.Text('Location',this.fontOne,this.fontOneColor);
		this.scoreLabel1=new createjs.Text(this.scoreLabelText1,this.fontOne,this.fontOneColor);
		this.scoreLabel2=new createjs.Text(this.scoreLabelText2,this.fontOne,this.fontOneColor);

		this.entryPaneContainer.addChild(this.entryPaneBack,this.entryPane);
		this.scoreDispContainer.addChild(this.scoreDispPaneBack,this.scoreDispPane);

		opdLib.centerText(this.submitText);
		opdLib.centerText(this.nameLabel);
		opdLib.centerText(this.localLabel);
		opdLib.centerText(this.scoreLabel1);
		opdLib.centerText(this.scoreLabel2);
		opdLib.centerText(this.scoreDisp1);
		opdLib.centerText(this.scoreDisp2);

		this.submitBut.cursor='pointer';
		this.submitButBack.graphics.beginFill('#ff8').drawRoundRect(-50,-20,100,40,12);
		opdLib.dispItem(this.submitButBack,this.submitBut,0,0);
		opdLib.dispItem(this.submitText,this.submitBut,0,8);

		this.entryPaneContainer.addChild(this.submitBut,this.nameLabel,this.localLabel);

		this.scoreDispContainer.addChild(this.scoreLabel1,this.scoreDisp1);
		if(this.paneLength=='long'){
			this.scoreDispContainer.addChild(this.scoreLabel2,this.scoreDisp2);
		}

		this.addChild(this.entryPaneContainer,this.scoreDispContainer);

		this.nDiv=document.createElement('input');
		this.nDiv.id='inputName';
		this.setInputStyle(this.nDiv);
		document.getElementById('containerDiv').appendChild(this.nDiv);
		this.lDiv=document.createElement('input');
		this.lDiv.id='inputLocal';
		this.setInputStyle(this.lDiv);
		document.getElementById('containerDiv').appendChild(this.lDiv);

		this.nObj=new createjs.DOMElement('inputName');
		this.lObj=new createjs.DOMElement('inputLocal');
		this.nCont=new createjs.Container();
		this.lCont=new createjs.Container();
		this.nCont.addChild(this.nObj);
		this.lCont.addChild(this.lObj);
		this.addChild(this.nCont);
		this.addChild(this.lCont);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		this.entryPaneBack.graphics.clear();
		this.entryPane.graphics.clear();
		this.scoreDispPaneBack.graphics.clear();
		this.scoreDispPane.graphics.clear();

		var entryPaneHeight=160;
		var entryPaneWidth=120;
		var scoreDispPaneHeight=0;
		var scoreDispPaneWidth=120;
		if(oG.model.orientation===0){
			opdLib.posItem(this.submitBut,0,110);
			opdLib.posItem(this.nameLabel,0,-40);//-90
			opdLib.posItem(this.localLabel,0,20);//-30

			this.nameElemX=-2;
			this.nameElemY=-20;
			this.localElemX=-2;
			this.localElemY=40;

			if(this.paneLength=='long'){
				opdLib.posItem(this.entryPaneContainer,90,340);
				opdLib.posItem(this.scoreDispContainer,90,176);

				scoreDispPaneHeight=150;
				opdLib.posItem(this.scoreLabel1,0,-35);//30
				opdLib.posItem(this.scoreDisp1,0,-10);//55
				opdLib.posItem(this.scoreLabel2,0,25);//85
				opdLib.posItem(this.scoreDisp2,0,50);//110
			}else{
				opdLib.posItem(this.entryPaneContainer,90,320);
				opdLib.posItem(this.scoreDispContainer,90,190);

				scoreDispPaneHeight=80;
				opdLib.posItem(this.scoreLabel1,0,-5);
				opdLib.posItem(this.scoreDisp1,0,20);
			}
		}else{
			entryPaneHeight=100;
			entryPaneWidth=260;
			scoreDispPaneHeight=100;

			opdLib.posItem(this.submitBut,0,-50);
			opdLib.posItem(this.nameLabel,-60,-8);
			opdLib.posItem(this.localLabel,50,-8);

			this.nameElemX=-60;
			this.nameElemY=14;
			this.localElemX=50;
			this.localElemY=14;

			if(this.paneLength=='long'){
				opdLib.posItem(this.entryPaneContainer,170,660);
				opdLib.posItem(this.scoreDispContainer,410,660);
				scoreDispPaneWidth=200;
				opdLib.posItem(this.scoreLabel1,-40,-8);
				opdLib.posItem(this.scoreDisp1,-40,18);
				opdLib.posItem(this.scoreLabel2,40,-8);
				opdLib.posItem(this.scoreDisp2,40,18);
			}else{
				opdLib.posItem(this.entryPaneContainer,200,660);
				opdLib.posItem(this.scoreDispContainer,400,660);
				scoreDispPaneWidth=130;
				opdLib.posItem(this.scoreLabel1,0,-8);
				opdLib.posItem(this.scoreDisp1,0,18);
			}
		}

		var wid=entryPaneWidth-paneBord;
		var hei=entryPaneHeight-paneBord;
		var sHei=scoreDispPaneHeight-paneBord;
		var sWid=scoreDispPaneWidth-paneBord;
		this.entryPaneBack.graphics.beginFill(this.paneBorderColor)
		.drawRoundRect(-entryPaneWidth/2,-entryPaneHeight/2,entryPaneWidth,entryPaneHeight,16);
		this.entryPane.graphics.beginFill('#fff').drawRoundRect(-wid/2,-hei/2,wid,hei,12);
		this.scoreDispPaneBack.graphics.beginFill(this.paneBorderColor)
		.drawRoundRect(-scoreDispPaneWidth/2,-scoreDispPaneHeight/2,scoreDispPaneWidth,scoreDispPaneHeight,16);
		this.scoreDispPane.graphics.beginFill('#fff').drawRoundRect(-sWid/2,-sHei/2,sWid,sHei,12);

		this.arrangePanes();
		this.updateInputs();
	};

	p.arrangePanes=function(){
		if(oG.model.orientation===0){
			if(this.inputActive){
				this.entryPaneContainer.visible=true;
				if(this.paneLength=='long'){
					opdLib.posItem(this.entryPaneContainer,90,340);
					opdLib.posItem(this.scoreDispContainer,90,176);
				}else{
					opdLib.posItem(this.entryPaneContainer,90,320);
					opdLib.posItem(this.scoreDispContainer,90,190);
				}
			}else{
				this.entryPaneContainer.visible=false;
				opdLib.posItem(this.scoreDispContainer,90,265);
			}
		}else{
			if(this.inputActive){
				this.entryPaneContainer.visible=true;
				if(this.paneLength=='long'){
					opdLib.posItem(this.entryPaneContainer,170,660);
					opdLib.posItem(this.scoreDispContainer,410,660);
				}else{
					opdLib.posItem(this.entryPaneContainer,200,660);
					opdLib.posItem(this.scoreDispContainer,400,660);
				}
			}else{
				this.entryPaneContainer.visible=false;
				opdLib.posItem(this.scoreDispContainer,275,660);
			}
		}
		opdLib.fadeIn(this.entryPaneContainer,300,200);
		opdLib.fadeIn(this.scoreDispContainer,300,200);
	};

	p.setInputVisibility=function(bool){
		this.inputActive=bool;
		if(bool){
			this.showFieldsTimeout=setTimeout(this.showFieldsFun,500);
			this.updateInputs();
		}
		this.arrangePanes();
	};

	p.showFields=function(){
		document.querySelector('input').autofocus=true;
		this.nDiv.style.display='block';
		this.lDiv.style.display='block';
	};

	p.updateInputs=function(){
		if(this.inputActive==true){
			var rat=oG.model.canvasRatio;
			var wid=Math.round(80*rat);
			var hei=Math.round(20*rat);
			var paneX=this.entryPaneContainer.x*rat;
			var paneY=this.entryPaneContainer.y*rat;
			var xOff=Math.round(this.myCan.offsetLeft-wid/2+paneX);
			var yOff=Math.round(this.myCan.offsetTop-hei/2+paneY);

			var newFontSize=Math.round(20*rat);
			newFontSize=Math.floor(newFontSize);

			this.nDiv.style.fontSize=newFontSize+'px';
			this.lDiv.style.fontSize=newFontSize+'px';

			this.nDiv.style.height=hei+'px';
			this.lDiv.style.height=hei+'px';
			this.nDiv.style.width=wid+'px';
			this.lDiv.style.width=wid+'px';

			this.nCont.x=Math.round(xOff+(this.nameElemX*rat));
			this.nCont.y=Math.round(yOff+(this.nameElemY*rat));
			this.lCont.x=Math.round(xOff+(this.localElemX*rat));
			this.lCont.y=Math.round(yOff+(this.localElemY*rat));
		}
	};

	p.endSubmit=function(){
		this.entryPaneContainer.visible=false;
		this.submitBut.removeEventListener('click',this.submitClickFun);
		this.nDiv.style.display='none';
		this.lDiv.style.display='none';
	};

	p.cleanInputs=function(){
		var nom=this.nObj.htmlElement.value;
		if(nom.length>12)nom=nom.slice(0,12);
		nom=nom.replace(/[^a-zA-Z ]/g, '');
		this.nObj.htmlElement.value=nom;
		var loc=this.lObj.htmlElement.value;
		if(loc.length>12)loc=loc.slice(0,12);
		loc=loc.replace(/[^a-zA-Z ]/g, '');
		this.lObj.htmlElement.value=loc;
	};

	p.keyPress=function(e){this.cleanInputs();};

	p.setCallback=function(newFun){this.submitCallback=newFun;};

	p.submitClick=function(event){
		this.cleanInputs();
		var nom=this.nObj.htmlElement.value;
		var loc=this.lObj.htmlElement.value;
		if(nom.length>0&&loc.length>0){
			this.endSubmit();
			this.submitCallback(nom,loc);
			this.inputActive=false;
		}
	};

	p.setInputStyle=function(div){
		div.setAttribute('type','text');
		div.setAttribute('maxlength',12);
		div.style.position='absolute';
		div.style.left=0;
		div.style.top=0;
		div.style.display='none';
		div.style.textAlign='center';
		div.style.fontFamily=this.fontTwo.split('px ')[1];
		div.style.textDecoration='none';
		div.style.border='1px solid #999';
		div.style.margin='0px';
		div.style.padding='0px';
	};

	p.init=function(){
		this.inputActive=false;
		document.addEventListener('keyup',this.keyPressFun);
		this.submitBut.addEventListener('click',this.submitClickFun);
		this.updateInputs();
	};

	p.deit=function(){
		if(this.showFieldsTimeout!=null)clearTimeout(this.showFieldsTimeout);
		this.inputActive=false;
		this.endSubmit();
		document.removeEventListener('keyup',this.keyPressFun);
	};

	oG.Modules.ScorePane=createjs.promote(ScorePane,'Container');
}(opdGame));


(function(oA){
	var url='https://www.owendwyer.com:8080/';
	var myId=0;

	function saveProgressLoc(gProg){
		if(myId===0)myId=generateUUID();
		var myReq=new XMLHttpRequest();
		myReq.open("POST",url,true);
           	myReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		var pVars='myId='+myId;
		pVars+='&prog='+gProg;
		myReq.send(pVars);
	}

	function generateUUID(){ // Public Domain/MIT
	    var d=new Date().getTime();
	    if(typeof performance!=='undefined'&&typeof performance.now==='function'){
		d+=performance.now();//use high-precision timer if available
	    }
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
		var r=(d+Math.random()*16)%16|0;
		d=Math.floor(d/16);
		return (c==='x'?r:(r&0x3|0x8)).toString(16);
	    });
	}
	oA.serverMetrics={saveProgress:saveProgressLoc};
})(opdGame);



(function(oG){//checked
	
	function SettingsPane(){
		this.Container_constructor();
		this.setup();
	}

	var p=createjs.extend(SettingsPane,createjs.Container);

	p.setup=function(){
		this.fullBack=new createjs.Shape();
		this.backBorder=new createjs.Shape();
		this.exitBut=new createjs.Container();
		this.exitButBorder=new createjs.Shape();
		this.exitButFront=new createjs.Shape();
		this.exitText=new createjs.Text('okay','bold 24px Reem Kufi','#333');
		this.speedText=new createjs.Text('Speed','bold 26px Reem Kufi','#666');
		this.titleText=new createjs.Text('Settings','bold 28px Reem Kufi','#333');
		this.audioIm=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.audioIm.gotoAndStop('audButId');
		this.textIm=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.textIm.gotoAndStop('textButId');

		this.audioOption=new oG.Modules.OptionPair(this.audioCallback);
		this.textOption=new oG.Modules.OptionPair(this.textCallback);
		this.speedDelayLine=new oG.Modules.SpeedLine(oG.model.gameSpeed,['slowest','slow','normal','fast','fastest']);

		this.backPane=new createjs.Shape();

		this.fullBack.alpha=0.2;

		this.exitBut.cursor='pointer';

		opdLib.centerText(this.titleText);
		opdLib.centerText(this.exitText);
		opdLib.centerText(this.speedText);

		this.paneCont=new createjs.Container();

		this.backBorder.graphics.beginFill('#ffc').drawRoundRect(177,72,416,396,28);
		this.backPane.graphics.beginFill('#fff').beginStroke('#ccc').drawRoundRect(185,80,400,380,24);
		this.exitButBorder.graphics.beginFill('#ffc').drawCircle(0,0,58);
		this.exitButFront.graphics.beginFill('#ffe').beginStroke('#888').drawCircle(0,0,50);

		opdLib.posItem(this.exitText,0,8);
		opdLib.posItem(this.exitBut,195,90);
		opdLib.posItem(this.audioIm,255,178);
		opdLib.posItem(this.audioOption,360,178);
		opdLib.posItem(this.textIm,255,286);
		opdLib.posItem(this.textOption,360,286);
		opdLib.posItem(this.speedText,245,420);
		opdLib.posItem(this.speedDelayLine,260,381);
		opdLib.posItem(this.titleText,395,130);

		this.addChild(this.fullBack,this.paneCont);
		this.paneCont.addChild(this.backBorder,this.backPane,this.textIm,this.audioOption,this.audioIm,this.exitBut);
		this.paneCont.addChild(this.titleText,this.speedDelayLine,this.speedText,this.textOption);
		this.exitBut.addChild(this.exitButBorder,this.exitButFront,this.exitText);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			this.fullBack.graphics.clear().beginFill('#000').drawRect(0,0,800,550);
			opdLib.posItem(this.paneCont,10,0);
		}else{
			this.fullBack.graphics.clear().beginFill('#000').drawRect(0,0,550,800);
			opdLib.posItem(this.paneCont,-105,135);
		}
	};

	p.audioCallback=function($bool){
		oG.model.showAudio=$bool;
	};

	p.textCallback=function($bool){
		oG.model.showText=$bool;
		oG.view.gameView.updateGameTextSetting();
	};

	p.init=function(){
		this.backPane.addEventListener('click',deadClick);
		this.visible=true;

		this.audioOption.init(oG.model.showAudio);
		this.textOption.init(oG.model.showText);
		this.speedDelayLine.init();

		if(oG.model.gameMode=='fast'){
			this.speedText.visible=true;
			this.speedDelayLine.visible=true;
			this.audioIm.y=178;
			this.audioOption.y=178;
			this.textIm.y=286;
			this.textOption.y=286;
		}else{
			this.speedText.visible=false;
			this.speedDelayLine.visible=false;
			this.audioIm.y=200;
			this.audioOption.y=200;
			this.textIm.y=326;
			this.textOption.y=326;
		}
	};

	p.deit=function(){
		this.visible=false;
		this.backPane.removeEventListener('click',deadClick);

		this.audioOption.deit();
		this.textOption.deit();
		this.speedDelayLine.deit();
	};

	function deadClick(event){
	}


	oG.Modules.SettingsPane=createjs.promote(SettingsPane,'Container');
}(opdGame));


(function(oG){//checked

	function SettingsReviewPane(){
		this.Container_constructor();
		this.updateLineAlphasFun=this.updateLineAlphas.bind(this);
		this.autoDelayLineClickFun=this.autoDelayLineClick.bind(this);
		this.setup();
	}

	var p=createjs.extend(SettingsReviewPane,createjs.Container);

	p.setup=function(){
		this.paneCont=new createjs.Container();
		var titleText=new createjs.Text('Settings','bold 28px Reem Kufi','#333');
		var exitText=new createjs.Text('Okay','bold 24px Reem Kufi','#333');
		this.fullBack=new createjs.Shape();

		var autoIm=new createjs.Sprite(oG.model.mainSpriteSheet);
		autoIm.gotoAndStop('autoButId');
		var audioIm=new createjs.Sprite(oG.model.mainSpriteSheet);
		audioIm.gotoAndStop('audButId');
		var textIm=new createjs.Sprite(oG.model.mainSpriteSheet);
		textIm.gotoAndStop('textButId');

		this.autoOption=new oG.Modules.OptionPair(this.autoOptionCallback.bind(this));
		this.audioOption=new oG.Modules.OptionPair(this.audioOptionCallback.bind(this));
		this.textOption=new oG.Modules.OptionPair(this.textOptionCallback.bind(this));

		this.autoDelayLine=new oG.Modules.TimeSetterLine(oG.model.reviewAutoDelay,[1,2,3,4,5]);
		this.audioDelayLine=new oG.Modules.TimeSetterLine(oG.model.reviewAudioDelay,[0,0.2,0.5,1,1.5]);
		this.textDelayLine=new oG.Modules.TimeSetterLine(oG.model.reviewTextDelay,[0,0.2,0.5,1,1.5]);
		var backBorder=new createjs.Shape();
		this.backPane=new createjs.Shape();
		this.exitBut=new createjs.Container();
		var exitButBorder=new createjs.Shape();

		this.fullBack.alpha=0.2;
		backBorder.graphics.beginFill('#ffc').drawRoundRect(142,57,516,422,28);
		this.backPane.graphics.beginFill('#fff').beginStroke('#ccc').drawRoundRect(150,65,500,410,24);
		exitButBorder.graphics.beginFill('#ffc').drawCircle(0,0,58);
		exitButFront=new createjs.Shape();
		exitButFront.graphics.beginFill('#ffe').beginStroke('#888').drawCircle(0,0,50);
		this.exitBut.cursor='pointer';

		opdLib.centerText(titleText);
		opdLib.centerText(exitText);

		this.addChild(this.fullBack,this.paneCont);
		this.exitBut.addChild(exitButBorder,exitButFront,exitText);

		opdLib.posItem(exitText,0,9);

		opdLib.posItem(this.exitBut,150,75);
		opdLib.posItem(autoIm,190,155);
		opdLib.posItem(this.autoOption,295,155);
		opdLib.posItem(this.autoDelayLine,430,155);
		opdLib.posItem(audioIm,190,265);
		opdLib.posItem(this.audioOption,295,265);
		opdLib.posItem(this.audioDelayLine,430,265);
		opdLib.posItem(textIm,190,375);
		opdLib.posItem(this.textOption,295,375);
		opdLib.posItem(this.textDelayLine,430,375);
		opdLib.posItem(titleText,400,110);

		this.paneCont.addChild(backBorder,this.backPane,this.exitBut,autoIm,this.autoOption,this.autoDelayLine,audioIm);
		this.paneCont.addChild(this.audioOption,this.audioDelayLine,textIm,this.textOption,this.textDelayLine,titleText);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			this.fullBack.graphics.clear().beginFill('#000').drawRect(0,0,800,550);
			opdLib.posItem(this.paneCont,0,10);
			this.paneCont.scaleX=1;
			this.paneCont.scaleY=1;
		}else{
			this.fullBack.graphics.clear().beginFill('#000').drawRect(0,0,550,800);
			opdLib.posItem(this.paneCont,-70,170);
			this.paneCont.scaleX=0.9;
			this.paneCont.scaleY=0.9;
		}
	};

	p.updateLineAlphas=function(){
		if(oG.model.autoReview){
			this.autoDelayLine.alpha=1;
			this.autoDelayLine.init();
			this.autoDelayLine.addEventListener('click',this.autoDelayLineClickFun);
		}else{
			this.autoDelayLine.alpha=0.3;
			this.autoDelayLine.deit();
			this.autoDelayLine.removeEventListener('click',this.autoDelayLineClickFun);
		}
		if(oG.model.showReviewAudio){
			this.audioDelayLine.alpha=1;
			this.audioDelayLine.init();
		}else{
			this.audioDelayLine.alpha=0.3;
			this.audioDelayLine.deit();
		}
		if(oG.model.showReviewText){
			this.textDelayLine.alpha=1;
			this.textDelayLine.init();
		}else{
			this.textDelayLine.alpha=0.3;
			this.textDelayLine.deit();
		}
	};

	p.autoDelayLineClick=function(event){
		this.audioDelayLine.delayLine[1].visible=true; 
		this.audioDelayLine.delayLine[2].visible=true; 
		this.audioDelayLine.delayLine[3].visible=true; 
		this.audioDelayLine.delayLine[4].visible=true;
		if(oG.model.autoReview==true){
			if(oG.model.reviewAutoDelay.val==2){
				this.audioDelayLine.delayLine[3].visible=false; 
				this.audioDelayLine.delayLine[4].visible=false;
				if(oG.model.reviewAudioDelay.val>0.5){
					this.audioDelayLine.setLine(2);
					oG.model.reviewAudioDelay.val=0.5;
				}
			}
			if(oG.model.reviewAutoDelay.val==1){
				this.audioDelayLine.delayLine[1].visible=false; 
				this.audioDelayLine.delayLine[2].visible=false; 
				this.audioDelayLine.delayLine[3].visible=false; 
				this.audioDelayLine.delayLine[4].visible=false;
				if(oG.model.reviewAudioDelay.val>0){
					this.audioDelayLine.setLine(0);
					oG.model.reviewAudioDelay.val=0;
				}
			}
		}

		this.textDelayLine.delayLine[1].visible=true; 
		this.textDelayLine.delayLine[2].visible=true; 
		this.textDelayLine.delayLine[3].visible=true; 
		this.textDelayLine.delayLine[4].visible=true;
		if(oG.model.autoReview==true){
			if(oG.model.reviewAutoDelay.val==2){
				this.textDelayLine.delayLine[3].visible=false; 
				this.textDelayLine.delayLine[4].visible=false;
				if(oG.model.reviewTextDelay.val>0.5){
					this.textDelayLine.setLine(2);
					oG.model.reviewTextDelay.val=0.5;
				}
			}
			if(oG.model.reviewAutoDelay.val==1){
				this.textDelayLine.delayLine[1].visible=false; 
				this.textDelayLine.delayLine[2].visible=false; 
				this.textDelayLine.delayLine[3].visible=false; 
				this.textDelayLine.delayLine[4].visible=false;
				if(oG.model.reviewTextDelay.val>0){
					this.textDelayLine.setLine(0);
					oG.model.reviewTextDelay.val=0;
				}
			}
		}
	};

	p.autoOptionCallback=function($bool){
		oG.model.autoReview=$bool;
		this.updateLineAlphasFun();
		this.autoDelayLineClick();
	};

	p.audioOptionCallback=function($bool){
		oG.model.showReviewAudio=$bool;
		this.updateLineAlphasFun();
	};

	p.textOptionCallback=function($bool){
		oG.model.showReviewText=$bool;
		this.updateLineAlphasFun();
	};

	p.init=function(){
		this.backPane.addEventListener('click',deadClick);

		this.autoOption.init(oG.model.autoReview);
		this.audioOption.init(oG.model.showReviewAudio);
		this.textOption.init(oG.model.showReviewText);
		this.updateLineAlphasFun();
	};

	p.deit=function(){
		this.backPane.removeEventListener('click',deadClick);
		this.autoDelayLine.deit();
		this.audioDelayLine.deit();
		this.textDelayLine.deit();

		this.autoOption.deit();
		this.audioOption.deit();
		this.textOption.deit();
	};

	function deadClick(event){
	}

	oG.Modules.SettingsReviewPane=createjs.promote(SettingsReviewPane,'Container');
}(opdGame));


(function(oG){//checked
	function SpeedLine($dTarget,$dArray){
		this.Container_constructor();
		this.dTarget=$dTarget;
		this.dArray=$dArray;
		this.dClickFun=this.dClick.bind(this);
		this.dOverFun=this.dOver.bind(this);
		this.dOutFun=this.dOut.bind(this);
		this.setup();
	}
	var p=createjs.extend(SpeedLine,createjs.Container);

	p.setup=function(){
		this.delayLine=[];
		this.delayTime=new createjs.Text('','bold 12px Reem Kufi', '#333');
		
		opdLib.centerText(this.delayTime);
		this.delayVar=this.dTarget.val;
		this.lineContainer=new createjs.Container();

		this.delayTime.text=this.dArray[this.delayVar];

		for(i=0;i<5;i++){
			this.delayLine[i]=new createjs.Shape();
			this.delayLine[i].graphics.beginFill('#555').beginStroke('#000').drawCircle(0,0,18);
			this.delayLine[i].val=i;
			this.delayLine[i].alpha=0.3;
			this.delayLine[i].cursor='pointer';
			opdLib.dispItem(this.delayLine[i],this.lineContainer,i*37,0);
		}
		this.setLine(this.delayVar);

		opdLib.dispItem(this.delayTime,this,260,32);
		opdLib.dispItem(this.lineContainer,this,60,30);
	};


	p.init=function(){	
		this.lineContainer.addEventListener('click',this.dClickFun);
		if(!oG.model.touchMode){
			this.lineContainer.addEventListener('mouseover',this.dOverFun);
			this.lineContainer.addEventListener('mouseout',this.dOutFun);
		}
	};

	p.deit=function(){
		this.lineContainer.removeEventListener('click',this.dClickFun);
		if(!oG.model.touchMode){
			this.lineContainer.removeEventListener('mouseover',this.dOverFun);
			this.lineContainer.removeEventListener('mouseout',this.dOutFun);
		}
	};

	p.dClick=function(event){
		this.delayVar=event.target.val;
		this.dTarget.val=this.delayVar;
		this.setLine(this.delayVar);
	};

	p.dOver=function(event){
		this.setLine(event.target.val);
		this.delayTime.text=this.dArray[event.target.val];
	};

	p.dOut=function(event){
		this.setLine(this.delayVar);
		this.delayTime.text=this.dArray[this.delayVar];
	};

	p.setLine=function($var){
		for(i=0;i<5;i++){
			this.delayLine[i].alpha=1;
		}
		for(i=$var+1;i<5;i++){
			this.delayLine[i].alpha=0.3;
		}
	};

	oG.Modules.SpeedLine=createjs.promote(SpeedLine,'Container');
}(opdGame));

(function(oG){//checked
	var tArr=[];
	var contentLimArr=[30,20,20,20,10,19,30,29,20,18,26,30,20,21,29,29,20,19,40,20,20,28,26];

	function getTextLoc($var){
		return tArr[$var];
	}

	function getSectionLoc($var){
		return tSection[$var];
	}

	function getSectionsLoc(){
		return tSection;
	}

	function getContentLimLoc($var){
		return contentLimArr[$var];
	}

	var tSection=['Animals','Body','City','Clothes','Colors','Computer','Food','Furniture','Garden',
'Hospital','Jobs','Kitchen','Nature','Numbers','Personal','Sports','Stationery',
'Transport','Animals 2','Body 2','Clothes 2','Food 2','Letters'];


	tArr[0]=['pájaro','gato','perro','elefante','pez','caballo','ratón','cerdo','serpiente','tigre','león','mono',
'pollo','jirafa','rana','dragón','pato','oveja','vaca','ballena','rata','oso','panda','lobo','pingüino','cabra',
'tiburón','leopardo','zorro','mariposa'];

	tArr[1]=['brazo','oídos','ojos','dedo','pie','mano','piernas','boca','nariz','dientes',
'pelo','cabeza','cuello','dedo del pie','pulgar','vientre','mentón','barba','trasero','lengua'];


	tArr[19]=['hombro','rodilla','bigote','codo','frente','talón','tobillo',
'ceja','pestañas','muñeca','axila','ombligo','bicep','hueso','gemelo',
'lóbulo de la oreja','cadera','labio','fosa nasal','muslo'];


	tArr[2]=['bloque de apartamentos','castillo','iglesia','fábrica','hospital','faro','palacio',
'rascacielos','tienda','molino de viento','puente','parada de autobús','cruce',
'fuente','calle','acera','estatua','farola','vía','semáforo'];

	tArr[3]=['abrigo','vestido','sombrero','pantalones','zapato','pantalones cortos','falda','calcetines','lazo',
'camiseta','gafas','sudadera','guantes','chaqueta','bufanda','cinturón','traje','botas','anillo','sombrilla'];

	tArr[4]=[];

	tArr[5]=['ordenador','ratón','teclado','laptop','monitor','auriculares','impresora','altavoces','batería',
'bombilla','usb','dvd','reproductor de dvd','interruptor','línea','micrófono','clavija','enchufe','cámara web'];

	tArr[6]=['manzana','plátano','pan','chocolate','huevo','uvas','leche','naranja','peras','arroz','hamburguesa','pastel',
'zanahoria','café','maiz','pescado','tomate','noodles','fresa','brócoli','chile','galleta','cebolla',
'zumo de naranja','melocotón','chícharos','sandwich','sopa','filete','melón'];

	tArr[7]=['televisión','silla','puerta','sofá','mesa','ventana','lámpara','reloj','papelera','armario',
'teléfono','foto','control remoto','aire acondicionado','manta','escaleras','planta',
'cortinas','florero','cojín','sillón','biblioteca','techo','ventilador','suelo','globo','fuego','estéreo','taburete'];

	tArr[8]=['barbacoa','papelera','valla','puerta','escalera','cortadora de césped','cobertizo','pala',
'columpio','pared','banco','escoba','chimenea','colgadero','drenar',
'cepillo y recogedor','arriate','césped','fregona','carretilla'];

	tArr[9]=['brazo roto','tos','cortar','dolor de cabeza','sangrado por nariz','erupción','dolor de garganta',
'dolor de estómago','vendage','sangre','muletas','inyección','goteo','medicina','aguja','pastillas','tirita','silla de ruedas'];

	tArr[10]=['cocinero','doctor','conductor','agricultor','bombero','enfermera','policía','soldado',
'profesor','camarero','dependiente','cantante','bailarín','dentista','pescador','constructor','mecánico',
'trabajador de la fábrica','oficinista','jardinero','electricista','barman','guarda de seguridad','reportero','recepcionista','socorrista'];

	tArr[11]=['botella','cuenco','copa','tenedor','vaso','tarro','jarra','cuchillo','plato','cuchara','baño','grifo',
'cepillo de pelo','espejo','ducha','fregadero','jabón','cepillo de dientes','pasta de dientes','toalla','tabla de cortar',
'cuchilla de carnicero','paño','sartén','hervidor','cucharón','cacerola','espátula','tetera','bandeja'];

	tArr[12]=['playa','arbusto','flor','isla','lago','hoja','montaña','río','árbol','ola','nube','relámpago',
'luna','lluvia','arcoiris','nieve','estrella','sol','tornado','viento'];

	tArr[13]=[];

	tArr[14]=['bolsa','cámara','tarjeta','gafas','llave','teléfono móvil','dinero','mp3','cartera',
'reloj','globo','abrebotellas','vela','percha','peine','dados','literna eléctrica','iman ','maleta','prismáticos',
'cometa','mapa','periódico','pasaporte','mochila','carro de la compra','paja','ticket','cubo de la basura'];

	tArr[15]=['baloncesto','fútbol','tenis','natación','golf','tenis de mesa','volley ball','ajedrez','boxeo',
'piscina','ciclismo','béisbol','cricket','bolos','poker','pesca','futbol americano','rugby','hockey','lucha',
'dardos','buceo','gimnasia','salto de altura','montar a caballo','jabalina','salto de longitud','salto con pérdiga','lanzamiento de peso'];

	tArr[16]=['goma de borrar','bloc de notas','pincel','papel','pluma','lápiz','estuche','regla','tijeras','sacapuntas','tablón',
'calculadora','tarjetas','compás','lápices de colores','pluma estilográfica','marcador','cortaplumas',
'transportador','silbar'];

	tArr[17]=['bici','autobús','coche','motocicleta','avión','barco','tren','camión','paseo','ambulancia','ascensor',
'escalera mecánica','Coche de bomberos','planeador','helicóptero','cohete','patinete','tractor','furgoneta'];

	tArr[18]=['hormiga','abeja','toro','delfín','camello','dinosaurio','burro','águila','canguro','tortuga','oruga',
'ciervo','mosca','hipopótamo','lagarto','pulpo','loro','rinoceronte','caracol','gusano','pez de colores','gorila','monstruo','avestruz',
'foca','mofeta','babosa','ardilla','cisne','cebra','tejón','escarabajo','búfalo','saltamontes','erizo',
'gatito','koala','cordero','pavo real','cachorro'];


	tArr[20]=['casco','traje de baño','Gafas de sol','sandalias','chaleco','collar','zapatilla','bata',
'tacones','mascara','hacha','pulsera','manto','corona','pendiente','chanclas','escudo','esnórquel','traje espacial','espada'];

	tArr[21]=['coca cola','pepino','perrito caliente','hielo','lechuga','pimiento dulce','piña','pizza',
'patata','té','queso','cereza','coco','berenjena','chocolate caliente','limón',
'champiñones','espagueti','pastel','mantequilla','apio','cereal','ajo','jenjibre',
'pomelo','kiwi','batido de leche','salchicha'];

	tArr[22]=[];
	oG.textContent={
		getSection:getSectionLoc,
		getText:getTextLoc,
		getSections:getSectionsLoc,
		getContentLim:getContentLimLoc
	};
}(opdGame));


(function(oG){//checked
	function TextPane($color,$fontSize,$xVarBoost){
		this.Container_constructor();
		this.textColor=$color;
		this.fontSize=$fontSize;
		this.xVarBoost=$xVarBoost;
		this.mFlowFun=this.mFlow.bind(this);
		this.setup();
	}
	var p=createjs.extend(TextPane,createjs.Container);

	p.setup=function(){
		this.maskStart=-240;
		this.maskFin=15;

		this.backPane=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.backPane.gotoAndStop('dispBoxId');

		this.addChild(this.backPane);
		this.dispText=new createjs.Text('', 'bold '+this.fontSize+'px Reem Kufi', this.textColor);
		opdLib.centerText(this.dispText);

		this.textMask=new createjs.Shape();
		this.textMask.graphics.beginFill('#ccc').drawRect(0,30,400,50);
		this.addChild(this.dispText);
		this.dispText.mask=this.textMask;
		this.maskWidth=this.maskStart;
		this.maskWidth-=this.xVarBoost;
		this.maskWidthAlt=0;
		opdLib.dispItem(this.dispText,this,215,65);
	};

	p.setText=function($txt){
		this.dispText.text=$txt;
		this.maskFlow();
	};

	p.init=function(){
		this.visible=true;
	};

	p.deit=function(){
		this.visible=false;
		if(createjs.Ticker.hasEventListener('tick',this.mFlowFun)){createjs.Ticker.removeEventListener('tick',this.mFlowFun);}
	};

	p.clearText=function(){
		this.dispText.text='';
		this.textMask.x=this.maskStart;
	};

	p.defaultShow=function(){
		this.maskWidth=250;
		this.mFlow(null);
	};

	p.maskFlow=function(){
		if(oG.model.speedVar==0){
			this.textMask.x=0;
		}else{
			this.maskWidth=this.maskStart;
			this.maskWidth-=this.xVarBoost;
			this.maskWidthAlt=Math.round(300/(30*oG.model.speedVar));
			this.textMask.x=this.maskWidth;
			if(createjs.Ticker.hasEventListener('tick',this.mFlowFun)){createjs.Ticker.removeEventListener('tick',this.mFlowFun);}
			createjs.Ticker.addEventListener('tick',this.mFlowFun);
		}
	};

	p.mFlow=function(event){
		this.maskWidth+=this.maskWidthAlt;
		this.textMask.x=this.maskWidth;
		if(this.maskWidth>=this.maskFin){
			this.textMask.x=this.maskFin;
			createjs.Ticker.removeEventListener('tick',this.mFlowFun);
		}
	};
	
	oG.Modules.TextPane=createjs.promote(TextPane,'Container');
}(opdGame));


(function(oG){//checked
	function TimeSetterLine($dTarget,$dArray){
		this.Container_constructor();
		this.dTarget=$dTarget;
		this.delayArray=$dArray;
		this.dClickFun=this.dClick.bind(this);
		this.dOverFun=this.dOver.bind(this);
		this.dOutFun=this.dOut.bind(this);
		this.setup();
	}
	var p=createjs.extend(TimeSetterLine,createjs.Container);

	p.setup=function(){
		this.delayLine=[];
		var delayTitle=new createjs.Text('delay','bold 16px Reem Kufi', '#333');
		this.delayTime=new createjs.Text('0.0s','bold 16px Reem Kufi', '#333');
		this.delayVar=0;
		this.lineContainer=new createjs.Container();

		for(i=0;i<5;i++){
			this.delayLine[i]=new createjs.Shape();
			this.delayLine[i].graphics.beginFill('#555').beginStroke('#000').drawCircle(0,0,10);
			this.delayLine[i].val=i;
			this.delayLine[i].alpha=0.3;
			this.delayLine[i].cursor='pointer';
			opdLib.dispItem(this.delayLine[i],this.lineContainer,i*21,10);
			if(this.delayArray[i]===this.dTarget.val){this.delayVar=i;}
		}
		this.setLine(this.delayVar);
		this.delayTime.text=this.delayArray[this.delayVar]+'s';

		opdLib.centerText(delayTitle);
		opdLib.centerText(this.delayTime);

		opdLib.dispItem(delayTitle,this,102,17);
		opdLib.dispItem(this.delayTime,this,175,45);
		opdLib.dispItem(this.lineContainer,this,60,30);
	};

	p.dClick=function(event){
		this.delayVar=event.target.val;
		this.dTarget.val=this.delayArray[this.delayVar];
		this.setLine(this.delayVar);
	};

	p.dOver=function(event){
		this.setLine(event.target.val);
	};

	p.dOut=function(event){
		this.setLine(this.delayVar);
		this.delayTime.text=this.delayArray[this.delayVar]+'s';
	};

	p.setLine=function($var){
		for(i=0;i<5;i++){
			this.delayLine[i].alpha=1;
		}
		for(i=$var+1;i<5;i++){
			this.delayLine[i].alpha=0.3;
		}
		this.delayTime.text=this.delayArray[$var]+'s';
	};

	p.init=function(){
		this.lineContainer.addEventListener('click',this.dClickFun);
		if(!oG.model.touchMode){
			this.lineContainer.addEventListener('mouseover',this.dOverFun);
			this.lineContainer.addEventListener('mouseout',this.dOutFun);
		}
		for(i=0;i<5;i++){
			this.delayLine[i].cursor='pointer';
		}
	};

	p.deit=function(){
		this.lineContainer.removeEventListener('click',this.dClickFun);
		if(!oG.model.touchMode){
			this.lineContainer.removeEventListener('mouseover',this.dOverFun);
			this.lineContainer.removeEventListener('mouseout',this.dOutFun);
		}
		for(i=0;i<5;i++){
			this.delayLine[i].cursor='default';
		}
	};

	oG.Modules.TimeSetterLine=createjs.promote(TimeSetterLine,'Container');
}(opdGame));


(function(oG){//checked
	function TitleView(){
		this.Container_constructor();
		this.mouseOverer0Fun=this.mouseOverer0.bind(this);
		this.mouseOverer1Fun=this.mouseOverer1.bind(this);
		this.mouseOverer2Fun=this.mouseOverer2.bind(this);
		this.mouseOverer3Fun=this.mouseOverer3.bind(this);
		this.mouseOutFun=this.mouseOut.bind(this);
		this.setup();
	}
	var p=createjs.extend(TitleView,createjs.Container);

	p.setup=function(){
		//this.myTitle=new createjs.Bitmap(oG.model.title);
		//this.myTitleGlow=new createjs.Bitmap(oG.model.title);
		this.myTitle=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.myTitle.gotoAndStop('spanTitle');
		this.myTitleGlow=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.myTitleGlow.gotoAndStop('spanTitle');

		this.fastBut=new oG.Modules.Button('textFast','content-game-fast');
		this.slowBut=new oG.Modules.Button('textSlow','content-game-slow');
		this.aboutBut=new oG.Modules.Button('textAbout','about');
		this.reviewBut=new oG.Modules.Button('textReview','content-review');
		
		this.myTitleGlow.cache(0,0,360,100);
		var newFil=[new createjs.BlurFilter(12,12,1), new createjs.ColorFilter(0.5,0.5,0.5,0.8)];
		this.myTitleGlow.filters=newFil;
		this.myTitleGlow.updateCache();

		var dummyText_0=new createjs.Text('.','bold 8px Alegreya Sans','#333');
		var dummyText_1=new createjs.Text('.','bold 8px Reem Kufi','#333');
		dummyText_0.alpha=0.01;
		dummyText_1.alpha=0.01;
		this.addChild(dummyText_0);
		this.addChild(dummyText_1);

		this.addChild(this.myTitleGlow);		
		this.addChild(this.myTitle);

		this.butsArr=[this.fastBut,this.slowBut,this.aboutBut,this.reviewBut];
		for(var i=0;i<4;i++)this.addChild(this.butsArr[i]);

		this.setupDisplay();
	};

	var yArr=[320,354,388,422];
	var yArrP=[460,512,564,616];

	p.setupDisplay=function(){
		if(oG.model.orientation===0){
			opdLib.posItem(this.myTitleGlow,235,150);		
			opdLib.posItem(this.myTitle,235,150);
			this.myTitleGlow.scaleX=1;
			this.myTitleGlow.scaleY=1;
			this.myTitle.scaleX=1;
			this.myTitle.scaleY=1;
			this.posButtons(400,yArr,1);
		}else{
			opdLib.posItem(this.myTitleGlow,83,254);		
			opdLib.posItem(this.myTitle,83,254);
			this.myTitleGlow.scaleX=1.2;
			this.myTitleGlow.scaleY=1.2;
			this.myTitle.scaleX=1.2;
			this.myTitle.scaleY=1.2;
			this.posButtons(275,yArrP,1.5);
		}
	};

	p.posButtons=function(xPos,yArr,scale){
		for(var i=0;i<4;i++){
			opdLib.posItem(this.butsArr[i],xPos,yArr[i]);
			this.butsArr[i].scaleX=scale;
			this.butsArr[i].scaleY=scale;
		}
	};

	p.orientationChange=function(){
		this.resetButs();
		this.setupDisplay();
	};

	p.resetButs=function(){
		for(var i=0;i<4;i++){
			createjs.Tween.removeTweens(this.butsArr[i]);
			this.butsArr[i].alpha=1;
		}
		if(oG.model.orientation===0){
			this.posButtons(400,yArr,1);
		}else{
			this.posButtons(275,yArrP,1.5);
		}
	};

	p.mouseOverer0=function(){
		if(oG.model.orientation===0)this.myMover([yArr[0],yArr[1]+4,yArr[2]+4,yArr[3]+4],[1.2,1,1,1]);
	};

	p.mouseOverer1=function(){
		if(oG.model.orientation===0)this.myMover([yArr[0]-4,yArr[1],yArr[2]+4,yArr[3]+4],[1,1.2,1,1]);
	};

	p.mouseOverer2=function(){
		if(oG.model.orientation===0)this.myMover([yArr[0]-4,yArr[1]-4,yArr[2],yArr[3]+4],[1,1,1.2,1]);
	};

	p.mouseOverer3=function(){
		if(oG.model.orientation===0)this.myMover([yArr[0]-4,yArr[1]-4,yArr[2]-4,yArr[3]],[1,1,1,1.2]);
	};

	p.mouseOut=function(){
		if(oG.model.orientation===0)this.myMover(yArr,[1,1,1,1]);
	};

	p.myMover=function(yPos,scales){
		for(var i=0;i<4;i++){
			createjs.Tween.removeTweens(this.butsArr[i]);
			createjs.Tween.get(this.butsArr[i],{override:true}).to({alpha:1,y:yPos[i],scaleX:scales[i],scaleY:scales[i]},200);
		}
	};

	p.addLists=function(){
		for(var i=0;i<4;i++){
			this.butsArr[i].addLists();
			if(!oG.model.touchMode)this.butsArr[i].addEventListener('mouseout',this.mouseOutFun);
		}
		if(!oG.model.touchMode){
			this.fastBut.addEventListener('mouseover',this.mouseOverer0Fun);
			this.slowBut.addEventListener('mouseover',this.mouseOverer1Fun);
			this.aboutBut.addEventListener('mouseover',this.mouseOverer2Fun);
			this.reviewBut.addEventListener('mouseover',this.mouseOverer3Fun);
		}
	};

	p.removeLists=function(){
		for(var i=0;i<4;i++){
			this.butsArr[i].removeLists();
			if(!oG.model.touchMode)this.butsArr[i].removeEventListener('mouseout',this.mouseOutFun);
		}
		if(!oG.model.touchMode){
			this.fastBut.removeEventListener('mouseover',this.mouseOverer0Fun);
			this.slowBut.removeEventListener('mouseover',this.mouseOverer1Fun);
			this.aboutBut.removeEventListener('mouseover',this.mouseOverer2Fun);
			this.reviewBut.removeEventListener('mouseover',this.mouseOverer3Fun);
		}
	};

	p.init=function(){
		if(oG.model.offSite)this.reviewBut.alterButton('textGames','games');
		oG.view.musicPlayer.play();
		this.resetButs();
		this.addLists();
		opdLib.fadeIn(this.fastBut,300,400);
		opdLib.fadeIn(this.slowBut,300,500);
		opdLib.fadeIn(this.aboutBut,300,600);
		opdLib.fadeIn(this.reviewBut,300,700);
		opdLib.fadeIn(this.myTitle,200,200);
		opdLib.fadeIn(this.myTitleGlow,200,200);
	};

	p.deit=function(){
		this.removeLists();
	};


	oG.Views.TitleView=createjs.promote(TitleView,'Container');
}(opdGame));

(function(oG){
	function Button($label,$clickTarget){
		this.Container_constructor();
		this.label=$label;
		this.clickTarget=$clickTarget;
		this.outerFun=this.outer.bind(this);
		this.overerFun=this.overer.bind(this);
		this.clickerFun=this.clicker.bind(this);
		this.setup();
	}
	var p=createjs.extend(Button,createjs.Container);

	var myGlowFilter=[new createjs.BlurFilter(8,8,1), new createjs.ColorFilter(0.7,0.7,0.7,1)];

	p.setup=function(){
		this.cursor='pointer';
		this.mouseChildren=false;
		this.back=new createjs.Shape();
		this.back2=new createjs.Shape();
		this.back3=new createjs.Shape();
		this.mText=new createjs.Sprite(oG.model.mainSpriteSheet);

		var width=110;
		var height=30;
		var hWidth=width/2;
		var hHeight=height/2;

		this.back.graphics.beginFill(['#ccc'],[0.6,0.9],-hWidth,-hHeight,-hWidth,hHeight).drawRoundRect(-hWidth,-hHeight,width,height,6);
		this.back2.graphics.beginFill('#fff').drawRoundRect(-hWidth,-hHeight,width,height,6);

		this.back3.graphics.beginFill('#555').drawRoundRect(-hWidth,-hHeight,width,height,2);

		this.back3.cache(-hWidth,-hHeight,width,height);
		this.back3.filters=myGlowFilter;
		this.back3.updateCache();

		this.mText.gotoAndStop(this.label);

		this.addChild(this.back3);
		this.addChild(this.back2);
		this.addChild(this.back);

		opdLib.dispItem(this.mText,this,-45,-15);
	};

	p.alterButton=function($label,$clickTarget){
		this.label=$label;
		this.clickTarget=$clickTarget;
		this.mText.gotoAndStop(this.label);
	};

	p.addLists=function(){
		this.addEventListener('click',this.clickerFun);
		if(!oG.model.touchMode){
			this.addEventListener('mouseover',this.overerFun);
			this.addEventListener('mouseout',this.outerFun);
		}
	};

	p.removeLists=function(){
		this.removeEventListener('click',this.clickerFun);
		if(!oG.model.touchMode){
			this.removeEventListener('mouseover',this.overerFun);
			this.removeEventListener('mouseout',this.outerFun);
		}
	};

	p.overer=function(event){
		createjs.Tween.removeTweens(this.back);
		createjs.Tween.get(this.back,{loop:false}).to({alpha:0},200);
	};

	p.outer=function(event){
		createjs.Tween.removeTweens(this.back);
		createjs.Tween.get(this.back,{loop:false}).to({alpha:1},200);
	};

	p.clicker=function(event){
		createjs.Tween.removeTweens(this.back);
		this.back.alpha=1;
		if(this.clickTarget=='games'){
			var redirectWindow=window.open(oG.model.siteUrlFull,'_blank');
	    		redirectWindow.location;
		}else{
			oG.view.changeView(this.clickTarget);
		}
	};
	
	oG.Modules.Button=createjs.promote(Button,'Container');
}(opdGame));


(function(oG){//checked
	function View(){
		this.Container_constructor();
		this.newViewFun=this.newView.bind(this);
		this.orientationChange=this.orientationChangeFun.bind(this);
		this.updateResize=this.updateResizeFun.bind(this);
		this.setup();
	}
	var p=createjs.extend(View,createjs.Container);

	p.setup=function(){
		this.smallLogoCont=new createjs.Container();
	};

	p.init=function(){
		this.preloadView=new oG.Views.PreloadView();
		this.cView=this.preloadView;
		this.newViewVar=this.preloadView;
		this.changeView('preload');
	};

	p.preloadComplete=function(){
		this.titleView=new oG.Views.TitleView();
		this.aboutView=new oG.Views.AboutView();
		this.gameView=new oG.Views.GameView();
		this.contentView=new oG.Views.ContentView();
		this.reviewView=new oG.Views.ReviewView();
		this.endView=new oG.Views.EndView();

		//this.mainBack=new createjs.Bitmap(oG.model.back);
		this.mainBack=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.mainBack.gotoAndStop('back');
		this.addChild(this.mainBack);

		this.myBorder=new createjs.Shape();
		this.addChild(this.myBorder);

		this.smallLogo=new createjs.Sprite(oG.model.mainSpriteSheet);
		this.smallLogo.gotoAndStop('miniTitle2');
		//this.smallLogo=new createjs.Bitmap(oG.model.miniTitle);
		this.smallLogoCont.addChild(this.smallLogo);
		opdLib.dispItem(this.smallLogoCont,this,10,8);

		this.musicPlayer=new oG.Modules.MusicPlayer();
		this.addChild(this.musicPlayer);

		this.setupDisplay();
	};

	p.setupDisplay=function(){
		this.myBorder.graphics.clear();
		if(oG.model.orientation===0){
			this.myBorder.graphics.setStrokeStyle(3).beginStroke('#333');
			this.myBorder.graphics.drawRect(1.5,1.5,797,547);
			opdLib.posItem(this.mainBack,0,0);
			this.mainBack.scaleX=1;
			this.mainBack.scaleY=1;
			opdLib.posItem(this.musicPlayer,706,6);
		}else{
			this.myBorder.graphics.setStrokeStyle(4).beginStroke('#333');
			this.myBorder.graphics.drawRect(2,2,546,796);
			this.mainBack.scaleX=8/5.5;
			this.mainBack.scaleY=8/5.5;
			opdLib.posItem(this.mainBack,-320,1);
			opdLib.posItem(this.musicPlayer,456,6);
		}
	};

	p.changeView=function($view){
		this.newViewVar=$view;
		this.cView.deit();
		createjs.Tween.get(this.cView,{loop:false}).to({alpha:0},150).call(this.newViewFun);
	};

	p.newView=function(){
		this.smallLogoCont.visible=true;
		this.removeChild(this.cView);
		switch(this.newViewVar){
			case 'preload':
			this.cView=this.preloadView;
			this.smallLogoCont.visible=false;
			break;
			case 'title':
			this.cView=this.titleView;
			this.smallLogoCont.visible=false;
			break;
			case 'about':
			opdLib.fadeIn(this.smallLogoCont,300,300);
			this.cView=this.aboutView;
			break;
			case 'game':
			this.cView=this.gameView;
			break;
			case 'content-game-fast':
			opdLib.fadeIn(this.smallLogoCont,300,300);
			oG.view.musicPlayer.stop();
			oG.model.gameMode='fast';
			oG.controller.setContentLoadedTarget('game');
			this.cView=this.contentView;
			break;
			case 'content-game-slow':
			opdLib.fadeIn(this.smallLogoCont,300,300);
			oG.view.musicPlayer.stop();
			oG.model.gameMode='slow';
			oG.controller.setContentLoadedTarget('game');
			this.cView=this.contentView;
			break;
			case 'content-review':
			opdLib.fadeIn(this.smallLogoCont,300,300);
			oG.view.musicPlayer.stop();
			oG.controller.setContentLoadedTarget('review');
			this.cView=this.contentView;
			break;
			case 'end':
			this.cView=this.endView;
			break;
			case 'review':
			opdLib.fadeIn(this.smallLogoCont,300,300);
			this.cView=this.reviewView;
			break;
			default:
			break;
		}
		this.addChild(this.cView);
		this.cView.alpha=1;
		this.cView.init();
	};

	p.updateResizeFun=function(){
		oG.model.canvasRatio=opdWrapper.getCanvasRatio();
		if(oG.model.preloadComplete){
			oG.view.endView.scorePane.updateInputs();
			oG.contentController.resizeInputBit();
		}
	};

	p.orientationChangeFun=function(){
		oG.model.orientation=opdWrapper.getOrientation();
		if(oG.model.preloadComplete){
			this.setupDisplay();
			if(oG.model.orientation===0){
			}else{
			}
			this.titleView.orientationChange();
			this.aboutView.orientationChange();
			this.gameView.orientationChange();
			this.contentView.orientationChange();
			this.reviewView.orientationChange();
			this.endView.orientationChange();
		}else{
			this.preloadView.orientationChange();
		}
	};

	oG.View=createjs.promote(View,'Container');
}(opdGame));
