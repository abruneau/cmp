'use strict';

/**
 * @ngdoc service
 * @name cmpApp.evernoteOsa
 * @description
 * # evernoteOsa
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('evernoteOsa', function () {
	var self = this;

	var getNoteList = function (notebook) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += "var matches = Evernote.findNotes('notebook:" + notebook + "');\n";
		cmd += "var result = [];\n";
		cmd += "for (i = 0; i < matches.length; i++) {\n";
		cmd += "\tvar out = {\n";
		cmd += "\t\tnoteLink: matches[i].noteLink(),\n";
		cmd += "\t\ttitle: matches[i].title(),\n";
		cmd += "\t\tcreationDate: matches[i].creationDate().toString()\n";
		cmd += "\t}\n";
		cmd += "\tresult.push(out);\n";
		cmd += "}\n";
		cmd += "return result;})()";

		return cmd;
	};

	var getNoteInfo = function (link) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += "var matche = Evernote.findNote('" + link + "');\n";
		cmd += "var out = {\n";
		cmd += "\tnoteLink: matche.noteLink(),\n";
		cmd += "\ttitle: matche.title(),\n";
		cmd += "\tcreationDate: matche.creationDate().toString()\n";
		cmd += "}\n";
		cmd += "return out;})()";

		return cmd;
	};

	var getHtml = function (link) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += "return Evernote.findNote('" + link + "'). htmlContent();";
		cmd += "})()";
		return cmd;
	};

	self.getNoteList = getNoteList;
	self.getNoteInfo = getNoteInfo;
	self.getHtml = getHtml;

	return self;
});
