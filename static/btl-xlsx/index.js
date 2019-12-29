/**
 * Module: es6+ webpack2.0+
 * Dependence：
 *    xlsx模块（通过npm install xlsx --save安装即可）
 *
 * Desc: 用于将符合规范的数组数据导出Excel文件，支持web worker，兼容ie10及以上
 * Author: Baturu
 * params:
 *    data -> 类型：Array，由需要导出的数据组成, 每个数组元素为一个Sheet内容，Sheet内容也是数组，每个元素为Sheet中的一行，
 *    形如：[ [['单元格','单元格']，['单元格','单元格']] ，[['单元格','单元格']，['单元格','单元格']] ]
 *    options -> 可选配置项（有默认值）, 如下：
 *
 * Function:
 *  options.nonsupport（浏览器不支持回调）
 *  options.ready（就绪回调）、options.error（错误回调）、options.complete（完成回调）
 *
 * String:
 *  options.wb_name（Excel文件名）、options.ws_names（Sheets表格名）
 *  options.xlsxstatic_root(baturu-xlsx资源文件根目录)
 *
 * Other：本插件支持并发导出Excel，由于Web Worker的创建时间大约在40ms左右，固对导出速度影响不大，同时Worker线程会在数据处理完后被释放。
 *
 */
import saveAs from './FileSaver';

import fn from './baturu-xlsxcore'
/* eslint
   no-unused-expressions: 0,
   no-param-reassign: 0,
   no-console: 0,
   no-extra-boolean-cast: 0,
   no-undef: 0,
   camelcase: 0,
   one-var: 0
*/
let fun2 = (data, options) => {
  options || (options = {});

  // 检测浏览器是否符合条件
  if (typeof navigator !== 'undefined' &&
    /MSIE [1-9]\./.test(navigator.userAgent)) {
    options.nonsupport && options.nonsupport();
    console.error('抱歉，您的浏览器out啦，请用新版Chrome或ie10及以上浏览器');
    return;
  }

  let timer = null; // 时间标记器，用于测速
  const opts = {
    // 准备就绪回调
    ready() {
      options.ready && options.ready();
      // 开始测速
      console.info('准备就绪\\(^o^)/~，开始处理中。。。');
      timer = new Date();
    },
    // 导出错误回调
    error(err) {
      options.error && options.error(err);
      // 结束测速
      console.info(`导出终止（秒）: ${(new Date() - timer) / 1000}s`);
      console.error(err);
    },
    // 导出完成回调
    complete() {
      options.complete && options.complete();
      // 结束测速
      console.info(`导出完成，总耗时（秒）: ${(new Date() - timer) / 1000}s`);
    },
    // Excel文件名、Sheets表格名
    wb_name: options.wb_name || '巴图鲁导出数据.xlsx',
    ws_names: options.ws_names || [],
    // baturu-xlsxworker.js文件路径
    xlsxworker_url: `${options.xlsxstatic_root}/baturu-xlsxworker.js` || './baturu-xlsxworker.js',
  };

  // 支持web worker
  if (!!window.Worker) {
    const worker = new Worker(opts.xlsxworker_url);

    worker.onmessage = (evt) => {
      switch (evt.data.t) {
        case 'ready':
          opts.ready();
          break;
        case 'error':
          opts.error(evt.data.d);
          break;
        case 'export':
          // 关闭线程
          worker.terminate();
          saveAs(evt.data.d, opts.wb_name);
          opts.complete();
          break;
        default:
          opts.error(new Error('未知错误！Happy Debug！'));
      }
    };

    worker.postMessage({
      d: data,
      o: {
        ws_names: opts.ws_names
      }
    });
    return;
  }

  // 不支持web worker
  fn.then(({
    Blob,
    XLSX,
    Workbook,
    xlsxUtils,
  }) => {
    try {
      // 准备就绪
      opts.ready();

      const wb = new Workbook(),
        wb_data = data;

      wb_data.forEach((ws_data, idx) => {
        const ws_name = opts.ws_names[idx] || (`baturu-${idx}`);
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = xlsxUtils.sheet_from_array_of_arrays(ws_data);
      });

      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'binary',
      });

      // 数据解析完后导出Excel文件
      saveAs(new Blob([xlsxUtils.s2ab(wbout)], {
        type: 'application/octet-stream'
      }), opts.wb_name);

      // 导出完成
      opts.complete();
    } catch (e) {
      opts.error(e.stack || e);
    }
  });
};

export default fun2;
