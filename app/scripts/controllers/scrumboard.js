'use strict';

/**
 * @ngdoc controller
 * @name ScrumboardCtrl
 * @description
 * # ScrumboardCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('ScrumboardCtrl', function ($scope, Scrumboard) {

	/* global $ */

	var totalcolumns = 0;
	var keyTrap = null;
	var currentTheme = "bigcards";

	function onCardChange(id, text) {
		$("#" + id).children('.content:first').text(text);
		var card = Scrumboard.cards.filter(function (obj) {
			return obj.id === id;
		})[0];

		card.text = text;
		Scrumboard.update(card);
	}

	function moveCard(id, position) {
		var card = $("#" + id);
		card.animate({
			left: position.left + "px",
			top: position.top + "px"
		}, 500);
		var c = Scrumboard.cards.filter(function (obj) {
			return obj.id === id;
		})[0];

		c.x = position.left;
		c.y = position.top;

		Scrumboard.update(c);
	}

	function addSticker(cardId, stickerId) {

		var stickerContainer = $('#' + cardId + ' .filler');

		if (stickerId === "nosticker") {
			stickerContainer.html("");
			return;
		}

		if (Array.isArray(stickerId)) {
			for (var i in stickerId) {
				stickerContainer.prepend('<img src="images/stickers/' + stickerId[i] +
					'.png">');
			}
		} else {
			if (stickerContainer.html().indexOf(stickerId) < 0) {
				stickerContainer.prepend('<img src="images/stickers/' + stickerId + '.png">');
			}
		}

	}

	function deleteCard(id) {
		var card = Scrumboard.cards.filter(function (obj) {
			return obj.id === id;
		})[0];

		Scrumboard.del(card);
	}

	function drawNewCard(id, text, x, y, rot, colour, sticker, animationspeed) {

		var h = '<div id="' + id + '" class="card ' + colour +
			' draggable" style="-webkit-transform:rotate(' + rot +
			'deg);"><img src="images/icons/token/Xion.png" class="card-icon delete-card-icon" /><img class="card-image" src="images/' +
			colour + '-card.png"><div id="content:' + id +
			'" class="content stickertarget droppable">' +
			text + '</div><span class="filler"></span></div>';

		var card = $(h);
		card.appendTo('#board');

		card.draggable({
			snap: false,
			snapTolerance: 5,
			containment: [0, 0, 2000, 2000],
			stack: ".card",
			start: function () {
				keyTrap = null;
			},
			drag: function (event, ui) {
				if (keyTrap === 27) {
					ui.helper.css(ui.originalPosition);
					return false;
				}
			},
			handle: "div.content"
		});

		//After a drag:
		card.bind("dragstop", function (event, ui) {
			if (keyTrap === 27) {
				keyTrap = null;
				return;
			}

			moveCard(id, ui.position);
		});

		card.children(".droppable").droppable({
			accept: '.sticker',
			drop: function (event, ui) {
				var stickerId = ui.draggable.attr("id");
				var cardId = $(this).parent().attr('id');

				var card = Scrumboard.cards.filter(function (obj) {
					return obj.id === cardId;
				})[0];

				if (card.sticker) {
					card.sticker.push(stickerId);
				} else {
					card.sticker = [stickerId];
				}
				Scrumboard.update(card);
				addSticker(cardId, stickerId);

				//remove hover state to everything on the board to prevent
				//a jquery bug where it gets left around
				$('.card-hover-draggable').removeClass('card-hover-draggable');
			},
			hoverClass: 'card-hover-draggable'
		});

		var speed = Math.floor(Math.random() * 1000);
		if (typeof (animationspeed) !== 'undefined') {
			speed = animationspeed;
		}

		var startPosition = $("#create-card").position();

		card.css('top', startPosition.top - card.height() * 0.5);
		card.css('left', startPosition.left - card.width() * 0.5);

		card.animate({
			left: x + "px",
			top: y + "px"
		}, speed);

		card.hover(
			function () {
				$(this).addClass('hover');
				$(this).children('.card-icon').fadeIn(10);
			},
			function () {
				$(this).removeClass('hover');
				$(this).children('.card-icon').fadeOut(150);
			}
		);

		card.children('.card-icon').hover(
			function () {
				$(this).addClass('card-icon-hover');
			},
			function () {
				$(this).removeClass('card-icon-hover');
			}
		);

		card.children('.delete-card-icon').click(
			function () {
				$("#" + id).remove();
				//notify server of delete
				deleteCard(id);
			}
		);

		card.children('.content').editable(function (value) {
			onCardChange(id, value);
			return (value);
		}, {
			type: 'textarea',
			submit: 'OK',
			style: 'inherit',
			cssclass: 'card-edit-form',
			placeholder: 'Double Click to Edit.',
			onblur: 'submit',
			event: 'dblclick', //event: 'mouseover'
		});

		//add applicable sticker
    if (sticker !== null){
		addSticker(id, sticker);}
	}

	function randomCardColour() {
		var colours = ['yellow', 'green', 'blue', 'white'];

		var i = Math.floor(Math.random() * colours.length);

		return colours[i];
	}

	//----------------------------------
	// cols
	//----------------------------------

	function onColumnChange(id, text) {

		var index = parseInt(id.slice(4)) - 1;

		Scrumboard.columns.list[index] = text;
		Scrumboard.update(Scrumboard.columns);
	}

	function drawNewColumn(columnName) {
		var cls = "col";
		if (totalcolumns === 0) {
			cls = "col first";
		}

		$('#icon-col').before('<td class="' + cls +
			'" width="10%" style="display:none"><h2 id="col-' + (totalcolumns + 1) +
			'" class="editable">' + columnName + '</h2></td>');

		$('.editable').editable(function (value) {
			onColumnChange(this.id, value);
			return (value);
		}, {
			style: 'inherit',
			cssclass: 'card-edit-form',
			type: 'textarea',
			placeholder: 'New',
			onblur: 'submit',
			width: '',
			height: '',
			xindicator: '<img src="images/ajax-loader.gif">',
			event: 'dblclick', //event: 'mouseover'
		});

		$('.col:last').fadeIn(1500);

		totalcolumns++;
	}

	function displayRemoveColumn() {
		if (totalcolumns <= 0) {
			return false;
		}

		$('.col:last').fadeOut(150,
			function () {
				$(this).remove();
			}
		);

		totalcolumns--;
	}

	function changeThemeTo(theme) {
		currentTheme = theme;
		$("link[title=cardsize]").attr("href", "styles/" + theme + ".css");
	}

	$(".sticker").draggable({
		revert: true,
		zIndex: 1000
	});

	$('#marker').draggable({
		axis: 'x',
		containment: 'parent'
	});

	$('#eraser').draggable({
		axis: 'x',
		containment: 'parent'
	});

	function deleteColumns(next, columnArray) {
		//delete all existing columns:
		$('.col').fadeOut('slow', next(columnArray));
	}

	function initColumns(columnArray) {
		totalcolumns = 0;

		$('.col').remove();

		for (var i in columnArray) {
			var column = columnArray[i];

			drawNewColumn(column);
		}
	}

	function initCards(cardArray) {
		//first delete any cards that exist
		$('.card').remove();

		for (var i in cardArray) {
			var card = cardArray[i];

			drawNewCard(
				card.id,
				card.text,
				card.x,
				card.y,
				card.rot,
				card.colour,
				card.sticker,
				0
			);
		}
	}

	function init() {
		if (Scrumboard.columns.list && Scrumboard.columns.list.length) {
			var columnArray = Scrumboard.columns.list;
			deleteColumns(initColumns, columnArray);
		}

		if (Scrumboard.cards) {
			console.log(Scrumboard.cards);
			initCards(Scrumboard.cards);
		}
	}

	////////////
	//	scope //
	////////////

	$scope.addColumn = function () {
		if (totalcolumns >= 8) {
			return false;
		}
		drawNewColumn('New');
		Scrumboard.columns.list.push('New');
		Scrumboard.update(Scrumboard.columns);
	};

	$scope.deleteColumn = function () {
		if (totalcolumns <= 0) {
			return false;
		}

		displayRemoveColumn();
		Scrumboard.columns.list.pop();
		Scrumboard.update(Scrumboard.columns);
	};

	$scope.addCard = function () {
		var rot = Math.random() * 10 - 5; //add a bit of random rotation (+/- 10deg)
		var id = 'card-' + Math.round(Math.random() * 99999999); //is this big enough to assure uniqueness?
		var text = 'Double click to edit';
		var x = 58;
		var y = $('div.board-outline').height(); // hack - not a great way to get the new card coordinates, but most consistant ATM
		var colour = randomCardColour();
		drawNewCard(id, text, x, y, rot, colour);
		var card = {
			id,
			text,
			x,
			y,
			rot,
			colour,
			attributes: {
				type: 'Scrumboard-card'
			}
		};

		Scrumboard.add(card);
	};

	$scope.changeStyle = function () {
		if (currentTheme === "bigcards") {
			changeThemeTo('smallcards');
		} else if (currentTheme === "smallcards") {
			changeThemeTo('bigcards');
		}
	};

	Scrumboard.getColumns();
	Scrumboard.getCards();
	Scrumboard.registerObserverCallback(init);

});
