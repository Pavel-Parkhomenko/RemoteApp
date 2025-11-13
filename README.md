# Remote App

1. Download and install ```AutoHotkey v2```
2. Install the dependencies ```(npm install)```
3. Run start.bat
4. Run http://YOUR_IP:3000 in your browser ```(use ipconfig)```


## DATA.json Fields

```JSON
[{
  "player": "NAME",
  "coords": "x-next,y-next,x-prev,y-prev,x-move,y-move",
  "isChecked": false
}]
```

### `player`
- **Type:** `string`  
- Any name of your player or source.  
- **Example:** `"kinogo"`, `"anwap"`

### `coords`
- **Type:** `string` (comma-separated values)  
- Contains 6 numbers describing coordinates:  
  1. `x-next` — X coordinate for the **Next** button  
  2. `y-next` — Y coordinate for the **Next** button  
  3. `x-prev` — X coordinate for the **Previous** button  
  4. `y-prev` — Y coordinate for the **Previous** button  
  5. `x-move` — X offset (optional)  
  6. `y-move` — Y offset (optional)  
- **Example:** `"1655,1056,100,100,200,300"`

### `isChecked`
- **Type:** `boolean`  
- Selection/activation flag.  
- `true` — element is selected by default  
- `false` — element is not selected

