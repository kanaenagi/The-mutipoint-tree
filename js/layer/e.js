"use strict";
addLayer("e", {
    name: "eprestige",
    symbol: "E",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: n(0),
            total: n(0),
            best: n(0),
            bxat1: false,
            p1a1: false,
            atup: false,
            pm: n(0),
            pn: n(0),
        }
    },
    color: "#1c56b4",
    requires: n(1e17),
    resource: "增强点数",
    baseResource: "声望力量",
    branches: ["p"],
    baseAmount() { return player.p.pp },
    type: "normal",
    doReset(resettingLayer) {
        let keep = []
        if (hm("a", 0)) keep.push("bxat1", "p1a1", "atup")
        if (hm("a", 2)) keep.push("milestones", "challenges")
        if (hm("a", 4)) keep.push("ec4gain")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
        if (hm("a", 0) && !hm("a", 2)) player.e.milestones.push("0", "1", "2", "3", "8")
    },
    autoUpgrade() { return player.a.ateu },
    exponent() {
        let exp = 0.08
        return exp
    },
    gainMult() {
        let mult = n(1)
        if (hu("e", 11)) mult = mult.mul(tmp.e.upgrades[11].effect)
        if (hu("e", 22)) mult = mult.mul(tmp.e.upgrades[22].effect)
        if (hu("e", 24)) mult = mult.mul(tmp.e.upgrades[24].effect)
        if (hm("e", 11)) mult = mult.mul(tmp.e.milestones[11].effect)
        if (hu("e", 44)) mult = mult.mul(tmp.e.upgrades[44].effect)
        mult = mult.mul(tmp.e.challenges[11].effect)
        mult = mult.mul(tmp.e.buyables[22].effect)
        if (hu("c", 31)) mult = mult.mul(tmp.c.upgrades[31].effect)
        mult = mult.mul(tmp.c.buyables[12].effect)
        mult = mult.mul(tmp.c.buyables[22].effect)
        mult = mult.mul(tmp.c.effect[1])
        if (hu("c", 55)) mult = mult.mul(100)
        //mult = mult.mul(tmp.a.effect)
        return mult
    },
    gainExp() {
        let exp = n(1)
        return exp
    },
    passiveGeneration() {
        let mult = 0
        if (hu("e", 15)) mult += 1
        return mult
    },
    effect() {
        let eff = n(1)
        eff = player.e.points.mul(2).add(1).pow(2)
        if (hu("e", 54)) eff = eff.pow(tmp.e.upgrades[54].effect)
        return eff
    },
    effectDescription() {
        let dis = "点数和声望点数*<h2 style='color: #1c56b4; text-shadow: 0 0 10px #1c56b4'>" + format(tmp.e.effect) + "</h2>"
        return dis
    },
    getResetGain() {
        if (player.p.pp.lt(tmp.e.requires)) return n(0)
        let gain = player.p.pp.div(tmp.e.requires).max(1).pow(tmp.e.exponent).mul(tmp.e.gainMult).pow(tmp.e.gainExp)
        if (getClickableState("c", 11) == 1 && !hu("c", 33)) return expPow(gain, getpointdileff())
        return gain.floor()
    },
    getNextAt() {
        let next = tmp.e.getResetGain.add(1).root(tmp.e.gainExp).div(tmp.e.gainMult).root(tmp.e.exponent).mul(tmp.e.requires).max(tmp.e.requires)
        if (isNaN(next.mag)) return n(tmp.e.requires)
        if (getClickableState("c", 11) == 1 && !hu("c", 33)) return expRoot(next, 0.75)
        return next
    },
    pmGain() {
        if (!hm("e", 6)) return n(0)
        let base = tmp.e.buyables[11].effect
        // base = base.mul(tmp.c.buyables[22].effect)
        let bexp = n(0)
        if (hm("e", 9)) bexp = bexp.add(3)
        if (hu("e", 33)) bexp = bexp.add(3)
        bexp = bexp.add(tmp.e.buyables[13].effect)
        let mult = n(1)
        mult = mult.mul(tmp.e.buyables[12].effect)
        if (hu("c", 13)) mult = mult.mul(tmp.c.upgrades[13].effect)
        if (hu("e", 21)) mult = mult.mul(tmp.e.upgrades[21].effect)
        if (hu("e", 35)) mult = mult.mul(tmp.e.upgrades[35].effect)
        if (hu("p", 31)) mult = mult.mul(tmp.p.upgrades[31].effect)
        if (hu("p", 41)) mult = mult.mul(tmp.p.upgrades[41].effect)
        if (hu("p", 52)) mult = mult.mul(tmp.p.upgrades[52].effect)
        mult = mult.mul(Decimal.pow(base, bexp))
        mult = mult.mul(tmp.e.pneff[0])
        let gain = base.mul(mult)
        return gain
    },
    pmEff() {
        let exp = n(1)
        if (hu('p', 32)) exp = exp.mul(tmp.p.upgrades[32].effect)
        if (hu('e', 32)) exp = exp.mul(1.2)
        if (hu("c", 14)) exp = exp.mul(tmp.c.upgrades[14].effect)
        let eff = player.e.pm.add(1).max(1).pow(exp.mul(0.5))
        return eff
    },
    pngain() {
        if (player.e.pm.lt(1e211)) return n(0)
        let base = player.e.pm.div(1e210).log(10)
        let bexp = n(0)
        bexp = bexp.add(tmp.e.buyables[32].effect)
        let mult = n(1)
        if (hu("c", 23)) mult = mult.mul(tmp.c.upgrades[23].effect)
        mult = mult.mul(tmp.e.buyables[31].effect)
        mult = mult.mul(Decimal.pow(base, bexp))
        if (hu("c", 35)) mult = mult.mul(100)
        let exp = n(1)
        exp = exp.mul(tmp.e.buyables[33].effect)
        let gain = base.mul(mult).pow(exp)
        return gain
    },
    pneff() {
        let eff = Array.from({ length: 2 }, () => n(1))
        eff[0] = player.e.pn.add(1).pow(2)
        eff[1] = player.e.pn.add(10).max(10).log(10).pow(0.4).mul(0.1).add(0.9)
        if (hasChallenge("e", 22)) eff[0] = eff[0].add(player.e.pn.add(10).max(10).log(10).log(10).mul(0.04))
        return eff
    },
    row: 2, // Row the layer is in on the tree (0 is the first row) [其实1 2 3都可以]
    update(diff) {
        if (hm("e", 6)) player.e.pm = player.e.pm.add(tmp.e.pmGain.mul(diff))
        if (hm("e", 10)) player.e.pn = player.e.pn.add(tmp.e.pngain.mul(diff))
        if (player.a.pmat1) {
            layers.e.buyables[11].buyMax()
            layers.e.buyables[12].buyMax()
            layers.e.buyables[13].buyMax()
            layers.e.buyables[21].buyMax()
            layers.e.buyables[22].buyMax()
            layers.e.buyables[23].buyMax()
        }
        if (player.a.pnat) {
            layers.e.buyables[31].buyMax()
            layers.e.buyables[32].buyMax()
            layers.e.buyables[33].buyMax()
        }
        //if (hu("a", 12)) player.e.ec4gain = Decimal.tetrate(10,tmp.pointGen.slog(10).pow(0.75)).max(1).log(10).max(player.e.ec4gain)
    },
    hotkeys: [
        {
            key: "e", description: "E:重置以获取增强点数",
            unlocked() { return (hm("p", 1) || player.e.total.gte(1) || ha("ach", 14)) },
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        },
    ],
    microtabs: {
    },
    tabFormat: {
        "upgrades": {
            unlocked() { return true },
            name: "升级",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                "upgrades"
            ],
        },
        "milestones": {
            unlocked() { return true },
            name: "里程碑",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                "milestones"
            ],
        },
        "challenges": {
            unlocked() { return hm("e", 5) },
            name: "挑战",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                "challenges",
            ],
        },
        "PM": {
            unlocked() { return hm("e", 6) },
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                ["display-text", function () { return "你有 <h3 style='color: #1c56b4; text-shadow: 0 0 10px #1c56b4'>" + format(player.e.pm) + "</h3 > PM 点数*<h3 style='color: #1c56b4; text-shadow: 0 0 10px #1c56b4'>" + format(tmp.e.pmEff) + "<h3><br>你每秒获取" + format(tmp.e.pmGain) + "PM/s" }],
                ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
                ["row", [["buyable", 21], ["buyable", 22], ["buyable", 23]]],
            ],
        },
        "PN": {
            unlocked() { return hm("e", 10) },
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                ["display-text", function () { return "你有 <h3 style='color: #1c56b4; text-shadow: 0 0 10px #1c56b4'>" + format(player.e.pn) + "</h3> PN PM*<h3 style='color: #1c56b4; text-shadow: 0 0 10px #1c56b4'>" + format(tmp.e.pneff[0]) + "<h3><br>你每秒获取" + format(tmp.e.pngain) + "PN/s (开始于1e211PM)" }],
                ["row", [["buyable", 31], ["buyable", 32], ["buyable", 33]]],
                ["row", [["buyable", 41], ["buyable", 42], ["buyable", 43]]],
            ],
        },
    },
    upgrades: {
        11: {
            title: "E1",
            description: "点数加成增强点数",
            effect() {
                let eff = player.points.max(10).log10().pow(0.25)
                if (hu('p', 33)) eff = eff.pow(tmp.p.upgrades[33].effect)
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('e', 11)) },
            cost: n(20),
            unlocked() { return true },
        },
        12: {
            title: "E2",
            description: "'力量指数'基础效果+0.05",
            cost: n(250),
            unlocked() { return hu("e", 11) },
        },
        13: {
            title: "E3",
            description: "点数加成声望力量",
            effect() {
                let eff = player.points.max(10).log10().pow(2)
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('e', 13)) },
            cost: n(500),
            unlocked() { return hu("e", 12) },
        },
        14: {
            title: "E4",
            description: "增强点数加成'力量加成'",
            effect() {
                return player.e.points.add(10).max(10).log(10).add(9).log(10).mul(1.1)
            },
            effectDisplay() { return "*" + format(upgradeEffect('e', 14)) },
            cost: n(100000),
            unlocked() { return hu("e", 13) },
        },
        15: {
            title: "E5",
            description: "每秒获取100%的增强点数",
            cost: n(1e6),
            unlocked() { return hu("e", 14) },
        },
        21: {
            title: "E6",
            description: "声望力量加成PM",
            effect() {
                let eff = player.p.pp.add(10).log10()
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('e', 21)) },
            cost: n(1e12),
            unlocked() { return hu("e", 15) },
        },
        22: {
            title: "E7",
            description: "基于P-B-1加成增强点数",
            effect() {
                let eff = player.p.buyables[11].add(1)
                if (hu('c', 12)) eff = eff.pow(eff.log10().mul(0.5).add(0.5))
                if (player.e.points.gte(1e41) && hm("e", 9)) eff = eff.add(1).pow(1.5)
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('e', 22)) },
            cost: n(1e13),
            unlocked() { return hu("e", 21) },
        },
        23: {
            title: "E8",
            description: "增强点数加成P3",
            effect() {
                return player.e.points.add(10).max(10).log(10).pow(0.4)
            },
            effectDisplay() { return "^" + format(upgradeEffect('e', 23)) },
            cost: n(1e24),
            unlocked() { return hu("e", 22) },
        },
        24: {
            title: "E9",
            description: "增强点数升级加成增强点数",
            effect() { return 2 ** player.e.upgrades.length },
            effectDisplay() { return "*" + format(upgradeEffect('e', 24)) },
            cost: n(1e40),
            unlocked() { return hu("e", 23) },
        },
        25: {
            title: "E10",
            description: "解锁压缩点数",
            cost: n(1e45),
            unlocked() { return hu("e", 24) },
        },
        31: {
            title: "E11",
            description: "解锁更多声望点数升级",
            cost: n(1e59),
            unlocked() { return hu("e", 25) },
        },
        32: {
            title: "E12",
            description: "PM基础效果^1.2",
            cost: n(1e71),
            unlocked() { return hu("e", 31) },
        },
        33: {
            title: "E13",
            description: "PM基础指数+3",
            cost: n(1e92),
            unlocked() { return hu("e", 32) },
        },
        34: {
            title: "E14",
            description: "PM-B-2,5基础效果^1.1",
            cost: n(1e107),
            unlocked() { return hu("e", 33) },
        },
        35: {
            title: "E15",
            description: "膨胀点数加成PM",
            cost: n(4.85e70),
            effect() {
                let eff = expPow(player.c.dp.max(1), 0.8).pow(0.5).mul(2)
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('e', 35)) },
            unlocked() { return hu("e", 34) },
        },
        41: {
            title: "E16",
            description: "削弱PM-B-1基础价格",
            cost: n(2.15e84),
            unlocked() { return hu("e", 350) },
        },
        42: {
            title: "E17",
            description: "PM-B-4基础效果^1.2",
            cost: n(1e104),
            unlocked() { return hu("e", 41) },
        },
        43: {
            title: "E18",
            description: "'对数领域'奖励指数^1.05",
            cost: n(1e144),
            unlocked() { return hu("e", 42) },
        },
        44: {
            title: "E19",
            description: "基于膨胀点数加成增强点数",
            cost: n(1.5e171),
            effect() {
                let eff = expPow(player.c.dp, 0.75).pow(0.2).max(1)
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('e', 44)) },
            unlocked() { return hu("e", 43) },
        },
        45: {
            title: "E20",
            description: "PM-B-1基础效果*1.25",
            cost: n(5e179),
            unlocked() { return hu("e", 44) },
        },
        51: {
            title: "E21",
            description: "里程碑2效果指数^1.1",
            cost: n(3e186),
            unlocked() { return hu("e", 45) },
        },
        52: {
            title: "E22",
            description: "PM-B-1基础效果*1.6",
            cost: n(1e187),
            unlocked() { return hu("e", 51) },
        },
        53: {
            title: "E23",
            description: "P7^50",
            cost: n(2e194),
            unlocked() { return hu("e", 52) },
        },
        54: {
            title: "E24",
            description: "基于压缩点数加成增强点数效果",
            cost: n(1e207),
            effect() {
                let eff = player.c.points.add(1).max(1).pow(1.25).mul(0.001).add(1).softcap(n(10), 10, "log")
                return eff
            },
            effectDisplay() { return "^" + format(upgradeEffect('e', 54)) },
            unlocked() { return hu("e", 53) },
        },
        55: {
            title: "E25",
            description: "削弱PM-B-3价格 膨胀点数*1000",
            cost: n(5e208),
            unlocked() { return hu("e", 54) },
        },
    },
    milestones: {
        0: {
            requirementDescription: "2 增强点数 (1)",
            effectDescription: "自动购买P-B-1,2,3",
            done() { return player.e.points.gte(2) },
            toggles: [["e", "bxat1"]],
        },
        1: {
            requirementDescription: "3 增强点数 (2)",
            effect() {
                let eff = player.p.points.div(0.1).max(10).log(10).pow(0.6)
                if (hm("e", 8)) eff = expPow(eff.pow(2), 2)
                if (hu("e", 51)) eff = expPow(eff, 1.1)
                return eff
            },
            effectDescription() {
                return "声望点数加成声望力量<br>当前:*" + format(tmp.e.milestones[1].effect)
            },
            done() { return player.e.points.gte(3) },
        },
        2: {
            requirementDescription: "5 增强点数 (3)",
            effectDescription: "自动购买声望力量购买项 保留P7",
            done() { return player.e.points.gte(5) },
            toggles: [["e", "p1a1"]],
        },
        3: {
            requirementDescription: "10 增强点数 (4)",
            effectDescription: "自动购买声望层级升级",
            done() { return player.e.points.gte(10) },
            toggles: [["e", "atup"]],
        },
        4: {
            requirementDescription: "50 增强点数 (5)",
            effect: () => expPow(player.e.points.add(1).max(1).pow(0.5), 0.96),
            effectDescription() { return "增强点数加成声望力量<br>当前:*" + format(this.effect()) },
            done() { return player.e.points.gte(50) },
        },
        5: {
            requirementDescription: "10,000 增强点数 (6)",
            effectDescription: "解锁挑战",
            done() { return player.e.points.gte(10000) }
        },
        6: {
            requirementDescription: "1e10 增强点数 (7)",
            effectDescription: "解锁PM",
            done() { return player.e.points.gte(1e10) }
        },
        7: {
            requirementDescription: "5e55 增强点数 (8)",
            effectDescription: "削弱PM-B-1价格",
            done() { return player.e.points.gte(5e55) }
        },
        8: {
            requirementDescription: "1e86 增强点数 (9)",
            effectDescription: "里程碑2效果变得更好",
            done() { return player.e.points.gte(1e86) }
        },
        9: {
            requirementDescription: "1e131 增强点数 (10)",
            effectDescription: "PM基础指数+3",
            done() { return player.e.points.gte(1e131) }
        },
        10: {
            requirementDescription: "1e142 增强点数 (11)",
            effectDescription: "解锁PN",
            done() { return player.e.points.gte(1e142) }
        },
        11: {
            requirementDescription: "1e174 增强点数 (12)",
            effect: () => player.points.add(10).max(10).log(10).pow(1.5),
            effectDescription() { return "点数加成增强点数<br>当前:*" + format(this.effect()) },
            done() { return player.e.points.gte(1e174) }
        },

    },
    buyables: {
        11: {
            cost() {
                let x = player.e.buyables[11]
                let exp = tmp.e.buyables[11].coste
                let base = tmp.e.buyables[11].costbase
                return n(1e10).pow(x.pow(exp)).mul(base)
            },
            coste() {
                let exp = 1.5
                if (hm('e', 7)) exp -= 0.35
                if (hu("e", 41)) exp -= 0.09
                if (hu("c", 53)) exp -= 0.06
                return exp
            },
            costbase() {
                let base = 1e160
                return base
            },
            display() {
                return "PM基础获取+" + format(this.base()) + "/s<br>当前:+" + format(this.effect()) + "/s<br>数量:" + format(player.e.buyables[11]) + "<br>价格:" + format(this.cost()) + "点数"
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hm("a", 0)) player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PM-B-1" },
            base() {
                let base = n(1)
                if (hu("e", 45)) base = base.mul(1.25)
                if (hu("e", 52)) base = base.mul(1.6)
                base = base.mul(tmp.e.challenges[21].effect)
                return base
            },
            effect() {
                let base = tmp.e.buyables[11].base
                let x = player.e.buyables[11]
                return base.mul(x)
            },
            unlocked() { return hm('e', 6) },
            maxAfford() {
                let s = player.points
                let exp = tmp.e.buyables[11].coste
                let base = tmp.e.buyables[11].costbase
                let target = s.div(base).log(1e10).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[11].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[11] = player.e.buyables[11].max(target)
                }
            },
        },
        12: {
            cost() {
                let x = player.e.buyables[12]
                let exp = tmp.e.buyables[12].coste
                let base = tmp.e.buyables[12].costbase
                return n(10).pow(x.pow(exp)).mul(base)
            },
            coste() {
                let exp = 1.3
                return exp
            },
            costbase() {
                let base = 1e10
                return base
            },
            display() {
                return "PM*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.e.buyables[12]) + "<br>价格:" + format(this.cost()) + "增强点数"
            },
            canAfford() { return player.e.points.gte(this.cost()) },
            buy() {
                if (!hm("a", 0)) player.e.points = player.e.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PM-B-2" },
            base() {
                let base = player.e.pm.add(1).max(1).log(10).add(2)
                if (hu("e", 34)) base = base.pow(1.1)
                return base
            },
            effect() {
                let base = tmp.e.buyables[12].base
                let x = player.e.buyables[12]
                return Decimal.pow(base, x)
            },
            unlocked() { return hm('e', 6) },
            maxAfford() {
                let s = player.e.points
                let exp = tmp.e.buyables[12].coste
                let base = tmp.e.buyables[12].costbase
                let target = s.div(base).log(10).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[12].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[12] = player.e.buyables[12].max(target)
                }
            },
        },
        13: {
            cost() {
                let x = player.e.buyables[13]
                let exp = tmp.e.buyables[13].coste
                let base = tmp.e.buyables[13].costbase
                return n(10).pow(x.pow(exp)).mul(base)
            },
            coste() {
                let exp = 1.4
                if (hu("e", 55)) exp -= 0.01
                return exp
            },
            costbase() {
                let base = 1e6
                return base
            },
            display() {
                return "PM基础指数+" + format(this.base()) + "<br>当前:+" + format(this.effect()) + "<br>数量:" + format(player.e.buyables[13]) + "<br>价格:" + format(this.cost()) + "PM"
            },
            canAfford() { return player.e.pm.gte(this.cost()) },
            buy() {
                if (!hm("a", 0)) player.e.pm = player.e.pm.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PM-B-3" },
            base() {
                let base = n(0.5)
                return base
            },
            effect() {
                let base = tmp.e.buyables[13].base
                let x = player.e.buyables[13]
                return base.mul(x)
            },
            unlocked() { return hm('e', 6) },
            maxAfford() {
                let s = player.e.pm
                let exp = tmp.e.buyables[13].coste
                let base = tmp.e.buyables[13].costbase
                let target = s.div(base).log(10).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[13].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[13] = player.e.buyables[13].max(target)
                }
            },
        },
        21: {
            cost() {
                let x = player.e.buyables[21]
                let exp = tmp.e.buyables[21].coste
                let base = tmp.e.buyables[21].costbase
                return n(10).pow(x.pow(exp)).mul(base)
            },
            coste() {
                let exp = 1.44
                return exp
            },
            costbase() {
                let base = 1e9
                return base
            },
            display() {
                return "声望力量*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.e.buyables[21]) + "<br>价格:" + format(this.cost()) + "PM"
            },
            canAfford() { return player.e.pm.gte(this.cost()) },
            buy() {
                if (!hm("a", 0)) player.e.pm = player.e.pm.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PM-B-4" },
            base() {
                let base = player.p.pp.add(10).max(10).log(10)
                if (hu("e", 42)) base = base.pow(1.2)
                return base
            },
            effect() {
                let base = tmp.e.buyables[21].base
                let x = player.e.buyables[21]
                return Decimal.pow(base, x)
            },
            unlocked() { return hm('e', 6) },
            maxAfford() {
                let s = player.e.pm
                let exp = tmp.e.buyables[21].coste
                let base = tmp.e.buyables[21].costbase
                let target = s.div(base).log(10).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[21].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[21] = player.e.buyables[21].max(target)
                }
            },
        },
        22: {
            cost() {
                let x = player.e.buyables[22]
                let exp = tmp.e.buyables[22].coste
                let base = tmp.e.buyables[22].costbase
                if (x.gte(100)) x = x.div(100).pow(2).mul(100)
                return n(10).pow(x.pow(exp)).mul(base)
            },
            coste() {
                let exp = 1.55
                return exp
            },
            costbase() {
                let base = 1e10
                return base
            },
            display() {
                return "增强点数*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.e.buyables[22]) + "<br>价格:" + format(this.cost()) + "PM"
            },
            canAfford() { return player.e.pm.gte(this.cost()) },
            buy() {
                if (!hm("a", 0)) player.e.pm = player.e.pm.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PM-B-5" },
            base() {
                let base = player.e.pm.add(10).max(10).log(10).pow(0.5)
                if (hu("e", 34)) base = base.pow(1.1)
                return base
            },
            effect() {
                let base = tmp.e.buyables[22].base
                let x = player.e.buyables[22]
                return Decimal.pow(base, x)
            },
            unlocked() { return hm('e', 6) },
            maxAfford() {
                let s = player.e.pm
                let exp = tmp.e.buyables[22].coste
                let base = tmp.e.buyables[22].costbase
                let target = s.div(base).log(20).root(exp)
                if (target.gte(100)) target = target.div(100).root(2).mul(100)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[22].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[22] = player.e.buyables[22].max(target)
                }
            },
        },
        23: {
            cost() {
                let x = player.e.buyables[23]
                let exp = tmp.e.buyables[23].coste
                let base = tmp.e.buyables[23].costbase
                let cbase = tmp.e.buyables[23].cbase
                return n(cbase).pow(x.pow(exp)).mul(base)
            },
            coste() {
                let exp = 1.5
                if (hu("c", 11)) exp -= 0.1
                return exp
            },
            cbase() {
                let base = 100
                if (hu("c", 11)) base *= 0.1
                return base
            },
            costbase() {
                let base = 1e11
                return base
            },
            display() {
                return "声望点数*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.e.buyables[23]) + "<br>价格:" + format(this.cost()) + "PM"
            },
            canAfford() { return player.e.pm.gte(this.cost()) },
            buy() {
                if (!hm("a", 0)) player.e.pm = player.e.pm.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PM-B-6" },
            base() {
                let base = player.p.points.add(10).max(10).log(10).pow(2)
                if (hu("a", 33)) base = base.pow(5)
                return base
            },
            effect() {
                let base = tmp.e.buyables[23].base
                let x = player.e.buyables[23]
                return Decimal.pow(base, x)
            },
            unlocked() { return hm('e', 6) },
            maxAfford() {
                let s = player.e.pm
                let exp = tmp.e.buyables[23].coste
                let base = tmp.e.buyables[23].costbase
                let cbase = tmp.e.buyables[23].cbase
                let target = s.div(base).log(cbase).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[23].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[23] = player.e.buyables[23].max(target)
                }
            },
        },
        31: {
            cost() {
                let x = player.e.buyables[31]
                let exp = tmp.e.buyables[31].coste
                let base = tmp.e.buyables[31].costbase
                if (x.gte(5)) x = x.sub(4).mul(1.25).add(4)
                return n(10).pow(x.pow(exp)).mul(base)
            },
            coste() {
                let exp = 1.35
                return exp
            },
            costbase() {
                let base = 1e4
                return base
            },
            display() {
                return "PN*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.e.buyables[31]) + "<br>价格:" + format(this.cost()) + "PN"
            },
            canAfford() { return player.e.pn.gte(this.cost()) },
            buy() {
                if (!hm("a", 2)) player.e.pn = player.e.pn.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PN-B-1" },
            base() {
                let base = player.e.pn.add(10).max(10).log(10).add(1).softcap(10, 0.5)
                return base
            },
            effect() {
                let base = tmp.e.buyables[31].base
                let x = player.e.buyables[31]
                return Decimal.pow(base, x)
            },
            unlocked() { return hm('e', 7) },
            maxAfford() {
                let s = player.e.pn
                let exp = tmp.e.buyables[31].coste
                let base = tmp.e.buyables[31].costbase
                let target = s.div(base).log(10).root(exp)
                if (target.gte(5)) target = target.sub(4).div(1.25).add(4)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[31].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[31] = player.e.buyables[31].max(target)
                }
            },
        },
        32: {
            cost() {
                let x = player.e.buyables[32]
                let exp = tmp.e.buyables[32].coste
                let base = tmp.e.buyables[32].costbase
                return n(10).pow(x.pow(exp)).mul(base)
            },
            coste() {
                let exp = 1.4
                return exp
            },
            costbase() {
                let base = 1e14
                return base
            },
            display() {
                return "PN基础指数+" + format(this.base()) + "<br>当前:+" + format(this.effect()) + "<br>数量:" + format(player.e.buyables[32]) + "<br>价格:" + format(this.cost()) + "PN"
            },
            canAfford() { return player.e.pn.gte(this.cost()) },
            buy() {
                if (!hm("a", 2)) player.e.pn = player.e.pn.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PN-B-2" },
            base() {
                let base = player.e.pn.add(10).max(10).log(10).pow(0.1).mul(0.1)
                return base.add(0.1)
            },
            effect() {
                let base = tmp.e.buyables[32].base
                let x = player.e.buyables[32]
                return base.mul(x)
            },
            unlocked() { return hm('e', 7) },
            maxAfford() {
                let s = player.e.pn
                let exp = tmp.e.buyables[32].coste
                let base = tmp.e.buyables[32].costbase
                let target = s.div(base).log(100).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[32].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[32] = player.e.buyables[32].max(target)
                }
            },
        },
        33: {
            cost() {
                let x = player.e.buyables[33]
                let exp = tmp.e.buyables[33].coste
                let base = tmp.e.buyables[33].costbase
                return Decimal.pow(n(1.1), x.pow(exp)).mul(20).pow10().mul(base)
            },
            coste() {
                let exp = 1.2
                return exp
            },
            costbase() {
                let base = 1e7
                return base
            },
            display() {
                return "PN^(" + format(this.base()) + "<sup>x<sup>" + this.base2().toString() + "</sup></sup>+1)<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player.e.buyables[33]) + "<br>价格:" + format(this.cost()) + "PN"
            },
            canAfford() { return player.e.pn.gte(this.cost()) },
            buy() {
                if (!hm("a", 2)) player.e.pn = player.e.pn.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "PN-B-3" },
            base() {
                let base = n(1.025)
                if (hu("c", 35)) base = base.mul(player.e.pn.add(1e10).max(1e10).log(10).log(10).pow(0.4))
                return base
            },
            base2() {
                let base = 0.6
                return base
            },
            effect() {
                let base = tmp.e.buyables[33].base
                let base2 = tmp.e.buyables[33].base2
                let x = player.e.buyables[33]
                return Decimal.pow(base, x.pow(base2))
            },
            unlocked() { return hm('e', 7) },
            maxAfford() {
                let s = player.e.pn
                let exp = tmp.e.buyables[33].coste
                let base = tmp.e.buyables[33].costbase
                let target = s.div(base).log(10).div(20).log(1.1).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.e.buyables[33].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.e.buyables[33] = player.e.buyables[33].max(target)
                }
            },
        },
    },
    challenges: {
        11: {
            name: "声望削弱",
            challengeDescription: function () {
                let c11 = "声望点数^0.35"
                if (inChallenge("e", 11)) c11 = c11 + " (挑战中)"
                if (challengeCompletions("e", 11) == 5) c11 = c11 + " (完成)"
                c11 = c11 + "<br>完成次数:" + challengeCompletions("e", 11) + "/" + tmp.e.challenges[11].completionLimit
                return c11
            },
            goal() {
                let gc11 = [n(5e7), n(1e14), n(1e26), n(1e110), n(1e200), n("10^^1.7975e308")]
                return gc11[challengeCompletions("e", 11)]
            },
            canComplete: function () { return player.p.points.gte(this.goal()) },
            currencyDisplayName: "声望点数",
            rewardDescription: "声望点数加成增强点数",
            completionLimit: 5,
            effect() {
                let c11 = player.p.points.add(10).max(10).log(10).pow(challengeCompletions("e", 11) * 0.4)
                if (hu("c", 21)) c11 = expPow(c11, 1.25)
                if (hu("e", 43)) c11 = expPow(c11, 1.05)
                if (challengeCompletions("e", 11) < 1) return n(1)
                return c11
            },
            rewardDisplay() { return "*" + format(this.effect()) },
            unlocked() {
                return hm("e", 5)
            }
        },
        12: {
            name: "点数溶解",
            challengeDescription: function () {
                let c12 = "点数指数^0.5"
                if (inChallenge("e", 12)) c12 = c12 + " (挑战中)"
                if (challengeCompletions("e", 12) == 5) c12 = c12 + " (完成)"
                c12 = c12 + "<br>完成次数:" + challengeCompletions("e", 12) + "/" + tmp.e.challenges[12].completionLimit
                return c12
            },
            goal() {
                let gc12 = [n(1e50), n(1e125), n(1e210), n('1e725'), n('1e1090'), n("10^^1.7975e308")]
                return gc12[challengeCompletions("e", 12)]
            },
            canComplete: function () { return player.p.points.gte(this.goal()) },
            currencyDisplayName: "声望点数",
            rewardDescription: "加成声望力量效果",
            completionLimit: 5,
            effect() {
                let c12 = .04 * challengeCompletions("e", 12) + 1
                return c12
            },
            rewardDisplay() { return "^" + this.effect().toFixed(3).toString() },
            unlocked() {
                return player.e.challenges[11] >= 1
            }
        },
        21: {
            name: "极端折算",
            challengeDescription: function () {
                let c21 = "声望点数购买项受到一个极强的折算"
                if (inChallenge("e", 21)) c21 = c21 + " (挑战中)"
                if (challengeCompletions("e", 21) == 5) c21 = c21 + " (完成)"
                c21 = c21 + "<br>完成次数:" + challengeCompletions("e", 21) + "/" + tmp.e.challenges[21].completionLimit
                return c21
            },
            goal() {
                let gc21 = [n("1e320"), n("1e375"), n("1e680"), n("1e1100"), n("e1250"), n("10^^1.7975e308")]
                return gc21[challengeCompletions("e", 21)]
            },
            canComplete: function () { return player.points.gte(this.goal()) },
            currencyDisplayName: "点数",
            rewardDescription: "加成PM-B-1效果",
            completionLimit:5,
            effect() {
                if (challengeCompletions("e", 21) >= 5) return (2 ** (challengeCompletions("e", 21) -4) ) * 10
                if (challengeCompletions("e", 21) < 1) return 1
                let c21 = (challengeCompletions("e", 21) ** 2) * .4 + 1
                return c21
            },
            rewardDisplay() { return "*" + format(this.effect()) },
            unlocked() {
                return player.e.challenges[12] >= 5
            }
        },
        22: {
            name: "撕裂膨胀",
            challengeDescription: function () {
                let c22 = "强制进入之前的挑战"
                if (inChallenge("e", 22)) c22 = c22 + " (挑战中)"
                if (challengeCompletions("e", 22) == 5) c22 = c22 + " (完成)"
                c22 = c22 + "<br>完成次数:" + challengeCompletions("e", 22) + "/" + tmp.e.challenges[22].completionLimit
                return c22
            },
            countsAs: [11, 12, 21],
            goal() {
                let gc22 = [n(1e500),n('1.1981F7'),n('1.1981F6'),n('1.1981F7'),n('1.1981F8'),n('10^^1.7975e308')]
                return gc22[challengeCompletions('e', 22)]
            },
            canComplete: function () { return player.points.gte(this.goal()) },
            currencyDisplayName: "点数",
            rewardDescription: "在第五次完成时解锁反-点数<br>",
            completionLimit: 5,
            unlocked() {
                return player.e.challenges[21] >= 5
            }
        },
    },
    layerShown() { return (hm("p", 1) || player.e.total.gte(1) || ha("ach", 14)) },
}) 