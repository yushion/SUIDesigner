import re

# 1. 从 webviewBridge.js 获取所有API (公开的，非下划线开头)
with open(r'd:\phpstudy_pro\WWW\SUIDesigner\public\webviewBridge.js', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('window.webviewBridge = {')
api_section = content[start:]

# 用栈方式解析模块和函数
modules = {}
current_module = None
brace_stack = 0
in_api = False

lines = api_section.split('\n')
i = 0

# 先找到 api: { 的位置
for idx, line in enumerate(lines):
    if 'api: {' in line:
        i = idx
        brace_stack = 1
        in_api = True
        break

module_pattern = re.compile(r'^\s*(\w+):\s*\{')
func_pattern = re.compile(r'^\s*(\w+):\s*function\s*\(')

skip_modules = {'icon'}  # icon 是子模块，但属于 public

while i < len(lines) and brace_stack > 0:
    line = lines[i]
    open_braces = line.count('{')
    close_braces = line.count('}')
    
    # 检查模块定义 (在 brace_stack == 2 或 3 时可能是模块)
    if brace_stack <= 3:
        m = module_pattern.match(line)
        if m:
            mod_name = m.group(1)
            if mod_name not in skip_modules and not mod_name.startswith('_'):
                current_module = mod_name
                if current_module not in modules:
                    modules[current_module] = set()
    
    # 检查函数定义
    if current_module and brace_stack >= 2:
        fm = func_pattern.match(line)
        if fm and not fm.group(1).startswith('_'):
            modules[current_module].add(fm.group(1))
    
    brace_stack += open_braces - close_braces
    i += 1

# 手动添加 public 顶层的 API (那些不在子模块里的)
# 重新解析 public 模块
public_funcs = set()
# 从 public: { 开始找
public_start = api_section.find('public: {')
if public_start > -1:
    public_section = api_section[public_start:]
    pub_lines = public_section.split('\n')
    pub_brace = 0
    for line in pub_lines:
        if 'public: {' in line:
            pub_brace = line.count('{') - line.count('}')
            continue
        if pub_brace <= 0:
            break
        fm = func_pattern.match(line)
        if fm and not fm.group(1).startswith('_'):
            # 排除子模块内的函数 (比如 canvas: { 后面的)
            # 简单判断：如果行里有 ': {' 且不是 function，那是子模块
            if ': {' not in line or 'function' in line:
                public_funcs.add(fm.group(1))
        pub_brace += line.count('{') - line.count('}')

modules['public'] = public_funcs | modules.get('public', set())

all_apis = set()
for mod, funcs in modules.items():
    for f in funcs:
        all_apis.add(f'{mod}.{f}')

print(f'=== 全部API ({len(all_apis)}个) ===')
for api in sorted(all_apis):
    print(f'  {api}')

# 2. 从 test_api_reverse.html 获取已测试的API
with open(r'd:\phpstudy_pro\WWW\SUIDesigner\public\test_api_reverse.html', 'r', encoding='utf-8') as f:
    test_content = f.read()

tested_apis = set()

# 解析测试定义
groups_match = re.findall(
    r"module:\s*['\"]([\w+]+)['\"].*?tests:\s*\[(.*?)\]",
    test_content,
    re.DOTALL
)

for group_mod, tests_str in groups_match:
    # 清理模块名，去掉 + 号
    clean_mod = group_mod.rstrip('+')
    
    # 找出每个测试的 api 或 name
    tests = re.findall(
        r"\{\s*name:\s*'([^']+)',"
        r"(?:\s*moduleOverride:\s*'([^']+)',)?"
        r"(?:\s*api:\s*'([^']+)',)?",
        tests_str
    )
    
    for test_name, override_mod, api_name in tests:
        if override_mod:
            # 有 moduleOverride
            tested_apis.add(f'{override_mod}.{api_name}')
        elif api_name:
            # 有 api 字段
            tested_apis.add(f'{clean_mod}.{api_name}')
        else:
            # 用 name 作为 api 名 (可能带括号参数)
            api = test_name.split('(')[0]
            tested_apis.add(f'{clean_mod}.{api}')

# 也检查 testApi 直接调用
direct_calls = re.findall(r"testApi\('([\w.]+)'", test_content)
for call in direct_calls:
    tested_apis.add(call)

print(f'\n=== 已测试API ({len(tested_apis)}个) ===')
for api in sorted(tested_apis):
    print(f'  {api}')

# 3. 计算缺失的API
missing_apis = all_apis - tested_apis
print(f'\n=== 缺失的API ({len(missing_apis)}个) ===')
for api in sorted(missing_apis):
    print(f'  {api}')

# 按模块统计缺失
print('\n=== 按模块统计缺失 ===')
missing_by_module = {}
for api in missing_apis:
    mod = api.split('.')[0]
    if mod not in missing_by_module:
        missing_by_module[mod] = []
    missing_by_module[mod].append(api.split('.')[1])

for mod in sorted(missing_by_module.keys()):
    funcs = missing_by_module[mod]
    print(f'  {mod}: {len(funcs)}个 - {", ".join(sorted(funcs))}')

# 覆盖率
coverage = (len(all_apis) - len(missing_apis)) / len(all_apis) * 100
print(f'\n=== 总覆盖率: {coverage:.1f}% ({len(all_apis) - len(missing_apis)}/{len(all_apis)}) ===')
