<template>
  <div class="parts-imgs" v-if="showFlag">
    <v-loading ref="loading"></v-loading>
    <v-modal ref="modal"></v-modal>
    <v-layer ref="partsImgs" :width="800" title="图片维护">
      <div slot="content" class="content">
        <div class="operate">
          <span @click="addImage" class="btn red-btn add-image" v-show="canEdit">增加图片(W)</span>
          <input id="uploadImg" class="hide" type="file" multiple="multiple" v-show="canEdit">
          <div class="right">
            <span @click="deleteImage" class="btn delete-image" v-show="canEdit">删除(X)</span>
            <span @click="saveImage" class="btn exit">退出(ESC)</span>
          </div>
        </div>
        <div class="imgs-show clearfix">
          <div class="detail">
            <div class="detail-image">
              <div class="easyzoom easyzoom--overlay">
                <a v-if="curImage.url" :href="curImage.url">
                  <img width="600" height="400" :src="curImage.url">
                </a>
                <a v-else href="/static/images/default.jpg">
                  <img width="600" height="400" src="/static/images/default.jpg">
                </a>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="list-wrap">
              <span @click="partsImagesNav(false)" class="prev" :class="{'disabled': disabledPrev}">上一张</span>
              <ul id="partsImages" class="scroll allow-navigation">
                <li @click="activateImage(index)" :class="{'active': image.active}" v-for="(image, index) in partsImages">
                  <img :src="image.url" alt="">
                </li>
              </ul>
              <span @click="partsImagesNav(true)" class="next" :class="{'disabled': disabledNext}">下一张</span>
            </div>
          </div>
        </div>
      </div>
    </v-layer>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  .parts-imgs{
  .content{
    margin-bottom: -18px;
  }
  .operate{
    padding-top: 2px;
    padding-bottom: 6px;
    overflow: hidden;
  .exit{
    margin-right: 0;
  }
  }
  .imgs-show{
    border-top: 1px dashed #333;
    padding-top: 4px;
    padding-bottom: 8px;
  .detail{
    margin-right: 18px;
    float: left;
  }
  .list{
    float: left;
    height: 400px;
  .list-wrap{
    padding-right: 2px;
  }
  ul{
    overflow: hidden;
    height: 342px;
    margin: 4px 0;
    width: 150px;
    overflow-y: auto;
  li{
    border: 4px solid transparent;
  img{
    width: 142px;
    height: 68px;
    border: 1px solid #d0d0d0;
  }
  }
  li.active{
    border-color: #ff6600;
  }
  }
  .prev, .next{
    display: inline-block;
    width: 98%;
    cursor: pointer;
    line-height: 24px;
    border: 1px solid #333;
    border-radius: 3px;
    text-align: center;
  }
  .next{
  }
  }
  }
  }

  /* Shrink wrap strategy 1 */
  .easyzoom {
    float: left;
    overflow: hidden;
  }
  .easyzoom img {
    display: block;
  }
  /* Shrink wrap strategy 2 */
  .easyzoom {
    display: inline-block;
  }
  .easyzoom img {
    vertical-align: bottom;
  }
