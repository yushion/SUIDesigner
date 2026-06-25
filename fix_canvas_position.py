# -*- coding: utf-8 -*-
"""
修复 canvas 模块位置错误
"""

file_path = r'd:\phpstudy_pro\WWW\SUIDesigner\public\webviewBridge.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到 canvas 块的起始和结束行号（0索引）
canvas_start = None
canvas_end = None

for i, line in enumerate(lines):
    if canvas_start is None and '画布操作 API' in line:
        canvas_start = i - 1  # 包括空行
    if canvas_start is not None and canvas_end is None:
        if i > canvas_start + 5 and line.strip() == '},' and 'showNotification' in lines[i+1] + lines[i+2] + lines[i+3]:
            canvas_end = i
            break

if canvas_start is None or canvas_end is None:
    print(f"canvas_start={canvas_start}, canvas_end={canvas_end}")
    print("未找到 canvas 块")
    exit(1)

print(f"canvas 块: 第 {canvas_start+1} 行 - 第 {canvas_end+1} 行")
print(f"内容预览:")
print(''.join(lines[canvas_start:canvas_start+3]))
print('...')
print(''.join(lines[canvas_end-1:canvas_end+1]))

# 提取 canvas 块
canvas_block_lines = lines[canvas_start:canvas_end+1]

# 删除原位置的 canvas 块
del lines[canvas_start:canvas_end+1]

# 现在找到插入位置：setZIndex 结束后，public 闭合括号之后，button 之前
insert_pos = None
for i, line in enumerate(lines):
    if 'button: {' in line and i > 100:
        # 找到 button 的位置，往前找 public 的闭合
        for j in range(i-1, max(0, i-10), -1):
            if lines[j].strip() == '},':
                insert_pos = j + 1  # 插入到闭合括号之后
                break
        break

if insert_pos is None:
    print("未找到插入位置")
    exit(1)

print(f"\n插入位置: 第 {insert_pos+1} 行之前")
print(f"插入前内容: {lines[insert_pos].rstrip()}")

# 调整 canvas 块的缩进
# 原先是 4 空格（canvas: { 级别），需要和 public/button 一致（6空格）
# 我们需要给整个 canvas 块增加 2 个空格的缩进
adjusted_canvas_lines = []
for line in canvas_block_lines:
    if line.strip() == '':
        adjusted_canvas_lines.append(line)
    else:
        # 给非空行增加2空格缩进
        adjusted_canvas_lines.append('  ' + line)

# 插入
for line in reversed(adjusted_canvas_lines):
    lines.insert(insert_pos, line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"\n✓ 修复完成！")
print(f"  canvas 块已从 public 内部移到 api 下（与 public 平级）")
