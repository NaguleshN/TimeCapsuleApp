// Sample login function where token is created and set in cookies
import User from '../models/userModel.js';

const loginUser = async (req, res) => {
    // Authenticate user
    const user = await User.findOne({ email: req.body.email });
    if (!user || !await user.matchPassword(req.body.password)) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  
    // Create and set JWT token in cookies
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  
    res.cookie('jwt', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',  
      sameSite: 'strict', 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });
  
    res.json({
      message: 'Logged in successfully',
      user: { id: user._id, name: user.name },
    });
  };

export default loginUser ; 