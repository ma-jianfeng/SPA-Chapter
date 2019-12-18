/*
 * spa.chat.js
 * Chat feature module for SPA
*/

/* jslint
 * brower: true, contiune: true, devel: true, indent: 2, maxerr: 50, newcap: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false,white: true
*/

/*global $, spa */

// 创建该模块的名字空间, spa.chat
spa.chat = (function () {
    // --------------------- BEGIN MODULE SCOPE VARIABLES -----------------------------
    var
        configMap = {
            main_html: String()
                // 将聊天滑块的 HTML 模板保存在 configMap 中。请随意使用自己的模板来替换这条空洞平凡的消息。
                + '<div style="padding: 1em; color: #fff">'
                + 'Say hello to chat'
                + '</div>',
            settable_map: {}
        },
        stateMap = { $container: null },
        jqueryMap = {},

        setJqueryMap, configModule, initModule;
    // --------------------- END MODULE SCOPE VARIABLES -----------------------------

    // --------------------- BEGIN UTILITY METHODS -----------------------------
    // --------------------- END UTILITY METHODS -----------------------------

    // --------------------- BEGIN DOM METHODS -----------------------------
    // Begin DOM method /setJqueryMap
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = { $container: $container };
    };
    // End DOM method /setJqueryMap
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