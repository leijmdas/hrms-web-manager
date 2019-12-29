<template>
  <div>


    <div class="park-info__search">

        <el-upload
            class="upload-demo"
            ref="upload"
            action="/api/ipark/excel/import/locker"
            name="excelFile"
            :headers="header"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-error="uploadFalse"
            :on-success="uploadSuccess"
            multiple
            :limit="2"
            :data="uploadData"
            :on-exceed="handleExceed"
            accept=".xlsx, .xls"
            :auto-upload="false">

            <el-button slot="trigger" size="middle" type="primary">选取文件</el-button>
            <el-button size="middle" type="success" @click="submitUpload">上传到服务器</el-button>
            <Button type="text" class="button" @click="goto2(lockerInfo)">
              下载车位锁模板
            </Button>
            <Button type="text" class="button" @click="goto(parkPort)">
              下载泊位模板
            </Button>

            <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
        </el-upload>
          <!--<Button @click="downloadTemplate()">下载Word模板</Button>-->
    </div>



    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main" style="width:100%">

      <el-table-column prop="createOn" width="150" label="批量导入日期"></el-table-column>
      <el-table-column prop="status" width="150" label="状态">
        <template slot-scope="scope">{{scope.row.status===1?'异常':'正常'}}</template>
      </el-table-column>
      <el-table-column prop="successNumber" width="150" label="成功数量"></el-table-column>
      <el-table-column prop="failNumber" width="150" label="失败数量"></el-table-column>
      <el-table-column prop="importType" width="150" label="导入类型"></el-table-column>
      <el-table-column prop="operator" width="150" label="操作人"></el-table-column>

      <el-table-column width="150" label="失败详情" >

          <template slot-scope="scope">
           <el-button type="text" title="查看" @click="showRecord(scope.row)" v-show="scope.row.failNumber>0">
            <i class="el-icon-share"></i>
          </el-button>
         </template>

      </el-table-column>
      </v-table>

     <v-dialog title="失败详情" ref="recordDiag" width="900px">
       <import-rec  @saved="onFormSaved"></import-rec>
     </v-dialog>
  </div>
</template>

<script>
import ImportRec from "./ImportRec";
import router, {routers} from '@/router';
const defaultEntity = {
  id: null,
  code: "",
  name: "",

  status: 1,
  remark: ""
};
export default {

  components: {ImportRec},
  data() {
    return {
      isShow:false,
      uploadData:{
      },
      parkPort: '泊位',
      lockerInfo: '车位锁',
      user: router.app.user || {realname: '匿名'},
      header:0,
      page: {
        query: {
          sortBys: "id|desc",
          param: { isDeleted: false,
             parkInfo:{}
          }
        },
        getData: this.$api.ipark.ImportRecordService.query
      }

    };
  },
  watch: {
            '$router.app.user': function (val) {
                this.user = val;
            }
        },
  methods: {
    onFormSaved() {
      this.$nextTick(this.search);
    },
    showRecord(row){
      this.$refs.recordDiag.show({ id: row.id });
    },
    loadMsg() {
      let {user} = router.app;
            },
    goto(name){
      this.$api.ipark.ImportRecordService.downloadParkPort({'name':name}).then(res=>{
        console.log(res);
        this.download(res,name);
      })
    },
    goto2(name){
      this.$api.ipark.ImportRecordService.downloadParkPort({'name':name}).then(res=>{
        console.log(res);
        this.download(res,name);
      })
    },
    download(data,name){
      console.log(data);
      if(!data){
          return
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download',name+'.xlsx');

      document.body.appendChild(link);
      link.click();
    },
    submitUpload() {
      this.uploadData={
      userName:this.user.realname
    }
    console.log(this.uploadData);
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 2 个文件!`);
      },
      handlePreview(file) {
        console.log(file);
      },
      uploadSuccess(response, file, fileList) {

          alert("文件上传完成!");
          this.search();



      },
      uploadFalse(response, file, fileList) {
      alert("文件上传失败！");
    },init(options = {}) {
      this.search();
      this.uploadData={
      userName:this.user.realname
    };
    },
    search() {
      this.$refs.table.load();
    }

  },

  mounted() {
    this.header={
      'Access-Token':window.localStorage.getItem('token_val'),
    };
    this.$on("init", this.init);
  }
};
</script>

<style>
.upload-demo, .park-info__search{
  height: auto !important;
}
.el-upload, .el-upload-dragger {
    width: auto !important;
    height: auto !important;
}

.button {
    background-color: #e7e7e7; /* Green */
    border: none;
    color: black;
    padding: 9px 22px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;

}

.button:hover {
    background-color: white;
}

.demo-block .upload-demo {
    width: auto;
    height: auto;
}

.upload-demo_btn{
  display: flex;
  justify-content: flex-start
}

.el-upload__tip{
  display: block
}

.el-upload-list__item-name{
  display: inline-block
}
/**
.el-upload-list__item-status-label,.el-upload-list__item .el-icon-close,.el-upload-list__item .el-icon-close-tip{
  position: relative;
  height: 100%;
}

.el-upload-list__item .el-icon-close,.el-upload-list__item .el-icon-close-tip,.el-upload-list__item .el-icon-close-tip{
  position: relative;

}
*/
.el-upload-list__item:first-child{
    display:flex;
    justify-content:flex-start;
    align-items:center;
}
.el-table .cell{
  overflow: auto;
  text-overflow: clip;
  white-space: pre-wrap;
}

</style>
