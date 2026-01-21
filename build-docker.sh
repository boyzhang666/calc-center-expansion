#!/bin/bash
set -e
# 本地 Docker 镜像打包测试脚本（不上传）

# 获取当前脚本所在目录的绝对路径
SCRIPT_DIR=$(cd "$(dirname "$0")" || exit 1; pwd)
cd "$SCRIPT_DIR" || exit 1;

# 项目名称和版本
APP_NAME="calc-center-expansion"
APP_VERSION="1.0"

# 基础镜像（从 Docker 官方获取）
NODE_IMAGE="node:20-alpine"

echo "开始构建镜像: $APP_NAME:$APP_VERSION"

# 构建本地镜像（仅当前平台）
docker build \
    --build-arg NODE_IMAGE="$NODE_IMAGE" \
    -t "$APP_NAME":"$APP_VERSION" \
    -t "$APP_NAME":latest \
    -f ./Dockerfile \
    .

echo ""
echo "构建完成！"
echo "本地镜像: $APP_NAME:$APP_VERSION"
echo "本地镜像: $APP_NAME:latest"
echo ""
echo "测试运行: docker run -p 3006:3006 $APP_NAME:latest"
