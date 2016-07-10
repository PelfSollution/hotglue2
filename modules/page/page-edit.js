/**
 *	modules/page/page-edit.js
 *	Frontend code for general page properties
 *
 *	Copyright Gottfried Haider, Danja Vasiliev 2010.
 *	This source code is licensed under the GNU General Public License.
 *	See the file COPYING for more details.
 */

$(document).ready(function () {
  // set grid
  $.glue.grid.x($.glue.conf.page.default_grid_x);
  $.glue.grid.y($.glue.conf.page.default_grid_y);

  // set guides
  for (i in $.glue.conf.page.guides_x) {
    $.glue.grid.add_guide_x($.glue.conf.page.guides_x[i]);
  }
  for (i in $.glue.conf.page.guides_y) {
    $.glue.grid.add_guide_y($.glue.conf.page.guides_y[i]);
  }

  //
  // register menu items
  //

  // TOGGLE GRID
  elem = $('<img src="' + $.glue.base_url + 'modules/page/page-grid-new.png" width="32" height="32">');
  // also change tilte below
  $(elem).attr('title', 'show/hide grid or change grid size by dragging (' + $.glue.grid.x() + 'x' + $.glue.grid.y() + ')');
  $(elem).bind('mousedown', function (e) {
    var that = this;
    $.glue.slider(e, function (x, y, evt) {
      // rectangular grid when pressing shift
      if (evt.shiftKey) {
        if (x < y) {
          x = y;
        } else {
          y = x;
        }
      }
      // only update grid when grid size is <= 10px for performance reasons
      var update = false;
      if (10 <= Math.abs(x)) {
        $.glue.grid.mode(1);
        $.glue.grid.x(Math.abs(x));
        update = true;
      }
      if (10 <= Math.abs(y)) {
        $.glue.grid.mode(1);
        $.glue.grid.y(Math.abs(y));
        update = true;
      }
      if (update) {
        $.glue.grid.update(true);
      }
    }, function (x, y) {
      if (Math.abs(x) < 10 && Math.abs(y) < 10) {
        if ($.glue.grid.mode()) {
          $.glue.grid.mode(0);
        } else {
          $.glue.grid.mode(1);
        }
        $.glue.grid.update();
      }
      // update backend
      $.glue.backend({
        method: 'page.set_grid',
        'x': $.glue.grid.x(),
        'y': $.glue.grid.y()
      });
      // update tooltip
      $(that).attr('title', 'show/hide grid or change grid size by dragging (' + $.glue.grid.x() + 'x' + $.glue.grid.y() + ')');
      // close menu
      $.glue.menu.hide();
    });
    return false;
  });
  $.glue.menu.register('page', elem, 13);

  // SELECT ALL
  elem = $('<img src="' + $.glue.base_url + 'modules/page/page-select-all.png" alt="btn" title="Select all" width="32" height="32">');
  $(elem).bind('click', function (e) {
    $('div.object').each(function () {
      $.glue.sel.select(this);
    });
  });
  $.glue.menu.register('page', elem);

});