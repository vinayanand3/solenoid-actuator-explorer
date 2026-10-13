from PIL import Image,ImageDraw
from pathlib import Path
import sys
folder=Path(sys.argv[1]);files=list(folder.glob('*.png'))
canvas=Image.new('RGB',(1200,((len(files)+2)//3)*300),'#21262b');d=ImageDraw.Draw(canvas)
for j,f in enumerate(files):
 im=Image.open(f).convert('RGB');im.thumbnail((400,275));x=j%3*400;y=j//3*300;canvas.paste(im,(x,y+22));d.text((x+10,y+5),f.name,fill='white')
canvas.save(folder/'contact.jpg')
