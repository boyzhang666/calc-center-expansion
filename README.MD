# 计算中心 - 公式批量生成工具

一个用于生成和管理计算公式配置的 Web 工具，支持可视化编辑和 JSON 导出。

## 功能特性

- 可视化公式模板编辑
- 函数模板管理（保存、编辑、删除）
- JSON 配置文件导出
- 数据持久化存储

## 技术栈

- 前端：Vue 3 + Vite + Element Plus + TailwindCSS
- 后端：Node.js + Express
- 部署：Docker

---

# 运行方式

## 1. 创建 docker-compose.yml 文件

```yaml
version: '3.8'

services:
  calc-center-expansion:
    image: harbor.magusiot.cn:9443/magus/calc-center-expansion:latest
    container_name: calc-center-expansion
    restart: unless-stopped
    ports:
      - "3006:3006"
    volumes:
      # 数据持久化：保存用户创建的函数模板
      - ./data:/app/server/data
    environment:
      - NODE_ENV=production
      - TZ=Asia/Shanghai
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3006/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
```

## 2. 首次部署

首次部署需要从镜像中复制初始数据到本地目录：

```bash
# 拉取镜像
docker pull harbor.magusiot.cn:9443/magus/calc-center-expansion:latest

# 创建临时容器并复制初始数据
docker run -d --name temp-calc-center harbor.magusiot.cn:9443/magus/calc-center-expansion:latest
docker cp temp-calc-center:/app/server/data ./data
docker rm -f temp-calc-center

# 启动服务
docker compose up -d
```

## 3. 启动服务

```bash
docker compose up -d
```

## 4. 终止服务

```bash
docker compose down
```

## 5. 更新镜像

```bash
# 拉取最新镜像
docker compose pull

# 重启服务（数据会保留）
docker compose down && docker compose up -d
```

## 6. 查看日志

```bash
docker compose logs -f
```

---

## 访问地址

服务启动后，访问：http://localhost:3006

## 数据存储

用户创建的函数模板保存在 `./data/formula-templates.json` 文件中。
