/*
 *  jQuery Textcount - v0.5
 *  A jQuery plugin for counting text (total chars or non html chars) of form field values
 *  https://github.com/placenamehere/textcount
 *
 *  Made by Chris Casciano
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "textcount",
        defaults = {
          prefix: "tc",
          triggerEvent: "click"
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).


            var _this = this,
                $el = $(_this.element),
                $next = $el.next(),
                $hint,
                maxLength = $el.attr("maxlength"),
                maxVisible = $el.data(_this.options.prefix+"-max-visible"),
                c,
                err = false;

            // STEP 1: Draw hint box
            if ($next && $next.is("."+_this.options.prefix+"-hint")) {
              $hint = $next;
            } else {
              $hint = $("<span class='"+_this.options.prefix+"-hint'></span>").insertAfter($el);
            }

            // STEP 2: Determine type of counting
            // STEP 3: Do initial field evaluation
            if ($el.data(_this.options.prefix+"-ignore-html")) {
              c = $("<div>"+$el.val()+"</div>").text().length;
            } else {
              c = $el.val().length;
            }


            if (maxLength) {
              // counting characters w/ limit
              $hint.html((maxLength - c) + " total characters left of " + maxLength);
            } else if (maxVisible && $el.data(_this.options.prefix+"-ignore-html")) {
              // counting non-html characters w/ limit
              $hint.html((maxVisible - c) + " visible characters left of " + maxVisible);

              if (maxVisible - c < 0) {
                err = true;
              }
            } else if ($el.data(_this.options.prefix+"-ignore-html")) {
              // relaying non-html character count
              $hint.html(c + " visible characters");
            } else {
              // relaying character count
              $hint.html(c + " total characters");
            }


            // check for markup errors
            if ($el.data(_this.options.prefix+"-ignore-html")) {
              if (($el.val().match(/</g)||[]).length !== ($el.val().match(/>/g)||[]).length) {
                err = true;
              }
            }


            if (err) {
              $hint.addClass(_this.options.prefix+"-error");
            } else {
              $hint.removeClass(_this.options.prefix+"-error");
            }


            // STEP 4: Watch for changes
            $el.keyup(function(){
              var $el = $(this),
                  $hint = $el.next("."+_this.options.prefix+"-hint"),
                  maxLength = $el.attr("maxlength"),
                  maxVisible = $el.data(_this.options.prefix+"-max-visible"),
                  c,
                  err = false;

              if ($el.data(_this.options.prefix+"-ignore-html")) {
                c = $("<div>"+$el.val()+"</div>").text().length;
              } else {
                c = $el.val().length;
              }

              if (maxLength) {
                // counting characters w/ limit
                $hint.html((maxLength - c) + " total characters left of " + maxLength);
              } else if (maxVisible && $el.data(_this.options.prefix+"-ignore-html")) {
                // counting non-html characters w/ limit
                $hint.html((maxVisible - c) + " visible characters left of " + maxVisible);
                if (maxVisible - c < 0) {
                  err = true;
                }

              } else if ($el.data(_this.options.prefix+"-ignore-html")) {
                // relaying non-html character count
                $hint.html(c + " visible characters");
              } else {
                // relaying character count
                $hint.html(c + " total characters");
              }

              // check for markup errors
              if ($el.data(_this.options.prefix+"-ignore-html")) {
                if (($el.val().match(/</g)||[]).length !== ($el.val().match(/>/g)||[]).length) {
                  err = true;
                }
              }


              if (err) {
                $hint.addClass(_this.options.prefix+"-error");
              } else {
                $hint.removeClass(_this.options.prefix+"-error");
              }

            });

        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );
