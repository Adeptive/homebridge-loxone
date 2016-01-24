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
            accessory.log.error(accessory.name + " is undefined when getting value");
            callback(new Error("Could not get value for " + this.output));
            return;
        }

        var on = value != '0';

        accessory.log(accessory.name + " is " + value, on);
        callback(null, on);
    });
};

LoxoneOutlet.prototype._setValue = function(on, callback) {
    var loxone = this.loxone;
    var input = this.input;
    var accessory = this;

    var command = on ? "On": "Off";

    loxone.set(input, command, function(value) {
        if (value == undefined) {
            accessory.log.error(accessory.name + " is undefined when setting value");
            callback(new Error("Could not set value for " + input + " to " + command));
            return;
        }
        accessory.log("Set value of " + accessory.name + " to " + command);
        callback();
    });
};

LoxoneOutlet.prototype._inUse = function(callback) {
    callback(null, true);
};

LoxoneOutlet.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneOutlet;