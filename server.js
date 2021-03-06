var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');

var fs = require('fs'),
    https = require('https');

/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(
    connection(mysql,{
      host     : 'janshauch.mysql.database.azure.com',
      user     : 'madheysia@janshauch',
      password : 'Shubham@07',
      database : 'janshauch',
      port: 3306,
      debug    : false,
      encrypt: true,
      ssl : {
        ca: fs.readFileSync('./BaltimoreCyberTrustRoot.crt.pem')
      }
    },'request')
);

// // ------------------------------------------------------------
// // static pages

// app.get('/faq',function(req,res){
//     res.render('faq');
// });

// app.get('/about',function(req,res){
//     res.render('about');
// });

// app.get('/sitemap',function(req,res){
//     res.render('sitemap');
// });

// // ------------------------------------------------------------

//RESTful route
var router = express.Router();

/*------------------------------------------------------
*  This is router middleware,invoked everytime we hit url
*  we can use this for doing validation,authetication
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});


// -----------------------------------------------------------------------------

var home = router.route('/');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

------------------------------------------------------*/

var createAcc = router.route('/signup');

createAcc.get(function(req,res,next){
  res.render('register');
});

// createAcc.post(function(req,res,next){

//     //server side validation*********
//     req.assert('firstName','First Name is required').matches(/[^\s\\]/);
//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     req.assert('emailId','A valid email is required').isEmail();
//     errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     req.assert('password','Enter a password 6 - 20').len(6,20);
//     errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     //get data
//     var data = {
//         name:req.body.firstName+req.body.lastName,
//         emailId:req.body.emailId,
//         password:req.body.password
//      };

//     //inserting into mysql
//     req.getConnection(function (err, conn){
//         if (err) return next("Cannot Connect");

//         var query = conn.query("INSERT INTO classroomshoppers.userdetail set ? ", data, function(err, rows){
//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }

//            res.sendStatus(200);
//         });
//      });
// });


var loginAcc = router.route('/signin');

loginAcc.get(function(req,res,next){
  res.render('login');
});

// loginAcc.put(function(req,res,next){
//   console.error("inside post--------------");

//   req.assert('emailId','A valid email is required').isEmail();
//   errors = req.validationErrors();
//   if(errors){
//       res.status(422).json(errors);
//       return;
//   }

//   req.assert('password','Empty password not alllowed').notEmpty();
//   errors = req.validationErrors();
//   if(errors){
//       res.status(422).json(errors);
//       return;
//   }

//   var emailId = req.body.emailId;
//   var password = req.body.password;

//   req.getConnection(function(err,conn){
//       if (err){
//         console.log(err);
//         return next("Cannot Connect");
//       }

//       var query = conn.query("SELECT name FROM classroomshoppers.userdetail WHERE emailId = '"+emailId+"'  and password = '"+password+"' ", function(err,rows){
//           if(err){
//             console.log(err);
//               return next("Mysql error, check your query");
//           }
//           if(rows.length==0)
//             res.status(400).json("Invalid emailID - password");
//           else
//           res.status(200).json(rows[0].name);
//        });
//   });
// });



var forgotAccount = router.route('/forgot-password');

forgotAccount.get(function(req,res,next){
  res.render('forgot-password');
});

// forgotAccount.post(function(req,res,next){

//     //server side validation*********
//     req.assert('firstName','First Name is required').matches(/[^\s\\]/);
//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     req.assert('emailId','A valid email is required').isEmail();
//     errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     req.assert('password','Enter a password 6 - 20').len(6,20);
//     errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     //get data
//     var data = {
//         name:req.body.firstName+req.body.lastName,
//         emailId:req.body.emailId,
//         password:req.body.password
//      };

//     //inserting into mysql
//     req.getConnection(function (err, conn){
//         if (err) return next("Cannot Connect");

//         var query = conn.query("INSERT INTO classroomshoppers.userdetail set ? ", data, function(err, rows){
//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }

//            res.sendStatus(200);
//         });
//      });
// });



var home = router.route('/');

home.get(function(req,res,next){
  res.render('index');
});

// //get data to update
// home.get(function(req,res,next){

//     var user_id = req.params.user_id;
//     res.render('index');

//     req.getConnection(function(err,conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query("SELECT * FROM t_user WHERE user_id = ? ",[user_id],function(err,rows){

//             if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//             }

//             //if user not found
//             if(rows.length < 1)
//                 return res.send("User Not found");

//             res.render('edit',{title:"Edit user",data:rows});
//         });
//     });

// });

var nearby = router.route('/nearby');

nearby.get(function(req,res,next){

    var x = req.query.latitude;
    var y = req.query.longitude;
    var z = req.query.filter;
    var isMale = req.query.isMale;
    var isFemale = req.query.isFemale;
    var isUnisex = req.query.isUnisex;
    var isAccessibilityFeature = req.query.isAccessibilityFeature;
    var isParkingAvailable = req.query.isParkingAvailable;
    var isAdultChangeFacilityAvailable = req.query.isAdultChangeFacilityAvailable;
    var isWaterSuitableForDrinking = req.query.isWaterSuitableForDrinking;

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        if(z=='nearest'){
          var query = conn.query("Select *, (( "+x+" -latitude)*( "+x+" -latitude) + ( "+y+" -longitude)*( "+y+" -longitude)) as distance from janshauch.toilet Where (( "+x+" -latitude)*( "+x+" -latitude) + ( "+y+" -longitude)*( "+y+" -longitude)) < 0.014*0.014  AND isMale>="+isMale+" AND isFemale>="+isFemale+" AND isUnisex>="+isUnisex+" AND isAccessibilityFeature>="+isAccessibilityFeature+" AND isParkingAvailable>="+isParkingAvailable+" AND isAdultChangeFacilityAvailable>="+isAdultChangeFacilityAvailable+" AND isWaterSuitableForDrinking>="+isWaterSuitableForDrinking+" ORDER BY distance desc", function(err, rows){
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
          res.send(rows);
        });
        }
        else{
          var query = conn.query("Select *, (( "+x+" -T.latitude)*( "+x+" -T.latitude) + ( "+y+" -T.longitude)*( "+y+" -T.longitude)) as distance from janshauch.toilet as T, janshauch.feedback as R Where (( "+x+" -T.latitude)*( "+x+" -T.latitude) + ( "+y+" -T.longitude)*( "+y+" -T.longitude)) < 0.014*0.014  AND T.latitude=R.latitude  AND T.longitude=R.longitude  AND isMale>="+isMale+" AND isFemale>="+isFemale+" AND isUnisex>="+isUnisex+" AND isAccessibilityFeature>="+isAccessibilityFeature+" AND isParkingAvailable>="+isParkingAvailable+" AND isAdultChangeFacilityAvailable>="+isAdultChangeFacilityAvailable+" AND isWaterSuitableForDrinking>="+isWaterSuitableForDrinking+" ORDER BY distance desc", function(err, rows){
            // Select *, (21.25-T.latitude)*(21.25-T.latitude) + (81.62-T.longitude)*(81.62-T.longitude) as distance from janshauch.toilet as T, janshauch.feedback as R Where (21.25-T.latitude)*             (21.25-T.latitude) + (81.62-T.longitude)*(81.62-T.longitude) <  0.014*0.014  AND T.latitude=R.latitude  AND T.longitude=R.longitude ORDER BY distance desc;          
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
          res.send(rows);
        });
        }
     });

});

// // //delete data
// // home.delete(function(req,res,next){

// //     var user_id = req.params.user_id;

// //      req.getConnection(function (err, conn) {

// //         if (err) return next("Cannot Connect");

// //         var query = conn.query("DELETE FROM t_user  WHERE user_id = ? ",[user_id], function(err, rows){

// //              if(err){
// //                 console.log(err);
// //                 return next("Mysql error, check your query");
// //              }

// //              res.sendStatus(200);

// //         });
// //         //console.log(query.sql);

// //      });
// // });


var trip = router.route('/trip');

trip.get(function(req,res,next){
  res.render('trip');
});


// // -----------------------------------------------------------------------------


// // var curut = router.route('/user');
// //
// // //show the CRUD interface | GET
// // curut.get(function(req,res,next){
// //
// //     req.getConnection(function(err,conn){
// //
// //         if (err) return next("Cannot Connect");
// //
// //         var query = conn.query('SELECT * FROM t_user',function(err,rows){
// //
// //             if(err){
// //                 console.log(err);
// //                 return next("Mysql error, check your query");
// //             }
// //
// //             res.render('user',{title:"RESTful Crud Example",data:rows});
// //
// //          });
// //
// //     });
// //
// // });
// // //post data to DB | POST
// // curut.post(function(req,res,next){
// //
// //     //validation
// //     req.assert('name','Name is required').notEmpty();
// //     req.assert('email','A valid email is required').isEmail();
// //     req.assert('password','Enter a password 6 - 20').len(6,20);
// //
// //     var errors = req.validationErrors();
// //     if(errors){
// //         res.status(422).json(errors);
// //         return;
// //     }
// //
// //     //get data
// //     var data = {
// //         name:req.body.name,
// //         email:req.body.email,
// //         password:req.body.password
// //      };
// //
// //     //inserting into mysql
// //     req.getConnection(function (err, conn){
// //
// //         if (err) return next("Cannot Connect");
// //
// //         var query = conn.query("INSERT INTO t_user set ? ",data, function(err, rows){
// //
// //            if(err){
// //                 console.log(err);
// //                 return next("Mysql error, check your query");
// //            }
// //
// //           res.sendStatus(200);
// //
// //         });
// //
// //      });
// //
// // });
// //
// // // -----------------------------------------------------------------------------
// //
// // var curut2 = router.route('/user/:user_id');
// //
// // curut2.all(function(req,res,next){
// //     console.log("You need to smth about curut2 Route ? Do it here");
// //     console.log(req.params);
// //     next();
// // });
// //
// // //get data to update
// // curut2.get(function(req,res,next){
// //
// //     var user_id = req.params.user_id;
// //
// //     req.getConnection(function(err,conn){
// //
// //         if (err) return next("Cannot Connect");
// //
// //         var query = conn.query("SELECT * FROM t_user WHERE user_id = ? ",[user_id],function(err,rows){
// //
// //             if(err){
// //                 console.log(err);
// //                 return next("Mysql error, check your query");
// //             }
// //
// //             //if user not found
// //             if(rows.length < 1)
// //                 return res.send("User Not found");
// //
// //             res.render('edit',{title:"Edit user",data:rows});
// //         });
// //
// //     });
// //
// // });
// //
// // //update data
// // curut2.put(function(req,res,next){
// //     var user_id = req.params.user_id;
// //
// //     //validation
// //     req.assert('name','Name is required').notEmpty();
// //     req.assert('email','A valid email is required').isEmail();
// //     req.assert('password','Enter a password 6 - 20').len(6,20);
// //
// //     var errors = req.validationErrors();
// //     if(errors){
// //         res.status(422).json(errors);
// //         return;
// //     }
// //
// //     //get data
// //     var data = {
// //         name:req.body.name,
// //         email:req.body.email,
// //         password:req.body.password
// //      };
// //
// //     //inserting into mysql
// //     req.getConnection(function (err, conn){
// //
// //         if (err) return next("Cannot Connect");
// //
// //         var query = conn.query("UPDATE t_user set ? WHERE user_id = ? ",[data,user_id], function(err, rows){
// //
// //            if(err){
// //                 console.log(err);
// //                 return next("Mysql error, check your query");
// //            }
// //
// //           res.sendStatus(200);
// //
// //         });
// //
// //      });
// //
// // });
// //
// // //delete data
// // curut2.delete(function(req,res,next){
// //
// //     var user_id = req.params.user_id;
// //
// //      req.getConnection(function (err, conn) {
// //
// //         if (err) return next("Cannot Connect");
// //
// //         var query = conn.query("DELETE FROM t_user  WHERE user_id = ? ",[user_id], function(err, rows){
// //
// //              if(err){
// //                 console.log(err);
// //                 return next("Mysql error, check your query");
// //              }
// //
// //              res.sendStatus(200);
// //
// //         });
// //         //console.log(query.sql);
// //
// //      });
// // });
// //
// // // -----------------------------------------------------------------------------

//now we need to apply our router here
app.use(router);

//start Server
var server = app.listen(process.env.PORT || 1337,function(){

   console.log("Listening to port %s",server.address().port);

});
