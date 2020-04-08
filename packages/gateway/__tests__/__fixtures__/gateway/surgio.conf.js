'use strict';

module.exports = {
  artifacts: [
    {
      name: 'test.conf',
      template: 'test',
      provider: 'ss',
      combineProviders: ['custom', 'clash'],
    },
    {
      name: 'test2.conf',
      template: 'test',
      provider: 'rename',
    },
    {
      name: 'test3.conf',
      template: 'test',
      provider: 'subscription-userinfo',
    },
    {
      name: 'custom-params.conf',
      template: 'custom-params',
      provider: 'ss',
      combineProviders: ['custom', 'clash'],
      customParams: {
        foo: 'original',
        child: {
          bar: 'original',
        },
      },
    },
  ],
  urlBase: 'https://example.com/',
  binPath: {
    shadowsocksr: '/usr/local/bin/ssr-local',
    v2ray: '/usr/local/bin/v2ray',
  },
  gateway: {
    accessToken: 'abcd',
    auth: true,
  },
  surgeConfig: {
    v2ray: 'native',
  },
  customFilters: {
    globalFilter: node => node.nodeName === '🇺🇲 US',
  },
};
