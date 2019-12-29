import Mock from 'mockjs'

let list = []
for(let i=0;i<50;i++){
  list.push(Mock.mock({
    'id|+':1,
    'desc|1':['机电','钣金','喷漆'],
    'name':'@name()',
    'status|1':['维修中','已完成'],
    'item':{
        'type|1':['机电','钣金','喷漆'],
        'name|1':['机电1','钣金1','喷漆1'],
        'code|1':['A01','B01','C03'],
        'timeCost|1-10':1
    },
    mainRepairOperator:'张三',
    repairGroup:'组1',
    orderOperator:'张三',
    orderTime:new Date()
  }))
}

Mock.mock(/\/repair\/item\/query/, 'post', {
  success:true,
  model:list,
  total:100
})


Mock.mock(/\/repairOrder\/item\/query/, 'post', {
  success:true,
  model:list,
  total:100
})