</style>
<script>
  import {fetch, KeyCode, FocusTab, assistance} from './../utils'
  import './../assets/js/libraries/easyzoom-debug.js'
  export default {
    name: 'vPicPreview',
    data(){
      return {
        showFlag: false,
      }
    },
    props: {
      imageArr: {
        type: Array,
        default(){
          return []
        }
      },
      num: {
        type: Number,
        default: 3
      },
      index: {
        type: Number,
        default: 0
      },
      canEdit: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      //选中的配件图片
      curImage(){
        return assistance.getItemFromArray(this.partsImages, 'active', true)
      },
      //上一张按钮禁用
      disabledPrev(){
        return this.partsImages.indexOf(this.curImage) === 0
      },
      //下一张按钮禁用
      disabledNext(){
        return this.partsImages.indexOf(this.curImage) === this.partsImages.length - 1
      },
      partsImages () {
        let vm = this;
        this.imageArr.forEach(function (item,index) {
          Vue.set(item,'active',false);
          if(index === vm.index){
            Vue.set(item,'active',true);
          }
        })
        return this.imageArr;
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.$on('togglePad', (showFlag) => {
          this.showFlag = showFlag;
          this.$nextTick(() => {
            if (showFlag) {
              this.togglePartsImgs();
              //初始化图片放大
              $('.easyzoom').easyZoom();
              $('#uploadImg').live('change',this.uploadImg);
            }
          });
        });
        document.body.addEventListener('keydown', this.keysEvent)
      })
    },
    beforeDestroy(){
      $('#uploadImg').die('change', this.uploadImg)
      document.removeEventListener('keydown', this.keysEvent)
    },
    methods: {
      saveImage () {
        let partsImages = $.extend(true, [], this.partsImages);
        this.$emit('set-image', partsImages);
        this.togglePartsImgs();
      },
      //显示隐藏图片维护
      togglePartsImgs(){
        this.$refs.partsImgs.$emit('toggleShow')
      },
      //增加图片
      addImage(){
        if(this.partsImages.length === this.num){
          this.$refs.modal.$emit('ModalTip',  `最多上传${this.num}张图片`);
          return;
        }
        $('#uploadImg').trigger('click')
      },
      //上传图片
      uploadImg(e){
        let data = new FormData()
        let images = e.target.files
        $('#uploadImg').replaceWith('<input id="uploadImg" class="hide" type="file" multiple="multiple">');
        for (let i = 0; i < images.length; i++) {
          let name = images[i].name
          let size = images[i].size
          let type = name.substring(name.lastIndexOf(".")+1).toLowerCase()
          if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            this.$refs.modal.$emit('ModalTip',  '请选择jpg,png的图片格式文件')
            return
          }
          if (size / 1024 > 2000) {
            this.$refs.modal.$emit('ModalTip', '请选择不大于2M的图片')
            return
          }
          data.append('img', images[i])
        }
        if(this.$refs.loading){
          this.$refs.loading.$emit('loadingBegin', '上传中…')
        }
        this.$http.post(`/bs/file/upload`, data).then(({data}) => {
//        this.$http.post(`/bs/quote/uploadQuoteImg`, data).then(({data}) => {
          if(data.state === 0){
          this.partsImages.push({url: data.result.data[0][0]});
          if(this.$refs.loading) {
            this.$refs.loading.$emit('loadingEnd');
          }
          }else{
            fetch.common.fail(data.msg, this);
          if(this.$refs.loading) {
            this.$refs.loading.$emit('loadingEnd');
          }
          }
      }, () => {
          fetch.common.reject()
          if(this.$refs.loading) {
            this.$refs.loading.$emit('loadingEnd')
          }
        })
      },
      //删除图片
      deleteImage(){
        let len = this.partsImages.length;
        let index = this.partsImages.indexOf(this.curImage);
        let activeIndex = index;
        if(len && index !== -1){
          index === len - 1 && (activeIndex = index-1);
          this.partsImages.splice(index,1);
        }
        this.activateImage(activeIndex);
      },
      //点击激活图片
      activateImage(idx){
        this.partsImages.forEach((image, i) => {
          image.active = i===idx
      })
      },
      //配件图片上下导航
      partsImagesNav(isNext){
        let images = this.partsImages
        let curIndex = images.indexOf(this.curImage)
        let nextIndex = curIndex + (isNext ? 1 : -1)
        if(nextIndex >=0 && (nextIndex < images.length)){
          images[curIndex].active = false
          images[nextIndex].active = true
          $('#partsImages').find('li').eq(nextIndex)[0].scrollIntoView()
        }
      },
      keysEvent(e){
        if(this.$refs.partsImgs && this.$refs.partsImgs.show){
          const code = KeyCode.getKeyCode(e);
          switch (code){
            case 'ESC':
                this.saveImage()
              break
            case 'altW':
                this.addImage()
              break
            case 'altX':
                this.deleteImage()
              break
          }
        }
      }
    }
  }
</script>
