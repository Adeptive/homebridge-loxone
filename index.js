"use strict";

var Service, Characteristic;

module.exports = function(homebridge) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerPlatform("homebridge-loxone", "Loxone", LoxonePlatform);

    homebridge.registerAccessory("homebridge-loxone", "LoxoneTemperature", LoxoneTemperature);
};

function LoxonePlatform(log, config) {
    this.log = log;
    this.debug = log.debug;
    this.ip_address = config['ip_address'];
    this.username = config['username'];
    this.password = config['password'];

    console.log(config);
}

LoxonePlatform.prototype = {
    accessories: function(callback) {
        this.log("Fetching LoxonePlatform accessories.");

        //create array of accessories
        var myAccessories = [];

        this.log(this.ip_address);

        //myAccessories.push(new Loxone(this.log, this));

        // if done, return the array to callback function
        callback(myAccessories);
    }
};



function LoxoneTemperature(log, config) {
    this.log = log;
    this.name = config.name;

    this._service = new Service.Switch(this.name);
    this._service.getCharacteristic(Characteristic.On)
        .on('set', this._setOn.bind(this));
}

LoxoneTemperature.prototype.getServices = function() {
    return [this._service];
};

LoxoneTemperature.prototype._setOn = function(on, callback) {

    this.log("Setting switch to " + on);

    if (on) {
        setTimeout(function() {
            this._service.setCharacteristic(Characteristic.On, false);
        }.bind(this), 1000);
    }

    callback();
};