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
	num: "0.2.1",
	name: "无限维度",  
}

let changelog = `<h1>更新日志:</h1><br>
	<h3>V0.2.1</h3><br>
	- 添加了维度<br>
	- 残局：1e58000点数<br>
	- 成就数量：23<br>
	<h3>V0.2</h3><br>
	- 添加了1个层级<br>
	- 残局：1e14000点数<br>
	- 成就数量：18<br>
	<h3>V0.1.2</h3><br>
	- 添加了奇点<br>
	- 残局：1e6400点数<br>
	- 成就数量：15<br>
	<h3>V0.1.1</h3><br>
	- 添加了PN<br>
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
	exp = exp.mul(tmp.c.dilate.pointeff)
	if (hu("c", 45)) exp = exp.mul(1.022)
	if (hm('a', 8)) exp = exp.mul(tmp.a.milestones[8].effect)
	exp = exp.mul(tmp.a.challenges[21].effect)
	return exp
}

function getgainmult() {
	let mult = n(1)
	mult = mult.mul(tmp.e.effect)
	mult = mult.mul(tmp.e.pm.eff)
	mult = mult.mul(tmp.c.effect[0])
	if (hu('p', 11)) mult = mult.mul(tmp.p.upgrades[11].effect)
	if (hu('p', 14)) mult = mult.mul(tmp.p.upgrades[14].effect)
	mult = mult.mul(tmp.p.buyables[11].effect)
	if (hu("p", 12)) mult = mult.mul(2)
	if (hu("p", 31)) mult = mult.mul(10)
	mult = mult.mul(tmp.a.boostereff)
	if (hu("c", 45)) mult = mult.mul(ue("c", 45))
	if (ha("ach", 35)) mult = mult.mul(tmp.ach.achievements[35].effect)
	return mult
}


function getPointGen() {
	if (!canGenPoints()) return n(0)
	let gain = n(1)
	gain = gain.mul(getgainmult())
	gain = gain.pow(getgainexp())
	gain = gain.max(0)
	if (inChallenge('a', 12)) gain = gain.pow(0.5)
	if (inChallenge("e", 12)) gain = expPow(gain, 0.5)
	if (getClickableState("c", 11) == 1) gain = expPow(gain, getpointdileff())
	if (inChallenge('a', 21)) gain = gain.max(0.0183388448578688).addTP(-0.025)
	//let gainslog = gain.slog(10) ; gainslog = gainslog.min(1.797e308) ; gain = Decimal.tetrate(10, gainslog)
	return gain
}

function addedPlayerData() {
}

var displayThings = [
	function () {
		let a = "残局:" + format('1e58000') +"点数"
		/*
		let tick = 0
    	for (i = 0; i<lastTenTicks.length; i++){
			tick += lastTenTicks[i] / lastTenTicks.length
		}
		if (lastTenTicks.length > 9 ) a = a + '<br>TPS:' + ((tick / 1000) ** -1).toFixed(1)
		*/
		return a
	}

]

function isEndgame() {
	return player.points.gte("1e58000")
}

var backgroundStyle = {

}

function maxTickLength() {
	return (86400)
}

function fixOldSave(oldVersion) {

}


