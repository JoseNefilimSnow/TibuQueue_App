const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const p = require('./config/adminPassword.json');
var fs = require('fs-extra');

//Puerto que escucha
const puerto = 3580;

//Middlewares
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

//Rutas

//Devuelve el Array de preguntas
app.get('/api/getQuestion', (req, res) => {
    fs.readdir('./preguntas', function read(err, files) {
        if (files) {
            var arrayPreguntas = []
            for (let file of files) {
                var aux = require('./preguntas/' + file)
                arrayPreguntas.push(aux);
            }
            res.send(arrayPreguntas);
        } else {
            res.send({
                error: err
            });
        }

    })
})

//Añade un objeto nuevo de pregunta
app.post('/api/addQuestion', (req, res) => {
    fs.writeJSON('./preguntas/' + req.body.name + "_" + req.body.question.replace("?","") + ".json", req.body);
    res.send({
        status: "200"
    });
})

//Borra un objeto de pregunta
app.post('/api/deleteQuestion', (req, res) => {
    if (req.body.pass === p.password) {

        fs.unlink('./preguntas/' + req.body.title.replace("?","") + '.json', (err) => {
            console.log(err)
        });
        res.send({
            status: "200"
        })
    } else {
        res.send({
            error: "La contraseña no es correcta"
        })
    }
})

//Abrir servidor
app.listen(puerto, () => {
    console.log('Servidor escuchando por el puerto ' + puerto);
});

//Cada nuevo dia que se inicie el servidor se vacía la carpeta de preguntas
checkAndClear();
function checkAndClear(){
    var date = require('./config/dateCheck.json'); 
    var hoy = new Date().setHours(0,0,0,0);
    if(!date.fecha){
        fs.writeJSON('./config/dateCheck.json',{fecha:hoy})
    }else if(date.fecha<hoy){
        fs.writeJSON('./config/dateCheck.json',{fecha:hoy})
        fs.readdir('./preguntas', (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink('./preguntas/'+ file, err => {
                if (err) throw err;
              });
            }
          });
    }else if(hoy<date.fecha){
        console.log("wtf");
    }
}