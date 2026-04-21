import os

file_path = r'c:\Users\Victus\OneDrive\Desktop\Tehmaz\DUNYAM\Dunyam\script.js'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_head = False
for line in lines:
    if line.startswith('<<<<<<<'):
        in_head = True
        continue
    if line.startswith('======='):
        in_head = False
        break # Stop after HEAD
    if in_head:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
