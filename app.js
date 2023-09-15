const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const port = 8000;
const connectDB = require("./config/db");
connectDB();
const FarmerModel = require("./models/farmerModel");
const OtpModel = require("./models/otpModel");
const nodemailer = require('nodemailer');
const FarmerDataModel = require('./models/farmerData');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


function generateOTP() {
    // Generate a random number between 100000 and 999999
    const min = 100000;
    const max = 999999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    return otp.toString(); // Convert the number to a string
}
const transporter = nodemailer.createTransport({
    //   service: 'Gmail', // You can change this to your email service provider
    service: 'gmail',
    port: 465,
    auth: {
        user: '004ujala@gmail.com', // Your email address
        pass: 'zlvecyjhcatnpmgq', // Your email password or app-specific password
    },
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(`${name},${email},${password}`);
        const otp = generateOTP();
        const textt = `your otp is ${otp}`
        console.log(`Your 6-digit OTP is: ${otp}`)

        const mailOptions = {
            from: '004ujala@gmail.com', // Sender's email address
            to: email, // Recipient's email address
            subject: 'OTP from server side', // Subject of the email
            text: textt, // Email body
        };

        var info = await transporter.sendMail(mailOptions);
        let otpSaved = await new OtpModel({ name: name, email: email, password: password, otp: otp }).save();

        res.status(200).json({
            success: true,
            message: "Mail sended succesfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "some internal error occurred",
            error
        })
    }
})

app.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpUser = await OtpModel.findOne({ email: email, otp: otp });
        let user = await new FarmerModel({ name: otpUser.name, email: otpUser.email, password: otpUser.password }).save();

        res.status(201).send({
            success: true,
            message: "farmer registred successfully",
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "some internal error occurred",
            error
        })
    }

})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userr = await FarmerModel.findOne({ email: email });

        if (userr.password === password) {
            return res.status(200).send({ success: true, message: "login successfully" });
        } else {
            return res.status(401).send({
                success: false,
                message: "invalid credentials",
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "some internal error occurred",
        })
    }
})

app.post('/send-email', async (req, res) => {
    const { to, subject } = req.body;
    const otp = generateOTP();
    console.log(`Your 6-digit OTP is: ${otp}`)

    const mailOptions = {
        from: '004ujala@gmail.com', // Sender's email address
        to, // Recipient's email address
        subject, // Subject of the email
        text: otp, // Email body
    };

    var info = await transporter.sendMail(mailOptions);


    res.status(200).json({
        success: true,
        message: "Mail sended succesfully"
    })
});

app.post("/farmerdata", async (req, res) => {
    try {
        const { email, id, landsize, estimated_production, state } = req.body;
        const user = await FarmerModel.findOne({ email: email });
        let farmer1 = await new FarmerDataModel({ id: user._id, landsize: landsize, estimated_production: estimated_production, state: state }).save();
        res.status(201).send({
            success: true,
            message: "farmer data registered successfully"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "some internal occurred"
        })
    }
})

app.post("/stateproduction", async (req, res) => {
    try {
        const { state } = req.body;
        const data = await FarmerDataModel.find({ state: state });
        let sum = 0;
        data.map((col) => {
            sum += col.estimated_production
        })
        res.status(200).send({
            success: true,
            message: "data fetched successfully",
            sum
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "some internal error occurred"
        })
    }
})



app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
})

