"use strict";

var LoxoneAPI = require('loxone-nodejs');
var LoxoneTemperatureSensor = require('./types/TemperatureSensor');

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
    this.accessoriesList = config['accessories'];

    this.loxone = new LoxoneAPI({
        ip: config['ip_address'],
        debug: false,
        username: config['username'],
        password: config['password']
    });
}



LoxonePlatform.prototype = {
    accessories: function(callback) {
        this.log("Fetching LoxonePlatform accessories.");

        var platform = this;

        //create array of accessories
        var myAccessories = [];

        for(var i in platform.accessoriesList) {
            var config = platform.accessoriesList[i];

            var accessory = platform.getAccessory(config, platform);
            if (accessory != undefined) {
                myAccessories.push(accessory);
            } else {
                this.log.error("Could not initialize accessory", config);
            }
        }

        // if done, return the array to callback function
        callback(myAccessories);
    }
};

LoxonePlatform.prototype.getAccessory = function(accessory, platform) {
    if (accessory.type == 'TemperatureSensor') {
        return new LoxoneTemperatureSensor(accessory, platform, Service, Characteristic);
    }
    return undefined;
};

LoxonePlatform.prototype.getInformationService = function(accessory) {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Name, accessory.name)
        .setCharacteristic(Characteristic.Manufacturer, 'Loxone')
        .setCharacteristic(Characteristic.Model, '1.0.0')
        .setCharacteristic(Characteristic.SerialNumber, accessory.input);
    return informationService;
};