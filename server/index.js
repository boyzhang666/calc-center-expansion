const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT) || 3006;

// 判断是否是打包后的环境
const isPkg = typeof process.pkg !== 'undefined';

// 获取应用根目录（打包后使用可执行文件所在目录）
const getAppRoot = () => {
  if (isPkg) {
    return path.dirname(process.execPath);
  }
  return __dirname;
};

const APP_ROOT = getAppRoot();

// 公式模板数据文件路径
const TEMPLATES_FILE = path.join(APP_ROOT, 'data', 'formula-templates.json');

// 静态文件目录
const STATIC_DIR = isPkg
  ? path.join(APP_ROOT, 'public')
  : path.join(__dirname, '../client/dist');

// 确保 data 目录存在
const dataDir = path.join(APP_ROOT, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件服务（生产环境）
app.use(express.static(STATIC_DIR));

// API: 获取公式模板数据
app.get('/api/templates', (req, res) => {
  try {
    if (fs.existsSync(TEMPLATES_FILE)) {
      const data = fs.readFileSync(TEMPLATES_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      // 返回默认空数据
      res.json({
        templates: []
      });
    }
  } catch (error) {
    console.error('读取模板文件失败:', error);
    res.status(500).json({ error: '读取模板文件失败' });
  }
});

// API: 保存公式模板数据
app.post('/api/templates', (req, res) => {
  try {
    const { templates } = req.body;
    const data = {
      templates: templates || [],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, message: '模板数据已保存' });
  } catch (error) {
    console.error('保存模板文件失败:', error);
    res.status(500).json({ error: '保存模板文件失败' });
  }
});

// API: 下载JSON文件
app.post('/api/download', (req, res) => {
  const { filename, content } = req.body;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

  let parsed = content;
  if (typeof content === 'string') {
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      parsed = content;
    }
  }

  if (typeof parsed === 'string') {
    res.send(parsed);
  } else {
    res.send(JSON.stringify(parsed, null, 4));
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  计算中心 JSON 配置生成工具`);
  console.log(`  服务已启动: http://localhost:${PORT}`);
  console.log(`  模板数据文件: ${TEMPLATES_FILE}\n`);
});
