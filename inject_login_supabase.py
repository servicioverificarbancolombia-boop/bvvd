with open(r'd:\Emprender\chichones\dvvda\login.html', 'r', encoding='utf-8') as f:
    content = f.read()
if 'login_supabase_integration.js' not in content:
    content = content.replace('</body>', '<script src="./login_supabase_integration.js"></script>\n</body>')
    with open(r'd:\Emprender\chichones\dvvda\login.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Script de login Supabase inyectado exitosamente')
else:
    print('Script ya estaba presente')