/**
 * @file PropertyPanel.vue
 * @description 右侧属性面板 - 显示画布属性或选中控件的属性，包含样式源码编辑器
 * @update 增加右键菜单/气泡框预览弹窗的标题栏拖拽移动功能
 */
<template>
  <div class="property-panel">

    <!-- 信息提示框全局配置 -->
    <div v-if="store.messageBoxPanelVisible" class="property-tabs-wrapper">
      <div class="appletab-bar">
        <div class="appletab-btn" :class="{ active: mbActiveTab === 'basic' }" @click="mbActiveTab = 'basic'">属性编辑</div>
        <div class="appletab-btn" :class="{ active: mbActiveTab === 'css' }" @click="mbActiveTab = 'css'">样式编辑</div>
      </div>
      <div v-show="mbActiveTab === 'basic'" class="property-form">
        <div class="props-section">
          <div class="props-section-title" style="display:flex;align-items:center;justify-content:space-between;">
            <span>📢 信息框全局配置</span>
                <button class="ctx-preview-altbtn" @click="messageBoxPreview" title="预览">预览</button>
              </div>
              <div class="form-group">
                <label>标题</label>
                <input 
                  :value="store.messageBoxConfig.title" 
                  @input="onMBPropChange('title', $event)" 
                  placeholder="提示标题" 
                  :style="{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '4px 8px',
                    fontSize: '13px',
                    fontFamily: 'Segoe UI Variable, Segoe UI, sans-serif',
                    color: '#1a1a1a',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }"
                  @focus="($event.target as HTMLElement).style.borderColor = '#1890ff'; "
                  @blur="($event.target as HTMLElement).style.borderColor = '#1890ff'; "
                />
              </div>
              <div class="form-group">
                <label>消息内容</label>
                <textarea :value="store.messageBoxConfig.message" @input="onMBPropChange('message', $event)" rows="4" placeholder="支持图标占位符 [info] [warning] [error] [question]" style="font-size:12px;resize:vertical;width:100%;box-sizing:border-box;"></textarea>
              </div>
              <div class="form-group">
                <label>图标类型</label>
                <select :value="store.messageBoxConfig.icon" @change="onMBPropChange('icon', $event)">
                  <option value="none">无图标</option>
                  <option value="info">信息 ℹ️</option>
                  <option value="warning">警告 ⚠️</option>
                  <option value="error">错误 ❌</option>
                  <option value="question">询问 ❓</option>
                  <option value="custom">自定义</option>
                </select>
              </div>
              <div v-if="store.messageBoxConfig.icon === 'custom'" class="form-group">
                <label style="display:flex;align-items:center;gap:4px;">
                  自定义图标
                  <span style="color:#999;font-weight:normal;font-size:11px">(emoji / 文字符号)</span>
                </label>
                <input :value="store.messageBoxConfig.customIcon" @input="onMBPropChange('customIcon', $event)" placeholder="输入 emoji 或符号，如 🎉 ❤️ ✓" maxlength="10" />
              </div>
              <div class="form-group">
                <label>按钮组合</label>
                <select :value="store.messageBoxConfig.buttons" @change="onMBPropChange('buttons', $event)">
                  <option value="ok">确定</option>
                  <option value="okcancel">确定 + 取消</option>
                  <option value="yesno">是 + 否</option>
                  <option value="yesnocancel">是 + 否 + 取消</option>
                  <option value="retrycancel">重试 + 取消</option>
                </select>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;gap:4px;">
                  按钮高亮索引
                  <span style="color:#999;font-weight:normal;font-size:11px">(0=第1个按钮获得高亮样式)</span>
                </label>
                <input type="number" :value="store.messageBoxConfig.defaultButton" @input="onMBPropChange('defaultButton', $event)" min="0" max="3" />
              </div>
              <div class="form-row">
                <div class="form-group half">
                  <label>宽度 (px)</label>
                  <input type="number" :value="store.messageBoxConfig.width" @input="onMBPropChange('width', $event)" min="200" max="800" />
                </div>
                <div class="form-group half">
                  <label>高度 (px, 0=自适应)</label>
                  <input type="number" :value="store.messageBoxConfig.height" @input="onMBPropChange('height', $event)" min="0" max="800" />
                </div>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;gap:8px;">
                  <input type="checkbox" :checked="store.messageBoxConfig.showOverlay" @change="onMBPropCheck('showOverlay', $event)" />
                  显示蒙版
                </label>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;gap:8px;">
                  <input type="checkbox" :checked="store.messageBoxConfig.closeOnOverlayClick" @change="onMBPropCheck('closeOnOverlayClick', $event)" />
                  点击蒙版关闭
                </label>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;justify-content:space-between;">
                    <span>透明度</span>
                  <span style="font-size:11px;color:#86868b;font-weight:normal;">{{ Math.round((store.messageBoxConfig.opacity ?? 1) * 100) }}%</span>
                </label>
                <input
                  type="range"
                  :value="(store.messageBoxConfig.opacity ?? 1) * 100"
                  @input="onMBOpacityChange($event)"
                  min="0"
                  max="100"
                  step="1"
                  style="width:100%;"
                />
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;gap:8px;">
                  <input type="checkbox" :checked="store.messageBoxConfig.draggable" @change="onMBPropCheck('draggable', $event)" />
                  可拖动标题栏
                </label>
              </div>
            </div>
          </div>
        <!-- 标签2：样式编辑 -->
        <div v-show="mbActiveTab === 'css'" class="css-editor-panel">
          <CssEditor
            widget-id="messageBox"
            :model-value="store.messageBoxConfig.customCSS || ''"
            maximizable
            @change="onMBCssChange"
          />
        </div>
    </div>

    <!-- 输入框全局配置面板 -->
    <div v-else-if="store.inputBoxPanelVisible" class="property-tabs-wrapper">
      <div class="appletab-bar">
        <div class="appletab-btn" :class="{ active: ibActiveTab === 'basic' }" @click="ibActiveTab = 'basic'">属性编辑</div>
        <div class="appletab-btn" :class="{ active: ibActiveTab === 'css' }" @click="ibActiveTab = 'css'">样式编辑</div>
      </div>
      <div v-show="ibActiveTab === 'basic'" class="property-form">
        <div class="props-section">
          <div class="props-section-title" style="display:flex;align-items:center;justify-content:space-between;">
            <span>✏️ 输入框全局配置</span>
                <button class="ctx-preview-altbtn" @click="inputBoxPreview" title="预览">预览</button>
              </div>
              <div class="form-group">
                <label>标题</label>
                <input :value="store.inputBoxConfig.title" @input="onIBPropChange('title', $event)" placeholder="对话框标题"
                  :style="{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '4px 8px',
                    fontSize: '13px',
                    fontFamily: 'Segoe UI Variable, Segoe UI, sans-serif',
                    color: '#1a1a1a',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }"
                  @focus="($event.target as HTMLElement).style.borderColor = '#1890ff'; "
                  @blur="($event.target as HTMLElement).style.borderColor = '#1890ff'; "
                />
              </div>
              <div class="form-group">
                <label>提示文本</label>
                <textarea :value="store.inputBoxConfig.prompt" @input="onIBPropChange('prompt', $event)" rows="3" placeholder="支持图标占位符 [info] [warning] [error] [question]" style="font-size:12px;resize:vertical;width:100%;box-sizing:border-box;"></textarea>
              </div>
              <div class="form-group">
                <label>默认值</label>
                <input :value="store.inputBoxConfig.defaultValue" @input="onIBPropChange('defaultValue', $event)" placeholder="输入框初始内容" 
                  :style="{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '4px 8px',
                    fontSize: '13px',
                    fontFamily: 'Segoe UI Variable, Segoe UI, sans-serif',
                    color: '#1a1a1a',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }"
                  @focus="($event.target as HTMLElement).style.borderColor = '#1890ff'; "
                  @blur="($event.target as HTMLElement).style.borderColor = '#1890ff'; "
                />
              </div>
              <div class="form-group">
                <label>输入类型</label>
                <select :value="store.inputBoxConfig.inputType" @change="onIBPropChange('inputType', $event)">
                  <option value="text">文本 text</option>
                  <option value="number">数字 number</option>
                  <option value="password">密码 password</option>
                </select>
              </div>
              <div class="form-group">
                <label>按钮组合</label>
                <select :value="store.inputBoxConfig.buttons" @change="onIBPropChange('buttons', $event)">
                  <option value="ok">确定</option>
                  <option value="okcancel">确定 + 取消</option>
                </select>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;gap:4px;">
                  按钮高亮索引
                  <span style="color:#999;font-weight:normal;font-size:11px">(0=第1个按钮获得高亮样式)</span>
                </label>
                <input type="number" :value="store.inputBoxConfig.defaultButton" @input="onIBPropChange('defaultButton', $event)" min="0" max="1" />
              </div>
              <div class="form-row">
                <div class="form-group half">
                  <label>宽度 (px)</label>
                  <input type="number" :value="store.inputBoxConfig.width" @input="onIBPropChange('width', $event)" min="200" max="800" />
                </div>
                <div class="form-group half">
                  <label>高度 (px, 0=自适应)</label>
                  <input type="number" :value="store.inputBoxConfig.height" @input="onIBPropChange('height', $event)" min="0" max="800" />
                </div>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;gap:8px;">
                  <input type="checkbox" :checked="store.inputBoxConfig.showOverlay" @change="onIBPropCheck('showOverlay', $event)" />
                  显示蒙版
                </label>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;gap:8px;">
                  <input type="checkbox" :checked="store.inputBoxConfig.closeOnOverlayClick" @change="onIBPropCheck('closeOnOverlayClick', $event)" />
                  点击蒙版关闭
                </label>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;justify-content:space-between;">
                  <span>透明度</span>
                  <span style="font-size:11px;color:#86868b;font-weight:normal;">{{ Math.round((store.inputBoxConfig.opacity ?? 1) * 100) }}%</span>
                </label>
                <input
                  type="range"
                  :value="(store.inputBoxConfig.opacity ?? 1) * 100"
                  @input="onIBOpacityChange($event)"
                  min="0"
                  max="100"
                  step="1"
                  style="width:100%;"
                />
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;gap:8px;">
                  <input type="checkbox" :checked="store.inputBoxConfig.draggable" @change="onIBPropCheck('draggable', $event)" />
                  可拖动标题栏
                </label>
              </div>
            </div>
          </div>
        <!-- 标签2：样式编辑 -->
        <div v-show="ibActiveTab === 'css'" class="css-editor-panel">
          <CssEditor
            widget-id="inputBox"
            :model-value="store.inputBoxConfig.customCSS || ''"
            maximizable
            @change="onIBCssChange"
          />
        </div>
      </div>

    <!-- 画布属性 -->
    <div v-else-if="store.isCanvasSelected" class="property-tabs-wrapper">
      <div class="appletab-bar">
        <div class="appletab-btn" :class="{ active: canvasActiveTab === 'props' }" @click="canvasActiveTab = 'props'">属性编辑</div>
        <div class="appletab-btn" :class="{ active: canvasActiveTab === 'css' }" @click="canvasActiveTab = 'css'">样式编辑</div>
      </div>
      <div v-show="canvasActiveTab === 'props'" class="property-form">
        <div class="props-section">
          <div class="props-section-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
              <span>画布属性</span>
              <span style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:400;color:#555;">
                主题样式:
                <select class="canvas-theme-selector" :value="themeStore.currentThemeId" @change="onPanelThemeChange">
                  <option v-for="t in allThemes" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
              </span>
            </div>
              <div class="form-group">
                <label>UI标题</label>
                <input type="text" :value="store.canvas.title || '标题'" @input="onCanvasChange('title', $event)" placeholder="标题" />
              </div>
              <div class="form-row">
                <div class="form-group half">
                  <label>宽度</label>
                  <input type="number" :value="store.canvas.width" @input="onCanvasChange('width', $event)" min="100" />
                </div>
                <div class="form-group half">
                  <label>高度</label>
                  <input type="number" :value="store.canvas.height" @input="onCanvasChange('height', $event)" min="100" />
                </div>
              </div>
              <div class="form-row" style="margin-top: 4px; margin-bottom:8px;border-bottom:1px solid #e5e6eb;padding-bottom:8px;">
                <div class="form-group half">
                  <label class="checkbox-label">
                    <input type="checkbox" :checked="store.canvas.canvasFixedSize" @change="onCanvasChange('canvasFixedSize', $event)" />
                    固定画布宽高
                  </label>
                </div>
                <div class="form-group half">
                  <label class="checkbox-label">
                    <input type="checkbox" :checked="store.canvas.disableMinimize" @change="onCanvasChange('disableMinimize', $event)" />
                    禁止最小化
                  </label>
                </div>
              </div>
			  <div class="form-row">
                <div class="form-group half">
                  <label>背景色</label>
                  <input type="color" :value="store.canvas.backgroundColor" @input="onCanvasChange('backgroundColor', $event)" />
                </div>
                <div class="form-group half">
                  <label>边框色</label>
                  <input type="color" :value="store.canvas.borderColor" @input="onCanvasChange('borderColor', $event)" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group half">
                  <label>边框宽度</label>
                  <input type="number" :value="store.canvas.borderWidth" @input="onCanvasChange('borderWidth', $event)" min="0" />
                </div>
                <div class="form-group half">
                  <label>圆角<small style="color:rgb(38 0 231);">(Win11大圆角:8px)</small></label>
                  <input type="number" :value="store.canvas.borderRadius" @input="onCanvasChange('borderRadius', $event)" min="0" />
                </div>
              </div>
              <div class="form-group"  style="margin-top:8px;border-top:1px solid #e5e6eb;padding-top:4px">
                <label class="checkbox-label">
                  <input type="checkbox" :checked="store.canvas.canvasDraggable" @change="onCanvasChange('canvasDraggable', $event)" />
                  画布区可拖拽<small>（仅预览中生效）</small>
                </label>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" disabled :checked="store.canvas.glassEffect" @change="onCanvasChange('glassEffect', $event)" />
                  毛玻璃效果<small>（仅预览中生效）</small>
                </label>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" disabled :checked="store.canvas.showShadow" @change="onCanvasChange('showShadow', $event)" />
                  显示边框阴影<small>（已弃用,客户端自行控制）</small>
                </label>
              </div>
              <div class="form-group" style="margin-top:2px;border-bottom:1.5px dashed rgb(161 161 161);padding-bottom:14px;">
                <label style="display:flex;align-items:center;justify-content:space-between;">
                  <span>画布透明度</span>
                  <span style="font-size:11px;color:#86868b;font-weight:normal;">{{ Math.round((store.canvas.opacity ?? 1) * (store.canvas.masterOpacity ?? 1) * 100) }}%</span>
                </label>
                <input
                  type="range"
                  :value="(store.canvas.opacity ?? 1) * (store.canvas.masterOpacity ?? 1) * 100"
                  @input="onCanvasOpacityChange($event)"
                  min="0"
                  max="100"
                  step="1"
                  style="width:100%;height:10px;"
                />
              </div>
			  <div class="form-group" style="margin-top:12px;padding-bottom:4px;">
			  <!-- ===== 底部背景（模拟真实页面 body 背景） ===== -->
				<div class="props-section" style="margin-top:0px;margin-bottom:0px;border-bottom:1px solid #e5e6eb;border-left:6px solid rgb(235 154 1);padding-top:4px;padding-bottom:4px;">
				  <div style="display:flex;align-items:center;justify-content:space-between;">
					<span style="font-weight:bold;font-size:13px;">主题背景图</span>
					<el-switch
					  :model-value="store.canvas.bodyBackground?.enabled ?? false"
					  @change="onBodyBgEnabledChange"
					  size="small"
					/>
				  </div>
				  <div v-if="store.canvas.bodyBackground?.enabled" style="display:flex;flex-direction:column;gap:8px;padding:4px 0;margin-top:8px;">
					<div class="form-group">
					  <div style="font-size:12px;display:flex;align-items:center;justify-content:space-between;">
						<span>
						  背景图片 URL
						  <el-tooltip effect="dark" placement="top" raw-content>
							<template #content>
							  <div style="max-width:260px;font-size:12px;font-weight:400;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
								建议使用略大于画布尺寸的图片，配合<br/>
								<b style="color:rgb(255 96 0);">尺寸模式[auto]</b> + <b style="color:rgb(255 96 0);">位置[center]</b>，<br/>
								即可让背景图仅填充画布区域，<br/>
								超出的部分被自动裁剪。
							  </div>
							</template>
							<span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:#d0d0d0;color:rgb(74 74 74);font-size:11px;font-weight:bold;cursor:help;margin-left:4px;">?</span>
						  </el-tooltip>
						</span>
						<el-button size="small" @click="onBodyBgSelectImage" style="font-size:12px;">选择图片</el-button>
					  </div>
					  <input
						type="text"
						:value="store.canvas.bodyBackground?.imageUrl ?? ''"
						@input="onBodyBgChange('imageUrl', $event)"
						placeholder="https://... 或 ./images/bg.jpg"
						style="width:100%;"
					  />
					</div>
					<div class="form-row" style="display:flex;gap:8px;">
					  <div class="form-group half">
						<label>尺寸模式</label>
						<select :value="store.canvas.bodyBackground?.imageSize ?? 'cover'" @change="onBodyBgChange('imageSize', $event)">
						  <option value="cover">cover（覆盖）</option>
						  <option value="contain">contain（包含）</option>
						  <option value="auto">auto（自动）</option>
						</select>
					  </div>
					  <div class="form-group half">
						<label>位置</label>
						<select :value="store.canvas.bodyBackground?.imagePosition ?? 'center'" @change="onBodyBgChange('imagePosition', $event)">
						  <option value="center">center</option>
						  <option value="top">top</option>
						  <option value="bottom">bottom</option>
						  <option value="left">left</option>
						  <option value="right">right</option>
						  <option value="top left">top left</option>
						  <option value="top right">top right</option>
						  <option value="bottom left">bottom left</option>
						  <option value="bottom right">bottom right</option>
						</select>
					  </div>
					</div>
				  </div>
				</div>
                <label style="display:flex;align-items:center;justify-content:space-between;">
                  <span  style="font-weight:bold;">总控透明度<small style="color:rgb(243 3 3);font-size:11px;font-weight:normal;">（统一调度所有控件）</small></span>
                  <span style="font-size:11px;color:#f6868b;font-weight:normal;">{{ Math.round((store.canvas.masterOpacity ?? 1) * 100) }}%</span>
                </label>
                <input
                  type="range"
                  :value="(store.canvas.masterOpacity ?? 1) * 100"
                  @input="onMasterOpacityChange($event)"
                  min="0"
                  max="100"
                  step="1"
                  style="width:100%;"
                />
              </div>
            </div>
            
            <!-- ===== 标题栏属性 ===== -->
            <div class="props-section" style="margin-top:8px;">
              <div class="props-section-title" style="display:flex;align-items:center;justify-content:space-between;">
                <span>标题栏</span>
                <label class="checkbox-label" style="margin:0;font-weight:normal;font-size:12px;color:#86868b;">
                  <input type="checkbox" :checked="store.canvas.showTitleBar" @change="onCanvasChange('showTitleBar', $event)" style="
                   width:14px; 
                   height:14px; 
                   margin-right:8px; 
                   vertical-align:middle; 
                   cursor:pointer;
                  "/>
                  <span style="vertical-align:middle; line-height:1;">显示标题栏</span>
                </label>
              </div>
              <div v-if="store.canvas.showTitleBar">
              <div class="form-group">
                <label>标题内容</label>
                <input type="text" :value="store.canvas.titleBarTitle" @input="onCanvasChange('titleBarTitle', $event)" placeholder="我的应用" />
              </div>
              <div class="form-group">
                <label>标题位置</label>
                <select :value="store.canvas.titleBarAlign" @change="onCanvasChange('titleBarAlign', $event)">
                  <option value="left">靠左</option>
                  <option value="center">居中</option>
                  <option value="right">靠右</option>
                </select>
              </div>
              <div class="form-group">
                <label>标题栏图标</label>
                <div class="icon-select-group">
                  <div class="icon-select-custom" style="margin-top:4px; margin-bottom:6px;">
                    <input
                      type="text"
                      :value="store.canvas.titleBarIconHtml"
                      @input="onCanvasChange('titleBarIconHtml', $event)"
                      placeholder="自定义图标：如 <i class='fas fa-home'></i>"
                      style="font-size:11px;"
                    />
                  </div>
                  <div class="icon-select-presets">
                    <button
                      v-for="ic in iconPresets"
                      :key="ic.name"
                      :class="{ 'icon-select-item': true, active: store.canvas.titleBarIconName === ic.name && !store.canvas.titleBarIconHtml }"
                      :title="ic.label"
                      @click="onCanvasIconSelect(ic.name)"
                      v-html="`<i class='fas ${ic.name}'></i>`"
                    ></button>
                    <input type="file" accept=".ico,.png,.svg,.jpg,.jpeg,.gif,.bmp" @change="onCanvasIconFileImport" style="display:none;" ref="canvasIconFileInput" />
                    <button type="button" @click="($refs.canvasIconFileInput as HTMLInputElement).click()" style="font-size:11px;padding:2px 8px;cursor:pointer;margin-left:auto;">导入图标</button>
                    <span v-if="store.canvas.titleBarIconHtml" style="font-size:10px;color:#86868b;margin-left:4px;">已导入</span>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group" style="flex:1;min-width:0;">
                  <label>背景色</label>
                  <input type="color" :value="store.canvas.titleBarBgColor" @input="onCanvasChange('titleBarBgColor', $event)" />
                </div>
                <div class="form-group" style="flex:1;min-width:0;">
                  <label>标题颜色</label>
                  <input type="color" :value="store.canvas.titleBarTextColor" @input="onCanvasChange('titleBarTextColor', $event)" />
                </div>
                <div class="form-group" style="flex:1;min-width:0;">
                  <label>按钮颜色</label>
                  <input type="color" :value="store.canvas.titleBarBtnColor" @input="onCanvasChange('titleBarBtnColor', $event)" />
                </div>
              </div>
              <div class="form-group">
                <label style="display:flex;align-items:center;justify-content:space-between;">
                  <span>标题栏透明度<small style="color:#86868b;font-size:11px;">（受总控统一调度）</small></span>
                  <span style="font-size:11px;color:#86868b;font-weight:normal;">{{ Math.round((store.canvas.titleBarOpacity ?? 1) * (store.canvas.masterOpacity ?? 1) * 100) }}%</span>
                </label>
                <input
                  type="range"
                  :value="(store.canvas.titleBarOpacity ?? 1) * (store.canvas.masterOpacity ?? 1) * 100"
                  @input="onCanvasOpacityPropChange('titleBarOpacity', $event)"
                  min="0"
                  max="100"
                  step="1"
                  style="width:100%;"
                />
              </div>
              </div>
            </div>
          </div>
        <!-- 标签2：样式编辑 -->
        <div v-show="canvasActiveTab === 'css'" class="css-editor-panel">
          <CssEditor
            widget-id="canvas"
            :model-value="canvasCSSModel"
            maximizable
            @change="onCanvasCssChange"
          />
        </div>
      </div>

    <!-- 控件属性 - 含标签页切换 -->
    <div v-else-if="store.selectedWidget" class="property-tabs-wrapper">
      <div class="appletab-bar">
        <div class="appletab-btn" :class="{ active: activeTab === 'props' }" @click="activeTab = 'props'">属性编辑</div>
        <div class="appletab-btn" :class="{ active: activeTab === 'css' }" @click="activeTab = 'css'">样式编辑</div>
      </div>
      <div v-show="activeTab === 'props'" class="property-form">
        <!-- 标签1：属性编辑 -->

              <!-- 控件属性 -->
              <div class="props-section">
                <div class="props-section-title">{{ widgetTypeTitle }}</div>

                <!-- 基础属性 -->
                <div class="form-group">
                  <label>控件ID</label>
                  <input type="text" :value="store.selectedWidget.id" disabled class="id-readonly" />
                </div>
                <div class="form-group">
                  <label>控件ID名</label>
                  <input type="text" :value="store.selectedWidget.name" @input="onWidgetPropChange('name', $event)" @blur="onWidgetNameBlur" placeholder="自定义名称" />
                </div>

              <!-- 按钮特有属性 -->
              <div v-if="store.selectedWidget.type === 'button'">
                <div class="form-group">
                  <label>按钮文字</label>
                  <input type="text" :value="store.selectedWidget.text" @input="onWidgetPropChange('text', $event)" />
                </div>
              </div>

              <!-- 编辑框特有属性 -->
              <div v-if="store.selectedWidget.type === 'input'">
                <div class="form-group">
                  <label>占位符</label>
                  <input type="text" :value="store.selectedWidget.placeholder" @input="onWidgetPropChange('placeholder', $event)" />
                </div>
                <div class="form-group">
                  <label>预设内容</label>
                  <input type="text" :value="store.selectedWidget.value" @input="onWidgetPropChange('value', $event)" />
                </div>
                <div class="form-group">
                  <label>输入类型</label>
                  <select :value="store.selectedWidget.inputType" @change="onWidgetPropChange('inputType', $event)">
                    <option value="text">文本</option>
                    <option value="password">密码</option>
                    <option value="email">邮箱</option>
                    <option value="number">数字</option>
                    <option value="tel">电话</option>
                    <option value="url">网址</option>
                  </select>
                </div>
              </div>

              <!-- 复选框特有属性 -->
              <div v-if="store.selectedWidget.type === 'checkbox'">
                <div class="form-group">
                  <label>标签文字</label>
                  <input type="text" :value="store.selectedWidget.labelText" @input="onWidgetPropChange('labelText', $event)" />
                </div>
                <div class="form-group">
                  <label>默认选中</label>
                  <select :value="store.selectedWidget.checked ? 'true' : 'false'" @change="onWidgetPropChange('checked', $event)">
                    <option value="false">否</option>
                    <option value="true">是</option>
                  </select>
                </div>
              </div>

              <!-- 开关特有属性 -->
              <div v-if="store.selectedWidget.type === 'toggle'">
                <div class="form-group">
                  <label>默认状态</label>
                  <select :value="store.selectedWidget.checked ? 'true' : 'false'" @change="onWidgetPropChange('checked', $event)">
                    <option value="false">关闭</option>
                    <option value="true">开启</option>
                  </select>
                </div>
              </div>

              <!-- 多行文本框特有属性 -->
              <div v-if="store.selectedWidget.type === 'textarea'">
                <div class="form-group">
                  <label>占位符</label>
                  <input type="text" :value="store.selectedWidget.placeholder" @input="onWidgetPropChange('placeholder', $event)" />
                </div>
                <div class="form-group">
                  <label>预设内容</label>
                  <textarea :value="store.selectedWidget.value" @input="onWidgetPropChange('value', $event)" rows="3"></textarea>
                </div>
              </div>

              <!-- 标签特有属性 -->
              <div v-if="store.selectedWidget.type === 'label'">
                <div class="form-group">
                  <label>标签文字</label>
                  <input type="text" :value="store.selectedWidget.text" @input="onWidgetPropChange('text', $event)" />
                </div>
              </div>

              <!-- 分割线特有属性 -->
              <div v-if="store.selectedWidget.type === 'divider'">
                <div class="form-group">
                  <label>线段样式</label>
                  <select :value="store.selectedWidget.styleData?.base?.lineStyle || 'solid'" @change="onStyleChange('lineStyle', $event)">
                    <option value="solid">实线 ————</option>
                    <option value="dashed">虚线 ----</option>
                    <option value="dotted">点线 ····</option>
                    <option value="double">双线 ════</option>
                  </select>
                </div>
              </div>

              <!-- 超链接特有属性 -->
              <div v-if="store.selectedWidget.type === 'hyperlink'">
                <div class="form-group">
                  <label>链接文字</label>
                  <input type="text" :value="store.selectedWidget.text" @input="onWidgetPropChange('text', $event)" />
                </div>
                <div class="form-group">
                  <label>链接地址</label>
                  <input type="text" :value="store.selectedWidget.href" @input="onWidgetPropChange('href', $event)" placeholder="https://" />
                </div>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      :checked="store.selectedWidget.showUnderline !== false"
                      @change="onWidgetPropChange('showUnderline', $event)"
                    />
                    <span>显示下划线</span>
                  </label>
                </div>
              </div>

              <!-- 组合框特有属性 -->
              <div v-if="store.selectedWidget.type === 'comboBox'">
                <div class="props-section-title sub-title">选项列表</div>
                <div class="tab-manager">
                  <div v-for="(opt, idx) in (store.selectedWidget.options || [])" :key="idx" class="tab-row">
                    <input
                      type="text"
                      :value="opt"
                      @input="onOptionTitleChange(idx, $event)"
                      class="tab-title-input"
                      :placeholder="'选项 ' + (idx + 1)"
                    />
                    <button
                      v-if="(store.selectedWidget.options || []).length > 1"
                      class="tab-delete-btn"
                      @click="onRemoveOption(idx)"
                      title="删除选项"
                    >×</button>
                  </div>
                  <el-button size="small" class="add-tab-btn" @click="onAddOption">
                    + 添加选项
                  </el-button>
                </div>
                <div class="form-group">
                  <label>默认选中索引</label>
                  <input type="number" :value="store.selectedWidget.selectedIndex" @input="onWidgetPropChange('selectedIndex', $event)" min="0" />
                </div>
              </div>

              <!-- 单选组特有属性 -->
              <div v-if="store.selectedWidget.type === 'radioGroup'">
                <div class="props-section-title sub-title">选项列表</div>
                <div class="tab-manager">
                  <div v-for="(opt, idx) in (store.selectedWidget.options || [])" :key="idx" class="tab-row">
                    <input
                      type="text"
                      :value="opt"
                      @input="onOptionTitleChange(idx, $event)"
                      class="tab-title-input"
                      :placeholder="'选项 ' + (idx + 1)"
                    />
                    <button
                      v-if="(store.selectedWidget.options || []).length > 1"
                      class="tab-delete-btn"
                      @click="onRemoveOption(idx)"
                      title="删除选项"
                    >×</button>
                  </div>
                  <el-button size="small" class="add-tab-btn" @click="onAddOption">
                    + 添加选项
                  </el-button>
                </div>
                <div class="form-group">
                  <label>默认选中</label>
                  <input type="number" :value="store.selectedWidget.selectedIndex" @input="onWidgetPropChange('selectedIndex', $event)" min="0" />
                </div>
                <div class="form-group">
                  <label>排列方式</label>
                  <div class="radio-group-inline">
                    <label><input type="radio" name="radioLayout" value="vertical" :checked="store.selectedWidget.layout !== 'horizontal'" @change="onWidgetPropChange('layout', $event, 'vertical')" /> 纵向</label>
                    <label><input type="radio" name="radioLayout" value="horizontal" :checked="store.selectedWidget.layout === 'horizontal'" @change="onWidgetPropChange('layout', $event, 'horizontal')" /> 横向</label>
                  </div>
                </div>
              </div>

              <!-- 标签页容器特有属性 -->
              <div v-if="store.selectedWidget.type === 'tabsContainer'">
                <div class="props-section-title sub-title" style="display:flex;align-items:center;justify-content:space-between;">标签页管理
                  <label class="hide-tab-header-check" style="font-weight:normal;cursor:pointer;line-height:14px;">
                    <input style="width:14px; 
                   height:15px; 
                   margin-right:5px; 
                   vertical-align:middle; 
                   cursor:pointer;" type="checkbox" :checked="store.selectedWidget.hideTabHeader || false" @change="onHideTabHeaderChange" />
                    <span class="switch-text" style="color:#333;font-size:12px;vertical-align:middle;user-select: none;">{{ store.selectedWidget.hideTabHeader ? '隐藏标签头' : '显示标签头' }}</span>
                  </label>
                </div>
                <div class="tab-manager">
                  <div v-for="(tab, idx) in (store.selectedWidget.tabs || [])" :key="idx" class="tab-row">
                    <input
                      type="text"
                      :value="tab.title"
                      @input="onTabTitleChange(idx, $event)"
                      class="tab-title-input"
                    />
                    <button
                      v-if="(store.selectedWidget.tabs || []).length > 1"
                      class="tab-delete-btn"
                      @click="onRemoveTab(idx)"
                      title="删除标签页"
                    >×</button>
                  </div>
                  <el-button size="small" class="add-tab-btn" @click="onAddTab">
                    + 添加标签页
                  </el-button>
                </div>
              </div>

              <!-- 进度条特有属性 -->
              <div v-if="store.selectedWidget.type === 'progressBar'">
                <div class="form-group">
                  <label>进度值 (0-100)</label>
                  <input type="number" :value="store.selectedWidget.progressValue ?? 0" @input="onWidgetPropChange('progressValue', $event)" min="0" max="100" />
                </div>
                <div class="form-row" style="margin-top: 4px;">
                  <div class="form-group" style="flex:1;">
                    <label style="display:flex;align-items:center;gap:4px;padding-top: 2px;">
                      <input type="checkbox" :checked="store.selectedWidget.showProgressText !== false" @change="onWidgetPropChange('showProgressText', $event)" />
                      <span>显示进度文本</span>
                    </label>
                  </div>
                  <div class="form-group" style="flex:1;justify-content:space-between;">
                    <label style="display:flex;align-items:center;justify-content:space-between;">
                      <span style="font-size:12px;color:#888;line-height: 22px;">进度条颜色:</span>
                      <input type="color" :value="(store.selectedWidget.style as any).barColor || '#0078D4'" @input="onBarColorInput" style="width:55px;height:22px;padding:0;border:none;cursor:pointer;" />
                    </label>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group" style="flex:1;">
                    <label style="display:flex;align-items:center;gap:4px;">
                      <input type="checkbox" :checked="!!store.selectedWidget.editable" @change="onWidgetPropChange('editable', $event)" />
                      <span>进度可动态交互</span>
                    </label>
                  </div>
                  <div class="form-group" v-if="store.selectedWidget.editable" style="flex:1;">
                    <label style="display:flex;align-items:center;gap:4px;">
                      <input type="checkbox" :checked="!!(store.selectedWidget as any).draggable" @change="onWidgetPropChange('draggable', $event)" />
                      <span>拖拽修改进度</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 时间框特有属性 -->
              <div v-if="store.selectedWidget.type === 'datetimePicker'">
                <div class="form-group">
                  <label>日期时间</label>
                  <input type="text" :value="store.selectedWidget.value" @input="onWidgetPropChange('value', $event)" placeholder="YYYY-MM-DDThh:mm" />
                </div>
              </div>

              <!-- 日志输出特有属性 -->
              <div v-if="store.selectedWidget.type === 'logOutput'">
                <div class="props-section-title sub-title">日志列表</div>
                <div class="log-list">
                  <div v-for="(log, idx) in store.selectedWidget.logs || []" :key="idx" class="log-row">
                    <span class="log-index">{{ idx + 1 }}</span>
                    <span class="log-color-swatch" :style="{ background: log.color || '#000000' }"></span>
                    <span class="log-text-preview">{{ log.text }}</span>
                    <button class="log-del-btn" title="删除此条" @click="store.removeLog(store.selectedWidget.id, idx)">✕</button>
                  </div>
                  <div v-if="!(store.selectedWidget.logs || []).length" class="log-empty-hint">暂无日志行</div>
                </div>

                <div class="props-section-title sub-title">添加日志</div>
                <div class="form-group">
                  <label>日志内容</label>
                  <input type="text" v-model="logAddText" placeholder="输入日志内容" @keydown.enter="onLogAdd" />
                </div>
                <div class="form-row">
                  <div class="form-group half">
                    <label>颜色</label>
                    <input type="color" v-model="logAddColor" />
                  </div>
                  <div class="form-group half" style="align-self: flex-end;">
                    <button class="props-action-btn" @click="onLogAdd" :disabled="!logAddText.trim()">添加</button>
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <button class="props-action-btn danger" @click="store.clearLogs(store.selectedWidget.id)">清空所有</button>
                </div>
              </div>

              <!-- 图标按钮特有属性 -->
              <div v-if="store.selectedWidget.type === 'iconButton'">
                <div class="props-section-title sub-title">图标设置</div>
                <div class="form-group">
                  <label>图标</label>
                  <select :value="store.selectedWidget.iconName || 'fa-star'" @change="onIconNameChange($event)">
                    <option value="fa-star">⭐ fa-star</option>
                    <option value="fa-home">🏠 fa-home</option>
                    <option value="fa-cog">⚙ fa-cog</option>
                    <option value="fa-save">💾 fa-save</option>
                    <option value="fa-trash">🗑 fa-trash</option>
                    <option value="fa-search">🔍 fa-search</option>
                    <option value="fa-download">⬇ fa-download</option>
                    <option value="fa-upload">⬆ fa-upload</option>
                    <option value="fa-play">▶ fa-play</option>
                    <option value="fa-pause">⏸ fa-pause</option>
                    <option value="fa-stop">⏹ fa-stop</option>
                    <option value="fa-refresh">🔄 fa-refresh</option>
                    <option value="fa-lock">🔒 fa-lock</option>
                    <option value="fa-unlock">🔓 fa-unlock</option>
                    <option value="fa-bell">🔔 fa-bell</option>
                    <option value="fa-envelope">✉ fa-envelope</option>
                    <option value="fa-user">👤 fa-user</option>
                    <option value="fa-check">✅ fa-check</option>
                    <option value="fa-times">❌ fa-times</option>
                    <option value="fa-plus">➕ fa-plus</option>
                    <option value="fa-minus">➖ fa-minus</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>按钮文字</label>
                  <input type="text" :value="store.selectedWidget.text" @input="onWidgetPropChange('text', $event)" placeholder="按钮文字" />
                </div>
                <div class="form-group">
                  <label>图标位置</label>
                  <select :value="store.selectedWidget.iconPosition || 'left'" @change="onWidgetPropChange('iconPosition', $event)">
                    <option value="left">左侧</option>
                    <option value="right">右侧</option>
                    <option value="icon-only">仅图标</option>
                  </select>
                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;gap:4px;">
                    图标HTML
                    <span style="color:#999;font-weight:normal;font-size:11px">(支持自定义 img/svg/其他图标库)</span>
                    <el-popover placement="bottom-start" :width="400" trigger="hover" popper-class="icon-help-popover">
                      <template #reference>
                        <span class="icon-help-badge" @click.stop>?</span>
                      </template>
                      <div class="icon-help-content">
                        <div class="help-title">图标 HTML 使用说明</div>
                        <div class="help-section">
                          <div class="help-section-title">Font Awesome 图标</div>
                          <code>&lt;i class="fas fa-home"&gt;&lt;/i&gt;</code>
                          <code>&lt;i class="far fa-star"&gt;&lt;/i&gt;</code>
                          <code>&lt;i class="fab fa-github"&gt;&lt;/i&gt;</code>
                          <div class="help-hint">fas=实心 | far=常规 | fab=品牌图标</div>
                        </div>
                        <div class="help-section">
                          <div class="help-section-title">带样式的 Font Awesome</div>
                          <code>&lt;i class="fas fa-trash-alt" style="color:red;font-size:18px;"&gt;&lt;/i&gt;</code>
                          <div class="help-hint">支持任意内联 style 属性</div>
                        </div>
                        <div class="help-section">
                          <div class="help-section-title">Material Icons</div>
                          <code>&lt;span class="material-icons"&gt;home&lt;/span&gt;</code>
                          <div class="help-hint">需在 HTML head 中引入 Material Icons CDN</div>
                        </div>
                        <div class="help-section">
                          <div class="help-section-title">内联 SVG 图标</div>
                          <code>&lt;svg width="16" height="16" viewBox="0 0 16 16"&gt;&lt;path fill="currentColor" d="M8 0L10.472 5.266L16 6.115L12 10.213L12.944 16L8 13.265L3.056 16L4 10.213L0 6.115L5.528 5.266Z"/&gt;&lt;/svg&gt;</code>
                          <div class="help-hint">svg 最大宽度自动限制为 20px，高度自适应</div>
                        </div>
                        <div class="help-section">
                          <div class="help-section-title">图片图标</div>
                          <code>&lt;img src="https://example.com/icon.png" width="20"&gt;</code>
                          <div class="help-hint">img 最大宽度自动限制为 20px，高度自适应</div>
                        </div>
                        <div class="help-section">
                          <div class="help-section-title">任意 HTML 片段</div>
                          <code>&lt;span style="font-size:16px;"&gt;🚀&lt;/span&gt;</code>
                          <div class="help-hint">支持 emoji、span、div 等任意 HTML 元素</div>
                        </div>
                        <div class="help-footer">
                          <span>⚠ 出于安全考虑，&lt;script&gt; 标签会被自动过滤移除。</span>
                          <span style="margin-top:4px;">💡 选择下拉列表中的内置图标后，此处 HTML 会自动同步更新。</span>
                        </div>
                      </div>
                    </el-popover>
                  </label>
                  <textarea :value="store.selectedWidget.iconHtml || ''" @input="onIconHtmlChange($event)" placeholder="<i class=&quot;fas fa-star&quot;></i>" rows="2" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:11px;resize:vertical;"></textarea>
                </div>
              </div>

              <!-- 图片框特有属性 -->
              <div v-if="store.selectedWidget.type === 'imageBox'">
                <div class="props-section-title sub-title" style="display:flex;align-items:center;justify-content:space-between;">
                  <span>图片设置</span>
                  <label class="el-switch-sm"  style="display:flex;align-items:center;line-height:15px;">
                    <input type="checkbox" :checked="store.selectedWidget.transparentBg || false" @change="onWidgetPropChange('transparentBg', $event)" />
                    <span class="el-switch-sm-track" style="margin-left:5px">透明底色</span>
                  </label>
                </div>
                <div class="form-group">
                  <label>图片地址 (URL / data:base64)</label>
                  <div style="display:flex;gap:6px;">
                    <input type="text" :value="store.selectedWidget.src || ''" @input="onWidgetPropChange('src', $event)" placeholder="https://example.com/image.png 或 data:image/png;base64,..." style="flex:1;" />
                    <button class="props-action-btn" style="width:80px;flex-shrink:0;" @click="onPickLocalImage">本地图片</button>
                  </div>
                  <input ref="imageFileInput" type="file" accept="image/*" style="display:none;" @change="onLocalImageSelected" />
                </div>
                <div class="form-group">
                  <label>缩放模式</label>
                  <select :value="store.selectedWidget.fit || 'cover'" @change="onWidgetPropChange('fit', $event)">
                    <option value="fill">填充（拉伸占满，可能变形）</option>
                    <option value="contain">等比缩放完全显示（留黑边）</option>
                    <option value="cover">等比缩放填满（裁剪溢出）</option>
                    <option value="none-top-left">左上角原比例显示</option>
                    <option value="none-center">居中原比例显示</option>
                  </select>
                </div>
              </div>

              <!-- 卡片框特有属性 -->
              <div v-if="store.selectedWidget.type === 'cardBox'">
                <div class="props-section-title sub-title" style="display:flex;align-items:center;justify-content:space-between;">
                  <span>标题栏设置</span>
                  <label class="el-switch-sm">
                    <input type="checkbox" :checked="store.selectedWidget.showHeader !== false" @change="onCardShowHeaderChange($event)" />
                    <span class="el-switch-sm-track"></span>
                  </label>
                </div>
                <div class="form-group" v-if="store.selectedWidget.showHeader !== false">
                  <label>标题文字</label>
                  <input type="text" :value="store.selectedWidget.headerTitle || ''" @input="onWidgetPropChange('headerTitle', $event)" placeholder="卡片标题" />
                </div>
                <div class="form-row" v-if="store.selectedWidget.showHeader !== false">
                  <div class="form-group half">
                    <label>标题字号</label>
                    <input type="number" :value="store.selectedWidget.styleData?.base?.fontSize || 13" @input="onStyleChange('fontSize', $event)" min="8" max="72" style="width:100%;" />
                  </div>
                  <div class="form-group half">
                    <label>标题文字色</label>
                    <input type="color" :value="store.selectedWidget.style.headerTitleColor || '#1E1F22'" @input="onStyleChange('headerTitleColor', $event)" />
                  </div>
                </div>
                <div class="form-group" v-if="store.selectedWidget.showHeader !== false">
                  <label>标题字体</label>
                  <select :value="store.selectedWidget.styleData?.base?.fontFamily || ''" @change="onStyleChange('fontFamily', $event)">
                    <option value="">系统默认</option>
                    <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
                    <option value="SimSun, serif">宋体</option>
                    <option value="SimHei, sans-serif">黑体</option>
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                  </select>
                </div>
                <div class="form-row" style="margin-top:10px;" v-if="store.selectedWidget.showHeader !== false">
                  <div class="form-group" style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:8px;">
                      <label style="margin:0;white-space:nowrap;flex-shrink:0;">标题栏背景色</label>
                      <input type="color" :value="store.selectedWidget.style.headerColor || '#f5f5f5'" @input="onStyleChange('headerColor', $event)" style="width:60px;height:28px;padding:1px;border:1px solid #d9d9d9;border-radius:4px;cursor:pointer;flex-shrink:0;" />
                      <div style="flex:1;min-width:6px;"></div>
                      <label style="margin:0;white-space:nowrap;flex-shrink:0;">是否可折叠</label>
                      <label class="el-switch-sm" style="flex-shrink:0;">
                        <input type="checkbox" :checked="store.selectedWidget.collapsible || false" @change="onCardCollapsibleChange($event)" />
                        <span class="el-switch-sm-track"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 列表框特有属性 -->
              <div v-if="store.selectedWidget.type === 'listBox'">
                <div class="props-section-title sub-title">数据设置</div>
                <div class="form-group row-btns">
                  <button class="props-action-btn flex-1" @click="onListAddItem">+ 添加项</button>
                  <button class="props-action-btn flex-1" @click="onListDelItem" :disabled="!store.selectedWidget.items || store.selectedWidget.items.length === 0">- 删除选中</button>
                </div>
                <div class="form-group" style="max-height:180px;overflow-y:auto;border:1px solid #e8e8e8;border-radius:4px;margin-bottom:4px;">
                  <div
                    v-for="(item, idx) in store.selectedWidget.items || []"
                    :key="idx"
                    class="list-item-row"
                    :class="{ 'list-item-active': listEditIndex === idx }"
                    @click="listEditIndex = idx"
                  >
                    <span class="list-item-idx">{{ idx + 1 }}</span>
                    <input
                      type="text"
                      :value="item.text"
                      @input="onListItemTextChange(idx, $event)"
                      class="list-item-inp"
                      placeholder="项文本"
                    />
                    <input
                      type="checkbox"
                      :checked="item.selected || false"
                      @change="onListItemSelectedChange(idx, $event)"
                      title="默认选中"
                      style="flex-shrink:0;"
                    />
                  </div>
                  <div v-if="!store.selectedWidget.items || store.selectedWidget.items.length === 0" style="padding:12px;color:#ccc;text-align:center;font-size:12px;">
                    暂无列表项，点击"+ 添加项"创建
                  </div>
                </div>
                <div class="form-group row-btns">
                  <button class="props-action-btn flex-1" @click="onListMoveItem(-1)" :disabled="(listEditIndex ?? -1) < 0">↑ 上移</button>
                  <button class="props-action-btn flex-1" @click="onListMoveItem(1)" :disabled="(listEditIndex ?? -1) < 0 || (listEditIndex ?? 0) >= ((store.selectedWidget.items?.length || 1) - 1)">↓ 下移</button>
                </div>
                <div class="props-section-title sub-title" style="margin-top:10px;">选项设置</div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;justify-content:space-between;">
                    <span>显示复选框</span>
                    <label class="el-switch-sm">
                      <input type="checkbox" :checked="store.selectedWidget.showCheckbox || false" @change="onListCheckboxProp('showCheckbox', $event)" />
                      <span class="el-switch-sm-track"></span>
                    </label>
                  </label>
                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;justify-content:space-between;">
                    <span>允许双击编辑</span>
                    <label class="el-switch-sm">
                      <input type="checkbox" :checked="store.selectedWidget.editable || false" @change="onListCheckboxProp('editable', $event)" />
                      <span class="el-switch-sm-track"></span>
                    </label>
                  </label>
                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;justify-content:space-between;">
                    <span>始终显示选择项</span>
                    <label class="el-switch-sm">
                      <input type="checkbox" :checked="store.selectedWidget.alwaysShowSelection !== false" @change="onListCheckboxProp('alwaysShowSelection', $event)" />
                      <span class="el-switch-sm-track"></span>
                    </label>
                  </label>
                </div>
              </div>

              <!-- 树形框特有属性 -->
              <div v-if="store.selectedWidget.type === 'treeView'" class="property-group">
                <div class="group-title">📁 树形框设置</div>
				<div class="tree-editor">
                  <div class="tree-editor-toolbar">
                    <button @click="treeAddRootNode" title="添加根节点">＋根</button>
                    <button @click="treeAddChildNode" title="添加子节点" :disabled="!treeSelectedNode">＋子</button>
                    <button @click="treeDeleteNode" title="删除节点" :disabled="!treeSelectedNode">✕删</button>
                    <button @click="treeMoveUp" title="上移" :disabled="!treeSelectedNode">↑</button>
                    <button @click="treeMoveDown" title="下移" :disabled="!treeSelectedNode">↓</button>
                    <button @click="treeIndentRight" title="增加缩进" :disabled="!treeSelectedNode">→</button>
                    <button @click="treeIndentLeft" title="减少缩进" :disabled="!treeSelectedNode">←</button>
                  </div>
                  <div class="tree-editor-list">
                    <div v-for="(node, index) in treeFlatList" :key="node.id"
                         class="tree-editor-item"
                         :class="{ 'selected': treeSelectedNode === node.id }"
                         @click="treeSelectNode(node.id)">
                      <span class="tree-editor-indent" :style="{ paddingLeft: (node._level * 16) + 'px' }">
                        <input v-if="store.selectedWidget.treeShowCheckbox" type="checkbox" v-model="node.checked" @change="markDirty" class="tree-editor-checkbox" @click.stop />
                        <span v-if="node.children && node.children.length > 0" class="tree-editor-toggle" @click.stop="treeToggleExpand(node.id)">
                          {{ node.expanded ? '▼' : '▶' }}
                        </span>
                        <span v-else class="tree-editor-toggle-spacer">　</span>
                        <span class="tree-editor-icon">{{ node.children && node.children.length > 0 ? '📁' : '📄' }}</span>
                        <input v-if="treeEditingId === node.id"
                               v-model="treeEditText"
                               class="tree-editor-input"
                               @blur="treeSaveEdit()"
                               @keydown.enter="treeSaveEdit()"
                               @keydown.escape="treeCancelEdit()" />
                        <span v-else class="tree-editor-text" @dblclick="treeStartEdit(node.id, node.text)">{{ node.text }}</span>
                      </span>
                    </div>
                    <div v-if="treeFlatList.length === 0" class="tree-editor-empty">暂无节点，请点击"＋根"添加</div>
                  </div>
                </div>

                <div class="form-row">
                  <label class="switch-label">
                    <input type="checkbox" :checked="store.selectedWidget.treeEditable" @change="onTreeEditableChange" />
                    <span class="switch-text">{{ store.selectedWidget.treeEditable ? '是' : '否' }}</span>
                  </label>
				  <label>允许编辑</label>
                </div>

                <div class="form-row">
                  <label class="switch-label">
                    <input type="checkbox" :checked="store.selectedWidget.treeShowIcon !== false" @change="onTreeShowIconChange" />
                    <span class="switch-text">{{ store.selectedWidget.treeShowIcon !== false ? '是' : '否' }}</span>
                  </label>
				  <label>显示图标</label>
                </div>

                <div class="form-row">
                  <label class="switch-label">
                    <input type="checkbox" :checked="store.selectedWidget.treeShowCheckbox === true" @change="onTreeShowCheckboxChange" />
                    <span class="switch-text">{{ store.selectedWidget.treeShowCheckbox ? '是' : '否' }}</span>
                  </label>
                  <label>显示复选框</label>
                </div>

                <div class="form-row">
                  <label class="switch-label">
                    <input type="checkbox" :checked="store.selectedWidget.treeAlwaysShowSelection !== false" @change="onTreeAlwaysShowChange" />
                    <span class="switch-text">{{ store.selectedWidget.treeAlwaysShowSelection !== false ? '是' : '否' }}</span>
                  </label>
                  <label>始终显示选择项</label>
                </div>              
              </div>

              <!-- 多项表格特有属性 -->
              <div v-if="store.selectedWidget && store.selectedWidget.type === 'dataGrid'">
                <el-collapse v-model="dataGridActiveNames">
                  <!-- 列配置 -->
                  <el-collapse-item title="📋 列配置" name="columns">
                    <div class="dg-col-list">
                      <div v-for="(col, ci) in store.selectedWidget.columns" :key="ci" class="dg-col-item">
                        <input v-model="col.header" placeholder="标题" style="width:80px; font-size:11px;" @input="markDirty" />
                        <input v-model.number="col.width" placeholder="宽度" type="number" style="width:60px" @input="markDirty" />
                        <label><input type="checkbox" v-model="col.editable" @change="markDirty" /> 可否编辑</label>
                        <button class="btn-dg-del" @click="dgDeleteCol(ci)">✕</button>
                      </div>
                    </div>
                    <button class="btn-dg-add" @click="dgAddCol">+ 添加列</button>
                  </el-collapse-item>
                  <!-- 行数据 -->
                  <el-collapse-item title="📝 行数据" name="rows">
                    <div v-if="dgGridRows.length > 0" class="dg-row-editor-wrap">
                      <table class="dg-row-editor-table">
                        <thead>
                          <tr>
                            <th v-if="store.selectedWidget.showRowCheckbox" style="width:30px">#</th>
                            <th v-for="col in store.selectedWidget.columns" :key="col.field" style="min-width:80px">{{ col.header || col.field }}</th>
                            <th style="width:30px"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, ri) in dgGridRows" :key="row.id">
                            <td v-if="store.selectedWidget.showRowCheckbox"><input type="checkbox" v-model="row.selected" @change="markDirty" /></td>
                            <td v-for="col in store.selectedWidget.columns" :key="col.field">
                              <input v-model="row.cells[col.field]" style="width:100%;box-sizing:border-box" @input="markDirty" />
                            </td>
                            <td><button class="btn-dg-del" @click="dgDeleteRow(ri)">✕</button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-else class="dg-empty-hint">暂无行数据</div>
                    <button class="btn-dg-add" @click="dgAddRow">+ 添加行</button>
                  </el-collapse-item>
                  <!-- 属性设置 -->
                  <el-collapse-item title="⚙️ 属性设置" name="props">
                    <div class="form-group">
        <label><input type="checkbox" v-model="store.selectedWidget.showRowCheckbox" @change="markDirty" /> 显示行复选框</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" v-model="store.selectedWidget.alwaysShowSelection" @change="markDirty" /> 始终显示选择项</label>
      </div>
                    <div class="form-group">
                      <label><input type="checkbox" v-model="store.selectedWidget.editable" @change="markDirty" /> 全局可编辑单元格</label>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>

              <!-- 右键菜单特有属性 -->
              <div v-if="store.selectedWidget.type === 'contextMenu'">
                <div class="form-group">
                  <label>绑定目标控件</label>
                  <select :value="store.selectedWidget.contextMenuTargetId || ''" @change="onContextMenuPropChange('contextMenuTargetId', $event)">
                    <option value="">-- 未绑定 --</option>
                    <option v-for="t in ctxMenuAllTargets" :key="t.id" :value="t.id">{{ t.name || t.id }} ({{ t.label }})</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>触发事件</label>
                  <select :value="store.selectedWidget.contextMenuTrigger || 'contextmenu'" @change="onContextMenuPropChange('contextMenuTrigger', $event)">
                    <option value="contextmenu">右键 (contextmenu)</option>
                    <option value="click">单击 (click)</option>
                    <option value="dblclick">双击 (dblclick)</option>
                    <option value="mouseenter">悬停 (mouseenter)</option>
                  </select>
                </div>

                <div class="props-section-title sub-title" style="display:flex;align-items:center;justify-content:space-between;">
                  <span>菜单项编辑器</span>
                </div>

                <div class="form-group row-btns">
                  <button class="props-action-btn flex-1" @click="ctxMenuAddItem">+ 菜单项</button>
                  <button class="props-action-btn flex-1" @click="ctxMenuAddChild">+ 子菜单</button>
                  <button class="props-action-btn flex-1" @click="ctxMenuAddSeparator">+ 分隔线</button>
                </div>
                <div class="form-group row-btns">
                  <button class="props-action-btn flex-1" @click="ctxMenuMoveItem(-1)" :disabled="(ctxMenuEditIndex ?? -1) <= 0">↑ 上移</button>
                  <button class="props-action-btn flex-1" @click="ctxMenuMoveItem(1)" :disabled="(ctxMenuEditIndex ?? -1) < 0 || (ctxMenuEditIndex ?? 0) >= ((ctxMenuFlatList?.length || 1) - 1)">↓ 下移</button>
                  <button class="props-action-btn flex-1" @click="ctxMenuDeleteItem" :disabled="ctxMenuEditIndex === null">- 删除</button>
                </div>
                <div class="form-group" style="max-height:240px;overflow-y:auto;border:1px solid #e8e8e8;border-radius:4px;margin-bottom:4px;">
                  <div
                    v-for="(item, idx) in ctxMenuFlatList || []"
                    :key="item.id"
                    class="list-item-row"
                    :class="{ 'list-item-active': ctxMenuEditIndex === idx }"
                    @click="ctxMenuEditIndex = idx"
                  >
                    <span class="list-item-idx">{{ idx + 1 }}</span>
                    <span v-if="item.type === 'separator'" style="padding-left:8px;color:#999;flex:1;font-size:11px;">── 分隔线 ──</span>
                    <template v-else>
                      <span :style="{ paddingLeft: (item._level || 0) * 16 + 'px' }" style="flex:1;display:flex;align-items:center;gap:4px;">
                        <span v-if="item.icon">{{ item.icon }}</span>
                        <input
                          type="text"
                          :value="item.text"
                          @input="onCtxMenuItemTextChange(idx, $event)"
                          class="list-item-inp"
                          placeholder="菜单项文本"
                        />
                      </span>
                    </template>
                  </div>
                  <div v-if="!ctxMenuFlatList || ctxMenuFlatList.length === 0" style="padding:12px;color:#ccc;text-align:center;font-size:12px;">
                    暂无菜单项
                  </div>
                </div>
                <button class="ctx-preview-btn" @click="openCtxPreview">预览</button>
              </div>

            <!-- 气泡框特有属性 -->
            <div v-if="store.selectedWidget.type === 'tooltip'">
              <div class="form-group">
                <label>绑定目标控件</label>
                <select :value="store.selectedWidget.tooltipTargetId || ''" @change="onTooltipPropChange('tooltipTargetId', $event)">
                  <option value="">-- 未绑定 --</option>
                  <option v-for="t in tooltipAllTargets" :key="t.id" :value="t.id">{{ t.name || t.id }} ({{ t.label }})</option>
                </select>
              </div>
              <div class="form-group">
                <label>触发事件</label>
                <select :value="store.selectedWidget.tooltipTrigger || 'hover'" @change="onTooltipPropChange('tooltipTrigger', $event)">
                  <option value="hover">悬停 (hover)</option>
                  <option value="click">单击 (click)</option>
                  <option value="focus">聚焦 (focus)</option>
                </select>
              </div>
              <div class="form-group">
                <label>显示位置</label>
                <select :value="store.selectedWidget.tooltipPosition || 'auto'" @change="onTooltipPropChange('tooltipPosition', $event)">
                  <option value="auto">自动</option>
                  <option value="top">上 (top)</option>
                  <option value="bottom">下 (bottom)</option>
                  <option value="left">左 (left)</option>
                  <option value="right">右 (right)</option>
                </select>
              </div>
              <div class="form-row">
                <div class="form-group half">
                  <label>显示延迟(ms)</label>
                  <input type="number" :value="store.selectedWidget.tooltipShowDelay ?? 200" @input="onTooltipPropChange('tooltipShowDelay', $event)" min="0" max="5000" />
                </div>
                <div class="form-group half">
                  <label>隐藏延迟(ms)</label>
                  <input type="number" :value="store.selectedWidget.tooltipHideDelay ?? 100" @input="onTooltipPropChange('tooltipHideDelay', $event)" min="0" max="5000" />
                </div>
              </div>

              <div class="props-section-title sub-title" style="margin-bottom:0px;">                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;justify-content:space-between;display:flex;align-items:center;gap:8px;">
                    <span style="font-size:13px;font-weight:500;">提示内容</span>
                    <label style="display:flex;align-items:center;gap:4px;font-weight:normal;font-size:12px;cursor:pointer;justify-content:space-between;line-height:20px;">
                      <input type="checkbox" :checked="store.selectedWidget.tooltipAllowHTML" @change="onTooltipPropChange('tooltipAllowHTML', $event)" />
                      允许 HTML
                    </label>
                  </label>
                  <textarea
                    v-model="tooltipContentText"
                    :placeholder="store.selectedWidget.tooltipAllowHTML ? '支持HTML内容，如：&lt;b&gt;粗体&lt;/b&gt;&lt;br/&gt;换行' : '输入提示文本内容...'"
                    rows="5"
                    style="font-family:monospace;font-size:12px;resize:vertical;width:100%;box-sizing:border-box;min-height: 40px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
                  ></textarea>
                </div>
                  <button class="ctx-preview-btn" @click="openTooltipPreview">预览</button>
              </div>            
            </div>

            <!-- 自定义控件专有属性（从 JSON 配置 defaultProps 自动生成） -->
            <div v-if="customWidgetProps.length > 0" class="props-section">
              <div class="props-section-title">控件属性</div>
              <div v-for="prop in customWidgetProps" :key="prop.key" class="form-group">
                <template v-if="prop.type === 'boolean'">
                  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                    <input type="checkbox" :checked="prop.value" @change="onCustomPropChange(prop.key, $event)" />
                    {{ prop.key }}
                  </label>
                </template>
                <template v-else>
                <label>{{ prop.key }}</label>
                <template v-if="prop.type === 'number'">
                  <input type="number" :value="prop.value" @input="onCustomPropChange(prop.key, $event)" />
                </template>
                <template v-else-if="prop.type === 'select'">
                  <select :value="prop.value" @change="onCustomPropChange(prop.key, $event)">
                    <option v-for="opt in prop.options" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </template>
                <template v-else-if="prop.type === 'color'">
                  <div style="display:flex;align-items:center;gap:6px;">
                    <input type="color" :value="prop.value" @input="onCustomPropChange(prop.key, $event)" style="width:32px;height:28px;padding:0;border:none;cursor:pointer;" />
                    <input type="text" :value="prop.value" @input="onCustomPropChange(prop.key, $event)" style="flex:1;" />
                  </div>
                </template>
                <template v-else>
                  <input type="text" :value="prop.value" @input="onCustomPropChange(prop.key, $event)" />
                </template>
                </template>
              </div>
            </div>

            <!-- 通用属性 -->
            <div class="props-section">
              <div class="props-section-title">通用属性</div>

              <template v-for="(group, gIdx) in commonPropertyGroups" :key="gIdx">
                <div v-if="group.title" class="props-section-title" :class="{ 'sub-title': group.subTitle }">{{ group.title }}</div>
                <div :class="group.layout === 'row' ? 'form-row' : ''">
                  <template v-for="(ctrl, cIdx) in group.controls" :key="cIdx">
                    <div v-if="ctrl.type === 'range'" class="form-group" style="margin-bottom:4px;">
                      <label style="display:flex;align-items:center;justify-content:space-between;">
                        <span>{{ ctrl.label }}</span>
                        <span style="font-size:11px;color:#86868b;font-weight:normal;">{{ getRangePercent(ctrl) }}%</span>
                      </label>
                      <input type="range" :value="getRangePercent(ctrl)" @input="onStyleChange(ctrl.prop, $event, true)" min="0" max="100" step="1" style="width:100%;" />
                    </div>
                    <div v-else class="form-group" :class="ctrl.width || 'third'">
                      <label>{{ ctrl.label }}</label>
                      <select v-if="ctrl.type === 'select'" :value="getPropDisplayValue(ctrl)" @change="ctrl.styleProp ? onStyleChange(ctrl.prop, $event) : onWidgetPropChange(ctrl.prop, $event)">
                        <option v-for="opt in ctrl.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                      </select>
                      <input v-else-if="ctrl.type === 'number'" type="number" :value="getPropDisplayValue(ctrl)" @input="onStyleChange(ctrl.prop, $event)" :min="ctrl.min ?? 0" />
                      <input v-else-if="ctrl.type === 'color'" type="color" :value="getPropDisplayValue(ctrl)" @input="onStyleChange(ctrl.prop, $event)" />
                    </div>
                  </template>
                </div>
              </template>

              <!-- 阴影 -->
              <div class="props-section-title sub-title">阴影</div>
              <div class="form-row">
                <div class="form-group">
                  <label>X偏移</label>
                  <input type="number" :value="shadowX" @change="onShadowChange($event, 'x')" />
                </div>
                <div class="form-group">
                  <label>Y偏移</label>
                  <input type="number" :value="shadowY" @change="onShadowChange($event, 'y')" />
                </div>
                <div class="form-group">
                  <label>模糊</label>
                  <input type="number" :value="shadowBlur" @change="onShadowChange($event, 'blur')" min="0" />
                </div>
                <div class="form-group">
                  <label>扩展</label>
                  <input type="number" :value="shadowSpread" @change="onShadowChange($event, 'spread')" />
                </div>
                <div class="form-group">
                  <label>颜色</label>
                  <input type="color" :value="shadowColor" @change="onShadowColorChange(($event.target as HTMLInputElement).value)" style="width:28px;height:28px;padding:0;border:none;cursor:pointer;" />
                </div>

              </div>
              <div class="form-group" style="flex:1;min-width:80px;">
                <label style="display:flex;align-items:center;justify-content:space-between;">
                  <span>透明度</span>
                  <span style="font-size:11px;color:#888;">{{ shadowAlpha }}%</span>
                </label>
                <input type="range" :value="shadowAlpha" @input="onShadowAlphaChange" min="0" max="100" style="width:100%;" />
              </div>
            </div>
          </div>

        <!-- 标签2：样式编辑 -->
        <div v-show="activeTab === 'css'" class="css-editor-panel">
          <CssEditor
            :widget-id="store.selectedWidget.id"
            :model-value="store.selectedWidget.customCSS || ''"
            maximizable
            @change="onCssChange"
          />
        </div>
      </div>

    <!-- 无选中状态 -->
    <div v-else class="no-selection">
      <p>请选择控件或画布</p>
    </div>
  </div>

  <!-- 右键菜单预览弹窗（左预览 + 右CSS编辑器） -->
  <div v-if="ctxPreviewVisible" class="ctx-live-preview-overlay">
    <div ref="ctxLivePreviewModalRef" class="ctx-live-preview-modal">
      <div class="ctx-live-preview-header">
        <span>右键菜单样式编辑器 — 预览</span>
        <button class="ctx-live-preview-close" @click="closeCtxPreview">&times;</button>
      </div>
      <div class="ctx-live-preview-body">
        <div ref="ctxPreviewContentEl" class="ctx-live-preview-left"></div>
        <div class="ctx-live-preview-right">
          <CssEditor
            widget-id="ctxMenu"
            :model-value="ctxMenuCSS"
            @change="onCtxMenuCSSChange"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 气泡框预览弹窗（左预览 + 右CSS编辑器） -->
  <div v-if="ttPreviewVisible" class="ctx-live-preview-overlay">
    <div ref="ttLivePreviewModalRef" class="ctx-live-preview-modal">
      <div class="ctx-live-preview-header">
        <span>气泡框样式编辑器 — 预览</span>
        <button class="ctx-live-preview-close" @click="closeTooltipPreview">&times;</button>
      </div>
      <div class="ctx-live-preview-body">
        <div ref="ttPreviewContentEl" class="ctx-live-preview-left"></div>
        <div class="ctx-live-preview-right">
          <CssEditor
            widget-id="tooltip"
            :model-value="tooltipCSS"
            @change="onTooltipCSSChange"
          />
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import { ElMessage } from 'element-plus'
import CssEditor from '@/components/PropertyPanel/CssEditor.vue'
import ColorPicker from '@/components/PropertyPanel/ColorPicker.vue'
import { mergeStyleToCSS } from '@/utils/cssParser'
import type { TableRow, Widget } from '@/types/index'
import { getWidgetLibraryItems, getWidgetJSONConfig } from '@/config/widgetRegistry'
import { useThemeStore } from '@/stores/themeStore'
import { allThemes } from '@/config/themes'
import { DEFAULT_MESSAGEBOX_CSS, DEFAULT_INPUTBOX_CSS } from '@/config/globalComponentsConfig'
import { useResizable } from '@/composables/useResizable'

