(
  function(){
    var wxUtils={};
    var TOKEN_HEADNAME="Local_Authorization";
    var LOCAL_USERINFO="localUserInfo";
    var CODE="code";
    var userinfo=null;
    var serverUrl="http://api.juzhen05.com/";
    var localAppid=null;
    var defaulAppid="wx8c6852df92fcfc6b";
    window.localUserInfo=window.localUserInfo||JSON.parse(localStorage.getItem(LOCAL_USERINFO));
    function timeNow(){return parseInt(Date.now()/1e3)}
    function GetQueryString(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
    var r=window.location.search.substr(1).match(reg);
    if(r!=null)return unescape(r[2]);
    return null
  }
  window.GetQueryString=window.GetQueryString||GetQueryString;
  function getToken(){return localStorage.getItem(TOKEN_HEADNAME)}
  function setToken(data){return localStorage.setItem(TOKEN_HEADNAME,data)}
  function localToTpa(url){var tpaUrl="http://wechat.juzhen05.com/tpa_autho.html";var origin=url.split("http://")[1];origin=origin.replace(/\//g,"*");
    if(origin.indexOf("?")>=0){
      origin=origin.split("?")[0];
      origin=origin.split("index.html")[0]}
    if(url.indexOf("?")>=0){
      var arr1=url.split("?");
      var arr2=arr1[1].split("&");
      var num=0;
      for(var i=0;i<arr2.length;i++){
        if(arr2[i].indexOf("code")<0){
          if(num===0
            tpaUrl=tpaUrl+"?"+arr2[i]
          }else{
            tpaUrl=tpaUrl+"&"+arr2[i]}num++
          }
        }
        tpaUrl=tpaUrl+"&origin="+origin
      }else{
        tpaUrl=tpaUrl+"?origin="+origin
      }
      return tpaUrl
    }
    function reAutho(){
      localStorage.clear(TOKEN_HEADNAME);
      localStorage.clear(LOCAL_USERINFO);
      var isWechat=window.location.href.indexOf("wechat.juzhen05.com")>=0;
      var localUrl=location.href;
      if(isWechat){
        window.location.href=authoUrl(localUrl);
        return
      }
      var tpaUrl=localToTpa(localUrl);
      window.location.href=authoUrl(tpaUrl)}
      function authoUrl(url,state){
        var newUrl="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+localAppid+"&redirect_uri="+encodeURIComponent(url)+"&response_type=code&scope=snsapi_userinfo&state="+(state?encodeURIComponent(state):"STATE")+"#wechat_redirect";
        return newUrl
      }
      function weAjax(params,cb){
        if(!params.data){
          params.data={}
      }
      var token=localStorage.getItem(TOKEN_HEADNAME);
      if(token){
        params.data[TOKEN_HEADNAME]=localStorage.getItem(TOKEN_HEADNAME)
      }
      $.ajax({
        type:params.method,url:params.url,data:params.data,dataType:"json",
        success:function(data){
          localStorage.setItem(TOKEN_HEADNAME,token);
          if(!data.error_code){
            if(cb)cb(data.data)
          }else{
            alert(dataJson.data)
          }
        },
        error:function(data){
          alert("è¯·æ±‚å¤±è´¥ï¼š"+data)
        }
      })
    }
    function jssdkConfig(appid,debug,cb){
      $.post(serverUrl+"jssdk_autho",{appid:appid||defaulAppid},
      function(configData){
        localAppid=localAppid||appid||defaulAppid;
        wx.config({
          debug:debug||false,appId:localAppid,timestamp:configData.timestamp,nonceStr:configData.noncestr,signature:configData.signature,jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice","startRecord","stopRecord","onVoiceRecordEnd","playVoice","onVoicePlayEnd","pauseVoice","stopVoice","uploadVoice","downloadVoice","chooseImage","previewImage","uploadImage","downloadImage","getNetworkType","openLocation","getLocation","hideOptionMenu","showOptionMenu","closeWindow","scanQRCode","chooseWXPay","openProductSpecificView","addCard","chooseCard","openCard"]});
          if(cb)
            cb()
          })}
          function userAutho(appid,cb,debug){
            localAppid=localAppid||appid||defaulAppid;
            var token=getToken();
            var code=GetQueryString("code");
            if(token&&localUserInfo){$.post(serverUrl+"checkAutho",{token:token},
            function(data){
              if(!data.error_code){
                if(debug)
                alert("æŽˆæƒåˆ·æ–°æˆåŠŸ");
                setToken(data.token);
                if(cb)cb()
              }else{
                reAutho()
              }
            })
          }else if(code)
          {if(debug)alert("æ­£åœ¨è¯·æ±‚æ–°æŽˆæƒ");
          $.post(serverUrl+"wx_autho",{code:code,appid:localAppid},
            function(data){
              if(!data.error_code){
                localUserInfo=data.userInfo;localStorage.setItem(LOCAL_USERINFO,JSON.stringify(data.userInfo));
                setToken(data.token);
                console.log("æ¬¢è¿Žæ‚¨ :"+data.userInfo.nickname);
                if(debug)alert("æŽˆæƒæˆåŠŸ!");
                if(cb)cb()
              }else{
                if(debug)alert("codeå¤±æ•ˆï¼Œé‡æ–°è¿›è¡ŒæŽˆæƒ!");
                reAutho()
              }
            })}
            else{
              if(debug)
              alert("ä½¿ç”¨é•¿è¿žæŽ¥åœ°å€æŽˆæƒ");
              reAutho()
            }
          }
          function wxShare(shareData){
            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareTimeline(shareData)
          }
          wx.error(function(res){
            console.log(res)
          });
          wxUtils.getUserInfo=function(){
            return JSON.parse(localStorage.getItem(TOKEN_HEADNAME))};
            wxUtils.getToken=getToken;
            wxUtils.setToken=setToken;
            window.weAjax=weAjax;
            window.jssdkConfig=jssdkConfig;
            window.userAutho=userAutho;
            window.authoUrl=authoUrl;
            window.wxUtils=wxUtils;
            window.wxShare=wxShare}
          )();
