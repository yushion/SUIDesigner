window.__apiDocs = window.__apiDocs || {};

function htmlEscape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function buildSections(){
  var container = document.getElementById('sections');
  var html = '';
  var order = ['public','canvas','icon-helpers','messages',
    'button','input','textarea','checkbox','toggle-ctrl','comboBox','label','hyperLink','radiogroup',
    'progressbar','datetimepicker','iconbutton','imagebox','logOutput',
    'listBox','treeView','dataGrid','cardBox','tabcontainer','contextmenu','tooltip','messageBox','inputBox',
    'iconmap','commands'];
  var titles = {
    'public':'通用控件操作','icon-helpers':'图标辅助','messages':'消息与通知','canvas':'画布操作',
    'button':'按钮 Button','input':'输入框 Input','textarea':'文本域 Textarea',
    'checkbox':'复选框 CheckBox','toggle-ctrl':'开关 Toggle','comboBox':'组合框 ComboBox',
    'label':'文本标签 Label','hyperLink':'超链接 Hyperlink','radiogroup':'单选框 RadioGroup',
    'progressbar':'进度条 ProgressBar','datetimepicker':'时间框 DateTimePicker',
    'iconbutton':'图标按钮 IconButton','imagebox':'图片框 ImageBox','logOutput':'日志框 logOutput',
    'listBox':'列表框 listBox','treeView':'树形框 TreeView','dataGrid':'多项表格 DataGrid',
    'cardBox':'卡片框 CardBox','tabcontainer':'标签页 TabContainer','contextmenu':'右键菜单 ContextMenu',
    'tooltip':'气泡提示框 Tooltip','messageBox':'信息提示框 MessageBox','inputBox':'输入对话框 InputBox',
    'iconmap':'图标占位符映射表','commands':'命令分发处理'
  };

  for(var i=0;i<order.length;i++){
    var key = order[i];
    html += '<div class="section" id="section-'+key+'">';
    html += '<div class="section-header">';
    html += '<h2>'+titles[key]+'</h2>';
    html += '<div class="h2-meta">';

    if(key==='iconmap'){
      html += '<span class="ctrl-badge">webviewBridge.api</span></div></div>';
      html += '<p style="margin-bottom:14px;color:#555">IconManager 支持的图标占位符与 emoji 对应关系。在文本中使用 <code>[NAME]</code> 或 <code>{NAME}</code> 格式即可自动转换。共 <strong>'+window.__iconMapData.length+'</strong> 个映射。</p>';
      html += '<input type="text" class="search-box" placeholder="搜索图标..." oninput="filterIcons(this.value)" style="max-width:320px;">';
      html += '<div class="table-wrap"><table class="data-table icon-table" id="iconTable"><thead><tr><th>Emoji</th><th>占位符</th><th>别名</th></tr></thead><tbody id="iconTbody">';
      var iconRows='';
      var seenEmoji={};
      for(var j=0;j<window.__iconMapData.length;j++){
        var row=window.__iconMapData[j];
        var emojiKey=row[1];
        if(seenEmoji[emojiKey]){
          seenEmoji[emojiKey]+=', '+row[0];
        }else{
          seenEmoji[emojiKey]=row[0];
        }
      }
      var emojiKeys=Object.keys(seenEmoji);
      for(var k=0;k<emojiKeys.length;k++){
        var ek=emojiKeys[k];
        var aliases=seenEmoji[ek];
        var mainAlias=aliases.split(', ')[0];
        iconRows+='<tr data-search="'+aliases.toLowerCase()+' '+ek+'"><td><code>'+ek+'</code></td><td>['+mainAlias+']</td><td style="font-size:12px;color:#888;text-align:center;line-height:30px">'+aliases+'</td></tr>';
      }
      html+=iconRows+'</tbody></table></div>';

    }else if(key==='commands'){
      html += '<span class="ctrl-badge">webviewBridge.api</span></div></div>';
      html += '<p style="margin-bottom:14px;color:#555">通过 <code>window.chrome.webview.postMessage(JSON)</code> 发送命令，由 <code>dispatchCommand</code> 统一处理。接收字段为 <code>command</code> 或 <code>cmd</code>。</p>';
      html += '<div class="table-wrap"><table class="data-table"><thead><tr><th>命令名</th><th>功能</th><th>参数映射</th><th>示例</th></tr></thead><tbody>';
      for(var c=0;c<window.__commandsData.length;c++){
        var cmd=window.__commandsData[c];
        html+='<tr><td><code>'+cmd.cmd+'</code></td><td>'+cmd.desc+'</td><td style="font-size:12px">'+cmd.maps+'</td><td><div class="code-block" style="margin:0" data-code="'+htmlEscape(cmd.ex)+'"><div class="code-block-header"><span class="lang-label">JSON</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>'+htmlEscape(cmd.ex)+'</code></pre></div></td></tr>';
      }
      html+='</tbody></table></div>';

    }else if(window.__apiDocs[key]){
      var methods = window.__apiDocs[key];
      html += '<span class="ctrl-badge">共 <strong>'+methods.length+'</strong> 个方法</span></div></div>';
      for(var m=0;m<methods.length;m++){
        var method=methods[m];
        html+='<div class="api-item">';
        html+='<div class="api-signature"><span class="sig-inner">'+method.sig+'</span></div>';
        html+='<div style="padding:20px;"> <div class="api-desc">'+method.desc+'</div>';
        if(method.params.length>0){
          html+='<div class="api-params"><table><thead><tr><th>参数名</th><th>类型</th><th>说明</th></tr></thead><tbody>';
          for(var p=0;p<method.params.length;p++){
            var par=method.params[p];
            html+='<tr><td><code>'+par.n+'</code></td><td><code>'+par.t+'</code></td><td>'+par.d+'</td></tr>';
          }
          html+='</tbody></table></div>';
        }
        html+='<div class="api-returns"><strong style="user-select: none;"><span style="margin-right: 3px;color: #ff2c20;">↪</span>返回值：</strong> <code>'+method.ret+'</code></div>';
        html+='<div class="tab-bar">';
        html+='<button class="tab-btn active" onclick="switchTab(this,\'api\')">API 调用示例</button>';
        html+='<button class="tab-btn" onclick="switchTab(this,\'cmd\')">命令分发示例</button>';
        html+='</div>';
        html+='<div class="tab-content active" data-tab="api">';
        html+='<div class="code-block" data-code="'+htmlEscape(method.exApi)+'"><div class="code-block-header"><span class="lang-label">JavaScript</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code class="language-javascript">'+htmlEscape(method.exApi)+'</code></pre></div>';
        html+='</div>';
        html+='<div class="tab-content" data-tab="cmd">';
        html+='<div class="code-block" data-code="'+htmlEscape(method.exCmd)+'"><div class="code-block-header"><span class="lang-label">JSON (postMessage)</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code class="language-json">'+htmlEscape(method.exCmd)+'</code></pre></div>';
        html+='</div></div>';
        html+='</div>';
      }
    }
    html+='</div>';
  }
  container.innerHTML=html;
}