const store = useWidgetStore()
const themeStore = useThemeStore()

/** rAF 限流：画布属性批量更新（合并帧内多次修改为一次） */
let _canvasRAFId: number | null = null
const _canvasPending: Record<string, any> = {}
const _canvasCSSKeys = new Set<string>()
const _canvasCallbacks: (() => void)[] = []

function flushCanvasChanges() {
  const realChanges: Record<string, any> = {}
  for (const [k, v] of Object.entries(_canvasPending)) {
    if (!k.startsWith('_')) realChanges[k] = v
  }
  if (Object.keys(realChanges).length > 0) {
    store.updateCanvas(realChanges)
  }
  for (const key of _canvasCSSKeys) {
    if (key in _canvasPending) {
      store.syncCanvasPropToCSS(key, _canvasPending[key])
    }
  }
  for (const k of Object.keys(_canvasPending)) {
    delete _canvasPending[k]
  }
  _canvasCSSKeys.clear()
  for (const cb of _canvasCallbacks) {
    cb()
  }
  _canvasCallbacks.length = 0
  scheduleSaveState()
}

function scheduleCanvasChange(key: string, value: any, cssSync: boolean = false, extraCallback?: () => void) {
  _canvasPending[key] = value
  if (cssSync) _canvasCSSKeys.add(key)
  if (extraCallback) _canvasCallbacks.push(extraCallback)

  if (_canvasRAFId !== null) return
  _canvasRAFId = requestAnimationFrame(() => {
    _canvasRAFId = null
    flushCanvasChanges()
  })
}

