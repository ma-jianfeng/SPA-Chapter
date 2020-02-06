/*
 * spa.chat.js
 * Chat feature module for SPA
*/

// 使用附录A中的功能模块模板
/* jslint
 * brower: true, contiune: true, devel: true, indent: 2, maxerr: 50, newcap: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false,white: true
*/

/*global $, spa, getComputedStyle */

// 创建该模块的名字空间, spa.chat
spa.chat = (function () {
    // --------------------- BEGIN MODULE SCOPE VARIABLES -----------------------------
    var
        configMap = {
            main_html: String()
                // 用HTML模板来填充滑块容器
                // 将聊天滑块的 HTML 模板保存在 configMap 中。请随意使用自己的模板来替换这条空洞平凡的消息。
                // + '<div style="padding: 1em; color: #fff">'
                // + 'Say hello to chat'
                // + '</div>',
                + '<div class="spa-chat">'
                    + '<div class="spa-chat-head">'
                        + '<div class="spa-chat-head-toggle">+</div>'
                        + '<div class="spa-chat-head-title">'
                            + 'Chat'
                        + '</div>'
                    + '</div>'
                    + '<div class="spa-chat-closer">x</div>'
                    + '<div class="spa-chat-sizer">'
                        + '<div class="spa-chat-msgs"></div>'
                        + '<div class="spa-chat-box">'
                            + '<input type="text">'
                            + '<div>send</div>'
                        + '</div>'
                    + '</div>'
                + '</div>',

            // 把 chat 的所有设置放到这个模块里
            settable_map: {
                slider_open_time: true,
                slider_close_time: true,
                slider_opened_em: true,
                slider_closed_em: true,
                slider_opened_title: true,
                slider_closed_title: true,

                chat_model: true,
                people_model: true,
                set_chat_anchor: true
            },

            slider_open_time: 250,
            slider_close_time: 250,
            slider_opened_em: 16,
            slider_closed_em: 2,
            slider_opened_title: 'Click to close',
            slider_closed_title: 'Click to open',

            chat_model: null,
            people_model: null,
            set_chat_anchor: null
        },
        stateMap = {
            $append_target: null,
            position_type: 'closed',
            px_per_em: 0,
            slider_hidden_px: 0,
            slider_closed_px: 0,
            slider_opened_px: 0
        },
        jqueryMap = {},

        setJqueryMap, getEmSize, setPxSizes, setSliderPosition, onClickToggle, configModule, initModule;
    // --------------------- END MODULE SCOPE VARIABLES -----------------------------

    // --------------------- BEGIN UTILITY METHODS -----------------------------
    // 添加 getEmSize 方法，把 em 显示单位转换为像素，这样就可以使用 jQuery 的度量方式了
    getEmSize = function(elem) {
        return Number(
            getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
        );
    };
    // --------------------- END UTILITY METHODS -----------------------------

    // --------------------- BEGIN DOM METHODS -----------------------------
    // Begin DOM method /setJqueryMap/
    // 更新 setJQueryMap，缓存大量的 jQuery 集合。我们喜欢使用类而不是ID，因为这允许在页面上添加多个聊天滑块，而不用重构代码。
    setJqueryMap = function () {
        var 
            $append_target = stateMap.$append_target,
            $slider = $append_target.find('.spa-chat');

        jqueryMap = {
            $slider: $slider,
            $head: $slider.find('.spa-chat-head'),
            $toggle: $slider.find('.spa-chat-head-toggle'),
            $title: $slider.find('.spa-chat-head-title'),
            $sizer: $slider.find('.spa-chat-sizer'),
            $msgs: $slider.find('.spa-chat-msgs'),
            $box: $slider.find('.spa-chat-box'),
            $input: $slider.find('.spa-chat-input input[type=text]')
        };
    };
    // End DOM method /setJqueryMap/

    // TODO:2020-02-05

    // 添加 setPxSize 方法，计算由该模块管理的元素的像素尺寸
    // Begin DOM method /setPxSizes/
    setPxSizes = function() {
        var px_per_em, opened_height_em;
        px_per_em = getEmSize(jqueryMap.$slider.get(0));

        opened_height_em = configMap.slider_opened_em;

        stateMap.px_per_em = px_per_em;
        stateMap.slider_closed_px = config.slider_closed_em * px_per_em;
        stateMap.slider_opened_px =opened_height_em * px_per_em;
        jqueryMap.$sizer.css({
            height: (opened_height_em - 2) * px_per_em
        });
    };
    // End DOM method /setPxSizes/

    // 添加 setSliderPosition 方法，依照本章先前的详细说明
    // Begin public method /setSliderPosition/
    // Example: spa.chat.setSliderPosition('closed');
    // Purpose: Move the chat slider to the requested position
    // Arguments: // * position_type - enum('closed', 'opened', or 'hidden')
    // * callback - optional callback to be run end at the end of slider animation.
    // the callback receives a jQuery collection representing the slider div as its single argument
    // Action:
    // This method moves the slider into the requested position.
    // if the requested position is the current position , it returns true without taking further action
    // Returns:
    // * true - The requested position was achieved
    // * false - The requested position was not achieved
    // Throws: none
    // 
    setSliderPosition = function(position_type, callback) {
        var 
            height_px, animate_time, slider_title, toggle_text;

    // return true if slider already in requested position
    if(stateMap.position_type === position_type) {
        return true;
    }

    // prepare animate parameters
    switch(position_type) {
        case 'opened':
            height_px = stateMap.slider_opened_px;
            animate_time = configMap.slider_open_time;
            slider_title = configMap.slider_opened_title;
            toggle_text = '=';
        break;

        case 'hidden':
            height_px = 0;
            animate_time = configMap.slider_open_time;
            slider_title = '';
            toggle_text = '+';
        break;

        case 'closed':
            height_px = stateMap.slider_closed_px;
            animate_time = configMap.slider_close_time;
            slider_title = configMap.slider_closed_title;
            toggle_text = '+';
        break;
        // bail for unknown position_type
        default: return false;
    }
    // TODO: 2020-02-06 周四
    }
    
    // --------------------- END DOM METHODS -----------------------------

    // --------------------- BEGIN EVENT HANDLERS -----------------------------
    // --------------------- END EVENT HANDLERS -----------------------------

    // --------------------- BEGIN PUBLIC METHODS -----------------------------
    // Begin public method /configMoudle/
    // 创建 configModule 方法。每当功能模块接收设置(settings)时，我们总是使用相同的方法名和同一个 set.util.setConfigMap 工具方法。
    // Purpose: Adjust configuration of allowed keys
    // Arguments: A map of settable keys and values
    //   * color_name - color to use
    // Settinngs:
    //   * configMap.settable_map declares allowed keys
    // Returns: true
    // Throws: none
    // 
    configModule = function (input_map) {
        spa.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };
    // End public method /configModule/

    // 添加 initModule 方法。几乎所有的模块都有这个方法。由它开始执行模块。
    // Begin public method /initModule/
    // Purpose: Initializes module
    // Arguments:
    //   * $container the jquery element used by this feature
    // Returns: true
    // Throws: none
    // 
    initModule = function ($container) {
        // 使用 HTML 模板填充聊天滑块容器。
        $container.html(configMap.main_html);
        stateMap.$container = $container;
        setJqueryMap();
        return true;
    };
    // End public method /initModule/

    // return public methods
    // 导出模块方法 configModule 和 initModule。这两个方法几乎是所有功能模块的标配方法。
    return {
        configModule: configModule,
        initModule: initModule
    };
    // --------------------- END PUBLIC METHODS -----------------------------

}())