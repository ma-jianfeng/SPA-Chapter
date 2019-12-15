/** 
 * spa.js
 * Root namespace module
*/

// 按照附錄 A 中的模塊模板，設置 JSlint 開關。
/*jslint
	browser: true, continue: true, devel: true, indent: 2, maxerr: 50,
	regexp: true, nomen: true, plusplus: true, white: true
*/

// 告訴 JSlint, spa 和 $ 是全局變量。如果發現在此清單的 spa 之後要添加自己的變量，那大概說明我們有什麼地方做錯了。
/*global $, spa */

// 使用第2章的模塊模式來創建 "spa" 名字空間。這個模塊導出了一個方法：initModule 函數。 initModule，顧名思義，是初始化應用的函數。
var spa = (function () {
	var initModule = function ($container) {
		spa.shell.initModule($container);
		// $container.html(
		// 	'<h1 style="display:inline-block; margin: 25px;">'
		// 	+ 'hello world!'
		// 	+ '</h1>'
		// )
	};

	return { initModule: initModule };
}());