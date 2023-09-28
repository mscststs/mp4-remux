# mp4-remux

MP4 混流工具

功能：纯浏览器环境下，将视频流与音频流重新混合，该过程完全流式处理


## Try

https://tools.mscststs.com/tools/mp4-remux

## Usage

### import

1. use CDN
```html
<script src="https://unpkg.com/mp4-remux@0.2.0/lib/mp4-remux.iife.js" ></script>
```
```html
<script src="https://cdn.jsdelivr.net/npm/mp4-remux@0.2.0/lib/mp4-remux.iife.js" ></script>
```

2. use NPM
```js
import remux from "mp4-remux"
```


Example 1: 通过 Fetch 获取音频和视频流，然后写入本地文件;

```js
const videoStream = (await fetch('__videoUrl__')).body;
const audioStream = (await fetch('__audioUrl__')).body;


const remuxedStream = remux(videoStream, audioStream);

const fileHandler = await window?.showSaveFilePicker({
  suggestedName: "output.mp4",
  types: [
    { accept: {
        "video/mp4": ".mp4"
      }
    }],
});

const writable = await fileHandler.createWritable();

const writableStream = new WritableStream({
  write: (chunk)=>writable.write(chunk),
  close: ()=>writable.close(),
})

remuxedStream.pipeTo(writableStream);
```


## 不足

1. 目前仅支持专门对于 Dash 进行分割的文件，即其中一个文件仅包含音频，另一个文件仅包含视频
2. (fixed in: v0.2.0) ~~目前仅支持两个文件含有不同 Trackid 的情况，暂时没有对所有的 Trackid 重新编码~~ 


## 鸣谢 | Thanks

mp4box.js
