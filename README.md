# 由 Swagger 文档简单生成 js api 小工具

## 用法

1. 克隆本项目，并使用`pnpm i`安装依赖
2. 打开 swagger 文档，寻找 api 所在的`opblock-tag-section`dom 元素，复制 dom 结构到项目根目录`dom.html`文件中。
   ![](1.png)
3. 执行`node index.js`，结果会生成在`result.js`文件中。
