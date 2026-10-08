import markdown

with open("古魔法学.md", "r", encoding="utf-8") as f:
    text = f.read()


pure_html = markdown.markdown(text)

with open("古魔法学.html", "w", encoding="utf-8") as f:
    f.write(pure_html)
