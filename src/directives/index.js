import Vue from 'vue'
//快捷键指令
Vue.directive('keycode', {
  bind: function (el, binding, vnode) {

    el.setAttribute('keycode', binding.value)
  }
})
//权限指令
Vue.directive('perm', {
  bind: function (el, binding, vnode) {
    let type = (typeof binding.value)
    switch (type) {
      case 'string':
        if (!Vue.prototype.$hasPermission(binding.value)) {
          el.parentNode.removeChild(el);
        }
        break;
      case 'object':
        let roles = binding.value.roles||[];
        let resCodes = binding.value.resources||[];
        let flag = false;
        if(roles.length>0){
            
            for(let i=0;i<roles.length;i++){
                let r = roles[i]
                if(Vue.prototype.$hasRole(r)){
                    flag = true;
                    break;
                }
            }
        }
        if(resCodes.length>1){
            
            for(let i=0;i<resCodes.length;i++){
                let r = resCodes[i]
                if(Vue.prototype.$hasPermission(r)){
                    flag = true;
                    break;
                }
            }
        }
        if(!flag){
            el.parentNode.removeChild(el);
        }
    }

  }
})




//只读查看指令
function hasClass(element, csName) {

  (element.className || '').match(RegExp('(\\s|^)' + csName + '(\\s|$)')); //使用正则检测是否有相同的样式
}

function addClass(element, csName) {
  if (!hasClass(element, csName)) {
    element.className += ' ' + csName;
  }
}

function removeClass(element, csName) {
  element.className = (element.className || '').replace(RegExp('(\\s|^)' + csName + '(\\s|$)'), ' '); //利用正则捕获到要删除的样式的名称，然后把他替换成一个空白字符串
}

function flushDomDisplay(el, binding) {
  if (binding.oldValue == binding.value) {
    return;
  }
  let className = 'displayForm'
  if (!!binding.value) {
    addClass(el, className)
    let inputs = el.querySelectorAll('input,textarea,select');
    inputs.forEach(input => {
      if (!hasClass(input, 'readOnly')) { //用户定义为只读的，不处理
        input.setAttribute('readOnly', 'readOnly');
      }
    })
  } else {
    removeClass(el, className)
    let inputs = el.querySelectorAll('input,textarea,select');
    inputs.forEach(input => {
      if (!hasClass(input, 'readOnly')) { //用户定义为只读的，不处理
        input.removeAttribute('readOnly')
      }
    })
  }
}
Vue.directive('display', {
  bind: function (el, binding, vnode) {
    let inputs = el.querySelectorAll('input,textarea,select');
    inputs.forEach(input => {
      if (input.hasAttribute('readOnly')) { //用户定义为只读的，不处理
        addClass(input, 'readOnly');
      }
    })

    flushDomDisplay(el, binding)
  },
  componentUpdated(el, binding, vnode) {

    flushDomDisplay(el, binding);
  }
})


//对话框拖动

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
      const dialogHeaderEl = el.querySelector('.el-dialog__header');
      const dragDom = el.querySelector('.el-dialog');
      dialogHeaderEl.style.cursor = 'move';

      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
      
      dialogHeaderEl.onmousedown = (e) => {
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft;
          const disY = e.clientY - dialogHeaderEl.offsetTop;
          
          // 获取到的值带px 正则匹配替换
          let styL, styT;

          // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
          if(sty.left.includes('%')) {
              styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
              styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
          }else {
              styL = +sty.left.replace(/\px/g, '');
              styT = +sty.top.replace(/\px/g, '');
          };
          
          document.onmousemove = function (e) {
              // 通过事件委托，计算移动的距离 
              const l = e.clientX - disX;
              const t = e.clientY - disY;

              // 移动当前元素  
              dragDom.style.left = `${l + styL}px`;
              dragDom.style.top = `${t + styT}px`;

              //将此时的位置传出去
              //binding.value({x:e.pageX,y:e.pageY})
          };

          document.onmouseup = function (e) {
              document.onmousemove = null;
              document.onmouseup = null;
          };
      }  
  }
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
      const dragDom = binding.value.$el.querySelector('.el-dialog');

      el.onmousedown = (e) => {
          
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - el.offsetLeft;
          
          document.onmousemove = function (e) {
              e.preventDefault(); // 移动时禁用默认事件

              // 通过事件委托，计算移动的距离 
              const l = e.clientX - disX;
              dragDom.style.width = `${l}px`;
          };

          document.onmouseup = function (e) {
              document.onmousemove = null;
              document.onmouseup = null;
          };
      }  
  }
});

//数字输入
Vue.directive('numberInt', {
  bind: function (el, binding, vnode) {
    const element = el.getElementsByTagName('input')[0]
    const len = binding.value  // 初始化设置
    element.value = Number(element.value).toFixed(len)  // 失焦时候格式化
    element.addEventListener('blur', function () {
      if (isNaN(element.value)) {
        vnode.data.model.callback(0)
      } else {
        vnode.data.model.callback(Number(element.value).toFixed(len))
      }
    })
  }
});