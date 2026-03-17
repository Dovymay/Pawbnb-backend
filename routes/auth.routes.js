const express = require("express");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User.model")
const {isAuthenticated} = require("../middleware/isAuth")

const router = express.Router()

//POST /auth/signup route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body

        //1. Make sure all info is sent from client
        if(!email || !password || !username){
            return res.status(400).json({message: "Please provide all info!"})
        }

        //2. Registering a user, if found with provided info, user already exists
        const foundUser = await User.findOne({ email })
        if(foundUser){
            return res.status(400).json({message: "Provide valid email"})
        }

        //3. Use regex to validate the password format
        if (
      !password.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$",
      )
    ) {
      return res.status(400).json({
        message:
          "Password has to be 8 characters long, with 1 uppercase, 1 lowercase and 1 special character",
      })
    }
     //4. If the email is unique, proceed to hash the password
        const salts = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salts)

        //5. Create a new user in the database
        // We return a pending promise, which allows us to chain another `then` 
        const createdUser = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        return res
            .status(201)
            .json({ message: "User created succesfully", createdUser })

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

       
// POST  /auth/login route
router.post("/login", async (req, res) => {
    try {
        const {email, username, password} = req.body
        //1. VALIDATE INPUT
        if(!email || !password){
            return res.status(400).json({message: "Please provide all info!"})
        }

        // 2. FIND USER
        const foundUser = await User.findOne({email})
        if(!foundUser){
            return res.status(401).json({message: "User doesn't exist"})
        }

         // 3. VERIFY PASSWORD
        if(!bcrypt.compareSync(password, foundUser.password)){
            return res.status(401).json({message: "Incorrect password"})
        }

        // 4. CREATE THE PAYLOAD
        const payload = {
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
        }

        // 5. SIGN THE TOKEN USEING JWT
        const authToken = await jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: "6h",
            algorithm: "HS256"
        })

        // 6. SEND THE TOKEN BACK TO THE CLIENT 
        res.status(200).json({message: "Successfuly logged in", authToken })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})


// GET  /auth/verify route
router.get("/verify", isAuthenticated, async (req, res) => {
    console.log(`req.payload`, req.payload)
    res.status(200).json(req.payload)
})

module.exports = router;