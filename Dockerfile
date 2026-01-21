# 计算中心 JSON 配置生成工具 - Docker 部署
# 多阶段构建：先构建前端，再打包后端
#
# 使用方法：
#   docker build -t calc-center:latest .
#   docker run -p 3006:3006 calc-center:latest

ARG NODE_IMAGE=node:20-alpine

# ==================== 阶段一：构建前端 ====================
FROM ${NODE_IMAGE} AS frontend-builder

WORKDIR /build

# 复制前端项目文件
COPY client/package*.json ./

# 安装依赖
RUN npm install

# 复制前端源码
COPY client/ ./

# 构建前端
RUN npm run build


# ==================== 阶段二：最终镜像 ====================
FROM ${NODE_IMAGE}

LABEL maintainer="计算中心 JSON 配置生成工具"
LABEL description="计算中心 JSON 配置生成工具 - 源码构建版本"

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV TZ=Asia/Shanghai

# 复制后端依赖文件
COPY server/package*.json ./server/

# 安装后端依赖（仅生产依赖）
WORKDIR /app/server
RUN npm install --omit=dev

# 返回应用根目录
WORKDIR /app

# 复制后端代码
COPY server/index.js ./server/

# 从前端构建阶段复制构建产物（匹配后端代码的路径：../client/dist）
COPY --from=frontend-builder /build/dist ./client/dist/

# 创建数据目录
RUN mkdir -p /app/server/data

# 复制初始数据文件（模板文件，匹配后端代码路径：APP_ROOT/data）
COPY server/data/ ./server/data/

# 暴露端口
EXPOSE 3006

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3006/api/health || exit 1

# 启动命令
CMD ["node", "server/index.js"]
