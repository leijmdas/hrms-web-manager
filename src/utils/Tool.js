
export default {
    initLayout(){
        let $mainContainer = document.getElementById("mainContainer");
        let $mainTab = document.getElementById("navTab");
        let height = $mainContainer.offsetHeight - $mainTab.offsetHeight;
      
        let searchPanelHeight = document.getElementsByClassName('panel-search')[0].offsetHeight;
       
        document.getElementsByClassName('panel-main')[0].style.height=(height-searchPanelHeight-80)+'px';

        
    }
}
