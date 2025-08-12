class DifficultyConfig {
    constructor() {
        // 直接定义配置参数，不再有多个预设
        this.config = {
            // 生成频率参数
            baseSpawnRate: 0.3,        // 初始生成率（箭/秒）
            spawnRateGrowth: 0.015,     // 线性增长率
            spawnRateLogGrowth: 0.08,   // 对数增长率
            
            // 箭矢速度参数
            baseSpeed: 300,             // 初始速度（像素/秒）
            maxSpeed: 600,              // 最大速度
            speedGrowth: 10,            // 速度增长率
            
            // 公平性参数
            minTTC: 0.5,                // 最小反应时间（秒）
            safeRadius: 100,            // 安全半径（像素）
            preDelay: 200,              // 读条时间（毫秒）
            
            // 模式倍率
            modeMultipliers: {
                calm: 0.5,
                build: 0.8,
                peak: 1.2,
                recover: 0.6
            }
        };
        
        // 通用模式时长（所有难度共享）
        this.modeDurations = {
            calm: 5000,      // 平静期 5秒
            build: 8000,     // 上升期 8秒
            peak: 10000,     // 高峰期 10秒
            recover: 4000    // 恢复期 4秒
        };
        
        // 边缘生成参数
        this.edgeOffsets = {
            top: { x: 0, y: -16 },
            bottom: { x: 0, y: 16 },
            left: { x: -16, y: 0 },
            right: { x: 16, y: 0 }
        };
        
        // 箭矢池参数
        this.maxArrows = 100;
    }
    
    // 获取配置
    getConfig() {
        return this.config;
    }
    
    // 获取特定参数
    getParam(paramName) {
        return this.config[paramName];
    }
    
    // 更新参数
    updateParam(paramName, value) {
        if (paramName in this.config) {
            this.config[paramName] = value;
            console.log(`参数 ${paramName} 已更新为: ${value}`);
            return true;
        }
        
        console.warn(`未知参数: ${paramName}`);
        return false;
    }
    
    // 批量更新参数
    updateParams(params) {
        for (let key in params) {
            if (key in this.config) {
                this.config[key] = params[key];
            }
        }
        console.log('参数已批量更新');
    }
}

// 创建全局单例
const difficultyConfig = new DifficultyConfig();