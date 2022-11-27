console.log('Hola Server, Grupo 32 ');

const express = require('express')
const app = express();
const port = 3002;
const mongoose = require('mongoose')



const {StringConn} = require('./db/dbConnection')
mongoose.connect(StringConn);

const User = require('./models/UserModel')

app.use(express.urlencoded({extended: true}))
app.use(express.json());

const router = express.Router();

router.get("/", (req, res) => {
    res.send( '<h1>Hello World!!!! My First API Rest"</h1>')
})


//Operaciones CRUD

//Crear --> Create
router.post('/createUser', ( req , res ) => {

    const {body} = req
    const newUser = new User({
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email.toLowerCase(),
        password: body.password
    })

    // const result = await newUser.save();
    // res.send(result)

    //Guardando un usuario con el formato undefined
    // newUser.save();

    //Guardando un usuario con el formato tipo promise
    // newUser.save()
    //     .then(() => res.send({messagge: 'Usuario Guardado con Exito'}))
    //     .catch((err) => res.send({messagge: err}))


    User.findOne({email: newUser.email}, (err, userFinded) => {
        if(userFinded){
            res.send({message: 'Usuario ya Existe'})
        } else if (!userFinded){
            newUser.save((err,userStored) => {
                if(userStored){
                    res.send({message: 'Usuario Creado con Exito'})
                }
        
                if(err){
                    res.send({message: 'Error del Servidor'})
                }
            })
        } else {
            res.send({message: 'Error del Servidor' + err})
        }
    })

    //Guardando un Usuario con el parametro tipo Callback
    // console.log(req.body);
    // res.send (req.body)
    // res.send({message: 'EndPoint Create User On' })
})

//Leer Usuario - Read - R
router.get('/getAllUsers', (req, res) => {
    // res.send({message: 'Get Users On'})

    User.find( { } , function (err, userDocs) {
        if(err){
            res.status(500).send( { message:'Error del Servidor: '+ err } )
        } else if(!userDocs){
            res.status(404).send( { message: 'Coleccion sin Documentos' } )
        } else {
            res.status(200).send( {userDocs} )
        }
    });
})


//Editar Usuario - Update - U
router.put('/update-user/:id', (req, res) => {

    const idToUpdate = req.params.id;
    const { body } = req
    const userToUpdate = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email.toLowerCase(),
        password: body.password
    }

    User.findOne ({email: userToUpdate.email}, (err, emailFinded) => {
        if(err){
            res.send({message: 'Error del Servidor: '+ err})
        } else if(emailFinded){
            res.send({message: 'Email ya se encuentra en Uso'})
        } else {
            User.findByIdAndUpdate(idToUpdate, userToUpdate, function (err, userUpdated) {
                if(userUpdated){
                    res.send({message: 'Usuario Actualizado Satisfactoriamente'})
                } else if(!userUpdated){
                    res.send({message: 'Usuario Actualizado'})
                } else {
                    res.status(500).send({message: `Error del Servidor ${err}` })
                }
            })
        }
    })

})

//Eliminar Usuario - Delele - D

router.delete('/delete-user/:id', (req, res) => {
    // res.send({message: 'Delete User On'})

    const idToDelete = req.params.id;
    User.findByIdAndRemove ({_id: idToDelete}, (err, userDeleted) => {
        if(err){
            res.send({message: 'Error del Servidor: ' + err})
        } else if (userDeleted){
            res.send({message:'Usuario Eliminado'})
        } else {
            res.send({message: 'Usuario No Encontrado'})
        }
    })

})

app.use('/api/v1',router);


app.listen(port, () => {
    console.log(`Server Port: ${port}`)
})