

(function(oG){//checked
	var userUrlLoc='https://www.gamestolearnenglish.com/userContent/scripts/getWPUser.php';
	var regUrlLoc='https://www.gamestolearnenglish.com/wp-login.php?action=register';
	var logUrlLoc='https://www.gamestolearnenglish.com/wp-login.php';
	var contentUrlLoc='https://www.gamestolearnenglish.com/userContent/scripts/myContentSender.php';
	var fileSizeLimLoc=50000;
	var lettersOnlyLoc=false;
//this diff for span
	var contentLimArrayLoc=[30,20,20,20,10,19,30,29,20,18,26,30,20,21,29,29,20,19,40,20,20,28,26];
	var audioClipLengthLoc=2000;
	var imageContentFolderLoc='../../../content_2/images/';
	var audioContentFolderLoc='../../../content_2/audio/';
	var descriptionsFolderLoc='../../../content_2/descText/';
	var imageSizeFolder100Loc='size100/';
	var imageSizeFolder120Loc='size120/';
	var userUploadLimitLoc=20;
	var totalUploadLimitLoc=200;
	var userFilesUrlLoc='./../../../userContent/files/';
	var userJsonsUrlLoc='./../../../userContent/jsons/';
	var getPresetHashOnLoc=true;

	var out={
		userUrl:userUrlLoc,
		regUrl:regUrlLoc,
		logUrl:logUrlLoc,
		contentUrl:contentUrlLoc,
		fileSizeLim:fileSizeLimLoc,
		lettersOnly:lettersOnlyLoc,
		contentLimArray:contentLimArrayLoc,
		audioClipLength:audioClipLengthLoc,
		imageContentFolder:imageContentFolderLoc,
	 	audioContentFolder:audioContentFolderLoc,
		imageSizeFolder100:imageSizeFolder100Loc,
		imageSizeFolder120:imageSizeFolder120Loc,
		userUploadLimit:userUploadLimitLoc,
		totalUploadLimit:totalUploadLimitLoc,
		userFilesUrl:userFilesUrlLoc,
		userJsonsUrl:userJsonsUrlLoc,
		getPresetHashOn:getPresetHashOnLoc,
		descriptionsFolder:descriptionsFolderLoc
	};
	oG.contentSettings=out;
}(opdGame));

