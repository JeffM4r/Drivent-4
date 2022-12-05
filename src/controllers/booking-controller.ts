import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        const booking = await bookingService.getBookingId(userId)

        return res.status(httpStatus.OK).send({
            id: booking.id,
            Room: booking.Room
        });

    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;

    try {
        if (!roomId || typeof roomId === "string" || typeof roomId === "boolean") {
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
        
        const booking = await bookingService.insertBooking(userId, roomId)

        return  res.status(httpStatus.OK).send({bookingId:booking.id});

    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === "maxCapacityReachedError") {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        return res.sendStatus(httpStatus.FORBIDDEN);
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const newRoomId = req.body.roomId;
    const oldBookingId = Number(req.params.bookingId);
    
    try {
        if (!newRoomId || typeof newRoomId === "string" || typeof newRoomId === "boolean") {
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
        if (!oldBookingId || isNaN(oldBookingId)) {
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
       
        const booking = await bookingService.updatingBooking(userId, oldBookingId, newRoomId)

        return res.status(httpStatus.OK).send({bookingId:booking.id});

    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === "maxCapacityReachedError") {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        return res.sendStatus(httpStatus.FORBIDDEN);
    }
}