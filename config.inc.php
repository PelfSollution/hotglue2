<?php


/*
 *	These are the default configuration settings of this hotglue 
 *	installation. Do not edit this file directly but overwrite specific 
 *	variables by setting them in the user-config.inc.php file, which 
 *	will not be overwritten by future updates.
 */


// error_reporting(E_ALL);						// see php documentation

// try to include user configuration
@include('user-config.inc.php');

// otherwise fall back to these defaults
@define('ALWAYS_PROMPT_CREATE_PAGE', false);	// invoke the "create page" controller when trying to access a non-existing page even if the user is not logged in yet (otherwise they receive a 404)
@define('AUTH_METHOD', 'basic');			// can be digest, basic or none

// DON'T set username and password here!
// instead rename file user-config.inc.php-dist to user-config.inc.php
// and set you credentials there
@define('AUTH_USER', 'admin');
@define('AUTH_PASSWORD', 'changeme');

@define('BASE_URL', '');					// auto-detected if empty (don't use BASE_URL in custom code but rather base_url() below)
@define('CACHE_TIME', 0);				// cache time in seconds (zero to disable)
@define('CONTENT_DIR', 'content');			// content directory, must be writable
@define('DEFAULT_PAGE', 'start');
@define('DEFAULT_TO_EDIT', false);			// edit pages by default
@define('FAVICON', 'img/favicon.ico');		// can be empty or an absolute url
@define('HOTGLUE_VERSION', '1.0.4pre');		// expected api.version.patchlevel
@define('IE8_COMPAT', false);				// try to be compatible with Internet Explorer 8 in viewing mode (also make sure that TEXT_USE_WOFF_FONTS is set to false)
@define('JQUERY', 'js/jquery-1.8.3.min.js');// can be an absolute url
@define('LOCK_TIME', 1000);					// maximum time in ms to wait for an object lock
@define('LOG_FILE', 'content/log.txt');		// log file, must be writable
@define('LOG_LEVEL', 'error');				// minimum log level (can be error, warn, info, debug)
@define('SHORT_URLS', true);				// use short urls internally
@define('SHOW_FRONTEND_ERRORS', false);
@define('SITE_NAME', 'Etienne Descloux');
@define('SNAPSHOT_MAX_AGE', 60*60*24*7);	// auto- revisions are automatically deleted after n seconds (zero to disable)
@define('SNAPSHOT_MIN_AGE', 60*60);			// auto- revisions are created every n seconds (zero to disable)
@define('USE_HOTGLUE_ERRORS', true);		// use hotglue theming for error pages
@define('USE_MIN_FILES', false);				// use minified files if possible (see also JQUERY define)
// default modules
@define('IMAGE_JPEG_QUAL', 90);				// quality for jpeg resizing (0 < 100)
@define('IMAGE_PNG_QUAL', 7);				// quality for png resizing (9 < 0)
@define('IMAGE_RESIZING', false);			// resize uploaded images on the server (needs gd installed)
@define('IMAGE_UPLOAD_RESIZE_LARGER', '120%');	// automatically resize uploaded image when larger than n% of window width or height (set to 0% to disable)
@define('IMAGE_UPLOAD_RESIZE_TO', '80%');		// target size in n% of window width or height
@define('OBJECT_DEFAULT_COLORS', '#61b9cf #ff00ff #ffff00');		// default colors for new objects (space-separated string)
@define('RESERVED_PAGE_NAMES', 'code edit pages');	// page names used internaly and thus unavailable
@define('PAGE_DEFAULT_GRID_X', 20);			// default grid x spacing in px
@define('PAGE_DEFAULT_GRID_Y', 20);			// default grid y spacing in px
@define('PAGE_GUIDES_X', 20);				// show a grid line after n horizontal px (space-separated string)
@define('PAGE_GUIDES_Y', 20);				// show a grid line after n vertical px (space-separated string)
@define('PAGES_NEED_AUTH', true);			// page browser needs authentication
@define('REVISIONS_NEED_AUTH', true);		// revisions browser needs authentication
@define('TEXT_AUTO_BR', true);						// automatically add <br> elements for newlines
@define('TEXT_USE_WOFF_FONTS', false);		// (experimental) offer woff webfonts (supported by Firefox 3.6+, Chrome 5.0+, Internet Explorer 9)
@define('VIDEO_START_ON_CLICK', true);		// start video on click when autoplay is off
@define('VIEW_NEEDS_AUTH', false);			// viewing pages requires authentication


/**
 *	use this function to get the site's base url
 *
 *	@return string base url (not html-encoded)
 */
function base_url()
{
	global $base_url_cached;

	$temp = BASE_URL;
	if (!empty($temp)) {
		return $temp;
	} elseif (!isset($base_url_cached)) {
		if (empty($_SERVER['HTTPS'])) {
			$base_url_cached = 'http://'.$_SERVER['HTTP_HOST'];
			if ($_SERVER['SERVER_PORT'] != '80') {
				$base_url_cached .= $_SERVER['SERVER_PORT'];
			}
		} else {
			$base_url_cached = 'https://'.$_SERVER['HTTP_HOST'];
			if ($_SERVER['SERVER_PORT'] != '443') {
				$base_url_cached .= $_SERVER['SERVER_PORT'];
			}
		}
		$base_url_cached .= dirname($_SERVER['PHP_SELF']);
		// make sure we have a trailing slash at the end
		if (substr($base_url_cached, -1) != '/') {
			$base_url_cached .= '/';
		}
	}
	
	return $base_url_cached;
}
