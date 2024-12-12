import { createProxyMiddleware } from 'http-proxy-middleware';
import { BASE_URL } from './utils/api';

export default function(app) 
{
  app.use(
    '/api',
    createProxyMiddleware(
    {
      target: BASE_URL,
      changeOrigin: true,
    })
  );
};