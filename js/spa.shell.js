/** 
 * spa.shell.js
 * Shell module for SPA
 */

/** jslint
	brower: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
	nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
 */

/*global $, spa */

spa.shell = (function () {
	// 声明所有在名字空间(即 "Module Scope" 区块，这里是 spa.shell)内可用的变量。
	// ------------------- BEGIN MODULE SCOPE BARIBALES --------------------
	var
		// 把静态配置值放在 configMap 变量中。
		configMap = {
			// 定义给 uriAnchor 使用的映射，用于验证。
			anchor_schema_map: {
				chat: { open: true, closed: true }
			},
			main_html: String()      //缩进 HTML 字符串。这有助于理解并易于维护。
				+ '<div class="spa-shell-head">'
				+ '<div class="spa-shell-head-logo"></div>'
				+ '<div class="spa-shell-head-acct"></div>'
				+ '<div class="spa-shell-head-search"></div>'
				+ '</div>'
				+ '<div class="spa-shell-main">'
				+ '<div class="spa-shell-main-nav"></div>'
				+ '<div class="spa-shell-main-content"></div>'
				+ '</div>'
				+ '<div class="spa-shell-foot"></div>'
				+ '<div class="spa-shell-chat"></div>'
				+ '<div class="spa-shell-modal"></div>',

			// 根据需求1: "开发人员能够配置滑块运动的速度和高度"，在模块配置映射中保存收起和展开的时间和高度。
			chat_extend_time: 1000,
			chat_retract_time: 300,
			chat_extend_height: 450,
			chat_retract_height: 15,
			// 根据需求1: "设置提醒信息文字来提示用户操作......",在 configMap 变量中添加收起时和展开时的标题文字。
			chat_extended_title: 'Click to retract',
			chat_retracted_title: 'Click to extend'
		},
		// 将在整个模块中共享的动态信息放在 stateMap 变量中。
		stateMap = {
			$container: null,
			// 将当前锚的值保存在表示模块状态的映射中: stateMap.anchor_map 。
			anchor_map: {},
			// 在 stateMap 里面添加 is_chat_retracted 。在 stateMap 里面列出所有会用到的键是一种很好的做法，容易找到和查看。这会在 toggleChat 方法里面用到。
			is_chat_retracted: true
		},
		// 将 jQuery 集中缓存在 jqueryMap 中。
		jqueryMap = {},

		// 声明三个额外的方法: copyAnchorMap、changeAnchorPart 和 onHashchange 。
		// 此部分声明所有模块作用域内的变量。很多都是在之后赋值。
		// 在模块作用域的函数名字列表中添加 onClickChat 。
		copyAnchorMap, setJqueryMap, toggleChat, changeAncorPart, onHashchange, onClickChat, initModule;        // 在模块作用域变量列表中，添加 toggleChat 方法。

	// --------------- END MODULE SCOPE VARIABLES ------------------

	// "Utility Methods" 保留区块，这些函数不和页面元素交互。
	// --------------- BEGIN UTILITY METHODS -----------------
	// 使用 jQuery 的 extend() 工具方法来复制对象。这是必须的，因为所有的 JavaScript 对象都是按引用传递的，正确的复制一个对象不是件容易的事儿。
	// Returns copy of stored anchor map; minimizes overhead
	copyAnchorMap = function () {
		return $.extend(true, {}, stateMap.anchor_map);
	};
	// --------------- END UTILITY METHODS -----------------

	// 将创建和操作页面元素的函数放在 "DOM Methods" 区块中。
	// --------------- BEGIN DOM METHODS --------------------
	// Begin DOM method /setJqueryMap/
	// 使用 setJqueryMap 来缓存 jQuery 集合。几乎我们编写的每个 shell 和功能模块都应该有这个函数。 jqueryMap缓存的用途是可以大大的减少 jQuery 对文档的遍历次数，能够提高性能。
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { $container: $container };

		// 将聊天滑块的 jQuery 集合缓存到 jqueryMap 中。
		jqueryMap = {
			$container: $container,
			$chat: $container.find('.spa-shell-chat')
		};
	};

	// End DOM Method /setJqueryMap/
	// 根据需求2: "创建单个方法来展开或者收起聊天滑块"，添加 toggleChat 方法。

	// Begin DOM method /toggleChat/
	// Purpose: Extends or retracts chat slider
	// Arguments:
	//     * do_extend - if true, extends slider; if false retracts
	//     * callback - optional function to execute at end of animation
	// Settings:
	// 	   * chat_extend_time, chat_retract_time
	// 	   * chat_extend_height, chat_retract_height
	// Returns: boolean
	// 	   * true - slider animation activated
	// 	   * false - slider animation not activated
	// State: sets stateMap.is_chat_retracted
	// 更新 toggleChat API 文档，指出该方法是如何设置 stateMap.is_chat_retracted 的。
	//     *true - slider is retracted
	//     *false - slider is extended
	// 	   
	toggleChat = function (do_extend, callback) {
		var
			px_chat_ht = jqueryMap.$chat.height(),
			is_open = px_chat_ht === configMap.chat_extend_height,
			is_closed = px_chat_ht === configMap.chat_retract_height,
			is_sliding = !is_open && !is_closed;

		// avoid race condition
		// 根据需求3: "避免出现竞争条件，即滑块可能同时在展开和收起", 如果滑块已经在运动中，则拒绝执行操作，防止出现竞争条件。
		if (is_sliding) { return false; }

		// Begin extend chat slider
		if (do_extend) {
			jqueryMap.$chat.animate(
				{ height: configMap.chat_extend_height },
				configMap.chat_extend_time,
				function () {
					jqueryMap.$chat.attr(
						'title', configMap.chat_extended_title
					);
					stateMap.is_chat_retracted = false;
					// 根据需求4: "开发人员能够传入一个可选的回调函数，会在滑块运动结束时调用", 在动画完成后调用回调函数。
					if (callback) { callback(jqueryMap.$chat); }
				}
			);
			return true;
		}
		// End exend chat slider

		// Begin retract chat slider
		jqueryMap.$chat.animate(
			{ height: configMap.chat_retract_height },
			configMap.chat_retract_time,
			function () {
				// 根据需求1: "设置提示信息文字来提示用户操作......"，修改 toggleChat 来控制光标悬停文字以及 stateMap.is_chat_retracted 的值。
				jqueryMap.$chat.attr(
					'title', configMap.chat_retracted_title
				);
				stateMap.is_chat_retracted = true;

				if (callback) {
					callback(jqueryMap.$chat);
				}
			}
		);
		return true;
		// End retract chat slider
	};
	// End DOM method /toggleChat

	// Begin DOM methods /changeAnchorPart/
	// 添加 changeAnchorPart 工具方法对锚进行原子更新(atomically update)。它接收一个映射，是想更改的内容，比如{chat: 'open'}，只会更新锚组件中的这个指定键所对应的值。
	// Purpose: Changes part of the URI anchor component
	// Arguments:
	//     * arg_map - The map describing what part of the URI anchor we want changed.
	// Returns: Boolean
	//     * true - the Anchor portion of the URI was update
	//     * false - the Anchor portion of the URI could not be updated
	// Action: 
	//   The current anchor rep stored in stateMap.anchor_map.
	//   See uriAnchor for a discussion of encoding.
	//   This methods
	//     * Creates a copy of this map using copyAnchorMap().
	//     * Modifies the key-values using arg_map.
	//     * Manages the distinction between independent and dependent values in the encoding.
	//     * Attempts to change the URI using uriAnchor.
	//     * Returns true on success, and false on failure.
	// 
	changeAnchorPart = function (arg_map) {
		var
			anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name, key_name_dep;

		// Begin merge changes into anchor map
		KEYVAL:
		for (key_name in arg_map) {
			if (arg_map.hasOwnProperty(key_name)) {

				// skip dependent keys during iteration
				if (key_name.indexOf('_') === 0) {
					continue KEYVAL;
				}

				// update independent key value
				anchor_map_revise[key_name] = arg_map[key_name];

				// update matching dependent key
				key_name_dep = '_' + key_name;
				if (arg_map[key_name_dep]) {
					anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
				}
				else {
					delete anchor_map_revise[key_name_dep];
					delete anchor_map_revise['_s' + key_name_dep];
				}
			}
		}
		// End merge changes into anchor map

		// 如果不能通过模式(schema)验证就不设置锚(uriAnchor 会抛出异常)。当发生这样的情况时，把锚组件回滚到它之前的状态。
		// Begin attempt to update URI; revert if not successful
		try {
			$.uriAnchor.setAnchor(anchor_map_revise);
		}
		catch (error) {
			// replace URI with existing state
			$.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
			bool_return = false;
		}
		// End attempt to update URI...

		return bool_return;
	};
	// End DOM methods /changeAnchorPart/

	// --------------- END DOM METHODS -------------------

	// 为 jQuery 事件处理函数保留的 "Event Handlers" 区块。
	// --------------- BEGIN EVENT HANDLERS --------------------
	// 添加 onHashchange 事件处理程序来处理 URI 锚变化。使用 uriAnchor 插件来将锚转换为映射，与之前的状态比较，以便确定要采取的动作。如果提议的锚变化是无效的，则将锚重置为之前的值。
	// Brgin Event handler /onHashchange/
	// Purpose: Handles the hashchange event
	// Arguments:
	//   * event - jQuery event object.
	// Settings: none
	// Returns: false
	// Action:
	//   * Parses the URI anchor component
	//   * Compares proposed application state with current
	//   * Adjust the application only where proposed state differs from existing
	// 
	onHashchange = function (event) {
		var
			anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed,
			_s_chat_previous, _s_chat_proposed,
			s_chat_proposed;

		// attempt to parse anchor
		try {
			anchor_map_proposed = $.uriAnchor.makeAnchorMap();
		}
		catch (error) {
			$.uriAnchor.setAnchor(arg_map_previous, null, true);
			return false;
		}
		stateMap.anchor_map = anchor_map_proposed;

		// convenience vars
		_s_chat_previous = anchor_map_previous._s_chat;
		_s_chat_proposed = anchor_map_proposed._s_chat;

		// Begin adjust chat component if changed
		if (!anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
			s_chat_proposed = anchor_map_proposed.chat;
			switch (s_chat_proposed) {
				case 'open':
					toggleChat(true);
					break;
				case 'closed':
					toggleChat(false);
					break;
				default:
					toggleChat(false);
					delete anchor_map_proposed.chat;
					$.uriAnchor.setAnchor(anchor_map_proposed, null, true);
			}
		}
		// End adjust chat component if changed

		return false;
	};
	// End Event handler /onHashchange/

	// 修改 onClickChat 事件处理程序，只修改锚的 chat 参数。
	// Begin Event handler /onClickChat/
	// 根据需求2: "添加点击事件处理程序来调用 toggleChat", 添加 onClickChat 事件处理程序。
	onClickChat = function (event) {
		// toggleChat(stateMap.is_chat_retracted);
		// if (toggleChat(stateMap.is_chat_retracted)) {
		// 	$uriAnchor.setAnchor({
		changeAnchorPart({
			chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
		});
		// });
		// };
		return false;
	};
	// End Event handler /onClilckChat/
	// --------------- END EVENT HANDLERS --------------------

	// 将公开的方法放在 "Public Methods" 区块中。
	// --------------- BEGIN PUBLIC METHODS -----------------
	// Begin Public method /initModule/
	// 创建 initModule 公开方法，用于初始化模块。
	initModule = function ($container) {
		// load HTML and map jQuery collections
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

		// test toggle
		// 根据需求5: "创建测试代码，以便确保滑块功能正常"，在页面加载完后过3秒，展开滑块，过8秒后收起滑块。
		// setTimeout(function() {
		// 	toggleChat(true);
		// }, 3000);
		// setTimeout(function() {
		// 	toggleChat(false);
		// }, 8000);

		// 设置 stateMap.is_chat_retracted 的值和光标悬停文字，初始化事件处理程序。然后根据需求3: "将点击事件处理程序绑定到 jQuery 事件上"，给点击事件绑定事件处理程序。
		stateMap.is_chat_retracted = true;
		jqueryMap.$chat
			.attr('title', configMap.chat_retracted_title)
			.click(onClickChat);

		// 配置 uriAnchor 插件，用于检测模式(schema)。
		// config uriAnchor to use our schema
		$.uriAnchor.configModule({
			schema_map: configMap.anchor_schema_map
		});

		// configure and initializes feature modules
		spa.chat.configModule({});
		spa.chat.initModule(jqueryMap.$chat);

		// Handle URI anchor change events.
		// This id done /after/ all feature modules are configured and initialized, otherwise they will not be ready to handle the trigger event, which is used to ensure the anchor is considered on-load
		// 
		// 绑定 hashchange 事件处理程序并立即触发它，这样模块会在初始加载时就会处理书签。
		$(window)
			.bind('hashchange', onHashchange)
			.trigger('hashchange');

	};
	// End PUBLIC method /initModule/

	// 显式的导出公开方法，以映射 (map) 的形式返回。目前可用的只有 initModule。

	return { initModule: initModule };

	// --------------- END PUBLIC METHODS -----------------

}()); 