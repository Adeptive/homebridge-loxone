var inherits = require('util').inherits;

var Service, Characteristic;

function LoxoneDimmer(config, platform, hap) {
    this.log = platform.log;
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;
    this.output = config.output;

    this._service = new Service.Lightbulb(this.name);
    this._service.getCharacteristic(Characteristic.On)
        .on('get', this._getValue.bind(this));

    this._service.getCharacteristic(Characteristic.On)
        .on('set', this._setValue.bind(this));


    this._service.getCharacteristic(Characteristic.Brightness)
        .on('get', this._getBrightnessValue.bind(this));

    this._service.getCharacteristic(Characteristic.Brightness)
        .on('set', this._setBrightnessValue.bind(this));

}

LoxoneDimmer.prototype._getValue = function(callback) {
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

LoxoneDimmer.prototype._setValue = function(on, callback) {
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

LoxoneDimmer.prototype._getBrightnessValue = function(callback) {
    var accessory = this;
    this.loxone.getValue(this.output, function(value) {
        if (value == undefined) {
            callback(new Error("Could not get value for " + this.input));
            return;
        }
        accessory.log(accessory.name + " is " + value);
        callback(null, value * 10);
    });
};

LoxoneDimmer.prototype._setBrightnessValue = function(value, callback) {
    var loxone = this.loxone;
    var input = this.input;

    loxone.set(input, value, function(value) {
        if (value == undefined) {
            callback(new Error("Could not set value for " + input + " to " + value));
            return;
        }
        callback();
    });
};

LoxoneDimmer.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneDimmer;