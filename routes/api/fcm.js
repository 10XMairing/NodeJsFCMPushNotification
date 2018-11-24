const mongoose = require('mongoose');
const app = require('express');
const router = app.Router();
const Token = require('../models/token');
const request = require('request');

//this is my test project auth key. get yours from firebase settings --> cloud messaging --> legacy key
const testserverauth = "key=AIzaSyD2aNZJbifPXN3cpKepQ2zCLnyf-emlZmk"
const sendUrl = "https://fcm.googleapis.com/fcm/send"


//fcm push notification to this end point: send to all subscribers to topic : 'test' // change it to registration_ids =['tokens'] to send to individuals
router.post('/send', (req, res, next)=>{
    const msg = req.body.message;
    const title = req.body.title;
    const myJson = {
        to : "/topics/test",
        data : {
            message : msg,
            title : title
        }
    };

    const options = {
        url : sendUrl,
        method : "POST",
        json : true,
        headers : {
            "Content-Type" : "application/json",
            "Authorization": testserverauth
        },
        body : myJson
    }

    request(options, (err, ress, body)=>{
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            res.status(200).json(ress);
            console.log(ress);
        }
    })

})


//store token at this end point

router.post('/token', (req, res, err) => {
    const str = req.body.token;
    
    const p = new Token({
        _id : new mongoose.Types.ObjectId(), 
        token : str
    });

    p.save().then(result=>
        {   res.status(200).json({
            _id : p._id,
            message: "Saved token data",
            newuser : p
        })
            console.log(result);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({
                err : err.message
            })
        });
})



router.get('/token', (req, res, next)=>{
    Token.find().exec().then(docs=>{
        console.log(docs);
        res.status(200).json(docs);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            err : err
        })
    });
});

router.get('/token/:id' ,(req, res, next)=>{
const id = req.params.id;
Token.findById(id).exec().then(result=>{
    res.status(200).json(result);
}).catch(err =>{
    res.status(500).json(err);
});

})


router.delete('/token/:id', (req, res, next)=>{
    Token.remove({
        _id : req.params.id
    }).exec().then(result=>{
        res.status(200).json(result);
    }).catch(err =>{
        res.status(500).json(err);
    });
})


router.patch('/token/:id', (req , res, next)=>{
    const id = req.params.id;
    const props = req.body;
    
    Token.update({
        _id : id
    },{$set : props
    
    } ).then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
})






module.exports = router;