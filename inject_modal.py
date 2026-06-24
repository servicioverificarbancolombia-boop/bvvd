with open(r'd:\Emprender\chichones\dvvda\dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()
if 'modal_seguridad.js' not in content:
    content = content.replace('</body>', '<script src="./modal_seguridad.js"></script>\n</body>')
    with open(r'd:\Emprender\chichones\dvvda\dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Script tag inserted successfully')
else:
    print('Script tag already present')