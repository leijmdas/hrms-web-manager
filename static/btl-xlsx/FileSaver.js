/*! FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-01-24
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
 */

/* global self */
/* jslint bitwise: true, indent: 4, laxbreak: true,
laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

/* Baturu改进版，用在es6+、webpack下 */
/* eslint
   no-param-reassign: 0,
   no-new: 0,
   no-console: 0,
   new-parens: 0,
   camelcase: 0,
   one-var: 0,
   prefer-destructuring: 0,
   no-plusplus: 0,
   prefer-const: 0,
   no-multi-assign: 0,
   consistent-return: 0,
   no-restricted-globals: 0,
   no-mixed-operators: 0,
   no-unused-vars: 0,
   no-shadow: 0,
   prefer-rest-params: 0,
   no-undef: 0,
   no-useless-escape: 0
*/
export default (function (view) {
  return view.saveAs
    // IE 10+ (native saveAs)
    || (typeof navigator !== 'undefined' &&
      navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
    // Everyone else
    || (function () {
      // IE <10 is explicitly unsupported
      if (typeof navigator !== 'undefined' &&
        /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
      }
      let
        doc = view.document,
        // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
        get_URL = () => view.URL || view.webkitURL || view,
        URL = view.URL || view.webkitURL || view,
        save_link = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a'),
        can_use_save_link = !view.externalHost && 'download' in save_link,
        click = (node) => {
          let event = doc.createEvent('MouseEvents');
          event.initMouseEvent(
            'click', true, false, view, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null,
          );
          node.dispatchEvent(event);
        },
        webkit_req_fs = view.webkitRequestFileSystem,
        req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
        throw_outside = (ex) => {
          (view.setImmediate || view.setTimeout)(() => {
            throw ex;
          }, 0);
        },
        force_saveable_type = 'application/octet-stream',
        fs_min_size = 0,
        deletion_queue = [],
        process_deletion_queue = () => {
          let i = deletion_queue.length;
          while (i--) {
            let file = deletion_queue[i];
            if (typeof file === 'string') { // file is an object URL
              URL.revokeObjectURL(file);
            } else { // file is a File
              file.remove();
            }
          }
          deletion_queue.length = 0; // clear queue
        },
        dispatch = (filesaver, event_types, event) => {
          event_types = [].concat(event_types);
          let i = event_types.length;
          while (i--) {
            let listener = filesaver[`on${event_types[i]}`];
            if (typeof listener === 'function') {
              try {
                listener.call(filesaver, event || filesaver);
              } catch (ex) {
                throw_outside(ex);
              }
            }
          }
        },
        FileSaver = function FileSaver(blob, name) {
          // First try a.download, then web filesystem, then object URLs
          let
            filesaver = this,
            type = blob.type,
            blob_changed = false,
            object_url,
            target_view,
            get_object_url = () => {
              let object_url = get_URL().createObjectURL(blob);
              deletion_queue.push(object_url);
              return object_url;
            },
            dispatch_all = () => {
              dispatch(filesaver, 'writestart progress write writeend'.split(' '));
            },
            // on any filesys errors revert to saving with object URLs
            fs_error = () => {
              // don't create more object URLs than needed
              if (blob_changed || !object_url) {
                object_url = get_object_url(blob);
              }
              if (target_view) {
                target_view.location.href = object_url;
              } else {
                if (navigator.userAgent.match(/7\.[\d\s\.]+Safari/) // is Safari 7.x
                  && typeof window.FileReader !== 'undefined' // can convert to base64
                  && blob.size <= 1024 * 1024 * 150 // file size max 150MB
                ) {
                  let reader = new window.FileReader();
                  reader.readAsDataURL(blob);
                  reader.onloadend = () => {
                    let frame = doc.createElement('iframe');
                    frame.src = reader.result;
                    frame.style.display = 'none';
                    doc.body.appendChild(frame);
                    dispatch_all();
                  };
                  filesaver.readyState = filesaver.DONE;
                  filesaver.savedAs = filesaver.SAVEDASUNKNOWN;
                  return;
                }
                window.open(object_url, '_blank');
                filesaver.readyState = filesaver.DONE;
                filesaver.savedAs = filesaver.SAVEDASBLOB;
                dispatch_all();
              }
            },
            abortable = function abortable(func) {
              /* eslint func-names: 0 */
              return function () {
                if (filesaver.readyState !== filesaver.DONE) {
                  return func.apply(this, arguments);
                }
              };
            },
            create_if_not_found = { create: true, exclusive: false },
            slice;
          filesaver.readyState = filesaver.INIT;
          if (!name) {
            name = 'download';
          }
          if (can_use_save_link) {
            object_url = get_object_url(blob);
            // FF for Android has a nasty garbage collection mechanism
            // that turns all objects that are not pure javascript into 'deadObject'
            // this means `doc` and `save_link` are unusable and need to be recreated
            // `view` is usable though:
            doc = view.document;
            save_link = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = object_url;
            save_link.download = name;
            let event = doc.createEvent('MouseEvents');
            event.initMouseEvent(
              'click', true, false, view, 0, 0, 0, 0, 0
              , false, false, false, false, 0, null,
            );
            save_link.dispatchEvent(event);
            filesaver.readyState = filesaver.DONE;
            filesaver.savedAs = filesaver.SAVEDASBLOB;
            dispatch_all();
            return;
          }
          // Object and web filesystem URLs have a problem saving in Google Chrome when
          // viewed in a tab, so I force save with application/octet-stream
          // http://code.google.com/p/chromium/issues/detail?id=91158
          if (view.chrome && type && type !== force_saveable_type) {
            slice = blob.slice || blob.webkitSlice;
            blob = slice.call(blob, 0, blob.size, force_saveable_type);
            blob_changed = true;
          }
          // Since I can't be sure that the guessed media type will trigger a download
          // in WebKit, I append .download to the filename.
          // https://bugs.webkit.org/show_bug.cgi?id=65440
          if (webkit_req_fs && name !== 'download') {
            name += '.download';
          }
          if (type === force_saveable_type || webkit_req_fs) {
            target_view = view;
          }
          if (!req_fs) {
            fs_error();
            return;
          }
          fs_min_size += blob.size;
          req_fs(view.TEMPORARY, fs_min_size, abortable((fs) => {
            fs.root.getDirectory('saved', create_if_not_found, abortable((dir) => {
              let save = function save() {
                dir.getFile(name, create_if_not_found, abortable((file) => {
                  file.createWriter(abortable((writer) => {
                    writer.onwriteend = (event) => {
                      target_view.location.href = file.toURL();
                      deletion_queue.push(file);
                      filesaver.readyState = filesaver.DONE;
                      filesaver.savedAs = filesaver.SAVEDASBLOB;
                      dispatch(filesaver, 'writeend', event);
                    };
                    writer.onerror = () => {
                      let error = writer.error;
                      if (error.code !== error.ABORT_ERR) {
                        fs_error();
                      }
                    };
                    'writestart progress write abort'.split(' ').forEach((event) => {
                      writer[`on${event}`] = filesaver[`on${event}`];
                    });
                    writer.write(blob);
                    filesaver.abort = function abort() {
                      writer.abort();
                      filesaver.readyState = filesaver.DONE;
                      filesaver.savedAs = filesaver.FAILED;
                    };
                    filesaver.readyState = filesaver.WRITING;
                  }), fs_error);
                }), fs_error);
              };
              dir.getFile(name, { create: false }, abortable((file) => {
                // delete file if it already exists
                file.remove();
                save();
              }), abortable((ex) => {
                if (ex.code === ex.NOT_FOUND_ERR) {
                  save();
                } else {
                  fs_error();
                }
              }));
            }), fs_error);
          }), fs_error);
        },
        FS_proto = FileSaver.prototype,
        saveAs = (blob, name) => new FileSaver(blob, name);
      FS_proto.abort = function abort() {
        let filesaver = this;
        filesaver.readyState = filesaver.DONE;
        filesaver.savedAs = filesaver.FAILED;
        dispatch(filesaver, 'abort');
      };
      FS_proto.readyState = FS_proto.INIT = 0;
      FS_proto.WRITING = 1;
      FS_proto.DONE = 2;
      FS_proto.FAILED = -1;
      FS_proto.SAVEDASBLOB = 1;
      FS_proto.SAVEDASURI = 2;
      FS_proto.SAVEDASUNKNOWN = 3;

      FS_proto.error =
        FS_proto.onwritestart =
        FS_proto.onprogress =
        FS_proto.onwrite =
        FS_proto.onabort =
        FS_proto.onerror =
        FS_proto.onwriteend =
        null;

      view.addEventListener('unload', process_deletion_queue, false);
      saveAs.unload = () => {
        process_deletion_queue();
        view.removeEventListener('unload', process_deletion_queue, false);
      };
      if (typeof Meteor !== 'undefined') { // make it available for Meteor
        Meteor.saveAs = saveAs;
      }
      return saveAs;
      // `self` is undefined in Firefox for Android content script context
      // while `this` is nsIContentFrameMessageManager
      // with an attribute `content` that corresponds to the window
    }());
}(typeof self !== 'undefined' && self || typeof window !== 'undefined' && window || this.content || this));
