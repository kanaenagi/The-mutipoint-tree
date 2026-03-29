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
            tooltip: "获取1,000,000点数",
            done() {
                return player.points.gte(1000000)
            },
        },
        13: {
            name: "这是刷PP的游戏?",
            tooltip: "解锁声望力量",
            done() {
                return hm("p",0)
            },
        },
        14: {
            name: "第二行的开始",
            tooltip: "获取1增强点数",
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
            name: "扩展更新",
            tooltip: "购买P11",
            done() {
                return hu('p', 31)
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
            name: "点数太膨胀了",
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
    baseResource: "声望力量",
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