/** rAF 限流：全局 saveState 批量合并（帧内多次 saveState 合并为1次） */
let _globalSaveRAFId: number | null = null

function scheduleSaveState() {
  if (_globalSaveRAFId !== null) return
  _globalSaveRAFId = requestAnimationFrame(() => {
    _globalSaveRAFId = null
    store.saveState()
  })
}

/** 属性面板主题切换 */
function onPanelThemeChange(e: Event) {
  const sel = e.target as HTMLSelectElement
  flushCanvasChanges()
  themeStore.applyTheme(sel.value)
}

const logAddText = ref('')
const logAddColor = ref('#000000')

function onLogAdd() {
  const text = logAddText.value.trim()
  if (!text || !store.selectedWidget) return
  store.addLog(store.selectedWidget.id, text, logAddColor.value)
  logAddText.value = ''
}

function onIconNameChange(e: Event) {
  const target = e.target as HTMLSelectElement
  const name = target.value
  if (!store.selectedWidget) return
  store.selectedWidget.iconName = name
  const cls = name.includes(' ') ? name : `fas ${name}`
  store.selectedWidget.iconHtml = `<i class="${cls}"></i>`
  store.saveState()
}

function onIconHtmlChange(e: Event) {
  const target = e.target as HTMLTextAreaElement
  if (!store.selectedWidget) return
  store.selectedWidget.iconHtml = target.value
  store.saveState()
}

