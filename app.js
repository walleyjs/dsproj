var express=require("express");
var app= express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Todo=require("./models/todo.js");
var User=require("./models/user.js");
var nodemailer=require("nodemailer");
var twilio=require("twilio");
mongoose.connect("mongodb://localhost/todo_app");
// Todo.create({
//     hobby:"playing football",
//     image:"https://image.shutterstock.com/display_pic_with_logo/59982/706056724/stock-photo-family-vacation-travel-holiday-trip-in-motorhome-caravan-car-vacation-beautiful-nature-italy-706056724.jpg"
// });
app.set("view engine","ejs");
app.set("views","views");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("./public"));

app.set("port",process.env.PORT || 5000);



// app.get("/",function (req,res) {
//     res.redirect("/todoapp");
// });
app.get("/user/login",function (req,res) {
        res.render("login");
}); 
app.get("/user/signup",function (req,res) {
    
        res.render("signup");
})
app.post("/user/signup",function (req,res) {
    var username=req.body.username;
    var password=req.body.password;
    var email=req.body.email;
    var user={
        username:username,
        password:password,
        email:email
    }
    User.create(user,function (err,user) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/todoapp/"+ user.id );
        }
    })
});
app.post("/todoapp/:todo",function (req,res) {
    var hobby;
    var image;
    var usermail;
    User.findById(req.params.todo,function (err,user) {
        if (err) {
            console.log(err);
            console.log("there is an error some");
        } else {
            hobby=req.body.hobby;
            image = req.body.image;
            var todoApp={hobby:hobby,image:image};
            usermail=user.email;
            Todo.create(todoApp,function (err,todoinput) {
              if (err) {
                console.log(err);
             } else {
                user.todo.push(todoinput.id);
                user.save();
                res.redirect("/todoapp/"+ user.id);
                console.log(todoinput);
                    }
            });
            console.log(usermail);
    var output=`
    <h1>you just added a new hobby</h1>
    <p>Hobby:${hobby}</p>
    `;
    
    var account={
        user:"rajibashirolawale@gmail.com",
        pass:"bashirolawale"
    };
    
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        },
        tls:{
            rejectUnaauthorized:false
        }
    });
            transporter.on('token', token => {
                console.log('A new access token was generated');
                console.log('User: %s', token.user);
                console.log('Access Token: %s', token.accessToken);
                console.log('Expires: %s', new Date(token.expires));
            });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Hobby adddds" <rajibashirolawale@gmail.com>', // sender address
        to: usermail, // list of receivers
        subject: 'your new hobby', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
        }
    })
    
    
});
    app.get("/todoapp/:id",function (req,res) {
    User.findById(req.params.id).populate("todo").exec(function (err,usertodo) {
        if (err) {
            console.log(err);
        } else {
            // console.log(usertodo);
            res.render("index",{
                usertodo:usertodo
            })
        }
    });
});

var server= app.listen(app.get("port"),function () {
    console.log("you are listening to port " +app.get("port"));
});