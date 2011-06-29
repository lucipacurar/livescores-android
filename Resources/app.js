// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
	title:'Livescores',
	backgroundColor:'#fff',
	tabBarHidden: true,
	navBarHidden: false,
	fullscreen: false,
	exitOnClose: true,
	url:'win.js'
});
// open tab group
win1.open();