const imageFileInput = ref<HTMLInputElement | null>(null)

function onPickLocalImage() {
  imageFileInput.value?.click()
}

function onLocalImageSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !store.selectedWidget) return
  const reader = new FileReader()
  reader.onload = () => {
    store.selectedWidget!.src = reader.result as string
    store.saveState()
  }
  reader.readAsDataURL(file)
  input.value = ''
}

/**
 * 卡片框：显示标题栏开关变更
 */
function onCardShowHeaderChange(e: Event) {
  if (!store.selectedWidget) return
  store.selectedWidget.showHeader = (e.target as HTMLInputElement).checked
  store.saveState()
}

/**
 * 卡片框：可折叠开关变更
 */
function onCardCollapsibleChange(e: Event) {
  if (!store.selectedWidget) return
  store.selectedWidget.collapsible = (e.target as HTMLInputElement).checked
  if (!store.selectedWidget.collapsible) {
    store.selectedWidget.collapsed = false
  }
  store.saveState()
}

/** 列表框：当前选中的列表项索引 */
const listEditIndex = ref<number | null>(null)

/** 列表框：添加列表项 */
function onListAddItem() {
  if (!store.selectedWidget || !store.selectedWidget.items) return
  store.selectedWidget.items.push({ id: '', text: '新项' + (store.selectedWidget.items.length + 1) })
  listEditIndex.value = store.selectedWidget.items.length - 1
  store.saveState()
}

/** 列表框：删除选中的列表项 */
function onListDelItem() {
  if (!store.selectedWidget || !store.selectedWidget.items || listEditIndex.value === null) return
  store.selectedWidget.items.splice(listEditIndex.value, 1)
  if (store.selectedWidget.items.length === 0) {
    listEditIndex.value = null
  } else if (listEditIndex.value >= store.selectedWidget.items.length) {
    listEditIndex.value = store.selectedWidget.items.length - 1
  }
  store.saveState()
}

/** 列表框：列表项文本变更 */
function onListItemTextChange(idx: number, e: Event) {
  if (!store.selectedWidget || !store.selectedWidget.items) return
  store.selectedWidget.items[idx].text = (e.target as HTMLInputElement).value
  store.saveState()
}

/** 列表框：列表项默认选中变更 */
function onListItemSelectedChange(idx: number, e: Event) {
  if (!store.selectedWidget || !store.selectedWidget.items) return
  store.selectedWidget.items[idx].selected = (e.target as HTMLInputElement).checked
  store.saveState()
}

/** 列表框：上移/下移 */
function onListMoveItem(direction: number) {
  if (!store.selectedWidget || !store.selectedWidget.items || listEditIndex.value === null) return
  const items = store.selectedWidget.items
  const i = listEditIndex.value
  const j = i + direction
  if (j < 0 || j >= items.length) return
  ;[items[i], items[j]] = [items[j], items[i]]
  listEditIndex.value = j
  store.saveState()
}

/** 列表框：复选框属性变更 */
function onListCheckboxProp(prop: string, e: Event) {
  if (!store.selectedWidget) return
  ;(store.selectedWidget as any)[prop] = (e.target as HTMLInputElement).checked
  store.saveState()
}

/** 控件类型中文名映射 — 用于属性面板标题 */
const widgetTypeLabelMap: Record<string, string> = {
  button: '按钮属性',
  input: '编辑框属性',
  checkbox: '复选框属性',
  toggle: '开关属性',
  textarea: '多行文本框属性',
  label: '标签属性',
  divider: '分割线属性',
  hyperlink: '超链接属性',
  comboBox: '组合框属性',
  radioGroup: '单选组属性',
  tabsContainer: '标签页容器属性',
  progressBar: '进度条属性',
  datetimePicker: '时间框属性',
  logOutput: '日志输出属性',
  iconButton: '图标按钮属性',
  imageBox: '图片框属性',
  cardBox: '卡片框属性',
  listBox: '列表框属性',
  treeView: '树形框属性',
  dataGrid: '多项表格属性',
  contextMenu: '右键菜单属性',
  tooltip: '气泡框属性',
  slider: '滑动条属性',
  spinner: '数值框属性',
  datePicker: '日期框属性',
  timePicker: '时间选择属性',
  colorPicker: '取色框属性',
  uploadBox: '上传框属性',
  richText: '富文本框属性',
  canvas3D: '3D画布属性',
  gauge: '仪表盘属性',
  pictureBox: '图片框属性',
  separator: '分隔线属性',
  container: '容器属性',
  radioButton: '单选按钮属性',
  checkBox: '复选框属性'
}

/** 属性面板控件特有属性标题 */
const widgetTypeTitle = computed(() => {
  if (!store.selectedWidget) return '控件属性'
  return widgetTypeLabelMap[store.selectedWidget.type] || '控件属性'
})

/** 树形框编辑器 — 扁平化节点列表（只展示展开的节点） */
const treeFlatList = computed(() => {
  const nodes = store.selectedWidget?.treeNodes || []
  const result: any[] = []
  function flatten(list: any[], level: number) {
    for (const node of list) {
      node._level = level
      result.push(node)
      if (node.expanded && node.children && node.children.length > 0) {
        flatten(node.children, level + 1)
      }
    }
  }
  flatten(nodes, 0)
  return result
})

const treeSelectedNode = ref<string | null>(null)
const treeEditingId = ref<string | null>(null)
const treeEditText = ref('')

/** 查找节点及其父数组 */
function findNodeAndParent(nodes: any[], nodeId: string): { node: any, parent: any[], index: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      return { node: nodes[i], parent: nodes, index: i }
    }
    if (nodes[i].children) {
      const found = findNodeAndParent(nodes[i].children!, nodeId)
      if (found) return found
    }
  }
  return null
}

function treeSelectNode(nodeId: string) {
  treeSelectedNode.value = nodeId
}

function treeAddRootNode() {
  if (!store.selectedWidget) return
  const nodes = store.selectedWidget.treeNodes || []
  store.selectedWidget.treeNodes = nodes
  const newId = 'node_' + Date.now()
  nodes.push({ id: newId, text: '新节点', expanded: false })
  store.selectedWidget.treeNodes = [...nodes]
  treeSelectedNode.value = newId
  store.saveState()
}

function treeAddChildNode() {
  if (!store.selectedWidget || !treeSelectedNode.value) return
  const nodes = store.selectedWidget.treeNodes || []
  const result = findNodeAndParent(nodes, treeSelectedNode.value)
  if (!result) return
  const newNode: any = { id: 'node_' + Date.now(), text: '新子节点', expanded: false }
  if (!result.node.children) result.node.children = []
  result.node.children.push(newNode)
  result.node.expanded = true
  store.selectedWidget.treeNodes = [...nodes]
  treeSelectedNode.value = newNode.id
  store.saveState()
}

function treeDeleteNode() {
  if (!store.selectedWidget || !treeSelectedNode.value) return
  const nodes = store.selectedWidget.treeNodes || []
  const result = findNodeAndParent(nodes, treeSelectedNode.value)
  if (!result) return
  result.parent.splice(result.index, 1)
  store.selectedWidget.treeNodes = [...nodes]
  treeSelectedNode.value = null
  store.saveState()
}

function treeMoveUp() {
  if (!store.selectedWidget || !treeSelectedNode.value) return
  const nodes = store.selectedWidget.treeNodes || []
  const result = findNodeAndParent(nodes, treeSelectedNode.value)
  if (!result || result.index === 0) return
  const temp = result.parent[result.index]
  result.parent[result.index] = result.parent[result.index - 1]
  result.parent[result.index - 1] = temp
  store.selectedWidget.treeNodes = [...nodes]
  store.saveState()
}

function treeMoveDown() {
  if (!store.selectedWidget || !treeSelectedNode.value) return
  const nodes = store.selectedWidget.treeNodes || []
  const result = findNodeAndParent(nodes, treeSelectedNode.value)
  if (!result || result.index >= result.parent.length - 1) return
  const temp = result.parent[result.index]
  result.parent[result.index] = result.parent[result.index + 1]
  result.parent[result.index + 1] = temp
  store.selectedWidget.treeNodes = [...nodes]
  store.saveState()
}

/** 增加缩进 — 将当前节点移到上一个兄弟节点的子节点中 */
function treeIndentRight() {
  if (!store.selectedWidget || !treeSelectedNode.value) return
  const nodes = store.selectedWidget.treeNodes || []
  const result = findNodeAndParent(nodes, treeSelectedNode.value)
  if (!result || result.index === 0) return
  const prevSibling = result.parent[result.index - 1]
  result.parent.splice(result.index, 1)
  if (!prevSibling.children) prevSibling.children = []
  prevSibling.children.push(result.node)
  prevSibling.expanded = true
  store.selectedWidget.treeNodes = [...nodes]
  store.saveState()
}

/** 减少缩进 — 将当前节点提升到父节点的层级 */
function treeIndentLeft() {
  if (!store.selectedWidget || !treeSelectedNode.value) return
  const nodes: any[] = store.selectedWidget.treeNodes || []
  const result = findNodeAndParent(nodes, treeSelectedNode.value)
  if (!result) return
  let grandParent: any[] = nodes
  let parentNodeId: string | null = null
  function findParentOf(arr: any[], targetId: string, path: any[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetId) {
        grandParent = path
        return true
      }
      if (arr[i].children) {
        if (arr[i].children.some((c: any) => c.id === targetId)) {
          grandParent = arr[i].children
          parentNodeId = arr[i].id
          return true
        }
        if (findParentOf(arr[i].children!, targetId, arr[i].children!)) return true
      }
    }
    return false
  }
  findParentOf(nodes, treeSelectedNode.value, nodes)
  if (grandParent === nodes) return
  const idx = grandParent.findIndex((c: any) => c.id === treeSelectedNode.value)
  if (idx < 0) return
  const nodeToMove = grandParent.splice(idx, 1)[0]
  const parentResult = parentNodeId ? findNodeAndParent(nodes, parentNodeId) : null
  if (parentResult) {
    parentResult.parent.splice(parentResult.index + 1, 0, nodeToMove)
  } else {
    nodes.push(nodeToMove)
  }
  store.selectedWidget.treeNodes = [...nodes]
  store.saveState()
}

function treeToggleExpand(nodeId: string) {
  if (!store.selectedWidget) return
  const nodes = store.selectedWidget.treeNodes || []
  const result = findNodeAndParent(nodes, nodeId)
  if (result) {
    result.node.expanded = !result.node.expanded
    store.selectedWidget.treeNodes = [...nodes]
    store.saveState()
  }
}

