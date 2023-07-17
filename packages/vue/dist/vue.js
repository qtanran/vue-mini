var Vue = (function (exports) {
    'use strict';

    /**
     * 响应性的 handler
     */
    const mutableHandlers = {};

    /**
     * 响应性 Map 缓存对象
     * key: target
     * val: proxy
     */
    const reactiveMap = new WeakMap();
    /**
     * 为复杂数据类型，创建响应性对象
     * @param target
     * @return 代理对象
     */
    function reactive(target) {
        return createReactiveObject(target, mutableHandlers, reactiveMap);
    }
    /**
     * 创建响应性对象
     * @param target 被代理对象
     * @param baseHandlers
     * @param proxyMap
     */
    function createReactiveObject(target, baseHandlers, proxyMap) {
        // 如果该实例已经被代理，直接读取即可
        const existingProxy = proxyMap.get(target);
        if (existingProxy) {
            return existingProxy;
        }
        // 未被代理则生成 proxy 实例
        const proxy = new Proxy(target, baseHandlers);
        // 缓存代理对象
        proxyMap.set(target, proxy);
        return proxy;
    }

    exports.reactive = reactive;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=vue.js.map
