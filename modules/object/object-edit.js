/**
 *	modules/object/object-edit.js
 *	Frontend code for general object properties
 *
 *	Copyright Gottfried Haider, Danja Vasiliev 2010.
 *	This source code is licensed under the GNU General Public License.
 *	See the file COPYING for more details.
 */

$(document).ready(function() {
	//
	// register menu items
	//
	
	var rebind = function () {
		$('html').bind('click', function(e) {
			if (e.target == $('body').get(0)) {
				if ($('.glue-selected').length) {
					// deselect when clicking on background
					$.glue.sel.none();
					// prevent the menu from firing
					e.stopImmediatePropagation();
				}
			}
		});
		// trigger menus on click and doubleclick
		var menu_dblclick_timeout = false;
		$('html').bind('click', function(e) {
			// make sure no iframe has focus as this breaks keyboard shortcuts etc
			window.focus();
			// we use 'html' here to give the colorpicker et al a chance to stop the 
			// propagation of the event in 'body'
			if (e.target == $('body').get(0)) {
				if (!$.glue.menu.is_shown()) {
					if (menu_dblclick_timeout) {
						clearTimeout(menu_dblclick_timeout);
						menu_dblclick_timeout = false;
						// show page menu
						$.glue.menu.show('page', e.clientX, e.clientY);
						return false;
					}
					menu_dblclick_timeout = setTimeout(function() {
						menu_dblclick_timeout = false;
						// prevent the new menu from showing when the user wants to 
						// simply clear any open menu
						if ($.glue.menu.prev_menu() == '') {
							// show new menu
							$.glue.menu.show('new', e.clientX, e.clientY);
						}
					}, 300);
				}
			}
		});
	}

	var destroyDialog = function  () {
		$( '#dialog-form').remove();
		$( '.ui-dialog').remove();
		rebind();
	};

	
	var elem;
	elem = $('<img src="'+$.glue.base_url+'modules/object/object-clone.png" alt="btn" title="clone object" width="32" height="32">');
	$(elem).bind('click', function(e) {
		var obj = $(this).data('owner');
		$.glue.backend({ method: 'glue.clone_object', name: $(obj).attr('id') }, function(data) {
			// deselect current object
			$.glue.sel.none();
			var clone = $(obj).clone();
			// set new id
			$(clone).attr('id', data);
			// move object a bit
			$(clone).css('left', ($(obj).position().left+$.glue.grid.x())+'px');
			$(clone).css('top', ($(obj).position().top+$.glue.grid.y())+'px');
			// add to dom and register
			$('body').append(clone);
			$(clone).trigger('glue-pre-clone');
			$.glue.object.register(clone);
			// select new object
			$.glue.sel.select(clone);
			$.glue.object.save(clone);
		});
	});
	// $.glue.contextmenu.register('object', 'object-clone', elem, 1);
	
	elem = $('<img src="'+$.glue.base_url+'modules/object/object-transparency.png" alt="btn" title="change transparency" width="32" height="32">');
	$(elem).bind('glue-menu-activate', function(e) {
		var obj = $(this).data('owner');
		var opacity = parseFloat($(obj).css('opacity'))*100;
		var tip = 'change transparency ('+opacity.toFixed(0)+'%)';
		$(this).attr('title', tip);
	});
	$(elem).bind('mousedown', function(e) {
		var that = this;
		var obj = $(this).data('owner');
		$.glue.slider(e, function(x, y) {
			if (x < -15) {
				x = 1-(Math.abs(x)-15)/300;
			} else if (x < 15) {
				// dead zone
				x = 1;
			} else {
				x = 1-(Math.abs(x)-15)/300;
			}
			if (x < 0) {
				x = 0;
			}
			$(obj).css('opacity', x);
		}, function(x, y) {
			$.glue.object.save(obj);
			// update tooltip (see above)
			$(that).trigger('glue-menu-activate');
		});
		return false;
	});
	// $.glue.contextmenu.register('object', 'object-transparency', elem, 2);
	
	elem = $('<img src="'+$.glue.base_url+'modules/object/object-zindex.png" alt="btn" title="bring object to foreground or background" width="32" height="32">');
	$(elem).bind('mousedown', function(e) {
		var obj = $(this).data('owner');
		var old_z = parseInt($(obj).css('z-index'));
		$.glue.slider(e, function(x, y) {
			if (x < -15) {
				$.glue.stack.to_bottom($(obj));
			} else if (x < 15) {
				// dead zone
				var z = parseInt($(obj).css('z-index'));
				if (z !== old_z) {
					if (!isNaN(old_z)) {
						$(obj).css('z-index', old_z);
					} else {
						$(obj).css('z-index', '');
					}
					// DEBUG
					//console.log('set z-index to '+old_z);
				}
			} else {
				$.glue.stack.to_top($(obj));
			}
		}, function(x, y) {
			$.glue.object.save(obj);
			$.glue.stack.compress();
		});
		return false;
	});
	// $.glue.contextmenu.register('object', 'object-zindex', elem, 3);
	
	elem = $('<img src="'+$.glue.base_url+'modules/object/object-link-new.png" alt="btn" title="make this image a link" width="32" height="32">');
	$(elem).bind('click', function(e) {
		var obj = $(this).data('owner');
		if ($("#dialog-form").length === 0) {
			$( "html" ).unbind();
			$('body').append('<div id="dialog-form" class="ui-dialog-content ui-widget-content enter-url" title="Image Link"><form><fieldset><input id="submit" class="control" type="submit" value="Submit" tabindex="-1" style="font-family: Courier;"><input id="cancel" class="control" type="button" value="Cancel" tabindex="-1"><input type="text" name="object-url" id="object-url" class="ui-widget-content ui-corner-all" autofocus><p>enter address (e.g. http://google.de)</p>');
		  $("#dialog-form").dialog(
		  	{ closeOnEscape: false, 
		  		autoOpen: false 
		  });
		}

		// get link
		$.glue.backend({ method: 'glue.load_object', name: $(obj).attr('id') }, function(data) {

			if (data['#error']) {
				$.glue.error(data['#error']);
			} else {
				var old_link = '';
				if (data['#data']['object-link'] !== undefined) {
					old_link = data['#data']['object-link'];
				}
				var old_target = '';
				if (data['#data']['object-target'] !== undefined) {
					old_target = data['#data']['object-target'];
				}
				old_linkdata = (old_target == '') ? old_link : old_link + ' ' + old_target;

				$( "#dialog-form #object-url" ).focus();
				$( "#dialog-form" ).dialog( "open" );
				$( "#dialog-form #object-url").val(old_linkdata);

				$( "#dialog-form form input#cancel").on('click', function (){
					destroyDialog();
				});

				// listen to dialog submit and save update
				$( "#dialog-form form").on('submit', function (e){
					e.preventDefault();
					link = $('#dialog-form form #object-url').val();

					if (link == undefined) {
						$.glue.backend({ method: 'glue.object_remove_attr', name: $(obj).attr('id'), attr: 'object-link' }, destroyDialog());
					} 
					else {
						// set link
						$.glue.backend({ method: 'glue.update_object', name: $(obj).attr('id'), 'object-link': link }, destroyDialog());
					}
					return false;
				});
			}
		}, false);
	});
	
	$.glue.contextmenu.register('object', 'object-link', elem);

	// Caption menu
	elem = $('<img src="'+$.glue.base_url+'modules/object/object-caption-new.png" alt="btn" title="add caption to image" width="32" height="32">');
	$(elem).bind('click', function(e) {
		var obj = $(this).data('owner');

	  if ($("#dialog-form").length === 0) { 
			$( "html" ).unbind();
			$('body').append('<div id="dialog-form" title="Caption"><form class="caption"><fieldset><input id="submit" class="control" type="submit" value="Submit" tabindex="-1"><input id="cancel" class="control button" type="button" value="Cancel" tabindex="-1"><textarea name="caption" id="caption" class="text ui-widget-content"></textarea>');
		  $("#dialog-form").dialog(
		  	{ closeOnEscape: false, 
		  		autoOpen: false 
		  });
	 	}


		// get caption
		$.glue.backend (
			{ 
				method: 'glue.load_object', 
				name: $(obj).attr('id') 
			}, 
			function(data) {

				var old_caption = '';
				var caption = '';
				
				if (data['#data']['object-caption'] !== undefined) {
					old_caption = data['#data']['object-caption'].replace(/%br%/g, "\n").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
				}

				$( "#dialog-form" ).dialog( "open" );
				$( "#dialog-form #caption").val(old_caption);

				$( "#dialog-form form #cancel").on('click', function (){
					destroyDialog();
				});

				// listen to dialog submit and save update
				$( "#dialog-form form").on('submit', function (e){
					e.preventDefault();
					caption = $('#dialog-form form #caption').val().replace(/\n/g, "%br%").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;");
	
					$.glue.backend(
						{ method: 'glue.update_object', 
						  name: $(obj).attr('id'), 
						  'object-caption': caption 
						}, destroyDialog()
					);
					return false;
				});
			}, false);
	});
	$.glue.contextmenu.register('object', 'object-caption', elem);

	elem = $('<img src="'+$.glue.base_url+'modules/object/object-target.png" alt="btn" title="get the name of this object (for linking to it)" width="32" height="32">');
	$(elem).bind('click', function(e) {
		var obj = $(this).data('owner');
		var name = $(obj).attr('id').split('.').pop();
		prompt('You can link to this object by copying and pasting this string', $.glue.page+'.'+name);
	});
	// $.glue.contextmenu.register('object', 'object-target', elem);
	
	elem = $('<img src="'+$.glue.base_url+'modules/object/object-symlink.png" alt="btn" title="make this object appear on all pages" width="32" height="32">');
	$(elem).bind('click', function(e) {
		var obj = $(this).data('owner');
		$.glue.backend({ method: 'glue.object_make_symlink', name: $(obj).attr('id') });
	});
	// $.glue.contextmenu.register('object', 'object-symlink', elem);
	
	elem = $('<img src="'+$.glue.base_url+'modules/object/object-delete-new.png" alt="btn" title="delete object" width="32" height="32">');
	$(elem).bind('click', function(e) {
		var obj = $(this).data('owner');
		var id = $(obj).attr('id');
		$.glue.object.unregister($(obj));
		$(obj).remove();
		// delete in backend as well
		$.glue.backend({ method: 'glue.delete_object', name: id });
		// update canvas
		$.glue.canvas.update();
	});
	$.glue.contextmenu.register('object', 'object-delete', elem, 20);

});
