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
            chalcount: [null, n(0), n(0), n(0), n(0)],
            energy: n(0),
            dimensions: n(0), //实际上是维度+1
            dimensiontime: n(1),
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
        if (hm('a', 7)) mult += 0.01
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
        for (let id = 11; id < 15; id++) {
            amt = amt.add(player.a.buyables[id])
        }
        amt = amt
        let eff = Decimal.pow(10, amt.pow(1.25))
        eff = eff.pow(player.a.buyables[1001].anti_softcap(9, 2, 'mul').mul(0.25).add(1))
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
        if (hu("a", 22)) mult = mult.mul(ue('a', 22))
        if (hu("p", 51)) mult = mult.mul(tmp.p.upgrades[51].effect)
        mult = mult.mul(tmp.a.buyables[14].effect)
        mult = mult.mul(tmp.c.buyables[21].effect)
        mult = mult.mul(tmp.a.dimensions.energyeff)
        if (ha('ach', 41)) mult = mult.mul(2)

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
    dimensions: {
        energygain(){
            let gain = player.a.dimensiontime.pow(player.a.dimensions).mul(this.tickspeed())
            return gain
        },
        energyeff(){
            let eff = player.a.energy.add(1)
            return eff
        },
        tickspeed() {
            let tick = n(1)
            if (hu('a', 31)) tick = tick.mul(10)
            return tick
        },
        dimensionscal(){
            let dim = n(0)
            dim = dim.add(tmp.a.buyables[2001].effect)
            player.a.dimensions = dim
        },
        getdimensions(dimnum){
            dimnum = n(dimnum)
            dimnum = dimnum.sub(1)
            return player.a.dimensiontime.pow(player.a.dimensions.sub(dimnum))
        },
    },
    update(diff) {
        if(hu('a', 25)) {
            layers.a.dimensions.dimensionscal()
            player.a.energy = player.a.energy.add(tmp.a.dimensions.energygain.mul(diff))
            if (player.a.dimensions.gte(1)) player.a.dimensiontime = player.a.dimensiontime.add(tmp.a.dimensions.tickspeed.mul(diff))
        }
    },
    
    hotkeys: [
        {
            key: "a", description: "A:重置以获取反-点数",
            unlocked() { return (player.e.challenges[22] >= 3 || player.a.total.gte(1) || ha("ach", 35)) },
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
                ["row", [["buyable", 1011], ["buyable", 1012], ["buyable", 1013], ["buyable", 1014]]],
                ["row", [["clickable", 11]]],
                ['blank', '50px'],
                ['display-text', () => '推进器也加成点数获取, 效果为*' + format(tmp.a.boostereff)],
                ['blank', '100px'],
                ["row", [['buyable', 1001]]],
            ],
        },
        "Dimensions": {
            unlocked() { return hu("a", 25) },
            name: "维度",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                ['display-text', () => `你有 <h3 style='color: #e34f9e; text-shadow: 0 0 10px #e34f9e'>`+ format(player.a.energy) + "</h3> 能量  反-点数*"  + layerText('h3', 'a', format(tmp.a.dimensions.energyeff))  ],
                ['display-text', () => `你每秒获取`+ format(tmp.a.dimensions.energygain) + "能量"],
                ['display-text', () => `计数频率:`+ format(tmp.a.dimensions.tickspeed) + "/s"],
                ["blank", "10px"],
                ["display-text", () => '第1维度:'+format(layers.a.dimensions.getdimensions(1))],
                ["display-text", () => player.a.dimensions.gte(1)? '第2维度:'+format(layers.a.dimensions.getdimensions(2)) : ""],
                ["display-text", () => player.a.dimensions.gte(2)? '第3维度:'+format(layers.a.dimensions.getdimensions(3)): ""],
                ["display-text", () => player.a.dimensions.gt(2)?  '……':' '],
                ["display-text", () => player.a.dimensions.gt(2)?'第'+format(player.a.dimensions.add(1))+'维度:1':' '],
                ["row", [['buyable', 2001]]],
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
            description: "反-点数削弱压缩点数价格 反-点数*10",
            effect() { return player.a.points.max(1).pow(125).softcap('1e1000', 0.2).min('e10000') },
            effectDisplay() { return `/${format(upgradeEffect('a', 12))} ${this.effect().gte('1e1000') ? "(受软上限限制)" : ''}` },
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
            description: "获取一个免费的'P-PP-3'<br>增强点数获取公式变得更好",
            cost: n(2.5e23),
            unlocked() { return hu("a", 15) },
        },
        22: {
            title: "A7",
            description: "压缩点数加成反-点数",
            effect() { return Decimal.pow(1.1, player.c.points.pow(0.75)) },
            effectDisplay() { return "*" + format(upgradeEffect('a', 22)) },
            cost: n(1e33),
            unlocked() { return hu("a", 21) },
        },
        23: {
            title: "A8",
            description: "解锁增幅器充能",
            cost: n(1e40),
            unlocked() { return hu("a", 22) },
        },
        24: {
            title: "A9",
            description: "增强点数挑战上限+1",
            cost: n(1e52),
            unlocked() { return hu("a", 23) },
        },
        25: {
            title: "A10",
            description: "解锁维度和更多购买项",
            cost: n(1e80),
            unlocked() { return hu("a", 24) },
        },
        31: {
            title: "A11",
            description: "计数频率*10",
            cost: n(1e145),
            unlocked() { return hu("a", 25) },
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 反-点数 (1)",
            effectDescription: "自动购买E-PM-1,2,3,4,5,6 保留增强点数里程碑1,2,3,4 压缩点数价格/1e100 奇点*10",
            done() { return player.a.points.gte(1) },
            toggles: [["e", "pmat"]],
        },
        1: {
            requirementDescription: "2 反-点数 (2)",
            effectDescription: "自动购买增强点数和压缩点数升级 保留E5 自动重置压缩点数 压缩点数不再重置所有东西 反-点数效果^2",
            done() { return player.a.points.gte(2) },
            toggles: [["e", "ateu"], ["c", "atcu"], ["c", "atcp"]],
        },
        2: {
            requirementDescription: "4 反-点数 (3)",
            effectDescription: "自动购买PN购买项和点数膨胀购买项 保留声望点数和增强点数里程碑 膨胀点数和PN*10",
            done() { return player.a.points.gte(4) },
            toggles: [["e", "pnat"], ["c", "dpat"]],
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
            toggles: [["c", "siat"]],
        },
        5: {
            requirementDescription: "1000 反-点数 (6)",
            effectDescription: "解锁挑战",
            done() { return player.a.points.gte(1000) },
        },
        6: {
            requirementDescription: "1e9 反-点数 (7)",
            effectDescription: "解锁第二个挑战 解锁更多点数膨胀购买项",
            done() { return player.a.points.gte(1e9) },
        },
        7: {
            requirementDescription: "1e29 反-点数 (8)",
            effectDescription: "每秒获取1%的反-点数 压缩点数价格^0.9",
            done() { return player.a.points.gte(1e29) },
        },
        8: {
            requirementDescription: "1e56 反-点数 (9)",
            effectDescription: () => "基于反-点数里程碑加成点数<br>当前: ^" + format(tmp.a.milestones[8].effect),
            effect() {
                let eff = n((player.a.milestones.length / 250) + 1)
                return eff
            },
            done() { return player.a.points.gte(1e56) },
        },
        9: {
            requirementDescription: "2.5e69 反-点数 (10)",
            effectDescription: () => "解锁第三个挑战 增强点数基础公式变得更好",
            done() { return player.a.points.gte(2.5e69) },
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
                return "声望点数^(<span style = 'font-size:8px'>" + format(this.base()) + "log<sub>2</sub>(x)+1</span>)<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
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
                base = base.mul(player.a.buyables[1011].mul(0.25).add(1))
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return x.add(1).log(2).mul(base).add(1)
            },
            unlocked() { return hu('a', 15) },
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
            style: {
                "background"() {
                    let color = '#bf8f8f'
                    if (player.a.points.gte(layers.a.buyables[11].cost())) color = '#A9A9A9'
                    return color
                }
            }
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
                return "增强点数^(<span style = 'font-size:8px'>" + format(this.base()) + "log<sub>2</sub>(x)+1</span>)<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
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
                base = base.mul(player.a.buyables[1012].mul(0.25).add(1))
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return x.add(1).log(2).mul(base).add(1)
            },
            unlocked() { return hu('a', 15) },
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
            style: {
                "background"() {
                    let color = '#bf8f8f'
                    if (player.a.points.gte(layers.a.buyables[12].cost())) color = '#1c56b4'
                    return color
                }
            }
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
                return "压缩点数*(<span style = 'font-size:8px'>" + format(this.base()) + "log<sub>2</sub>(x)+1</span>)<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
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
                base = base.mul(player.a.buyables[1013].mul(0.25).add(1))
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return x.add(1).log(2).mul(base).add(1)
            },
            unlocked() { return hu('a', 15) },
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
            style: {
                "background"() {
                    let color = '#bf8f8f'
                    if (player.a.points.gte(layers.a.buyables[13].cost())) color = '#EEEEEE'
                    return color
                }
            }
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
                base = base.pow(player.a.buyables[1014].mul(0.25).add(1))
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return Decimal.pow(base, x)
            },
            unlocked() { return hu('a', 15) },
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
        1001: {
            cost() {
                let x = player[this.layer].buyables[this.id]
                let cost = [n(1e40), n(2.5e42), n(5e48), n(1e55), n(5e58), n(2.5e77), n(1e90), n(2.5e107), n(1e133)]
                if (x.gte(cost.length)) return n('infinity')
                return cost[x]
            },
            display() {
                return "充能+1<br>当前:" + formatWhole(player[this.layer].buyables[this.id]) + " / 16<br>价格:" + format(this.cost()) + "反-点数"
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                if (player.a.points.lt(this.cost())) return
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "A-bst-C" },
            unlocked() { return hu('a', 23) },

        },
        1011: {
            cost() {
                let x = 1
                for (let i = 1011; i < 1015; i++) x += Number(player.a.buyables[i])
                return x
            },
            display() {
                return `<h2>充能A-bst-1</span></h2><br>效果:基础*` + format(this.effect()) + "<br>需要:" + this.cost().toString() + "充能<br>数量:" + formatWhole(player[this.layer].buyables[this.id]) + " / " + this.purchaseLimit().toString()
            },
            canAfford() { return player.a.buyables[1001].gte(this.cost()) },
            buy() {
                if (player.a.buyables[1001].lt(this.cost())) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.mul(0.25).add(1)
            },
            unlocked() { return hu('a', 23) },
            style: {
                "height": "60px",
                "background"() {
                    let color = '#bf8f8f'
                    if (player.a.buyables[1001].gte(layers.a.buyables[1011].cost()) && player.a.buyables[1011].lt(layers.a.buyables[1011].purchaseLimit())) color = '#A9A9A9'
                    return color
                }
            },
            purchaseLimit() {
                return Math.min(Math.floor(player.a.buyables[1001].sub(1).toNumber() / 4) + 1, 4)
            },
        },
        1012: {
            cost() {
                let x = 1
                for (let i = 1011; i < 1015; i++) x += Number(player.a.buyables[i])
                return x
            },
            display() {
                return `<h2>充能A-bst-2</span></h2><br>效果:基础*` + format(this.effect()) + "<br>需要:" + this.cost().toString() + "充能<br>数量:" + formatWhole(player[this.layer].buyables[this.id]) + " / " + this.purchaseLimit().toString()
            },
            canAfford() { return player.a.buyables[1001].gte(this.cost()) },
            buy() {
                if (player.a.buyables[1001].lt(this.cost())) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.mul(0.25).add(1)
            },
            unlocked() { return hu('a', 23) },
            style: {
                "height": "60px",
                "background"() {
                    let color = '#bf8f8f'
                    if (player.a.buyables[1001].gte(layers.a.buyables[1012].cost()) && player.a.buyables[1012].lt(layers.a.buyables[1012].purchaseLimit())) color = '#1c56b4'
                    return color
                }
            },
            purchaseLimit() {
                return Math.min(Math.floor(player.a.buyables[1001].sub(1).toNumber() / 4) + 1, 4)
            },
        },
        1013: {
            cost() {
                let x = 1
                for (let i = 1011; i < 1015; i++) x += Number(player.a.buyables[i])
                return x
            },
            display() {
                return `<h2>充能A-bst-3</span></h2><br>效果:基础*` + format(this.effect()) + "<br>需要:" + this.cost().toString() + "充能<br>数量:" + formatWhole(player[this.layer].buyables[this.id]) + " / " + this.purchaseLimit().toString()
            },
            canAfford() { return player.a.buyables[1001].gte(this.cost()) },
            buy() {
                if (player.a.buyables[1001].lt(this.cost())) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.mul(0.25).add(1)
            },
            unlocked() { return hu('a', 23) },
            style: {
                "height": "60px",
                "background"() {
                    let color = '#bf8f8f'
                    if (player.a.buyables[1001].gte(layers.a.buyables[1013].cost()) && player.a.buyables[1013].lt(layers.a.buyables[1013].purchaseLimit())) color = '#EEEEEE'
                    return color
                }
            },
            purchaseLimit() {
                return Math.min(Math.floor(player.a.buyables[1001].sub(1).toNumber() / 4) + 1, 4)
            },
        },
        1014: {
            cost() {
                let x = 1
                for (let i = 1011; i < 1015; i++) x += Number(player.a.buyables[i])
                return x
            },
            display() {
                return `<h2>充能A-bst-4</span></h2><br>效果:^` + format(this.effect()) + "<br>需要:" + this.cost().toString() + "充能<br>数量:" + formatWhole(player[this.layer].buyables[this.id]) + " / " + this.purchaseLimit().toString()
            },
            canAfford() { return player.a.buyables[1001].gte(this.cost()) },
            buy() {
                if (player.a.buyables[1001].lt(this.cost())) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.mul(0.25).add(1)
            },
            unlocked() { return hu('a', 23) },
            style: {
                "height": "60px",
                "background"() {
                    let color = '#bf8f8f'
                    if (player.a.buyables[1001].gte(layers.a.buyables[1014].cost()) && player.a.buyables[1014].lt(layers.a.buyables[1014].purchaseLimit())) color = '#e34f9e'
                    return color
                }
            },
            purchaseLimit() {
                return Math.min(Math.floor(player.a.buyables[1001].sub(1).toNumber() / 4) + 1, 4)
            },
        },
        2001: {
            cost() {
                let x = player[this.layer].buyables[this.id]
                let exp = tmp[this.layer].buyables[this.id].coste
                return n(10000).pow(x.pow(exp)).mul(1e80)
            },
            coste() {
                let exp = 1.5
                return exp
            },
            display() {
                return "维度+" + format(this.base()) + "<br>当前:+" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                if (player.a.points.lt(this.cost())) return
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "A-dim-1" },
            base() {
                let base = n(1)
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return x.mul(base)
            },
            unlocked() { return hu('a', 25) },
            maxAfford() {
                let s = player.a.points
                let exp = tmp[this.layer].buyables[this.id].coste
                let target = s.div(1e80).log(10000).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp[this.layer].buyables[this.id].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target)
                }
            },
        },
        /*
        2002: {
            cost() {
                let x = player[this.layer].buyables[this.id]
                let exp = tmp[this.layer].buyables[this.id].coste
                return n(10000).pow(x.pow(exp)).mul(1e80)
            },
            coste() {
                let exp = 1.5
                return exp
            },
            display() {
                return "维度+" + format(this.base()) + "<br>当前:+" + format(this.effect()) + "<br>数量:" + format(player[this.layer].buyables[this.id]) + "<br>价格:" + format(this.cost()) + "反-点数"
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                if (player.a.points.lt(this.cost())) return
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "A-dim-1" },
            base() {
                let base = n(1)
                return base
            },
            effect() {
                let base = tmp[this.layer].buyables[this.id].base
                let x = player[this.layer].buyables[this.id]
                return x.mul(base)
            },
            unlocked() { return hu('a', 25) },
            maxAfford() {
                let s = player.a.points
                let exp = tmp[this.layer].buyables[this.id].coste
                let target = s.div(1e80).log(10000).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp[this.layer].buyables[this.id].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target)
                }
            },
        },
        */
    },
    clickables: {
        11: {
            display() {
                let dis = "<h2>重置充能</h2><br>这将进行反-点数重置"
                return dis
            },
            unlocked() {
                return hu("a", 23)
            },
            canClick() { return true },
            onClick() {
                for (let i = 1011; i < 1015; i++) player.a.buyables[i] = n(0)
                doReset("a", true)
            },
            style: {
                "height": "60px", 'width': '600px', "background"() {
                    let color = '#e34f9e'
                    return color
                }
            }
        },
    },
    challenges: {
        11: {
            name: "力量锁定",
            challengeDescription: function () {
                let c11 = "声望力量购买项效果锁定为1"
                if (inChallenge("a", 11)) c11 = c11 + " (挑战中)"
                c11 = c11 + "<br>完成次数:" + formatWhole(player.a.chalcount[1])
                if (inChallenge("a", 11)) c11 = c11 + " (+" + formatWhole(tmp.a.challenges[11].countcalc.sub(player.a.chalcount[1]).max(0)) + ") <br>下一次完成在 " + format(tmp.a.challenges[11].getNextAt) + " 点数"
                return c11
            },
            goal: function () { return this.getNextAt(player.a.chalcount[1]) },
            canComplete: function () { return player.points.gte(this.goal()) },
            currencyDisplayName: "点数",
            rewardDescription: "P1变得更好",
            completionLimit: 1e308,
            countcalc() {
                let x = player.points.div(1e280).max(1).log(1e28).max(0).root(1.25).softcap(15, 10, 1).softcap(1000, 10, 3).add(1)
                if (player.points.lte(1e280)) return n(0)
                return x.floor()
            },
            getNextAt(a) {
                let amt = tmp.a.challenges[11].countcalc.max(player.a.chalcount[1])
                if (!inChallenge('a', 11)) amt = player.a.chalcount[1]
                if (a) amt = a.min(amt)
                amt = amt.anti_softcap(1000, 10, 3).anti_softcap(15, 10, 1)
                let next = Decimal.pow(1e28, amt.pow(1.25)).mul(1e280)
                return next
            },
            onComplete() {
                player.a.chalcount[1] = tmp.a.challenges[11].countcalc.floor().max(player.a.chalcount[1])
            },
            effect() {
                let c11 = player.a.chalcount[1].pow(0.8).mul(0.05).add(1).softcap(3, 0.5)
                return player.a.chalcount[1].lt(1) ? n(1) : c11
            },
            rewardDisplay() { return "^" + format(tmp.a.challenges[this.id].effect) + (tmp.a.challenges[this.id].effect.gte(3) ? " (软上限)" : "") },
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
                c11 = c11 + "<br>完成次数:" + formatWhole(player.a.chalcount[2], 0)
                if (inChallenge("a", 12)) c11 = c11 + " (+" + formatWhole(tmp.a.challenges[12].countcalc.sub(player.a.chalcount[2]).max(0), 0) + ") <br>下一次完成在 " + format(tmp.a.challenges[12].getNextAt) + " 点数"
                return c11
            },
            goal: function () { return this.getNextAt(player.a.chalcount[2]) },
            canComplete: function () { return player.points.gte(this.goal()) },
            currencyDisplayName: "点数",
            rewardDescription: "加成基础膨胀点数获取",
            completionLimit: 1e308,
            countcalc() {
                let x = player.points.div('1e770').max(1).log(1e77).max(0).root(1.25).softcap(15, 5, 1).softcap(1000, 10, 3).add(1)
                if (player.points.lte('1e770')) return n(0)
                return x.floor()
            },
            getNextAt(a) {
                let amt = tmp.a.challenges[12].countcalc.max(player.a.chalcount[2])
                if (!inChallenge('a', 12)) amt = player.a.chalcount[2]
                if (a) amt = a.min(amt)
                amt = amt.anti_softcap(1000, 10, 3).anti_softcap(15, 5, 1)
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
            rewardDisplay() { return "^" + format(tmp.a.challenges[this.id].effect)},
            unlocked() {
                return hm("a", 6)
            },
            marked() { return false },
        },
        21: {
            name: "绝对点数",
            challengeDescription: function () {
                let c11 = "点数指数塔-0.025"
                if (inChallenge("a", this.id)) c11 = c11 + " (挑战中)"
                c11 = c11 + "<br>完成次数:" + formatWhole(player.a.chalcount[3], 0)
                if (inChallenge("a", this.id)) c11 = c11 + " (+" + formatWhole(tmp.a.challenges[this.id].countcalc.sub(player.a.chalcount[3]).max(0), 0) + ") <br>下一次完成在 " + format(tmp.a.challenges[this.id].getNextAt) + " 点数"
                return c11
            },
            goal: function () { return this.getNextAt(player.a.chalcount[3]) },
            canComplete: function () { return player.points.gte(this.goal()) },
            currencyDisplayName: "点数",
            rewardDescription: "加成点数获取",
            completionLimit: 1e308,
            countcalc() {
                let x = player.points.div('e10000').max(1).log("1e1000").max(0).root(1.25).softcap(1000, 10, 3).add(1)
                if (player.points.lte('1e10000')) return n(0)
                return x.floor()
            },
            getNextAt(a) {
                let amt = tmp.a.challenges[this.id].countcalc.max(player.a.chalcount[3])
                if (!inChallenge('a', 21)) amt = player.a.chalcount[3]
                if (a) amt = a.min(amt)
                amt = amt.anti_softcap(1000, 10, 3)
                let next = Decimal.pow("1e1000", amt.pow(1.25)).mul('1e10000')
                return next
            },
            onComplete() {
                player.a.chalcount[3] = tmp.a.challenges[this.id].countcalc.floor().max(player.a.chalcount[3])
            },
            effect() {
                let c11 = player.a.chalcount[3].pow(0.5).mul(0.01).add(1).softcap(1.25, 0.5)
                return player.a.chalcount[3].lt(1) ? n(1) : c11
            },
            rewardDisplay() { return "^" + format(tmp.a.challenges[this.id].effect) + (tmp.a.challenges[this.id].effect.gte(1.25) ? " (软上限)" : "") },
            unlocked() {
                return hm("a", 9)
            },
            marked() { return false },
        },
    },
    layerShown() { return (player.e.challenges[22] >= 3 || player.a.total.gte(1) || ha("ach", 35)) },
})