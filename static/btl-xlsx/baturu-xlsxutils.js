/**
 * 数据转换工具，依赖xlsx.full.min.js
 */
import XLSX from 'xlsx';

/* eslint
   no-param-reassign: 0,
   no-plusplus: 0,
   no-continue: 0,
   no-underscore-dangle: 0,
   prefer-destructuring: 0,
   no-bitwise: 0
*/
export default {
  datenum(v, date1904) {
    if (date1904) v += 1462;
    const epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  },
  sheet_from_array_of_arrays(data) {
    const ws = {};
    const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (let R = 0; R !== data.length; ++R) {
      for (let C = 0; C !== data[R].length; ++C) {
        if (range.s.r > R) range.s.r = R;
        if (range.s.c > C) range.s.c = C;
        if (range.e.r < R) range.e.r = R;
        if (range.e.c < C) range.e.c = C;
        const cell = { v: data[R][C] };
        if (cell.v == null) continue;
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });

        if (typeof cell.v === 'number') cell.t = 'n';
        else if (typeof cell.v === 'boolean') cell.t = 'b';
        else if (cell.v instanceof Date) {
          cell.t = 'n';
          cell.z = XLSX.SSF._table[14];
          cell.v = this.datenum(cell.v);
        } else cell.t = 's';

        ws[cellRef] = cell;
      }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
  },
  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  },
};

