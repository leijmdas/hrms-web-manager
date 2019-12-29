/**
 * Created by yejunqin on 2016/6/23.
 */
import Vue from 'vue';
import vTable from './v-table.vue'
import vToolbar from './v-toolbar.vue'
import vDialog from './v-dialog.vue'
import vImageUploader from './v-image-uploader.vue'

Vue.component('v-table',vTable);
Vue.component('v-toolbar',vToolbar);
Vue.component('v-dialog',vDialog);
Vue.component('v-image-uploader',vImageUploader);
export {
  vTable,
  vToolbar,
  vDialog,
  vImageUploader
}
