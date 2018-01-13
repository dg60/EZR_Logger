'use strict';

// set up ======================================================================
var http = require('http');
var parseString = require('xml2js').parseString;
//==============================================================================
var output = '';
var xml = "";


module.exports = {
    start: function (data) {
        console.info('Logger run');

        //Data from heatarea
        var _heatarea = {
            HEATAREA_NAME: "",
            T_ACTUAL: "",
            T_TARGET: "",
            ACTOR: ''
        };

        var _heatarea0 = Object.create(_heatarea);
        var _heatarea1 = Object.create(_heatarea);
        var _heatarea2 = Object.create(_heatarea);
        var _heatarea3 = Object.create(_heatarea);
        var _heatarea4 = Object.create(_heatarea);
        var _heatarea5 = Object.create(_heatarea);
        var _heatarea6 = Object.create(_heatarea);
        var _heatarea7 = Object.create(_heatarea);

        //EZR data object
        var ezr = {
            id: 'temperature' ,
            DATETIME: {},
            created: new Date(),
            offset: new Date().getTimezoneOffset(),
            heatarea: [_heatarea0, _heatarea1, _heatarea2, _heatarea3, _heatarea4, _heatarea5, _heatarea6, _heatarea7] // 8 heating areas
        };

        //Get the data from the controller
        http.get({
            hostname: '192.168.1.100',
            port: 80,
            path: '/data/static.xml',
            headers: { 'Cache-Control': 'no-cache' },
            agent: false  // create a new agent just for this one request
        }, (res) => {
        
            const {statusCode} = res;
            let error;

            if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                                  `Status Code: ${statusCode}`);
            }
              
            if (error) {
                console.error(error.message);
                // consume response data to free up memory
                res.resume();
                return;
            }
            
            res.on('data', function (chunk) {
                output += chunk;
                xml = output;
                
            });

            res.on('end', function () {
                // Init
                output = '';

                parseString(xml, function (err, result) {

                    if (err) {
                        console.error('Error parsing XML File !!!')
                    }
                    else {
                        ezr.DATETIME = result.Devices.Device[0].DATETIME;

                        for (var index = 0; index < result.Devices.Device[0].HEATAREA.length; index++) {
                            ezr.heatarea[index].T_ACTUAL = result.Devices.Device[0].HEATAREA[index].T_ACTUAL;
                            ezr.heatarea[index].T_TARGET = result.Devices.Device[0].HEATAREA[index].T_TARGET;
                            ezr.heatarea[index].HEATAREA_NAME = result.Devices.Device[0].HEATAREA[index].HEATAREA_NAME;
                            ezr.heatarea[index].ACTOR = result.Devices.Device[0].HEATCTRL[index].ACTOR;

                            
                            console.log('Name: ' + ezr.heatarea[index].HEATAREA_NAME);
                            console.log('Target: ' + ezr.heatarea[index].T_TARGET);
                            console.log('Actual: ' + ezr.heatarea[index].T_ACTUAL);
                            console.log('Actor: ' + ezr.heatarea[index].ACTOR);
                            console.log('index: ' + index);
                            console.log('created: ' + new Date());
                            console.log('TIMESTAMP_EZR: ' + ezr.DATETIME);
                        }
                    }
                    // Init XML 
                    xml = '';

                });

            });
        }).on('error',(e) =>{
           console.error('Got error: ${e.message}'); 
        });

        // Save the data
        data.push(ezr);
        return data;

    },
    stop: function () {

    }
};