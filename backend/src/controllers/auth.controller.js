const { generateOtp, hashOtp, isExpired } = require('../utils/otp');
const { sendEmail } = require('../utils/mailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

async function signup(req, res) {
        const {email, name} = req.body;
      
        if (!email || !name){
          return res.status(400).json(
            { message: 'Email and name are required',
              success: false,
            }
          );
        }
      
        let user = await User.findOne({ email });
      
        if(!user){
          user = await User.create({
            email,
            name,
          });
      
          
        const otp = generateOtp();
        user.otpHash = hashOtp(otp);
        user.otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
        user.otpVerified = false;
        await user.save();
      
        await sendEmail({ to: email, otp });
      
      
          return res.status(201).json(
            { message: 'OTP sent successfully',
              success: true,
              data: user,
            }
          );
        } else {
          return res.status(409).json(
            { message: 'Account already exists. Please sign in.',
              success: false,
            }
          );
        }
      }

async function verifyOtp(req, res) {
    const email = req.body.email;
    const otp = String(req.body.otp || '').trim();
    
    if (!email || !otp) return res.status(400).json(
        { message: 'Email and OTP are required',
        success: false,
        }
    );
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(
        { message: 'User not found',
        success: false,
        }
    );
    
    if (!user.otpHash || !user.otpExpiresAt) {
        return res.status(400).json(
        { message: 'OTP not requested. Please sign up again.',
            success: false,
        }
        );
    }
    
    if (isExpired(user.otpExpiresAt)) {
        return res.status(400).json(
        { message: 'OTP expired. Please request a new OTP.',
            success: false,
        }
        );
    }
    
    if (hashOtp(otp) !== user.otpHash) {
        return res.status(400).json(
        { message: 'Invalid OTP',
            success: false,
        }
        );
    }
    
    user.otpVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;
    await user.save();
    
    return res.status(200).json({ message: 'OTP verified',
        success: true,
        data: user,
        }
    );
}

async function login(req, res) {
    const email = req.body.email;
    const password = String(req.body.password || '');
    
    if (!email || !password) return res.status(400).json(
        { message: 'Email and password are required',
        success: false,
        }
    );
    
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) return res.status(401).json(
        { message: 'Invalid credentials',
        success: false,
        }
    );
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json(
        { message: 'Invalid credentials',
        success: false,
        }
    );
    
    const token = jwt.sign(
        { sub: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
    );
    
        return res.status(200).json({
        message: 'Login successful',
        success: true,
        data: {
        token,
        user: { id: user._id.toString(), email: user.email, name: user.name },
        },
        });
    }

async function me(req, res) {
    const userId = req.user.id;
    const user = await User.findById(userId).select('email name');
    if (!user){
        return res.status(404).json(
        { message: 'User not found',
            success: false,
        }
        );
    }
    
    return res.status(200).json(
        { message: 'User found',
        success: true,
        data: {
            user: { id: user._id.toString(), email: user.email, name: user.name },
        },
        }
    );
}

async function setPassword(req, res) {
    const email = req.body.email;
    const password = String(req.body.password || '');
  
    if (!email || !password)
       return res.status(400).json(
        { message: 'Email and password are required',
        success: false,
        }
    );
    if (password.length < 8) return res.status(400).json(
        { message: 'Password must be at least 8 characters',
        success: false,
        }
    );
  
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(
        { message: 'User not found',
        success: false,
        }
    );
  
    if (!user.otpVerified) {
      return res.status(400).json(
        { message: 'OTP not verified',
        success: false,
        }
    );
    }
  
    if (user.passwordHash) {
      return res.status(409).json(
        { message: 'Password already set. Please sign in.',
        success: false,
        }
    );
    }
  
    user.passwordHash = await bcrypt.hash(password, 10);
    user.otpVerified = false;
    await user.save();
  
    return res.status(200).json({ message: 'Password set',
        success: true,
        }
    );
  }


module.exports = {
    signup,
    verifyOtp,
    login,
    me,
    setPassword
};
