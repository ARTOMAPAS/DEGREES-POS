const UserModel = require('../models/usersModel');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3D' });
}

const loginUser = async (req, res) => {
    const { user_name, password, email } = req.body;

    console.log('Received login request:', { user_name, password, email });

    try {
        let user;

        // Check if email is provided, use email for login
        if (email) {
            user = await UserModel.loginByEmail(email);
        } else {
            // Use user_name and password for login
            user = await UserModel.login(user_name, password);
        }

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'tokumota23@gmail.com',
              pass: 'heca yyxr unlk hntz'
            }
          });
          
          console.log()

          const mailOptions = {
            from: 'tokumota23Degrees Milktea',
            to: 'tokumota23@gmail.com',
            subject: 'Successful Login to Degrees System',
            text: `Dear ${user.name},
          
          We hope this email finds you well. 
          
          We wanted to inform you that your login to the Degrees System was successful. Here are the details of your login:
          
          - Username: ${user.user_name}
          - Date and Time: ${new Date().toLocaleString()}  
          
          If you did not perform this login or suspect any unauthorized activity, please take the following steps:
          
          1. Change your password immediately.
          2. Contact our support team at [Support Email] or [Support Phone Number].
          
          Thank you for choosing Degrees System.
          
          Best regards,
          Degrees Milk Tea`,
          };
          
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        const token = createToken(user._id);

        

        res.status(200).json({ _id: user._id, token, user_type: user.user_type, branchID: user.branch_id_assigned });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User not Existed' });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '5m' });
        const link = `http://localhost:3000/resetpassword/${user._id}/${token}`;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'tokumota23@gmail.com',
              pass: 'heca yyxr unlk hntz'
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: 'tokumota23@gmail.com',
            subject: 'Degrees Reset Password',
            text: link,
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        console.log(link);

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { new_password } = req.body;

    try {
        if (req.method === 'GET') {
            // Check the validity of the token without updating the password
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err || decoded.id !== id) {
                    console.log('error');
                    return res.status(400).json({ error: 'Invalid or expired token.' });
                }
        
                
                res.status(200).json({ message: 'Token is valid.' });
            });
        } else if (req.method === 'POST') {
            // Verify the token and update the password
            jwt.verify(token, process.env.SECRET, async (err, decoded) => {
                if (err || decoded.id !== id) {
                    console.log('error');
                    return res.status(400).json({ error: 'Invalid or expired token.' });
                }

                const user = await UserModel.findById(id);

                if (!user) {
                    return res.status(400).json({ error: 'User not Existed' });
                }

                const hashedPassword = await bcrypt.hash(new_password, 10);

                // Update the user's password
                user.password = hashedPassword;
                await user.save();

                res.status(200).json({ message: 'Password reset successful.' });
            });
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { loginUser, forgotPassword, resetPassword };