function treeStartEdit(nodeId: string, text: string) {
  treeEditingId.value = nodeId
  treeEditText.value = text
}

function treeSaveEdit() {
  if (!store.selectedWidget || !treeEditingId.value) return
  const nodes = store.selectedWidget.treeNodes || []
  const result = findNodeAndParent(nodes, treeEditingId.value)
  if (result && treeEditText.value.trim()) {
    result.node.text = treeEditText.value.trim()
    store.selectedWidget.treeNodes = [...nodes]
    store.saveState()
  }
  treeEditingId.value = null
}

function treeCancelEdit() {
  treeEditingId.value = null
}

function onTreeEditableChange(e: Event) {
  if (!store.selectedWidget) return
  store.selectedWidget.treeEditable = (e.target as HTMLInputElement).checked
  store.saveState()
}

function onTreeShowIconChange(e: Event) {
  if (!store.selectedWidget) return
  store.selectedWidget.treeShowIcon = (e.target as HTMLInputElement).checked
  store.saveState()
}

function onTreeShowCheckboxChange(e: Event) {
  if (!store.selectedWidget) return
  store.selectedWidget.treeShowCheckbox = (e.target as HTMLInputElement).checked
  store.saveState()
}

function onTreeAlwaysShowChange(e: Event) {
  if (!store.selectedWidget) return
  store.selectedWidget.treeAlwaysShowSelection = (e.target as HTMLInputElement).checked
  store.saveState()
}

/** 多项表格列编辑器 */
const dataGridActiveNames = ref<string[]>(['columns', 'rows', 'props'])

/** 多项表格的行数据（类型安全转换） */
const dgGridRows = computed<TableRow[]>(() => {
  const w = store.selectedWidget
  if (!w) return []
  const r = w.rows
  if (Array.isArray(r)) return r as TableRow[]
  return []
})

/** 标记脏状态 - 触发画布重新渲染 */
function markDirty() {
  const w = store.selectedWidget
  if (w) {
    store.updateWidget(w.id, { _dirty: Date.now() } as any)
  }
}

function dgAddCol() {
  const w = store.selectedWidget
  if (!w || !w.columns) return
  const field = 'col_' + Date.now()
  w.columns.push({ field, header: '列' + (w.columns.length + 1), editable: false })
  const rows = w.rows
  if (Array.isArray(rows)) {
    rows.forEach(r => { r.cells[field] = '' })
  }
  markDirty()
}

function dgDeleteCol(ci: number) {
  const w = store.selectedWidget
  if (!w || !w.columns || w.columns.length <= 1) return
  const field = w.columns[ci].field
  w.columns.splice(ci, 1)
  const rows = w.rows
  if (Array.isArray(rows)) {
    rows.forEach(r => { delete r.cells[field] })
  }
  markDirty()
}

function dgAddRow() {
  const w = store.selectedWidget
  if (!w) return
  const rows = w.rows
  if (!Array.isArray(rows)) return
  const idx = rows.length + 1
  const id = w.id + '_row_' + idx
  const cells: Record<string, any> = {}
  if (w.columns) {
    w.columns.forEach(c => { cells[c.field] = '' })
  }
  rows.push({ id, cells, selected: false })
  markDirty()
}

function dgDeleteRow(ri: number) {
  const w = store.selectedWidget
  if (!w) return
  const rows = w.rows
  if (!Array.isArray(rows)) return
  rows.splice(ri, 1)
  markDirty()
}

/** 当前激活的标签页 */
const activeTab = ref('props')

/** 画布激活的标签页 */
const canvasActiveTab = ref('props')

/** 通用属性控件配置项 */
interface PropertyControl {
  label: string
  prop: string
  type: 'select' | 'number' | 'color' | 'range'
  styleProp: boolean
  options?: { value: string, label: string }[]
  min?: number
  max?: number
  step?: number
  width?: 'quarter' | 'third' | 'half'
  defaultVal?: any
}

/** 通用属性控件分组 */
interface PropertyGroup {
  title?: string
  subTitle?: boolean
  layout?: 'row'
  controls: PropertyControl[]
}

/** 通用属性配置 - 按控件类型动态渲染 */
const commonPropertyGroups: PropertyGroup[] = [
  {
    controls: [
      { label: '禁用', prop: 'disabled', type: 'select', styleProp: false, options: [{ value: 'false', label: '否' }, { value: 'true', label: '是' }], width: 'half' },
      { label: '可见', prop: 'visible', type: 'select', styleProp: false, options: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }], width: 'half' },
    ],
    layout: 'row'
  },
  {
    controls: [
      { label: '透明度', prop: 'opacity', type: 'range', styleProp: true, defaultVal: 100 },
    ]
  },
  {
    title: '位置和尺寸',
    controls: [
      { label: 'X', prop: 'left', type: 'number', styleProp: true, width: 'quarter' },
      { label: 'Y', prop: 'top', type: 'number', styleProp: true, width: 'quarter' },
      { label: '宽', prop: 'width', type: 'number', styleProp: true, width: 'quarter', min: 1 },
      { label: '高', prop: 'height', type: 'number', styleProp: true, width: 'quarter', min: 1 },
    ],
    layout: 'row'
  },
  {
    title: '文字样式',
    subTitle: true,
    controls: [
      { label: '字号', prop: 'fontSize', type: 'number', styleProp: true, width: 'third', min: 1, defaultVal: 14 },
      { label: '粗细', prop: 'fontWeight', type: 'select', styleProp: true, width: 'third', options: [{ value: 'normal', label: '正常' }, { value: 'bold', label: '加粗' }, { value: '100', label: '100' }, { value: '300', label: '300' }, { value: '400', label: '400' }, { value: '500', label: '500' }, { value: '700', label: '700' }, { value: '900', label: '900' }] },
      { label: '装饰', prop: 'textDecoration', type: 'select', styleProp: true, width: 'third', options: [{ value: 'none', label: '无' }, { value: 'underline', label: '下划线' }, { value: 'line-through', label: '删除线' }, { value: 'overline', label: '上划线' }] },
    ],
    layout: 'row'
  },
  {
    controls: [
      { label: '字体', prop: 'fontFamily', type: 'select', styleProp: true, width: 'third', options: [{ value: 'inherit', label: '默认' }, { value: "'Segoe UI', sans-serif", label: 'Segoe UI' }, { value: '微软雅黑, sans-serif', label: '微软雅黑' }, { value: 'Arial, sans-serif', label: 'Arial' }, { value: 'SimHei, sans-serif', label: '黑体' }, { value: "'Consolas', monospace", label: 'Consolas' }, { value: 'SimSun, serif', label: '宋体' }, { value: 'KaiTi, serif', label: '楷体' }, { value: 'FangSong, serif', label: '仿宋' }] },
      { label: '对齐', prop: 'textAlign', type: 'select', styleProp: true, width: 'third', options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }, { value: 'right', label: '右对齐' }], defaultVal: 'center' },
      { label: '间距', prop: 'padding', type: 'number', styleProp: true, width: 'third', min: 0, defaultVal: 0 },
    ],
    layout: 'row'
  },
  {
    title: '颜色样式',
    subTitle: true,
    controls: [
      { label: '背景色', prop: 'backgroundColor', type: 'color', styleProp: true, width: 'third', defaultVal: '#ffffff' },
      { label: '文字色', prop: 'color', type: 'color', styleProp: true, width: 'third', defaultVal: '#333333' },
      { label: '边框色', prop: 'borderColor', type: 'color', styleProp: true, width: 'third', defaultVal: '#d9d9d9' },
    ],
    layout: 'row'
  },
  {
    title: '边框',
    subTitle: true,
    controls: [
      { label: '样式', prop: 'borderStyle', type: 'select', styleProp: true, width: 'third', options: [{ value: 'solid', label: '实线' }, { value: 'dashed', label: '虚线' }, { value: 'dotted', label: '点线' }, { value: 'double', label: '双线' }, { value: 'none', label: '无' }] },
      { label: '粗细', prop: 'borderWidth', type: 'number', styleProp: true, width: 'third', min: 1, defaultVal: 1 },
      { label: '圆角', prop: 'borderRadius', type: 'number', styleProp: true, width: 'third', min: 0, defaultVal: 4 },
    ],
    layout: 'row'
  },
]

/** 获取控件属性当前值用于显示 */
function getPropDisplayValue(ctrl: PropertyControl): any {
  if (!store.selectedWidget) return ctrl.defaultVal ?? ''
  if (ctrl.styleProp) {
    const val = store.selectedWidget.styleData?.base?.[ctrl.prop as keyof typeof store.selectedWidget.styleData]
    return val ?? ctrl.defaultVal ?? ''
  }
  const val = (store.selectedWidget as any)[ctrl.prop]
  if (typeof val === 'boolean') return val ? 'true' : 'false'
  return val ?? ctrl.defaultVal ?? ''
}

/** 获取范围滑块百分比值 */
function getRangePercent(ctrl: PropertyControl): number {
  if (!store.selectedWidget) return ctrl.defaultVal ?? 100
  if (ctrl.styleProp) {
    const val = store.selectedWidget.styleData?.base?.[ctrl.prop as keyof typeof store.selectedWidget.styleData]
    return val !== undefined ? Math.round(Number(val) * 100) : (ctrl.defaultVal ?? 100)
  }
  return ctrl.defaultVal ?? 100
}

/** 阴影状态 - 6字段拆分（新增透明度） */
const shadowX = ref(0)
const shadowY = ref(2)
const shadowBlur = ref(5)
const shadowSpread = ref(0)
const shadowColor = ref('#000000')      // 纯 hex，不含 alpha
const shadowAlpha = ref(30)             // 0-100，默认 30%

/** hex 转 rgb 对象 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  if (h.length < 6) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

/** 阴影编辑中标志位 - 防止 watch 与 updateWidgetStyle 循环触发 */
let _shadowEditing = false
/** 阴影更新防抖定时器 - 避免快速点击箭头时频繁触发重型CSS解析 */
let _shadowDebounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => store.selectedWidget?.style?.boxShadow, (val) => {
  if (_shadowEditing) return
  if (!val || typeof val !== 'string') return
  const match = val.match(/([\d.-]+)px\s+([\d.-]+)px\s+([\d.-]+)px\s+([\d.-]+)px\s+(.+)/)
  if (match) {
    const shx = parseFloat(match[1])
    const shy = parseFloat(match[2])
    const shb = parseFloat(match[3])
    const shs = parseFloat(match[4])
    const shc = match[5].trim()
    if (shadowX.value !== shx) shadowX.value = shx
    if (shadowY.value !== shy) shadowY.value = shy
    if (shadowBlur.value !== shb) shadowBlur.value = shb
    if (shadowSpread.value !== shs) shadowSpread.value = shs
    // 分离 hex 和 alpha
    const rgbaMatch = shc.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
    if (rgbaMatch) {
      const hex = '#' + [rgbaMatch[1], rgbaMatch[2], rgbaMatch[3]]
        .map(n => parseInt(n).toString(16).padStart(2, '0')).join('')
      if (shadowColor.value !== hex) shadowColor.value = hex
      const alpha = rgbaMatch[4] !== undefined ? Math.round(parseFloat(rgbaMatch[4]) * 100) : 100
      if (shadowAlpha.value !== alpha) shadowAlpha.value = alpha
    } else {
      if (shadowColor.value !== shc) shadowColor.value = shc
    }
  }
}, { immediate: true, flush: 'sync' })

const computedShadow = computed(() => {
  const rgb = hexToRgb(shadowColor.value)
  const a = shadowAlpha.value / 100
  return `${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowSpread.value}px rgba(${rgb.r},${rgb.g},${rgb.b},${a})`
})

function onShadowChange(event: Event, part: string) {
  const target = event.target as HTMLInputElement
  const val = parseFloat(target.value) || 0
  if (part === 'y') shadowY.value = val
  else if (part === 'blur') shadowBlur.value = val
  else if (part === 'spread') shadowSpread.value = val
  else shadowX.value = val
  if (_shadowDebounceTimer) clearTimeout(_shadowDebounceTimer)
  _shadowDebounceTimer = setTimeout(() => {
    _shadowEditing = true
    if (store.selectedWidget) {
      store.updateWidgetStyle(store.selectedWidget.id, { boxShadow: computedShadow.value })
    }
    _shadowEditing = false
    _shadowDebounceTimer = null
  }, 150)
}

function onShadowColorChange(value: string) {
  shadowColor.value = value
  if (_shadowDebounceTimer) clearTimeout(_shadowDebounceTimer)
  _shadowDebounceTimer = setTimeout(() => {
    _shadowEditing = true
    if (store.selectedWidget) {
      store.updateWidgetStyle(store.selectedWidget.id, { boxShadow: computedShadow.value })
    }
    _shadowEditing = false
    _shadowDebounceTimer = null
  }, 150)
}

function onShadowAlphaChange(event: Event) {
  const val = parseInt((event.target as HTMLInputElement).value) || 0
  shadowAlpha.value = val
  if (_shadowDebounceTimer) clearTimeout(_shadowDebounceTimer)
  _shadowDebounceTimer = setTimeout(() => {
    _shadowEditing = true
    if (store.selectedWidget) {
      store.updateWidgetStyle(store.selectedWidget.id, { boxShadow: computedShadow.value })
    }
    _shadowEditing = false
    _shadowDebounceTimer = null
  }, 150)
}

/** 画布样式源码 computed — 确保始终有默认值 */
const canvasCSSModel = computed(() => {
  return store.canvas.customCSS || ''
})

/** 控件ID名唯一性验证 — 选择控件时自动记录原名 */
const widgetOriginalName = ref('')
/** 标记名称唯一性检查是否已在 watch 中处理，避免 blur 重复检查 */
const nameCheckHandled = ref(false)

// 当选中的控件变化时，自动记录其原始名称，并在切换前检查旧控件名称唯一性
watch(() => store.selectedWidget, (widget, oldWidget) => {
  // 切换控件时清理阴影防抖定时器，防止延迟回调更新错误控件
  if (_shadowDebounceTimer) {
    clearTimeout(_shadowDebounceTimer)
    _shadowDebounceTimer = null
    _shadowEditing = false
  }
  // 切换前检查旧控件名称唯一性（解决焦点落在设计区控件时 blur 不触发的问题）
  if (oldWidget) {
    const oldName = oldWidget.name || ''
    const originalName = widgetOriginalName.value
    if (oldName && oldName !== originalName) {
      const isDuplicate = store.widgets.some(
        w => w.id !== oldWidget.id && w.name === oldName
      )
      if (isDuplicate) {
        store.updateWidget(oldWidget.id, { name: originalName } as any)
        store.saveState()
        ElMessage.warning(`控件ID名 "${oldName}" 已存在，已恢复为 "${originalName}"`)
      }
    }
    nameCheckHandled.value = true
  }

  // 仅当切换到不同控件时才更新（避免 @input 更新 store 后触发重新记录）
  if (widget && widget !== oldWidget) {
    widgetOriginalName.value = widget.name || ''
  }
}, { immediate: true })

function onWidgetNameBlur(event: Event) {
  // 如果 watch 已处理过名称唯一性检查（因选中控件切换导致 blur），则跳过
  if (nameCheckHandled.value) {
    nameCheckHandled.value = false
    return
  }
  const target = event.target as HTMLInputElement
  const newName = target.value.trim()
  if (!store.selectedWidget || !newName) return

  // 检查是否与其他控件重名（排除自身）
  const isDuplicate = store.widgets.some(
    w => w.id !== store.selectedWidget!.id && w.name === newName
  )

  if (isDuplicate) {
    // 通过 store 恢复原名，Vue 的 :value 绑定会自动更新 DOM
    store.updateWidget(store.selectedWidget.id, { name: widgetOriginalName.value } as any)
    store.saveState()
    ElMessage.warning(`控件ID名 "${newName}" 已存在，已恢复为 "${widgetOriginalName.value}"`)
  } else {
    // 无重名，更新记录的原名称（供下次编辑回退使用）
    widgetOriginalName.value = newName
  }
}

/** 画布属性变更（rAF 限流，帧内多次修改合并为一次更新 + 一次 saveState） */
function onCanvasChange(key: string, event: Event) {
  const target = event.target as HTMLInputElement
  let value: any
  if (target.type === 'checkbox') {
    value = target.checked
  } else {
    value = target.value
    if (['width', 'height', 'borderWidth', 'borderRadius'].includes(key)) {
      value = parseInt(value) || 0
    }
  }
  const cssKeys = ['backgroundColor', 'borderColor', 'borderWidth', 'borderRadius',
                   'width', 'height', 'titleBarBgColor', 'titleBarTextColor', 'titleBarBtnColor']
  scheduleCanvasChange(key, value, cssKeys.includes(key))
}

/** 总控透明度变更（rAF 限流）— 仅设置总控透明度，不影响独立画布/标题栏透明度 */
function onMasterOpacityChange(event: Event) {
  const target = event.target as HTMLInputElement
  const opacity = parseInt(target.value) / 100
  scheduleCanvasChange('masterOpacity', opacity, true)
  scheduleCanvasChange('_dummy', null, false, () => {
    store.messageBoxConfig.opacity = opacity
    store.inputBoxConfig.opacity = opacity
    for (const widget of store.widgets) {
      store.updateWidgetStyle(widget.id, { opacity })
    }
  })
}

/**
 * 将 opacity 值合并到 CSS 文本中，通过注释块 [auto:opacity] 标记自动生成的部分
 * @param css 原始 CSS 文本
 * @param className CSS 类选择器，如 '.mb-dialog'
 * @param opacity 透明度值 (0-1)
 * @returns 合并后的 CSS 文本
 */
function mergeOpacityToCSS(css: string, className: string, opacity: number): string {
  // 移除旧的 [auto:opacity] 注释块
  css = css.replace(/\/\* \[auto:opacity\][\s\S]*?opacity:\s*[\d.]+\s*;\s*\n?/g, '')
  // 如果 opacity 不是 1（默认值），追加新的自动块
  if (opacity < 0.999) {
    css = css.trimEnd() + '\n\n/* [auto:opacity] */\n' + className + ' { opacity: ' + opacity + '; }\n'
  }
  return css
}

/**
 * 从 CSS 文本中提取 opacity 值
 * @param css CSS 文本
 * @param className CSS 类选择器
 * @returns 提取的 opacity 值，未找到返回 null
 */
function extractOpacityFromCSS(css: string, className: string): number | null {
  // 先检查 [auto:opacity] 标记块
  const autoMatch = css.match(/\/\* \[auto:opacity\] \*\/[\s\S]*?opacity:\s*([\d.]+)/)
  if (autoMatch) return parseFloat(autoMatch[1])
  // 再检查通用类选择器块
  const escapedClass = className.replace(/\./g, '\\.')
  const regex = new RegExp(escapedClass + '\\s*\\{[^}]*opacity:\\s*([\\d.]+)')
  const match = css.match(regex)
  if (match) return parseFloat(match[1])
  return null
}

/** 画布自身透明度变更（rAF 限流）— 联动 CSS 编辑器。滑块值 = opacity × masterOpacity，设置时反除 masterOpacity */
function onCanvasOpacityChange(event: Event) {
  const target = event.target as HTMLInputElement
  const effectiveOpacity = parseInt(target.value) / 100
  const masterOpacity = store.canvas.masterOpacity ?? 1
  const opacity = masterOpacity > 0 ? effectiveOpacity / masterOpacity : effectiveOpacity
  scheduleCanvasChange('opacity', Math.min(1, Math.max(0, opacity)), true)
}

/** 底部背景开关变更 */
function onBodyBgEnabledChange(enabled: boolean) {
  if (!store.canvas.bodyBackground) {
    store.canvas.bodyBackground = {
      enabled: false, imageUrl: '', imageSize: 'cover',
      imageRepeat: 'no-repeat', imagePosition: 'center'
    }
  }
  store.canvas.bodyBackground.enabled = enabled
  scheduleSaveState()
}

/** 底部背景文本/下拉属性变更 */
function onBodyBgChange(key: string, event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  if (!store.canvas.bodyBackground) return
  ;(store.canvas.bodyBackground as any)[key] = target.value
  scheduleSaveState()
}

/** 底部背景选择图片文件 */
function onBodyBgSelectImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      if (!store.canvas.bodyBackground) return
      store.canvas.bodyBackground.imageUrl = dataUrl
      scheduleSaveState()
    }
    reader.readAsDataURL(file)
  }
  input.click()
}

