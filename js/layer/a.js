"use strict";
// v0.2前瞻
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
            chalcount: [null, n(0), n(0), n(0), n(0)],
            pmat: false,
            pnat: false,
            dpat: false,
            siat: false,
            atcu: false,
            ateu: false,
            atcp: false,
        }
    },
    color: "#e34f9e",
    requires: n("1e485"),
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
        let eff = player.a.points.mul(3).add(1)
        if (hm('a', 1)) eff = eff.pow(2)
        return eff
    },
    effectDescription() {
        let dis = "增强点数*<h2 style='color: #e34f9e; text-shadow: 0 0 10px #e34f9e'>" + format(tmp.a.effect) + "</h2>"
        return dis
    },
    boostereff() {
        let amt = n(0)
        for(let id = 11 ; id <  15; id++) {
            amt = amt.add(player.a.buyables[id])
        } 
        let eff = Decimal.pow(10,amt.pow(1.25))
        return eff
    },
    exponent2() {
        let exp = 0.95
        return exp
    },
    exponent() {
        let exp = 0.075
        return exp
    },
    gainMult() {
        let mult = n(1)
        if (hu("a", 12)) mult = mult.mul(10)
        if (hu("a", 14)) mult = mult.mul(ue('a', 14))
        if (hu("p", 51)) mult = mult.mul(tmp.p.upgrades[51].effect)
        mult = mult.mul(tmp.a.buyables[14].effect)
        mult = mult.mul(tmp.c.buyables[21].effect)
        return mult
    },
    gainExp() {
        let exp = n(1)
        return exp
    },
    getResetGain() {
        if (player.e.points.lt("1e485")) return n(0)
        let gain = expPow(player.e.points.div("1e485").max(1), tmp.a.exponent2).pow(tmp.a.exponent).softcap(10, 1000, 1).softcap(100, 0.5).mul(tmp.a.gainMult).pow(tmp.a.gainExp)
        return gain.floor()
    },
    getNextAt() {
        let next = expRoot(tmp.a.getResetGain.add(1).root(tmp.a.gainExp).div(tmp.a.gainMult).anti_softcap(100, 0.5).anti_softcap(10, 1000, 1).root(tmp.a.exponent), tmp.a.exponent2).mul("e485").max("e485")
        return next
    },
    update(diff) {
    },
    hotkeys: [
        {
            key: "a", description: "A:重置以获取反-点数",
            unlocked() { return (player.e.challenges[22] >= 3 || player.a.total.gte(1) || ha("ach", 33)) },
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
        "Booster": {
            unlocked() { return hu("a", 15) },
            name: "推进器",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13], ["buyable", 14]]],
                ['blank', '50px'],
                ['display-text', () => '推进器也加成点数获取, 效果为*' + format(tmp.a.boostereff)],
            ],
        },
    },
    upgrades: {
        11: {
            title: "A1",
            description: "反-点数加成奇点",
            effect() { return player.a.points.max(1).pow(0.5) },
            effectDisplay() { return "*" + format(upgradeEffect('a', 11)) },
            cost: n(1000),
            unlocked() { return true },
        },
        12: {
            title: "A2",
            description: "反-点数削弱压缩点数价格",
            effect() { return player.a.points.max(1).pow(125).softcap('1e1000', 0.2) },
            effectDisplay() { return `/${format(upgradeEffect('a', 12))} ${this.effect().gte('1e1000')? "(受软上限限制)" : ''}` },
            cost: n(2500),
            unlocked() { return hu("a", 11) },
        },
        13: {
            title: "A3",
            description: "增强点数加成声望力量",
            effect() { return expPow(player.e.points.max(1), 0.6) },
            effectDisplay() { return "*" + format(upgradeEffect('a', 13)) },
            cost: n(500000),
            unlocked() { return hu("a", 12) },
        },
        14: {
            title: "A4",
            description: "基于反点数挑战完成次数加成反-点数",
            effect() { 
                let amt = n(0) 
                for (let i = 0; i < 5; i++) amt = amt.add(player.a.chalcount[i])
                return Decimal.pow(1.25, amt) 
            },
            effectDisplay() { return "*" + format(upgradeEffect('a', 14)) },
            cost: n(1000000),
            unlocked() { return hu("a", 13) },
        },
        15: {
            title: "A5",
            description: "解锁第1-2行层级更多升级和推进器",
            cost: n(5000000),
            unlocked() { return hu("a", 14) },
        },
        21: {
            title: "A6",
            description: "削弱'C-dli-3'基础价格",
            cost: n(1e11),
            unlocked() { return hu("a", 150) },
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 反-点数 (1)",
            effectDescription: "自动购买E-PM-1,2,3,4,5,6 保留增强点数里程碑1,2,3,4 压缩点数价格/1e100 奇点*10",
            done() { return player.a.points.gte(1) },
            toggles: [["a", "pmat"]],
        },
        1: {
            requirementDescription: "2 反-点数 (2)",
            effectDescription: "自动购买增强点数和压缩点数升级 保留E5 自动重置压缩点数 压缩点数不再重置所有东西 反-点数效果^2",
            done() { return player.a.points.gte(2) },
            toggles: [["a", "atcu"], ["a", "ateu"], ["a", "atcp"]],
        },
        2: {
            requirementDescription: "4 反-点数 (3)",
            effectDescription: "自动购买点数膨胀购买项和PN购买项 保留声望点数和增强点数里程碑 膨胀点数和PN*10",
            done() { return player.a.points.gte(4) },
            toggles: [["a", "dpat"], ["a", "pnat"]],
        },
        3: {
            requirementDescription: "8 反-点数 (4)",
            effectDescription: () => "保留增强点数挑战 基于点数更新点数膨胀内最佳点数 反-点数加成PN<br>当前: *" + format(tmp.a.milestones[3].effect),
            effect() {
                let eff = player.a.points.pow(0.8)
                return eff
            },
            done() { return player.a.points.gte(8) },
        },
        4: {
            requirementDescription: "100 反-点数 (5)",
            effectDescription: "被动获取100%的奇点 自动购买奇点购买项",
            done() { return player.a.points.gte(100) },
            toggles: [["a", "siat"]],
        },
        5: {
            requirementDescription: "1000 反-点数 (6)",
            effectDescription: "解锁挑战",
            done() { return player.a.points.gte(1000) },
        },
        6: {
            requirementDescription: "1e11 反-点数 (7)",
            effectDescription: "解锁第二个挑战 解锁更多点数膨胀购买项",
            done() { return player.a.points.gte(1e11) },
        },
    },
    buyables: {
        11: {
            cost() {
                let x = player[this.layer].buyables[this.id]
                let exp = tmp[this.layer].buyables[this.id].coste
                return n(100).pow(x.pow(exp)).mul(1e6)
            },
            coste() {
                let exp = 1.5
                return exp
            },
            display() {
                return "声望点数^(<span style = 'font-size:8px'>"+format(this.base())+ "log<sub>2</sub>(x)+1</span>)<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                if (player.a.points.lt(this.cost())) return
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "A-bst-1" },
            base() {
                let base = n(0.01)
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return x.add(1).log(2).mul(base).add(1)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.a.points
                let exp = tmp[this.layer].buyables[this.id].coste
                let target = s.div(1e6).log(100).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp[this.layer].buyables[this.id].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target)
                }
            },
        },
        12: {
            cost() {
                let x = player[this.layer].buyables[this.id]
                let exp = tmp[this.layer].buyables[this.id].coste
                return n(100).pow(x.pow(exp)).mul(1e7)
            },
            coste() {
                let exp = 1.5
                return exp
            },
            display() {
                return "增强点数^(<span style = 'font-size:8px'>"+format(this.base())+ "log<sub>2</sub>(x)+1</span>)<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                if (player.a.points.lt(this.cost())) return
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "A-bst-2" },
            base() {
                let base = n(0.01)
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return x.add(1).log(2).mul(base).add(1)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.a.points
                let exp = tmp[this.layer].buyables[this.id].coste
                let target = s.div(1e7).log(100).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp[this.layer].buyables[this.id].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target)
                }
            },
        },
        13: {
            cost() {
                let x = player[this.layer].buyables[this.id]
                let exp = tmp[this.layer].buyables[this.id].coste
                return n(100).pow(x.pow(exp)).mul(1e10)
            },
            coste() {
                let exp = 1.5
                return exp
            },
            display() {
                return "压缩点数*(<span style = 'font-size:8px'>"+format(this.base())+ "log<sub>2</sub>(x)+1</span>)<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                if (player.a.points.lt(this.cost())) return
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "A-bst-3" },
            base() {
                let base = n(0.01)
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return x.add(1).log(2).mul(base).add(1)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.a.points
                let exp = tmp[this.layer].buyables[this.id].coste
                let target = s.div(1e10).log(100).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp[this.layer].buyables[this.id].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target)
                }
            },
        },
        14: {
            cost() {
                let x = player[this.layer].buyables[this.id]
                let exp = tmp[this.layer].buyables[this.id].coste
                return n(10).pow(x.pow(exp)).mul(1e13)
            },
            coste() {
                let exp = 1.3
                return exp
            },
            display() {
                return "反-点数*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                if (player.a.points.lt(this.cost())) return
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "A-bst-4" },
            base() {
                let base = n(2)
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return Decimal.pow(base, x)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.a.points
                let exp = tmp[this.layer].buyables[this.id].coste
                let target = s.div(1e13).log(10).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp[this.layer].buyables[this.id].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target)
                }
            },
        },
    },
    clickables: {
    },
    challenges: {
        11: {
            name: "力量衰变",
            challengeDescription: function () {
                let c11 = "声望力量购买项效果锁定为1"
                if (inChallenge("a", 11)) c11 = c11 + " (挑战中)"
                c11 = c11 + "<br>完成次数:" + formatWhole(player.a.chalcount[1])
                if (inChallenge("a", 11)) c11 = c11 + " (+" + format(tmp.a.challenges[11].countcalc.sub(player.a.chalcount[1]).max(0), 0) + ") <br>下一次完成在 " + format(tmp.a.challenges[11].getNextAt) + " 点数"
                return c11
            },
            goal: function () { return this.getNextAt(player.a.chalcount[1]) },
            canComplete: function () { return player.points.gte(this.goal()) },
            currencyDisplayName: "点数",
            rewardDescription: "P1变得更好",
            completionLimit: 1e308,
            countcalc() {
                let x = player.points.div(1e280).max(1).log(1e28).max(0).root(1.25).softcap(15, 10, 1).add(1)
                if (player.points.lte(1e280)) return n(0)
                return x.floor()
            },
            getNextAt(a) {
                let amt = tmp.a.challenges[11].countcalc.max(player.a.chalcount[1])
                if (!inChallenge('a', 11)) amt = player.a.chalcount[1]
                if (a) amt = a.min(amt)
                amt = amt.anti_softcap(15, 10, 1)
                let next = Decimal.pow(1e28, amt.pow(1.25)).mul(1e280)
                return next
            },
            onComplete() {
                player.a.chalcount[1] = tmp.a.challenges[11].countcalc.floor().max(player.a.chalcount[1])
            },
            effect() {
                let c11 = player.a.chalcount[1].pow(0.8).mul(0.05).add(1)
                return player.a.chalcount[1].lt(1) ? n(1) : c11
            },
            rewardDisplay() { return "^" + format(this.effect()) },
            unlocked() {
                return hm("a", 5)
            },
            marked() { return false },
        },
        12: {
            name: "无效压缩",
            challengeDescription: function () {
                let c11 = "你不能获得压缩点数 点数^0.5"
                if (inChallenge("a", 12)) c11 = c11 + " (挑战中)"
                c11 = c11 + "<br>完成次数:" + format(player.a.chalcount[2], 0)
                if (inChallenge("a", 12)) c11 = c11 + " (+" + format(tmp.a.challenges[12].countcalc.sub(player.a.chalcount[2]).max(0), 0) + ") <br>下一次完成在 " + format(tmp.a.challenges[12].getNextAt) + " 点数"
                return c11
            },
            goal: function () { return this.getNextAt(player.a.chalcount[2]) },
            canComplete: function () { return player.points.gte(this.goal()) },
            currencyDisplayName: "点数",
            rewardDescription: "加成基础膨胀点数获取",
            completionLimit: 1e308,
            countcalc() {
                let x = player.points.div('1e770').max(1).log(1e77).max(0).root(1.25).add(1)
                if (player.points.lte('1e770')) return n(0)
                return x.floor()
            },
            getNextAt(a) {
                let amt = tmp.a.challenges[12].countcalc.max(player.a.chalcount[2])
                if (!inChallenge('a', 12)) amt = player.a.chalcount[2]
                if (a) amt = a.min(amt)
                let next = Decimal.pow(1e77, amt.pow(1.25)).mul('1e770')
                return next
            },
            onComplete() {
                player.a.chalcount[2] = tmp.a.challenges[12].countcalc.floor().max(player.a.chalcount[2])
            },
            effect() {
                let c11 = player.a.chalcount[2].pow(0.8).mul(0.2).add(1)
                return player.a.chalcount[2].lt(1) ? n(1) : c11
            },
            rewardDisplay() { return "^" + format(this.effect()) },
            unlocked() {
                return hm("a", 6)
            },
            marked() { return false },
        },
    },
    layerShown() { return (player.e.challenges[22] >= 3 || player.a.total.gte(1) || ha("ach", 33)) },
})