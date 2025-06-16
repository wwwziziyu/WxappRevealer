# WxappRevealer

> 一键反编译、深度提取与分析 WeChat 小程序内部资源

## 介绍

**WxappRevealer** 是一款跨平台、独立可执行的命令行工具，专注于对 WeChat 小程序（`.wxapkg`）的智能反编译与敏感信息检索。  
无需预装 Node.js，下载后即可在 macOS、Windows、Linux 上直接运行，一条命令完成反编译、分析与报告导出。

## 功能

- 📦 **反编译还原**  
  还原 `.wxapkg` 包中所有 JS、WXML、WXSS、JSON 等资源到本地目录。

- 🔍 **静态提取**  
  - AST 遍历：捕捉加解密／哈希调用、模板字面量中的常量  
  - 正则匹配：基于可配置的模式（AppID、AppSecret、JWT、AWS Key、Redis URL 等），精准定位隐藏凭证  
  - API 路径收集：自动汇总所有网络请求 URL

- 📝 **结构化报告**  
  生成 Markdown 格式的审计报告（`report.md`），包含：  
  1. 文件列表  
  2. 加解密 & 哈希 调用  
  3. 敏感常量 & 模板字面量  
  4. 正则匹配提取的密钥/令牌  
  5. API 请求 URL 清单

- ⚡ **免环境依赖**  
  已打包 Node.js 运行时，无需额外安装 Node.js 或任何库。

## 快速开始

### 1. 下载可执行文件

从 Releases 里选择对应平台下载：  
- `WxappRevealer-macos`  
- `WxappRevealer-win.exe`  
- `WxappRevealer-linux`

### 2. 添加执行权限（macOS/Linux）

```bash
chmod +x WxappRevealer-macos
```

### 3. 运行全流程
```
./WxappRevealer-macos run path/to/your/app.wxapkg [-o 输出目录] [--no-clean]
```
	•	run <file>：执行 unpack → analyze → export
	•	-o, --out <dir>：指定输出目录，默认工作目录
	•	--no-clean：保留中间解包文件
<img width="569" alt="image" src="https://github.com/user-attachments/assets/98982919-04bf-4cac-b9f2-e15a5c5ae0e2" />


### 4. 查看报告
输出目录下会生成：
	•	analysis.json —— 原始分析结果
	•	report.md   —— 结构化 Markdown 报告
<img width="1215" alt="image" src="https://github.com/user-attachments/assets/2ef4b03e-e0d5-4f57-9369-276bbc16f3aa" />

<img width="120" alt="image" src="https://github.com/user-attachments/assets/9dbf4594-d41b-4132-a062-0aae03eb035b" />

想要加正则就自己加，目录放下面了

## 项目结构
```
WxappRevealer/
├── bin/
│   └── index.js                  # CLI 入口
├── dist/
│   ├── WxappRevealer-macos       # macOS 可执行
│   ├── WxappRevealer-win.exe     # Windows 可执行
│   └── WxappRevealer-linux       # Linux 可执行
├── src/
│   ├── analyzer/
│   │   ├── astAnalyzer.js        # 主分析逻辑
│   │   ├── secretDetector.js     # AST & 正则敏感信息提取
│   │   └── cryptoDetector.js     # 加解密调用检测
│   ├── exporter/
│   │   ├── markdownExporter.js   # Markdown 报告生成
│   │   └── jsonExporter.js       # JSON 导出
│   ├── parser/
│   │   ├── jsParser.js           # JS 解析
│   │   ├── wxmlParser.js         # WXML 解析
│   │   └── wxssParser.js         # WXSS 解析
│   ├── unpacker/
│   │   ├── index.js              # 解包逻辑
│   │   └── wxapkgReader.js       # `.wxapkg` 二进制解析
│   ├── utils/
│   │   ├── fsHelper.js           # 文件读写辅助
│   │   ├── logger.js             # 日志工具
│   │   └── sandbox.js            # JS 沙箱执行
│   └── config/
│       └── secretPatterns.json   # 正则敏感模式配置
├── package.json                  # 项目依赖与 CLI 配置
├── README.md                     # 本文档
└── .gitignore                    # 忽略规则
```
欢迎试用并提交 Issue/PR，共同完善 WxappRevealer！
MIT License ©eziyu
