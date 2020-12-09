/**
 * @description utils controller
 * @author zhang
 */

const { ErrorModel, SuccessModel } = require('../model/ResModel')
const { uploadFileSizeFailInfo } = require('../model/ErrorInfo')
const fse = require('fs-extra')
const path = require('path')

//文件保存位置
const DIS_FOLDER_PATH = path.join(__dirname,'..','..','uploadFiles')
//文件最大体积
const MAX_SIZE = 1024 * 1024 * 1024


/**
 * 保存文件
 * @param {string} name  文件名字
 * @param {string} type  文件类型
 * @param {number} size  文件大小
 * @param {string} filePath  文件路径
 */
async function saveFile({ name, type, size, filePath }) {
    if(size > MAX_SIZE){
        await fse.remove(filePath)
        return new ErrorModel(uploadFileSizeFailInfo)
    }
		
    //移动文件
    const fileName = Date.now() + '_' + name
    const distFilePath = path.join(DIS_FOLDER_PATH, fileName)
    await fse.move(filePath,distFilePath)
		
    return new SuccessModel({
        url: `/${fileName}`
    })
}

module.exports = {
    saveFile
}