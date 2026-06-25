# -*- coding: utf-8 -*-
"""
修复测试中 module 路径错误的问题：
1. canvas补充测试组中大部分是public的函数
2. public补充测试组中部分函数在canvas或public.icon下
"""

import re

file_path = r'd:\phpstudy_pro\WWW\SUIDesigner\public\test_api_reverse.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 修复1: canvas补充测试组（module: 'canvas'）大部分函数应该是public的
# 只有 setFixedCanvasSize, getTitleBarTitle, setTitleBarTitle 是 canvas 模块的
# 其他都应该是 public 的
# 
# 策略：把这个组的 module 从 'canvas' 改为 'public'，
# 然后给那3个canvas的函数加上 moduleOverride: 'canvas'

old_canvas_group = """    // ===== canvas 补充测试 =====
    {
      module: 'canvas',
      title: 'canvas API (补充)',"""

new_canvas_group = """    // ===== canvas 补充测试 =====
    {
      module: 'public',
      title: 'canvas API (补充)',"""

if old_canvas_group in content:
    content = content.replace(old_canvas_group, new_canvas_group)
    print("✓ 修复1: canvas补充组 module canvas → public")
else:
    print("? 修复1: 未找到canvas补充测试组")

# 给 canvas 补充组中的 canvas 专有函数加上 moduleOverride
# 在那3个函数定义中加入 moduleOverride: 'canvas'

# setFixedCanvasSize
old1 = "{ name: 'setFixedCanvasSize', target: null, args: [false], verify: function(res) { return res === true; } },"
new1 = "{ name: 'setFixedCanvasSize', moduleOverride: 'canvas', api: 'setFixedCanvasSize', target: null, args: [false], verify: function(res) { return res === true; } },"
if old1 in content:
    content = content.replace(old1, new1)
    print("✓ 修复2: setFixedCanvasSize 添加 moduleOverride: 'canvas'")
else:
    print("? 修复2: 未找到 setFixedCanvasSize (canvas补充组)")

# getTitleBarTitle - canvas补充组的
old2 = "{ name: 'getTitleBarTitle', target: null, args: null, verify: function(res) { return typeof res === 'string'; } },\n        { name: 'move',"
new2 = "{ name: 'getTitleBarTitle', moduleOverride: 'canvas', api: 'getTitleBarTitle', target: null, args: null, verify: function(res) { return typeof res === 'string'; } },\n        { name: 'move',"
if old2 in content:
    content = content.replace(old2, new2)
    print("✓ 修复3: canvas补充组 getTitleBarTitle 添加 moduleOverride")
else:
    print("? 修复3: 未找到 canvas补充组的 getTitleBarTitle")

# setTitleBarTitle - canvas补充组的
old3 = "{ name: 'setTitleBarTitle', target: null, args: ['测试标题'], verify: function(res) { return typeof res === 'string'; } },"
new3 = "{ name: 'setTitleBarTitle', moduleOverride: 'canvas', api: 'setTitleBarTitle', target: null, args: ['测试标题'], verify: function(res) { return typeof res === 'string'; } },"
if old3 in content:
    content = content.replace(old3, new3)
    print("✓ 修复4: canvas补充组 setTitleBarTitle 添加 moduleOverride")
else:
    print("? 修复4: 未找到 canvas补充组的 setTitleBarTitle")

# parse - canvas补充组的 (应该是 public.icon)
old4 = "{ name: 'parse', target: null, args: ['[OK]'], verify: function(res) { return typeof res === 'string'; } },\n        { name: 'removeMessageListener',"
new4 = "{ name: 'parse', moduleOverride: 'public.icon', api: 'parse', target: null, args: ['[OK]'], verify: function(res) { return typeof res === 'string'; } },\n        { name: 'removeMessageListener',"
if old4 in content:
    content = content.replace(old4, new4)
    print("✓ 修复5: canvas补充组 parse 添加 moduleOverride: 'public.icon'")
else:
    print("? 修复5: 未找到 canvas补充组的 parse")

# toText - canvas补充组的 (应该是 public.icon)
old5 = "{ name: 'toText', target: null, args: ['[OK]'], verify: function(res) { return typeof res === 'string'; } },\n      ]\n    },"
new5 = "{ name: 'toText', moduleOverride: 'public.icon', api: 'toText', target: null, args: ['[OK]'], verify: function(res) { return typeof res === 'string'; } },\n      ]\n    },"
if old5 in content:
    content = content.replace(old5, new5)
    print("✓ 修复6: canvas补充组 toText 添加 moduleOverride: 'public.icon'")
else:
    print("? 修复6: 未找到 canvas补充组的 toText")

# 修复7: public补充测试组中的部分函数不在public根级别
# getTitleBarTitle → canvas
old7 = "{ name: 'getTitleBarTitle', target: null, args: null, verify: function(res) { return typeof res === 'string'; } },\n        { name: 'getValue',"
new7 = "{ name: 'getTitleBarTitle', moduleOverride: 'canvas', api: 'getTitleBarTitle', target: null, args: null, verify: function(res) { return typeof res === 'string'; } },\n        { name: 'getValue',"
if old7 in content:
    content = content.replace(old7, new7)
    print("✓ 修复7: public补充组 getTitleBarTitle 添加 moduleOverride")
else:
    print("? 修复7: 未找到 public补充组的 getTitleBarTitle")

# setTitleBarTitle → canvas
old8 = "{ name: 'setTitleBarTitle', target: null, args: ['新标题'], verify: function(res) { return typeof res === 'string'; } },"
new8 = "{ name: 'setTitleBarTitle', moduleOverride: 'canvas', api: 'setTitleBarTitle', target: null, args: ['新标题'], verify: function(res) { return typeof res === 'string'; } },"
if old8 in content:
    content = content.replace(old8, new8)
    print("✓ 修复8: public补充组 setTitleBarTitle 添加 moduleOverride")
else:
    print("? 修复8: 未找到 public补充组的 setTitleBarTitle")

# setFixedCanvasSize → canvas
old9 = "{ name: 'setFixedCanvasSize', target: null, args: [false], verify: function(res) { return res === true; } },\n        { name: 'setSize',"
new9 = "{ name: 'setFixedCanvasSize', moduleOverride: 'canvas', api: 'setFixedCanvasSize', target: null, args: [false], verify: function(res) { return res === true; } },\n        { name: 'setSize',"
if old9 in content:
    content = content.replace(old9, new9)
    print("✓ 修复9: public补充组 setFixedCanvasSize 添加 moduleOverride")
else:
    print("? 修复9: 未找到 public补充组的 setFixedCanvasSize")

# parse → public.icon (public补充组的)
old10 = "{ name: 'parse', target: null, args: ['[OK]'], verify: function(res) { return typeof res === 'string'; } },\n        { name: 'sendMessage',"
new10 = "{ name: 'parse', moduleOverride: 'public.icon', api: 'parse', target: null, args: ['[OK]'], verify: function(res) { return typeof res === 'string'; } },\n        { name: 'sendMessage',"
if old10 in content:
    content = content.replace(old10, new10)
    print("✓ 修复10: public补充组 parse 添加 moduleOverride")
else:
    print("? 修复10: 未找到 public补充组的 parse")

# toText → public.icon (public补充组的)
old11 = "{ name: 'toText', target: null, args: ['[OK]'], verify: function(res) { return typeof res === 'string'; } },\n        { name: 'toggle',"
new11 = "{ name: 'toText', moduleOverride: 'public.icon', api: 'toText', target: null, args: ['[OK]'], verify: function(res) { return typeof res === 'string'; } },\n        { name: 'toggle',"
if old11 in content:
    content = content.replace(old11, new11)
    print("✓ 修复11: public补充组 toText 添加 moduleOverride")
else:
    print("? 修复11: 未找到 public补充组的 toText")

# 修复12: getInfoById 的验证条件，res !== null 应该改成 res !== ''
old12 = "{ name: 'getInfoById', target: null, args: ['t_button'], verify: function(res) { return res !== null; } },"
new12 = "{ name: 'getInfoById', target: null, args: ['t_button'], verify: function(res) { return res && typeof res === 'object'; } },"
if old12 in content:
    content = content.replace(old12, new12)
    print("✓ 修复12: getInfoById 验证条件修复")
else:
    print("? 修复12: 未找到 getInfoById")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✓ 所有修复完成！")
