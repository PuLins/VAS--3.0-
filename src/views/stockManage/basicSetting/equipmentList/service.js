import axios from 'axios';
import Qs from 'qs';

let base = '/vasms-web';
let api = '/api';

export const getProductInfoList = params => {
	return axios.get(`/sto/stoProduct/page`, {params: params});
};

// export const addProductInfo = params => {
// 	return axios.post(`/sto/stoProduct`, params);
// };

// export const modifyProductInfo = params => {
// 	return axios.put(`/sto/stoProduct`, params);
// };

// export const removeProductInfo = params => {
// 	return axios.delete(`/sto/stoProduct/`+ params.id, params );
// };

// 详情
export const getProdInfoDetails = params => {
	return axios.get(`/sto/stoProduct/`+ params.id, params);
};
// 绑卡——查询卡列表
export const getSIMInfoList = params => {
	return axios.get(`/sto/stoSim/unbind/page`, {params: params});
};
// 绑卡——设备绑卡
export const getBinding = params => {
	return axios.get(`/sto/stoProduct/binding/`+ params.prodid + `/` +  params.simid );
};
// 解绑卡
export const unBinding = params => {
	return axios.post(`/sto/stoProduct/unbinding`, params );
};
// 查询设备类型
export const getProdModelList = params => {
	return axios.get(`/sto/stoModel/product/page`, {params: params});
};
// 新增设备类型
export const addProdModel = params => {
	return axios.post(`/sto/stoModel/product`, params);
};
// 修改设备类型
export const editProdModel = params => {
	return axios.put(`/sto/stoModel/product`, params);
};
// 修改设备类型——有效无效
export const modifyProdModel = params => {
	return axios.get(`/sto/stoModel/pub/isactive/`+ params.id + `/`+ params.isactive );
};
// 删除设备类型
export const removeProdModel = params => {
	return axios.delete(`/sto/stoModel/product/`+ params.id );
};
// 维修设备
export const repairProd = params => {
	return axios.post(`/sto/stoProduct/repair`, params);
};
// 供应商列表
export const getSupplierList = params => {
    return axios.get(`/sto/stoSupplier/page`, {params: params})
};
// 通讯协议列表
export const getProtocolList = params => {
    return axios.get(`/sto/gisSysProtocol/all`, {params: params})
};
// 添加供应商
export const addSupplier = params => {
    return axios.post(`/sto/stoSupplier`, params)
};
// 设备档案
export const getEquipmentArchives = params => {
    return axios.get(`/sto/stoProduct/archives/`+ params.id )
};
// 型号
export const getModelSpec = params => {
    return axios.get(`/admin/sysDictionaryData/query/byDictValue?dictvalue=ModelSpec_P`)
};
// 单位
export const getModelUnit = params => {
    return axios.get(`/admin/sysDictionaryData/query/byDictValue?dictvalue=ModelUnit`)
};
// 供应商类别
export const getSupplierType = params => {
    return axios.get(`/admin/sysDictionaryData/query?dictvalue=SupplierType`, {params: params})
};








//获取设备型号
export const getMoNameList = params => {
	return axios.get(`${base}/api/v1/device/productModel?prodcategory=E&showCount=1000`);
};
//获取库房名称列表
export const getStoNameList = params => {
	return axios.get(`${base}/api/v1/sto/storageInfo`, {
		params: params
	});
};
