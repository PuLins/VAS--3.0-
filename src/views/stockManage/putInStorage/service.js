import axios from 'axios';
import Qs from 'qs'

export const commitPutIn = (url, params) => {
    return axios.post(url, Qs.stringify(params))
}

export const getPutIn = params => {
    return axios.get('sto/stoAction/query', {
        params
    })
}

export const getPutInById = id => {
    return axios.get(`sto/stoAction/query/${id}`)
}

export const viewDistribution = param => {
    return axios.get(`/sto/stoDelivery/queryLogisticsInfo/${param.id}`)
}

export const getStoPurchaseList = param => {
    return axios.get(`/sto/stoPurchase/modelcategory/P`)
}

export const downloadErrorFile = params => {
    return axios.get(`/sto/stoUpload/downloadErrorFile`, {
        params
    })
}

// export const download = param => {
//     let url = 'sto/stoIn/getExcelTemplate'
//     axios({
//         method: 'get',
//         url,
//         // headers: {
//         //     "Content-Type": "application/force-download"
//         // },
//         responseType: 'arraybuffer',//下载文件
//     }).then((response) => {
//         // const blob = new Blob([response.data], {type: response.headers['content-type']});//得到返回数据
//         // const fileURL = URL.createObjectURL(blob);
//         // const a = document.createElement('a');//创建a标签
//         // a.setAttribute('href', fileURL)//a标签href路径
//         // a.setAttribute('download', 'template.xlsx');//设置download属性
//         // a.click();//插入到文档中并click
//         // window.URL.revokeObjectURL(fileURL);
//
//         // const reader = new FileReader();
//         // reader.readAsDataURL(blob);
//         // reader.onload = (e) => {
//         //     const a = document.createElement('a');
//         //     a.download = `template.xlsx`;
//         //     a.href = e.target.result;
//         //     a.click();
//         // };
//     }).catch((error) => {
//         console.log(error)
//     })
// }