# lighthouse平均值检测

lighthouse检测页面服务

# 项目结构
```javascript
lighthouse/
│
├── src/
│   ├── app.js               # 应用入口点
│   ├── config/
│   │   └── index.js         # 配置文件
│   ├── services/
│   │   └── scheduler.js     # 定时任务服务
│   ├── scripts/
│   │   └── your-script.js   # 你的脚本文件
│   └── utils/               
│   └── web/
│       └── lighthouse_fe    # 前端文件
│       └── static           # 前端打包之后的静态资源
├── .env                     # 环境变量
├── package.json
└── README.md
```

# 使用
前端项目修改后，请在根目录使用打包命令
```angular2html
npm run/yarn build:web
```
