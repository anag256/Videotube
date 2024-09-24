import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Here
    strictPort: true,
    port: (process.env.VITE_PORT) as any,  //turn on for docker setup
  },
  build: {
		minify: true,
	},
  base:'/',
  // server:{
  //   proxy:{
  //     '/api':{
  //       target:'http://localhost:8000/',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     }
  //   }
  // }

});
