var inherits = require('util').inherits;

var Service, Characteristic;

function LoxoneOutlet(config, platform, hap) {
    this.log = platform.log;
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;
    this.output = config.output;

    this._service = new Service.Outlet(this.name);
    this._service.getCharacteristic(Characteristic.On)
        .on('get', this._getValue.bind(this));

    this._service.getCharacteristic(Characteristic.On)
        .on('set', this._setValue.bind(this));


    this._service.getCharacteristic(Characteristic.OutletInUse)
        .on('get', this._inUse.bind(this));
}

LoxoneOutlet.prototype._getValue = function(callback) {
    var accessory = this;
    this.loxone.getValue(this.output, function(value) {
        if (value == undefined) {
            callback(new Error("Could not get value for " + this.input));
            return;
        }
        accessory.log(accessory.name + " is " + value);
        callback(null, value == '1');
    });
};

LoxoneOutlet.prototype._setValue = function(on, callback) {
    var loxone = this.loxone;
    var input = this.input;
    var output = this.output;
    loxone.getValue(output, function(value) {
        if (value == undefined) {
            callback(new Error("Could not get value for " + output));
            return;
        }

        var isOn = (value != 0);
        if (isOn != on) {
            loxone.set(input, "Pulse", function(value) {
                if (value == undefined) {
                    callback(new Error("Could not get value for " + input));
                    return;
                }
                callback();
            });
        }

    });
};

LoxoneOutlet.prototype._inUse = function(callback) {
    callback(null, true);
};

LoxoneOutlet.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneOutlet;