const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer')
const formData = require('express-form-data');
var Jimp = require('jimp');
const { read } = require('jimp');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(formData.parse());


const storage = multer.diskStorage({
    destination: 'ups/',
    filename: function(req, file, cb){
        cb("","img.jpg")
    }
})
const upload = multer({
   storage: storage})
  

   const config = {
    application: {
        cors: {
            server: [
                {
                    origin: ('*'),
                    credentials: true
                }
            ]
        }
    }
}

app.use(cors(
    config.application.cors.server
));


function writeInImage(callback){
    var phrase = 'No se alcanzo a leer la frase de la api';
    var options = {
        method: 'GET',
        url: 'https://iiif.harvardartmuseums.org/manifests/object/216847',        
      };
//consulta de laa frase desde la api
    axios.request(options).then(function (response) {          
        phrase=response.data.label;
        console.log('Frase leida desde la api: '+phrase);
    }).catch(function (error) {
        console.error(error);
    });
//lectura de la imagen
    Jimp.read('out.jpg', (err, imageLoaded) => {
        if (err) throw err;
        console.log('la imagen se ha cargado')
        setTimeout(function() {
//escritura en la imagen
        Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(font => {
            console.log('esto es la frase antes de imprimirla, creo: '+phrase)
            imageLoaded.print(font, 20, 20, {
                text: phrase
              });
        });
    },5000);
    //Guardar la imagen modificada
        setTimeout(function() {
            imageLoaded.write('img.jpg')        
            console.log('la nueva imagen se ha guardado')
        },10000);
    });
    setTimeout(() => {
        callback()
    }, 11000);
}





app.post("/image",  upload.single('avatar'),function (req, res, next) {
    console.log(req.body.avatar)
})


app.listen(3002, () => {
    console.log('Instancia running on http://localhost:3002')
});