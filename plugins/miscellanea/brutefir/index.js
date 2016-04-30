'use strict';
var libQ = require('kew');
var libNet = require('net');
var fs=require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var telnet = require('telnet-client');
var connection = new telnet();

// Define the Brutefir class
module.exports = Brutefir;
function Brutefir(context) {
	var self = this;
	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;	
}


/*
 * This method can be defined by every plugin which needs to be informed of the startup of Volumio.
 * The Core controller checks if the method is defined and executes it on startup if it exists.
 */
Brutefir.prototype.onVolumioStart = function () {
	var self = this;
};
Brutefir.prototype.onStart = function() {
	var self = this;
	//Perform startup tasks here
	//Perform startup tasks here
	exec("brutefir", function (error, stdout, stderr) {
		if (error !== null) {
			self.commandRouter.pushConsoleMessage('The following error occurred while starting Brutefir: ' + error);
		}
		else {
			self.commandRouter.pushConsoleMessage('Brutefir Daemon Started');
		}
	});
	var setting = self.config.get('coef31');
	var nHost = self.config.get('nHost');
	var nPort = self.confug.get('nPort');
//,'coef63','coef125','coef250','coef500','coef1000','coef2000','coef4000','coef8000','coef16000');

	var params = {
	host: 'nHost',
	port: 'nPort',
	shellPrompt: '/ # ',
	timeout: 30000,
	// removeEcho: 4
	};

	//here we compose the eq cmd
	var cmd = 'lmc eq 0 mag 31/'+ setting;
//+',63/'+coef63\.5+ ',125/'+coef125+ ',250/'+coef250+ ',500/'+coef500 + ',1000/'+coef1000 + ',2000/'+coef2000 + ',4000/'+coef4000 + ',8000/'+coef8000 + ',16000/'+coef16000);

	//here we send the cmd via telnet
	connection.on('ready', function(prompt) {
	connection.exec(cmd, function(err, response) {
	console.log(response);
	});
	});

	connection.on('timeout', function() {
	console.log('socket timeout!')
	connection.end();
	});

	connection.on('close', function() {
	console.log('connection closed');
	});
	connection.connect(params);
	
	}



Brutefir.prototype.onStop = function () {
	var self = this;
	//Perform startup tasks here
};

Brutefir.prototype.onRestart = function () {
	var self = this;
	//Perform startup tasks here
};

Brutefir.prototype.onInstall = function () {
	var self = this;
	//Perform your installation tasks here
};

Brutefir.prototype.onUninstall = function () {
	var self = this;
	//Perform your installation tasks here
};

Brutefir.prototype.getUIConfig = function () {
	var self = this;
	var uiconf = fs.readJsonSync(__dirname + '/UIConfig.json');
	var value;


	uiconf.sections[0].content[0].value = config.get('leftfilter');
	uiconf.sections[0].content[1].value = config.get('rightfilter');
//	uiconf.sections[0].content[2].value = config.get('magnitude');
	uiconf.sections[1].content[0].value = config.get('coef31');
	uiconf.sections[1].content[1].value = config.get('coef63');
	uiconf.sections[1].content[2].value = config.get('coef125');
	uiconf.sections[1].content[3].value = config.get('coef250');
	uiconf.sections[1].content[4].value = config.get('coef500');
	uiconf.sections[1].content[5].value = config.get('coef1000');
	uiconf.sections[1].content[6].value = config.get('coef2000');
	uiconf.sections[1].content[7].value= config.get('coef4000');
	uiconf.sections[1].content[8].value = config.get('coef8000');
	uiconf.sections[1].content[9].value = config.get('coef16000');


	return uiconf;
};

Brutefir.prototype.setUIConfig = function (data) {
	var self = this;
	var uiconf=fs.readJsonSync(__dirname+'/UIConfig.json');
	//Perform your installation tasks here
};

Brutefir.prototype.getConf = function (varName) {
	var self = this;
	//Perform your installation tasks here
};

Brutefir.prototype.setConf = function (varName, varValue) {
	var self = this;
	
	Brutefir.prototype.createBrutefirFile = function () {
    var self = this;

    var defer=libQ.defer();


    try {

        fs.readFile(__dirname + "/brutefir.conf.tmpl", 'utf8', function (err, data) {
            if (err) {
                defer.reject(new Error(err));
                return console.log(err);
            }
		
            var conf1 = data.replace("${leftfilter}", config.get('leftfilter'));
            var conf2 = data.replace("${rightfilter}", config.get('rightfilter'));

            fs.writeFile("/home/volumio/.brutefir_config_essai", conf2, 'utf8', function (err) {
                if (err)
                    defer.reject(new Error(err));
                else defer.resolve();
            });


        });


    }
    catch (err) {


    }

    return defer.promise;

};

	Brutefir.prototype.saveBrutefirconfig = function (data) {
    var self = this;

    var defer = libQ.defer();

    self.config.set('leftfilter', data['leftfilter']);
    self.config.set('rightfilter', data['rightfilter']);
    self.config.set('coef31', data['coef31']);
    self.config.set('coef63', data['coef63']);
    self.config.set('coef125', data['coef125']);
    self.config.set('coef250', data['coef250']);
    self.config.set('coef500', data['coef500']);
    self.config.set('coef1000', data['coef1000']);
    self.config.set('coef2000', data['coef2000']);
    self.config.set('coef4000', data['coef4000']);
    self.config.set('coef8000', data['coef8000']);
    self.config.set('coef16000', data['coef16000']);

    self.rebuildBrutefirAndRestartDaemon()
        .then(function(e){
            self.commandRouter.pushToastMessage('success', "Configuration update", 'The configuration has been successfully updated');
            defer.resolve({});
        })
        .fail(function(e)
        {
            defer.reject(new Error());
        })


    return defer.promise;

};
	//Perform your installation tasks here
};

//Optional functions exposed for making development easier and more clear
Brutefir.prototype.getSystemConf = function (pluginName, varName) {
	var self = this;
	//Perform your installation tasks here
};

Brutefir.prototype.setSystemConf = function (pluginName, varName) {
	var self = this;
	//Perform your installation tasks here
}

Brutefir.prototype.getAdditionalConf = function () {
	var self = this;
	//Perform your installation tasks here
}

Brutefir.prototype.setAdditionalConf = function () {
	var self = this;
	//Perform your installation tasks here
}
