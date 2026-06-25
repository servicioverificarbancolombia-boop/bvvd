import http.server
import urllib.request
import os

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    PROXY_BASE = "https://transacciones.davivienda.com"
    
    def guess_type(self, path):
        if path.endswith('.css.jsf'):
            return 'text/css; charset=utf-8'
        if path.endswith('.js.jsf'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.js.descarga'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.svg.jsf'):
            return 'image/svg+xml; charset=utf-8'
        if path.endswith('.jsf'):
            return 'text/html; charset=utf-8'
        if path.endswith('.descarga'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.woff2') or '.woff2' in path:
            return 'font/woff2'
        if path.endswith('.woff') or '.woff' in path:
            return 'font/woff'
        if path.endswith('.ttf') or '.ttf' in path:
            return 'font/ttf'
        if path.endswith('.eot') or '.eot' in path:
            return 'application/vnd.ms-fontobject'
        if path.endswith('.png') or '.png' in path:
            return 'image/png'
        return super().guess_type(path)

    def do_GET(self):
        # Serve root path with index.html
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        
        file_path = self.translate_path(self.path)
        if os.path.isfile(file_path):
            return super().do_GET()
        
        # Only proxy resource files (fonts, images, etc.), not pages
        resource_extensions = ['.woff2', '.woff', '.ttf', '.eot', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.jsf', '.descarga']
        should_proxy = any(ext in self.path.lower() for ext in resource_extensions)
        
        if not should_proxy:
            self.send_error(404, "File not found")
            return
        
        # Preserve query parameters when proxying
        proxy_url = self.PROXY_BASE + self.path
        print(f"PROXY: {self.path}")
        
        try:
            req = urllib.request.Request(
                proxy_url,
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
                    'Referer': 'https://transacciones.davivienda.com/transaccional/dashboard/',
                }
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                data = response.read()
                content_type = response.headers.get('Content-Type', 'application/octet-stream')
                
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(len(data)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'public, max-age=3600')
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            print(f"PROXY HTTP ERROR: {e.code} {self.path}")
            # Return transparent placeholder for images
            if '.png' in self.path or '.jpg' in self.path or '.jpeg' in self.path or '.gif' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'image/png')
                self.send_header('Content-Length', '68')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(bytes.fromhex('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489000000017352474200aece1ce90000000b4944415408d763600000000800010000000000'))
            # Return empty font for font files
            elif '.woff2' in self.path or '.woff' in self.path or '.ttf' in self.path or '.eot' in self.path:
                self.send_response(200)
                if '.woff2' in self.path:
                    self.send_header('Content-Type', 'font/woff2')
                elif '.woff' in self.path:
                    self.send_header('Content-Type', 'font/woff')
                elif '.ttf' in self.path:
                    self.send_header('Content-Type', 'font/ttf')
                else:
                    self.send_header('Content-Type', 'application/vnd.ms-fontobject')
                self.send_header('Content-Length', '0')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
            # Return empty JS for JS files
            elif '.js' in self.path or '.jsf' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/javascript; charset=utf-8')
                self.send_header('Content-Length', '0')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
            # Return empty CSS for CSS files
            elif '.css' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'text/css; charset=utf-8')
                self.send_header('Content-Length', '0')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
            else:
                self.send_error(404, f"Proxy failed: HTTP {e.code}")
        except Exception as e:
            print(f"PROXY ERROR: {e}")
            self.send_error(404, f"Proxy failed: {e}")

if __name__ == '__main__':
    port = 8080
    server_address = ('', port)
    httpd = http.server.HTTPServer(server_address, CustomHandler)
    print(f'Serving on http://localhost:{port}')
    print(f'Proxying missing resources to {CustomHandler.PROXY_BASE}')
    httpd.serve_forever()