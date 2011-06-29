var win1 = Ti.UI.currentWindow;
var activity = Ti.Android.currentActivity;
var actInd = Titanium.UI.createActivityIndicator({
		bottom:10,
		height:50,
		width:10,
		message: 'Loading...'
});
activity.onCreateOptionsMenu = function(e) {
	var menu = e.menu;
	var menuItem = menu.add({title: 'Refresh'});
	menuItem.setIcon(Titanium.Android.R.drawable.ic_popup_sync);
	var menuItem = menu.add({title: 'Choose Country'});
	menuItem.setIcon(Titanium.Android.R.drawable.ic_dialog_map);
	menuItem.addEventListener('click', function(e) {
		var countryData = JSON.parse(request.responseText);
		var countriesDialog = Ti.UI.createOptionDialog({
			title: 'Choose Country',
			destructive: 1,
			cancel: 2,
			options: countryList
		});
		countriesDialog.addEventListener('click', function(event) {
			Ti.API.info(countryList[event.index]);
			Ti.API.info(data.countries[event.index][countryList[event.index]]);
		});
		countriesDialog.buttonNames = ['Cancel'];
		countriesDialog.show();
	});
};

var request = Ti.Network.createHTTPClient();
var data;
var countryList = [];
var scoresTable = Ti.UI.createTableView();
win1.add(scoresTable);

request.open("GET",'http://192.168.0.107/livescores.localhost/index.php');
request.onload = function() {
	var tableData = [];
	data = JSON.parse(this.responseText);
	//Ti.API.log("raw data", this.responseText);
	//Ti.API.log("json", data[0]);
	for each (var obj in data.countries) {
		for (var country in obj) {
			countryList.push(country);
		};
	};
	for each (var row in data.scores) {
		if (row.type == "section") {
			var sectionRow = Ti.UI.createTableViewRow({
				backgroundColor: "#9E9E9E",
				className: 'section',
				height: 35
			});
			var sectionLabel = Ti.UI.createLabel({
				text: row.sectiontitle,
				color: '#ffffff',
				className: 'section',
				backgroundColor: "#9E9E9E",
				font: {
					fontWeight: 'bold'
				},
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				textAlign: 'right'
			});
			sectionRow.add(sectionLabel);
			tableData.push(sectionRow);
		};
		if (row.type == "matchday") {
			var matchdayRow = Ti.UI.createTableViewRow({
				backgroundColor: "#9E9E9E",
				className: 'matchday',
				height: 20
			});
			var dateLabel = Ti.UI.createLabel({
				text: row.date,
				color: '#ffffff',
				backgroundColor: "#9E9E9E",
				right: 0
			});
			var timeLabel = Ti.UI.createLabel({
				text: row.time,
				color: '#ffffff',
				backgroundColor: "#9E9E9E",
				left: 0
			});
			matchdayRow.add(dateLabel);
			matchdayRow.add(timeLabel);
			tableData.push(matchdayRow);
		};
		if (row.type == "match") {
			var matchRow = Ti.UI.createTableViewRow({
				backgroundColor: "#ffffff",
				className: 'match'
			});
			if (row.matchtime != "FT" && (row.matchtime.indexOf(":") == -1)) {
				var matchTimeLabel = Ti.UI.createLabel({
					text: row.matchtime,
					color: '#9E9E9E',
					left: 10
				});
				var progressImage = Ti.UI.createImageView({
					url: 'images/football1.jpg',
					width: 10,
					height: 10,
					left: 0
				})
				matchRow.add(progressImage);
			} else if (row.matchtime.indexOf(":") > -1) {
				var matchTimeLabel = Ti.UI.createLabel({
					text: row.matchtime,
					color: '#9E9E9E',
					left: 0
				});
			} else {
				var matchTimeLabel = Ti.UI.createLabel({
					text: row.matchtime,
					color: '#9E9E9E',
					left: 8
				});
			}
			var firstTeamLabel = Ti.UI.createLabel({
				text: row.firstteam,
				color: '#9E9E9E',
				left: 50,
				top: 4
			});
			var secondTeamLabel = Ti.UI.createLabel({
				text: row.secondteam,
				color: '#9E9E9E',
				left: 50,
				bottom: 4
			});
			var scoreFirstTeamLabel = Ti.UI.createLabel({
				text: row.scorefirstteam,
				color: '#9E9E9E',
				right: 10,
				top: 4
			});
			var scoreSecondTeamLabel = Ti.UI.createLabel({
				text: row.scoresecondteam,
				color: '#9E9E9E',
				right: 10,
				bottom: 4
			});
			matchRow.add(matchTimeLabel);
			matchRow.add(firstTeamLabel);
			matchRow.add(secondTeamLabel);
			matchRow.add(scoreFirstTeamLabel);
			matchRow.add(scoreSecondTeamLabel);
			tableData.push(matchRow);
		};
	};
	scoresTable.setData(tableData);
	actInd.hide();
};
		
win1.addEventListener('open', function(event) {
	actInd.show();
	request.send();
});
