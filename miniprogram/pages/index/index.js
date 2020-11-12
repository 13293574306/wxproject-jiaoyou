
const db = wx.cloud.database()

Page({
  /**
   * 页面初始数据
   */
  data: {
    imgUrls: [
      'https://images1.jyimg.com/w4/register/i/landing_page_new/photo/93_20121126111652727_s.jpg',
      'https://images1.jyimg.com/w4/register/i/landing_page_new/photo/13_20130807104257197_s.jpg',
      'https://images1.jyimg.com/w4/register/i/landing_page_new/photo/55_20130226041023786_s.jpg'
    ],
    listData: [],
    current: 'links'
  },

  /*
    生命周期函数---监听页面初次渲染完成
  */ 
 onReady: function() {
   this.getListData();
 },
 handleLinks(ev) {
   let id = ev.target.dataset.id;

  //  db.collection('users').doc(id).update({
  //    data: {
  //      links: 5
  //    }
  //  }).then((res)=>{
  //    console.log(res)
  //  })

  wx.cloud.callFunction({
    name: 'update',
    data: {
      collection: 'users',
      doc: id,
      data: "{links: _.inc(1)}"
    }
  }).then((res)=>{
    // console.log(res);
    let updated = res.result.stats.updated;
    if(updated) {
      let cloneListData = [...this.data.listData];
      for (let i = 0; i < cloneListData.length; i++){
        if (cloneListData[i]._id == id) {
          cloneListData[i].links++;
        }
      }
      this.setData({
        listData: cloneListData
      })
    }
  })
 },
 handleCurrent(ev){
    let current = ev.target.dataset.current;
    if(current == this.data.current){
      return false;
    }
    this.setData({
      current
    },()=>{
      this.getListData();
    });
    
 },
 getListData() {
  db.collection('users').field({
    userPhoto: true,
    nickName: true,
    links: true
  })
  .orderBy(this.data.current, 'desc')
  .get()
  .then((res)=>{
    this.setData({
      listData: res.data
    })
  })
 },
 handleDetail(ev){
    let id = ev.target.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id,
    })
 }
  
})