/** 标题栏透明度变更（rAF 限流）— 联动 CSS 编辑器。滑块值 = opacity × masterOpacity，设置时反除 masterOpacity */
function onCanvasOpacityPropChange(prop: string, event: Event) {
  const target = event.target as HTMLInputElement
  const effectiveOpacity = parseInt(target.value) / 100
  const masterOpacity = store.canvas.masterOpacity ?? 1
  const opacity = masterOpacity > 0 ? effectiveOpacity / masterOpacity : effectiveOpacity
  scheduleCanvasChange(prop, Math.min(1, Math.max(0, opacity)), true)
}

/** 预设图标列表（用于画布标题栏图标选择） */
const iconPresets = [
  { name: 'fa-star', label: '星形' },
  { name: 'fa-home', label: '主页' },
  { name: 'fa-cog', label: '设置' },
  { name: 'fa-bolt', label: '闪电' },
  { name: 'fa-heart', label: '心形' },
  { name: 'fa-cube', label: '方块' },
  { name: 'fa-circle', label: '圆形' },
  { name: 'fa-wifi', label: 'WiFi' }
]

/** 画布标题栏图标选择 */
function onCanvasIconSelect(iconName: string) {
  store.updateCanvas({ titleBarIconName: iconName, titleBarIconHtml: '' })
  store.saveState()
}

/** 画布标题栏图标文件导入（ICO/PNG/SVG等） */
function onCanvasIconFileImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    store.updateCanvas({
      titleBarIconHtml: `<img src="${dataUrl}" style="width:16px;height:16px;vertical-align:middle;" />`,
      titleBarIconName: ''
    })
    store.saveState()
  }
  reader.readAsDataURL(file)
}

/** 画布自定义 CSS 变更（CssEditor @change 回调）— 联动解析到属性面板 */
function onCanvasCssChange(cssText: string) {
  store.updateCanvasCustomCSS(cssText)
  store.saveState()
}

/** 画布标签页切换 */
function onCanvasTabChange() {
  // 无需额外处理，CssEditor 已通过 @change 自动同步
}

/** 信息提示框透明度变更 — 同步更新 customCSS */
function onMBOpacityChange(event: Event) {
  const target = event.target as HTMLInputElement
  const opacity = parseInt(target.value) / 100
  store.messageBoxConfig.opacity = opacity
  store.messageBoxConfig.customCSS = mergeOpacityToCSS(store.messageBoxConfig.customCSS || '', '.mb-dialog', opacity)
  scheduleSaveState()
}

/** 输入框透明度变更 — 同步更新 customCSS */
function onIBOpacityChange(event: Event) {
  const target = event.target as HTMLInputElement
  const opacity = parseInt(target.value) / 100
  store.inputBoxConfig.opacity = opacity
  store.inputBoxConfig.customCSS = mergeOpacityToCSS(store.inputBoxConfig.customCSS || '', '.ib-dialog', opacity)
  scheduleSaveState()
}

/** 进度条颜色变更 — @input + rAF防抖 */
let _barColorRAF: number | null = null
function onBarColorInput(event: Event) {
  if (!store.selectedWidget) return
  const val = (event.target as HTMLInputElement).value
  if (_barColorRAF) cancelAnimationFrame(_barColorRAF)
  _barColorRAF = requestAnimationFrame(() => {
    store.setWidgetStyleProp(store.selectedWidget!, 'barColor', val)
    store.saveState()
    _barColorRAF = null
  })
}

/** 内置控件类型集合（这些已有专用属性面板，不显示通用自定义属性） */
const BUILTIN_WIDGET_TYPES = new Set([
  'button', 'input', 'checkbox', 'toggle', 'comboBox', 'label', 'divider',
  'hyperlink', 'textarea', 'radioGroup', 'tabsContainer', 'progressBar',
  'datetimePicker', 'logOutput', 'iconButton', 'imageBox', 'cardBox',
  'listBox', 'treeView', 'dataGrid', 'contextMenu', 'tooltip',
  'messageBox', 'inputBox',
])

/** 自定义控件专有属性（从 JSON 配置 defaultProps 提取，仅对非内置类型生效） */
const customWidgetProps = computed(() => {
  const w = store.selectedWidget
  if (!w) return []
  // 内置控件已有专用面板，不显示通用属性
  if (BUILTIN_WIDGET_TYPES.has(w.type)) return []

  const config = getWidgetJSONConfig(w.type)
  if (!config) return []

  const defaultProps = config.defaultProps || {}
  const result: Array<{ key: string; type: string; value: any; options?: string[] }> = []
  for (const [key, defaultVal] of Object.entries(defaultProps)) {
    // 跳过系统通用属性
    if (key === 'visible' || key === 'disabled') continue
    const currentVal = (w as any)[key] ?? defaultVal
    // 类型推断：数组 → 下拉框，颜色字符串 → 颜色选择器
    const type = typeof defaultVal === 'boolean' || typeof currentVal === 'boolean' ? 'boolean'
      : typeof defaultVal === 'number' || typeof currentVal === 'number' ? 'number'
      : Array.isArray(defaultVal) || Array.isArray(currentVal) ? 'select'
      : (typeof (defaultVal) === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(defaultVal))
        || (typeof (currentVal) === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(currentVal)) ? 'color'
      : 'string'
    const entry: { key: string; type: string; value: any; options?: string[] } = { key, type, value: currentVal }
    if (type === 'select') {
      entry.options = Array.isArray(defaultVal) ? defaultVal : (Array.isArray(currentVal) ? currentVal : [])
      entry.value = currentVal && !Array.isArray(currentVal) ? currentVal : (Array.isArray(defaultVal) ? defaultVal[0] : '')
    }
    result.push(entry)
  }
  return result
})

/** 自定义控件属性变更 */
function onCustomPropChange(key: string, event: Event) {
  const target = event.target as HTMLInputElement
  let value: any
  if (target.type === 'checkbox') {
    value = target.checked
  } else if (target.type === 'number') {
    value = parseFloat(target.value) || 0
  } else {
    value = target.value
  }
  if (store.selectedWidget) {
    store.updateWidget(store.selectedWidget.id, { [key]: value } as any)
    store.debouncedSaveState()
  }
}

/** 控件属性变更 */
function onWidgetPropChange(key: string, event: Event, overrideValue?: any) {
  const target = event.target as HTMLInputElement
  let value: any
  if (overrideValue !== undefined) {
    value = overrideValue
  } else if (target.type === 'checkbox') {
    value = target.checked
  } else if (target.type === 'select-one') {
    const val = target.value
    if (val === 'true') value = true
    else if (val === 'false') value = false
    else if (!isNaN(Number(val))) value = parseInt(val)
    else value = val
  } else if (target.type === 'number') {
    value = parseInt(target.value) || 0
  } else {
    value = target.value
  }
  if (store.selectedWidget) {
    store.updateWidget(store.selectedWidget.id, { [key]: value } as any)

    // 布局变更时同步更新 customCSS 中的 flex-direction / flex-wrap
    if (key === 'layout') {
      const cssProps: Record<string, any> = {
        flexDirection: value === 'horizontal' ? 'row' : 'column',
        flexWrap: value === 'horizontal' ? 'wrap' : 'nowrap'
      }
      const currentCSS = store.selectedWidget.customCSS || ''
      store.selectedWidget.customCSS = mergeStyleToCSS(currentCSS, store.selectedWidget.id, cssProps)
    }

    // showUnderline 变更时同步更新 customCSS 和 styleData.base 中的 text-decoration
    if (key === 'showUnderline') {
      const td = value ? 'underline' : 'none'
      const cssProps: Record<string, any> = { textDecoration: td }
      const currentCSS = store.selectedWidget.customCSS || ''
      store.selectedWidget.customCSS = mergeStyleToCSS(currentCSS, store.selectedWidget.id, cssProps)
      // 同步到 styleData.base，确保导出时 CSS 块输出正确的 text-decoration
      if (store.selectedWidget.styleData) {
        store.selectedWidget.styleData.base.textDecoration = td
      }
      // 同步到 widget.style（旧格式兼容层）
      const selStyle = store.selectedWidget.style as any
      if (selStyle) selStyle.textDecoration = td
    }

    store.debouncedSaveState()
  }
}

/**
 * 样式属性变更（从快速样式控件触发）
 * 使用 updateWidgetStyle 实现 style ↔ customCSS 双向同步
 * @param key 样式属性名
 * @param event 输入事件
 * @param isRangeSlider 是否为 0-100 范围滑块（值需除以 100，如 opacity）
 */
function onStyleChange(key: string, event: Event, isRangeSlider?: boolean) {
  const target = event.target as HTMLInputElement
  let value: any
  if (isRangeSlider) {
    value = parseInt(target.value) / 100
  } else if (target.type === 'number') {
    value = parseInt(target.value) || 0
    // 宽/高下限不低于 1，手动输入小于 1 自动恢复为 1
    if ((key === 'width' || key === 'height') && value < 1) value = 1
  } else {
    value = target.value
  }
  if (store.selectedWidget) {
    store.updateWidgetStyle(store.selectedWidget.id, { [key]: value })
    store.debouncedSaveState()
  }
}

/**
 * CSS 编辑器内容变更（防抖后触发）
 * 使用 updateWidgetCustomCSS 实现 customCSS → style 的同步
 */
function onCssChange(cssText: string) {
  if (store.selectedWidget) {
    store.updateWidgetCustomCSS(store.selectedWidget.id, cssText)
    store.saveState()
  }
}

/** 新增选项（组合框/单选组） */
function onAddOption() {
  if (!store.selectedWidget) return
  const type = store.selectedWidget.type
  if (type !== 'comboBox' && type !== 'radioGroup') return
  const options = [...(store.selectedWidget.options || []), '新选项']
  store.updateWidget(store.selectedWidget.id, { options } as any)
  store.saveState()
}

/** 删除选项（组合框/单选组） */
function onRemoveOption(index: number) {
  if (!store.selectedWidget) return
  const type = store.selectedWidget.type
  if (type !== 'comboBox' && type !== 'radioGroup') return
  if ((store.selectedWidget.options || []).length <= 1) return
  const options = (store.selectedWidget.options || []).filter((_, i) => i !== index)
  let selectedIndex = store.selectedWidget.selectedIndex || 0
  if (selectedIndex >= options.length) selectedIndex = Math.max(0, options.length - 1)
  store.updateWidget(store.selectedWidget.id, { options, selectedIndex } as any)
  store.saveState()
}

/** 修改单个选项文本（组合框/单选组） */
function onOptionTitleChange(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (!store.selectedWidget) return
  const type = store.selectedWidget.type
  if (type !== 'comboBox' && type !== 'radioGroup') return
  const options = [...(store.selectedWidget.options || [])]
  options[index] = target.value
  store.updateWidget(store.selectedWidget.id, { options } as any)
  store.saveState()
}

/** 选项列表变更 */
function onOptionsChange(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const options = target.value.split('\n').filter(l => l.trim())
  if (store.selectedWidget) {
    store.updateWidget(store.selectedWidget.id, { options } as any)
    store.saveState()
  }
}

/** 新增标签页 */
function onAddTab() {
  if (!store.selectedWidget || store.selectedWidget.type !== 'tabsContainer') return
  store.addTab(store.selectedWidget.id, '新标签页')
  store.saveState()
}

/** 隐藏/显示标签头 */
function onHideTabHeaderChange(event: Event) {
  if (!store.selectedWidget || store.selectedWidget.type !== 'tabsContainer') return
  const target = event.target as HTMLInputElement
  store.updateWidget(store.selectedWidget.id, { hideTabHeader: target.checked } as any)
  store.saveState()
}

/** 删除标签页 */
function onRemoveTab(tabIndex: number) {
  if (!store.selectedWidget || store.selectedWidget.type !== 'tabsContainer') return
  store.removeTab(store.selectedWidget.id, tabIndex)
  store.saveState()
}

/** 修改标签页标题 */
function onTabTitleChange(tabIndex: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (!store.selectedWidget || store.selectedWidget.type !== 'tabsContainer') return
  store.updateTabTitle(store.selectedWidget.id, tabIndex, target.value)
  store.saveState()
}

/** 右键菜单：所有可绑定目标控件（排除4种静默控件，含画布） */
const ctxMenuAllTargets = computed(() => {
  const result: { id: string; name: string; label: string }[] = []
  result.push({ id: '__canvas__', name: '画布', label: '画布' })
  const silent = ['contextMenu', 'tooltip', 'messageBox', 'inputBox']
  const addFromList = (list: Widget[]) => {
    for (const w of list) {
      if (silent.includes(w.type)) continue
      const label = getWidgetLibraryItems().find(it => it.type === w.type)?.label || w.type
      result.push({ id: w.id, name: w.name || w.id, label })
      if (w.children && w.children.length > 0) {
        addFromList(w.children)
      }
    }
  }
  addFromList(store.widgets)
  return result
})

/** 右键菜单：扁平化菜单项列表 */
const ctxMenuFlatList = computed(() => {
  const items = store.selectedWidget?.contextMenuItems || []
  const result: any[] = []
  function flatten(list: any[], level: number) {
    for (const item of list) {
      item._level = level
      result.push(item)
      if (item.children && item.children.length > 0) {
        flatten(item.children, level + 1)
      }
    }
  }
  flatten(items, 0)
  return result
})

const ctxMenuEditIndex = ref<number | null>(null)
const ctxMenuCSS = ref('')
const ctxPreviewVisible = ref(false)
const ctxPreviewContentEl = ref<HTMLElement | null>(null)
let ctxPreviewStyleEl: HTMLStyleElement | null = null

/** 当选中控件变化时，加载右键菜单的CSS */
watch(() => store.selectedWidget, (widget) => {
  if (widget && widget.type === 'contextMenu') {
    ctxMenuCSS.value = widget.contextMenuCSS || ''
  }
}, { immediate: true })

/** CSS编辑变化时，保存到 widget 和全局默认值，同时更新实时预览 */
function onCtxMenuCSSChange(val: string) {
  ctxMenuCSS.value = val
  if (store.selectedWidget && store.selectedWidget.type === 'contextMenu') {
    store.selectedWidget.contextMenuCSS = val
    store.contextMenuDefaultCSS = val
    store.saveState()
  }
  if (ctxPreviewVisible.value) updateCtxPreviewStyle(val)
}

/** 右键菜单预览默认CSS */
const CTX_PREVIEW_DEFAULT_CSS = [
  '.ctx-menu{position:relative;background:#ffffff;border:1px solid #d9d9d9;border-radius:6px;box-shadow:0 3px 12px rgba(0,0,0,0.3);padding:0;min-width:150px;font-family:Segoe UI,Tahoma,sans-serif;font-size:13px;color:#333;}',
  '.ctx-menu-item{border-radius:2px;margin:4px 4px;padding:7px 16px;cursor:default;display:flex;align-items:center;gap:8px;white-space:nowrap;position:relative;}',
  '.ctx-menu-item:hover{background:#eeeeeeff;}',
  '.ctx-menu-separator{height:1px;background:#e8e8e8;margin:4px 12px;}',
  '.ctx-menu-item-icon{font-size:14px;width:18px;text-align:center;flex-shrink:0;}',
  '.ctx-menu-item-text{flex:1;}',
  '.ctx-menu-item-arrow{font-size:10px;color:#999;margin-left:24px;flex-shrink:0;}',
  '.ctx-sub-menu{position:absolute;left:100%;top:-4px;z-index:100000;background:#ffffff;border:1px solid #d9d9d9;border-radius:6px;box-shadow:0 3px 12px rgba(0,0,0,0.15);padding:4px 0;min-width:160px;display:none;}',
  '.ctx-sub-menu.left{left:auto;right:100%;}'
].join('\n')

// --- 右键菜单预览弹窗拖拽功能（新增）---
const ctxLivePreviewModalRef = ref<HTMLElement | null>(null)
// 边缘拖拽调整预览弹窗尺寸（仅在弹窗可见时启用）
useResizable(ctxLivePreviewModalRef, { enabled: ctxPreviewVisible, minWidth: 400, minHeight: 300 })
let ctxDragging = false
let ctxDragStartX = 0, ctxDragStartY = 0
let ctxStartLeft = 0, ctxStartTop = 0

function initCtxDraggable() {
  const modal = ctxLivePreviewModalRef.value
  if (!modal) return
  const header = modal.querySelector('.ctx-live-preview-header') as HTMLElement
  if (!header) return
  // 避免重复绑定
  header.removeEventListener('mousedown', onCtxDragStart)
  header.addEventListener('mousedown', onCtxDragStart)
}
function onCtxDragStart(e: MouseEvent) {
  const target = e.target as HTMLElement
  // 如果点击的是关闭按钮或其内部，不启动拖拽
  if (target.closest('.ctx-live-preview-close')) return
  const modal = ctxLivePreviewModalRef.value
  if (!modal) return
  e.preventDefault()
  ctxDragging = true
  ctxDragStartX = e.clientX
  ctxDragStartY = e.clientY
  const rect = modal.getBoundingClientRect()
  ctxStartLeft = rect.left
  ctxStartTop = rect.top
  // 确保 modal 使用固定定位并清除 transform
  modal.style.position = 'fixed'
  modal.style.left = ctxStartLeft + 'px'
  modal.style.top = ctxStartTop + 'px'
  modal.style.transform = 'none'
  document.addEventListener('mousemove', onCtxDragMove)
  document.addEventListener('mouseup', onCtxDragEnd)
  document.body.style.userSelect = 'none'
}
function onCtxDragMove(e: MouseEvent) {
  if (!ctxDragging) return
  e.preventDefault()
  const modal = ctxLivePreviewModalRef.value
  if (!modal) return
  let newLeft = ctxStartLeft + (e.clientX - ctxDragStartX)
  let newTop = ctxStartTop + (e.clientY - ctxDragStartY)
  // 边界限制（视口）
  const viewWidth = window.innerWidth
  const viewHeight = window.innerHeight
  const modalWidth = modal.offsetWidth
  const modalHeight = modal.offsetHeight
  newLeft = Math.min(Math.max(newLeft, 0), viewWidth - modalWidth)
  newTop = Math.min(Math.max(newTop, 0), viewHeight - modalHeight)
  modal.style.left = newLeft + 'px'
  modal.style.top = newTop + 'px'
}
function onCtxDragEnd() {
  ctxDragging = false
  document.removeEventListener('mousemove', onCtxDragMove)
  document.removeEventListener('mouseup', onCtxDragEnd)
  document.body.style.userSelect = ''
}

// --- 气泡框预览弹窗拖拽功能（新增）---
const ttLivePreviewModalRef = ref<HTMLElement | null>(null)
let ttDragging = false
let ttDragStartX = 0, ttDragStartY = 0
let ttStartLeft = 0, ttStartTop = 0

function initTtDraggable() {
  const modal = ttLivePreviewModalRef.value
  if (!modal) return
  const header = modal.querySelector('.ctx-live-preview-header') as HTMLElement
  if (!header) return
  header.removeEventListener('mousedown', onTtDragStart)
  header.addEventListener('mousedown', onTtDragStart)
}
function onTtDragStart(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('.ctx-live-preview-close')) return
  const modal = ttLivePreviewModalRef.value
  if (!modal) return
  e.preventDefault()
  ttDragging = true
  ttDragStartX = e.clientX
  ttDragStartY = e.clientY
  const rect = modal.getBoundingClientRect()
  ttStartLeft = rect.left
  ttStartTop = rect.top
  modal.style.position = 'fixed'
  modal.style.left = ttStartLeft + 'px'
  modal.style.top = ttStartTop + 'px'
  modal.style.transform = 'none'
  document.addEventListener('mousemove', onTtDragMove)
  document.addEventListener('mouseup', onTtDragEnd)
  document.body.style.userSelect = 'none'
}
function onTtDragMove(e: MouseEvent) {
  if (!ttDragging) return
  e.preventDefault()
  const modal = ttLivePreviewModalRef.value
  if (!modal) return
  let newLeft = ttStartLeft + (e.clientX - ttDragStartX)
  let newTop = ttStartTop + (e.clientY - ttDragStartY)
  const viewWidth = window.innerWidth
  const viewHeight = window.innerHeight
  const modalWidth = modal.offsetWidth
  const modalHeight = modal.offsetHeight
  newLeft = Math.min(Math.max(newLeft, 0), viewWidth - modalWidth)
  newTop = Math.min(Math.max(newTop, 0), viewHeight - modalHeight)
  modal.style.left = newLeft + 'px'
  modal.style.top = newTop + 'px'
}
function onTtDragEnd() {
  ttDragging = false
  document.removeEventListener('mousemove', onTtDragMove)
  document.removeEventListener('mouseup', onTtDragEnd)
  document.body.style.userSelect = ''
}
// ---------------------------------

