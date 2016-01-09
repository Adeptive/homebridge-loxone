"use strict";

var LoxoneAPI = require('loxone-nodejs');

var Service, Characteristic;

module.exports = function(homebridge) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    //console.log(Service);

    homebridge.registerPlatform("homebridge-loxone", "Loxone", LoxonePlatform);
};

function LoxonePlatform(log, config) {
    this.log = log;
    this.debug = log.debug;
    this.ip_address = config['ip_address'];
    this.username = config['username'];
    this.password = config['password'];

    this.loxone = new LoxoneAPI({
        ip: "10.0.1.25",
        debug: false,
        username: "admin",
        password: "il7ect8it0jerj"
    });
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
    this.input = config.input;
    this.loxone = platform.loxone;

    this._service = new Service.TemperatureSensor(this.name);
    this._service.getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this._getValue.bind(this));

        /*.on('get', function(callback) {
            platform.loxone.getValue(config.input, function(value) {
                callback(null, value * 1);
            });
        });*/
}

LoxoneTemperature.prototype._getValue = function(callback) {
    this.loxone.getValue(this.input, function(value) {
        callback(null, value * 1);
    });

    /*this.log("Setting switch to " + on);

    if (on) {
        setTimeout(function() {
            this._service.setCharacteristic(Characteristic.On, false);
        }.bind(this), 1000);
    }*/

    //callback();
};

LoxoneTemperature.prototype.getServices = function() {
    return [this._service];
};

/*LoxoneTemperature.prototype._setOn = function(on, callback) {

    this.log("Setting switch to " + on);

    //this.loxone.getValue()

    if (on) {
        setTimeout(function() {
            this._service.setCharacteristic(Characteristic.On, false);
        }.bind(this), 1000);
    }

    callback();
};*/