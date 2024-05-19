import { defineConfig } from 'vite';
import path from 'path';
// import xmlHMR from './tools/vite-plugins/xml-hmr';
// import FullReload from 'vite-plugin-full-reload';
// import OwlTplReload from './tools/vite-plugins/owl-template-hmr';

// const APPSERVER = import.meta.env.VITE_PROXY_SERVER;

// https://vitejs.dev/config/
export default ({ mode }) => {
    // process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    return defineConfig({
        resolve: {
            // alias: {
            //     // '@': path.resolve(__dirname, './src'),
            //     '@web': path.resolve(__dirname, './src/x-odoo/web'),
            //     // '@assets': path.resolve(__dirname, './src/assets'),
            //     // '@components': path.resolve(__dirname, './src/components'),
            // },
            alias: [
                { find: '@web', replacement: path.resolve(__dirname, 'src/lib/odoo/web') },
                { find: '@xml', replacement: path.resolve(__dirname, 'src/lib/xml') },
            ],
        },
        build: {
            target: 'esnext',
        },
        plugins: [
            // xmlHMR(),
            // // FullReload(['public/owl_templates.xml']),
            // OwlTplReload(['src/**/*.xml']),
        ],
        // server: {
        //     port: 3000,
        //     proxy: {
        //         //   // '/api/socket': 'ws://localhost:8082',
        //         //   // '/web': 'http://localhost:8069',
        //         //   '/mobile': 'http://localhost:8069',
        //         // '/mobile': 'http://localhost:8060',
        //         '/mobile': process.env.VITE_PROXY_SERVER,
        //         //   // "proxy": "http://localhost:8069",
        //     },
        // },

        define: {
            // 'process.env': {...process.env, ...loadEnv(mode, process.cwd()) }
            // 'process.env': process.env,
        },
    });
    // console.log('ENV:', result)
    // return result;
};
