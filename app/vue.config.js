module.exports = {
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = `${process.env.VUE_APP_TITLE}`;
      return args;
    });
  },
}