function showSection(key,linkEl){
  var intro = document.getElementById('intro');
  if(intro) intro.style.display='none';
  var all=document.querySelectorAll('.section');
  for(var i=0;i<all.length;i++) all[i].classList.remove('active');
  var sec=document.getElementById('section-'+key);
  if(sec) sec.classList.add('active');
  var links=document.querySelectorAll('.sidebar a');
  for(var j=0;j<links.length;j++) links[j].classList.remove('active');
  if(linkEl) linkEl.classList.add('active');
  if(history.pushState){
    history.pushState(null,'','#'+key);
  }else{
    location.hash = key;
  }
  setTimeout(function(){ if(window.hljs) hljs.highlightAll(); },50);
}

function switchTab(btn,tabName){
  var item=btn.closest('.api-item');
  var btns=item.querySelectorAll('.tab-btn');
  for(var i=0;i<btns.length;i++) btns[i].classList.remove('active');
  btn.classList.add('active');
  var tabs=item.querySelectorAll('.tab-content');
  for(var j=0;j<tabs.length;j++){
    if(tabs[j].getAttribute('data-tab')===tabName){
      tabs[j].classList.add('active');
    }else{
      tabs[j].classList.remove('active');
    }
  }
}

function copyPrompt(id, btn){
  var box=document.getElementById(id);
  if(!box) return;
  var clone=box.cloneNode(true);
  var innerBtn=clone.querySelector('.copy-prompt');
  if(innerBtn) innerBtn.remove();
  var text=clone.textContent||clone.innerText||'';
  // 如果没传 btn，从原 DOM 中找这个 prompt-box 内的 copy-prompt 按钮
  if(!btn){
    btn=box.querySelector('.copy-prompt');
  }
  copyCodeDirect(text.trim(), btn);
}

function copyCodeDirect(code, feedbackEl){
  navigator.clipboard.writeText(code).then(function(){
    if(feedbackEl){
      feedbackEl.textContent='已复制';
      feedbackEl.classList.add('copied');
      setTimeout(function(){
        feedbackEl.textContent='复制提示词';
        feedbackEl.classList.remove('copied');
      },1500);
    }
  }).catch(function(){
    var ta=document.createElement('textarea');
    ta.value=code;
    ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if(feedbackEl){
      feedbackEl.textContent='已复制';
      feedbackEl.classList.add('copied');
      setTimeout(function(){
        feedbackEl.textContent='复制提示词';
        feedbackEl.classList.remove('copied');
      },1500);
    }
  });
}

function copyCodeFromBlock(btn){
  var block = btn.closest('.code-block');
  var code = block.getAttribute('data-code');
  if(!code){
    var pre = block.querySelector('pre code');
    code = pre ? pre.textContent : '';
  }
  copyCodeWithFeedback(btn, code);
}

