#!/bin/bash

# ===================================================
# 计算中心 - 打包脚本
# 将 client 和 server 打包为可执行程序
# 支持 macOS 和 Windows 平台
# ===================================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
CLIENT_DIR="$PROJECT_ROOT/client"
SERVER_DIR="$PROJECT_ROOT/server"
DIST_DIR="$PROJECT_ROOT/dist"

# 应用名称
APP_NAME="calc-center"
VERSION="1.0.0"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  计算中心 - 打包工具 v${VERSION}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 清理旧的构建目录
clean() {
    echo -e "${YELLOW}[1/5] 清理旧的构建目录...${NC}"
    rm -rf "$DIST_DIR"
    rm -rf "$CLIENT_DIR/dist"
    mkdir -p "$DIST_DIR"
    echo -e "${GREEN}✓ 清理完成${NC}"
    echo ""
}

# 安装依赖
install_deps() {
    echo -e "${YELLOW}[2/5] 检查并安装依赖...${NC}"

    # 检查 pkg 是否安装
    if ! command -v pkg &> /dev/null; then
        echo "  安装 pkg..."
        npm install -g pkg
    else
        echo "  pkg 已安装"
    fi

    # 安装 client 依赖
    echo "  安装 client 依赖..."
    cd "$CLIENT_DIR"
    npm install --silent

    # 安装 server 依赖
    echo "  安装 server 依赖..."
    cd "$SERVER_DIR"
    npm install --silent

    echo -e "${GREEN}✓ 依赖安装完成${NC}"
    echo ""
}

# 构建前端
build_client() {
    echo -e "${YELLOW}[3/5] 构建前端...${NC}"
    cd "$CLIENT_DIR"
    npm run build
    echo -e "${GREEN}✓ 前端构建完成${NC}"
    echo ""
}

# 准备打包目录
prepare_package() {
    echo -e "${YELLOW}[4/5] 准备打包目录...${NC}"

    # 创建临时打包目录
    PACKAGE_DIR="$DIST_DIR/package"
    mkdir -p "$PACKAGE_DIR"

    # 复制 server 文件
    cp "$SERVER_DIR/index.js" "$PACKAGE_DIR/"
    cp "$SERVER_DIR/package.json" "$PACKAGE_DIR/"

    # 复制 node_modules（pkg 需要）
    cp -r "$SERVER_DIR/node_modules" "$PACKAGE_DIR/"

    # 创建 public 目录并复制前端构建文件
    mkdir -p "$PACKAGE_DIR/public"
    cp -r "$CLIENT_DIR/dist/"* "$PACKAGE_DIR/public/"

    # 创建 data 目录
    mkdir -p "$PACKAGE_DIR/data"

    # 如果存在模板文件，复制过来
    if [ -f "$SERVER_DIR/data/formula-templates.json" ]; then
        cp "$SERVER_DIR/data/formula-templates.json" "$PACKAGE_DIR/data/"
    fi

    echo -e "${GREEN}✓ 打包目录准备完成${NC}"
    echo ""
}

# 使用 pkg 打包
build_executable() {
    echo -e "${YELLOW}[5/5] 打包可执行程序...${NC}"

    cd "$DIST_DIR/package"

    # 创建输出目录
    mkdir -p "$DIST_DIR/macos"
    mkdir -p "$DIST_DIR/windows"

    echo "  打包 macOS 版本..."
    pkg index.js \
        --target node18-macos-x64 \
        --output "$DIST_DIR/macos/$APP_NAME" \
        --compress GZip

    echo "  打包 Windows 版本..."
    pkg index.js \
        --target node18-win-x64 \
        --output "$DIST_DIR/windows/$APP_NAME.exe" \
        --compress GZip

    # 复制静态资源到各平台目录
    echo "  复制静态资源..."

    # macOS
    cp -r "$DIST_DIR/package/public" "$DIST_DIR/macos/"
    cp -r "$DIST_DIR/package/data" "$DIST_DIR/macos/"

    # Windows
    cp -r "$DIST_DIR/package/public" "$DIST_DIR/windows/"
    cp -r "$DIST_DIR/package/data" "$DIST_DIR/windows/"

    # 创建启动脚本
    create_launch_scripts

    # 清理临时目录
    rm -rf "$DIST_DIR/package"

    echo -e "${GREEN}✓ 打包完成${NC}"
    echo ""
}

# 创建启动脚本
create_launch_scripts() {
    # macOS 启动脚本
    cat > "$DIST_DIR/macos/start.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
open "http://localhost:3006"
./"calc-center"
EOF
    chmod +x "$DIST_DIR/macos/start.sh"

    # Windows 启动脚本
    cat > "$DIST_DIR/windows/start.bat" << 'EOF'
@echo off
cd /d "%~dp0"
start http://localhost:3006
calc-center.exe
EOF
}

# 显示结果
show_result() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}  打包成功!${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo "输出目录: $DIST_DIR"
    echo ""
    echo "macOS 版本:"
    echo "  - $DIST_DIR/macos/$APP_NAME"
    echo "  - $DIST_DIR/macos/start.sh (启动脚本)"
    echo ""
    echo "Windows 版本:"
    echo "  - $DIST_DIR/windows/$APP_NAME.exe"
    echo "  - $DIST_DIR/windows/start.bat (启动脚本)"
    echo ""
    echo -e "${YELLOW}使用方法:${NC}"
    echo "  macOS:   cd dist/macos && ./start.sh"
    echo "  Windows: 双击 start.bat 或运行 calc-center.exe"
    echo ""

    # 显示文件大小
    echo -e "${BLUE}文件大小:${NC}"
    if [ -f "$DIST_DIR/macos/$APP_NAME" ]; then
        echo "  macOS:   $(du -h "$DIST_DIR/macos/$APP_NAME" | cut -f1)"
    fi
    if [ -f "$DIST_DIR/windows/$APP_NAME.exe" ]; then
        echo "  Windows: $(du -h "$DIST_DIR/windows/$APP_NAME.exe" | cut -f1)"
    fi
    echo ""
}

# 主函数
main() {
    clean
    install_deps
    build_client
    prepare_package
    build_executable
    show_result
}

# 运行
main
