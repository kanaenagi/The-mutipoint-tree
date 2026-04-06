let modInfo = {
	name: "The mutipoint Tree",
	id: "mutipointree",
	author: "kanaenagi",
	pointsName: "点数",
	modFiles: ["tree.js", "layer/p.js", "layer/e.js", "layer/c.js", "layer/a.js", "layer/side.js"],
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	offlineLimit: 900,  // In second
}
let VERSION = {
	num: "0.1.1",
	name: "打破膨胀",
}

let changelog = `<h1>更新日志:</h1><br>
	<h3>V0.1.1</h3><br>
	- 添加了PM<br>
	- 残局：1e3250点数<br>
	- 成就数量：12<br>
    <h3>V0.1</h3><br>
	- 添加了3个层级<br>
	- 残局：1e1700点数<br>
	- 成就数量：10<br>
	`
let winText = `恭喜你暂时"通关"了这树`
// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints() {
	return n(modInfo.initialStartPoints)
}

function canGenPoints() {
	return true
}

function getgainexp() {
	let exp = n(1)
	exp = exp.mul(tmp.c.dpeff)
	return exp
}

function getgainmult() {
	let mult = n(1)
	mult = mult.mul(tmp.e.effect)
	mult = mult.mul(tmp.e.pmEff)
	mult = mult.mul(tmp.c.effect[0])
	if (hu('p', 11)) mult = mult.mul(tmp.p.upgrades[11].effect)
	if (hu('p', 14)) mult = mult.mul(tmp.p.upgrades[14].effect)
	mult = mult.mul(tmp.p.buyables[11].effect)
	if (hu("p", 12)) mult = mult.mul(2)
	if (hu("p", 31)) mult = mult.mul(10)
	if (hm("a", 0)) mult = mult.mul(100)
	return mult
}


function getPointGen() {
	if (!canGenPoints()) return n(0)
	let gain = n(1)
	gain = gain.mul(getgainmult())
	gain = gain.pow(getgainexp())
	gain = gain.max(0)
	if (inChallenge("e", 12)) gain = expPow(gain, 0.5)
	if (getClickableState("c", 11) == 1) gain = expPow(gain, getpointdileff())
	//let gainslog = gain.slog(10) ; gainslog = gainslog.min(1.797e308) ; gain = Decimal.tetrate(10, gainslog)
	return gain
}

function addedPlayerData() {
	return {
		devSpeed: n(1),
		tree: 1
	}
}

var displayThings = [
	function () {
		let a = "残局:1.000e3250点数"
		//a += "<br>由于你的点数超过了1e10,000  点数获取速度受到软上限限制<br>由于你的点数超过了1e1,000,000  点数获取速度受到二重软上限限制<br>由于你的点数超过了e1e13  点数获取速度受到三重软上限限制<br>由于你的点数超过了e1e19  点数获取速度受到四重软上限限制<br>由于你的点数超过了e1e30  点数获取速度受到溢出<br>由于你的点数超过了e1e100  点数获取速度受到二重溢出<br>由于你的点数超过了e1e1,000  点数获取速度受到三重溢出<br0>由于你的点数超过了e1e10,000  点数获取速度受到四重溢出<br>由于你的点数超过了eee12  点数获取速度受到淤积<br>由于你的点数超过了ee1e100  点数获取速度受到二重淤积<br>由于你的点数超过了1.000F5  点数获取速度受到三重淤积<br>由于你的点数超过了1.000F7  点数获取速度受到四重淤积<br>由于你的点数超过了1.000F10  点数获取速度受到扭曲<br>由于你的点数超过了1.000F1,000  点数获取速度受到二重扭曲<br>由于你的点数超过了1.000F10,000,000 点数获取速度受到三重扭曲<br>由于你的点数超过了F1.000e13  点数获取速度受到四重扭曲<br>由于你的点数超过了F1.000e308  点数获取速度受到故障"//"<br>由于你的点数超过了Fe1.000e18  点数获取速度受到二重故障<br>由于你的点数超过了F1.000F5 点数获取速度受到三重故障<br>由于你的点数超过了1.000G5  点数获取速度受到四重故障<br>由于你的点数超过了1.000J10  点数获取速度受到蒸发"
		return a
	}

]

function isEndgame() {
	return player.points.gte("1e3250")
}

var backgroundStyle = {

}

function maxTickLength() {
	return (86400)
}

function fixOldSave(oldVersion) {

}


