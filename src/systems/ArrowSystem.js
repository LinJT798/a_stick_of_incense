class ArrowSystem {
    constructor(scene, playerController) {
        this.scene = scene;
        this.playerController = playerController;
        
        // 箭矢对象池
        this.arrowPool = [];
        this.activeArrows = [];
        this.maxArrows = 100;
        
        // 难度参数
        this.gameTime = 0;
        this.spawnBudget = 0;
        this.baseSpawnRate = 0.5; // L0
        this.spawnRateGrowth = 0.02; // a
        this.spawnRateLogGrowth = 0.1; // b
        
        // 箭矢速度参数
        this.baseSpeed = 200; // v0
        this.maxSpeed = 600; // vMax
        this.speedGrowth = 15; // c
        
        // 公平性参数
        this.minTTC = 0.3; // 最小反应时间
        this.safeRadius = 80; // 安全半径
        this.preDelay = 160; // 读条时间（毫秒）
        
        // 模式系统
        this.currentMode = 'calm';
        this.modeTimer = 0;
        this.modeDurations = {
            calm: 5000,
            build: 8000,
            peak: 10000,
            recover: 4000
        };
        
        // 边缘生成参数
        this.edgeOffsets = {
            top: { x: 0, y: -16 },
            bottom: { x: 0, y: 16 },
            left: { x: -16, y: 0 },
            right: { x: 16, y: 0 }
        };
        
        // 导演系统
        this.recentTTCs = [];
        this.dangerLevel = 0;
        
        this.createArrowPool();
    }

    createArrowPool() {
        for (let i = 0; i < this.maxArrows; i++) {
            const arrow = this.scene.physics.add.sprite(-100, -100, 'arrow');
            arrow.setDisplaySize(83, 24);
            arrow.setActive(false);
            arrow.setVisible(false);
            arrow.body.setSize(70, 20);
            this.arrowPool.push(arrow);
        }
    }

    start() {
        this.gameTime = 0;
        this.spawnBudget = 0;
        this.currentMode = 'calm';
        this.modeTimer = 0;
        this.dangerLevel = 0;
        this.recentTTCs = [];
    }

    update(delta) {
        if (!this.playerController || !this.playerController.player.active) return;
        
        this.gameTime += delta;
        this.modeTimer += delta;
        
        // 更新模式
        this.updateMode();
        
        // 计算当前生成率
        const spawnRate = this.calculateSpawnRate();
        
        // 累积生成预算
        this.spawnBudget += spawnRate * (delta / 1000);
        
        // 生成箭矢
        while (this.spawnBudget >= 1) {
            this.spawnArrow();
            this.spawnBudget -= 1;
        }
        
        // 更新所有活动箭矢
        this.updateArrows(delta);
        
        // 更新导演系统
        this.updateDirector();
    }

    updateMode() {
        const duration = this.modeDurations[this.currentMode];
        
        if (this.modeTimer >= duration) {
            this.modeTimer = 0;
            
            // 状态转换
            switch (this.currentMode) {
                case 'calm':
                    this.currentMode = 'build';
                    break;
                case 'build':
                    this.currentMode = 'peak';
                    break;
                case 'peak':
                    this.currentMode = 'recover';
                    break;
                case 'recover':
                    this.currentMode = 'calm';
                    break;
            }
        }
    }

    calculateSpawnRate() {
        const t = this.gameTime / 1000; // 转换为秒
        let baseRate = this.baseSpawnRate + this.spawnRateGrowth * t + 
                      this.spawnRateLogGrowth * Math.log(1 + t);
        
        // 根据模式调整
        const modeMultipliers = {
            calm: 0.6,
            build: 1.0,
            peak: 1.5,
            recover: 0.3
        };
        
        baseRate *= modeMultipliers[this.currentMode];
        
        // 根据危险等级调整
        baseRate *= (1 - this.dangerLevel * 0.2);
        
        return Math.max(0.2, baseRate);
    }

    calculateArrowSpeed() {
        const t = this.gameTime / 1000;
        const speed = this.baseSpeed + this.speedGrowth * Math.sqrt(t);
        return Math.min(speed, this.maxSpeed);
    }

    spawnArrow() {
        const arrow = this.getArrowFromPool();
        if (!arrow) return;
        
        // 选择生成边
        const edge = this.selectSpawnEdge();
        const position = this.getSpawnPosition(edge);
        
        // 计算目标和方向
        const playerPos = this.playerController.getPosition();
        const target = this.addNoise(playerPos);
        const direction = this.calculateDirection(position, target);
        
        // 验证公平性
        if (!this.validateFairness(position, direction)) {
            this.returnArrowToPool(arrow);
            return;
        }
        
        // 设置箭矢属性
        arrow.setPosition(position.x, position.y);
        arrow.setRotation(direction.angle);
        arrow.setActive(true);
        arrow.setVisible(true);
        
        const speed = this.calculateArrowSpeed();
        arrow.setVelocity(direction.x * speed, direction.y * speed);
        
        // 添加到活动列表
        arrow.spawnTime = this.gameTime;
        arrow.speed = speed;
        this.activeArrows.push(arrow);
        
        // 根据模式可能生成多支箭（扇射、对射等）
        this.applyModePattern(edge, position, target);
    }

    selectSpawnEdge() {
        const edges = ['top', 'bottom', 'left', 'right'];
        const weights = [1, 1, 1, 1];
        
        // 根据玩家位置调整权重
        const playerPos = this.playerController.getPosition();
        if (playerPos.x < 400) weights[3] *= 1.5; // 右边权重增加
        if (playerPos.x > 800) weights[2] *= 1.5; // 左边权重增加
        if (playerPos.y < 300) weights[1] *= 1.5; // 下边权重增加
        if (playerPos.y > 600) weights[0] *= 1.5; // 上边权重增加
        
        return this.weightedRandom(edges, weights);
    }

    getSpawnPosition(edge) {
        const margin = 24; // 避开角落
        let x, y;
        
        switch (edge) {
            case 'top':
                x = margin + Math.random() * (1512 - 2 * margin);
                y = this.edgeOffsets.top.y;
                break;
            case 'bottom':
                x = margin + Math.random() * (1512 - 2 * margin);
                y = 982 + this.edgeOffsets.bottom.y;
                break;
            case 'left':
                x = this.edgeOffsets.left.x;
                y = margin + Math.random() * (982 - 2 * margin);
                break;
            case 'right':
                x = 1512 + this.edgeOffsets.right.x;
                y = margin + Math.random() * (982 - 2 * margin);
                break;
        }
        
        return { x, y };
    }

    addNoise(position) {
        const noiseRadius = 30;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * noiseRadius;
        
        return {
            x: position.x + Math.cos(angle) * distance,
            y: position.y + Math.sin(angle) * distance
        };
    }

    calculateDirection(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return {
            x: dx / distance,
            y: dy / distance,
            angle: Math.atan2(dy, dx)
        };
    }

    validateFairness(position, direction) {
        const playerPos = this.playerController.getPosition();
        const speed = this.calculateArrowSpeed();
        
        // 计算到玩家的距离
        const dx = playerPos.x - position.x;
        const dy = playerPos.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算TTC (Time To Collision)
        const ttc = distance / speed;
        
        // 检查最小反应时间
        if (ttc < this.minTTC) {
            return false;
        }
        
        // 检查安全半径
        if (distance < this.safeRadius) {
            return false;
        }
        
        // 记录TTC用于导演系统
        this.recentTTCs.push(ttc);
        if (this.recentTTCs.length > 20) {
            this.recentTTCs.shift();
        }
        
        return true;
    }

    applyModePattern(edge, position, target) {
        if (this.currentMode === 'peak') {
            // 扇射模式
            if (Math.random() < 0.3) {
                const angleOffset = 15 * Math.PI / 180;
                for (let i = -1; i <= 1; i += 2) {
                    const arrow = this.getArrowFromPool();
                    if (!arrow) continue;
                    
                    const newAngle = Math.atan2(target.y - position.y, target.x - position.x) + i * angleOffset;
                    arrow.setPosition(position.x, position.y);
                    arrow.setRotation(newAngle);
                    arrow.setActive(true);
                    arrow.setVisible(true);
                    
                    const speed = this.calculateArrowSpeed() * 0.9;
                    arrow.setVelocity(Math.cos(newAngle) * speed, Math.sin(newAngle) * speed);
                    arrow.spawnTime = this.gameTime;
                    arrow.speed = speed;
                    this.activeArrows.push(arrow);
                }
            }
        }
    }

    updateArrows(delta) {
        for (let i = this.activeArrows.length - 1; i >= 0; i--) {
            const arrow = this.activeArrows[i];
            
            // 检查是否超出屏幕边界
            if (arrow.x < -100 || arrow.x > 1612 || arrow.y < -100 || arrow.y > 1082) {
                this.returnArrowToPool(arrow);
                this.activeArrows.splice(i, 1);
            }
        }
    }

    updateDirector() {
        // 计算危险等级
        if (this.recentTTCs.length > 0) {
            const avgTTC = this.recentTTCs.reduce((a, b) => a + b, 0) / this.recentTTCs.length;
            
            if (avgTTC < 0.5) {
                this.dangerLevel = Math.min(1, this.dangerLevel + 0.01);
            } else if (avgTTC > 1.0) {
                this.dangerLevel = Math.max(0, this.dangerLevel - 0.01);
            }
        }
    }

    getArrowFromPool() {
        for (let arrow of this.arrowPool) {
            if (!arrow.active) {
                return arrow;
            }
        }
        return null;
    }

    returnArrowToPool(arrow) {
        arrow.setActive(false);
        arrow.setVisible(false);
        arrow.setPosition(-100, -100);
        arrow.setVelocity(0, 0);
    }

    weightedRandom(items, weights) {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        
        return items[items.length - 1];
    }

    checkCollision(player) {
        // 玩家使用圆形碰撞检测
        const playerCenterX = player.x;
        const playerCenterY = player.y;
        const playerRadius = 35; // 玩家半径，略小于显示尺寸的一半
        
        for (let arrow of this.activeArrows) {
            if (!arrow.active) continue;
            
            // 箭矢作为线段处理
            const arrowLength = 70; // 箭矢实际长度
            const arrowAngle = arrow.rotation;
            
            // 计算箭矢的头尾位置
            const arrowTailX = arrow.x - Math.cos(arrowAngle) * arrowLength / 2;
            const arrowTailY = arrow.y - Math.sin(arrowAngle) * arrowLength / 2;
            const arrowHeadX = arrow.x + Math.cos(arrowAngle) * arrowLength / 2;
            const arrowHeadY = arrow.y + Math.sin(arrowAngle) * arrowLength / 2;
            
            // 计算点到线段的最短距离
            const distance = this.pointToLineDistance(
                playerCenterX, playerCenterY,
                arrowTailX, arrowTailY,
                arrowHeadX, arrowHeadY
            );
            
            // 如果距离小于玩家半径，则发生碰撞
            if (distance < playerRadius) {
                return true;
            }
        }
        return false;
    }
    
    // 计算点到线段的最短距离
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        let param = -1;
        if (lenSq !== 0) {
            param = dot / lenSq;
        }
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    reset() {
        // 清理所有活动箭矢
        for (let arrow of this.activeArrows) {
            this.returnArrowToPool(arrow);
        }
        this.activeArrows = [];
        
        // 重置参数
        this.gameTime = 0;
        this.spawnBudget = 0;
        this.currentMode = 'calm';
        this.modeTimer = 0;
        this.dangerLevel = 0;
        this.recentTTCs = [];
    }

    getActiveArrows() {
        return this.activeArrows;
    }
}