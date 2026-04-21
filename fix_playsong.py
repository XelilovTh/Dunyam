import os

file_path = r'c:\Users\Victus\OneDrive\Desktop\Tehmaz\DUNYAM\Dunyam\script.js'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'DOM.musicPlaylist.querySelector(`[data-index="${AppState.player.currentIndex}"]`)' in line:
        # Get the indentation
        indent = line[:line.find('const')]
        new_lines.append(f'{indent}const prevSong = AppState.songs[AppState.player.currentIndex];\n')
        new_lines.append(f'{indent}const prevItem = DOM.musicPlaylist.querySelector(`.music-track-item[data-id="${{prevSong.public_id}}"]`);\n')
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
