/**
 * Workbook构造器，无依赖
 */
export default class Workbook {
  constructor() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }
}
