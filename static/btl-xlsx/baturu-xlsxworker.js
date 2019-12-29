importScripts('./Blob-es5.js');
importScripts('./xlsx.full.min.js');
importScripts('./baturu-workbook-es5.js');
importScripts('./baturu-xlsxutils-es5.js');

// 资源准备就绪
postMessage({ t:"ready" });

onmessage = function (evt) {
  try {

	var wb = new Workbook(), 
		wb_data = evt.data.d, 
		opts = evt.data.o;
	wb_data.forEach(function(ws_data, idx) {
		var ws_name = opts.ws_names[idx] || ('baturu-' + idx);
		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = xlsxUtils.sheet_from_array_of_arrays(ws_data);
	});
	var wbout = XLSX.write(wb, {
		bookType: 'xlsx', 
		bookSST: false, 
		compression: true,
		type: 'binary'
	});
	// 数据解析完，回主线程导出Excel文件
	postMessage({ 
		t: 'export', 
		d: new Blob([xlsxUtils.s2ab(wbout)], { type: 'application/octet-stream' })
	});

  } catch(e) { postMessage({ t: 'error', d: e.stack || e }); }
};