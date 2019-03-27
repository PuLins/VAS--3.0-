import axios from 'axios';
import Qs from 'qs';

let base = '/vasms-web';
let api = '/api';
let admin = '/admin';

//字典数据管理接口
const getSysDictionaryDataList = params => {
    return axios.get(`${admin}/sysDictionaryData/query`, {
        params: params
    })
};

const addSysDictionaryData = params => {
    return axios.post(`${admin}/sysDictionaryData/add`, params)
};

const modifySysDictionaryData = params => {
    return axios.put(`${admin}/sysDictionaryData/mod`, params)
};

const removeSysDictionaryData = params => {
    return axios.delete(`${admin}/sysDictionaryData/del?${Qs.stringify(params)}`)
};

export {
    getSysDictionaryDataList,
    addSysDictionaryData,
    modifySysDictionaryData,
    removeSysDictionaryData
}