# replacement_color = 2
def flood_fill(image, x, y, target_color, _ ):
    global replacement_color
    if image[x][y] != target_color:
        return
    else:
        image[x][y] = replacement_color
        replacement_color +=1

    flood_fill(image, x + 1, y, target_color, replacement_color)
    flood_fill(image, x - 1, y, target_color, replacement_color)
    flood_fill(image, x, y + 1, target_color, replacement_color)
    flood_fill(image, x, y - 1, target_color, replacement_color)

# Contoh penggunaan
image = [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
]
image = [
    [0,0,0,0, 0,0,0,0, ],
    [0,0,0,1, 0,1,1,0, ],
    [0,0,0,1, 0,0,1,0, ],
    [0,0,1,1, 0,0,1,0, ],
    
    [0,0,0,1, 1,1,1,0, ],
    [0,1,1,1, 0,0,0,0, ],
    [0,0,1,0, 0,0,0,0, ],
    [0,0,0,0, 0,0,0,0, ],

]

target_color = 1
replacement_color = 2
flood_fill(image, 1, 3, target_color, replacement_color)

for row in image:
    for col in row:
        print('{0:3}'.format(col), end='')
    print()