"use strict";
addLayer("a", {
    name: "aprestige",
    symbol: "A",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: n(0),
            total: n(0),
            best: n(0),
            resetTime: 0,
            antip: n(0),
            chalcount: [null, n(0)],
            pmat1: false,
            pmat2: false,
            pnat: false,
            dpat: false,
            atcu: false,
            ateu: false,
            atcp: false,
        }
    },
    color: "#e34f9e",
    requires: n("1e213"),
    resource: "反-点数",
    baseResource: "增强点数",
    branches: ["e", "c"],
    baseAmount() { return player.e.points },
    type: "normal",
    row: 3,
    doReset(resettingLayer) {
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    passiveGeneration() {
        let mult = 0
        return mult
    },
    effect() {
        let eff = player.a.points.add(1)
        return eff
    },
    effectDescription() {
        let dis = "增强点数*<h2 style='color: #e34f9e; text-shadow: 0 0 10px #e34f9e'>" + format(tmp.a.effect) + "</h2>"
        return dis
    },
    exponent2() {
        let exp = 0.9
        return exp
    },
    exponent() {
        let exp = 0.05
        return exp
    },
    gainMult() {
        let mult = n(1)
        if (hu("a", 12)) mult = mult.mul(10)
        return mult
    },
    gainExp() {
        let exp = n(1)
        return exp
    },
    getResetGain() {
        if (player.e.points.lt("1e213")) return n(0)
        let gain = player.e.points.div("1e213").max(1).pow(tmp.a.exponent).mul(tmp.a.gainMult).pow(tmp.a.gainExp)
        return gain.floor()
    },
    getNextAt() {
        let next = tmp.a.getResetGain.add(1).root(tmp.a.gainExp).div(tmp.a.gainMult).root(tmp.a.exponent).mul("e213").max("e213")
        return next
    },
    update(diff) {
    },
    hotkeys: [
        {
            key: "a", description: "A:重置以获取反-点数",
            unlocked() { return (hasChallenge("e", 22) || player.a.total.gte(1) || ha("ach", 14)) },
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        },
    ],
    tabFormat: {
        "upgrades": {
            unlocked() { return true },
            name: "升级",
            content: [
                "main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                ["upgrades", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
            ],
        },
        "Milestones": {
            unlocked() { return true },
            name: "里程碑",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                "milestones"
            ],
        },
        "Challenges": {
            unlocked() { return hm("a", 5) },
            name: "挑战",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                "challenges"
            ],
        },
    },
    upgrades: {
        11: {
            title: "A1",
            description: "点数膨胀不再削弱声望点数和声望力量 但无效化C12和C19",
            cost: n(25),
            unlocked() { return true },
        },
        12: {
            title: "A2",
            description: "反-点数削弱压缩点数价格 反-点数*10",
            effect() { return player.a.points.max(1).pow(125) },
            effectDisplay() { return "/" + format(upgradeEffect('a', 12)) },
            cost: n(100),
            unlocked() { return hu("a", 11) },
        },
        13: {
            title: "A3",
            description: "你可以自动更新点数膨胀内最佳点数 并且效果更好",
            cost: n(1000),
            unlocked() { return hu("a", 12) },
        },
        14: {
            title: "A4",
            description: "基于反点数挑战完成次数加成反-点数",
            effect() { return Decimal.pow(2,player.a.chalcount[1]) },
            effectDisplay() { return "*" + format(upgradeEffect('a', 14)) },
            cost: n(10000),
            unlocked() { return hu("a", 13) },
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 反-点数 (1)",
            effectDescription: "自动购买PM-B-1,2,3,4,5,6 保留增强点数里程碑1,2,3,4,9 点数*100 压缩点数效果变得更好",
            done() { return player.a.points.gte(1) },
            toggles: [["a", "pmat1"]],
        },
        1: {
            requirementDescription: "2 反-点数 (2)",
            effectDescription: "自动购买增强点数和压缩点数升级 自动重置压缩点数 压缩点数不再重置所有东西 声望点数*1e9",
            done() { return player.a.points.gte(2) },
            toggles: [["a", "atcu"], ["a", "ateu"], ["a", "atcp"]],
        },
        2: {
            requirementDescription: "3 反-点数 (3)",
            effectDescription: "自动购买点数膨胀购买项 膨胀点数*10",
            done() { return player.a.points.gte(3) },
            toggles: [["a", "dpat"]],
        },
        3: {
            requirementDescription: "4 反-点数 (4)",
            effectDescription: "保留增强点数里程碑和挑战 自动购买PN购买项",
            done() { return player.a.points.gte(4) },
            toggles: [["a", "pnat"]],
        },
        4: {
            requirementDescription: "5 反-点数 (5)",
            effectDescription: "保留点数膨胀内最佳点数和撕裂膨胀内最佳点数/秒",
            done() { return player.a.points.gte(5) },
        },
        5: {
            requirementDescription: "1000 反-点数 (6)",
            effectDescription: "你可以购买P3 解锁挑战",
            done() { return player.a.points.gte(1000) },
        },
    },
    buyables: {

    },
    clickables: {

    },
    challenges: {
        11: {
            name: "声望力量衰变",
            challengeDescription: function () {
                let c11 = "声望力量购买项效果锁定为2 声望力量超过1e20的部分指数^0.5"
                if (inChallenge("a", 11)) c11 = c11 + " (挑战中)"
                c11 = c11 + "<br>完成次数:" + format(player.a.chalcount[1], 0)
                if (inChallenge("a", 11)) c11 = c11 + " (+" + format(tmp.a.challenges[11].countcalc.sub(player.a.chalcount[1]).max(0), 0) + ") <br>下一次完成在 " + format(tmp.a.challenges[11].getNextAt) + " 声望力量"
                return c11
            },
            goal: n(1e98),
            canComplete: function () { return player.p.pp.gte(this.goal) },
            currencyDisplayName: "声望力量",
            rewardDescription: "P1变得更好",
            completionLimit: 1e308,
            countcalc() {
                let x = player.p.pp.div(1e98).max(1).log(1e7).max(0).root(1.6).add(1)
                if (player.p.pp.lte(1e98)) return n(0)
                return x.floor()
            },
            getNextAt() {
                let amt = tmp.a.challenges[11].countcalc.max(player.a.chalcount[1])
                let next = Decimal.pow(1e7, amt.pow(1.6)).mul(1e98)
                return next
            },
            onComplete() {
                player.a.chalcount[1] = tmp.a.challenges[11].countcalc.floor().max(player.a.chalcount[1])
            },
            effect() {
                let c11 = player.a.chalcount[1].pow(0.75).mul(25)
                return player.a.chalcount[1].lt(1) ? n(0) : c11
            },
            rewardDisplay() { return "基础指数+" + format(this.effect()) },
            unlocked() {
                return hm("a", 5)
            },
            marked() {return false},
        },
    },
    layerShown() { return (hasChallenge("e", 22) || player.a.total.gte(1) || ha("ach", 36)) },
}) 