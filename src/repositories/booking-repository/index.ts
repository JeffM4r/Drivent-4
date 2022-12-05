import { prisma } from "@/config";

async function listBooking(userId: number) {
    return prisma.booking.findFirst({
        where: {
            userId: userId
        },
        include: {
            Room: true
        }
    })
}

async function listBookingById(id: number) {
    return prisma.booking.findFirst({
        where: {
            id: id
        },
        include: {
            Room: true
        }
    })
}

async function listAllBookings(roomId: number) {
    return prisma.booking.findMany({
        where: {
            roomId: roomId
        }
    })
}

async function findRoom(roomId: number) {
    return prisma.room.findFirst({
        where: {
            id: roomId
        }
    })
}

async function insertingBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId: userId,
            roomId: roomId
        }
    })
}

async function deleteBooking(bookingId:number) {
    return prisma.booking.delete({
        where:{
            id:bookingId
        }
    })
}

const bookingRepository = {
    listBooking,
    listAllBookings,
    findRoom,
    insertingBooking,
    deleteBooking,
    listBookingById
}

export default bookingRepository