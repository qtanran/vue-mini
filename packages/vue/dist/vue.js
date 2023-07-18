var Vue = (function (exports) {
    'use strict';

    /**
     * effect 函数
     * @param fn 执行方法
     */
    function effect(fn) {
        // 生成 ReactiveEffect 实例
        const _effect = new ReactiveEffect(fn);
        // 执行 run 函数
        _effect.run();
    }
    // 单例的，当前的 effect
    let activeEffect;
    /**
     * 响应性触发依赖时的执行类
     */
    class ReactiveEffect {
        constructor(fn) {
            this.fn = fn;
        }
        run() {
            // 为 activeEffect 赋值
            activeEffect = this;
            // 执行 fn 函数
            return this.fn();
        }
    }
    /**
     * 收集所有依赖的 WeakMap 实例：
     * key：响应性对象
     * value：Map 对象
     *    key：响应性对象的指定属性
     *    value：指定对象的指定属性的 执行函数
     */
    const targetMap = new WeakMap();
    /**
     * 用于收集依赖的方法
     * @param target WeakMap 的 Key
     * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
     */
    function track(target, key) {
        // 如果当前不存在执行函数，则直接 return
        if (!activeEffect)
            return;
        // 尝试从 targetMap 中，根据 target 获取 map
        let depsMap = targetMap.get(target);
        // 如果获取到的 map 不存在，则生成新的 map 对象，并把该对象赋值给对应的 value
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        // 为指定 map，指定 key 设置回调函数
        depsMap.set(key, activeEffect);
        console.log(targetMap);
    }
    /**
     * 触发依赖的方法
     * @param target WeakMap 的 key
     * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
     * @param newValue 指定 key 的最新值
     */
    function trigger(target, key, newValue) {
        console.log('trigger 触发依赖');
    }

    /**
     * getter 回调方法
     */
    const get = createGetter();
    /**
     * 创建 getter 回调方法
     */
    function createGetter() {
        return function (target, key, receiver) {
            // 利用 Reflect 得到返回值
            const res = Reflect.get(target, key, receiver);
            // 收集依赖
            track(target, key);
            return res;
        };
    }
    /**
     * setter 回调方法
     */
    const set = createSetter();
    /**
     * 创建 setter 回调方法
     */
    function createSetter() {
        return function (target, key, value, receiver) {
            // 利用 Reflect.set 设置新值
            const result = Reflect.set(target, key, value, receiver);
            // 触发依赖
            trigger();
            return result;
        };
    }
    /**
     * 响应性的 handler
     */
    const mutableHandlers = {
        get,
        set
    };

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

    exports.effect = effect;
    exports.reactive = reactive;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=vue.js.map