function openCtxPreview() {
  if (!store.selectedWidget) return
  store.selectedWidget.contextMenuCSS = ctxMenuCSS.value
  store.saveState()
  ctxPreviewVisible.value = true
  nextTick(() => {
    buildCtxPreviewDOM()
    // 初始化模态框为居中位置（清除内联样式，让 CSS 居中生效，再转为像素位置方便拖拽）
    const modal = ctxLivePreviewModalRef.value
    if (modal) {
      // 确保初始没有 left/top 内联样式，使其基于 CSS 居中
      modal.style.left = ''
      modal.style.top = ''
      modal.style.transform = ''
      // 强制重排后获取实际位置，转换为固定定位像素值
      setTimeout(() => {
        const rect = modal.getBoundingClientRect()
        modal.style.position = 'fixed'
        modal.style.left = rect.left + 'px'
        modal.style.top = rect.top + 'px'
        modal.style.transform = 'none'
      }, 10)
    }
    initCtxDraggable()
  })
}

function closeCtxPreview() {
  ctxPreviewVisible.value = false
  ctxPreviewStyleEl = null
  // 清理拖拽标记
  ctxDragging = false
  document.removeEventListener('mousemove', onCtxDragMove)
  document.removeEventListener('mouseup', onCtxDragEnd)
  document.body.style.userSelect = ''
}

function updateCtxPreviewStyle(customCSS: string) {
  if (!ctxPreviewStyleEl) return
  ctxPreviewStyleEl.textContent = CTX_PREVIEW_DEFAULT_CSS + '\n' + (customCSS || '')
}

function buildCtxPreviewDOM() {
  if (!ctxPreviewContentEl.value || !store.selectedWidget) return
  ctxPreviewContentEl.value.innerHTML = ''
  const items = store.selectedWidget.contextMenuItems || []
  ctxPreviewStyleEl = document.createElement('style')
  ctxPreviewContentEl.value.appendChild(ctxPreviewStyleEl)
  updateCtxPreviewStyle(ctxMenuCSS.value)
  const menu = document.createElement('div')
  menu.className = 'ctx-menu'
  function buildDOM(list: any[]): DocumentFragment {
    const frag = document.createDocumentFragment()
    for (const item of list) {
      if (item.type === 'separator') {
        const sep = document.createElement('div')
        sep.className = 'ctx-menu-separator'
        frag.appendChild(sep)
      } else {
        const el = document.createElement('div')
        el.className = 'ctx-menu-item'
        if (item.icon) {
          const icon = document.createElement('span')
          icon.className = 'ctx-menu-item-icon'
          icon.textContent = item.icon
          el.appendChild(icon)
        }
        const text = document.createElement('span')
        text.className = 'ctx-menu-item-text'
        text.textContent = item.text || ''
        el.appendChild(text)
        if (item.children && item.children.length > 0) {
          const arrow = document.createElement('span')
          arrow.className = 'ctx-menu-item-arrow'
          arrow.textContent = '▶'
          el.appendChild(arrow)
          const sub = document.createElement('div')
          sub.className = 'ctx-sub-menu'
          sub.appendChild(buildDOM(item.children))
          el.appendChild(sub)
          el.addEventListener('mouseenter', () => { sub.style.display = 'block' })
          el.addEventListener('mouseleave', () => { sub.style.display = 'none' })
        }
        frag.appendChild(el)
      }
    }
    return frag
  }
  menu.appendChild(buildDOM(items))
  ctxPreviewContentEl.value.style.display = 'flex'
  ctxPreviewContentEl.value.style.alignItems = 'center'
  ctxPreviewContentEl.value.style.justifyContent = 'center'
  ctxPreviewContentEl.value.appendChild(menu)
}

function ctxMenuPreview() {
  // No-op - handled by openCtxPreview
}
function onContextMenuPropChange(prop: string, e: Event) {
  if (!store.selectedWidget) return
  const val = (e.target as HTMLInputElement).value
  ;(store.selectedWidget as any)[prop] = val
  store.saveState()
}

function ctxMenuAddItem() {
  if (!store.selectedWidget || !store.selectedWidget.contextMenuItems) return
  const items = store.selectedWidget.contextMenuItems
  const newItem: any = { id: 'cm_' + Date.now(), text: '新菜单项', type: 'normal' }
  items.push(newItem)
  ctxMenuEditIndex.value = items.length - 1
  store.saveState()
}

function ctxMenuAddSeparator() {
  if (!store.selectedWidget || !store.selectedWidget.contextMenuItems) return
  const items = store.selectedWidget.contextMenuItems
  items.push({ id: 'cmsp_' + Date.now(), text: '', type: 'separator' })
  ctxMenuEditIndex.value = items.length - 1
  store.saveState()
}

function ctxMenuAddChild() {
  if (!store.selectedWidget || ctxMenuEditIndex.value === null) return
  const items = store.selectedWidget.contextMenuItems || []
  const flatList = ctxMenuFlatList.value
  if (ctxMenuEditIndex.value >= flatList.length) return
  const parentItem = flatList[ctxMenuEditIndex.value]
  if (parentItem.type === 'separator') return
  if (!parentItem.children) parentItem.children = []
  const newChild: any = { id: 'cmc_' + Date.now(), text: '子菜单项', type: 'normal' }
  parentItem.children.push(newChild)
  store.selectedWidget.contextMenuItems = [...items]
  store.saveState()
}

function ctxMenuDeleteItem() {
  if (!store.selectedWidget || ctxMenuEditIndex.value === null) return
  const items = store.selectedWidget.contextMenuItems || []
  const flatList = ctxMenuFlatList.value
  if (ctxMenuEditIndex.value >= flatList.length) return
  const targetItem = flatList[ctxMenuEditIndex.value]
  const parent = findCtxParentArray(items, targetItem.id)
  if (parent) {
    const idx = parent.findIndex((i: any) => i.id === targetItem.id)
    if (idx >= 0) parent.splice(idx, 1)
  }
  store.selectedWidget.contextMenuItems = [...items]
  if ((store.selectedWidget.contextMenuItems || []).length === 0) {
    ctxMenuEditIndex.value = null
  } else if (ctxMenuEditIndex.value >= (ctxMenuFlatList.value.length)) {
    ctxMenuEditIndex.value = Math.max(0, ctxMenuFlatList.value.length - 1)
  }
  store.saveState()
}

function findCtxParentArray(list: any[], targetId: string): any[] | null {
  for (const item of list) {
    if (item.id === targetId) return list
    if (item.children && item.children.length > 0) {
      const found = findCtxParentArray(item.children, targetId)
      if (found) return found
    }
  }
  return null
}

function ctxMenuMoveItem(direction: number) {
  if (!store.selectedWidget || ctxMenuEditIndex.value === null) return
  const items = store.selectedWidget.contextMenuItems || []
  const flatList = ctxMenuFlatList.value
  if (ctxMenuEditIndex.value >= flatList.length) return
  const targetItem = flatList[ctxMenuEditIndex.value]
  const parent = findCtxParentArray(items, targetItem.id)
  if (!parent) return
  const idx = parent.findIndex((i: any) => i.id === targetItem.id)
  if (idx < 0) return
  const j = idx + direction
  if (j < 0 || j >= parent.length) return
  ;[parent[idx], parent[j]] = [parent[j], parent[idx]]
  store.selectedWidget.contextMenuItems = [...items]
  store.saveState()
}

function onCtxMenuItemTextChange(idx: number, e: Event) {
  const flatList = ctxMenuFlatList.value
  if (idx >= flatList.length) return
  flatList[idx].text = (e.target as HTMLInputElement).value
  store.saveState()
}

/** 气泡框：所有可绑定目标控件 */
const tooltipAllTargets = computed(() => {
  const result: { id: string; name: string; label: string }[] = []
  const silent = ['contextMenu', 'tooltip', 'messageBox', 'inputBox']
  const addFromList = (list: Widget[]) => {
    for (const w of list) {
      if (silent.includes(w.type)) continue
      const label = getWidgetLibraryItems().find(it => it.type === w.type)?.label || w.type
      result.push({ id: w.id, name: w.name || w.id, label })
      if (w.children && w.children.length > 0) {
        addFromList(w.children)
      }
    }
  }
  addFromList(store.widgets)
  return result
})

const tooltipCSS = ref('')
const tooltipContentText = ref('')
const ttPreviewVisible = ref(false)
// 边缘拖拽调整预览弹窗尺寸（仅在弹窗可见时启用）
useResizable(ttLivePreviewModalRef, { enabled: ttPreviewVisible, minWidth: 400, minHeight: 300 })
const ttPreviewContentEl = ref<HTMLElement | null>(null)
let ttPreviewStyleEl: HTMLStyleElement | null = null

/** 气泡框预览默认CSS */
const TT_PREVIEW_DEFAULT_CSS = '.tt-content{background:#333;color:#fff;padding:8px 12px;border-radius:6px;font-size:13px;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;line-height:1.5;max-width:300px;word-wrap:break-word;box-shadow:0 4px 12px rgba(0,0,0,0.3);position:relative;} .tt-arrow{position:absolute;width:0;height:0;border:6px solid transparent;} .tt-arrow.bottom{bottom:-12px;left:50%;transform:translateX(-50%);border-top-color:#333;} .tt-arrow.top{top:-12px;left:50%;transform:translateX(-50%);border-bottom-color:#333;} .tt-arrow.right{right:-12px;top:50%;transform:translateY(-50%);border-left-color:#333;} .tt-arrow.left{left:-12px;top:50%;transform:translateY(-50%);border-right-color:#333;}'

/** 当选中控件变化时，加载气泡框的CSS和内容 */
watch(() => store.selectedWidget, (widget) => {
  if (widget && widget.type === 'tooltip') {
    tooltipCSS.value = widget.tooltipCSS || ''
    tooltipContentText.value = widget.tooltipContent || ''
  }
}, { immediate: true })

/** CSS编辑变化时，保存到 widget 和全局默认值，同时更新实时预览 */
function onTooltipCSSChange(val: string) {
  tooltipCSS.value = val
  if (store.selectedWidget && store.selectedWidget.type === 'tooltip') {
    store.selectedWidget.tooltipCSS = val
    store.tooltipDefaultCSS = val
    store.saveState()
  }
  if (ttPreviewVisible.value) updateTooltipPreviewStyle(val)
}

/** 更新预览样式 */
function updateTooltipPreviewStyle(customCSS: string) {
  if (!ttPreviewStyleEl) return
  ttPreviewStyleEl.textContent = TT_PREVIEW_DEFAULT_CSS + '\n' + (customCSS || '')
}

/** 打开预览弹窗（左预览 + 右CSS编辑器） */
function openTooltipPreview() {
  if (!store.selectedWidget) return
  store.selectedWidget.tooltipCSS = tooltipCSS.value
  store.selectedWidget.tooltipContent = tooltipContentText.value
  store.saveState()
  ttPreviewVisible.value = true
  nextTick(() => {
    buildTooltipPreviewDOM()
    const modal = ttLivePreviewModalRef.value
    if (modal) {
      modal.style.left = ''
      modal.style.top = ''
      modal.style.transform = ''
      setTimeout(() => {
        const rect = modal.getBoundingClientRect()
        modal.style.position = 'fixed'
        modal.style.left = rect.left + 'px'
        modal.style.top = rect.top + 'px'
        modal.style.transform = 'none'
      }, 10)
    }
    initTtDraggable()
  })
}

/** 关闭预览弹窗 */
function closeTooltipPreview() {
  ttPreviewVisible.value = false
  ttPreviewStyleEl = null
  ttDragging = false
  document.removeEventListener('mousemove', onTtDragMove)
  document.removeEventListener('mouseup', onTtDragEnd)
  document.body.style.userSelect = ''
}

function buildTooltipPreviewDOM() {
  if (!ttPreviewContentEl.value || !store.selectedWidget) return
  ttPreviewContentEl.value.innerHTML = ''
  const position = store.selectedWidget.tooltipPosition || 'auto'
  const content = tooltipContentText.value || ''
  const allowHTML = store.selectedWidget.tooltipAllowHTML || false
  ttPreviewStyleEl = document.createElement('style')
  ttPreviewContentEl.value.appendChild(ttPreviewStyleEl)
  updateTooltipPreviewStyle(tooltipCSS.value)
  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'position:relative;display:inline-block;'
  const arrowPosition = position === 'auto' ? 'bottom' : ({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as Record<string, string>)[position] || 'bottom'
  const arrow = document.createElement('div')
  arrow.className = 'tt-arrow ' + arrowPosition
  const el = document.createElement('div')
  el.className = 'tt-content'
  if (allowHTML) {
    el.innerHTML = content
  } else {
    el.textContent = content
  }
  if (position === 'top' || position === 'auto') {
    wrapper.appendChild(el)
    wrapper.appendChild(arrow)
  } else {
    wrapper.appendChild(arrow)
    wrapper.appendChild(el)
  }
  ttPreviewContentEl.value.style.display = 'flex'
  ttPreviewContentEl.value.style.alignItems = 'center'
  ttPreviewContentEl.value.style.justifyContent = 'center'
  ttPreviewContentEl.value.appendChild(wrapper)
}

function onTooltipPropChange(prop: string, e: Event) {
  if (!store.selectedWidget) return
  const target = e.target as HTMLInputElement
  const val = prop === 'tooltipAllowHTML' ? target.checked : target.value
  ;(store.selectedWidget as any)[prop] = prop === 'tooltipShowDelay' || prop === 'tooltipHideDelay' ? Number(val) : val
  store.saveState()
}

function tooltipPreview() {
  // No-op - handled by openTooltipPreview
}

const mbActiveTab = ref<'basic' | 'css'>('basic')

const ibActiveTab = ref<'basic' | 'css'>('basic')

watch(() => store.messageBoxPanelVisible, (visible) => {
  if (visible) {
    mbActiveTab.value = 'basic'
  }
})

watch(() => store.inputBoxPanelVisible, (visible) => {
  if (visible) {
    ibActiveTab.value = 'basic'
  }
})

watch(mbActiveTab, (tabName) => {
  if (tabName === 'basic') {
    const css = store.messageBoxConfig.customCSS || ''
    const extractedOpacity = extractOpacityFromCSS(css, '.mb-dialog')
    if (extractedOpacity !== null) {
      store.messageBoxConfig.opacity = extractedOpacity
      store.saveState()
    }
  }
})

watch(ibActiveTab, (tabName) => {
  if (tabName === 'basic') {
    const css = store.inputBoxConfig.customCSS || ''
    const extractedOpacity = extractOpacityFromCSS(css, '.ib-dialog')
    if (extractedOpacity !== null) {
      store.inputBoxConfig.opacity = extractedOpacity
      store.saveState()
    }
  }
})

// DEFAULT_MESSAGEBOX_CSS / DEFAULT_INPUTBOX_CSS 已从 config/globalComponentsConfig.ts 导入

/** 信息提示框自定义 CSS 变更（CssEditor @change 回调） */
function onMBCssChange(cssText: string) {
  store.messageBoxConfig.customCSS = cssText
  store.saveState()
}

/** 输入框自定义 CSS 变更（CssEditor @change 回调） */
function onIBCssChange(cssText: string) {
  store.inputBoxConfig.customCSS = cssText
  store.saveState()
}

/** 恢复信息框默认样式 */
function resetMBCSS() {
  store.messageBoxConfig.customCSS = DEFAULT_MESSAGEBOX_CSS
  store.saveState()
}

/** 恢复输入框默认样式 */
function resetIBCSS() {
  store.inputBoxConfig.customCSS = DEFAULT_INPUTBOX_CSS
  store.saveState()
}

function onMBPropChange(prop: string, e: Event) {
  const target = e.target as HTMLInputElement
  const val = prop === 'width' || prop === 'defaultButton' ? Number(target.value) : target.value
  ;(store.messageBoxConfig as any)[prop] = val
  scheduleSaveState()
}

function onMBPropCheck(prop: string, e: Event) {
  const target = e.target as HTMLInputElement
  ;(store.messageBoxConfig as any)[prop] = target.checked
  scheduleSaveState()
}

/** 信息提示框标签页切换 */
function onMBTabChange(tabName: string) {
  if (tabName === 'basic') {
    const css = store.messageBoxConfig.customCSS || ''
    const extractedOpacity = extractOpacityFromCSS(css, '.mb-dialog')
    if (extractedOpacity !== null) {
      store.messageBoxConfig.opacity = extractedOpacity
      scheduleSaveState()
    }
  }
}

function messageBoxPreview() {
  // CSS 已通过 CssEditor @change 自动同步到 store，无需额外保存
  const existing = document.querySelector('.mb-preview-overlay')
  if (existing) existing.remove()

  const cfg = store.messageBoxConfig

  const defaultCSS = `
.mb-preview-overlay{position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:99999;display:flex;align-items:center;justify-content:center;}
.mb-dialog{background:#fff;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.2);max-width:90vw;overflow:hidden;display:flex;flex-direction:column;}
.mb-header{padding:16px 20px 8px;font-size:16px;font-weight:600;color:#333;cursor:default;display:flex;align-items:center;justify-content:space-between;}
.mb-header-title{flex:1;}
.mb-header-close{width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;background:transparent;color:#999;font-size:16px;border-radius:4px;}
.mb-header-close:hover{background:#f0f0f0;color:#333;}
.mb-body{padding:8px 20px 16px;display:flex;align-items:flex-start;gap:12px;}
.mb-icon{font-size:28px;flex-shrink:0;}
.mb-message{font-size:14px;color:#555;line-height:1.6;word-wrap:break-word;flex:1;}
.mb-footer{padding:12px 20px 16px;display:flex;justify-content:flex-end;gap:8px;}
.mb-btn{padding:7px 20px;border:1px solid #d9d9d9;border-radius:4px;background:#fff;font-size:13px;cursor:pointer;}
.mb-btn:hover{border-color:#409eff;color:#409eff;}
.mb-btn.mb-btn-primary{background:#409eff;color:#fff;border-color:#409eff;}
.mb-btn.mb-btn-primary:hover{background:#66b1ff;}
`.trim()

  const overlay = document.createElement('div')
  overlay.className = 'mb-preview-overlay'
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay && cfg.closeOnOverlayClick !== false) overlay.remove()
  })

  const combinedStyle = document.createElement('style')
  combinedStyle.textContent = defaultCSS + '\n' + (cfg.customCSS && cfg.customCSS.trim() ? cfg.customCSS : '')
  overlay.appendChild(combinedStyle)

  const btnDefs: Record<string, Array<{ text: string; result: string }>> = {
    ok: [{ text: '确定', result: 'ok' }],
    okcancel: [{ text: '确定', result: 'ok' }, { text: '取消', result: 'cancel' }],
    yesno: [{ text: '是', result: 'yes' }, { text: '否', result: 'no' }],
    yesnocancel: [{ text: '是', result: 'yes' }, { text: '否', result: 'no' }, { text: '取消', result: 'cancel' }],
    retrycancel: [{ text: '重试', result: 'retry' }, { text: '取消', result: 'cancel' }]
  }

  const iconMap: Record<string, string> = { none: '', info: 'ℹ️', warning: '⚠️', error: '❌', question: '❓' }

  if (cfg.showOverlay !== false) {
    overlay.style.background = 'rgba(0,0,0,0.4)'
  } else {
    overlay.style.background = 'transparent'
  }

  const dialog = document.createElement('div')
  dialog.className = 'mb-dialog'
  if (cfg.width) dialog.style.width = cfg.width + 'px'
  if (cfg.height && cfg.height > 0) dialog.style.height = cfg.height + 'px'
  dialog.style.opacity = (cfg.opacity !== undefined ? cfg.opacity : 1) as any

  let html = '<div class="mb-header"><span class="mb-header-title">' + (cfg.title || '提示') + '</span><button class="mb-header-close" onclick="this.closest(\'.mb-preview-overlay\').remove()">✕</button></div>'
  html += '<div class="mb-body">'
  if (cfg.icon === 'custom' && cfg.customIcon) {
    html += '<span class="mb-icon">' + cfg.customIcon + '</span>'
  } else if (cfg.icon !== 'none' && iconMap[cfg.icon]) {
    html += '<span class="mb-icon">' + iconMap[cfg.icon] + '</span>'
  }
  html += '<div class="mb-message">' + (cfg.message || '') + '</div>'
  html += '</div>'

  const btns = btnDefs[cfg.buttons] || btnDefs['ok']
  const defIdx = typeof cfg.defaultButton === 'number' ? cfg.defaultButton : 0
  html += '<div class="mb-footer">'
  btns.forEach(function (b, idx) {
    html += '<button class="mb-btn' + (idx === defIdx ? ' mb-btn-primary' : '') + '" onclick="this.closest(\'.mb-preview-overlay\').remove()">' + b.text + '</button>'
  })
  html += '</div>'

  dialog.innerHTML = html
  overlay.appendChild(dialog)

  // 可拖动标题栏
  if (cfg.draggable !== false) {
    let isDragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0
    const header = dialog.querySelector('.mb-header') as HTMLElement
    if (header) {
      header.style.cursor = 'move'
      header.addEventListener('mousedown', function (e) {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
        const rect = dialog.getBoundingClientRect()
        origLeft = rect.left
        origTop = rect.top
        dialog.style.position = 'fixed'
        dialog.style.left = origLeft + 'px'
        dialog.style.top = origTop + 'px'
        dialog.style.margin = '0'
        e.preventDefault()
      })
      document.addEventListener('mousemove', function (e) {
        if (!isDragging) return
        dialog.style.left = (origLeft + e.clientX - startX) + 'px'
        dialog.style.top = (origTop + e.clientY - startY) + 'px'
      })
      document.addEventListener('mouseup', function () {
        isDragging = false
      })
    }
  }

  document.body.appendChild(overlay)
}

