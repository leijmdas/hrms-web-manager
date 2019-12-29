<style lang="less" >
@import "../variables";
.spin-container {
  position: relative;
}

.ivu-spin {
  position: absolute;
  top: 40%;
  left: 40%;
}

.block {
  margin-top: 5px;
}

.block:before,
.block:after {
  content: "\0020";
  clear: both;
  display: block;
}

.grid-table-expand {
  font-size: 0;
}

.grid-table-expand label {
  width: 110px;
  color: #99a9bf;
}

.grid-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}

.grid-table-expand .el-form-item.expand-col-1 {
  width: 100%;
}

.grid-table-expand .el-form-item.expand-col-2 {
  width: 50%;
}

.grid-table-expand .el-form-item.expand-col-3 {
  width: 33.33%;
}

.grid-table-expand .el-form-item.expand-col-4 {
  width: 25%;
}

.grid-table-expand .el-form-item.expand-col-5 {
  width: 20%;
}
.el-dropdown i {
  color: @font-lightblue;
}
.el-dropdown .el-icon-menu,
.el-dropdown .el-icon--right {
  cursor: pointer;
}
.actionDropdown .el-button--primary {
  color: #fff;
  background-color: #f99;
  border-color: #f00;
}
</style>
<template>
  <div :class="pageSize>0?'panel panel-default':''">
    <el-table  ref="multipleTable" highlight-current-row :data="tableData" element-loading-text="数据加载中" v-loading="showLoading" @row-dblclick="handleRowDblclick" @select="handleSelect" @select-all="handleSelectAll" @selection-change="handleSelectionChange" @current-change="handleCurrentChange" @row-click="handleRowClick" @sort-change="handleSortChange" :border="tableBorder" :height="tableHeight" :max-height="tableMaxheight" :style="tableStyle" :span-method="spanMethod" :row-class-name="rowClassName" :show-summary="showSummary" :summary-method="getSummaries">
      <slot name="prepend"></slot>
      <el-table-column type="selection" width="35" v-if="selection || multi" :fixed="fixed && 'left'"></el-table-column>
      <el-table-column type="expand" v-if="expandColumns" :fixed="fixed && 'left'">

      </el-table-column>
      <slot name="insert"></slot>
      <el-table-column v-for="c in tableColumns" :prop="c.dataIndex" :key="c.id" :label="c.title" :formatter="c.formatter" :scope="c.scope" :width="c.width" header-align="center">
      </el-table-column>
      <slot name="append"></slot>
      <el-table-column :width="actionWidth" v-if="actions && actions.length" :fixed="fixed && 'right'" label="操作">
        <template slot-scope="{row}">
          <action-column :row="row" :actions="getRowActions(row)"></action-column>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <div class="block" v-if="storeModel === 'remote'&&pageSize>0">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="currentPage" :page-sizes="pageSizeOpts" :page-size="pageSize" :layout="pageLayout" :total="total" style="float:right">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
Vue.component("action-column", {
  data: function() {
    return {
    };
  },
  props:{
    row:{
      type:Object,
      default:()=>{}
    },
    actions:{
      type:Array,
      default:()=>[]
    }
  },
  methods:{
    handleCommand(command, row) {
      const handle = this.actions[command].handle;
      handle && handle(row);
    },
  },
  template: `<div>
    <el-button type="text" v-if="actions.length>0" @click="handleCommand(0,row)">
     <span :class="actions[0].className" :style="actions[0].style" :title="(actions[0].title||actions[0].name)">{{actions[0].name}}</span>
    </el-button>
    <el-dropdown class="actionDropdown" size="mini" type="text" @command="handleCommand($event, row)" v-if="actions.length>1">

    <el-button type="text" title="更多">
    <i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
    <el-dropdown-item  v-for="(item, index) in actions" v-if="index>0" :key="index" :command="index">
      <span :class="item.className" :style="item.style" :title="(item.title||item.name)">{{item.name}}</span>
    </el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
  </div>`
});

