
require('dotenv').config()
const express = require("express");
const { connectDB } = require("./config/database");
const app =  express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server listening on port 3000...");
    });
  }).catch((err) => {
    console.error(`${err} occured`);
  }
);

// //profile page after successful login
// app.get("/profile", userAuth, async (req, resp) => {
//   try {
//     const user = req.user;
//     if (!user) throw new Error("Please login");

//     resp.send("Welcome to the profile page, " + user.firstName);
//   } catch (err) {
//     resp.status(400).send("Something went wrong");
//   }
// });


// //Dummy sendConnection request
// app.post("/user/sendConnection", userAuth, async(req, resp) => {
//   const user = req.user;
//   resp.send(user.toString());
// })

// // Fetch user by emailid
// app.get("/user/fetchByEmail", async(req, resp) => {
//   const userEmail = req.body.emailId;
  
//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if(!user) {
//       resp.status(404).send("User not found");
//     } else {
//       console.log(user);
//       resp.send("User retrieved:");
//     }
//   } catch (err) {
//     resp.status(400).send("Something went wrong");
//   }
// });

// //Fetch user by id
// app.get("/user/fetchById", async (req, resp) => {
//   const requiredId = req.body.id;
//   try {
//     const user = await User.findById({ _id: requiredId });
//     if (!user) {
//       resp.status(404).send("No user with such id");
//     } else {
//       resp.send(user.toString());
//     }
//   } catch (err) {
//     resp.status(400).send("Something went wrong: " + err);
//   }
// });

// //Fetch by id and delete
// app.delete("/user/fetchByIdAndDelete", async (req, resp) => {
//   const idToDelete = req.body.id;
//   try {
//     const user = await User.findByIdAndDelete({ _id: idToDelete });
//     if(!user) {
//       resp.status(404).send("User not found");
//     } else {
//       resp.send("User successfully deleted");
//     }
//   } catch (err) {
//     resp.status(400).send("Something went wrong:" + err);
//   }
// })

// // Feed: Fetch all users
// app.get("/feed", async (req, resp) => {
//   try {
//     const users = await User.find({}); //returns array of all users available
//     if(users.length === 0) {
//       resp.status(404).send("No users found");
//     } else {
//       // console.log(users);
//       resp.send(users.toString());
//     }
//   } catch (err) {
//       resp.status(400).send("Something went wrong");
//   }
// });

// //Update User details
// app.patch("/user/update/:userId", async(req, resp) => {
//   const id = req.params?.userId;
//   const updatedData = req.body;
//   let userToUpdate = null;

//   try {
//     const isValidUpdation = Object.keys(updatedData).every((k) => {
//       return ALLOWED_UPDATES.includes(k);
//     });

//     if (!isValidUpdation) {
//       throw new Error("Updation not allowed");
//     } else {
//       userToUpdate = await User.findByIdAndUpdate({_id: id}, updatedData, {
//         runValidators: true,
//         returnDocument: 'after'  
//       });

//       if (!userToUpdate) {
//         resp.status(404).send("User not found");
//       } else {
//         resp.send("User updated successfully!");
//       }
//     }
//   } catch (error) {
//     resp.status(400).send("Something went wrong: " + error.message);
//   }
// });


