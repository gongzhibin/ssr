import createApp from './app';

// 创建和返回应用程序实例
export default context => new Promise((resolve, reject) => {
    const { app, router, store } = createApp(context);

    // 设置服务器端router的位置
    router.push(context.url);

    // 等到router将可能的异步组件和钩子函数解析完
    router.onReady(() => {
        const matchedComponents = router.getMatchedComponents();
        // 匹配不到的路由，执行 reject 函数，并返回 404
        if (!matchedComponents) {
            reject({ code: 404 });
            return;
        }
        Promise.all(matchedComponents.map((component) => {
            if (component.asyncData) {
                return component.asyncData({
                    store,
                    router: router.currentRoute
                });
            }
        })).then(() => {
            // 在所有预取钩子(preFetch hook) resolve 后，
            // 我们的 store 现在已经填充入渲染应用程序所需的状态。
            // 当我们将状态附加到上下文，
            // 并且 `template` 选项用于 renderer 时，
            // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
            context.state = store.state;

            // Promise 应该 resolve 应用程序实例，以便它可以渲染
            resolve(app);
        }).catch(reject);
    });
});