import { assistance } from "../utils";
export default {
  name: "vTable",
  props: {
    selection: {
      type: Boolean,
      required: false,
      default: false
    },
    showSummary:{
      type:Boolean,
      default: false
    },
    multi: {
      type: Boolean,
      required: false,
      default: false
    },
    gridColumns: {
      type: Array
    },
    expandColumns: {
      // 展开列数据
      type: Array
    },
    expandColNum: {
      // 展开列数
      type: [String, Number],
      default: 2
    },
    actions: {
      // 行操作按钮数据
      type: Array
    },
    actionWidth: {
      type: String,
      default: "80px"
    },
    pageSizeOpts: {
      type: Array,
      required: false,
      default: () => [10, 20, 50, 100]
    },
    pageSize: {
      type: Number,
      required: false,
      default: 20
    },
    pageLayout: {
      type: String,
      required: false,
      default: "total, sizes, prev, pager, next"
    },
    storeModel: {
      type: String,
      required: false,
      default: "remote"
    },
    fixed: {
      type: Boolean,
      default: true
    },
    tableBorder: {
      type: Boolean,
      required: false,
      default: true
    },
    tableHeight: {
      type: Number,
      required: false,
      default: null
    },
    tableMaxheight: {
      type: Number,
      required: false,
      default: null
    },
    tableMinheight: {
      type: Number,
      required: false,
      default: null
    },
    tableStyle: {
      type: String,
      required: false,
      default: ""
    },
    spanMethod: {
      type: Function,
      required: false
    },
    dataWrap: {
      type: Function,
      required: false,
      default: function(data) {
        return data;
      }
    },
    rowClassName:{
      type:Function,
      required:false,
      default:function({row,index}){
        return ''
      }
    },
    //原
    page: {
      type: Object,
      required: false,
      default: () => {}
    },
    columns: {
      type: Array,
      required: false
    },
    tableData: {
      type: Array,
      required: false,
      default: () => []
    },
    autoSelect: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    tableData: function(val) {
      this.$nextTick(() => {
        if (this.selectItemIndex > -1) {
          $(this.$el)
            .find(".el-table .el-table__body tbody tr")
            .eq(this.selectItemIndex)
            .addClass("current-row");
          this.handleCurrentChange(this.tableData[this.selectItemIndex]);
          this.selectItemIndex = -1;
        } else if (this.autoSelectItem) {
          if (this.currentRow == null && val != null && val.length > 0) {
            if (!this.multi) {
              this.$refs.multipleTable.setCurrentRow(val[0]);
              this.handleRowDblclick(val[0]);
            } else {
              this.setSelectedRows([val[0]]);
            }
          }
        }
      });
    }
  },
  computed: {
    tableColumns: function() {
      if (this.columns == null || this.columns.length < 1) {
        return this.gridColumns;
      }

      return this.columns;
    }
  },
  data() {
    return {
      showLoading: false,
      internalPageSize: this.pageSize,
      currentPage: 1,
      total: 0,
      storeParams: {},
      selectRows: [],
      currentRow: null,
      autoSelectItem: this.autoSelect,
      selectItemIndex: -1
    };
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    getRowActions(row) {
      //授权过的action
      let _actions = this.actions.filter(a => {
        if(!a.perm){
          return true;
        }
        if(typeof a.perm ==='function'){
            return this.$hasPermission(a.perm());
        }
        return this.$hasPermission(a.perm);
      });
      let rs = _actions.filter(a => {
        return !a.require || a.require(row);
      });
      return rs;
    },
    load() {
      this.selectColumns = [];

      this.showLoading = true;
      let params = Object.assign(this.storeParams, this.page.query);

      params["limit"] = this.internalPageSize;
      let start = (this.currentPage - 1) * this.internalPageSize;
      params["start"] = start < 0 ? 0 : start;

      params['_openLoading'] = false;
      this.page
        .getData(params)
        .then(rsp => {

          this.tableData.splice(0, this.tableData.length);
          this.total = rsp.total || 0;
          let data =  rsp.data || [];

          let _data = this.dataWrap(data);

          this.tableData.push(..._data);

          this.showLoading = false;

          this.$emit("dataloaded", rsp);
          //this.select()
        })
        .catch(err => {
          this.showLoading = false;
          this.tableData.splice(0, this.tableData.length);

        });
    },
    getTableData() {
      return this.tableData;
    },
    changePage(page) {
      this.currentPage = page;
      let start = (page - 1) * this.internalPageSize;
      this.storeParams["start"] = start < 0 ? 0 : start;
      this.load(this.storeParams);
    },
    handleSortChange(p) {
      this.storeParams["sortBys"] = p.prop + "|" + (p.order==='ascending'?'asc':'desc');
      this.load();
    },
    changePageSize(pageSize) {
      this.internalPageSize = pageSize;
      this.load(this.storeParams);
    },
    handleRowDblclick(row, event, column) {
      this.expandColumns &&
        this.$el
          .querySelectorAll("div.el-table__expand-icon")
          [this.tableData.indexOf(row)].click();
      this.$emit("row-dblclick", row);
    },
    handleRowClick(row) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row, true);
      this.$emit("row-click", row);
    },

    handleSelect(selection, row) {
      this.selection &&
        !this.multi &&
        ~selection.indexOf(row) &&
        selection.splice(0, selection.length, row);
    },
    handleSelectAll(selection) {
      this.selection &&
        !this.multi &&
        this.$nextTick(() => this.$refs.multipleTable.clearSelection());
    },
    handleSelectionChange(selection) {
      this.selectRows = selection;
      this.$emit("selection-change", selection);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    getCurrentRow() {
      return this.currentRow;
    },
    getSelectedRows() {
      return this.selectRows;
    },
    selectAll() {
      this.setSelectedRows(this.tableData);
    },
    setSelectedRows(selectedArray) {
      selectedArray.forEach(item => {
        this.$refs.multipleTable.toggleRowSelection(item, true);
      });
    }
  },
  mounted() {
    this.$on("reload", callback => {
      this.load();
    });
    this.$on("toggleLoading", () => {
      this.showLoading = !this.showLoading;
    });
    if (this.tableMinheight) {
      let $tbodyEl = this.$refs.multipleTable.$el.querySelector(
        ".el-table__body-wrapper"
      );
      $tbodyEl.style.minHeight = this.tableMinheight + "px";
    }
    this.$on("replaceItem", (newItem, key) => {
      if (!key) {
        throw "lack of arguments";
      }
      let items = this.tableData;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (newItem[key] !== undefined && newItem[key] === item[key]) {
          this.$set(this.tableData, i, newItem);
          this.selectItemIndex = i;
          return;
        }
      }
    });
    this.$on("addItem", (newItem, selectLast = false) => {
      this.tableData.push(newItem);
    });
    //删除列表项
    this.$on("deleteItem", (val, key, selectLast = false) => {
      if (!val || !key) {
        throw "lack of arguments";
      }
      let items = this.tableData;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item[key] === val) {
          items.splice(i, 1);
        }
      }
    });
  }
};
</script>
