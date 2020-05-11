"use strict";

var LoxoneAPI = require('loxone-nodejs');
var LoxoneTemperatureSensor = require('./types/TemperatureSensor');
var LoxoneHumiditySensor = require('./types/HumiditySensor');
//var LoxoneAirQuality = require('./types/AirQualitySensor');
var LoxoneOutlet = require('./types/Outlet');
var LoxoneLightbulb = require('./types/LightBulb');
var LoxoneFan = require('./types/Fan');
var LoxoneAlarm = require('./types/Alarm');

var Service, Characteristic, HAP;

module.exports = function(homebridge) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    HAP = homebridge.hap;

    //console.log(Service);

    homebridge.registerPlatform("homebridge-loxone", "Loxone", LoxonePlatform);
};

var sensorsTypes = {
    'TemperatureSensors': LoxoneTemperatureSensor,
    'HumiditySensors': LoxoneHumiditySensor,
    //'AirQualitySensors': LoxoneAirQuality,
    'Outlets': LoxoneOutlet,
    'LightBulbs': LoxoneLightbulb,
    'Fans': LoxoneFan,
    'Alarms': LoxoneAlarm
};

function LoxonePlatform(log, config) {
    this.log = log;
    this.debug = log.debug;
    this.config = config;

    if (!this.config['ip_address']) throw new Error("You must provide an ip address of your Loxone.");

    this.loxone = new LoxoneAPI({
        ip: config['ip_address'],
        username: config['username'] || 'admin',
        password: config['password'] || 'admin'
        port: config['port'] || '80'
    });
}

LoxonePlatform.prototype = {
    accessories: function(callback) {
        this.log("Fetching LoxonePlatform accessories.");

        var platform = this;

        //create array of accessories
        var myAccessories = [];

        for (var type in sensorsTypes) {
            var AccessoryClass = sensorsTypes[type];

            var accessoriesList = platform.config[type];
            if (accessoriesList != undefined) {
                for(var i in accessoriesList) {
                    var config = accessoriesList[i];

                    var accessory = new AccessoryClass(config, platform, HAP);
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

LoxonePlatform.prototype.getInformationService = function(accessory) {
    var serial = '';
    if (accessory.input != undefined) {
        serial += accessory.input + "-";
    }
    if (accessory.output != undefined) {
        serial += accessory.output + "-";
    }
    serial += 'loxone';

    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Name, accessory.name)
        .setCharacteristic(Characteristic.Manufacturer, 'Loxone')
        .setCharacteristic(Characteristic.Model, '1.0.0')
        .setCharacteristic(Characteristic.SerialNumber, serial);
    return informationService;
};
