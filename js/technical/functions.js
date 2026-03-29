//快捷定义
function n(num) {
    return new Decimal(num)
}

//检测旁边的升级是否被购买
function checkAroundUpg(UPGlayer, place) {
    place = Number(place)
    return hasUpgrade(UPGlayer, place - 1) || hasUpgrade(UPGlayer, place + 1) || hasUpgrade(UPGlayer, place - 10) || hasUpgrade(UPGlayer, place + 10)
}
//检测旁边的grid是否被点击 #Liuliu66686 提供
function checkAroundGrid(layer, id) {
    return getGridData(layer, id - 1) > 0 || getGridData(layer, id + 1) > 0 || getGridData(layer, id - 100) > 0 || getGridData(layer, id + 100) > 0
}

//修改class属性
function setClass(id, toClass = []) {
    var classes = ""
    for (i in toClass) classes += " " + toClass[i]
    if (classes != "") classes = classes.substr(1)
    document.getElementById(id).className = classes
}
//快速创建sub元素
function quickSUB(str) {
    return `<sub>${str}</sub>`
}
//快速创建sup元素
function quickSUP(str) {
    return `<sup>${str}</sup>`
}
//快速给文字上色
function quickColor(str, color) {
    return `<text style='color:${color}'>${str}</text>`
}


//适配有双效果的升级 #Liuliu66686提供
function upgradeEffect2(layer, id) {
    return (tmp[layer].upgrades[id].effect2)
}
//快速购买或售出升级 #Liuliu66686提供
function quickUpgBuyorSell(layer, IDs, bos) {
    if (bos) {
        for (id in IDs) {
            if (!hasUpgrade(layer, IDs[id])) {
                player[layer].upgrades.push(IDs[id])
            }
        }
    }
    else {
        for (id in IDs) {
            if (hasUpgrade(layer, IDs[id])) {
                player[layer].upgrades.splice(player[layer].upgrades.indexOf(IDs[id]), 1)
            }
        }
    }
}
//同时自动购买多个升级 #Liuliu66686提供
function quickUpgBuy(layer, IDs) {
    for (id in IDs) {
        buyUpgrade(layer, IDs[id])
    }
}
//快速设置多个可购买数量 #Liuliu66686提供
function quickSetBuyableAmount(layer, IDs, amount) {
    for (id in IDs) {
        player[layer].buyables[IDs[id]] = n(amount)
    }
}
//快速生成行列数组 #QqQe308提供
function quickSpawnConst(r, c, grid = false) {
    let a = []
    let x = grid ? 100 : 10
    for (i = 1; i <= r; i++) {
        for (j = 1; j <= c; j++)  a.push(i * x + j)
    }
    return a
}
//计算标准差函数
function sigmaCalculation(list) {
    let a = n(0); let b = n(0)
    for (num in list) { a = a.add(list[num]) }
    a = a.div(list.length)
    for (num in list) { b = b.add(n(list[num].sub(a)).pow(2)) }
    b = b.div(list.length).root(2)
    return b
}

//e后数字开根
function expRoot(num, root) {
    return n(10).pow(num.max(1).log10().add(1).root(root).sub(1))
}

//e后数字乘方
function expPow(num, pow) {
    return n(10).pow(num.max(1).log10().add(1).pow(pow).sub(1))
}

//软上限 
function Softcap(num, start, power, mode = 0, dis) {
    let x = n(num)
    start = n(start)
    if (x.gte(start) && !dis) {
        if ([0, "pow"].includes(mode)) x = x.div(start).max(1).pow(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).div(power).add(start)
        if ([2, "exp"].includes(mode)) x = expPow(x.div(start), power).mul(start)
        if ([3, "log"].includes(mode)) x = x.div(start).log(power).add(1).mul(start)
    }
    return x
}

//反向软上限
function anti_softcap(num, start, power, mode = 0, dis) {
    let x = num
    start = n(start)
    if (x.gte(start) && !dis) {
        if ([0, "pow"].includes(mode)) x = x.div(start).max(1).root(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).mul(power).add(start)
        if ([2, "exp"].includes(mode)) x = expRoot(x.div(start), power).mul(start)
        if ([3, "log"].includes(mode)) x = Decimal.pow(power, x.div(start).sub(1)).mul(start)
    }
    return x
}

//溢出软上限
function overflow(num, start, power, meta = 1) {
    if (isNaN(num.mag)) return new Decimal(0)
    start = n(start)
    if (num.gt(start)) {
        if (meta == 1) {
            let s = start.log10()
            num = num.log10().div(s).pow(power).mul(s).pow10()
        } else {
            let s = start.iteratedlog(10, meta)
            num = Decimal.iteratedexp(10, meta, num.iteratedlog(10, meta).div(s).pow(power).mul(s));
        }
    }
    return num;
}


//添加指数塔
function addTP(num, add) {
    if (isNaN(num.mag)) return new Decimal(0)
    return Decimal.tetrate(10, num.slog(10).add(add))
}

Decimal.prototype.addTP = function (power) {
    return addTP(this, power)
}
//乘数指数塔
function mulTP(num, mul) {
    if (isNaN(num.mag)) return new Decimal(0)
    return Decimal.tetrate(10, num.slog(10).mul(mul))
}

Decimal.prototype.mulTP = function (power) {
    return mulTP(this, power)
}
//指数塔软上限
function tetraflow(num, start, power) {
    start = n(start)
    if (isNaN(num.mag)) return new Decimal(0)
    if (num.lte(start)) return num;
    num = num.slog(10); start = start.slog(10);
    return Decimal.tetrate(10, num.sub(start).mul(power).add(start))
}



//Decimal类的软上限
Decimal.prototype.softcap = function (start, power, mode, dis) {
    return Softcap(this, start, power, mode, dis)
}
Decimal.prototype.anti_softcap = function (start, power, mode, dis) {
    return anti_softcap(this, start, power, mode, dis)
}
Decimal.prototype.overflow = function (start, power, meta) {
    return overflow(this, start, power, meta)
}
Decimal.prototype.tetraflow = function (start, power) {
    return tetraflow(this, start, power)
}


const Baixie = "<img src = \"s297.jpg\" height = \"25\" width = \"25\">"

function colorText(elem, color, text) {
    return "<" + elem + " style='color:" + color + ";text-shadow:0px 0px 10px;'>" + text + "</" + elem + ">"
}

const randomString_chars = `ABCDEFGHJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuwxyz1234567890?!;=+-/@#$%^&*~|"'()[]{},.`;
function randomString(length) {
    let result = '';

    for (let i = 0; i < length; i++) {
        result += randomString_chars[Math.floor(Math.random() * randomString_chars.length)];
    }

    return result;
}