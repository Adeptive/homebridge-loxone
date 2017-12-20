var inherits = require('util').inherits;

var Service, Characteristic;

/**
 *
 * Supporting different types:
 *  * Switch
 *  * Dimmer
 *  * Dimmer-%
 *  * RGB
 *  * StairwayLS
 *
 * @param config
 * @param platform
 * @param hap
 * @constructor
 */
function LoxoneLightbulb(config, platform, hap) {
    this.log = platform.log;
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;
    this.output = config.output;
    this.type = config.type || 'Switch';

    this._service = new Service.Lightbulb(this.name);
    this._service.getCharacteristic(Characteristic.On)
        .on('get', this._getValue.bind(this));

    this._service.getCharacteristic(Characteristic.On)
        .on('set', this._setValue.bind(this));


    if (this.type == 'Dimmer' || this.type == 'Dimmer-%') {
        this._service.getCharacteristic(Characteristic.Brightness)
            .on('get', this._getBrightnessValue.bind(this));

        this._service.getCharacteristic(Characteristic.Brightness)
            .on('set', this._setBrightnessValue.bind(this));

    }
}

LoxoneLightbulb.prototype._getValue = function(callback) {
    var accessory = this;
    this.loxone.getValue(this.output, function(value) {
        if (value == undefined) {
            accessory.log.error(accessory.name + " is undefined when getting value");
            callback(new Error("Could not get value for " + this.output));
            return;
        }

        var on = value != '0';
        if (accessory.type == 'Dimmer') {
            on = value != '0.0';
        } else if (accessory.type == 'Dimmer-%') {
            on = value != '0%';
        }

        accessory.log(accessory.name + " is " + value, on);
        callback(null, on);
    });
};

LoxoneLightbulb.prototype._setValue = function(on, callback) {
    var loxone = this.loxone;
    var input = this.input;
    var accessory = this;

    var command = on ? "On": "Off";
    if (accessory.type == 'StairwayLS' && on) {
        command = "pulse";
    }

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

LoxoneLightbulb.prototype._getBrightnessValue = function(callback) {
    var accessory = this;
    this.loxone.getValue(this.output, function(value) {
        if (value == undefined) {
            accessory.log.error("Brightness " + accessory.name + " is undefined when getting value");
            callback(new Error("Could not get value for " + this.output));
            return;
        }

        var brightness = value;
        if (accessory.type == 'Dimmer') {
            brightness = value * 10;
        }

        accessory.log("Brightness " + accessory.name + " is " + brightness);
        callback(null, brightness * 1);
    });
};

LoxoneLightbulb.prototype._setBrightnessValue = function(value, callback) {
    var loxone = this.loxone;
    var input = this.input;
    var accessory = this;

    loxone.set(input, value, function(setValue) {
        if (setValue == undefined) {
            accessory.log.error("Brightness " + accessory.name + " is undefined when setting value");
            callback(new Error("Could not set value for " + input + " to " + value));
            return;
        }
        accessory.log("Set brightness of " + accessory.name + " to ", value);
        callback();
    });
};

LoxoneLightbulb.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneLightbulb;
