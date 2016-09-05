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

	//////////////
	// Notebook //
	//////////////

	/**
	 * Check if a notebook exists
	 * @param  {String} name
	 * @return {String}      command to execute
	 */
	var notebookExists = function (name) {
		var cmd = "";

		cmd += 'tell application "Evernote"\n';
		cmd += '\tactivate\n';
		cmd += '\tdelay (2)\n';
		cmd += '\tnotebook named "' + name + '" exists\n';
		cmd += 'end tell';

		return cmd;
	};

	/**
	 * Create a notebook
	 * @param  {String} name
	 * @return {String}      command to execute
	 */
	var createNotebook = function (name) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += "Evernote.createNotebook(\"" + name.replace(/'/g, "\\'") + "\");\n";
		cmd += "})()";

		return cmd;
	};

	var getNoteList = function (notebook) {

		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += "var matches = Evernote.findNotes(\'notebook:\"" + notebook.replace(/'/g, "\\'") + "\"\');\n";
		cmd += "var result = [];\n";
		cmd += "for (i = 0; i < matches.length; i++) {\n";
		cmd += "\tvar out = {\n";
		cmd += "\t\tnoteLink: matches[i].noteLink(),\n";
		cmd += "\t\ttitle: matches[i].title(),\n";
		cmd += "\t\tcreationDate: matches[i].creationDate().toString(),\n";
		cmd += "\t\tnotebook: matches[i].notebook().name()\n";
		cmd += "\t}\n";
		cmd += "\tresult.push(out);\n";
		cmd += "}\n";
		cmd += "return result;})()";

		return cmd;
	};

	//////////
	// Note //
	//////////

	function makeQueryString(note) {
		var queryString = "";
		if (note.title) {
			queryString += "intitle:\"" + note.title + "\"";
		}
		if (note.notebook) {
			queryString += " notebook:\"" + note.notebook + "\"";
		}
		return queryString;
	}

	function findNote(note) {
		var cmd = "";
		if (note.noteLink) {
			cmd += "var matche = Evernote.findNote(\"" + note.noteLink + "\");\n";
		} else {
			var queryString = makeQueryString(note);
			cmd += "var matches = Evernote.findNotes(\'" + queryString.replace(/'/g, "\\'") + "\');\n";
			cmd += "if (matches) { var matche = matches[0]; } else { return 'Note not find'}\n";
		}
		return cmd;
	}

	var getNoteInfo = function (note) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += findNote(note);
		cmd += "var out = {\n";
		cmd += "\tnoteLink: matche.noteLink(),\n";
		cmd += "\ttitle: matche.title(),\n";
		cmd += "\tcreationDate: matche.creationDate().toString()\n";
		cmd += "}\n";
		cmd += "return out;})()";

		return cmd;
	};

	var getHtml = function (note) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += findNote(note);
		cmd += "return matche.htmlContent();\n";
		cmd += "})()";

		return cmd;
	};

	var updateHtml = function (note, newHtml) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += findNote(note);
		cmd += "var html = \"" + newHtml.toString().replace(/\r?\n|\r/g, '').replace(/\"/g, '&quot;') + "\";\n";
		cmd += "matche.htmlContent = html;\n";
		cmd += "})()";
		return cmd;
	};

	var createNote = function (title, notebook) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += "Evernote.createNote({withHtml: '<h1>Content</h1>', title: '" + title + "', notebook: \"" + notebook + "\" });";
		cmd += "Evernote.synchronize()";
		cmd += "})()";

		return cmd;
	};

	var createNoteWithHtml = function (title, notebook, html) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += "Evernote.createNote({withHtml: '" + html + "', title: '" + title + "', notebook: \"" + notebook + "\" });";
		cmd += "Evernote.synchronize()";
		cmd += "})()";

		return cmd;
	};

	var deleteNote = function (note) {
		var cmd = "";

		cmd += "(function(){Evernote = Application('Evernote');\n";
		cmd += findNote(note);
		cmd += "matche.delete();\n";
		cmd += "})()";

		return cmd;
	};

	var openNote = function (note) {
		var cmd = "";

		cmd += 'tell application "Evernote"\n';
		if (note.noteLink) {
			cmd += "\tset note1 to find note \"" + note.noteLink.replace(/\"/g, "\\\"") + "\"\n";
		} else {
			var queryString = makeQueryString(note);
			cmd += "\tset matches to find notes \"" + queryString.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"\n";
			cmd += "\tset note1 to item 1 of matches\n";
		}
		cmd += '\topen note window with note1\n';
		cmd += 'end tell';

		console.log(cmd);

		return cmd;
	};

	self.notebookExists = notebookExists;
	self.createNotebook = createNotebook;
	self.getNoteList = getNoteList;
	self.getNoteInfo = getNoteInfo;
	self.getHtml = getHtml;
	self.updateHtml = updateHtml;
	self.createNote = createNote;
	self.createNoteWithHtml = createNoteWithHtml;
	self.deleteNote = deleteNote;
	self.openNote = openNote;

	return self;
});
