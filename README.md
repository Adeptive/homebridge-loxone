#homebridge-loxone

[Loxone](http://www.loxone.com) plugin for [Homebridge](https://github.com/nfarina/homebridge)

Example config.json:

 ```

    
    	"platforms": [
    		{
    			"platform": "Loxone",
    			"name": "Loxone",
    			"ip_address": "",
    			"username": "",
    			"password": "",
    			"TemperatureSensors":[
                    {
                        "name": "Temperature kitchen",
                        "input": "AWI3"
                    }
                ],
                "HumiditySensors":[
                    {
                        "name": "Humidity bathroom",
                        "input": "AI_SEN3-RH"
                    }
                ],
                "AirQualitySensors":[
                    {
                        "name": "Air quality kitchen",
                        "input": "AI_SEN2-CO2"
                    }
                ],
                "Outlets":[
                    {
                        "name": "Socket",
                        "input": "I_I6",
                        "output": "Q_I6"
                    }
                ]
    		}
    	]

```

Supported Device Types:

* Temperature Sensors (input only)
* Humidity Sensors (input only)
* Air Quality Sensors (input only)
* Outlets (input and output)

Fields:

* "name": The name you want to use to control the loxone input or output (required)
* "input": The name of the loxone input
* "output": The name of the output

