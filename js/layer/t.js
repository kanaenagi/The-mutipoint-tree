"use strict";
/*
addLayer("t", {
    name: "N",
    symbol: "T",
    position: 3,
    startData() {
        return {
            unlocked: true,
            points: n(0),
            total: n(0),
            best: n(0),
            resetTime: 0
        }
    },
    color: "#fdfd24",
    requires: n("1e27950"),
    resource: "超越点数",
    baseResource: "声望点数",
    branches: ["p"],
    baseAmount() { return player.p.points },
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
    exponent2() {
        let exp = 0.8
        return exp
    },
    exponent() {
        let exp = 0.01
        return exp
    },
    gainMult() {
        let mult = n(1)
        return mult
    },
    gainExp() {
        let exp = n(1)
        return exp
    },
    getResetGain() {
        let gain = expPow(this.baseAmount().div("1e27950").max(1), tmp.t.exponent2).pow(tmp.t.exponent).mul(tmp.t.gainMult).pow(tmp.t.gainExp)
        if (this.baseAmount().lt("1e27950")) return n(0)
        return gain.floor()
    },
    getNextAt() {
        let next = expRoot(tmp.t.getResetGain.add(1).root(tmp.t.gainExp).div(tmp.t.gainMult).root(tmp.t.exponent), tmp.t.exponent2).mul("1e27950").max("1e27950")
        return next
    },
    update(diff) {
    },
    hotkeys: [
        {
            key: "t", description: "T:重置以获取超越点数",
            unlocked() { return  player.t.total.gte(1) || ha("ach", 46)  },
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
            content: [
                ["display-text", Baixie]
            ],
        },
    },
    upgrades: {
      
    },
    milestones: {
    },
    buyables: {
    },
    clickables: {
    },
    layerShown() { return player.t.total.gte(1) || ha("ach", 46)  },
})
*/ 