function onIBPropChange(prop: string, e: Event) {
  const target = e.target as HTMLInputElement
  const val = prop === 'width' || prop === 'defaultButton' || prop === 'height' ? Number(target.value) : target.value
  ;(store.inputBoxConfig as any)[prop] = val
  scheduleSaveState()
}

function onIBPropCheck(prop: string, e: Event) {
  const target = e.target as HTMLInputElement
  ;(store.inputBoxConfig as any)[prop] = target.checked
  scheduleSaveState()
}

/** 输入框标签页切换 */
function onIBTabChange(tabName: string) {
  if (tabName === 'basic') {
    const css = store.inputBoxConfig.customCSS || ''
    const extractedOpacity = extractOpacityFromCSS(css, '.ib-dialog')
    if (extractedOpacity !== null) {
      store.inputBoxConfig.opacity = extractedOpacity
      scheduleSaveState()
    }
  }
}

function inputBoxPreview() {
  // CSS 已通过 CssEditor @change 自动同步到 store，无需额外保存
  const existing = document.querySelector('.ib-preview-overlay')
  if (existing) existing.remove()

  const cfg = store.inputBoxConfig

  const defaultCSS = `
.ib-preview-overlay{position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:99999;display:flex;align-items:center;justify-content:center;}
.ib-dialog{background:#fff;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.2);max-width:90vw;overflow:hidden;display:flex;flex-direction:column;}
.ib-header{padding:16px 20px 8px;font-size:16px;font-weight:600;color:#333;display:flex;align-items:center;justify-content:space-between;}
.ib-header-title{flex:1;}
.ib-header-close{width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;background:transparent;color:#999;font-size:16px;border-radius:4px;}
.ib-header-close:hover{background:#f0f0f0;color:#333;}
.ib-body{padding:8px 20px 16px;}
.ib-prompt{font-size:14px;color:#555;line-height:1.6;margin-bottom:10px;}
.ib-input{width:100%;padding:7px 10px;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;color:#333;outline:none;box-sizing:border-box;}
.ib-input:focus{border-color:#409eff;box-shadow:0 0 0 2px rgba(64,158,255,0.2);}
.ib-footer{padding:12px 20px 16px;display:flex;justify-content:flex-end;gap:8px;}
.ib-btn{padding:7px 20px;border:1px solid #d9d9d9;border-radius:4px;background:#fff;font-size:13px;cursor:pointer;}
.ib-btn:hover{border-color:#409eff;color:#409eff;}
.ib-btn.ib-btn-primary{background:#409eff;color:#fff;border-color:#409eff;}
.ib-btn.ib-btn-primary:hover{background:#66b1ff;}
`.trim()

  const btnDefs: Record<string, Array<{ text: string; result: string }>> = {
    ok: [{ text: '确定', result: 'ok' }],
    okcancel: [{ text: '确定', result: 'ok' }, { text: '取消', result: 'cancel' }]
  }

  const overlay = document.createElement('div')
  overlay.className = 'ib-preview-overlay'
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay && cfg.closeOnOverlayClick !== false) overlay.remove()
  })

  const combinedStyle = document.createElement('style')
  combinedStyle.textContent = defaultCSS + '\n' + (cfg.customCSS && cfg.customCSS.trim() ? cfg.customCSS : '')
  overlay.appendChild(combinedStyle)

  if (cfg.showOverlay !== false) {
    overlay.style.background = 'rgba(0,0,0,0.4)'
  } else {
    overlay.style.background = 'transparent'
  }

  const dialog = document.createElement('div')
  dialog.className = 'ib-dialog'
  if (cfg.width) dialog.style.width = cfg.width + 'px'
  if (cfg.height && cfg.height > 0) dialog.style.height = cfg.height + 'px'
  dialog.style.opacity = (cfg.opacity !== undefined ? cfg.opacity : 1) as any

  let html = '<div class="ib-header"><span class="ib-header-title">' + (cfg.title || '输入') + '</span><button class="ib-header-close" onclick="this.closest(\'.ib-preview-overlay\').remove()">✕</button></div>'
  html += '<div class="ib-body">'
  html += '<div class="ib-prompt">' + (cfg.prompt || '') + '</div>'
  html += '<input class="ib-input" type="' + (cfg.inputType || 'text') + '" value="' + (cfg.defaultValue || '') + '" />'
  html += '</div>'

  const btns = btnDefs[cfg.buttons] || btnDefs['okcancel']
  const defIdx = typeof cfg.defaultButton === 'number' ? cfg.defaultButton : 0
  html += '<div class="ib-footer">'
  btns.forEach(function (b, idx) {
    html += '<button class="ib-btn' + (idx === defIdx ? ' ib-btn-primary' : '') + '" onclick="this.closest(\'.ib-preview-overlay\').remove()">' + b.text + '</button>'
  })
  html += '</div>'

  dialog.innerHTML = html

  if (cfg.draggable !== false) {
    const header = dialog.querySelector('.ib-header') as HTMLElement
    if (header) {
      header.style.cursor = 'move'
      let isDragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0
      header.addEventListener('mousedown', function (e) {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
        const rect = dialog.getBoundingClientRect()
        origLeft = rect.left
        origTop = rect.top
        dialog.style.position = 'fixed'
        dialog.style.left = origLeft + 'px'
        dialog.style.top = origTop + 'px'
        dialog.style.margin = '0'
        e.preventDefault()
      })
      document.addEventListener('mousemove', function (e) {
        if (!isDragging) return
        dialog.style.left = (origLeft + e.clientX - startX) + 'px'
        dialog.style.top = (origTop + e.clientY - startY) + 'px'
      })
      document.addEventListener('mouseup', function () {
        isDragging = false
      })
    }
  }

  overlay.appendChild(dialog)
  document.body.appendChild(overlay)
}
</script>

<style scoped>
.property-panel {
  width: 320px;
  background-color: rgba(255, 255, 255, 0.72);
  border-left: 1px solid #e0e0e0;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.icon-select-presets {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.no-selection {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

/* 标签页容器 */
.property-tabs-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.property-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Apple 风格分段式标签页 */
.property-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 8px 8px 0;
  flex-shrink: 0;
  border-bottom: none;
}

.property-tabs :deep(.el-tabs__nav-wrap) {
  background: transparent;
}

.property-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.property-tabs :deep(.el-tabs__nav) {
  display: flex;
  background-color:#ffffff;
  border-radius: 4px;
  padding: 3px;
  gap: 0;
  box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.1);
  width:100%;
}

.property-tabs :deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  color: #666;
  border-radius: 3px;
  transition: all 0.2s ease;
  box-shadow:0px 1px 2px rgba(0, 0, 0, 0.1);
  background-color:#ffffff;
  border-bottom: 1px solid  rgba(0, 0, 0, 0.1);
  padding:0px;
  margin-right:5px;
  user-select: none;
}

.property-tabs :deep(.el-tabs__item:hover) {
  color: #333;
}

.property-tabs :deep(.el-tabs__item.is-active) {
  user-select: none;
  background: linear-gradient(30deg, #405254, #007987) !important;
  color: #fff;
  font-weight: 500;
  box-shadow:0px 1px 2px rgba(0, 0, 0, 0.4);
  padding-left: 50px;
  padding-right: 50px;
  border: 1px solid  rgba(0, 0, 0, 0.02);
}

.property-tabs :deep(.el-tabs__active-bar) {
  display: none;
  background-color:#e9eaeb;
}

.property-tabs :deep(.el-tabs__content) {
  flex: 1;
  min-height: 0;
}

.property-tabs :deep(.el-tab-pane) {
  height: 100%;
  overflow-y: auto;
}

.property-form {
  padding: 10px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.props-section {
  background-color: #fafafa;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e8e8e8;
  margin-bottom: 12px;
}

.props-section:last-child {
  margin-bottom: 0;
}

.props-section-title {
  font-size: 14px;
  font-weight: 500;
  color: #181818;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
}

.props-section-title.sub-title {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-top: 10px;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed #e0e0e0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.form-group.row-btns {
  flex-direction: row;
  gap: 6px;
  margin-bottom: 4px;
}

.flex-1 {
  flex: 1;
}

.form-group label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.checkbox-label {
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 4px;
  cursor: pointer;
}

.form-group label input[type="checkbox"] {
  margin: 0;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
}

.form-group textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  resize: vertical;
  font-family: 'Segoe UI Variable, Segoe UI, sans-serif';
}

.form-group.customcss textarea {
	min-height: 220px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-group input[type="color"] {
  width: 100%;
  height: 32px;
  padding: 2px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

/* 只读的控件ID输入框 */
.form-group input.id-readonly {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  user-select: none;
}

.form-row {
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.form-group.half { flex: 1; min-width: 0; }
.form-group.third { flex: 1; min-width: 0; }
.form-group.quarter { flex: 1; min-width: 0; }

.radio-group-inline {
  display: flex;
  gap: 12px;
  padding: 4px 0;
}

.radio-group-inline label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  cursor: pointer;
  color: #333;
}

/* 标签页管理 */
.tab-manager {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tab-row {
  display: flex;
  gap: 4px;
  align-items: center;
}

.tab-title-input {
  flex: 1;
  height: 28px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
}

.tab-title-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.tab-delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  background-color: #ff4d4f;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tab-delete-btn:hover {
  background-color: #ff7875;
}

.add-tab-btn {
  width: 100%;
  margin-top: 4px;
}

/* 日志管理 */
.log-list {
  max-height: 160px;
  overflow-y: auto;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fff;
  margin-bottom: 8px;
}

.log-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
}

.log-row:last-child {
  border-bottom: none;
}

.log-index {
  color: #999;
  min-width: 18px;
  text-align: center;
}

.log-color-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.log-text-preview {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
}

.log-del-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.log-del-btn:hover {
  background-color: #ff4d4f;
  color: #fff;
}

.log-empty-hint {
  text-align: center;
  padding: 12px;
  color: #999;
  font-size: 12px;
}

.props-action-btn {
  width: 100%;
  height: 30px;
  border: 1px solid #1890ff;
  background: #1890ff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.props-action-btn:hover {
  background: #40a9ff;
}

.props-action-btn:disabled {
  background: #d9d9d9;
  border-color: #d9d9d9;
  cursor: not-allowed;
}

.props-action-btn.danger {
  background: #ff4d4f;
  border-color: #ff4d4f;
}

/* 列表框项编辑器行样式 */
.list-item-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}

.list-item-row:hover {
  background: #f5f5f5;
}

.list-item-row.list-item-active {
  background: #e6f4ff;
}

.list-item-idx {
  width: 20px;
  text-align: center;
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
}

.list-item-inp {
  flex: 1;
  height: 24px;
  border: 1px solid transparent;
  background: transparent;
  padding: 0 4px;
  font-size: 12px;
  font-family: inherit;
  outline: none;
  border-radius: 3px;
}

.list-item-inp:focus {
  border-color: #1890ff;
  background: #fff;
}

.props-action-btn.danger:hover {
  background: #ff7875;
}

/* CSS 编辑器面板 */
.css-editor-panel {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 15px 0px 12px;
}

/* 图标 HTML 帮助 */
.icon-help-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #e8e8e8;
  color: #666;
  font-size: 10px;
  font-weight: 700;
  cursor: help;
  flex-shrink: 0;
  transition: background-color 0.2s, color 0.2s;
  margin-left: 2px;
}

.icon-help-badge:hover {
  background-color: #1890ff;
  color: #fff;
}

/* ===== 树形框编辑器样式 ===== */
.property-group {
  margin-top: 12px;
  padding: 10px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 12px;
}
.group-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
}
.switch-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.switch-text {
  font-size: 13px;
  color: #333;
  font-weight: normal;
}
.tree-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
  margin-bottom: 16px;
}
.tree-editor-toolbar {
  display: flex;
  gap: 2px;
  padding: 4px 6px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}
.tree-editor-toolbar button {
  padding: 2px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  font-size: 11px;
  color: #333;
}
.tree-editor-toolbar button:hover:not(:disabled) {
  background: #e0edff;
  border-color: #005499;
}
.tree-editor-toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.tree-editor-list {
  max-height: 260px;
  overflow-y: auto;
}
.tree-editor-item {
  display: flex;
  align-items: center;
  padding: 2px 0;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}
.tree-editor-item:hover {
  background: #f5f5f5;
}
.tree-editor-item.selected {
  background: #e0edff;
}
.tree-editor-indent {
  display: flex;
  align-items: center;
  gap: 3px;
  flex: 1;
  padding: 2px 6px;
}
.tree-editor-toggle {
  cursor: pointer;
  font-size: 10px;
  width: 14px;
  text-align: center;
  flex-shrink: 0;
  color: #666;
}
.tree-editor-toggle-spacer {
  width: 14px;
  flex-shrink: 0;
}
.tree-editor-icon {
  font-size: 13px;
  flex-shrink: 0;
}
.tree-editor-checkbox {
  width: 13px;
  height: 13px;
  margin: 0;
  flex-shrink: 0;
  cursor: pointer;
  accent-color: #0078D4;
}
.tree-editor-text {
  font-size: 11px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tree-editor-input {
  padding: 1px 4px;
  border: 1px solid #005499;
  border-radius: 2px;
  outline: none;
  flex: 1;
  min-width: 0;
}
.tree-editor-empty {
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 13px;
}

/* ===== 多项表格编辑器样式 ===== */
.dg-col-list { margin-bottom: 6px; }

.dg-col-item { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; font-size: 10px; }
.dg-col-item input[type="text"],
.dg-col-item input[type="number"] { padding: 2px 4px; border: 1px solid #d9d9d9; border-radius: 3px; font-size: 10px; background: inherit; }
.dg-col-item label { display: flex; align-items: center; gap: 3px; cursor: pointer; }
.dg-col-item label input { margin: 0; }
.btn-dg-del { background: #ff4d4f; color: #fff; border: none; border-radius: 3px; width: 20px; height: 20px; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; padding: 0; }
.btn-dg-del:hover { background: #ff7875; }
.btn-dg-add { background: #1890ff; color: #fff; border: none; border-radius: 4px; padding: 4px 12px; cursor: pointer; font-size: 12px; margin-top: 4px; }
.btn-dg-add:hover { background: #40a9ff; }
.dg-row-editor-wrap { overflow-x: auto; }
.dg-row-editor-table { width: 100%; border-collapse: collapse; font-size: 10px; }
.dg-row-editor-table th,
.dg-row-editor-table td { border: 1px solid #e0e0e0; padding: 2px 4px; }
.dg-row-editor-table th { background: #f5f5f5; font-weight: 600; white-space: nowrap; }
.dg-row-editor-table input { padding: 2px 4px; border: 1px solid #d9d9d9; border-radius: 2px; font-size: 10px; background: inherit; }
.dg-empty-hint { color: #999; font-size: 12px; padding: 10px 0; text-align: center; }

/* 样式编辑 CSS 编辑器 */
.css-editor-hint {
  font-size: 11px; color: #666; margin-bottom: 8px;
  padding: 6px 8px; background: #fdf6ec; border-radius: 4px;
  border-left: 3px solid #e6a23c; line-height: 1.5;
}
.appletab-bar {
  display: flex;
  align-items: center;      /* 关键：子元素不拉伸，保持自身高度 */
  background: #f0f0f0;
  border-radius: 6px;
  padding: 5px;
  margin-bottom: 15px;
  gap: 1px;
  margin: 10px 15px 0px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border: 1px solid #ededed;
    margin-bottom: 5px;

}

.appletab-btn {
  flex: 1;                   /* 平分宽度 */
  text-align: center;
  padding: 6px 10px;         /* 左右 padding 缩小，给宽度留余量 */
  cursor: pointer;
  background: transparent;
  font-size: 14px;
  color: #666;
  user-select: none;
  border-radius: 4px;
  transition: all 0.1s ease;
  white-space: nowrap;
  min-width: 0;              /* 关键：允许按钮缩小到比内容还窄 */
  height: 32px;              /* 固定高度，不随浏览器变 */
  line-height: 20px;         /* 配合固定高度，文字垂直居中 */
}

.appletab-btn:hover:not(.active) {
  font-weight:300px;
}

.appletab-btn.active {
  background: #ffffff;
  color: #1890ff;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
</style>

<style>
.icon-help-popover {
  padding: 0 !important;
}

/* 多项表格属性面板 - 折叠内容区继承背景色 */
.props-section .el-collapse-item__header,
.props-section .el-collapse-item__wrap,
.props-section .el-collapse-item__content {
  background: inherit !important;
}
.props-section .el-collapse-item__wrap,
.props-section .el-collapse-item__content{
	padding-bottom: 4px;
}
.icon-help-content {
  padding: 0;
  max-height: 420px;
  overflow-y: auto;
}

.help-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  padding: 12px 16px 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 4px;
}

.help-section {
  padding: 8px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.help-section:last-of-type {
  border-bottom: none;
}

.help-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.help-section code {
  display: block;
  background: #f5f5f5;
  color: #d63384;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-family: 'Consolas', 'Courier New', monospace;
  margin: 3px 0;
  word-break: break-all;
  white-space: pre-wrap;
}

.help-hint {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.ctx-menu-preview-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 99999;
}

.tt-preview-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-footer {
  padding: 10px 16px;
  background: #fffbe6;
  border-top: 1px solid #ffe58f;
  font-size: 11px;
  color: #666;
  display: flex;
  flex-direction: column;
}

.ctx-tab-bar {
  display: flex;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
  gap: 1px;
}

.ctx-tab-btn {
  display: inline-block;
  padding: 3px 10px;
  cursor: pointer;
  background: transparent;
  font-size: 12px;
  color: #666;
  user-select: none;
  border-radius: 4px;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.ctx-tab-btn:hover:not(.active) {
  background: #e0e0e0;
  color: #333;
}

.ctx-tab-btn.active {
  background: #ffffff;
  color: #1890ff;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.ctx-preview-btn {
    flex-shrink: 0;
    margin: 10px 0px;
    height: 40px;
    width: 100%;
    padding: 3px 10px;
    background: #b91c1c;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease;
}

.ctx-preview-btn:hover {
  background: #991b1b;
}

.ctx-preview-altbtn{
  flex-shrink: 0;
  margin-left: 8px;
  padding: 4px 12px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.ctx-preview-altbtn:hover {
  background: #40a9ff;
}

.ctx-reset-btn {
  flex-shrink: 0;
  padding: 2px 8px;
  background: #fff;
  color: #999;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.ctx-reset-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
  background: #fff1f0;
}

/* 实时预览弹窗（左预览 + 右CSS编辑器） */
.ctx-live-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ctx-live-preview-modal {
  width: 60vw;
  height: 80vh;
  background: transparent;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 拖拽时使用固定定位，初始居中由 flex 父级保证 */
}
.ctx-live-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  cursor: grab;
  user-select: none;
}
.ctx-live-preview-header:active {
  cursor: grabbing;
}
.ctx-live-preview-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
.ctx-live-preview-close:hover {
  background:rgb(255, 29, 29);
  color: #ffffff;
}
.ctx-live-preview-close:active {
  background:rgb(204, 0, 0);
}
.ctx-live-preview-body {
  flex: 1;
  display: flex;
  min-height: 0;
}
.ctx-live-preview-left {
  min-width: 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color:transparent;
  width: 20vw;
  background-color:rgba(0, 0, 0, 0.6);
}
.ctx-live-preview-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.ctx-live-preview-right .css-editor-wrapper {
  flex: 1;
  min-height: 200px;
}
</style>