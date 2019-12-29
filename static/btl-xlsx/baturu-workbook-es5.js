/**
 * Workbook构造器，无依赖
 */
; (function (root, name, definition) {
	var hasDefine = typeof define === 'function',
		hasExports = typeof module !== 'undefined' && module.exports;
	if (hasDefine) {
		define(definition);
	} else if (hasExports) {
		module.exports = definition();
	} else {
		root[name] = definition();
	}
})(typeof self !== "undefined" && self
|| typeof window !== "undefined" && window
|| this.content || this,
	'Workbook', function () {
		return function () {
			if (!(this instanceof Workbook)) return new Workbook();
			this.SheetNames = [];
			this.Sheets = {};
		};
	});