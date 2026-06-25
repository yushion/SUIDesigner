# -*- coding: utf-8 -*-
"""
修复 test_api_reverse.html 中的测试问题：
1. canvas 模块映射错误
2. moduleOverride 路径错误
3. 验证条件中的 null 判断（formatReturnValue把null转成了''）
"""

import re

file_path = r'd:\phpstudy_pro\WWW\SUIDesigner\public\test_api_reverse.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 修复1: 删除 canvas -> public 的映射（第1701行附近）
old_map = "  if (module === 'canvas') module = 'public';\n"
if old_map in content:
    content = content.replace(old_map, '')
    print("✓ 修复1: 删除 canvas -> public 映射")
else:
    print("? 修复1: 未找到 canvas 映射行")

# 修复2: moduleOverride: 'public.canvas' 改为 'canvas'
old_override = "moduleOverride: 'public.canvas'"
new_override = "moduleOverride: 'canvas'"
count = content.count(old_override)
if count > 0:
    content = content.replace(old_override, new_override)
    print(f"✓ 修复2: 修改 {count} 处 public.canvas → canvas")
else:
    print("? 修复2: 未找到 public.canvas moduleOverride")

# 修复3: 验证条件中的 null 判断
# 对于明确测试"不存在"的场景（函数名含"不存在"），res === null 改为 res === ''
# 对于可能存在也可能不存在的场景，res === null 改为 res === ''

# 先处理所有 "res === null" 的情况
# 把 "res === null" 改为 "res === ''"
# 但要注意：有些是 res === null || ... 这种组合，需要保持逻辑正确

# 策略：把所有 verify 函数中的 === null 替换为 === ''
# 因为 formatReturnValue 会把 null/undefined 统一转成 ''
old_null = "res === null"
new_null = "res === ''"
count2 = content.count(old_null)
if count2 > 0:
    content = content.replace(old_null, new_null)
    print(f"✓ 修复3: 修改 {count2} 处 res === null → res === ''")
else:
    print("? 修复3: 未找到 res === null")

# 修复4: 还有没有其他问题？
# 检查一下 public.parse / public.toText 等
# 这些测试的 module 是 'public'，但 parse/toText 在 public.icon 下面

# 让我找一下这些测试
# 比如: { name: 'icon.parse', moduleOverride: 'public.icon', api: 'parse', ... }
# 这些应该是对的，因为 parse 确实在 public.icon 下

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✓ 所有修复完成！")
