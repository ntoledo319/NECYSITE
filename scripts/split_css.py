import os

input_file = "app/[locale]/(frontend)/globals.css"

with open(input_file, "r") as f:
    lines = f.readlines()

# Very rough manual slicing based on grep output
tokens_css = lines[4:210]  # root and dark mode tokens
base_css = lines[210:312] # base elements, html, body
typography_css = lines[312:443] # headings, pills, buttons
components_css = lines[443:649] # cards, headers, footers
motion_css = lines[649:1111] # animations
accessibility_css = lines[1111:1340] # a11y
components2_css = lines[1340:] # remaining components

os.makedirs("styles", exist_ok=True)

with open("styles/tokens.css", "w") as f:
    f.writelines(tokens_css)
    
with open("styles/base.css", "w") as f:
    f.writelines(base_css)
    
with open("styles/typography.css", "w") as f:
    f.writelines(typography_css)
    
with open("styles/components.css", "w") as f:
    f.writelines(components_css + components2_css)
    
with open("styles/motion.css", "w") as f:
    f.writelines(motion_css)
    
with open("styles/accessibility.css", "w") as f:
    f.writelines(accessibility_css)

new_globals = lines[0:4] + [
    '@import "../../styles/tokens.css";\n',
    '@import "../../styles/base.css";\n',
    '@import "../../styles/typography.css";\n',
    '@import "../../styles/components.css";\n',
    '@import "../../styles/motion.css";\n',
    '@import "../../styles/accessibility.css";\n'
]

with open(input_file, "w") as f:
    f.writelines(new_globals)

print("CSS split successful.")
