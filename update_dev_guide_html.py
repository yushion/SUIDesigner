# 同时更新 dev-guide.html 文件（主加载文件）
# 从已更新的 dev-guide.js 中提取 HTML 内容，保存为 dev-guide.html

with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.js', 'r', encoding='utf-8') as f:
    js_content = f.read()
    # 去掉外层JS包装，得到纯HTML
    html_updated = js_content[len('window.__devGuideHTML = "'):-2]
    html_updated = html_updated.replace('\\"', '"').replace('\\\\', '\\').replace('\\n', '\n')

print(f"从JS中提取HTML，长度: {len(html_updated)} 字符")

# 保存为 dev-guide.html
with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.html', 'w', encoding='utf-8') as f:
    f.write(html_updated)

print("✓ dev-guide.html 已更新")
print(f"  总长度: {len(html_updated)} 字符")