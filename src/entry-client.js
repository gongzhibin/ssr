import createApp from './app';

// 客户端入口只需创建应用程序，并且将其挂载到DOM
const { app } = createApp();
app.$mount('#app');
