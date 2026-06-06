"""
转换所有 widgetDefaults JSON 的 mappedProps 为新格式：
- 删除所有 selector="#id" 的条目（已由 defaultStyleData.base 覆盖）
- 将非 #id 的条目按 selector 分组，转为 { selector, base, pseudo }
- base 从旧条目的 cssProp+default 提取，pseudo 初始为 {}
"""
import json
import os

JSON_DIR = r"d:\phpstudy_pro\WWW\__UIDesigner\src\config\widgetDefaults"


def process_file(filepath: str):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    old_mapped = data.get('mappedProps', [])
    new_mapped = []

    # 按 selector 分组收集非 #id 条目
    groups: dict[str, dict] = {}
    for mp in old_mapped:
        sel = mp.get('selector', '')
        if sel == '#id':
            continue
        if sel not in groups:
            groups[sel] = {'base': {}, 'pseudo': {}}
        css_prop = mp.get('cssProp', '')
        default_val = mp.get('default')
        if css_prop and default_val is not None:
            # 转换 kebab-case CSS 属性为 camelCase
            parts = css_prop.split('-')
            camel_key = parts[0] + ''.join(p.capitalize() for p in parts[1:])
            groups[sel]['base'][camel_key] = default_val

    for sel in sorted(groups.keys()):
        g = groups[sel]
        new_mapped.append({
            'selector': sel,
            'base': g['base'],
            'pseudo': g['pseudo'] if g['pseudo'] else {}
        })

    data['mappedProps'] = new_mapped

    removed_count = sum(1 for mp in old_mapped if mp.get('selector') == '#id')
    converted_count = len(new_mapped)

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')

    name = os.path.basename(filepath)
    print(f"  {name}: 删除 {removed_count} 个 #id, 转换 {converted_count} 个 sub-element")


def main():
    print("=== Converting mappedProps to new format ===")
    for filename in sorted(os.listdir(JSON_DIR)):
        if not filename.endswith('.json'):
            continue
        filepath = os.path.join(JSON_DIR, filename)
        process_file(filepath)
    print("=== Done ===")


if __name__ == '__main__':
    main()