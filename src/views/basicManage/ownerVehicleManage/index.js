    import util from '../../../utils/tools.js'
    import dayjs from 'dayjs'
    import { getOwnerInfoList,
    	getOwnerInfoListSelect,
             addOwnerInfo,
             modifyOwnerInfo,
             getVehicleSearchInfoList,
             getVehicleInfoList,
             getSelectListOwner,
             getVehInfoList,
             modifyVehicleInfo,
             getNamebyUserid,
             getCheckoutOfOwner,
             getMoreInfoList,
         	addVehicleInfo, 
         	removeVehicleInfo,
         	getVehList, 
         	getCorpList,
         	getProductsInfoListOfVehicle, 
         	getSelectListVeh, 
         	getVehicleProd, 
         	bandVehicleProd, 
         	unBandVehicleProd, 
         	getStoNameList, 
         	getModelListInfo, 
         	getCarModel,
         	getCheckoutOfVehicleInfo, 
         	selectedType,
         	getCorporatelevel_level,
         	getCorpNameList,
         	getAllColorList,
         	getCorpBank,
         	checkVehVin,
         	modifyVehInfo,
         	ownerBandVeh,
         	removeVehInfo,
         	getOwnerInfoDetail,
         	checkOwner
           } from './service';
           import { checkEmail, checkPrice, checkVin, checkName, checkVehicleNumber, checkMobile, checkIdcard } from '@/utils/formValidation'
	export default {
		name:'ownerVehicleManage',
		props: ["windowOutHeight"],
		data() {
			return {
				Dayjs: dayjs,
				filters: {
					domSearch: [{
						select: ['name'],
						content: ''
					}], //查询框
					isactive: '1'
				},
				pickerOptions0: { //贷款到期日
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				pickerOptions: { //车辆初始登记日期
				},
				carModelList: [], //车型信息
				props: { //显示车型
					value: 'value',
					label: 'label',
					children: 'children'
				},
				vehlist: [], //车类型列表
				vehLoading: false, //车类型
				corplist: [], //所属客户
				corpLoading: false, //
				corptwolist: [], //受理银行
				corptwoLoading: false, //
				modelArr: [], //车型数组
				owners: [],
				ownerList: [],
				vehDataInfo: [], //当前详情车主所持的车辆信息
				vehDataID: [], //洗澡能 存放已选择的车辆ID
				activeNamesVeh: ['0', '1'],
				prOptions: util.initProvince(),
				formDialogTableVisible: false,
				total: 0,
				currentPage: 1,
				pageSize: 15,
				listLoading: false,
				carslist: [],
				carsLoading: false,
				radio: '1',
				sels: [], //列表选中列
				prodData: [], //详情设备数据
				insData: [], //详情保险数据
				deviceListData: [], //车辆列表
				dtotal: 0,
				dcurrentPage: 1,
				dpageSize: 15,
				deviceFormVisible: false,
				devicelistLoading: false,
				prodDataInfo: [], //车主所有车辆绑定设备信息
				checkData: [], //选择绑定check
				checkoutDataT: true, //数据验证返回的布尔值true
				checkoutDataF: [], //
				checkoutVin:true,//车架验证
				readonlyVeh:false,//只读属性
				readonlyOwner:false,
				thisInput: [], //编辑时存入row验证的值
				productsdatas:[],//绑定设备
				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				createname: "",
				updatename: "",
				editFormRules: {
					name: [{
							required: true,
							message: "请输入车主姓名",
							trigger: 'blur'
						},
						{
							validator: checkName,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: "请输入车主手机号码",
							trigger: 'blur'
						},
						{
							validator: checkMobile,
							trigger: 'blur'
						}
					],
					idcard: [{
							required: true,
							message: "请输入身份证号码",
							trigger: 'blur'
						},
						{
							validator: checkIdcard,
							trigger: 'blur'
						}
					],
					vin: [{
							required: true,
							message: "请输入车架号",
							trigger: 'blur'
						},
						{
							validator: checkVin,
							trigger: 'blur'
						}
					],
					price: [{
							required: true,
							message: "请输入车价",
							trigger: 'blur'
						},
						{
							validator: checkPrice,
							trigger: 'blur'
						}
					],
				},
				//编辑界面数据
				editForm: {
					id: '',
					ownerid: '',
					name: '',
					gender: '',
					idcard: '',
					mobile: '',
					email: '',
					installaddress: '',
					postcodeoffice: '',
					maritalstatus: '',
					addressHome: '',
					addresshome: '',
					licenseplatenum: '',
					vin: '',
					enginenum: '',
					price: '',
					model: '',
					color: '',
					colorname: '',
					firstregisterdate: '',
					vehicletype: '',
					corpname: '',
					bankname: '',
					hastheftinsurance: '0',
					generalproductcount: '',
					yearsofservice: '',
					loanenddate: '',
					ownerid: '',
					isactive: 1,
					productsNum: '',
					vehicleuse: '',
					vehiclecategory: '',
					licenseplatecolor: '',
				},

				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [{
							required: true,
							message: "请输入车主姓名",
							trigger: 'blur'
						},
						{
							validator: checkName,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: "请输入车主手机号码",
							trigger: 'blur'
						},
						{
							validator: checkMobile,
							trigger: 'blur'
						}
					],
					idcard: [{
							required: true,
							message: "请输入身份证号码",
							trigger: 'blur'
						},
						{
							validator: checkIdcard,
							trigger: 'blur'
						}
					],
					vin: [{
							required: true,
							message: "请输入车架号",
							trigger: 'blur'
						},
						{
							validator: checkVin,
							trigger: 'blur'
						}
					],
					price: [{
							required: true,
							message: "请输入车价",
							trigger: 'blur'
						},
						{
							validator: checkPrice,
							trigger: 'blur'
						}
					],
					licenseplatenum:[{
							required: true,
							message: "请输入车牌号",
							trigger: 'blur'
						},{
							validator: checkVehicleNumber,
							trigger: 'blur'
					}],
					model: [{
						required: true,
						message: "请输入车型",
						trigger: 'change'
					}],
					vehicletype: [{
						required: true,
						message: "请选择车类型",
						trigger: 'blur'
					}],
					corpname: [{
						required: true,
						message: "请选择所属客户",
						trigger: 'blur,change'
					}],
					vehiclecategory:[{
						required: true,
						message: "请选择分类",
						trigger: 'blur'
					}],
				},
				//新增界面数据
				addForm: {
					ownerid:'',
					id:'',
					name: '',
					gender: '',
					idcard: '',
					mobile: '',
					email: '',
					installaddress: '',
					postcodeoffice: '',
					maritalstatus: '',
					addressHome: ["四川", "成都", "高新区"],
					addresshome: '',
					isactive: 1,
					vehicleinfo: [{
						ID: ''
					}],
					licenseplatenum: '',
					vin: '',
					enginenum: '',
					price: '',
					model: '',
					color: '',
					colorname: '',
					firstregisterdate: '',
					corpname: '',
					bankname: '',
					hastheftinsurance: '0',
					generalproductcount: '',
					yearsofservice: '',
					loanenddate: '',
					ownerid: '',
					isactive: 1,
					productsNum: '',
					vehicleuse: '',
					vehiclecategory: '',
					vehicletype: '',
					platecolorid:'',
					licenseplatecolor: '',
				},
				carColor: [],
				vehicleidList: '', //当前行的车辆id
				tempModel: '',
				editFormVisibleVeh: false, //编辑界面是否显示
				editLoadingVeh: false,
				//编辑车辆界面数据
				editFormVeh: {
					id: '',
					licenseplatenum: '',
					vin: '',
					enginenum: '',
					name: '',
					price: '',
					model: '',
					color: '',
					colorname: '',
					corpid:'',
					firstregisterdate: '',
					corpname: '',
					bankname: '',
					hastheftinsurance: '',
					generalproductcount: '',
					yearsofservice: '',
					loanenddate: '',
					productsNum: '',
					editDetails: [],
					vehicleuse: '',
					vehiclecategory: '',
					vehicletype: '',
					platecolorid:'',
					licenseplatecolor:'',
				},
				editFormId: {
					ownerid: '',
					name: '',
					corpid: '',
					corpname: '',
					bankname: '',
					receivingbankid: '',
				},
				editFormRulesVeh: {
					name: [{
						required: true,
						message: "请输入车主姓名",
						trigger: 'blur'
					}],
					vin: [{
							required: true,
							message: "请输入车架号",
							trigger: 'blur'
						},
						{
							validator: checkVin,
							trigger: 'blur'
						}
					],
					price: [{
							required: true,
							message: "请输入车价",
							trigger: 'blur'
						},
						{
							validator: checkPrice,
							trigger: 'blur'
						}
					],
					licenseplatenum:[{
							required: true,
							message: "请输入车牌号",
							trigger: 'blur'
						},{
							validator: checkVehicleNumber,
							trigger: 'blur'
					}],
					model: [{
						required: true,
						message: "请输入车型",
						trigger: 'change'
					}],
					vehicletype: [{
						required: true,
						message: "请选择车类型",
						trigger: 'blur'
					}],
					corpname: [{
						required: true,
						message: "请选择所属客户",
						trigger: 'blur'
					}],
				},
				activeNamesVeh: ['0', '1'],
				dcurrentPageVeh: 1,
				dpageSizeVeh: 15,
				filtersVeh: {
					domSearch: [{
						select: ['licenseplatenum'],
						content: ''
					}], //查询框
					isactive: '1'
				},
				filtersProd: {
					domSearch: [{
						select: ['prodnum'],
						content: ''
					}], //查询框
					isactive: '1'
				},
				deviceFormVisibleVeh: false,
				devicelistLoadingVeh: false,
				stoNamelistCancel: [], //解绑时库房名称列表
				stoNameLoadingCancel: false, //解绑时库房名称
				deviceFormVisibleSto: false, //解绑时库房列表
				dialogVisible: false, //解绑时库房
				stoForm: {
					storagename: '',
					storageid: '',
				},
				rows: '', //移除当前行
				index: '',
				deviceListDataVeh:[],//查询设备列表
				comfirLoading: false,
				selsVeh : [], //设备表选中列
				checkDataVeh:[],//选择绑定
				packinfolist: [], //多选时选择的组
				ownerChangeForm:{//更换车主
					name:''
				},
				ownerChangeList:[],//更换车主列表
				ownerChangeVisible:false,
				ownerChangeLoading:false,
				rowsOwner: '', //移除当前行
				indexOwner: '',
				ownerInfo:[],
				vInfo:[],
                			expands: [],// 要展开的行，数值的元素是row的key值
			}
		},
		methods: {
			// 数据重复验证
			checkout(p, v, index) {
				if(v == "") return;
				if(this.thisInput[index] == v) return; //编辑时 没改输入框值
				this.checkoutDataT = true; //初始化
				let paras = {
					para: p,
					value: v,
				}
				getCheckoutOfOwner(paras).then((res) => {
					let errorInput = res.data.data.param; //保存验证失败的字段
					if(!res.data.data.result) {
						this.$message({
							message: '信息输入重复！',
							type: 'warning'
						});
						this.$refs[errorInput].$el.className = "el-form-item is-error"; //输入框标红
						this.checkoutDataF[index] = false
					} else {
						this.$refs[errorInput].$el.className = "el-form-item"; //输入框恢复
						this.checkoutDataF[index] = true
					}
				});
			},
			// 新增——验证车主
			checkOwner(){
				let para = {
					idcard:this.addForm.idcard,
					mobile:this.addForm.mobile,
				}
				checkOwner(para).then((res) => {
					if (res.data.data.isExist) {
						this.addForm.id = res.data.data.ownerInfo.id;
						this.addForm.name = res.data.data.ownerInfo.name;
						this.addForm.mobile = res.data.data.ownerInfo.mobile;
						this.addForm.idcard = res.data.data.ownerInfo.idcard;
						this.addForm.gender = res.data.data.ownerInfo.gender;
						this.addForm.postcodeoffice = res.data.data.ownerInfo.postcodeoffice;
						this.addForm.maritalstatus = res.data.data.ownerInfo.maritalstatus;
						this.addForm.addressHome = res.data.data.ownerInfo.addresshome.split(' ')[0].split(',');
						this.addForm.installaddress = res.data.data.ownerInfo.addresshome.split(' ')[1];
						this.addForm.email = res.data.data.ownerInfo.email;
						this.readonlyOwner  = true;//设置只读状态
						if (this.$refs.name.$el.children[1].children[1] != undefined) this.$refs.name.$el.children[1].children[1].hidden = true;//必填项提示语隐藏
						if (this.$refs.mobile.$el.children[1].children[1] != undefined) this.$refs.mobile.$el.children[1].children[1].hidden = true;
						if (this.$refs.idcard.$el.children[1].children[1] != undefined) this.$refs.idcard.$el.children[1].children[1].hidden = true;
						this.ownerInfo = res.data.data.ownerInfo;//存储当前已存在车主
					}
				});
			},
			// 新增——验证车架号
			checkCarVin(){
				var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/g;
				if (this.addForm.vin == '' || !reg.test(this.addForm.vin)) {
					this.$refs.vin.$el.className = "el-form-item is-error"; //输入框标红
					this.checkoutVin = false;
					return;
				}
				if (this.addForm.idcard == '' && this.addForm.mobile == '') {
					this.$refs.idcard.$el.className = "el-form-item is-error"; //输入框标红
					this.$refs.mobile.$el.className = "el-form-item is-error"; //输入框标红
					this.$message({
						message: '车主相关信息必填！',
						type: 'error'
					});
					this.checkoutVin = false;
					return;
				}
				// 验证该车是否绑定车主
				let para = {
					idcard:this.addForm.idcard,
					mobile:this.addForm.mobile,
					vin:this.addForm.vin,
				}
				checkVehVin(para).then((res) => {
					if (res.data.data.isOwned) {//该车已绑定车主时
						this.$message({
							message: res.data.data.msg,
							type: 'error'
						});
						this.$refs.vin.$el.className = "el-form-item is-error"; //输入框标红
						this.checkoutVin = false;
					}else{//该车未绑定车主
						this.$refs.vin.$el.className = "el-form-item"; //输入框恢复
						this.checkoutVin = true;
						if (res.data.data.vInfo) {//该车已存在
							this.addForm.licenseplatenum = res.data.data.vInfo.licenseplatenum;
							this.addForm.vin = res.data.data.vInfo.vin;
							this.addForm.enginenum = res.data.data.vInfo.enginenum;
							this.addForm.price = res.data.data.vInfo.price;
							this.addForm.model = res.data.data.vInfo.model;
							this.addForm.color = res.data.data.vInfo.color;
							this.addForm.colorname = res.data.data.vInfo.colorname;
							this.addForm.corpname = res.data.data.vInfo.corpname;
							this.addForm.bankname = res.data.data.vInfo.bankname;
							this.addForm.hastheftinsurance = res.data.data.vInfo.hastheftinsurance;
							this.addForm.yearsofservice = res.data.data.vInfo.yearsofservice;
							this.addForm.firstregisterdate = res.data.data.vInfo.firstregisterdate;
							this.addForm.loanenddate = res.data.data.vInfo.loanenddate;
							this.addForm.vehicleuse = res.data.data.vInfo.vehicleuse;
							this.addForm.vehiclecategory = res.data.data.vInfo.vehiclecategory;
							this.readonlyVeh = true;//设置只读状态
							if (this.$refs.licenseplatenum.$el.children[1].children[1] != undefined) this.$refs.licenseplatenum.$el.children[1].children[1].hidden = true;//必填项提示语隐藏
							if (this.$refs.price.$el.children[1].children[1] != undefined) this.$refs.price.$el.children[1].children[1].hidden = true;
							if (this.$refs.corpname.$el.children[1].children[1] != undefined) this.$refs.corpname.$el.children[1].children[1].hidden = true;
							if (this.$refs.vehiclecategory.$el.children[1].children[1] != undefined) this.$refs.vehiclecategory.$el.children[1].children[1].hidden = true;
							this.vInfo = res.data.data.vInfo;//存储当前已绑定车辆
						}
					}
				});
			},
			//显示编辑车辆界面
			handleEditVeh(index, row) {
				$(".is-error").removeClass('is-error'); //清空验证时的红框
				this.productsData(row.ID); //查询当前车辆所绑定的设备
				this.vehicleidList = row.ID; //将车辆id存储
				this.editFormVisibleVeh = true;
				this.editFormVeh = {
					id: row.ID,
					licenseplatenum: row.licenseplatenum,
					vin: row.vin,
					enginenum: row.enginenum,
					name: row.name,
					price: row.price == undefined ||  row.price == '' ? '' : row.price,
					model: row.model,
					color: row.color,
					colorname: row.colorname,
					firstregisterdate: row.firstregisterdate,
					deptname: row.deptname,
					vehicletype: row.typedesc,
					platecolorid:'',
					licenseplatecolor:'',
					corpname: row.corpname,
					receivingbankid: row.receivingbankid,
					bankname: row.bankname,
					hastheftinsurance: row.hastheftinsurance,
					generalproductcount: row.generalproductcount,
					yearsofservice: row.yearsofservice,
					loanenddate: row.loanenddate,
					isactive: parseInt(row.isactive),
					productsNum: row.productsNum,
					vehicleuse: row.vehicleuse,
					vehiclecategory: row.vehiclecategory,
					licenseplatecolor: row.licenseplatecolor,
					tagList:[]
				}
				this.editFormVehId = {
					ownerid: row.ownerid,
					name: row.name,
					corpid: row.corpid,
					corpname: row.corpname,
				}
				this.tempModel = row.model;
				this.thisInput.push(this.editFormVeh.licenseplatenum, this.editFormVeh.vin); //将当前验证的字段 已获得的值存入
			},
			// 编辑车辆信息
			editSubmitVeh() {
				if(this.tempModel != this.editFormVeh.model.toString()) {
					this.$message({
						message: '车型名称必须选择',
						type: 'error'
					});
					return;
				}
				if (this.editFormVeh.hastheftinsurance == 1 && this.editFormVeh.yearsofservice == undefined) {//有盗抢险 且 未选服务期限时
					this.$refs.yearsofservice.$el.className = "el-form-item is-error"; //输入框标红
					this.$message({
						message: '请输入服务期限！',
						type: 'error'
					});
					return;
				}
				
				this.$refs.yearsofservice.$el.className = "el-form-item"; //输入框恢复
				if (this.editFormVeh.hastheftinsurance == 1 && this.editFormVeh.bankname == undefined ) {//有盗抢险 且 未选受理银行时
					this.$refs.bankname.$el.className = "el-form-item is-error"; //输入框标红
					this.$message({
						message: '请选择受理银行！',
						type: 'error'
					});
					return;
				}
				this.$refs.bankname.$el.className = "el-form-item"; //输入框恢复
				this.$refs.editFormVeh.validate((valid) => {
					if(valid) {
						this.editLoading = true;
						let para = {
							id: this.editFormVeh.id,
							licenseplatenum: this.editFormVeh.licenseplatenum,
							vin: this.editFormVeh.vin,
							enginenum: this.editFormVeh.enginenum,
							price: this.editFormVeh.price,
							model: this.editFormVeh.model.toString(),
							color: this.editFormVeh.color,
							colorname: this.editFormVeh.colorname,
							firstregisterdate: dayjs(this.editFormVeh.firstregisterdate).format('YYYY-MM-DD'),
							platecolorid:this.editFormVeh.vehicletype.id,
							licenseplatecolor: this.editFormVeh.vehicletype.platecolordesc,
							corpid: this.editFormVeh.corpname,
							receivingbankid: this.editFormVeh.receivingbankid,
							bankname: this.editFormVeh.bankname,
							hastheftinsurance: this.editFormVeh.hastheftinsurance,
							generalproductcount: this.editFormVeh.generalproductcount,
							yearsofservice: this.editFormVeh.yearsofservice,
							loanenddate: dayjs(this.editFormVeh.loanenddate).format('YYYY-MM-DD'),
							productsNum: this.editFormVeh.productsNum,
							vehicleuse: this.editFormVeh.vehicleuse,
							vehiclecategory: this.editFormVeh.vehiclecategory,
						}
						if(this.editFormVehId.corpname == this.editFormVeh.corpname) {
							para.corpid = this.editFormVehId.corpid;
						} else {
							para.corpid = this.editFormVeh.corpname;
						}
						if (para.bankname == undefined || para.bankname == '' ) para.receivingbankid = '';

						modifyVehInfo(para).then((res) => {
							this.getOwner();
							this.editLoading = false;
							this.$message({
								message: '编辑车辆信息成功',
								type: 'success'
							});

							this.$refs['editFormVeh'].resetFields();
							this.editFormVisibleVeh = false;
							this.handleQuery();
						}).catch((error) => {
							this.editLoading = false;
						});
					}
				});
			},
			// 根据车辆Id获得设备数量信息
			productsData(vehicleid) {
				let para = {
					vehicleid: vehicleid,
				}
				//获取设备信息
				getProductsInfoListOfVehicle(para).then((res) => {
					this.productsdatas = res.data.data.records;
				});
			},
			//车型选择
			handleItemChange(queryString, cb) {
				let para = {
						model: queryString,
						viewName : "VW_VAS_WEB_VAS_VEHICLE_MODEL",
					            limit: 30,
					},
					ownerArray = [];
				getCarModel(para).then((res) => {
					if(res.data.data != null) {
						res.data.data.records.forEach(function(item, index) {
							ownerArray.push({
								value: item.model,
								brand: item.brand,
								serious: item.serious
							});
						});
						cb(ownerArray);
					}
				});
			},
			//选择车型查询颜色
			handleSelectColor(v) {
				this.tempModel = v.value;
				this.editFormVeh.model = v.value;
				this.editFormVeh.color = '';
				this.editFormVeh.colorname = '';
				this.addForm.model = v.value;
				this.addForm.color = '';
				this.addForm.colorname = '';
			},
			/*车类型——下拉*/
			vehChange(r) {
				if(!r || this.vehlist.length > 0) return;
				this.vehLoading = true;
				getVehList().then((res) => {
					this.vehlist = res.data.data;
					this.vehLoading = false;
				});
			},
			/*客户——下拉*/
			corpChange(r) {
				this.corplist = [];
				if(!r || this.corplist.length > 0) return;
				this.corpLoading = true;
				let para = {
					limit: 100,
				}
				getCorpList(para).then((res) => {
					this.corplist = res.data.data.records;
					this.corpLoading = false;
				});
			},
			// 客户，模糊查询
			corpChangeSelect(query) {
				this.corplist = [];
				let para = {
					limit: 100,
					corpname: query,
				}
				this.corpLoading = true;
				getCorpList(para).then((res) => {
					this.corplist = res.data.data.records;
					this.corpLoading = false;
				});
			},
			// 受理银行
		            corpChangeTwo(queryString, cb) {
		                let para = {
		                        limit:30,
		                        page:1,
		                        corpcategory:'BANK',
		                        corpname: queryString,
		                },
		                corptwolist = [];
		                getCorpList(para).then((res) => {
		                        res.data.data.records.forEach(function(item, index) {
		                            corptwolist.push({
		                                value: item.corpname,
		                                id: item.id,
		                            });
		                        });
		                        cb(corptwolist);
		                });
		            },
		            handleSelectCorp(val){
		                if (this.editFormVisibleVeh) {//编辑页面
		                    this.editFormVeh.bankname = val.value;
		                    this.editFormVeh.receivingbankid = val.id;
		                }else if (this.addFormVisible) {//新增页面
		                    this.addForm.bankname = val.value;
		                    this.addForm.receivingbankid = val.id;
		                }
		            },
			// 颜色下拉框
			getColor(){
				this.handleSelectColor(this.editFormVeh.model);
			},
			// 车辆颜色
			handleColorChange(queryString, cb) {
				let para = {
					model: this.addFormVisible ? this.addForm.model : this.editFormVeh.model,
					color:queryString,
					limit:100
				},colorArray = [];;
				getAllColorList(para).then((res) => {
					if(res.data.data.records) {
						res.data.data.records.forEach(function(item, index) {
							if (item && item.color) {
								colorArray.push({
									value: item.color,
									color_rgb: item.color_rgb ,
								});
							}
						});
						cb(colorArray);
					}
				});
			},
			//选择车辆颜色
			changeCarColor(v) {
				if(typeof v != "object") return;
				if(this.editFormVisible) {
					this.editForm.colorname = v.value; //存colorname汉字
					this.editForm.color = v.color_rgb; //存color码
				}
				if(this.addFormVisible) {
					this.addForm.colorname = v.value; //存colorname汉字
					this.addForm.color = v.color_rgb; //存color码
				}
				if(this.editFormVisibleVeh) {
					this.editFormVeh.colorname = v.value; //存colorname汉字
					this.editFormVeh.color = v.color_rgb; //存color码
				}
			},
			// 多选框 选择车辆时
			selsChange(sels, row) {
				this.sels = sels;
				this.checkData = row;
			},
			// 新增——绑车辆时删除
			deleteRow(index, rows) {
				rows.splice(index, 1); //删除一行
			},
			// 编辑——确认解绑
			// cancel(index, rows) {
			// 	let row = rows[index];
			// 	this.$confirm('确认解除该车辆的绑定关系吗？', '提示', {
			// 		type: 'warning'
			// 	}).then(() => {
			// 		let para = {
			// 			id: row.ID,
			// 			unBandOwner: 'y'
			// 		};
			// 		modifyVehicleInfo(para).then((res) => {
			// 			rows.splice(index, 1); //删除一行
			// 		});
			// 	}).catch(() => {});
			// },
			
			
			//切换当前页
			dhandleCurrentChange(val) {
				this.dcurrentPage = val;
				this.getDeciceListInfo();
			},
			//切换每页显示数量
			dhandleSizeChange(val) {
				this.dpageSize = val;
				this.getDeciceListInfo();
			},
			// 获取车辆信息
			addDeviceList() {
				this.deviceFormVisible = true;
				this.filters.domSearch = [{
					select: ['licenseplatenum'],
					content: ''
				}];
				this.getDeciceListInfo();
			},
			//编辑——获取在库车辆信息
			getDeciceListInfo() {
				let para = {
					page: this.dcurrentPage,
					limit: this.dpageSize,
					forBandOwner: 'y',
					// domSearch: this.filtersVeh.domSearch,
					// isactive:1,
				};
				this.devicelistLoading = true;
				getVehInfoList(para).then((res) => {
					this.dtotal = res.data.data.total;
					this.deviceListData = res.data.data.records;
					this.devicelistLoading = false;
				}).catch((error) => {
					this.devicelistLoading = false;
				});
			},
			//编辑车主—— 确认绑定车辆
			comlist() {
				this.$refs.deviceListData.clearSelection();

				// 循环拼接车辆id
				let str = '';
				this.sels.forEach((item) => {
					str += item.id + ',';
				})
				if (str.length > 0) str = str.substr(0, str.length - 1);//去掉最后一个‘，’

				let para = {
					ids: str,
					ownerid: this.editForm.id,
				};
				ownerBandVeh(para).then((res) => {
					if(this.vehDataInfo.length == 0) {
						this.vehDataInfo = this.sels;
					} else {
						this.vehDataInfo = this.vehDataInfo.concat(this.sels); //合并数组 = 之前原有+ 现在选择
					}
					this.deviceFormVisible = false;
					this.getOwner();
				});

			},
			// 点击更换车主时
			changeOwner(index,rows){
				this.ownerChangeVisible = true;
				this.ownerChangeForm.name = '';//初始化
				this.rowsOwner = rows; //存行
				this.indexOwner = index; //存下标
			},
			// 更换车主时查询车主
			ownerChange(r) {
				this.ownerChangeList = [];
				if(!r || this.ownerChangeList.length > 0) return;
				this.ownerChangeLoading = true;
				let para = {
					ownerid: this.editForm.id,
				}
				getOwnerInfoList(para).then((res) => {
					this.ownerChangeList = res.data.data.records;
					this.ownerChangeLoading = false;
				});
			},
			// 选择车主
			ownerChangeSelect(query) {
				this.ownerChangeList = [];
				let para = {
					limit: 30,
					name: query,
					ownerid: this.editForm.id,
				}
				this.ownerChangeLoading = true;
				getOwnerInfoList(para).then((res) => {
					this.ownerChangeList = res.data.data.records;
					this.ownerChangeLoading = false;
				});
			},
			// 解绑——选择车主后 确认
			confirmOwner() {
				if(this.ownerChange.name == '') {
					this.$message({
						message: '请选择车主！',
						type: 'warning'
					});
				} else {
					let para = {
						ownerid:this.ownerChangeForm.name,
						id: this.rowsOwner[this.indexOwner].ID,
					};
					modifyVehInfo(para).then((res) => {
						this.ownerChangeVisible = false;
						this.rowsOwner.splice(this.indexOwner, 1); //删除一行
						this.getOwner();
					});
				}
			},
			//切换当前页
			dhandleCurrentChangeVeh(val) {
				this.dcurrentPageVeh = val;
				this.getDeciceListInfoVeh();
			},
			//切换每页显示数量
			dhandleSizeChangeVeh(val) {
				this.dpageSizeVeh = val;
				this.getDeciceListInfoVeh();
			},
			// 获取设备信息
			addDeviceListVeh() {
				this.deviceFormVisibleVeh = true;
				this.filtersProd.domSearch = [{
					select: ['prodnum'],
					content: ''
				}];
				this.getDeciceListInfoVeh();
			},
			//获取设备信息
			getDeciceListInfoVeh() {
				let para = {
					currentPage: this.dcurrentPage,
					showCount: this.dpageSize,
					domSearch: this.filters.domSearch,
					isactive: 1,
					status: 'INSTO'
				};
				this.devicelistLoadingVeh = true;
				getVehicleProd(para).then((res) => {
					if(res.data.result.code == 4001) {
						this.$message({
							message: res.data.result.desc,
							type: 'error'
						});
						this.devicelistLoadingVeh = false;
						return;
					}
					this.dtotal = res.data.data.totalResult;
					this.deviceListDataVeh = res.data.data.records;
					this.devicelistLoadingVeh = false;
				}).catch((error) => {
					this.devicelistLoadingVeh = false;
				});
			},
			// 编辑车辆——解绑按钮
			cancelVeh(index, rows) {
				this.deviceFormVisibleSto = true;
				this.stoForm.storagename = '';//初始化
				this.rows = rows; //存行
				this.index = index; //存下标
			},
			// 编辑车辆——确认绑定
			comlistVeh() {
				this.deviceFormVisibleVeh = false;
				this.$refs.deviceListDataVeh.clearSelection();
				let para = {
					packid: this.checkData.ID,
					vehicleid: this.vehicleidList,
					packinfos: []
				};
				this.packinfolist.forEach((res, index) => {
					para.packinfos.push({
						ID: res.ID,
						equipmentid: res.prodid,
						simcardid: res.simid,
						storageid: res.storageid,
					});
				})
				this.comfirLoading = true;
				bandVehicleProd(para).then((res) => {
					this.comfirLoading = false;
					if(this.productsdatas.length == 0) {
						// this.productsdatas = this.sels;
						if(res.data.data.records == null) {
							this.productsdatas = []
						} else {
							this.productsdatas = res.data.data.records;
						}
					} else {
						this.productsdatas = [];
						this.productsdatas = this.productsdatas.concat(res.data.data.records); //合并数组 = 之前原有+ 现在选择
					}
				});

			},
			// 解绑时查询库房
			stoNameChangeCancel(r) {
				if(!r || this.stoNamelistCancel.length > 0) return;
				this.stoNameLoadingCancel = true;
				getStoNameList().then((res) => {
					this.stoNamelistCancel = res.data.data.records;
					this.stoNameLoadingCancel = false;
				});
			},
			// 选择库房
			stoChangeSelect(query) {
				let para = {
					showCount: 30,
					storagename: query,
				}
				this.stoNameLoadingCancel = true;
				getStoNameList(para).then((res) => {
					this.stoNamelistCancel = res.data.data.records;
					this.stoNameLoadingCancel = false;
				});
			},
			// 选择库房后 确认
			confirmCancel() {
				if(this.stoForm.storagename == '') {
					this.$message({
						message: '请选择库房！',
						type: 'warning'
					});
				} else {
					let para = {
						id: this.rows[this.index].onlickid,
						packid: this.rows[this.index].packid,
						packinfo: {
							equipmentid: this.rows[this.index].prodid,
							simcardid: this.rows[this.index].simcardid,
							storageid: this.stoForm.storagename,
						}
					};
					unBandVehicleProd(para).then((res) => {
						this.deviceFormVisibleSto = false;
						this.rows.splice(this.index, 1); //删除一行
					});
				}
			},
			// 多选框 选择设备时
			selsChangeVeh(sels, row) {
				this.selsVeh = sels;
				this.checkDataVeh = row;
				this.packinfolist = this.selsVeh;
			},
			//绑定车辆数统计
			getSummaries(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				sums[0] = "总共";
				sums[5] = data.length + " 辆";
				return sums;
			},
			//绑定设备数统计
			getSummariesVeh(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				sums[0] = "总共";
				sums[6] = data.length + " 台";
				return sums;
			},
			// 清空当前模糊查询
			clearAllThis() {
				this.filters.domSearch = [{
					select: ['name'],
					content: ''
				}] //显示页面的默认查询条件;
			},
			//查询清空
			clearAll() {
				this.filters.domSearch = [{
					select: [],
					content: ''
				}] //清空查询框;
			},
			//详情查看
			formDetailHandle(ownerid) {
				this.vehDataInfo = []; //清空上条数据
				this.ownerList = [];
				this.createname = "";
				this.updatename = "";
				
				let para = {
					id: ownerid
				}
				getOwnerInfoDetail(para).then((res) => {
					if (res.data.data == null) {
						this.$message.error('暂无详细信息！请稍后再试');
						this.formDialogTableVisible = false;
						return;
					}
					this.formDialogTableVisible = true;
					this.ownerList = res.data.data;
				});
			},

			// 有效 鼠标移入
			mouseoverChange(e) {
				if($(e.target).hasClass('icon-duigou')) {
					$(e.target).addClass('operate-cha icon-cha').removeClass('operate-duigou icon-duigou');
				} else {
					$(e.target).addClass('operate-duigou icon-duigou').removeClass('operate-cha icon-cha');
				}
			},
			// 有效 鼠标移除
			mouseoutChange(e) {
				if($(e.target).hasClass('icon-cha')) {
					$(e.target).addClass('operate-duigou icon-duigou').removeClass('operate-cha icon-cha');
				} else {
					$(e.target).addClass('operate-cha icon-cha').removeClass('operate-duigou icon-duigou');
				}
			},
			// 排序
			sortChange(col, prop, order) {
				let para = {
					prop: col.prop,
					order: col.order.substring(0, col.order.length - 6),
				}
				console.log(para);
				// getSortList(para).then((res) => {});
			},
			// 有效无效开关
			showData(i) {
				this.filters.isactive = i;
				this.getOwner();
			},
			// 匹配车牌号列表
			carsChange(r) {
				if(!r || this.carslist.length > 0) return;
				this.carsLoading = true;
				getVehicleSearchInfoList().then((res) => {
					this.carslist = res.data.data.records;
					this.carsLoading = false;
				});
			},
			// 有效无效颜色切换
			tableRowClassName(row, index) {
				if(row.isactive == 1) {
					return 'warning-row';
				}
				return '';
			},
			//设备状态显示转换
			statusFormat: function(row, col) {
				return row.STATUS || row.status == 'INSTO' ? '在库' : row.STATUS || row.status == 'INSTALL' ? '已安装' : row.STATUS || row.status == 'LOST' ? '报失' : row.STATUS || row.status == 'REPAIR' ? '维修' : row.STATUS || row.status == 'DAMAGE' ? '报废' : row.STATUS || row.status == 'ONWAY' ? '在途' : '';
			},
			//婚姻显示转换
			maritalstatusFormat(row, column) {
				return row.maritalstatus == 'M' ? '已婚' : row.maritalstatus == 'S' ? '未婚' : '';
			},
			// 分类转换
			vehcategoryFormat(row, column) {
				return row.vehiclecategory == '1' ? '新车' : row.vehiclecategory == '2' ? '二手车' : row.vehiclecategory == '3' ? '资管追回' : '--';
			},
			//切换当前页
			handleCurrentChange(val) {
				this.currentPage = val;
				// this.getOwner();
				this.handleQuerySelect();
			},
			//切换每页显示数量
			handleSizeChange(val) {
				this.pageSize = val;
				this.getOwner();
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
			// 展示高亮
			showHighlight(val){
				val = val + '';
		                      if (val.indexOf(this.filters.domSearch[0].content) !== -1 && this.filters.domSearch[0].content !== '') {//搜索内容和查询数据匹配
			                    return val.replace(this.filters.domSearch[0].content, '<font color="red">' + this.filters.domSearch[0].content + '</font>')
			           } else {
			                    return val
			           }
			},
			//搜索按钮——模糊查询
			handleQuerySelect() {
				this.expands = [];//初始化展开列
				let para = {
					page: this.currentPage,
					limit: this.pageSize,
					isactive: this.filters.isactive,
					domSearch: this.filters.domSearch,
				};
				this.listLoading = true;
				getOwnerInfoListSelect(para).then((res) => {
					this.total = res.data.data.total;
					this.owners = res.data.data.records;
					this.listLoading = false;
					
					// 默认展开搜索结果第一个
					this.expands.push(this.owners[0].id)
				}).catch((error) => {
					this.listLoading = false;
				});
			},
			//获取车主列表
			getOwner() {
				let para = {
					page: this.currentPage,
					limit: this.pageSize,
					isactive: this.filters.isactive,
				};
				this.listLoading = true;
				getOwnerInfoList(para).then((res) => {
					this.total = res.data.data.total;
					this.owners = res.data.data.records;
					this.listLoading = false;
				}).catch((error) => {
					this.listLoading = false;
				});
			},
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {
						id: row.ID,
						isactive: 1,
					};
					modifyOwnerInfo(para).then((res) => {
						this.listLoading = false;
						if(res.data.result.desc != 'success') {
							this.$message({
								message: '当前车主绑定了有效车辆！请先解绑！',
								type: 'warning'
							});
						} else {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
						}
						this.handleQuerySelect();
					});
				}).catch(() => {
					this.listLoading = false;
				});
			},
			// 有效按钮切换状态
			handleChange: function(index, row) {
				this.$confirm('确认设置该条记录的状态吗？', '提示', {
					type: 'warning'
				}).then(() => {
					if (row.vehicleinfos.length > 0) {//如果有车辆，不允许无效当前车主
						this.$message({
							message: '当前车主绑定了有效车辆！请先解绑！',
							type: 'error'
						});
					}else{//无绑定车辆时
						let para = {
							id: row.id,
							isactive: row.isactive == 0 ? 1 : 0,
						}
						modifyOwnerInfo(para).then((res) => {
							this.$message({
								message: '设置成功',
								type: 'success'
							});
							row.isactive = para.isactive;
							this.getOwner();
						}).catch(() => {
							this.listLoading = false;
						});
					}
					
				});
			},
			// 车辆删除
			handleDelVeh: function(index, row, vehicleInfos) {
				this.$confirm('确认删除该车辆吗？', '提示', {
					type: 'warning'
				}).then(() => {
					let para = {
						ids: row.ID,
					}
					removeVehInfo(para).then((res) => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						vehicleInfos.splice(index, 1); //物理删除一行
					}).catch(() => {});
				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				$(".is-error").removeClass('is-error'); //清空验证时的红框
				this.editFormVisible = true;

				// 地址
				var addrVal = row.addresshome,
					addrArr, detailAdress;
				if(addrVal != null) {
					if(addrVal.split(" ").length > 0) {
						addrArr = addrVal.split(" ")[0].split(",");
						detailAdress = addrVal.split(" ")[1];
					} else {
						addrArr = addrVal.split(",");
					}
				} else {
					addrArr = ["四川", "成都", "高新区"];
				}

				this.editForm = {
					id: row.id || row.ID,
					ownerid: row.id,
					name: row.name,
					installaddress: detailAdress,
					gender: row.gender,
					idcard: row.idcard,
					mobile: row.mobile,
					email: row.email,
					postcodeoffice: row.postcodeoffice,
					maritalstatus: row.maritalstatus,
					addressHome: addrArr,
				}
				this.vehDataInfo = row.vehicleinfos;
				this.thisInput.push(this.editForm.idcard, this.editForm.mobile); //将当前验证的字段 已获得的值存入
			},
			//显示新增界面
			handleAdd() {
				$(".is-error").removeClass('is-error'); //清空验证时的红框
				this.vehDataInfo = [];
				this.addFormVisible = true;
				this.readonlyVeh = false;//只读
				this.readonlyOwner = false;//只读
				this.addForm = {
					ownerid:'',
					id:'',
					name: '',
					gender: 'M',
					idcard: '',
					mobile: '',
					email: '',
					postcodeoffice: '',
					maritalstatus: 'M',
					addressHome: ["四川", "成都", "高新区"],
					isactive: 1,
					licenseplatenum: '',
					vin: '',
					enginenum: '',
					name: '',
					price: '',
					model: '',
					color: '#000',
					colorname: '',
					firstregisterdate: '',
					vehicletype: '小型汽车、轻便摩托车（蓝色）',
					defaultcode:3,
					licenseplatecolor: '蓝色',
					platecolorid:'',
					corpname: '众汇金控集团',
					corpid: '10280',
					bankname: '',
					hastheftinsurance: '0',
					generalproductcount: '',
					yearsofservice: '',
					loanenddate: '',
					isactive: 1,
					ownerid: '',
					productsNum: '',
					vehicleuse: '',
					vehiclecategory: '1',
				};
			},
			//编辑
			editSubmit() {
				this.$refs['editForm'].validate((valid) => {
					if(valid) {
						this.editLoading = true;
						let para = {
							id: this.editForm.id,
							name: this.editForm.name,
							gender: this.editForm.gender,
							idcard: this.editForm.idcard,
							mobile: this.editForm.mobile,
							email: this.editForm.email,
							postcodeoffice: this.editForm.postcodeoffice,
							maritalstatus: this.editForm.maritalstatus,
							addresshome: this.editForm.addressHome.toString() + ' ' + this.editForm.installaddress.replace(/\s|\xA0/g,""),
						}
						modifyOwnerInfo(para).then((res) => {
							this.editLoading = false;
							this.$message({
								message: '编辑成功',
								type: 'success'
							});
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.getOwner();
						}).catch((error) => {
							this.editLoading = false;
						});
					}
				});
			},
			//新增
			addSubmit() {
				this.checkoutDataF.forEach((item, index) => {
					this.checkoutDataT = item && this.checkoutDataT;
				});
				if (this.addForm.hastheftinsurance == 1 && this.addForm.yearsofservice == '') {//有盗抢险 且 未选服务期限时
					this.$refs.yearsofservice.$el.className = "el-form-item is-error"; //输入框标红
					this.$message({
						message: '请输入服务期限！',
						type: 'error'
					});
					return;
				}
				this.$refs.yearsofservice.$el.className = "el-form-item"; //输入框恢复
				if (this.addForm.hastheftinsurance == 1 && this.addForm.bankname == '') {//有盗抢险 且 未选受理银行时
					this.$refs.bankname.$el.className = "el-form-item is-error"; //输入框标红
					this.$message({
						message: '请选择受理银行！',
						type: 'error'
					});
					return;
				}
				this.$refs.bankname.$el.className = "el-form-item"; //输入框恢复
				this.$refs['addForm'].validate((valid) => {
					// 当车主已存在 或者 车辆已存在时，验证为true
					if (this.ownerInfo.length == undefined && this.vInfo.length == undefined) {
						valid = true;
					}
					if(valid) {
						this.addLoading = true;
						let para = {
							id:this.addForm.id,
							name: this.addForm.name,
							gender: this.addForm.gender,
							idcard: this.addForm.idcard,
							mobile: this.addForm.mobile,
							email: this.addForm.email,
							postcodeoffice: this.addForm.postcodeoffice,
							maritalstatus: this.addForm.maritalstatus,
							isactive: this.addForm.isactive,
							addresshome: this.addForm.addressHome.toString() + ' ' + (this.addForm.installaddress == undefined ? '' : this.addForm.installaddress),
							vehicleinfo: {
								licenseplatenum: this.addForm.licenseplatenum,
								vin: this.addForm.vin,
								enginenum: this.addForm.enginenum,
								name: this.addForm.name,
								price: this.addForm.price,
								model: this.addForm.model.toString(),
								color: this.addForm.color,
								colorname: this.addForm.colorname,
								firstregisterdate: this.addForm.firstregisterdate ? dayjs(this.addForm.firstregisterdate).format('YYYY-MM-DD') : '',
								platecolorid:this.addForm.vehicletype.id,
								licenseplatecolor: this.addForm.vehicletype.platecolordesc,
								corpid: this.addForm.corpname,
								receivingbankid: this.addForm.receivingbankid,
								hastheftinsurance: parseInt(this.addForm.hastheftinsurance),
								generalproductcount: this.addForm.generalproductcount,
								yearsofservice: this.addForm.yearsofservice,
								loanenddate:this.addForm.loanenddate ? dayjs(this.addForm.loanenddate).format('YYYY-MM-DD') : '',
								isactive: parseInt(this.addForm.isactive),
								ownerid:this.addForm.id,
								onlineCheck: this.prodDataID,
								vehicleuse: this.addForm.vehicleuse,
								vehiclecategory: this.addForm.vehiclecategory,
								isactive: this.addForm.isactive,
							},
						}
						let reg = /^[\u4e00-\u9fa5]+$/;
       						if (reg.test(para.vehicleinfo.corpid)){
       							para.vehicleinfo.corpid = this.addForm.corpid
       						}
						if (this.addForm.vehicletype.id == undefined) {
							para.vehicleinfo.platecolorid = this.addForm.defaultcode;
							para.vehicleinfo.licenseplatecolor = this.addForm.licenseplatecolor;
						}
						if(this.checkoutDataT && this.checkoutVin) { //验证通过时(无重复时)
							addOwnerInfo(para).then((res) => {
								this.addLoading = false;
								if (res.data.code == 0) {
									this.addFormVisible = false;
									this.$message({
										message: '新增成功！',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.getOwner();
								}
							}).catch((error) => {
								this.addLoading = false;
							});
						} else {
							this.addLoading = false;
							this.$message({
								message: '请先处理标红信息！',
								type: 'error'
							});
						}
					}
				});
			},
			//设备状态显示转换
			statusFormats: function(row, col) {
				return row.STATUS || row.status == 'INSTO' ? '在库' : row.STATUS || row.status == 'INSTALL' ? '已安装' : row.STATUS || row.status == 'LOST' ? '报失' : row.STATUS || row.status == 'REPAIR' ? '维修' : row.STATUS || row.status == 'DAMAGE' ? '报废' : row.STATUS || row.status == 'ONWAY' ? '在途' : '--';
			},
		},
		created() {
			this.getOwner();
		},
	}