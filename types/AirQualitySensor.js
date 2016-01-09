var Service, Characteristic;

function LoxoneAirQuality(config, platform, hap) {
    this.log = platform.log;
    this.type = "AirQualitySensor";
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;

    this._service = new Service.AirQualitySensor(this.name);
    this._service.getCharacteristic(Characteristic.AirQuality)
        .on('get', this._getValue.bind(this));
}

LoxoneAirQuality.prototype._getValue = function(callback) {
    this.loxone.getValue(this.input, function(value) {

        if (value >= 1100) {
            callback(Characteristic.AirQuality.POOR);
        } else if (value >= 950) {
            callback(Characteristic.AirQuality.INFERIOR);
        } else if (value >= 800) {
            callback(Characteristic.AirQuality.FAIR);
        } else if (value >= 650) {
            callback(Characteristic.AirQuality.GOOD);
        } else {
            callback(Characteristic.AirQuality.EXCELLENT);
        }

    });
};

LoxoneAirQuality.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneAirQuality;