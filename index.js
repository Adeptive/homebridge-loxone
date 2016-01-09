"use strict";

var LoxoneAPI = require('loxone-nodejs');
var LoxoneTemperatureSensor = require('./types/TemperatureSensor');
var LoxoneHumiditySensor = require('./types/HumiditySensor');
var LoxoneAirQuality = require('./types/AirQualitySensor');
var LoxoneOutlet = require('./types/Outlet');

var Service, Characteristic, HAP;

module.exports = function(homebridge) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    HAP = homebridge.hap;

    //console.log(Service);

    homebridge.registerPlatform("homebridge-loxone", "Loxone", LoxonePlatform);
};

var sensorsTypes = [
    'TemperatureSensors',
    'HumiditySensors',
    'AirQualitySensors',
    'Outlets'
];

function LoxonePlatform(log, config) {
    this.log = log;
    this.debug = log.debug;
    this.config = config;

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

        for (var j in sensorsTypes) {
            var type = sensorsTypes[j];

            var temperatureSensors = platform.config[type];
            if (temperatureSensors != undefined) {
                for(var i in temperatureSensors) {
                    var config = temperatureSensors[i];

                    var accessory = platform.getAccessory(config, platform, type);
                    if (accessory != undefined) {
                        myAccessories.push(accessory);
                    } else {
                        this.log.error("Could not initialize accessory", config);
                    }
                }
            }
        }

        // if done, return the array to callback function
        callback(myAccessories);
    }
};

LoxonePlatform.prototype.getAccessory = function(accessory, platform, type) {
    if (type == 'TemperatureSensor') {
        return new LoxoneTemperatureSensor(accessory, platform, HAP);
    } else if (type == 'HumiditySensor') {
        return new LoxoneHumiditySensor(accessory, platform, HAP);
    } else if (type == 'AirQualitySensor') {
        return new LoxoneAirQuality(accessory, platform, HAP);
    } else if (type == 'Outlet') {
        return new LoxoneOutlet(accessory, platform, HAP);
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