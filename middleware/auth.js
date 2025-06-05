import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Inte auktoriserad' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // save info about user from token
    next();
  } catch (err) {
    res.status(401).json({ message: 'Ogiltig token' });
  }
};
