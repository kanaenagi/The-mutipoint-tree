"use strict";
addLayer("p", { //喜欢不内置vue的小朋友们叉出去
  name: "prestige",
  symbol: "P",
  position: 0,
  startData() {
    return {
      unlocked: true,
      points: n(0),
      total: n(0),
      best: n(0),
      pp: n(0),
    }
  },
  color: "#A9A9A9",
  requires: n(10),
  resource: "声望点数",
  baseResource: "点数",
  baseAmount() { return player.points },
  type: "normal",
  doReset(resettingLayer) {
    let keep = []
    let ku = []
    if (hm("e", 2)) ku.push("22")
    if (layers[resettingLayer].row > this.row) {
      layerDataReset(this.layer, keep)
      player.p.upgrades = ku
    }
  },
  exponent() {
    let exp = 0.25
    return exp
  },
  gainmult() {
    let mult = n(1)
    if (hm("a", 1)) mult = mult.mul(1e9)
    if (hu("p", 31)) mult = mult.mul(2)
    mult = mult.mul(tmp.p.buyables[12].effect)
    if (hu('p', 13)) mult = mult.mul(tmp.p.upgrades[13].effect)
    mult = mult.mul(tmp.p.PPeff)
    if (hu('p', 34)) mult = mult.mul(tmp.p.upgrades[34].effect)
    if (hu('c', 15)) mult = mult.mul(tmp.c.upgrades[15].effect)
    mult = mult.mul(tmp.e.effect)
    mult = mult.mul(tmp.e.buyables[23].effect)
    return mult
  },
  gainExp() {
    let exp = n(1)
    return exp
  },
  getResetGain() {
    let gain = player.points.div(10).pow(tmp.p.exponent).mul(tmp.p.gainmult).pow(tmp.p.gainExp)
    if (inChallenge('e', 11)) gain = gain.pow(0.35)
    if (getClickableState("c", 11) == 1 && !hu("a", 11)) gain = expPow(gain, getpointdileff())
    if (player.points.lt(10)) return n(0)
    return gain.floor()
  },
  getNextAt() {
    let amt = tmp.p.getResetGain.add(1)
    if (getClickableState("c", 11) == 1 && !hu("a", 11)) amt = expRoot(amt, getpointdileff())
    if (inChallenge('e', 11)) amt = amt.root(0.35)
    let next = amt.root(tmp.p.gainExp).div(tmp.p.gainmult).root(tmp.p.exponent).max(1).mul(10)
    return next
  },
  passiveGeneration() {
    let mult = 0
    if (hu("p", 22)) mult += 1
    return mult
  },
  row: 1, // Row the layer is in on the tree (0 is the first row) [其实1 2 3都可以]
  PPgain() {
    if (player.p.points.lt(1e8)) return n(0)
    let basegain = player.p.points.div(1e8).max(1).log(10).max(0).pow(2).mul(2)
    let basegainexp = n(0)
    basegainexp = basegainexp.add(tmp.p.buyables[112].effect)
    let mult = n(1)
    mult = mult.mul(tmp.p.buyables[111].effect)
    if (hm("e", 1)) mult = mult.mul(tmp.e.milestones[1].effect)
    if (hm("e", 4) && !inChallenge("e", 11)) mult = mult.mul(tmp.e.milestones[4].effect)
    if (hm("p", 1)) mult = mult.mul(tmp.p.upgrades[13].effect)
    if (hu("e", 13)) mult = mult.mul(tmp.e.upgrades[13].effect)
    if (hu("p", 23)) mult = mult.mul(tmp.p.upgrades[23].effect)
    if (hu("p", 44)) mult = mult.mul(tmp.p.upgrades[44].effect)
    if (hu("p", 54)) mult = mult.mul(tmp.p.upgrades[54].effect)
    mult = mult.mul(tmp.e.buyables[21].effect)
    mult = mult.mul(tmp.c.effect[0])
    mult = mult.mul(basegain.pow(basegainexp))
    let exp = n(1)
    let gain = basegain.mul(mult).pow(exp)
    if (inChallenge("a", 11)) gain = gain.overflow(n(1e20), 0.5)
    if (getClickableState("c", 11) == 1 && !hu("a", 11)) return expPow(gain, getpointdileff())
    return gain
  },
  PPeff() {
    let exp = n(1)
    let exp2 = n(1)
    exp = exp.mul(tmp.p.buyables[113].effect)
    exp = exp.mul(tmp.e.challenges[12].effect)
    let eff = expPow(player.p.pp.add(1).max(1), 0.8)
    eff = eff.max(1).pow(exp)
    eff = expPow(eff, exp2)
    return eff
  },
  update(diff) {
    if (hm("p", 0) && player.p.points.gte(1e8)) player.p.pp = player.p.pp.add(tmp.p.PPgain.times(diff))
    if (player.e.bxat1) { layers.p.buyables[11].buyMax(); layers.p.buyables[12].buyMax(); layers.p.buyables[13].buyMax() }
    if (player.e.p1a1) { layers.p.buyables[111].buyMax(); layers.p.buyables[112].buyMax(); layers.p.buyables[113].buyMax() }
  },
  hotkeys: [
    {
      key: "p", description: "P:重置以获取声望点数",
      onPress() { if (canReset(this.layer)) doReset(this.layer) },
      unlocked() { return true }
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
        "milestones"],
    },
    "buyables": {
      unlocked() { return hu("p", 15) },
      name: "购买项",
      content: ["main-display",
        "prestige-button",
        'resource-display',
        ["blank", "25px"],
        ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
        ["disp"],
      ]
    },
    "Power": {
      unlocked() { return hm("p", 0) },
      name: "声望力量",
      content: ["main-display",
        "prestige-button",
        'resource-display',
        ["blank", "25px"],
        ["display-text", function () {
          return "你有 <h3 style='color: #A9A9A9; text-shadow: 0 0 10px #a9a9a9'>" + format(player.p.pp) + "</h3> 声望力量 声望点数*<h3 style='color: #A9A9A9; text-shadow: 0 0 10px #a9a9a9'>" + format(tmp.p.PPeff) + "</h3><br>你每秒获取" + format(tmp.p.PPgain) + "声望力量/s (开始于100,000,000声望点数)"
        }],
        ["row", [["buyable", 111], ["buyable", 112], ["buyable", 113]]],
        ["blank", "50px"],
        ["display-text", function () { if (tmp.p.PPeff.gte("e10000")) return "<br><span style='color:red' > 由于声望力量效果超过了" + format("1e10000") + " 声望力量效果将受到软上限限制 </span>" }],
      ],
    },
  },
  upgrades: {
    11: {
      title: "P1",
      description: "点数加成点数",
      expbase() {
        let u1 = n(1)
        if (hu("p", 15)) u1 = u1.add(1)
        if (hu("p", 21)) u1 = u1.add(player.p.upgrades.length * 0.2)
        u1 = u1.add(tmp.p.buyables[13].effect)
        if (hu("p", 51)) u1 = u1.add(tmp.p.upgrades[51].effect)
        //u1 = u1.add(tmp.a.challenges[11].effect)
        if (hu("p", 35)) u1 = u1.mul(tmp.p.upgrades[35].effect)
        return u1
      },
      baseeffect() {
        let p1eff = player.points.add(10).log(10).pow(1.25).max(1)
        return p1eff
      },
      effect() {
        let exp = tmp.p.upgrades[11].expbase
        let base = tmp.p.upgrades[11].baseeffect
        return base.pow(exp)
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 11)) },
      cost: n(1),
    },
    12: {
      title: "P2",
      description: "点数*2",
      cost: n(5),
      unlocked() { return hu('p', 11) },
    },
    13: {
      title: "P3",
      description: "点数加成声望点数",
      cost: n(10),
      effect() {
        let eff = player.points.add(10).log(10)
        if (hu("c", 12)) eff = expPow(eff, 1.1)
        if (hu("e", 23)) eff = eff.pow(tmp.e.upgrades[23].effect)
        return eff
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 13)) },
      unlocked() { return hu('p', 12) },
    },
    14: {
      title: "P4",
      description: "声望点数加成点数",
      cost: n(25),
      effect() {
        let powbase = n(1)
        let eff = expPow(player.p.points.max(1), 0.8)
        eff = eff.pow(powbase)
        return eff
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 14)) },
      unlocked() { return hu('p', 13) },
    },
    15: {
      title: "P5",
      description: "解锁购买项 P1基础指数+1",
      cost: n(50),
      unlocked() { return hu('p', 14) },
    },
    21: {
      title: "P6",
      description: "每个声望点数升级加成0.2P1基础指数",
      cost: n(5000),
      effect() { return player.p.upgrades.length * 0.2 },
      effectDisplay() { return "+" + format(upgradeEffect('p', 21)) },
      unlocked() { return hu('p', 15) },
    },
    22: {
      title: "P7",
      description: "每秒获得100%的声望点数",
      cost: n(5e5),
      unlocked() { return hu('p', 21) || hm('e', 2) },
    },
    23: {
      title: "P8",
      description: "点数加成声望力量",
      effect() {
        return player.points.div(1e18).max(10).log(10).pow(2)
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 23)) },
      cost: n(5e13),
      unlocked() { return hu('p', 22) },
    },
    24: {
      title: "P9",
      description: "削弱P-B-2价格",
      cost: n(1e17),
      unlocked() { return hu('p', 23) },
    },
    25: {
      title: "P10",
      description: "削弱P-B-1价格",
      cost: n(2.5e23),
      unlocked() { return hu('p', 24) },
    },
    31: {
      title: "P11",
      description: "P-B-1加成PM",
      cost: n('e1500'),
      effect() {
        let powbase = n(1)
        return Decimal.pow(1.04, player.p.buyables[11]).pow(powbase)
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 31)) },
      unlocked() { return hu('p', 25) && hu('e', 31) },
    },
    32: {
      title: "P12",
      description: "'力量加成'加成PM效果",
      cost: n('1e1725'),
      effect() {
        return player.p.buyables[113].mul(0.0125).add(1)
      },
      effectDisplay() { return "^" + format(upgradeEffect('p', 32)) },
      unlocked() { return hu('p', 31) },
    },
    33: {
      title: "P13",
      description: "基于声望点数加成P3",
      effect() {
        return player.p.points.add(1).log(10).pow(0.5).mul(0.1)
      },
      effectDisplay() { return "^" + format(upgradeEffect('p', this.id)) },
      cost: n('e2120'),
      unlocked() { return hu('p', 32) },
    },
    34: {
      title: "P14",
      description: "P-B-1加成声望点数",
      cost: n('e2900'),
      effect() {
        let powbase = n(1)
        return Decimal.pow(1.5, player.p.buyables[11]).pow(powbase)
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 34)) },
      unlocked() { return hu('p', 33) },
    },
    35: {
      title: "P15",
      description: "声望点数加成P1",
      cost: n('e3175'),
      effect() {
        let eff = player.p.points.add(10).max(10).log(10).log(10).mul(0.1).add(1).pow(0.2)
        return eff
      },
      effectDisplay() { return "^" + format(upgradeEffect('p', 35)) },
      unlocked() { return hu('p', 34) },
    },
    41: {
      title: "P16",
      description: "基于声望力量加成PN",
      cost: n("1e4080"),
      effect() {
        let eff = expPow(player.p.pp.add(10).max(10).log(10), 2)
        return eff
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 41)) },
      unlocked() { return hu("p", 35) },
    },
    42: {
      title: "P17",
      description: "P-B-2基础效果*2",
      cost: n("1e4300"),
      unlocked() { return hu('p', 41) },
    },
    43: {
      title: "P18",
      description: "基于声望点数加成膨胀点数",
      effect() {
        let eff = player.p.points.max(10).log(10).pow(0.5)
        return eff
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 43)) },
      cost: n("1e4900"),
      unlocked() { return hu('p', 42) },
    },
    44: {
      title: "P19",
      description: "P-B-1加成声望力量",
      effect() {
        let amt = player.p.buyables[11]
        return Decimal.pow(1.1, amt)
      },
      effectDisplay() { return "*" + format(upgradeEffect('p', 44)) },
      cost: n("1e5170"),
      unlocked() { return hu('p', 43) },
    },
    45: {
      title: "P20",
      description: "削弱P-B-3价格",
      cost: n("1e6130"),
      unlocked() { return hu('p', 44) },
    },
    51: {
      title: "P21",
      description: "PN加成P1基础指数",
      cost: n("1e17000000"),
      effect() {
        let eff = player.e.pn.add(10).max(10).log(10).add(9).log(10).add(0.2).pow(4).add(0.25)
        return eff
      },
      effectDisplay() { return "+" + format(upgradeEffect('p', 51)) },
      unlocked() { return hu('p', 450) },
    },
    52: {
      title: "P22",
      description: "声望点数加成PM",
      cost: n("1e1700"),
      effect() { return expPow(player.p.points.div("1e1600").max(10).log(10), 2) },
      effectDisplay() { return "*" + format(upgradeEffect('p', 52)) },
      unlocked() { return hu('p', 51) },
    },
    53: {
      title: "P23",
      description: "削弱P-B-1价格",
      cost: n("1e1870"),
      unlocked() { return hu('p', 52) },
    },
    54: {
      title: "P24",
      description: "膨胀点数加成声望力量",
      cost: n("1.5e1926"),
      effect() { return expPow(player.c.dp.max(1).pow(2.75), 0.8) },
      effectDisplay() { return "*" + format(upgradeEffect('p', 54)) },
      unlocked() { return hu('p', 53) },
    },
    55: {
      title: "P25",
      description: "再次削弱P-B-3价格",
      cost: n("1e2370"),
      unlocked() { return hu('p', 54) },
    },
  },
  milestones: {
    0: {
      requirementDescription: "5e7 声望点数 (1)",
      effectDescription: "解锁声望力量",
      done() { return player.p.points.gte(5e7) }
    },
    1: {
      requirementDescription: "1e28 声望点数 (2)",
      effectDescription: "P3也加成声望力量 解锁增强点数",
      done() { return player.p.points.gte(1e28) }
    },
  },
  buyables: {
    11: {
      cost() {
        let x = player.p.buyables[11]
        let exp = tmp.p.buyables[11].coste
        let base = tmp.p.buyables[11].costbase
        if (x.gte(25)) x = x.div(25).pow(2).mul(25)
        return n(10).pow(x.pow(exp)).mul(base)
      },
      coste() {
        let exp = 1.2
        if (inChallenge("e", 21)) exp = (exp + 1) ** 2
        if (hu("p", 25)) exp -= 0.1
        return exp
      },
      costbase() {
        let base = 10
        return base
      },
      display() {
        return "点数*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.p.buyables[11]) + "<br>价格:" + format(this.cost()) + "声望点数"
      },
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        if (!hm("e", 0)) player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      title() { return "P-B-1" },
      base() {
        let base = n(2)
        base = base.pow(tmp.c.buyables[13].effect)
        return base
      },
      effect() {
        let x = getBuyableAmount(this.layer, this.id)
        let mult = this.base()
        let eff = mult.pow(x)
        return eff
      },
      unlocked() { return hu('p', 15) },
      maxAfford() {
        let s = player.p.points
        let exp = tmp.p.buyables[11].coste
        let base = tmp.p.buyables[11].costbase
        let target = s.div(base).log(10).root(exp)
        if (target.gte(25)) target = target.div(25).root(2).mul(25)
        return target.floor().add(1)
      },
      buyMax() {
        let target = tmp.p.buyables[11].maxAfford
        if (canBuyBuyable(this.layer, this.id)) {
          player.p.buyables[11] = player.p.buyables[11].max(target)
        }
      },
    },
    12: {
      cost() {
        let x = player.p.buyables[12]
        let exp = tmp.p.buyables[12].coste
        let base = tmp.p.buyables[12].costbase
        return n(10).pow(x.pow(exp)).mul(base)
      },
      coste() {
        let exp = 1.3
        if (inChallenge("e", 21)) exp = (exp + 1) ** 2
        if (hu("p", 24)) exp -= 0.1
        return exp
      },
      costbase() {
        let base = 100
        return base
      },
      display() {
        return "声望点数*" + format(this.base()) + "<br>当前:*" + format(this.effect()) + "<br>数量:" + format(player.p.buyables[12]) + "<br>价格:" + format(this.cost()) + "声望点数"
      },
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        if (!hm("e", 0)) player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      title() { return "P-B-2" },
      base() {
        let base = n(2)
        if (hu('p', 42)) base = base.pow(2)
        return base
      },
      effect() {
        let x = player.p.buyables[12]
        let base = this.base()
        return Decimal.pow(base, x)
      },
      unlocked() { return hu('p', 15) },
      maxAfford() {
        let s = player.p.points
        let exp = tmp.p.buyables[12].coste
        let base = tmp.p.buyables[12].costbase
        let target = s.div(base).log(10).root(exp)
        return target.floor().add(1)
      },
      buyMax() {
        let target = tmp.p.buyables[12].maxAfford
        if (canBuyBuyable(this.layer, this.id)) { player.p.buyables[12] = player.p.buyables[12].max(target) }
      },
    },
    13: {
      cost() {
        let x = player.p.buyables[13]
        let exp = tmp.p.buyables[13].coste
        return n(10).pow(x.pow(exp)).mul(10000)
      },
      coste() {
        let exp = 1.3
        if (inChallenge("e", 21)) exp = (exp + 1) ** 2
        return exp
      },
      display() { 
        let a = ""
        if (this.effect().gte(100)) a = ' (软上限)'
        
        return "P1基础指数+" + format(this.base()) + "<br>当前:+" + format(this.effect()) + a + "<br>数量:" + format(player.p.buyables[13]) + "<br>价格:" + format(this.cost()) + "声望点数" 
      },
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        if (!hm("e", 0)) player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      title() { return "P-B-3" },
      base() {
        let base = n(0.2)
        return base
      },
      effect() {
        let x = getBuyableAmount("p", 13)
        let mult = this.base()
        let sc1 = 0.5
        return x.times(mult).softcap(100, sc1)
      },
      unlocked() { return hu('p', 15) },
      maxAfford() {
        let s = player.p.points
        let exp = tmp.p.buyables[13].coste
        let target = s.div(10000).log(10).root(exp)
        return target.floor().add(1)
      },
      buyMax() {
        let target = tmp.p.buyables[13].maxAfford
        if (canBuyBuyable(this.layer, this.id)) { player.p.buyables[13] = player.p.buyables[13].max(target) }
      },
    },
    111: {
      cost() {
        let x = player.p.buyables[111]
        let exp = tmp.p.buyables[111].coste
        return n(4).pow(x.pow(exp)).mul(100)
      },
      coste() {
        let exp = 1.2
        if (inChallenge("e", 21)) exp = (exp + 1) ** 2
        return exp
      },
      display() { return "声望力量*" + format(tmp.p.buyables[111].base) + "<br>当前:*" + format(tmp.p.buyables[111].effect) + "<br>价格:" + format(tmp.p.buyables[111].cost) + "声望力量<br>数量:" + formatWhole(player.p.buyables[111]) },
      canAfford() { return player[this.layer].pp.gte(this.cost()) },
      buy() {
        if (!hm("e", 2)) player[this.layer].pp = player[this.layer].pp.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      base() {
        let base = n(2)
        if (hu("e", 14)) base = base.mul(tmp.e.upgrades[14].effect)
        return base
      },
      title() { return "力量加成" },
      effect() {
        let x = getBuyableAmount("p", 111)
        let base = tmp.p.buyables[111].base
        return inChallenge("a", 11) ? n(2) : Decimal.pow(base, x)
      },
      unlocked() { return hm('p', 0) },
      maxAfford() {
        let s = player.p.pp
        let exp = tmp.p.buyables[111].coste
        let target = s.div(100).log(4).root(exp)
        return target.floor().add(1)
      },
      buyMax() {
        let target = tmp.p.buyables[111].maxAfford
        if (canBuyBuyable(this.layer, this.id)) { player.p.buyables[111] = player.p.buyables[111].max(target) }
      },
    },
    112: {
      cost() {
        let x = player.p.buyables[112]
        let exp = tmp.p.buyables[112].coste
        //if (x.gte(100000)) x = x.log(10).div(5).pow(1.25).mul(5).pow10().pow(3)
        if (x.gte(100) && !hu("a", 31)) x = x.div(100).pow(2).mul(100)
        return n(100).pow(x.pow(exp)).mul(1e20)
      },
      coste() {
        let exp = 1.4
        if (inChallenge("e", 21)) exp = (exp + 1) ** 2
        return exp
      },
      display() { let a = ""; return "声望力量基础指数+" + format(tmp.p.buyables[112].base) + "<br>当前:+" + format(tmp.p.buyables[112].effect) + a + "<br>价格:" + format(tmp.p.buyables[112].cost) + "声望点数<br>数量:" + formatWhole(player.p.buyables[112]) },
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        if (!hm("e", 2)) player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      base() {
        let base = n(0.2)
        if (hu("e", 12)) base = base.add(0.05)
        if (hu("c", 54)) base = base.mul(tmp.c.upgrades[54].effect)
        return base
      },
      title() { return "力量指数" },
      effect() {
        let x = getBuyableAmount("p", 112)
        let base = tmp.p.buyables[112].base
        return inChallenge("a", 11) ? n(2) : base.mul(x)
      },
      unlocked() { return hm('p', 0) },
      maxAfford() {
        let s = player.p.points
        let exp = tmp.p.buyables[112].coste
        let target = s.div(1e20).log(100).root(exp)
        if (target.gte(100) && !hu("a", 31)) target = target.div(100).root(2).mul(100)
        //if (target.gte(100000)) target = target.root(3).log(10).div(5).root(1.35).mul(5).pow10()
        return target.floor().add(1)
      },
      buyMax() {
        let target = tmp.p.buyables[112].maxAfford
        if (canBuyBuyable(this.layer, this.id)) { player.p.buyables[112] = player.p.buyables[112].max(target) }
      },
    },
    113: {
      cost() {
        let x = player.p.buyables[113]
        let exp = tmp.p.buyables[113].coste
        return Decimal.pow(n(1.1), x.pow(exp)).mul(6).pow10()
      },
      coste() {
        let exp = 1.28
        if (inChallenge("e", 21)) exp = (exp + 1) ** 2
        return exp
      },
      display() {
        let a = ''
        if (!this.bonus().eq(0)) a = '+' + formatWhole(tmp.p.buyables[this.id].bonus)
        return "声望力量效果^" + format(tmp.p.buyables[113].base) + "<br>当前:^" + format(tmp.p.buyables[113].effect) + "<br>价格:" + format(tmp.p.buyables[113].cost) + "声望力量<br>数量:" + formatWhole(player.p.buyables[113])  + a 
      },
      canAfford() { return player[this.layer].pp.gte(this.cost()) },
      buy() {
        if (!hm("e", 2)) player[this.layer].pp = player[this.layer].pp.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      bonus() {
        let x = n(0)
        if (hu('c', 24)) x = x.add(1)
        return x
      },
      base() {
        let base = n(1.1)
        return base
      },
      title() { return "力量增幅" },
      effect() {
        let x = getBuyableAmount("p", 113).add(tmp.p.buyables[this.id].bonus)
        let base = tmp.p.buyables[113].base
        return inChallenge("a", 11) ? n(2) : base.pow(x)
      },
      unlocked() { return hm('p', 0) },
      maxAfford() {
        let s = player.p.pp
        let exp = tmp.p.buyables[113].coste
        let target = s.log(10).div(6).log(1.1).root(exp)
        return target.floor().add(1)
      },
      buyMax() {
        let target = tmp.p.buyables[113].maxAfford
        if (canBuyBuyable(this.layer, this.id)) { player.p.buyables[113] = player.p.buyables[113].max(target) }
      },
    },
  },
  autoUpgrade() { return player.e.atup },
  layerShown() { return true },
})

