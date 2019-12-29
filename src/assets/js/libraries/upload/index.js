define(function(require, exports, module) {
  var upload = {};
  var _isFunction = function(fn){
    return "[object Function]" === Object.prototype.toString.call(fn);
  }
  upload._init = function($) {
    $.extend({
      createUploadIframe: function(id, uri) {
        // create frame
        var frameId = 'jUploadFrame' + id;
        var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
        if (window.ActiveXObject) {
          if (typeof uri == 'boolean') {
            iframeHtml += ' src="' + 'javascript:false' + '"';
          } else if (typeof uri == 'string') {
            iframeHtml += ' src="' + uri + '"';
          }
        }
        iframeHtml += ' />';
        $(iframeHtml).appendTo(document.body);
        return $('#' + frameId).get(0);
      },
      createUploadForm: function(id, fileElementId, data) {
        // create form
        var formId = 'jUploadForm' + id;
        var fileId = 'jUploadFile' + id;
        var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        if (typeof fileElementId == 'object') {
          $.each(fileElementId, function(index, value) {
            var oldElement = $('#' + value);
            var newElement = $(oldElement).clone();
            $(oldElement).attr('id', fileId);
            $(oldElement).before(newElement);
            $(oldElement).appendTo(form);
          });
        } else {
          var oldElement = $('#' + fileElementId);
          var newElement = $(oldElement).clone();
          $(oldElement).attr('id', fileId);
          $(oldElement).before(newElement);
          $(oldElement).appendTo(form);
        }
        /** *** 增加参数的支持 **** */
        if (data) {
          for (var i in data) {
            $('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
          }
        }
        // set attributes
        $(form).css('position', 'absolute');
        $(form).css('top', '-1200px');
        $(form).css('left', '-1200px');
        $(form).appendTo('body');
        return form;
      },
      ajaxFileUpload: function(s) {
        // TODO introduce global settings, allowing the client to modify
        // them for all requests, not only timeout
        s = $.extend({}, $.ajaxSettings, s);
        var id = new Date().getTime();
        // ADD s.data
        var form;
        try {
          form = $.createUploadForm(id, s.fileElementId, s.data);
        } catch (e) {
          if (console) console.log(e);
        }
        var io = $.createUploadIframe(id, s.secureuri);
        var frameId = 'jUploadFrame' + id;
        var formId = 'jUploadForm' + id;
        // Watch for a new set of requests
        if (s.global && !$.active++) {
          $.event.trigger("ajaxStart");
        }
        var requestDone = false;
        // Create the request object
        var xml = {};
        if (s.global) $.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function(isTimeout) {
          io = document.getElementById(frameId);
          try {
            if (io.contentWindow) {
              xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
              xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
            } else if (io.contentDocument) {
              xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
              xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
            }
          } catch (e) {
            $.handleError(s, xml, null, e);
          }
          if (xml || isTimeout == "timeout") {
            requestDone = true;
            var status;
            try {
              status = isTimeout != "timeout" ? "success" : "error";
              // Make sure that the request was successful or
              // notmodified
              if (status != "error") {
                // process the data (runs the xml through
                // httpData regardless of callback)
                var data = $.uploadHttpData(xml, s.dataType);
                // If a local callback was specified, fire it
                // and pass it the data
                if (s.success) s.success(data, status);
                // Fire the global callback
                if (s.global) $.event.trigger("ajaxSuccess", [xml,
                  s
                ]);
              } else $.handleError(s, xml, status);
            } catch (e) {
              status = "error";
              $.handleError(s, xml, status, e);
            }
            // The request was completed
            if (s.global) $.event.trigger("ajaxComplete", [xml, s]);
            // Handle the global AJAX counter
            if (s.global && !--$.active) $.event.trigger("ajaxStop");
            // Process result
            if (s.complete) s.complete(xml, status);
            $(io).unbind();
            setTimeout(function() {
              try {
                $(io).remove();
                $(form).remove();
              } catch (e) {
                $.handleError(s, xml, null, e);
              }
            }, 100);
            xml = null;
          }
        };
        // Timeout checker
        if (s.timeout > 0) {
          setTimeout(function() {
            // Check to see if the request is still happening
            if (!requestDone) uploadCallback("timeout");
          }, s.timeout);
        }
        try {
          var form = $('#' + formId);
          $(form).attr('action', s.url);
          $(form).attr('method', 'POST');
          $(form).attr('target', frameId);
          if (form.encoding) {
            $(form).attr('encoding', 'multipart/form-data');
          } else {
            $(form).attr('enctype', 'multipart/form-data');
          }
          $(form).submit();
        } catch (e) {
          $.handleError(s, xml, null, e);
        }
        $('#' + frameId).load(uploadCallback);
        return {
          abort: function() {}
        };
      },
      /** handleError 方法在jquery1.4.2之后移除了，此处重写改方法 * */
      handleError: function(s, xhr, status, e) {
        // If a local callback was specified, fire it
        if (s.error) {
          s.error.call(s.context || s, xhr, status, e);
        }
        // Fire the global callback
        if (s.global) {
          (s.context ? $(s.context) : $.event).trigger("ajaxError", [xhr, s, e]);
        }
      },
      uploadHttpData: function(r, type) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if (type == "script") {
          $.globalEval(data);
        }
        // Get the JavaScript object, if JSON is used.
        if (type == "json") {
          /** * 如果返回的是字符串(JSON格式字符串)，下面会报错，导致无法走入sucess方法 加上\" ** */
          // eval( "data = " + data );
          // eval("data = \" "+data+" \" ");
          // eval("data = eval(" + data + ")");
          // data = JSON.parse(data);
          eval("data = " + data);
        }
        // evaluate scripts within html
        if (type == "html") {
          $("<div>").html(data).evalScripts();
        }
        return data;
      }
    });
  }
  upload.upload = function(args) {
    if (!$.ajaxFileUpload || !_isFunction($.ajaxFileUpload)) {
      upload._init($);
    }
    var i, options = {},
      // 默认参数
      defaults = {
        secureuri: false,
        dataType: 'json',
        data:null,
        id: null, //选择文件控件id
        url: null, //上传API
        ext: null, //允许的后缀名
        success: null, //上传成功的回调函数
        error: function(msg) { //上传失败的回调函数
          alert(msg);
        },
        extValidateError: function(msg) { //文件格式验证失败的回调函数
          alert(msg);
        },
        complete: function(XMLHttpRequest, textStatus) {}
      };
    for (i in defaults) {
      if (i == 'id') options.fileElementId = args[i] !== undefined ? args[i] : defaults[i];
      else options[i] = args[i] !== undefined ? args[i] : defaults[i];
    }
    //console.log(options);
    //上传条件判断
    //1.判断后缀名是否合法
    var $filename = $('#' + options.fileElementId).val(); //待上传的文件，如“/www/data/index.php”等
    var index1 = $filename.lastIndexOf(".");
    if (index1 == -1) {
      options.extValidateError('未知文件！');
      return;
    }
    var index2 = $filename.length;
    var ext = $filename.substring(index1, index2); //后缀名
    if ($.inArray(ext, options.ext) == -1) {
      options.extValidateError('不支持的文件！');
      return;
    }
    //开始上传
    $.ajaxFileUpload(options);
  }
  module.exports = upload;
});