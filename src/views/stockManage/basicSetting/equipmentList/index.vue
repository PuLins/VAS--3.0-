<template>
	<section class="tab_content-wrapper">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<template v-for="(item,index) in filters.domSearch">
					<template v-if="index == 0">
						<div style="display:inline-block;margin:0 10px 10px 0;">
							<el-input class="noborder color icon nofocus" @keyup.native.ctrl.8="clearAll()" @keyup.native.13="handleQuery" placeholder="请输入查询内容" v-model="filters.domSearch[index].content">
								<el-select class="wp_select" multiple clearable filterable v-model="filters.domSearch[index].select" slot="prepend" placeholder="选择条件">
									<el-option label="设备编号" value="prodnum"></el-option>
									<el-option label="设备规格" value="modelname"></el-option>
									<el-option label="设备类别" value="modelspecname"></el-option>
									<el-option label="库房" value="storagename"></el-option>
									<el-option label="设备状态" value="prodstatus"></el-option>
									<el-option label="维修状态" value="isrepairing"></el-option>
								</el-select>
								<template v-if="index == filters.domSearch.length-1">
									<el-button slot="append" @click="addSelect" icon="el-icon-plus" title="添加查询条件"></el-button>
								</template>
								<template v-else>
									<el-button slot="append" @click="removeSelect(index)" icon="el-icon-minus" title="移除查询条件"></el-button>
								</template>
							</el-input>
						</div>
					</template>
					<template v-else>
						<el-col :span="24">
							<div style="display:inline-block;margin:0 10px 10px 0;">
								<el-input class="noborder color icon nofocus" @keyup.native.ctrl.8="clearAll()" @keyup.native.13="handleQuery" placeholder="请输入查询内容" v-model="filters.domSearch[index].content">
									<el-select class="wp_select" multiple clearable filterable v-model="filters.domSearch[index].select" slot="prepend" placeholder="选择条件">
										<el-option label="设备编号" value="prodnum"></el-option>
										<el-option label="设备规格" value="modelname"></el-option>
										<el-option label="设备类别" value="modelspecname"></el-option>
										<el-option label="库房" value="storagename"></el-option>
										<el-option label="设备状态" value="prodstatus"></el-option>
										<el-option label="维修状态" value="isrepairing"></el-option>
									</el-select>
									<template v-if="index == filters.domSearch.length-1">
										<el-button slot="append" @click="addSelect" icon="el-icon-plus" title="添加查询条件"></el-button>
									</template>
									<template v-else>
										<el-button slot="append" @click="removeSelect(index)" icon="el-icon-minus" title="移除查询条件"></el-button>
									</template>
								</el-input>
							</div>
						</el-col>
					</template>

					<template v-if="index == 0">
						<el-form-item>
							<el-button type="primary" @click="handleQuery" icon="el-icon-search">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleInSto" icon="el-icon-plus">新增入库</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="info" @click="showType" icon="el-icon-edit">设备规格</el-button>
						</el-form-item>
						<el-form-item>
				                            <el-switch v-model="filters.isrepairing" active-value="0" active-text="正常" inactive-value="1" inactive-text="维修中" @change="showData"></el-switch>
				                         </el-form-item>
					</template>
				</template>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :max-height="windowOutHeight-275" border :data="listData" ref="multipleTable" highlight-current-row v-loading="listLoading" @selection-change="selsChange">
			<el-table-column type="index" width="30" align="center" label="#">
			</el-table-column>
			<el-table-column type="selection" width="40" align="center">
			</el-table-column>
			<el-table-column prop="prodnum" label="IMEI" width="170" align="center" >
				<template slot-scope="scope">{{scope.row.prodnum}}
                	<el-badge v-if="scope.row.isold == '0' && scope.row.isrepairing !== '2'" class="new" value="新" style="top:0.5em;" />
                	<el-badge v-if="scope.row.isrepairing == '2'" class="mark" value="坏" style="top:0.5em;" />
	            </template>
			</el-table-column>
			<el-table-column prop="modelname" label="规格" align="center" >
			</el-table-column>
			<el-table-column prop="modelspecname" label="类别" align="center" >
			</el-table-column>
			<el-table-column prop="suppliername" label="供应商" align="center" >
			</el-table-column>
			<el-table-column prop="storagename" label="库房" align="center" >
			</el-table-column>
			<el-table-column prop="prodstatus" label="设备状态" width="80" align="center" >
			</el-table-column>
			<el-table-column prop="bindstatus" label="绑定状态" width="80" align="center" >
				<template slot-scope="scope">
			                    <el-tag :type="scope.row.bindstatus == '未绑定' ? 'danger' : scope.row.bindstatus == '已绑定' ? 'primary' : '--'">
			                        {{ scope.row.bindstatus }}
			                    </el-tag>
			            </template>
			</el-table-column>
			<el-table-column prop="isrepairing" label="维修状态" width="80" align="center" :formatter="repairFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" align="center" >
			</el-table-column>
			<el-table-column  fixed="right" label="操作" width="120" align="center">
				<template slot-scope="scope">
					<el-button id="button" @click="formDetailHandle(scope.row.prodid,scope.row)" title="详情" :disabled="scope.row.isdelete == '1' ? true : false">
						<i :class="scope.row.isdelete == '1' ? 'iconfont icon-xiangqing operate' : 'iconfont icon-xiangqing operate operate-xiangqing'"></i>
					</el-button>
					<el-dropdown>
						<el-button id="button" title="维修"><i class="iconfont icon-shebeianzhuang operate operate-guanji"></i></el-button>
						<el-dropdown-menu slot="dropdown">
						    <el-dropdown-item :disabled="scope.row.prodstatus !== '在库' || scope.row.isrepairing == '1'" @click.native="handleRepair(0, scope.row)">开始维修</el-dropdown-item>
						    <el-dropdown-item :disabled="scope.row.isrepairing !== '1'" @click.native="handleRepair(1, scope.row)">维修结果</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-button id="button" @click="handleBind(scope.$index, scope.row)" :title="scope.row.bindstatus == '已绑定' ? '解绑卡' : '绑定卡'">
						<i :class="scope.row.bindstatus == '已绑定' ? 'iconfont icon-jiechubangding operate operate-jiebang' : 'iconfont icon-bangding- operate operate-bangding'"></i>
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchUnbind" v-show="this.sels.length !== 0"><i class="iconfont icon-jiechubangding"></i> 批量解绑</el-button>
			<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :page-sizes="[15, 50, 80, 99]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!-- 详情 弹窗 start-->
		<el-dialog title="设备详情" :modal-append-to-body="false" :visible.sync="formDialogTableVisible" class="details">
			<el-tabs v-model="activeName">
                			<el-tab-pane label="设备详情" name="first">
					<el-row  v-if="psData !== null">
						<el-col :span="24">
							<span class="formTile">设备信息</span>
						</el-col>
						<el-col :span="9">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>设备编号:</dt>
								<dd>{{ psData.prodnum }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>设备规格:</dt>
								<dd>{{ psData.modelname }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>设备类型:</dt>
								<dd>{{ psData.modelspecname }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>库房:</dt>
								<dd>{{ psData.storagename }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>供应商:</dt>
								<dd>{{ psData.suppliername == undefined ? '--' : psData.suppliername }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>绑定状态:</dt>
								<dd>{{ psData.bindstatus }}</dd>
							</dl>
						</el-col>
						<el-col :span="9">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>设备状态:</dt>
								<dd>{{ psData.prodstatus }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>通讯协议:</dt>
								<dd>{{ psData.protocolname == undefined ? '--' : psData.protocolname }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>安装位置:</dt>
								<dd>{{ psData.installPosition == undefined ? '--' : psData.installPosition }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>入库方式:</dt>
								<dd>{{ psData.instoragtype }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>创建人:</dt>
								<dd>{{psData.createbyname == undefined ? '--' : psData.createbyname}}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>创建日期:</dt>
								<dd>{{psData.createdate == null ? "--" :fmtdata.formatDate.format(new Date(psData.createdate), 'yyyy-MM-dd') }}</dd>
							</dl>
						</el-col>
						<el-col :span="6">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>是否组装:</dt>
								<dd>{{ psData.ispack == '1' ? '是' : psData.ispack == '0' ? '否' : '' }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>是否旧设备:</dt>
								<dd>{{ psData.isold == '1' ? '是' : psData.isold == '0' ? '否' : '' }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>有效期:</dt>
								<dd>{{ psData.modelspecname }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>备注:</dt>
								<dd>{{ psData.remark == undefined ? '--' : psData.remark }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>修改人:</dt>
								<dd>{{psData.updatebyname == undefined ? '--' : psData.updatebyname}}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>修改日期:</dt>
								<dd>{{psData.updatedate == null ? "--" :fmtdata.formatDate.format(new Date(psData.updatedate), 'yyyy-MM-dd') }}</dd>
							</dl>
						</el-col>
						<!-- 绑卡 -->
						<el-col :span="24">
							<el-button type="primary" v-if="simData == null && !deviceFormVisible" @click.native="addDeviceList" icon="el-icon-plus">点击绑卡</el-button>
							<el-button type="info" v-if="deviceFormVisible" @click.native="deviceFormVisible = false" icon="el-icon-close">取消绑卡</el-button>
						</el-col>
						<!--绑卡——SIM列表选择界面-->
						<div v-if="deviceFormVisible">
							<el-col :span="24" class="toolbar" >
								<el-form :inline="true" :model="filtersSIM" style="margin-top:10px;">
									<div style="display:inline-block;margin:0 10px 10px 0;">
										<el-input class="noborder color icon nofocus" @keyup.native.ctrl.8="clearAll()" @keyup.native.13="getDeciceListInfo" placeholder="请输入查询内容" v-model="filtersSIM.domSearch[0].content">
											<el-select class="wp_select" multiple clearable filterable v-model="filtersSIM.domSearch[0].select" slot="prepend" placeholder="选择条件">
												<el-option label="通讯号" value="simnum"></el-option>
												<el-option label="卡规格" value="modelName"></el-option>
												<el-option label="库房" value="storagename"></el-option>
												<el-option label="ICCID" value="iccid"></el-option>
											</el-select>
										</el-input>
									</div>
									<el-form-item>
										<el-button type="primary" @click="getDeciceListInfo" @keyup.native.13="getDeciceListInfo" icon="el-icon-search">查询</el-button>
									</el-form-item>
								</el-form>
							</el-col>
							<!--列表-->
							<el-table border :data="deviceListData" max-height="200" ref="deviceListData" v-loading="devicelistLoading" @row-dblclick="comlist">
								<el-table-column type="index" width="30" align="center" label="#"></el-table-column>
								<el-table-column prop="simnum" label="通讯号" align="center">
									<template slot-scope="scope">
										<el-tooltip class="item" effect="dark" content="双击选择当前SIM" placement="left"> <p>{{ scope.row.simnum }}</p></el-tooltip>
									</template>
								</el-table-column>
								<el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
								<el-table-column prop="modelName" label="卡规格" align="center"></el-table-column>
								<el-table-column prop="simcategory" label="卡状态" :formatter="statusFormat" align="center" width="80"></el-table-column>
								<el-table-column prop="contractno" label="采购合同号" align="center"></el-table-column>
							</el-table>

							<!--工具条-->
							<el-col :span="24" class="toolbar">
								<el-pagination @size-change="dhandleSizeChange" @current-change="dhandleCurrentChange" :page-sizes="[10, 50, 80,100]" :page-size="dpageSize" layout="total, sizes, prev, pager, next, jumper" :total="dtotal"></el-pagination>
							</el-col>
						</div>
					</el-row>

					<el-row v-if="simData !== null">
						<el-col :span="24">
							<span class="formTile">SIM信息</span>
						</el-col>
						<el-col :span="9">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>通讯号:</dt>
								<dd>{{ simData.simnum }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>ICCID:</dt>
								<dd>{{ simData.iccid == undefined ? '--' : simData.iccid }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>卡类型:</dt>
								<dd>{{ simData.modelName }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>库房:</dt>
								<dd>{{ simData.storagename }}</dd>
							</dl>
						</el-col>
						<el-col :span="9">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>供应商:</dt>
								<dd>{{ simData.suppliername == undefined ? '--' : simData.suppliername }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>卡状态:</dt>
								<dd>{{ simData.simcategory === 'ON' ? '开机' : simData.simcategory == 'OFF' ? '关机' : '--' }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>运行商:</dt>
								<dd>{{ simData.operator == 'CMCC' ? '中国移动' : simData.operator == 'CTCC' ? '中国电信' : simData.operator == 'CUCC' ? '中国联通' : '--' }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>安装位置:</dt>
								<dd>{{ simData.installPosition == undefined ? '--' : simData.installPosition }}</dd>
							</dl>
						</el-col>
						<el-col :span="6">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>是否组装:</dt>
								<dd>{{ simData.ispack == '1' ? '是' : simData.ispack == '0' ? '否' : '--' }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>是否旧设备:</dt>
								<dd>{{ simData.isold == '1' ? '是' : simData.isold == '0' ? '否' : '--' }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>有效期:</dt>
								<dd>{{ simData.modelspecname }}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>备注:</dt>
								<dd>{{ simData.remark == undefined ? '--' : simData.remark }}</dd>
							</dl>
						</el-col>
						<!-- 解绑卡 -->
						<el-col :span="24">
							<el-button type="danger" v-if="simData !== null" @click.native="cancel" icon="el-icon-share">点击解绑</el-button>
						</el-col>
					</el-row>

					<el-row v-if="vehData !== null">
						<el-col :span="24">
							<span class="formTile">车辆信息</span>
						</el-col>
						<el-col :span="9">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>车牌号:</dt>
								<dd>{{vehData.licensePlateNum == undefined ? '--' : vehData.licensePlateNum}}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>所属行业:</dt>
								<dd>{{vehData.industry == undefined ? '--' : vehData.industry}}</dd>
							</dl>
						</el-col>
						<el-col :span="9">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>车牌颜色:</dt>
								<dd>{{vehData.licensePlateColorName == undefined ? '--' : vehData.licensePlateColorName}}</dd>
							</dl>
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>在线状态:</dt>
								<dd>{{vehData.onlineStatus == undefined ? '--' : vehData.onlineStatus}}</dd>
							</dl>
						</el-col>
						<el-col :span="6">
							<dl class="dllist" style="margin-bottom:10px;">
								<dt>籍贯:</dt>
								<dd>{{vehData.nativePlace == undefined ? '--' : vehData.nativePlace}}</dd>
							</dl>
						</el-col>
					</el-row>
				</el-tab-pane>

				<!-- 设备档案 -->
			             <el-tab-pane label="设备档案" name="second">
			                        <el-table :data="operationData" max-height="600">
			                                  <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
			                                  <el-table-column prop="createdate" label="日期" align="center" :formatter="dateFormatter" width="100"></el-table-column>
			                                  <el-table-column prop="action" label="行为" align="center"></el-table-column>
			                                  <el-table-column prop="stostatus" label="状态" align="center" width="60"></el-table-column>
			                                  <el-table-column prop="storagename" label="库房" align="center" width="80"></el-table-column>
			                                  <el-table-column label="关联单据号" align="center" >
			                                  	<template slot-scope="scope">
			                                  		<el-tooltip class="item" effect="dark" content="点击查看入库单详情" placement="right">
							      <a class="batchno" @click="toPutInStoDetails(scope.row)">{{scope.row.batchno}}</a>
							</el-tooltip>
			                                  	</template>
			                                  </el-table-column>
			                                  <el-table-column prop="employeename" label="相关人员" align="center" width="80"></el-table-column>
			                        </el-table>
			             </el-tab-pane>
			</el-tabs>
		</el-dialog>
		<!-- 订单详情 弹窗  end-->

		<!--编辑界面-->
		<el-dialog title="编辑" :modal-append-to-body="false" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm" v-loading="editLoading" element-loading-text="拼命加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)">
				<el-row :gutter="20">
					<el-col :span="14">
						<el-form-item label="设备编号" prop="prodnum" ref="prodnum">
							<el-input v-model="editForm.prodnum" auto-complete="off" @blur="checkout('prodnum',editForm.prodnum,0)"></el-input>
						</el-form-item>
						<el-form-item label="设备规格" prop="productmodelname">
							<el-select v-model="editForm.productmodelname" @visible-change="moNameChange" @change="getNameEdit" :loading="moNameLoading" filterable placeholder="请选择设备规格" clearable>
								<el-option v-for="item in moNamelist" :key="item.prodmodel" :label="item.prodmodel" :value="item.id+''">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备类别" prop="prodspec">
							<el-input v-model="editForm.prodspec" disabled auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label="库房名称" prop="storagename">
							<el-select v-model="editForm.storagename" @visible-change="stoNameChange" :loading="stoNameLoading" filterable placeholder="请选择库房名" clearable remote :remote-method="stoChangeSelect">
								<el-option v-for="item in stoNamelist" :key="item.storagename" :label="item.storagename" :value="item.id+''">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备状态" prop="status">
							<el-radio-group disabled size="small" v-model="editForm.status">
								<el-radio-button label="INSTO">在库</el-radio-button>
								<el-radio-button label="INSTALL">已安装</el-radio-button>
								<el-radio-button label="LOST">报失</el-radio-button>
								<el-radio-button label="REPAIR">维修</el-radio-button>
								<el-radio-button label="DAMAGE">报废</el-radio-button>
								<el-radio-button label="ONWAY">在途</el-radio-button>
								<el-radio-button label="REMOVING">拆除中</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<!-- <el-form-item label="协议" prop="protocoltype">
                            <el-input v-model="editForm.protocoltype" auto-complete="off"></el-input>
                        </el-form-item> -->
						<el-form-item label="安装位置" prop="dictdatavalue" v-show="editForm.status == 'INSTALL'">
							<el-input v-model="editForm.dictdatavalue" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label="是否组装" prop="ispack">
							<el-radio-group v-model="editForm.ispack" disabled>
								<el-radio class="radio" :label="1">是</el-radio>
								<el-radio class="radio" :label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="是否旧设备" prop="isold">
							<el-radio-group v-model="editForm.isold">
								<el-radio class="radio" :label="1">是</el-radio>
								<el-radio class="radio" :label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="有效期" prop="expiredate">
							<el-date-picker v-model="editForm.expiredate" type="date" placeholder="选择日期" :picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="备注" prop="remark">
							<el-input v-model="editForm.remark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--设备规格弹窗-->
		<el-dialog title="设备规格设置" :modal-append-to-body="false" :visible.sync="typeFormVisible" width="60%" @close="typeCancel">
			<!--列表-->
			<el-form ref="typeForm" :model="typeForm">
			<el-table border :data="typeListData" max-height="800" v-loading="typeListLoading">
				<el-table-column type="index" width="30" align="center" label="#"></el-table-column>
				<el-table-column label="规格编号" prop="modelitem" align="center" width="80"></el-table-column>
				<el-table-column label="规格" align="center" width="110">
					<template slot-scope="scope">
					    <!-- 新增 -->
					    <div v-if="scope.$index == typeListData.length-1 && editable" >
						<el-form-item prop="modelspec" :rules="{required: true, message: '类型不能为空', trigger: 'blur'}">
				                                     <el-select v-model="typeForm.modelspec" @visible-change="modelspecChange" :loading="specLoading" filterable clearable>
						    		<el-option v-for="item in specOptions" :key="item.dictdatavalue" :label="item.dictdatavalue" :value="item.dictdataname"></el-option>
						  	</el-select>
				                         </el-form-item>
				                 </div>
					    <!-- 编辑 -->
					    <div v-else-if="showEdit[scope.$index]">
					    	<el-form-item prop="" :rules="{required: true, message: '类型不能为空', trigger: 'blur'}">
						    	<el-select v-model="typeListData[scope.$index].modelspec" @visible-change="modelspecChange" :loading="specLoading" filterable clearable>
							    	<el-option v-for="item in specOptions" :key="item.dictdatavalue" :label="item.dictdatavalue" :value="item.dictdataname"></el-option>
							</el-select> 
						</el-form-item>
					    </div>
					    <span v-else>{{ scope.row.modelspecname }}</span>
					</template>
				</el-table-column>
				<el-table-column label="规格名称" align="center">
					<template slot-scope="scope">
						<div v-if="scope.$index == typeListData.length-1 && editable" >
							<el-form-item prop="modelname" :rules="{required: true, message: '规格不能为空', trigger: 'blur'}">
					    			<el-input v-model="typeForm.modelname" ></el-input>
					    		</el-form-item>
					    	</div>
					    	<div v-else-if="showEdit[scope.$index]" >
							<el-form-item prop="" :rules="{required: true, message: '规格不能为空', trigger: 'blur'}">
					    			<el-input v-model="typeListData[scope.$index].modelname" ></el-input> 
							</el-form-item>
						</div>
					    	<span v-else>{{ scope.row.modelname }}</span>
					</template>
				</el-table-column>
				<el-table-column label="通讯协议" align="center">
					<template slot-scope="scope">
						<div v-if="scope.$index == typeListData.length-1 && editable" >
							<el-form-item prop="protocolid" :rules="{required: true, message: '协议不能为空', trigger: 'blur'}">
							   <el-select v-model="typeForm.protocolid" @visible-change="protocolChange" :loading="protocolLoading" filterable clearable>
								<el-option v-for="item in protocolOptions" :key="item.id" :label="item.protocolname" :value="item.id"></el-option>
							    </el-select>
							</el-form-item>
						</div>
						<div v-else-if="showEdit[scope.$index]" >
							<el-form-item prop="" :rules="{required: true, message: '协议不能为空', trigger: 'blur'}">
								<el-select v-model="typeListData[scope.$index].protocolname" @visible-change="protocolChange" @change="chooseProtocol" :loading="protocolLoading" filterable clearable>
									    <el-option v-for="item in protocolOptions" :key="item.id" :label="item.protocolname" :value="item.id"></el-option>
								</el-select> 
							</el-form-item>
						</div>
					    	<span v-else>{{ scope.row.protocolname }}</span>
					</template>
				</el-table-column>
				<el-table-column label="供应商" align="center">
					<template slot-scope="scope">
						<div v-if="scope.$index == typeListData.length-1 && editable" >
							<el-form-item prop="supplierid" :rules="{required: true, message: '供应商不能为空', trigger: 'blur'}">
								 <el-select v-model="typeForm.supplierid" @visible-change="supplierChange" :loading="supplierLoading" filterable clearable>
									<el-option v-for="item in supplierOptions" :key="item.id" :label="item.suppliername" :value="item.id"></el-option>
								</el-select> 
							</el-form-item>
						</div>
						<div v-else-if="showEdit[scope.$index]">
							<el-form-item prop="" :rules="{required: true, message: '供应商不能为空', trigger: 'blur'}">
								<el-select v-model="typeListData[scope.$index].suppliername" @visible-change="supplierChange" @change="chooseSupplier" :loading="supplierLoading" filterable clearable>
									    <el-option v-for="item in supplierOptions" :key="item.id" :label="item.suppliername" :value="item.id"></el-option>
								</el-select> 
							</el-form-item>
						</div>
					    	<span v-else>{{ scope.row.suppliername }}</span>
					</template>
				</el-table-column>
				<el-table-column label="单位" align="center" width="80">
					<template slot-scope="scope">
						<div v-if="scope.$index == typeListData.length-1 && editable" >
							<el-form-item prop="modelunit" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
							    <el-select v-if="scope.$index == typeListData.length-1 && editable" v-model="typeForm.modelunit" @visible-change="modelunitChange" :loading="modelunitLoading" filterable clearable>
								<el-option v-for="item in modelunitOptions" :key="item.dictdatavalue" :label="item.dictdatavalue" :value="item.dictdatavalue"></el-option>
							    </el-select> 
							</el-form-item>
						</div>
						<div v-else-if="showEdit[scope.$index]" >
							<el-form-item prop="" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
								<el-select v-model="typeListData[scope.$index].modelunit" @visible-change="modelunitChange" :loading="modelunitLoading" filterable clearable>
									<el-option v-for="item in modelunitOptions" :key="item.dictdatavalue" :label="item.dictdatavalue" :value="item.dictdatavalue"></el-option>
							 	</el-select> 
							</el-form-item>
						</div>
					    	<span v-else>{{ scope.row.modelunit }}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否保险" align="center" width="80">
					<template slot-scope="scope">
						<div v-if="scope.$index == typeListData.length-1 && editable" >
							<el-form-item prop="insuranceflag" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
								    <el-select v-model="typeForm.insuranceflag" clearable>
									<el-option v-for="item in insuOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
								    </el-select>
							</el-form-item>
						</div>
						<div v-else-if="showEdit[scope.$index]">
							<el-form-item prop="" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
								<el-select v-model="typeListData[scope.$index].insuranceflag" clearable>
									<el-option v-for="item in insuOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</div>
					    	<span v-else>{{ scope.row.insuranceflag == 'Y' ? '是' : '否' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="有效" align="center" width="60">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.isactive === '1' ? '已启用' : '已停用'" placement="top">
							<!-- 新增时 -->
							<el-switch v-if="scope.$index == typeListData.length-1 && editable" v-model="typeForm.isactive" active-color="#13ce66" inactive-color="#ff4949" active-value="1"  inactive-value="0" @change="typeHandleChange(scope.$index, scope.row)"></el-switch>
							<!-- 修改时 -->
							<el-switch v-else v-model="scope.row.isactive" active-color="#13ce66" inactive-color="#ff4949" active-value="1"  inactive-value="0" @change="typeHandleChange(scope.$index, scope.row)"></el-switch>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="编辑" align="center" width="50">
					<template slot-scope="scope">
						<el-button :disabled="editable" id="button" @click="handleTypeEdit(scope.$index, scope.row)" title="编辑"> <i class="iconfont icon-bianji  operate operate-bianji"></i></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-form>

			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-button-group v-if="editable || showEdit.length != 0 ">
					<el-button type="primary" size="small" @click="typeConfirm"><i class="el-icon-check"></i> 确定更新 </el-button>
					<el-button type="warning" size="small" @click="addFormVisible = true"><i class="el-icon-d-arrow-right"></i> 添加供应商 </el-button>
					<el-button type="info" size="small" @click="typeCancel"><i class="el-icon-close"></i> 取 消 </el-button>
				</el-button-group>
				<el-button v-else type="danger" size="small" @click="typeAddClick"><i class="iconfont icon-plus"></i> 新 增 </el-button>
				<el-pagination @size-change="handleSizeChangeType" background @current-change="handleCurrentChangeType" :page-sizes="[15, 50, 80, 99]" :page-size="typepageSize" layout="total, sizes, prev, pager, next" :total="typetotal" style="float:right;">
				</el-pagination>
			</el-col>
		</el-dialog>


	       	<!--供应商——新增界面-->
		<el-dialog title="新增供应商" :modal-append-to-body="false" :visible.sync="addFormVisible" :close-on-click-modal="false">
		            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
		                <el-row :gutter="20">
		                    <el-col :span="12">
		                        <el-form-item label="代号" prop="suppliercode">
		                            <el-input v-model="addForm.suppliercode" auto-complete="off"></el-input>
		                        </el-form-item>
		                        <el-form-item label="名称" prop="suppliername">
		                            <el-input v-model="addForm.suppliername" auto-complete="off"></el-input>
		                        </el-form-item>
		                        <el-form-item label="类别" prop="suppliertype">
		                            <el-select v-model="addForm.suppliertype" @visible-change="supplierTypeChange" :loading="supplierTypeLoading" filterable placeholder="请选择供应商类别" clearable>
		                                <el-option v-for="item in supplierTypelist" :key="item.dictdatavalue" :label="item.dictdatavalue" :value="item.dictdataname">
		                                </el-option>
		                            </el-select>
		                        </el-form-item>
		                    </el-col>
		                    <el-col :span="12">
		                        <el-form-item label="联络人" prop="linkman">
		                            <el-input v-model="addForm.linkman" auto-complete="off"></el-input>
		                        </el-form-item>
		                        <el-form-item label="联系方式" prop="contactno">
		                            <el-input v-model="addForm.contactno" auto-complete="off"></el-input>
		                        </el-form-item>
		                    </el-col>
		                    <el-col :span="24">
		                        <el-form-item label="备注" prop="remark">
		                            <el-input v-model="addForm.remark" type="textarea" auto-complete="off"></el-input>
		                        </el-form-item>
		                         <el-form-item label="地址" prop="supplieraddress">
		                                <el-input v-model="addForm.supplieraddress" @change="changeMapAdd" auto-complete="off" placeholder="请拖动地图点以便定位地址"></el-input>
		                        </el-form-item>
		                        <gdmap @draggerMapMarker="draggerMapMarker" ref="vueAmap"></gdmap>
		                    </el-col>
		                </el-row>
		            </el-form>
		            <div slot="footer" class="dialog-footer">
		                <el-button @click.native="addFormVisible = false">取消</el-button>
		                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
		            </div>
		</el-dialog>

		<!-- 维修结果 弹窗 -->
		<el-dialog title="维修结果" :modal-append-to-body="false" :visible.sync="repairFormVisible" width="25%">
			<span>请选择维修结果：</span>
			<el-radio v-model="repairForm.repairStatus" label="0" border>已修好</el-radio>
    			<el-radio v-model="repairForm.repairStatus" label="2" border>未修好</el-radio>
			<el-input type="textarea" autosize placeholder="请输入设备维修结果备注" v-model="repairForm.remark" style="margin-top:10px;"></el-input>
    			<div slot="footer" class="dialog-footer">
				<el-button @click.native="repairFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="repairSubmit">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<style type="text/css" >
.toolbar .el-button-group{margin-top: 5px;}
.new .el-badge__content{background-color:#41B883;}
.batchno{color: red;}
</style>

<script src="./index.js"></script>