function copyCodeWithFeedback(btn, code){
  navigator.clipboard.writeText(code).then(function(){
    showCopyFeedback(btn);
  }).catch(function(){
    var ta=document.createElement('textarea');
    ta.value=code;
    ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopyFeedback(btn);
  });
}

function showCopyFeedback(btn){
  btn.textContent='已复制';
  btn.classList.add('copied');
  setTimeout(function(){
    btn.textContent='复制';
    btn.classList.remove('copied');
  },1500);
}

function copyCode(btn,code){
  code=code.replace(/\\'/g,"'").replace(/\\n/g,'\n');
  copyCodeWithFeedback(btn, code);
}

function filterNav(query){
  var items=document.querySelectorAll('.sidebar .nav-item');
  var groups=document.querySelectorAll('.sidebar .nav-group');
  var q=query.toLowerCase();
  for(var i=0;i<items.length;i++){
    var a=items[i].querySelector('a');
    var text=(a.textContent||'').toLowerCase();
    if(q===''||text.indexOf(q)>=0){
      items[i].style.display='';
    }else{
      items[i].style.display='none';
    }
  }
}

function filterIcons(query){
  var rows=document.querySelectorAll('#iconTbody tr');
  var q=query.toLowerCase();
  for(var i=0;i<rows.length;i++){
    var ds=rows[i].getAttribute('data-search')||'';
    rows[i].style.display=(q===''||ds.indexOf(q)>=0)?'':'none';
  }
}

function toggleSidebar(){
  var sb=document.getElementById('sidebar');
  var ov=document.getElementById('overlay');
  sb.classList.toggle('open');
  ov.classList.toggle('show');
}

function loadDevGuide(){
  var section = document.getElementById('section-dev-guide');
  if(!section) return;
  
  // 如果已经加载过了，直接返回
  if(section.dataset.loaded === 'true') return;
  
  fetch('docs/data/dev-guide.html')
    .then(function(response){ return response.text(); })
    .then(function(html){
      section.innerHTML = html;
      section.dataset.loaded = 'true';
      initDevGuideCopyButtons();
      if(window.hljs) hljs.highlightAll();
    })
    .catch(function(err){
      console.error('加载 dev-guide.html 失败:', err);
      // 降级：如果 window.__devGuideHTML 存在则使用
      if(window.__devGuideHTML){
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = window.__devGuideHTML;
        var innerSection = tempDiv.querySelector('.section');
        if(innerSection){
          section.innerHTML = innerSection.innerHTML;
        }else{
          section.innerHTML = window.__devGuideHTML;
        }
        initDevGuideCopyButtons();
      }
    });
}

function initDevGuideCopyButtons(){
  var section = document.getElementById('section-dev-guide');
  if(!section) return;
  
  var blocks = section.querySelectorAll('.code-block');
  for(var i=0;i<blocks.length;i++){
    var pre = blocks[i].querySelector('pre code');
    if(pre){
      var code = pre.textContent;
      blocks[i].setAttribute('data-code', code);
      var btn = blocks[i].querySelector('.copy-btn');
      if(btn){
        btn.setAttribute('onclick', 'copyCodeFromBlock(this)');
      }
    }
  }
  
  var promptBoxes = section.querySelectorAll('.prompt-box');
  for(var j=0;j<promptBoxes.length;j++){
    var copyBtn = promptBoxes[j].querySelector('.copy-prompt');
    if(copyBtn){
      copyBtn.setAttribute('onclick', 'copyPrompt(this.parentElement.id, this)');
    }
  }
}

document.addEventListener('DOMContentLoaded',function(){
  loadDevGuide();
  buildSections();
  if(window.hljs) hljs.highlightAll();

  var hash = location.hash.replace('#','');
  if(hash){
    var allLinks = document.querySelectorAll('.sidebar a');
    var targetLink = null;
    for(var i=0;i<allLinks.length;i++){
      if(allLinks[i].getAttribute('onclick') && allLinks[i].getAttribute('onclick').indexOf("'"+hash+"'") >= 0){
        targetLink = allLinks[i];
        break;
      }
    }
    if(targetLink){
      showSection(hash, targetLink);
    }else{
      document.getElementById('section-dev-guide').classList.add('active');
      var intro = document.getElementById('intro');
      if(intro) intro.style.display='none';
      var devLink=document.querySelector('.sidebar a[onclick*="dev-guide"]');
      if(devLink) devLink.classList.add('active');
    }
  }else{
    document.getElementById('section-dev-guide').classList.add('active');
    var intro2 = document.getElementById('intro');
    if(intro2) intro2.style.display='none';
    var devLink2=document.querySelector('.sidebar a[onclick*="dev-guide"]');
    if(devLink2) devLink2.classList.add('active');
  }
});
