import re

input_file = "app/[locale]/(frontend)/globals.css"

with open(input_file, "r") as f:
    lines = f.readlines()

new_lines = []
in_a11y_block = False

for line in lines:
    if ".a11y-" in line or "@media (prefers-reduced-motion" in line:
        in_a11y_block = True
    
    if in_a11y_block:
        new_lines.append(line)
        if "}" in line and not "{" in line: # simplistic check for block end
           # It's safer to just reset if the line starts with }
           pass
        if line.strip() == "}":
            in_a11y_block = False
    else:
        # Remove !important if it's not an a11y block
        new_line = re.sub(r'\s*!important', '', line)
        new_lines.append(new_line)

with open(input_file, "w") as f:
    f.writelines(new_lines)

print("Removed !important from non-a11y rules.")
