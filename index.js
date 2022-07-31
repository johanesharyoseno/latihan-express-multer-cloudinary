const express = require('express');
const multer  = require('multer');
const cloudinary  = require('cloudinary').v2;
const fs =  require ('fs');

cloudinary.config({
    cloud_name: 'dkdqumbxp',
    api_key:'748446492276164',
    api_secret:'OBCgcfyW9LMYfzlty5V5RmWa2EM'
})

const uploadCloudinary = async (filePath) =>{
    let result;
    try{
        result = await cloudinary.uploader.upload(filePath,{
            user_filename: true
        });
        fs.unlinkSync(filePath);
        return result.url;
    } catch (err) {
        fs.unlinkSync(filePath);
        return null;
    }
}

const storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null, './uploads')
    },
    filename: function(req,file,callback){
    callback(null, file.originalname)
}
});

const upload = multer({
    storage:storage,
    fileFilter: (req,file,callback)=>{
        if(file.mimetype=='image/png'|| file.mimetype =='image/jpg' || file.mimetype=='image/jpeg'){
            return callback(null,true);
        } else {
            callback(null,false);
            return callback(new Error('only .png, .jpg, .jpeg format allowed!'))
        }
    },
    limits: {
        fileSize: 100000
    }
});

const onlineCloudinaryUpload = multer ({storage:storage})
const app = express();

app.post('/profile/multer',upload.single('avatar'),(req,res)=>{
    res.send(req.file);
});
app.post('/profile/cloudinary', onlineCloudinaryUpload.single('avatar'),async(req,res)=>{
    const url = await uploadCloudinary(req.file.path);
    if (url){
        return res.json({
            message: 'upload berhasil',
            url:url,
        });
    } else {
        return res.json({
            message:'upload gagal'
        });
    }
});
app.post('/photos/upload', upload.array('photos',12), (req,res)=>{
    res.send(req.files)
})

app.listen(3000);