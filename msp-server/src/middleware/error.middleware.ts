import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Error de validación',
            errors: err.errors
        });
    }

    return res.status(500).json({
        message: 'Error interno del servidor'
    });
}; 