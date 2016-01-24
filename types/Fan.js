var inherits = require('util').inherits;

var Service, Characteristic;

function LoxoneFan(config, platform, hap) {
    this.log = platform.log;
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;
    this.output = config.output;
    this.factor = config.factor;

    this._service = new Service.Fan(this.name);
    this._service.getCharacteristic(Characteristic.On)
        .on('get', this._getValue.bind(this));

    this._service.getCharacteristic(Characteristic.On)
        .on('set', this._setValue.bind(this));


    this._service.getCharacteristic(Characteristic.RotationSpeed)
        .on('get', this._getRotationSpeedValue.bind(this));

    this._service.getCharacteristic(Characteristic.RotationSpeed)
        .on('set', this._setRotationSpeedValue.bind(this));

}

LoxoneFan.prototype._getValue = function(callback) {
    var accessory = this;
    this.loxone.getValue(this.output, function(value) {
        if (value == undefined) {
            accessory.log.error(accessory.name + " is undefined when getting value");
            callback(new Error("Could not get value for " + this.output));
            return;
        }

        var on = value != '0.0';

        accessory.log(accessory.name + " is " + value, on);
        callback(null, on);
    });
};

LoxoneFan.prototype._setValue = function(on, callback) {
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

LoxoneFan.prototype._getRotationSpeedValue = function(callback) {
    var accessory = this;
    this.loxone.getValue(this.output, function(value) {
        if (value == undefined) {
            accessory.log.error("Brightness " + accessory.name + " is undefined when getting value");
            callback(new Error("Could not get value for " + this.output));
            return;
        }

        if (accessory.factor != undefined) {
            value = value / accessory.factor;
        }

        accessory.log("Rotation speed " + accessory.name + " is " + value);
        callback(null, value * 1);
    });
};

LoxoneFan.prototype._setRotationSpeedValue = function(value, callback) {
    var loxone = this.loxone;
    var input = this.input;
    var accessory = this;

    if (this.factor != undefined) {
        value = value * this.factor;
    }

    loxone.set(input, value, function(setValue) {
        if (setValue == undefined) {
            accessory.log.error("Rotation speed " + accessory.name + " is undefined when setting value");
            callback(new Error("Could not set value for " + input + " to " + value));
            return;
        }
        accessory.log("Set rotation speed of " + accessory.name + " to ", value);
        callback();
    });
};

LoxoneFan.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneFan;