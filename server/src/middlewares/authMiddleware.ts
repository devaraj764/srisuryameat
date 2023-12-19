// middleware/authMiddleware.js
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/jwt';
import { prisma } from '../config/prisma';

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication failed! Token not found' })
    const decoded = await verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: 'Authentication failed! User not found' })
    req.id = decoded.id;
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};


export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    console.log(token)
    if (!token) return res.status(401).json({ message: 'Authentication failed! Token not found' })
    const decoded = await verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.role !== 'admin') return res.status(401).json({ message: 'Authentication failed! User not found' })
    req.id = decoded.id;
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};

export const verifyAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication failed! Token not found' })
    const decoded = await verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.role !== 'agent') return res.status(401).json({ message: 'Authentication failed! User not found' })
    req.id = decoded.id;
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};

