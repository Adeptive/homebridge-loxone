var inherits = require('util').inherits;

var Service, Characteristic;

/*
 Characteristic.SecuritySystemCurrentState.STAY_ARM = 0;
 Characteristic.SecuritySystemCurrentState.AWAY_ARM = 1;
 Characteristic.SecuritySystemCurrentState.NIGHT_ARM = 2;
 Characteristic.SecuritySystemCurrentState.DISARMED = 3;
 Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED = 4;
 */

function LoxoneAlarm(config, platform, hap) {
    this.log = platform.log;
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;
    this.output = config.output;

    this._service = new Service.SecuritySystem(this.name);
    this._service.getCharacteristic(Characteristic.SecuritySystemCurrentState)
        .on('get', this._getSecuritySystemCurrentState.bind(this));

}

LoxoneAlarm.prototype._getSecuritySystemCurrentState = function(callback) {
    var accessory = this;
    /*this.loxone.getValue(this.output, function(value) {
        if (value == undefined) {
            accessory.log.error(accessory.name + " is undefined when getting value");
            callback(new Error("Could not get value for " + this.output));
            return;
        }

        var on = value != '0';

        accessory.log(accessory.name + " is " + value, on);
        callback(null, on);
    });*/

    callback(null, Characteristic.SecuritySystemCurrentState.DISARMED);
};

LoxoneAlarm.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneAlarm;