import axios from 'axios';
import Qs from 'qs';

export const getSIMInfoList = params => {
	return axios.get(`/sto/stoSim/page`, {params: params});
};

export const addSIMInfo = params => {
	return axios.post(`${base}/api/v1/device/productInfo`, params);
};

export const modifySIMInfo = params => {
	return axios.put(`${base}/api/v1/device/productInfo/` + params.id, params);
};

export const removeSIMInfo = params => {
	return axios.post(`${base}/api/v1/device/productInfo/batch`, Qs.stringify(params));
};
// 详情
export const getSIMInfoDetails = params => {
	return axios.get(`/sto/stoSim/`+ params.id, params);
};
// 设置开关机状态
export const setHandleOff = params => {
	return axios.get(`/sto/stoSim/setting/`+ params.id + `/off` );
};
// 查询卡类型
export const getSIMModelList = params => {
	return axios.get(`/sto/stoModel/sim/page`, {params: params});
};
// 新增卡类型
export const addSIMModel = params => {
	return axios.post(`/sto/stoModel/sim`, params);
};
// 修改卡类型
export const editSIMModel = params => {
	return axios.put(`/sto/stoModel/sim`, params);
};
// 修改卡类型——有效无效
export const modifySIMModel = params => {
	return axios.get(`/sto/stoModel/pub/isactive/`+ params.id + `/`+ params.isactive );
};
// 删除卡类型
export const removeSIMModel = params => {
	return axios.delete(`/sto/stoModel/sim/`+ params.id);
};
// 供应商列表
export const getSupplierList = params => {
    return axios.get(`/sto/stoSupplier/page`, {params: params})
};
// 上传入库
export const uploadInStore = params => {
	return axios.post(`/sto/stoSim/commitUploadSIM`, params);
};
// 新增入库
export const addInStore = params => {
	return axios.post(`/sto/stoSim/addStoin`, params);
};
// 在库状态
export const getStoStatus = params => {
    return axios.get(`/admin/sysDictionaryData/query?dictvalue=StoStatus`, {params: params})
};
// 采购合同-配件
export const getStoPurchaseList = params => {
    return axios.get(`/sto/stoPurchase/modelcategory/C`, {params: params})
};
// 卡类型-规格
export const getModelSpec = params => {
    return axios.get(`/admin/sysDictionaryData/query/byDictValue?dictvalue=ModelSpec`, {params: params})
};
// 卡类型-运营商
export const getSIMOperator = params => {
    return axios.get(`/admin/sysDictionaryData/query/byDictValue?dictvalue=SIMOperator`, {params: params})
};
// 入库批次
export const getSIMBatchno = params => {
    return axios.get(`/sto/qrcode/serialnumber/C`, {params: params})
};



