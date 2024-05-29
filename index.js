const express = require("express");
const vision = require('@google-cloud/vision');
const { text } = require('body-parser');
const multer = require('multer');
const app = express();
const path = require('path');
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(express.static('public'));

process.env.GOOGLE_APPLICATION_CREDENTIALS = "keyfile.json";
const client = new vision.ImageAnnotatorClient();
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        return cb(null,"./uploads");
    },
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`);
    },
})
const upload=multer({storage})
app.get("/",function(request,response){
    response.sendFile('index.html', { root: 'public' });
 //    console.log(vision);
 });

var uploadFile="";
// var distination="";
app.post('/',upload.single('image'),(request,response)=>{
    console.log(request.file);
    if(request.file){
        // console.log("file uploaded: ",request.file.filename);
        // console.log(__dirname);
        const temp = request.file.originalname;
        uploadFile+=request.file.destination+"/"+request.file.filename;
        console.log("checking file name "+uploadFile);
        response.redirect('/StartButton.html');
        // response.sendFile('StartButton.html');
    }else{
        response.status(400).json({message:'No file uploaded'});
    }
});
app.get("/StartButton.html",function(request,response){
    response.sendFile(__dirname+"views/vision.ejs");
})
// var uploadFile="download.jpg";
app.get("/views/vision.ejs",function(request,response){
    // console.log("checking"+""+__dirname);
    const data = { message: 'Hello, world!' };
    async function checking(){
        // console.log(uploadFile);
        const [labelDetection] = await client.labelDetection(uploadFile);
        const [textDetection] = await client.textDetection(uploadFile);
        // console.log(labelDetection)
        console.log(textDetection.textAnnotations[0]==null);
        // const dataHead = { heading: labelDetection.labelAnnotations[0].description};
        // response.render('vision',data);
        let i=0;
        var labelAnnotationsArray = new Array();
        while(true){
            try{
            // console.log(labelDetection.labelAnnotations[i].description);
            labelAnnotationsArray.push(labelDetection.labelAnnotations[i].description);
            i++;
            }catch(error){
                break;
            }
        }
        if(textDetection.textAnnotations[0]!=null){
        labelAnnotationsArray[labelAnnotationsArray.length]=textDetection.textAnnotations[0].description;
        }
        if(labelAnnotationsArray.length>0){
            const data = { message: labelAnnotationsArray};
            // response.render('vision',dataHead);
            response.render('vision',data);
        }
        // response.status(400).json({message:labelDetection});
    }
    checking();
    // response.render('vision',data);
})

app.listen(8080,function(){
    console.log("server started on port 8080");
})