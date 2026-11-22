"use strict";
// side layers

addLayer("ach", {
    name: "ach",
    symbol: "Ac",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#FFFF00",
    requires: new Decimal(10),
    resource: "成就",
    tooltip: "成就",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "none",
    exponent: 0.5,
    row: 'side',
    hotkeys: [
    ],
    branches: [],
    update(diff) {
        player.ach.points = n(player.ach.achievements.length);
    },
    tabFormat: [
        "main-display", "achievements"
    ],
    achievements: {
        11: {
            name: "开始",
            tooltip: "获取10点数",
            done() {
                return player.points.gte(10)
            },
        },
        12: {
            name: "百万点数",
            tooltip: "获取1,000,000点数<br>奖励:声望点数*2",
            done() {
                return player.points.gte(1000000)
            },
        },
        13: {
            name: "声望增幅",
            tooltip: "解锁声望力量",
            done() {
                return hm("p",0)
            },
        },
        14: {
            name: "第二行的开始",
            tooltip: "获取1增强点数<br>奖励:声望力量*2",
            done() {
                return player.e.points.gte(1)
            },
        },
        15: {
            name: "增强挑战",
            tooltip: "完成声望削弱一次",
            done() {
                return player.e.challenges[11] >= 1
            },
        },
        16: {
            name: "纯粹回忆",
            tooltip: "获取1PM",
            done() {
                return player.e.pm.gte(1)
            },
        },
        21: {
            name: "压缩层级",
            tooltip: "获取1压缩点数 <br>奖励:声望力量*5",
            done() {
                return player.c.points.gte(1)
            },
        },
        22: {
            name: "这就结束了?",
            tooltip: "完成5次声望削弱和点数溶解",
            done() {
                return player.e.challenges[11] >= 5 && player.e.challenges[12] >= 5
            },
        },
        23: {
            name: "新机制要来了?",
            tooltip: "获取1e1000点数",
            done() {
                return player.points.gte('1e1000')
            },
        },
        24: {
            name: "加速膨胀",
            tooltip: "解锁点数膨胀",
            done() {
                return hu('c', 15)
            },
        },
        25: {
            name: "五倍压缩",
            tooltip: "获取5压缩点数",
            done() {
                return player.c.points.gte(5)
            },
        },
        26: {
            name: "并非note",
            tooltip: "解锁PN",
            done() {
                return hm('e', 10)
            },
        },
        31: {
            name: "声望膨胀",
            tooltip: "获取1e5000声望点数",
            done() {
                return player.p.points.gte('1e5000')
            },
        },
        32: {
            name: "奇点, 第二行的结束...?",
            tooltip: "解锁奇点",
            done() {
                return hu('c', 25)
            },
        },
        33: {
            name: "无限增强",
            tooltip: "获取1.797e308增强点数",
            done() {
                return player.e.points.gte('1.797e308')
            },
        },
        34: {
            name: "二重压缩点数",
            tooltip: "获取16压缩点数",
            done() {
                return player.c.points.gte(16)
            },
        },
        35: {
            name: "进入第三行",
            tooltip() { 
                return "获取1反-点数<br>奖励:点数 声望点数 声望力量基于成就数量加成<br>当前:*"+format(this.effect())
            },
            effect() {
                return Decimal.pow(2, player.ach.achievements.length)
            },
            done() {
                return player.a.points.gte(1)
            },
        },
        36: {
            name: "指数推进",
            tooltip: "解锁推进器",
            done() {
                return hu('a', 15)
            },
        },
        41: {
            name: "完全挑战 I",
            tooltip: "完成所有增强点数挑战5次<br>奖励:反-点数*2",
            done() {
                return player.e.challenges[11] >= 5 && player.e.challenges[12] >= 5 && player.e.challenges[21] >= 5 && player.e.challenges[22] >= 5
            },
        },
        42: {
            name: "'无效'压缩",
            tooltip: "完成10次无效压缩",
            done() {
                return player.a.chalcount[2].gte(10)
            },
        },
        43: {
            name: "推进改良",
            tooltip: "解锁推进器充能",
            done() {
                return hu('a', 23)
            },
        },
        44: {
            name: "维度提升",
            tooltip: "解锁维度",
            done() {
                return hu('a', 25)
            },
        },
        45: {
            name: "永恒增强",
            tooltip: "获取1e4000增强点数",
            done() {
                return player.e.points.gte('1e4000')
            },
        },
    },
    layerShown() { return true },
})

addLayer("T", {  //喜欢不内置vue的小朋友们叉出去
    name: "test",
    symbol: "T",
    position: 1,
    startData() {
        return {
            unlocked: true,
            points: n(0),
        }
    },
    color: "#FFFFFFF",
    resource: "",
    baseResource: "",
    tooltip: "测试",
    baseAmount() { return player.points },
    row: "side",
    type: "none",
    exponent: 0.5,
    layerShown() { return false },
    update(diff) {
    },
    upgrades: {
        251: {
            fullDisplay: "<span style = 'font-size:10px' >重置获取一个QqQe308</span>",
        },
    },
    SpeedCal() {
        let base = 1
        return base 
    },
    tabFormat: {
    "main": {
        unlocked() { return true },
        name: "主页",
        content: [
                ["blank", "50000px"],  //不是哥们 你一堆blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank,blank干什么啊 
                ["upgrades", [25]],
                ["blank", "250000px"],
                ["display-text",`你都翻到这里了 请检测你是不是机器人<br><button class="opt" onclick="window.alert('验证失败');window.location.reload()">人机验证</button>`],
            ]
        },
    },
})

