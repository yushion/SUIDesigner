# 修复 source 溯源表的更新
import re

with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.html.backup', 'r', encoding='utf-8') as f:
    html = f.read()

# 先读取刚才生成的文件（之前已经做了其他7处修改）
with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.js', 'r', encoding='utf-8') as f:
    js_content = f.read()
    # 去掉外层JS包装，得到纯HTML
    html_updated = js_content[len('window.__devGuideHTML = "'):-2]
    html_updated = html_updated.replace('\\"', '"').replace('\\\\', '\\').replace('\\n', '\n')

print(f"读取已更新的HTML，长度: {len(html_updated)} 字符")

# 查找 source 溯源表位置
old_section = '<h4>5.4 source 溯源标记 — 三层检测优先级</h4>'
new_section = '<h4>5.4 source 溯源标记 — 五层智能识别</h4>'

if old_section in html_updated:
    # 找到从这个 h4 到下一个 </div> 之间的内容
    start_idx = html_updated.find(old_section)
    # 找到结束位置（下一个 <!-- 六、 或 <h3>）
    end_marker = '<!-- 六、命令执行 -->'
    end_idx = html_updated.find(end_marker, start_idx)
    
    old_block = html_updated[start_idx:end_idx]
    print(f"找到 source 溯源区块，长度: {len(old_block)} 字符")
    
    new_block = '''<h4>5.4 source 溯源标记 — 五层智能识别</h4>
      <p>每个事件消息中携带 <code>source</code> 字段，标识控件是通过哪一层识别到的：</p>
      <table>
        <thead><tr><th>source 值</th><th>层级</th><th>含义</th><th>示例场景</th></tr></thead>
        <tbody>
          <tr><td><code>explicit</code></td><td>Layer 1</td><td>通过 data-ctrl-type 显式声明</td><td>设计器导出的控件，最高优先级</td></tr>
          <tr><td><code>aria</code></td><td>Layer 2</td><td>通过 ARIA role 语义化识别</td><td>role="button"、role="checkbox" 等</td></tr>
          <tr><td><code>css</code></td><td>Layer 3</td><td>通过 CSS class 名称检测</td><td>复杂控件子元素（listBox_item、dataGrid_cell 等）</td></tr>
          <tr><td><code>structure</code></td><td>Layer 4</td><td>通过 DOM 结构特征推断</td><td>ul/li 列表、table/tr/td 表格等</td></tr>
          <tr><td><code>native</code></td><td>Layer 5</td><td>通过原生 HTML 标签自动推断</td><td>&lt;button&gt;、&lt;input type="text"&gt; 等</td></tr>
          <tr><td colspan="4"><strong>宿主端可根据 source 判断控件的可信度：</strong>explicit &gt; aria &gt; css &gt; structure &gt; native，层级越低越符合 Web 标准。</td></tr>
        </tbody>
      </table>
    </div>

    '''
    
    html_updated = html_updated[:start_idx] + new_block + html_updated[end_idx:]
    print("✓ 更新了 source 溯源表")
else:
    print("✗ 未找到 source 溯源标题")
    # 调试：找一下 5.4 相关内容
    idx = html_updated.find('5.4 source')
    if idx > 0:
        print(f"在位置 {idx} 找到 '5.4 source'")
        print(html_updated[idx:idx+200])

# 保存
js_content_new = 'window.__devGuideHTML = "' + html_updated.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n') + '";'

with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.js', 'w', encoding='utf-8') as f:
    f.write(js_content_new)

print(f"\n✓ 文件已保存，新长度: {len(html_updated)} 字符")
print("✓ dev-guide.js 更新完成（包含五层智能识别source表）")