## 编码

1. 修改eslint问题
2. 环境参数，开发环境参数文件.env.development
3. 请求代理，vue.config.js
4. 路由表，目录router，分模块
5. 权限菜单加载,路由表配置roles: ['/instance'],
6. 代码风格，分页，组件化
7. 任务进度安排
8. 输入框校验触发器，输入框blur，选择框change，去掉清空按钮，统一添加重置按钮
9. 目录、文件命名采用中划线分隔的方式

## 开发

```bash

# 进入项目目录
cd acloud-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install

# 启动服务
npm run dev
```

浏览器访问 http://localhost:8080

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
