# 一炷香 (A Stick of Incense)

一款融合中国传统文化元素的躲避类网页游戏。

## 🎮 在线试玩

👉 [https://linjt798.github.io/a_stick_of_incense/](https://linjt798.github.io/a_stick_of_incense/)

## 游戏简介

玩家需要操控角色躲避四面八方射来的箭矢，以"香"作为时间单位（10秒=一炷香），挑战自己能坚持多少炷香。

## 📸 游戏截图

### 首页场景
![首页](screenshots/home.png)
*游戏主界面，点击开始按钮进入游戏*

### 介绍场景
![介绍](screenshots/intro.png)
*游戏介绍与教程界面*

### 主游戏场景
![游戏中](screenshots/gameplay.png)
*躲避箭矢的核心玩法，右侧香炉显示时间*

### 结算场景
![结算](screenshots/gameover.png)
*显示玩家坚持的香数，可选择重新开始*

## 游戏特色

- 🎮 简单易上手的操作（WASD或方向键）
- 🏹 智能的箭矢生成系统，确保公平且有挑战性
- 🕐 独特的香炉计时系统
- 🎨 中国传统文化主题的美术风格
- 🍃 动态的叶子飘落效果

## 如何运行

1. 克隆仓库：
```bash
git clone https://github.com/LinJT798/a_stick_of_incense.git
cd a_stick_of_incense
```

2. 启动本地服务器：
```bash
python3 -m http.server 8080
```

3. 打开浏览器访问：
```
http://localhost:8080
```

## 游戏操作

- **移动**: WASD 或 方向键
- **目标**: 躲避箭矢，坚持更长时间

## 技术栈

- **框架**: Phaser 3
- **语言**: JavaScript
- **样式**: HTML5 Canvas

## 项目结构

```
├── assets/          # 游戏资源
│   ├── images/      # 图片资源
│   ├── audio/       # 音频资源
│   └── fonts/       # 字体文件
├── src/             # 源代码
│   ├── scenes/      # 游戏场景
│   ├── systems/     # 游戏系统
│   ├── utils/       # 工具类
│   └── config/      # 配置文件
├── index.html       # 入口文件
└── game-design-doc.md # 游戏设计文档
```

## 开发者

- GitHub: [@LinJT798](https://github.com/LinJT798)

## License

MIT