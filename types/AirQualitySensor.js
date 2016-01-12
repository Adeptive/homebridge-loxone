var inherits = require('util').inherits;

var Service, Characteristic;

function LoxoneAirQuality(config, platform, hap) {
    this.log = platform.log;
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;

    this._service = new Service.AirQualitySensor(this.name);
    this._service.getCharacteristic(Characteristic.AirQuality)
        .on('get', this._getGroup.bind(this));

    this._service.getCharacteristic(Characteristic.AirParticulateDensity)
        .on('get', this._getValue.bind(this));
}

LoxoneAirQuality.prototype._getGroup = function(callback) {
    this.loxone.getValue(this.input, function(value) {

        if (value == undefined) {
            callback(new Error("Could not get value for " + this.input));
            return;
        }

        if (value >= 1100) {
            callback(null, Characteristic.AirQuality.POOR);
        } else if (value >= 950) {
            callback(null, Characteristic.AirQuality.INFERIOR);
        } else if (value >= 800) {
            callback(null, Characteristic.AirQuality.FAIR);
        } else if (value >= 650) {
            callback(null, Characteristic.AirQuality.GOOD);
        } else {
            callback(null, Characteristic.AirQuality.EXCELLENT);
        }

    });
};

LoxoneAirQuality.prototype._getValue = function(callback) {
    var accessory = this;
    this.loxone.getValue(this.input, function(value) {

        if (value == undefined) {
            callback(new Error("Could not get value for " + this.input));
            return;
        }

        accessory.log(accessory.name + " is " + value);

        callback(null, value * 1);

    });
};

LoxoneAirQuality.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneAirQuality;