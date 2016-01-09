#homebridge-loxone

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
    					"type": "TemperatureSensor",
    					"name": "Temperatuur bureau",
    					"input": "AWI3"
    				}
    			],
    			"HumiditySensors":[
    				{
    					"type": "HumiditySensor",
    					"name": "Luchtvochtigheid badkamer",
    					"input": "AI_SEN3-RH"
    				}
    			],
    			"AirQualitySensors":[
    				{
    					"type": "AirQualitySensor",
    					"name": "Luchtkwaliteit leefruimte",
    					"input": "AI_SEN2-CO2"
    				}
    			],
    			"Outlets":[
    				{
    					"type": "Outlet",
    					"name": "Kerstboom",
    					"input": "I_I6",
    					"output": "Q_I6"
    				}
    			]
    
    		}
    	]

```