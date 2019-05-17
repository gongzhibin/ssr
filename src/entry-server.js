import createApp from './app';

// 创建和返回应用程序实例
export default (context) => {
    const { app } = createApp(context);
    return app;
};
