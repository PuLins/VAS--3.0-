import util from 'utils/tools';
import { getToken } from '@/utils/auth'

import {getSIMBatchno, getSIMOperator, getModelSpec, getStoPurchaseList,  getSIMInfoList,uploadInStore, addInStore, getStoStatus, getSIMInfoDetails,setHandleOff,getSIMModelList, addSIMModel, addSIMInfo, modifySIMModel, editSIMModel, removeSIMModel, modifySIMInfo, removeSIMInfo,getSupplierList } from './service';
import { getModelUnit } from '../equipmentList/service';
export default {
		name:'SIMInfo',
		props: ['windowOutHeight'],
		data() {
			return {
				fmtdata: util,
				prOptions: util.initProvince(),
				filters: {
					domSearch: [{
						select: ['simnum'],
						content: ''
					}], //查询框
					timeScope: '',
				},
				pickerOptions: { //日期
				},
				listData: [],
				SIMdata:[],
				Proddata:[],
				formDialogTableVisible: false,
				total: 0,
				currentPage: 1,
				pageSize: 15,
				showCount: '',
				listLoading: false,
				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: {
					purchaseid: [{required: true, message: '请选择采购合同', trigger: 'blur'}],
			                	modelid: [{required: true, message: '请选择卡类型', trigger: 'blur'}],
			                	simnum: [{required: true, message: '请填写通讯号', trigger: 'blur'}],
				},
				//新增界面数据
				addForm: {
					batchno:'',
					chargeplace: [],
					iccid: "",
					issueplace: [],
					modelid:'',
					produceplace: [],
					purchaseid: '',
					remark: "",
					simcategory: "",
					simnum: "",
					status: "",
					supplierid:'',
					suppliername:'',
					storagename:'',
				},
				// 类型设置
				typeFormVisible:false,//设备型号设置
				typeListData:[],//设备型号数据
				typeListLoading:false,
				typetotal:0,//设备类型分页
				typepageSize:15,
				typecurrentPage: 1,
				editable:false,//是否可编辑
				typeForm:{
					modelitem:'',
					modelname:'',
					modelspec:'',
					operator:'',
					supplierid:'',
					modelunit:'',
					isactive:'1'
				},
				modelspecOptions:[],//规格
				modelspecLoading:false,
				operatorOptions:[],//运行商
				operatorLoading:false,
				supplierOptions:[],//供应商
				supplierLoading:false,
				contractlist:[],//采购合同
				contractLoading:false,
            				modelunitOptions:[],//单位
				modelunitLoading:false,
				showEdit: [], //显示编辑框
				editRowIndex:'',//编辑行下标
				purchaseList:[],//采购合同
				contractno:'',//采购合同
				putInForm: {
				    batchno:'',
				    purchaseid:'',
			                filePath: '',
			                suppliername:'',
			                supplierid:'',
			            },
			            putInRules: {
			                purchaseid: [{required: true, message: '请选择采购合同', trigger: 'blur'}],
			                filePath: [{required: true, message: '请上传采购文件', trigger: 'blur'}]
			            },
			            batchVisible:false,
			            fileList: [],
            				accept: '.xlsx',
            				token: getToken(),
            				stoStatusData:[],//在库状态列表
            				stoStatusLoading:false,
			}
		},
		methods: {
			// ------------------------------------------------卡类型------------------------------------------------------
			// 打开卡类型弹窗，查询卡类型数据
			showType(){
				this.typeFormVisible = true;
				this.getSIMModel();
			},
			// 查询卡类型
			getSIMModel(){
				let para = {
					page: this.typecurrentPage,
					limit: this.typepageSize,
				};
				this.typeListLoading = true;
				getSIMModelList(para).then((res) => {
					this.typetotal = res.data.data.total;
					this.typeListData = res.data.data.records;
					this.typeListLoading = false;
				}).catch((error) => {
					this.typeListLoading = false;
				});
			},
			// 确定更新
			typeConfirm(){
				if (this.editable) {            //新增时
					this.typeAddConfirm();
				}else{                                  //修改时
					this.typeEditConfirm();
				}
			},
			// 取消
			typeCancel(){
				if (this.editable) {            //新增时
					this.typeAddCancel();
				}else{                                  //修改时
					this.typeEditCancel();
				}
			},
			// 卡型号点击新增
			typeAddClick(){
				this.typeForm = {
					modelitem:'',
					modelname:'',
					modelspec:'',
					operator:'',
					supplierid:'',
					modelunit:'',
					isactive:'1'
				},//清空输入框，初始化
				this.typeListData.push(this.typeForm);
				this.editable = true;
			},
			// 点击编辑类型
			handleTypeEdit(index,row){
				this.showEdit[index] = true;
				this.$set(this.showEdit);//触发视图更新
				this.editRowIndex = index;//存储下标
			},
			// 确定修改
			typeEditConfirm(){
				this.typeListLoading = true;
				this.$refs.typeForm.validate((valid) => {
	                			if (valid) {
	                				let para = Object.assign({}, this.typeListData[this.editRowIndex]);
						editSIMModel(para).then((res) => {
							this.typeListLoading = false;
							this.$message.success('编辑成功！');
							this.getSIMModel();
							this.typeEditCancel();
						});
					}else{
						this.typeListLoading = false;
					}
	                		})
			},
			// 取消修改
			typeEditCancel(){
				this.showEdit = [];//取消
				this.getSIMModel();
			},
			// 确定新增
			typeAddConfirm(){
				this.typeListLoading = true;
				this.$refs.typeForm.validate((valid) => {
	                			if (valid) {
	                				let para = Object.assign({}, this.typeForm);
						addSIMModel(para).then((res) => {
							this.$message.success('新增成功！');
							this.getSIMModel();
							this.typeAddCancel();
							this.typeListLoading = false;
						}).catch((error) => {
							this.typeListLoading = false;
						});
	                			}else{
	                				this.typeListLoading = false;
	                			}
	                		})
			},
			// 取消新增
			typeAddCancel(){
				this.editable = false;//取消编辑
				this.typeListData.splice(this.typeListData.length-1, 1); //从当前index位置开始，删除一项
			},
			// 卡类型停用和启用
			typeHandleChange(index,row){
				if (row.id === '' || row.id === undefined) return;//当新增时
				let para = {
					id:row.id,
					isactive : row.isactive,
				}
				modifySIMModel(para).then((res) => {
					this.typeListLoading = false;
					this.$message.success('修改成功！');
					this.getSIMModel();
					this.typeCancel();
				});
			},
			// 供应商下拉
			supplierChange(r) {
				if(!r || this.supplierOptions.length > 0) return;
				this.supplierLoading = true;
				getSupplierList({limit:1000,isactive:1}).then((res) => {
					this.supplierOptions = res.data.data.records;
					this.supplierLoading = false;
				});
			},
			// 编辑-选择供应商时
			chooseSupplier(val){
				this.typeListData[this.editRowIndex].supplierid = val;
			},
			// 规格下拉
			modelspecChange(r) {
				if(!r || this.modelspecOptions.length > 0) return;
				this.modelspecLoading = true;
				getModelSpec({limit:1000}).then((res) => {
					this.modelspecOptions = res.data.data;
					this.modelspecLoading = false;
				});
			},
			// 编辑-选择规格时
			chooseModelspec(val){
				this.typeListData[this.editRowIndex].modelspec = val;
			},
			// 运行商下拉
			operatorChange(r) {
				if(!r || this.operatorOptions.length > 0) return;
				this.operatorLoading = true;
				getSIMOperator({limit:1000}).then((res) => {
					this.operatorOptions = res.data.data;
					this.operatorLoading = false;
				});
			},
			// 编辑-选择运行商时
			chooseOperator(val){
				this.typeListData[this.editRowIndex].operator = val;
			},
			// 单位下拉
			modelunitChange(r) {
				if(!r || this.modelunitOptions.length > 0) return;
				this.modelunitLoading = true;
				getModelUnit({limit:1000}).then((res) => {
					this.modelunitOptions = res.data.data;
					this.modelunitLoading = false;
				});
			},
			// 卡类型分页
			handleCurrentChangeType(val) {
				this.typecurrentPage = val;
				this.getSIMModel();
				this.typeAddCancel();
			},
			//切换每页显示数量
			handleSizeChangeType(val) {
				this.typepageSize = val;
				this.getSIMModel();
				this.typeAddCancel();
			},

			
			// ----------------------------------------------新增入库-----------------------------------------------------------
			//采购合同下拉
			contractChange(r) {
				if(!r || this.contractlist.length > 0) return;
				this.contractLoading = true;
				getSupplierList({limit:1000,isactive:1}).then((res) => {
					this.contractlist = res.data.data.records;
					this.contractLoading = false;
				});
			},
			// 卡类型下拉
			modelChange(r) {
				if(!r || this.typeListData.length > 0) return;
				this.typeListLoading = true;
				getSIMModelList({limit:1000}).then((res) => {
					this.typeListData = res.data.data.records;
					this.typeListLoading = false;
				});
			},
			// 在库状态下拉
			stoStatusChange(r) {
				if(!r || this.stoStatusData.length > 0) return;
				this.stoStatusLoading = true;
				getStoStatus({limit:1000}).then((res) => {
					this.stoStatusData = res.data.data.records;
					this.stoStatusLoading = false;
				});
			},

			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.contractno = [];//初始化
				this.addForm = {
					batchno:'',
					chargeplace: [],
					iccid: "",
					issueplace: [],
					modelid:'',
					produceplace: [],
					purchaseid: '',
					remark: "",
					simcategory: "关机",
					simnum: "",
					status: "在库",
					supplierid:'',
					suppliername:'',
					storagename:'新品库'
				};
				//获取批次号
			            getSIMBatchno().then((res) => {
			                this.addForm.batchno = res.data.data;
			            });
			},
			//新增
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.addLoading = true;
						let para = Object.assign({}, this.addForm);
						// 地址转换
						para.produceplace = para.produceplace.join(',');
						para.chargeplace = para.chargeplace.join(',');
						para.issueplace = para.issueplace.join(',');
						para.status = 'INSTO';
						para.simcategory = 'OFF';
						addInStore(para).then((res) => {
							this.addLoading = false;
							this.$message.success('新增入库成功！');
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							this.handleQuery();
						}).catch((e) =>{
							this.addLoading = false;
						});
					}
				});
			},


			// ----------------------------------------------------批量入库--------------------------------------------------
			// 点击批量入库
			handleAddBatch(){
				this.batchVisible = true;
				this.putInForm = {
					batchno:'',
					purchaseid:'',
				            filePath: '',
				            suppliername:'',
				            supplierid:'',
				}
				//获取批次号
			            getSIMBatchno().then((res) => {
			                this.putInForm.batchno = res.data.data;
			            });
			},
			// 获取采购合同
			async getStoPurchaseList () {
			            try {
			                const {data} = await getStoPurchaseList()
			                this.purchaseList = data.data;
			            } catch (e) {}
			},
			// 选择合同匹配供应商
			chooseChange(val){
				if (this.batchVisible) {                //批量入库
					this.putInForm.purchaseid = val.id;
					this.putInForm.suppliername = val.suppliername;
					this.putInForm.supplierid = val.supplierid;
				}else{                                               //新增入库
					this.addForm.purchaseid = val.id;
					this.addForm.suppliername = val.suppliername;
					this.addForm.supplierid = val.supplierid;
				}
			},
			// 下载模板
			download () {
			            window.location.href = `/sto/stoUpload/getExcelTemplate?inType=IN_RETURNSIM`;
			},
			// 上传文件成功
			uploadSuccess (response, file, fileList) {
				if (response.code === 1) {
			                this.$message.warning(response.msg)
			                this.$refs.upload.clearFiles()
			                return
			            }
			            this.$message.success('上传成功！')
			            this.$refs.putInFilePath.clearValidate();
			            this.putInForm.filePath = response.data;
        			},
        			uploadError (err) {
			            const data = JSON.parse(err.message)
			            this.$message.error(data.message)
			},
        			// 改变文件
        			changeFile (file, fileList) {
			            if (fileList.length > 1) {
			                this.fileList = fileList.slice(1)
			            } else {
			                this.fileList = fileList
			            }
			},
			// 删除上传文件
		        	removeFile () {
		        		this.fileList = [];
		        	},
		        	// 关闭弹窗
		        	closePutIn () {
		        		this.fileList = [];
		        		this.contractno = '';
		        		this.putInForm = {
				    purchaseid:'',
			                suppliername:'',
			                supplierid:'',
			            }
		        	},
		        	// 提交批量入库
		        	batchSubmit () {
		        		this.$refs.putInForm.validate(async valid => {
			                    if (valid) {
			                        try {
			                        	   this.addLoading = true;
			                            let para = Object.assign({}, this.putInForm);
			                            const {data} = await uploadInStore(para)
			                            if (data.data) {
		                                            if(data.data.validSuccess) {
		                                                this.$message.success('批量入库成功！');
		                                                this.addLoading = false;
		                                                this.batchVisible = false;
		                                                this.handleQuery();
		                                            } else {
		                                            	this.addLoading = false;
		                                                this.$message.error('你的入库文件验证未通过，详情请查看excel')
		                                                window.location = `/sto/stoUpload/downloadErrorFile?errorPath=${data.data.errorPath}`;
		                                            }
		                                        } else  {
		                                            this.$message.error('读取文件失败，请重试！')
		                                            this.addLoading = false;
		                                        }
			                        } catch (e) {}
			                    }
			            })
			},
			
			//切换当前页
			handleCurrentChange(val) {
				this.currentPage = val;
				this.handleQuery();
			},
			//切换每页显示数量
			handleSizeChange(val) {
				this.pageSize = val;
				this.handleQuery();
			},
			// 添加查询条件
			addSelect() {
				this.filters.domSearch.push({
					select: [],
					content: ''
				});
			},
			// 移除查询条件
			removeSelect(index) {
				this.filters.domSearch.splice(index, 1); //从当前index位置开始，删除一项
			},
			//获取列表
			handleQuery() {
				let para = {
					page: this.currentPage,
					limit: this.pageSize,
					// 搜索设置部分
					domSearch: this.filters.domSearch,
					startTime: this.filters.timeScope ? (this.filters.timeScope[0] ? util.formatDate.format(new Date(this.filters.timeScope[0]), 'yyyy-MM-dd hh:mm:ss') : '') : '',
					endTime: this.filters.timeScope ? (this.filters.timeScope[1] ? util.formatDate.format(new Date(this.filters.timeScope[1]), 'yyyy-MM-dd hh:mm:ss') : '') : '',
				};
				this.listLoading = true;
				getSIMInfoList(para).then((res) => {
					this.total = res.data.data.total;
					this.listData = res.data.data.records;
					this.listLoading = false;
				}).catch((error) => {
					this.listLoading = false;
				});
			},
			//置为关机
			handleOff(index, row) {
				this.$confirm('您确定要将当前SIM卡置为'+' 【关机】 '+'状态吗？', '提示', {
					type: 'warning'
				}).then(() => {
					let para = {
						id: row.id,
						simcategory: row.simcategory
					};
					setHandleOff(para).then((res) => {
						this.$message.success('关机成功！');
						this.handleQuery();
					});
				}).catch(() => {

				});
			},
			//查询清空
			clearAll() {
				this.filters.domSearch = [{
					select: [],
					content: ''
				}] //清空查询框;
			},
			//详情查看
			formDetailHandle(simid, data) {
				this.formDialogTableVisible = true;
				let para = { id: simid, }
				getSIMInfoDetails(para).then((res) => {
					this.SIMdata = res.data.data.sim;
					this.Proddata = res.data.data.product;
				});
			},
			//状态显示转换
			statusFormat: function(row, col) {
				return row.status == 'ON' ? '开机' : row.status == 'OFF' ? '关机' : '--';
			},
			// 运营商
			operatorFormat: function(row, col) {
				return row.operator == 'CMCC' ? '中国移动' : row.operator == 'CTCC' ? '中国电信' : row.operator == 'CUCC' ? '中国联通' : '--';
			},
			//有效无效转换
			isdeleteFomat(row, col) {
				return row.isdelete == 1 ? '否' : row.isdelete != undefined ? '是' : '未知';
			},
			// 有效无效颜色切换
			tableRowClassName(row, index) {
				if(row.isdelete == 1) {
					return 'warning-row';
				}
				return '';
			},
			//时间转换1
			dateFormatter: function(row, col) {
				if(row.createdate == "" || row.createdate == undefined) return '--';
				return util.formatDate.format(new Date(row.createdate), 'yyyy-MM-dd');
			},
		},
		created() {
			this.handleQuery();
		}
	}