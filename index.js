"use strict";

var Service, Characteristic;

module.exports = function(homebridge) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerPlatform("homebridge-loxone", "Loxone", LoxonePlatform);
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

        var platform = this;

        //create array of accessories
        var myAccessories = [];

        var config = {
            "name": "Temperatuur Keuken",
            "input": "AWI3"
        };

        myAccessories.push(new LoxoneTemperature(this.log, config, platform));

        // if done, return the array to callback function
        callback(myAccessories);
    }
};


function LoxoneTemperature(log, config, platform) {
    this.log = log;
    this.name = config.name;
    this.model = "Loxone";
    this.type = "Temperature";
    this.platform = platform;

    console.log(platform);

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