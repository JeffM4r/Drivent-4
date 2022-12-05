import { notFoundError, maxCapacityReached, requestError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function getBookingId(userId: number) {
    const booking = await bookingRepository.listBooking(userId)

    if (!booking) {
        throw notFoundError();
    }

    return booking
}

async function insertBooking(userId: number, roomId: number) {
    const bookingsInserteds = await bookingRepository.listAllBookings(roomId)
    const room = await bookingRepository.findRoom(roomId)
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);    
    
    if (!room) {
        throw notFoundError();
    }

    if (!enrollment) {
        throw requestError(403, "Cannot find user enrrolment");
    }
    
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket) {
        throw requestError(403, "Cannot find user ticket");
    }

    if (ticket.status !== "PAID") {
        throw requestError(403, "ticket payment not finished");
    }
    
    if (ticket.TicketType.isRemote === true) {
        throw requestError(403, "this ticket is remote");
    }

    if (ticket.TicketType.includesHotel === false) {
        throw requestError(403, "this ticket does not include hotel");
    }

    if (bookingsInserteds.length === room.capacity || bookingsInserteds.length > room.capacity) {
        throw maxCapacityReached();
    }
    
    const insertedBooking = await bookingRepository.insertingBooking(userId, roomId)
    
    return insertedBooking
}

async function updatingBooking(userId: number, oldBookingId: number, newRoomId: number) {
    const bookingsInserteds = await bookingRepository.listAllBookings(newRoomId)
    const room = await bookingRepository.findRoom(newRoomId)
    const oldBooking = await bookingRepository.listBookingById(oldBookingId)

    if (!room) {
        throw notFoundError();
    }

    if (bookingsInserteds.length === room.capacity || bookingsInserteds.length > room.capacity) {
        throw maxCapacityReached();
    }  

    if (!oldBooking) {
        throw requestError(403, "Cannot find booking");
    }

    if (oldBooking.userId !== userId) {
        throw requestError(403, "Is not the user booking Id");
    }

    await bookingRepository.deleteBooking(oldBookingId)

    const insertedBooking = await bookingRepository.insertingBooking(userId, newRoomId)

    return insertedBooking
}

const bookingService = {
    getBookingId,
    insertBooking,
    updatingBooking
}

export default bookingService