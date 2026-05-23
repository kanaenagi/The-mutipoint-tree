"use strict";
function getpointdileff() {
    let eff = 0.75
    return eff
}

addLayer("c", {  //喜欢不内置vue的小朋友们叉出去
    name: "cpoint",
    symbol: "C",
    position: 2,
    startData() {
        return {
            unlocked: true,
            points: n(0),
            total: n(0),
            best: n(0),
            dbpoint: n(0),
            dp: n(0),
            ds: n(0),
            sing: n(0),
            dliationcount: 0,
        }
    },
    requires: n("e600"),
    color: "#EEEEEE",
    resource: "压缩点数",
    baseResource: "点数",
    doReset(resettingLayer) {
        let keep = ["dliationcount"]
        if (hm("a", 4)) keep.push("dbpoint")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    autoUpgrade() { return player.a.atcu },
    autoPrestige() { return player.a.atcp },
    resetsNothing() { return hm("a", 1) },
    baseAmount() { return player.points },
    row: 2,
    type: "static",
    base: 1e100,
    exponent() {
        let exp = 1.39
        return exp
    },
    canBuyMax: true,
    branches: ["p"],
    effect() {
        let eff = [n(1), n(1)]
        let base = n(10000)
        if (hu('c', 33)) base = base.pow(2)
        eff[0] = Decimal.pow(base, player.c.points)
        eff[1] = Decimal.pow(10, player.c.points)
        return eff
    },
    effectDescription() {
        let dis = "点数和声望力量*<h2 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>" + format(tmp.c.effect[0]) + "</h2> 增强点数*<h2 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>" + format(tmp.c.effect[1]) + "</h2>"
        return dis
    },
    gainMult() {
        let mult = n(1)
        if (hu("a", 12)) mult = mult.div(tmp.a.upgrades[12].effect)
        return mult
    },
    gainExp() {
        let exp = n(1)
        exp = exp.mul(tmp.c.buyables[103].effect.pow(-1))
        return exp
    },
    directMult() {
        let mul = n(1)
        return mul
    },
    dpointgain() {
        if (player.c.dbpoint.lt(1e48)) return n(0)
        let gain = expPow(player.c.dbpoint.div(1e47).max(1).log(10).pow(3), 1.4)
        if (hu("p", 43)) gain = gain.mul(ue('p', 43))
        gain = gain.mul(tmp.c.buyables[11].effect)
        if (hu("c", 44)) gain = gain.mul(10)
        if (hu("c", 51)) gain = gain.mul(tmp.c.upgrades[51].effect)
        if (hu("e", 55)) gain = gain.mul(1000)
        if (hm("a", 2)) gain = gain.mul(10)
        gain = gain.mul(tmp.c.dseff)
        gain = gain.mul(tmp.c.sing.eff)
        return gain
    },
    dpeff() {
        let eff = player.c.dp.add(10).max(10).log(10).pow(0.0115).max(1)
        if (hu("c", 22)) eff = eff.pow(2)
        return eff
    },
    dsgain() {
        let gain = player.c.dbpoint.div("1e104").max(1).log(1e20).pow(0.8).softcap(n(100), 1.01, 3)
        return gain.sub(player.c.ds).floor()
    },
    dsnext() {
        let amt = player.c.ds.add(tmp.c.dsgain.max(0).add(1)).anti_softcap(n(100), 1.01, 3)
        let next = Decimal.pow(1e20, amt.root(0.8)).mul("1e104")
        return next
    },
    dseff() {
        let eff = Decimal.pow(100, player.c.ds)
        return eff
    },
    sing: {
        gain() { 
            if (player.points.lt('e3250')) return n(0)
            let gain = expPow(player.points.div('1e3250'), 0.75).pow(0.05).softcap(1e14, 0.5)
            let mul = this.mult()
            return gain.mul(mul).floor()
        },
        mult() {
            let mul = n(1)
            if (hu("c", 32)) mul = mul.mul(tmp.c.upgrades[32].effect)
            if (hu("c", 34)) mul = mul.mul(tmp.c.upgrades[34].effect)
            /*
            mul = mul.mul(expPow(player.p.points.div('1e6800'), 0.75).pow(0.01))
            mul = mul.mul(expPow(player.e.points.div(1e230), 0.75).pow(0.1))
            mul = mul.mul(Decimal.pow(4, player.c.points.sub(11).max(0)))
            */
            return mul
        },
        next() {
            let amt = this.gain()
            let mul = this.mult()
            return expRoot(amt.add(1).div(mul).anti_softcap(1e14, 0.5).root(0.05), 0.75).mul('e3250').max('e3250')
        },
        eff() {
            let eff = player.c.sing.add(1).pow(2)
            return eff
        }
    },
    hotkeys: [
        {
            key: "c", description: "C:重置以获取压缩点数",
            unlocked() { return (hu("e", 25) || player.c.total.gte(1) || ha("ach", 21)) },
            onPress() { if (canReset(this.layer)) doReset(this.layer) }
        },
    ],
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
        "Point Dliation": {
            unlocked() { return hu("c", 15) },
            name: "点数膨胀",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                ["display-text", function () { let a = " (开始于1e48)"; return "点数膨胀的最佳点数为 <h3 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>" + format(player.c.dbpoint) + "</h3> <br><br>你有 <h3 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>" + format(player.c.dp) + "</h3> 膨胀点数 点数^<h3 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>" + format(tmp.c.dpeff) + "</h3><br>你每秒获取" + format(tmp.c.dpointgain) + "膨胀点数" + a }],
                ["display-text", function () { if (hu("c", 24)) return "你有 <h3 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>" + format(player.c.ds) + "</h3> 膨胀碎片 膨胀点数*<h3 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>" + format(tmp.c.dseff) + "</h3> <br>(下一个在 " + format(tmp.c.dsnext) + " 点数膨胀内点数) " }],
                ["clickables", [1]],
                ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
                ["row", [["buyable", 21], ["buyable", 22], ["buyable", 23]]],
            ],
        },
        "Singularity": {
            unlocked() { return hu('c', 25) },
            name: "奇点",
            content: ["main-display",
                "prestige-button",
                'resource-display',
                ["blank", "25px"],
                ['display-text', () => "你有 <h3 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>" + format(player.c.sing) + "</h3> 奇点 膨胀点数*<h3 style='color: #EEEEEE; text-shadow: 0 0 10px #EEEEEE'>"+ format(tmp.c.sing.eff) + "</h3>"],
                ["clickables", [2]],
                ["row", [["buyable", 101], ["buyable", 102], ["buyable", 103]]],
            ],
        },
    },
    update(diff) {
        if (player.points.gte(player.c.dbpoint) && getClickableState("c", 11) == 1) player.c.dbpoint = player.points
        if (hu("a", 13)) player.c.dbpoint = expPow(player.points, getpointdileff()).pow(1.25).max(player.c.dbpoint)
        if (hu("c", 15)) player.c.dp = player.c.dp.add(tmp.c.dpointgain.mul(diff))
        if (hu("c", 24)) player.c.ds = player.c.ds.add(tmp.c.dsgain).max(player.c.ds)
        if (player.a.dpat) { layers.c.buyables[11].buyMax(); layers.c.buyables[12].buyMax(); layers.c.buyables[13].buyMax(); layers.c.buyables[21].buyMax(); layers.c.buyables[22].buyMax(); layers.c.buyables[23].buyMax() }
    },
    upgrades: {
        11: {
            title: "C1",
            description: "削弱E-PM-6价格",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("e810"),
            unlocked() { return true },
        },
        12: {
            title: "C2",
            description: "E7效果变得更好, P3指数^1.1",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("e862"),
            unlocked() { return hu("c", 11) },
        },
        13: {
            title: "C3",
            description: "压缩点数加成PM",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            effect() {
                let base = player.c.points.anti_softcap(3, 2, 1).anti_softcap(10, 2, 1)
                let eff = Decimal.pow(4, base)
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('c', 13)) },
            cost: n("e990"),
            unlocked() { return hu("c", 12) },
        },
        14: {
            title: "C4",
            description: "基于压缩点数加成PM效果",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            effect() {
                let eff = player.c.points.add(1).mul(10).log(10).pow(0.5)
                return eff
            },
            effectDisplay() { return "^" + format(upgradeEffect('c', 14)) },
            cost: n("1e1005"),
            unlocked() { return hu("c", 13) },
        },
        15: {
            title: "C5",
            description: "解锁点数膨胀 压缩点数效果也加成声望点数",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e1111"),
            effect() {
                let eff = Decimal.pow(1e8, player.c.points)
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('c', 15)) },
            unlocked() { return hu("c", 14) },
        },
        21: {
            title: "C6",
            description: "对数领域奖励指数^1.25",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e1931"),
            unlocked() { return hu("c", 15) },
        },
        22: {
            title: "C7",
            description: "膨胀点数效果变得更好",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e2440"),
            unlocked() { return hu("c", 21) },
        },
        23: {
            title: "C8",
            description: "膨胀点数加成PN",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e2670"),
            effect() {
                let base = player.c.points.anti_softcap(8, 2, 1)
                let eff = Decimal.pow(2, base)
                return eff
            },
            effectDisplay() { return "*" + format(upgradeEffect('c', 23)) },
            unlocked() { return hu("c", 22) },
        },
        24: {
            title: "C9",
            description: "在点数膨胀中解锁膨胀碎片, 获取一个免费的声望力量购买项'P-PP-3'",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("e2810"),
            unlocked() { return hu("c", 23) },
        },
        25: {
            title: "C10",
            description: "解锁奇点(还没做)",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e3250"),
            unlocked() { return hu("c", 24) },
        },
        31: {
            title: "C11",
            description: "基于点数膨胀内的最佳点数加成增强点数 (开始于1e137), C-Dli-2效果^2",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            effect() { return expPow(player.c.dbpoint.div(1e136).max(10).log(10).pow(2), 1.75) },
            effectDisplay() { return "*" + format(upgradeEffect('c', 31)) },
            cost: n("1e3435"),
            unlocked() { return hu("c", 25) },
        },
        32: {
            title: "C12",
            description: "压缩点数加成奇点",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            effect() { return Decimal.pow(2, player.c.points.sub(12).max(0)) },
            effectDisplay() { return "*" + format(upgradeEffect('c', 32)) },
            cost: n("1e4300"),
            unlocked() { return hu("c", 31) },
        },
        33: {
            title: "C13",
            description: "压缩点数第一效果^2",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e5330"),
            unlocked() { return hu("c", 32) },
        },
        34: {
            title: "C14",
            description: "增强点数加成奇点",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            effect() { return expPow(player.e.points, 0.5).pow(0.1) },
            effectDisplay() { return "*" + format(upgradeEffect('c', 34)) },
            cost: n("1e5800"),
            unlocked() { return hu("c", 33) },
        },
        35: {
            title: "C15",
            description: "E-PN-3效果变得更好 PN*100",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e6100"),
            unlocked() { return hu("c", 34) },
        },
        41: {
            title: "C16",
            description: "",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e1569"),
            unlocked() { return hu("c", 350) },
        },
        42: {
            title: "C17",
            description: "解锁新的增强点数挑战",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("e1652"),
            unlocked() { return hu("c", 41) },
        },
        43: {
            title: "C18",
            description: "削弱E-PM-6价格",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("e1694"),
            unlocked() { return hu("c", 42) },
        },
        44: {
            title: "C19",
            description: "膨胀点数*10 如果你在点数膨胀中 点数^1.075",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("e1735"),
            unlocked() { return hu("c", 43) },
        },
        45: {
            title: "C20",
            description: "解锁新的增强点数挑战",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("e1808"),
            unlocked() { return hu("c", 44) },
        },
        51: {
            title: "C21",
            description: "每个第五行压缩点数升级加成膨胀点数",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            effect() { return 100 ** player.c.upgrades.filter(n => (n < 60 && n > 50)).length },
            effectDisplay() { return "*" + format(upgradeEffect('c', 51)) },
            cost: n("e1830"),
            unlocked() { return hu("c", 45) },
        },
        52: {
            title: "C22",
            description: "点数*1e10",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e1895"),
            unlocked() { return hu("c", 51) },
        },
        53: {
            title: "C23",
            description: "削弱E-PM-1价格",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e2088"),
            unlocked() { return hu("c", 52) },
        },
        54: {
            title: "C24",
            description: "声望点数加成'声望P-PP-2'基础效果",
            effect() {
                return player.p.points.add(10).max(10).log(10).log(10).pow(0.125).max(1)
            },
            effectDisplay() { return "*" + format(upgradeEffect('c', 54)) },
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("1e2183"),
            unlocked() { return hu("c", 53) },
        },
        55: {
            title: "C25",
            description: "增强点数*100",
            currencyDisplayName: "点数",
            currencyInternalName: "points",
            cost: n("e2234"),
            unlocked() { return hu("c", 54) },
        },
    },
    buyables: {
        11: {
            cost() {
                let x = player.c.buyables[11]
                let exp = tmp.c.buyables[11].coste
                return n(10).pow(x.pow(exp)).mul(1e4)
            },
            coste() {
                let exp = 1.3
                return exp
            },
            display() {
                return "膨胀点数*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[11]) + "<br>价格:" + format(this.cost()) + "膨胀点数"
            },
            canAfford() { return player.c.dp.gte(this.cost()) },
            buy() {
                if (!hm("a", 3)) player.c.dp = player.c.dp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "C-dli-1" },
            base() {
                let base = player.c.dp.add(10).max(10).log(10)
                return base
            },
            effect() {
                let base = tmp.c.buyables[11].base
                let x = player.c.buyables[11]
                return Decimal.pow(base, x)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[11].coste
                let target = s.div(1e4).log(10).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[11].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[11] = player.c.buyables[11].max(target)
                }
            },
        },
        12: {
            cost() {
                let x = player.c.buyables[12]
                let exp = tmp.c.buyables[12].coste
                return n(100).pow(x.pow(exp)).mul(1e6)
            },
            coste() {
                let exp = 1.35
                return exp
            },
            display() {
                return "增强点数*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[12]) + "<br>价格:" + format(this.cost()) + "膨胀点数"
            },
            canAfford() { return player.c.dp.gte(this.cost()) },
            buy() {
                if (!hm("a", 3)) player.c.dp = player.c.dp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "C-dli-2" },
            base() {
                let base = player.c.dp.add(10).max(10).log(10).pow(0.5)
                if (hu("c", 31)) base = base.pow(2)
                return base
            },
            effect() {
                let base = tmp.c.buyables[12].base
                let x = player.c.buyables[12]
                return Decimal.pow(base, x)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[12].coste
                let target = s.div(1e6).log(100).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[12].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[12] = player.c.buyables[12].max(target)
                }
            },
        },
        13: {
            cost() {
                let x = player.c.buyables[13]
                let exp = tmp.c.buyables[13].coste
                return n(1e3).pow(x.pow(exp)).mul(1e25)
            },
            coste() {
                let exp = 1.8
                return exp
            },
            display() {
                return "P-B-1效果+^" + format(this.base()) + "<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[13]) + "<br>价格:" + format(this.cost()) + "膨胀点数"
            },
            canAfford() { return player.c.dp.gte(this.cost()) },
            buy() {
                if (!hm("a", 3)) player.c.dp = player.c.dp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "C-dli-3" },
            base() {
                let base = n(0.2)
                return base
            },
            effect() {
                let base = tmp.c.buyables[13].base
                let x = player.c.buyables[13]
                return x.mul(base).add(1)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[13].coste
                let target = s.div(1e25).log(1e3).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[13].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[13] = player.c.buyables[13].max(target)
                }
            },
        },
        21: {
            cost() {
                let x = player.c.buyables[21]
                let exp = tmp.c.buyables[21].coste
                return n(1e12).pow(x.pow(exp)).mul(1e73)
            },
            coste() {
                let exp = 1.5
                return exp
            },
            display() {
                return "反-点数*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[21]) + "<br>价格:" + format(this.cost()) + "膨胀点数"
            },
            canAfford() { return player.c.dp.gte(this.cost()) && hm("a", 6) },
            buy() {
                player.c.dp = player.c.dp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "dil-B-4" },
            base() {
                let base = player.c.dp.add(10).max(10).log(10).pow(0.5)
                return base
            },
            effect() {
                let base = tmp.c.buyables[21].base
                let x = player.c.buyables[21]
                return Decimal.pow(base, x)
            },
            unlocked() { return hm("a", 6) },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[21].coste
                let target = s.div(1e73).log(1e12).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[21].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[21] = player.c.buyables[21].max(target)
                }
            },
        },
        22: {
            cost() {
                let x = player.c.buyables[22]
                let exp = tmp.c.buyables[22].coste
                return n(100000).pow(x.pow(exp)).mul(1e90)
            },
            coste() {
                let exp = 1.65
                return exp
            },
            display() {
                return "PM基础获取*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[22]) + "<br>价格:" + format(this.cost()) + "膨胀点数"
            },
            canAfford() { return player.c.dp.gte(this.cost()) && hm("a", 6) },
            buy() {
                player.c.dp = player.c.dp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "dil-B-5" },
            base() {
                let base = player.c.dp.add(10).max(10).log(10).pow(0.01).add(0.01)
                return base
            },
            effect() {
                let base = tmp.c.buyables[22].base
                let x = player.c.buyables[22]
                return Decimal.pow(base, x)
            },
            unlocked() { return hm("a", 6) },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[22].coste
                let target = s.div(1e90).log(100000).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[22].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[22] = player.c.buyables[22].max(target)
                }
            },
        },
        23: {
            cost() {
                let x = player.c.buyables[23]
                let exp = tmp.c.buyables[23].coste
                return n(100).pow(x.pow(exp)).mul(1e95)
            },
            coste() {
                let exp = 1.4
                return exp
            },
            display() {
                return "P7+^" + format(this.base()) + "<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[23]) + "<br>价格:" + format(this.cost()) + "膨胀点数"
            },
            canAfford() { return player.c.dp.gte(this.cost()) && hm("a", 6) },
            buy() {
                player.c.dp = player.c.dp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "dil-B-5" },
            base() {
                let base = player.c.dp.add(10).max(10).log(10).pow(0.01).sub(1)
                return base
            },
            effect() {
                let base = tmp.c.buyables[23].base
                let x = player.c.buyables[23]
                return Decimal.mul(base, x).add(1)
            },
            unlocked() { return hm("a", 6) },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[23].coste
                let target = s.div(1e95).log(100).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[23].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[23] = player.c.buyables[23].max(target)
                }
            },
        },
        101: {
            cost() {
                let x = player.c.buyables[101]
                let exp = tmp.c.buyables[101].coste
                return n(100).pow(x.pow(exp)).mul(10)
            },
            coste() {
                let exp = 1.3
                return exp
            },
            display() {
                return "PN*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[101]) + "<br>价格:" + format(this.cost()) + "奇点"
            },
            canAfford() { return player.c.sing.gte(this.cost()) },
            buy() {
                if (!hm("a", 3)) player.c.sing = player.c.sing.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "C-Sing-1" },
            base() {
                let base = player.c.sing.add(10).max(10).log(10)
                return base
            },
            effect() {
                let base = tmp.c.buyables[101].base
                let x = player.c.buyables[101]
                return Decimal.pow(base, x)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[101].coste
                let target = s.div(10).log(100).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[101].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[101] = player.c.buyables[101].max(target)
                }
            },
        },
        102: {
            cost() {
                let x = player.c.buyables[102]
                let exp = tmp.c.buyables[102].coste
                return n(100).pow(x.pow(exp)).mul(1e9)
            },
            coste() {
                let exp = 1.3
                return exp
            },
            display() {
                return "声望点数^(<span style = 'font-size:8px'>0.02log<sub>2</sub>(x+1)+1</span>)<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[102]) + "<br>价格:" + format(this.cost()) + "奇点"
            },
            canAfford() { return player.c.sing.gte(this.cost()) },
            buy() {
                if (!hm("a", 3)) player.c.sing = player.c.sing.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "C-Sing-2" },
            effect() {
                let x = player.c.buyables[102]
                return x.add(1).log(2).mul(0.02).add(1)
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[102].coste
                let target = s.div(1e9).log(100).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[102].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[102] = player.c.buyables[102].max(target)
                }
            },
        },
        103: {
            cost() {
                let x = player.c.buyables[103]
                let exp = tmp.c.buyables[103].coste
                return n(1.1).pow(x.pow(exp)).mul(20).pow10().mul(0.001)
            },
            coste() {
                let exp = 1.25
                return exp
            },
            display() {
                return "压缩点数价格^(0.95<sup>x<sup>0.8</sup></sup>)<br>当前:^" + format(this.effect()) + "<br>数量:" + format(player.c.buyables[103]) + "<br>价格:" + format(this.cost()) + "奇点"
            },
            canAfford() { return player.c.sing.gte(this.cost()) },
            buy() {
                if (!hm("a", 3)) player.c.sing = player.c.sing.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() { return "C-Sing-3" },
            effect() {
                let x = player.c.buyables[103]
                return n(0.95).pow(x.pow(0.8))
            },
            unlocked() { return true },
            maxAfford() {
                let s = player.c.dp
                let exp = tmp.c.buyables[103].coste
                let target = s.div(0.001).log(10).div(20).log(1.1).root(exp)
                return target.floor().add(1)
            },
            buyMax() {
                let target = tmp.c.buyables[103].maxAfford
                if (canBuyBuyable(this.layer, this.id)) {
                    player.c.buyables[103] = player.c.buyables[103].max(target)
                }
            },
        },
    },
    clickables: {
        11: {
            display() {
                let a = ",增强点数"
                let b = ",声望点数,声望力量"
                if (hu("c", 44) && hu("a", 11)) b = ""
                let dis = "<h2>点数膨胀</h2><br>进行压缩点数重置 并重置增强点数 点数" + a + b + "指数^" + getpointdileff().toString()
                if (getClickableState("c", 11) == 0) dis += "<br>点击进入膨胀"
                if (getClickableState("c", 11) == 1) dis += "<br>点击退出膨胀"
                return dis
            },
            unlocked() {
                return hu("c", 15)
            },
            canClick() { return true },
            onClick() {
                let a = null
                if (player.e.activeChallenge !== null) a = player.e.activeChallenge
                player.e.points = n(0)
                doReset("e", true)
                player.e.activeChallenge = a
                player.c.dliationcount += 1
                if (getClickableState("c", 11) == 0) setClickableState("c", 11, 1)
                else setClickableState("c", 11, 0)
            },
            style: {
                'height': '120px', 'width': '180px', 'font-size': '10px', "border-radius": "5%", "border": "4px solid", "border-color": "rgba(0, 0, 0, 0.125)", "background"() {
                    let color = "#FFFFFF"
                    return color
                }
            }
        },
        21: {
            display() {
                let dis = "<h2>奇点压缩</h2><br>进行压缩点数重置以获取 " + formatWhole(tmp.c.sing.gain) + " 奇点"
                if (tmp.c.sing.gain.lt(100)) dis += "<br><br>下一个在 " + format(tmp.c.sing.next) + ' 点数'
                return dis
            },
            unlocked() {
                return hu("c", 15)
            },
            canClick() { return true },
            onClick() {
                player.c.sing = player.c.sing.add(tmp.c.sing.gain)
                doReset("e", true)
            },
            style: {
                'height': '120px', 'width': '180px', 'font-size': '10px', "border-radius": "5%", "border": "4px solid", "border-color": "rgba(0, 0, 0, 0.125)", "background"() {
                    let color = "#FFFFFF"
                    return color
                }
            }
        },
    },
    layerShown() { return (hu("e", 25) || ha("ach", 21) || player.c.total.gte(1)) },
})
