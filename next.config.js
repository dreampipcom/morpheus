const { LOCALES } = require("./lib/cjs-constants")

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const config = {
    async headers() {
        return [
            {
                source: '/',
                headers: [
                  {
                    key: 'X-Dream-Vibe',
                    value: '...Pip!',
                  },
                ],
            },
            {
                source: '/:path',
                headers: [
                  {
                    key: 'X-Dream-Vibe',
                    value: '...Pip!',
                  },
                ],
            },
            {
                source: '/api/nexus/audio',
                headers: [
                  {
                    key: 'Referrer-Policy',
                    value: 'unsafe-url',
                  },
                ],
            },
            {
                source: '/api/nexus/audio/:path',
                headers: [
                  {
                    key: 'Referrer-Policy',
                    value: 'unsafe-url',
                  },
                ],
            },
        ]
    },
    modularizeImports: {
        'lodash': {
            transform: 'lodash/dist/{{member}}',
        },
    },
    productionBrowserSourceMaps: false,
    i18n: {
        locales: LOCALES,
        defaultLocale: "default",
        localeDetection: true,
    },
    images: {
        domains: ['images.contentful.com', 'images.ctfassets.net'],
        formats: ['image/webp'],
    },
    compiler: {
        styledComponents: true
    },
    assetPrefix: 'https://beta.dreampip.com',
    async redirects() {
        return [
            {
                source: '/una',
                destination: 'https://www.notion.so/angeloreale/UNA-United-Natural-Altruists-6246fddb819d4bf28240a6016c613f45?pvs=4',
                permanent: false
            },
            {
                source: '/subscribe',
                destination: 'https://dreampip.sumupstore.com/',
                permanent: false                
            },
            {
                source: '/members/notion',
                destination: 'https://www.notion.so/angeloreale/3ce9a1caba1e4f928b88ada939c73d02?pvs=4',
                permanent: false              
            },
            {
                source: '/members/calendar',
                destination: 'http://calendar.workspace.dreampip.com',
                permanent: false                
            },
            {
                source: '/members/chat',
                destination: 'https://dreampip.slack.com',
                permanent: false                
            },
            {
                source: '/members/mail',
                destination: 'http://mail.workspace.dreampip.com',
                permanent: false                
            },
            {
                source: '/members/storage',
                destination: 'http://storage.workspace.dreampip.com',
                permanent: false                
            },
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
            {
                source: '/chat',
                destination: '/subscribe',
                permanent: true,
            },
            {
                source: '/event/purizu-presents-abrakadabra-with-alabastro-mapa-splinter-dakaza-reale',
                destination: '/event/purizu-presents-abrakadabra-with-mapa-splinter-reale',
                permanent: false,
            },
            {
                source: '/event/purizu-presents-abrakadabra-with-alabastro-mapa-splinter-reale',
                destination: '/event/purizu-presents-abrakadabra-with-mapa-splinter-reale',
                permanent: false,
            },
            {
                source: '/episode/re-flight-dubem-at-karuna-sessions-160-l-2022-10-25',
                destination: '/episode/re-flight-dubem-at-karuna-sessions-161-l-2022-10-25',
                permanent: true,
            },
        ]
    },
    async rewrites() {
        return [
            {"source": "/dash", "destination": "https://nyx.dreampip.com"},
            {"source": "/dash/:match*", "destination": "https://nyx.dreampip.com/dash/:match*"},
            {"source": "/api/v1", "destination": "https://nyx.dreampip.com/api/v1"},
            {"source": "/api/v1/:match*", "destination": "https://nyx.dreampip.com/api/v1/:match*"},
            {"source": "/services", "destination": "https://nyx.dreampip.com/dash/services"},
            {"source": "/services/:match*", "destination": "https://nyx.dreampip.com/dash/services/:match*"},
            {"source": "/app", "destination": "https://alpha.dreampip.com/"},
            {"source": "/app/:match*", "destination": "https://alpha.dreampip.com/:match*"},
            // {
            //     source: '/subscribe',
            //     destination: 'https://members.dreampip.com/',                
            // },
            // {
            //     source: '/members',
            //     destination: 'https://members.dreampip.com/',                
            // },
            {
                source: '/members/calendar',
                destination: 'https://chat.workspace.dreampip.com',                
            },
            {
                source: '/members/chat',
                destination: 'https://chat.workspace.dreampip.com',                
            },
            {
                source: '/members/mail',
                destination: 'https://mail.workspace.dreampip.com',                
            },
            {
                source: '/members/storage',
                destination: 'https://storage.workspace.dreampip.com',                
            },
            {
                source: '/api/nexus/audio/0',
                destination: 'http://207.246.121.205/0',
            },            
            {
                source: '/api/nexus/audio/1',
                destination: 'http://207.246.121.205/1',
            },
        ]
    }
}

module.exports = withBundleAnalyzer(config)