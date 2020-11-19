var ZsyD8 = (function () {
    var that = this;
    var op = {
        read: "read",
        write: "write",
        readAndLog: "readAndLog",
        writeAndLog: "writeAndLog",
        writeHead: "writeHead",
        writeTrade: "writeTrade",
        cardType: "cardType",
        cardReset: "cpuReset"
    };

    var option = { ws: "ws", ext: "ext" };

    var storeCb = function (type, success, fail) {
        var ts = type + new Date().getTime();
        if (success && typeof success == 'function') {
            cbMap[ts + "_s"] = success;
        } else {
            console.log("no success callback specified for op " + type);
        }
        if (fail && typeof fail == 'function') {
            cbMap[ts + "_f"] = fail;
        } else {
            console.log("no failed callback specified for op " + type);
        }

        return ts;
    }

    var cbMap = {};

    this.ws = new WebSocket('ws://localhost:19002');

    this.ws.onopen = function (evt) {
        console.log('Connection open ...');
    };

    this.ws.onmessage = function (evt) {
        var res = JSON.parse(evt.data);
        var type = res.type; // error , log , data
        var ts = res.ts + "_" + (type == "error" ? "f" : "s");
        var callback = cbMap[ts];
        if (callback) {
            callback(res);
            delete cbMap[res.ts + "_s"];
            delete cbMap[res.ts + "_f"];
        } else {
            console.error("无法找到ts[" + ts + "]对应的callback");
        }
    };

    this.ws.onclose = function (evt) {
        console.error('Connection closed.');
    };

    this.readCard = function (success, fail) {
        var ts = storeCb(op.read, success, fail);
        this.ws.send(JSON.stringify({ op: op.read, ts: ts }));
    }

    this.readCardSilent = function (success, fail) {
        var ts = storeCb(op.read, success, fail);
        this.ws.send(JSON.stringify({ op: op.read, ts: ts, beep: false }));
    }

    this.writeExtend = function (data, success, fail) {
        var ts = storeCb(op.write, success, fail);
        this.ws.send(JSON.stringify({ op: op.write, data: data, ts: ts }));
    }

    this.writeExtendSilent = function (data, success, fail) {
        var ts = storeCb(op.write, success, fail);
        this.ws.send(JSON.stringify({ op: op.write, data: data, ts: ts, beep: false }));
    }

    this.writeHead = function (data, success, fail) {
        var ts = storeCb(op.writeHead, success, fail);
        this.ws.send(JSON.stringify({ op: op.writeHead, data: data, ts: ts }));
    }

    this.writeHeadSilent = function (data, success, fail) {
        var ts = storeCb(op.writeHead, success, fail);
        this.ws.send(JSON.stringify({ op: op.writeHead, data: data, ts: ts, beep: false }));
    }

    this.writeTrade = function (data, success, fail) {
        var ts = storeCb(op.writeTrade, success, fail);
        this.ws.send(JSON.stringify({ op: op.writeTrade, data: data, ts: ts }));
    }

    this.writeTradeSilent = function (data, success, fail) {
        var ts = storeCb(op.writeTrade, success, fail);
        this.ws.send(JSON.stringify({ op: op.writeTrade, data: data, ts: ts, beep: false }));
    }

    this.cardType = function (success, fail) {
        var ts = storeCb(op.cardType, success, fail);
        this.ws.send(JSON.stringify({ op: op.cardType, ts: ts, beep: false }));
    }

    this.cpuReset = function (success, fail) {
        var ts = storeCb(op.cardReset, success, fail);
        this.ws.send(JSON.stringify({ op: op.cardReset, ts: ts}));
    }

    this.cpuResetSilent = function (success, fail) {
        var ts = storeCb(op.cardReset, success, fail);
        this.ws.send(JSON.stringify({ op: op.cardReset, ts: ts, beep: false }));
    }

    this.isReady = function () {
        if (that.ws.readyState != 1) {
            return false;
        } else {
            return option.ws;
        }
    }

    return this;
}).call({});