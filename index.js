"use strict";

var Service, Characteristic;

module.exports = function(homebridge) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    //homebridge.registerAccessory("homebridge-loxone", "Loxone", Loxone);

    homebridge.registerPlatform("homebridge-loxone", "Loxone", LoxonePlatform);
};

function LoxonePlatform(log, config) {
    this.log = log;
    this.debug = log.debug;
    this.ip_address = config['ip_address'];
    this.username = config['username'];
    this.password = config['password'];
}

LoxonePlatform.prototype = {
    accessories: function(callback) {
        this.log("Fetching LoxonePlatform accessories.");

        //create array of accessories
        var myAccessories = [];

        this.log(this.ip_address);

        myAccessories.push(new Loxone(this.log, this));

        // if done, return the array to callback function
        callback(myAccessories);
    }
};



function Loxone(log, config) {
    this.log = log;
    this.name = config.name;

    this._service = new Service.Switch(this.name);
    this._service.getCharacteristic(Characteristic.On)
        .on('set', this._setOn.bind(this));
}

Loxone.prototype.getServices = function() {
    return [this._service];
};

Loxone.prototype._setOn = function(on, callback) {

    this.log("Setting switch to " + on);

    if (on) {
        setTimeout(function() {
            this._service.setCharacteristic(Characteristic.On, false);
        }.bind(this), 1000);
    }

    callback();
};