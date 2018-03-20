//index.js
//获取应用实例
const app = getApp()

var flag = true;
var color2 = "window-green";
var rowNum = 4;
var colNum = 4;

Page({
  data: {
    motto: "Hello World",
    color:"window-red",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    userInfo: {},
    dataArray: new Array(16),
    moveDirection: "unknown",
    startPosition: {},
    slideTime: 20,
    gameOverTips: {
      status: true,
      message: "游戏结束！"
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log("onLoad: function");
    if (app.globalData.userInfo) {
      console.log("onLoad: if");
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      console.log("onLoad: else if");
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo, 
          hasUserInfo: true
        })
      }
    } else {
      console.log("onLoad: else");
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.restart();
    console.log("onLoad: function end");
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  click:function(){
    console.log("点击了文字");
    
    if (flag) {
      this.setData({ color: "window-green" });
      flag = false;
    } else {
      this.setData({ color: "window-red" });
      flag = true;
    }
  },

  // 重新开始
  restart: function () {
    var arr = new Array(16);
    arr.fill(0);

    this.setData({
      dataArray: arr
    });

    // 随机生成 2 个数字
    this.randomNum();
    this.randomNum();
  },

  // 随机数字
  randomNum: function () {
    var arr = [];
    this.data.dataArray.map(function(item, i){
      if (item == 0) {
        arr.push(i);
      }
    });

    var num = Math.random() > 0.75 ? 4 : 2;
    var index = arr[Math.floor(Math.random() * arr.length)];
    this.changeData(index, num);
  },

  // 更新数据
  changeData: function (index, num) {
    var changeData = {};
    changeData['dataArray[' + index + ']'] = num;
    this.setData(changeData);
  },

  // 移动开始
  touchStart: function(event) {
    var touch = event.touches[0];
    this.data.startPosition = { x:touch.pageX, y:touch.pageY, time:new Date() };
    this.data.moveDirection = "unknown";
    console.log("touch start!!!");
  }, 

  // 开始移动
  touchMove: function(event) {
    if(event.touches.length > 1 || event.scale && event.scale != 1) {
      return;
    }

    var deltaTime = new Date() - this.data.startPosition.time;
    if (deltaTime > this.data.slideTime && this.data.moveDirection == "unknown") {
      var touch = event.touches[0];
      var x = touch.pageX - this.data.startPosition.x;
      var y = touch.pageY - this.data.startPosition.y;
      if (Math.abs(x) > Math.abs(y)) {  // 左右移动
        if (x > 0) {
          this.data.moveDirection = "right";
          console.log("move right");
        } else {
          this.data.moveDirection = "left";
          console.log("move left");
        }
      } else { // 上下移动
        if (y > 0) {
          this.data.moveDirection = "down";
          console.log("move down");
        } else {
          this.data.moveDirection = "up";
          console.log("move up");
        }
      }
    }
  },

  // 移动结束
  touchEnd: function() {
    console.log("move end !!!");
    var flag = this.gameOver();
    if (flag == true) {
      this.setData({
        gameOverTips:{
          status: true,
          message: "恭喜你，目标达成！"
        }
      });
    } else if (flag == false) {
      this.setData({
        gameOverTips: {
          status: true,
          message: "很遗憾，游戏结束！"
        }
      });
    }
    console.log("move direction = ", this.data.moveDirction);
    if (this.data.moveDirection == "left") {
      this.mergeMove(3, 2, 1, 0);
      this.mergeMove(7, 6, 5, 4);
      this.mergeMove(11, 10, 9, 8);
      this.mergeMove(15, 14, 13, 12);
    } else if (this.data.moveDirection == "right") {
      this.mergeMove(0, 1, 2, 3);
      this.mergeMove(4, 5, 6, 7);
      this.mergeMove(8, 9, 10, 11);
      this.mergeMove(12, 13, 14, 15);
    } else if (this.data.moveDirection == "up") {
      this.mergeMove(12, 8, 4, 0);
      this.mergeMove(13, 9, 5, 1);
      this.mergeMove(14, 10, 6, 2);
      this.mergeMove(15, 11, 7, 3);
    } else if (this.data.moveDirection == "down") {
      this.mergeMove(0, 4, 8, 12);
      this.mergeMove(1, 5, 9, 13);
      this.mergeMove(2, 6, 10, 14);
      this.mergeMove(3, 7, 11, 15);
    }
  },

  // 合并数字
  mergeMove: function (n1, n2, n3, n4) {
    var arr = [n1, n2, n3, n4];

    // 合并
    var pre, next;
    for (var i = arr.length - 1; i > 0; i--) {
      pre = this.data.dataArray[arr[i]];
      if (pre == 0) {
        continue;
      }
      for (j = i-1; j >= 0; j--) {
        next = this.data.dataArray[arr[j]];
        if (next == 0) {
          continue;
        } else if (pre != next) {
          break;
        } else {
          this.changeData(arr[i], next*2);
          this.changeData(arr[j], 0);
          break;
        }
      }
    }

    // 位移
    for (var i = arr.length-1; i > 0; i--) {
      pre = this.data.dataArray[arr[i]];
      if (pre == 0) {
        for (var j = i - 1; j >= 0; j--) {
          next = this.data.dataArray[arr[j]];
          if (next == 0) {
            continue;
          } else {
            this.changeData(arr[i], next);
            this.changeData(arr[j], 0);
          }
          break;
        }
      }
    }
  },

  // 游戏结束
  gameOver: function() {
    // 有值为 2048 后进行提示
    var temp = [];
    var max = 0;
    for (var i = 0; i< this.data.dataArray.length; i++) {
      if (this.data.dataArray[i] == 0) {
        temp.push(i);
      }
      if (this.data.dataArray[i] > max) {
        max = this.data.dataArray[i];
      }
    }
    
    if (max == 2048) {
      // 提示继续
    }

    // 格子满了 并且相邻的两个元素不等
    if(this.moveRight()) {
      return false;
    } else {
      return true;
    }
  },

  // 能否向上移动
  moveUp: function() {
    return false;
  }, 

  // 能否向下移动
  moveDown: function() {
    return false;
  },

  // 能否向左移动
  moveLeft:function() {
    
    return false;
  },

  // 能否向右移动
  moveRight:function() {
    console.log("+++ move right enter !!!")
    for (var row = 3; row >= 0; row--) {
      for (var col = 2; col >= 0; col--) {
        if (this.data.dataArray[row*colNum+col] != 0) {
          if (this.data.dataArray[row * colNum + col + 1] == 0 || 
          this.data.dataArray[row * colNum + col + 1] == this.data.dataArray[row * colNum + col]) {
            console.log("move right true");
            return true;
          }
        }
      }
    }
    console.log("move right false");
    return false;
  }

})