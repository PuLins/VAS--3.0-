import axios from 'axios'

let base = '/vasms-web';
let admin = '/admin';

export const get = params => {
    return axios.get(`${base}/gis/getHasInsuranceDeclaration`, {
        params: params
    })
}

//检查设备是否在线
export const cldeviceIsOnstate = params => {
    return axios.post(`/gisapiservice/Prod/proddetail`, params)
};

export const add = params => {
    return axios.post(`/insurance/insuranceinfo/add/commitInsuranceInfo`, params)
}

export const getSearchVinNum = params => {
    // return axios.get(`${admin}/vehicleInfo/query/key/` + params.key)
    return axios.get(`insurance/insuranceinfo/query/vehicleInfoByVin`, {
        params
    })
};
